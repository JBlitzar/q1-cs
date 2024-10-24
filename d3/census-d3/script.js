const map = L.map("map").setView([37.560847, -122.381696], 10);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const svgLayer = d3.select(map.getPanes().overlayPane).append("svg");
const g = svgLayer.append("g").attr("class", "leaflet-zoom-hide");
let data = []; //[new Point(37.560847, -122.381696)];
let simdata;
let simulation;

d3.csv("census.csv")
  .then((loadedData) => {
    loadedData.forEach((element) => {
      let p = new Person(element);
      if (p.isGood) {
        data.push(p);
      }
    });
    simdata = [...data];
    map.on("viewreset", update);
    map.on("move", update);
    update();

    simdata.forEach((d) => {
      d.x = +d.lat;
      d.y = +d.lon;
    });

    simulation = d3
      .forceSimulation(simdata)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      //   .force(
      //     "dx",
      //     d3
      //       .forceX((d) => {
      //         d.getTarget(t)[0];
      //       })
      //       .strength(0.0006)
      //   )
      //   .force(
      //     "dy",
      //     d3
      //       .forceY((d) => {
      //         d.getTarget(t)[1];
      //       })
      //       .strength(0.0006)
      //   )

      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => d.r / 1000)
          .iterations(3)
      )
      //   .force("targeting", function () {
      //     simdata.forEach((d, i) => {
      //       const dx = d.getTarget(t)[0];
      //       -d.x;
      //       const dy = d.getTarget(t)[1];
      //       -d.y;

      //       d.x += dx / 10;
      //       d.y += dy / 10;
      //     });
      //   })
      .on("tick", () => {
        simulation.alpha(1).restart();
        update();
      }); // 'ticked' updates the rendering of nodes
  })
  .catch((error) => {
    console.error("Error loading the CSV file:", error);
  });

function projectPoint(d) {
  //console.log(d);
  const point = map.latLngToLayerPoint(new L.LatLng(d.lat, d.lon));
  return [point.x, point.y];
}

function update() {
  data.forEach((d, i) => {
    if (simdata[i].x && simdata[i].y) {
      d.lon = simdata[i].y;
      d.lat = simdata[i].x;
    }
  });
  //console.log("ud");
  const bounds = map.getBounds();
  const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
  const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

  svgLayer
    .attr("width", bottomRight.x - topLeft.x)
    .attr("height", bottomRight.y - topLeft.y)
    .style("left", topLeft.x + "px")
    .style("top", topLeft.y + "px");

  g.attr("transform", "translate(" + -topLeft.x + "," + -topLeft.y + ")");

  const circles = g.selectAll("circle").data(data);

  circles
    .enter()
    .append("circle")
    .attr("r", (d) => d.r)
    .attr("fill", "blue")
    .merge(circles)
    .attr("cx", (d) => projectPoint(d)[0])
    .attr("cy", (d) => projectPoint(d)[1]);

  circles.exit().remove();
}

const t = new Date();
t.setHours(5);
t.setMinutes(0);
function moveForwardInTime() {
  t.setMinutes(t.getMinutes() + 1);
  document.getElementById("time").innerText = t.toString();
}
setInterval(moveForwardInTime, 1);
setInterval(update, 20);
