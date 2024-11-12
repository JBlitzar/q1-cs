var data = [];
var useLog = false;
var simulation;
var last_clicked_item;
function getRandomItems(array, numItems) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
}
function $(s) {
  var a = document.querySelectorAll(s);
  return a.length > 1 ? a : a[0];
}
$("#log").addEventListener("change", function () {
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
});

function getR(d) {
  mr = Math.max.apply(Math,
    data.map((dd) => +dd.r ? +dd.r : 0).filter(function (value) {
      return !Number.isNaN(value);
  })
  )
  
  

  r =  (Math.abs(d.r) + 1);

  const k = 50
  const l_k = k /2;
  
  return useLog ? l_k * Math.log(r) / Math.log(mr) : k * r / mr;
}
const normalizeRValues = (objects) =>
  objects.map(
    ({ r }) =>
      ((r - Math.min(...objects.map((o) => o.r))) /
        (Math.max(...objects.map((o) => o.r)) -
          Math.min(...objects.map((o) => o.r)))) *
      200
  );

const tooltip = d3
  .select("body") // selects body
  .append("div") // adds div
  .attr("class", "label") // sets options for div
  .style("visibility", "hidden")
  .text("");
d3.csv("data.csv").then((d) => {
  d.forEach((point) => {
    if (+point["pl_rade"]) {
      data.push({
        r: point["pl_rade"],
        group: 1,
        name: point["pl_name"],
        attrs: point
      });
    }
  });

  console.log(data);
  data = getRandomItems(data, 200).map(Object.create);

  const width = window.innerWidth;
  const height = window.innerHeight;

  const svg = d3.select("svg").attr("width", width).attr("height", height);

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  const nodes = data.map(Object.create);

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
    .force(
      "charge",
      d3.forceManyBody().strength((d, i) => (i ? 0 : 0))
    ) //-width * 2 / 3))
    .on("tick", ticked);

  svg.on("pointermove", pointermoved);

  function pointermoved(event) {
    const [x, y] = d3.pointer(event);
    // nodes[0].fx = x - width / 2;
    // nodes[0].fy = y - height / 2;
  }

  const circles = svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", (d) => color(d.group));

  function ticked() {
    circles
      .attr("cx", (d) => width / 2 + d.x)
      .attr("cy", (d) => height / 2 + d.y)
      .attr("r", (d) => getR(d))
      .on("mouseover", function (event, d) {
        tooltip.style("visibility", "visible").text(d["name"] + "");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      })
      .on("click", function(event, d){
        function plus_minus(d,attr){
          return `${(+d["attrs"][attr]).toFixed(2)}±${Math.max(d["attrs"][attr+"err1"], d["attrs"][attr+"err2"]).toFixed(2)}`
        }

        if(d != last_clicked_item && $("#sidebar").classList.contains("on-screen")){
          //lol
        }else if(
          d != last_clicked_item && !$("#sidebar").classList.contains("on-screen")
        ){
          $("#sidebar").classList.add('on-screen');
        }else if (
          d == last_clicked_item && $("#sidebar").classList.contains("on-screen")
        ){
          $("#sidebar").classList.remove('on-screen');
        }

        last_clicked_item = d;
        


        $("#i_name").innerText = d["attrs"]["pl_name"];
        $("#i_host").innerText = `Host: ${d["attrs"]["hostname"]}`;
        $("#i_discovery").innerText = `Discovered by ${d["attrs"]["disc_facility"]} in ${d["attrs"]["disc_year"]} with ${d["attrs"]["discoverymethod"]}`;
        $("#i_orbit").innerText = `Orbits every ${plus_minus(d,"pl_orbper")} days`;
        $("#i_radius").innerText = `Radius: ${plus_minus(d,"pl_rade")} Earth radii`;
        $("#i_temp").innerText = `Temperature: ${plus_minus(d,"pl_eqt")} Kelvin`;
      })
  }

  window.addEventListener("unload", () => simulation.stop());
});
