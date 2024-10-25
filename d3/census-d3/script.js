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
function getSim() {
  simdata = [...data];
  simdata.forEach((d) => {
    d.x = +d.lat;
    d.y = +d.lon;
  });
  return (
    d3
      .forceSimulation(simdata)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      .force(
        "dx",
        d3
          .forceX((d) => {
            return d.getTarget(t)[0];
          })
          .strength(0.01)
      )
      .force(
        "dy",
        d3
          .forceY((d) => {
            return d.getTarget(t)[1];
          })
          .strength(0.01)
      )

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
        update();
      })
  ); // 'ticked' updates the rendering of nodes}
}
d3.csv("census.csv")
  .then((loadedData) => {
    loadedData.forEach((element) => {
      let p = new Person(element);
      if (p.isGood) {
        data.push(p);
      }
    });
    simulation = getSim();

    map.on("viewreset", update);
    map.on("move", update);
    update();
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
  
  d3.selectAll("circle")
    .on("mouseover", function(event, d) {
        tooltip.style("visibility", "visible").text("asdlfkjhasdflkhjasd");
    })
    .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
    });
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
    .attr("fill", (d) => d.fill)
    .merge(circles)
    .attr("cx", (d) => projectPoint(d)[0])
    .attr("cy", (d) => projectPoint(d)[1])
    .attr("stroke", "green")
    .attr("stroke-width", (d)=>d.strokeWeight/d.r);
  

  //circles.exit().remove();
  



  simdata = [...data];
    simdata.forEach((d) => {
      d.x = +d.lat;
      d.y = +d.lon;
    });
    simulation.nodes(simdata)


}

const t = new Date();
t.setHours(5);
t.setMinutes(0);
function moveForwardInTime() {
  t.setMinutes(t.getMinutes() + 1);
  document.getElementById("time").innerText = t.toString();
  if(t.getMinutes() % 15 == 0){
    
      //simulation = getSim();

  }
}
document.getElementById("start").onclick = function(){
  setInterval(moveForwardInTime, 100);
}

setInterval(update, 20);

const tooltip = d3.select("body") // selects body
  .append("div") // adds div
  .style("position", "absolute") // sets options for div
  .style("visibility", "hidden")
  .style("background", "lightgrey")
  .text("");

  


