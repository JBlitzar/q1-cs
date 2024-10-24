const map = L.map("map").setView([37.560847, -122.381696], 9);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const svgLayer = d3.select(map.getPanes().overlayPane).append("svg");
const g = svgLayer.append("g").attr("class", "leaflet-zoom-hide");
let data = [new Point(37.560847, -122.381696)];
d3.csv("census.csv")
  .then((loadedData) => {
    loadedData.forEach((element) => {
      let p = new Person(element);
      if (p.isGood) {
        data.push(p);
      }
    });
    map.on("viewreset", update);
    map.on("move", update);
    update();
    data.forEach((d) => {
      d.x = d.lon; // Alias x to lon
      d.y = d.lat; // Alias y to lat
    });

    const simulation = d3
      .forceSimulation(data)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      .force("dx", d3.forceX().strength(0.01))
      .force("dy", d3.forceY().strength(0.01))
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d) => d.r + 1)
          .iterations(3)
      )
      // .force("customForce", function () {
      //   data.forEach((d, i) => {
      //     if (i !== 0) {
      //       const target = data[0];
      //       const strength = 0.1;

      //       const dlat = target.lat - d.lat;
      //       const dlon = target.lon - d.lon;
      //       if (dlat && dlon) {
      //         // console.log(dlat);
      //         // console.log(dlon);
      //         // alert();
      //         d.lat += dlat * strength;
      //         d.lon += dlon * strength;
      //       }
      //     }
      //   });
      // })
      .on("tick", update); // 'ticked' updates the rendering of nodes
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
  data.forEach((d) => {
    if (d.x && d.y) {
      d.lon = d.x; // Sync x to lon
      d.lat = d.y; // Sync y to lat
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
