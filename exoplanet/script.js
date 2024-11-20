let data = [];
let simulation;
let lastClickedItem = null;
let scale = null;
let scaleKey = "pl_eqt";
let useLog = true;
let colorType = "none";

function getRandomItems(array, numItems) {
  return array.sort(() => Math.random() - 0.5).slice(0, numItems);
}

function $(selector) {
  const elements = document.querySelectorAll(selector);
  return elements.length > 1 ? elements : elements[0];
}

function getScale() {
  colorType = $("#color").value;
  var o = {
    temp: "pl_eqt",
    dist: "sy_dist",
    none: null,
    spectral: "st_spectype",
    method: "discoverymethod",
    year: "disc_year",
  };
  scaleKey = o[colorType];

  if (!scaleKey) {
    return () => "#ccc";
  }

  // Don't ask
  const uniqueValues = Array.from(
    new Set(data.map((d) => d["attrs"][scaleKey]))
  );
  // silly qualitative check
  if (uniqueValues.every((val) => isNaN(+val))) {
    return d3.scaleOrdinal().domain(uniqueValues).range(d3.schemeCategory10);
  } else {
    const valueExtent = d3.extent(data, (d) => +d["attrs"][scaleKey]);
    return d3
      .scaleSequential()
      .domain(valueExtent)
      .interpolator(d3.interpolateRgbBasis(["#7c9fbf", "#4e769c", "#294f73"]));
  }
}

function getR(d) {
  const maxRadius = Math.max(...data.map((dd) => +dd.r || 0));
  const r = Math.abs(d.r) + 1;

  const baseScale = 50;
  const logScale = baseScale / 2;

  return useLog
    ? (logScale * Math.log(r)) / Math.log(maxRadius)
    : (baseScale * r) / maxRadius;
}

function onColorChange() {
  scale = getScale();
  d3.selectAll("circle").attr("fill", (d) => scale(+d["attrs"][scaleKey]));
}

function onLogChange() {
  useLog = $("#log").checked;
  simulation
    .force(
      "collide",
      d3
        .forceCollide()
        .radius((d) => getR(d) + 1)
        .iterations(3)
    )
    .alpha(1)
    .restart();
}

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "label")
  .style("visibility", "hidden")
  .text("");

function updateSidebar(d) {
  const plusMinus = (attr) =>
    `${(+d.attrs[attr]).toFixed(2)}±${Math.max(
      +d.attrs[`${attr}err1`],
      +d.attrs[`${attr}err2`]
    ).toFixed(2)}`;

  $("#i_name").innerText = d.attrs.pl_name;
  $("#i_host").innerText = `Host: ${d.attrs.hostname}`;
  $(
    "#i_discovery"
  ).innerText = `Discovered in ${d.attrs.disc_year} with ${d.attrs.discoverymethod}`;
  $("#i_orbit").innerText = `Orbits every ${plusMinus("pl_orbper")} days`;
  $("#i_radius").innerText = `Radius: ${plusMinus("pl_rade")} Earth radii`;
  $("#i_temp").innerText = `Temperature: ${plusMinus("pl_eqt")} Kelvin`;
  $("#i_spec").innerText = `Spectral type: ${
    d.attrs.st_spectype ? d.attrs.st_spectype : "<blank>"
  }`;
  $("#i_ref").innerHTML = `Reference: ${d.attrs.pl_refname}`;
  $("#i_dist").innerText = `Distance from Earth: ${plusMinus("sy_dist")} pc`;
}

function onCircleClick(event, d) {
  if (!$("#sidebar").classList.contains("on-screen")) {
    $("#sidebar").classList.add("on-screen");
  } else if (d === lastClickedItem) {
    $("#sidebar").classList.remove("on-screen");
  }

  lastClickedItem = d;
  updateSidebar(d);
}

function setupSimulation(nodes, svg, width, height) {
  simulation = d3
    .forceSimulation(nodes)
    .alphaTarget(0.3)
    .velocityDecay(0.1)
    .force("x", d3.forceX().strength(0.01))
    .force("y", d3.forceY().strength(0.01))
    .force(
      "collide",
      d3
        .forceCollide()
        .radius((d) => getR(d) + 1)
        .iterations(3)
    )
    .on("tick", () => {
      svg
        .selectAll("circle")
        .attr("cx", (d) => width / 2 + d.x)
        .attr("cy", (d) => height / 2 + d.y)
        .attr("r", (d) => getR(d));
    });

  svg.on("pointermove", (event) => {
    const [x, y] = d3.pointer(event);
  });

  window.addEventListener("unload", () => simulation.stop());
}

function createVisualization() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = d3.select("svg").attr("width", width).attr("height", height);
  const nodes = data.map(Object.create);

  scale = getScale();

  const circles = svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("fill", (d) => (scale ? scale(+d.attrs[scaleKey]) : "#999"))
    .on("mouseover", (event, d) =>
      tooltip
        .style("visibility", "visible")
        .text(d.name)
        .style("top", `${event.pageY - 10}px`)
        .style("left", `${event.pageX + 10}px`)
    )
    .on("mousemove", (event) => {
      tooltip
        .style("top", `${event.pageY - 10}px`)
        .style("left", `${event.pageX + 10}px`);
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"))
    .on("click", onCircleClick);

  setupSimulation(nodes, svg, width, height);
}

function onDataLoaded(dataset) {
  data = dataset
    .filter((point) => +point.pl_rade)
    .map((point) => ({
      r: +point.pl_rade,
      group: 1,
      name: point.pl_name,
      attrs: point,
    }));
  data = getRandomItems(data, 200);

  createVisualization();
}

$("#color").addEventListener("change", onColorChange);
$("#log").addEventListener("change", onLogChange);
$("#reset").onclick = function () {
  if (simulation) {
    simulation.stop();
  }

  d3.select("svg").selectAll("*").remove();

  data.length = 0;

  onDataLoaded(window._data);
};

d3.csv("data.csv").then((dataset) => {
  window._data = dataset;
  onDataLoaded(dataset);
});
