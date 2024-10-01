// Sample data
const data = [
    { category: "A", value1: 30, value2: 200 },
    { category: "B", value1: 86, value2: 150 },
    { category: "C", value1: 168, value2: 250 },
    { category: "D", value1: 234, value2: 300 },
    { category: "E", value1: 90, value2: 50 },
];
;

// Select the SVG element
const svg = d3.select("svg");

// Create bars
svg.selectAll("rect") //selects all elements of rect, currently empty
    .data(data) // assigns data? idk
    .enter() // Enter the data in
    .append("rect") // Append rects for each
    .attr("x", (d, i) => i * 50) // Position each bar, d is data and I is i
    .attr("y", d => 400 - d.value2) // Height of each bar
    .attr("width", (d, i) => 10) // Width of each bar
    .attr("height", d => d.value2) // Height from data
    .attr("fill", (d,i) => {if(d.value1>= 100){return "teal"};return "red"}); // Color

// Just scales
const xScale = d3.scaleBand()
.domain(data.map((d, i) => i))
.range([0, 600])
.padding(0.1);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .range([400, 0]);

// Append X axis
svg.append("g")
    .attr("transform", "translate(0,400)")
    .call(d3.axisBottom(xScale));

// Append Y axis
svg.append("g")
    .call(d3.axisLeft(yScale));

// Most normal dom manipulation. 
const tooltip = d3.select("body") // selects body
.append("div") // adds div
.style("position", "absolute") // sets options for div
.style("visibility", "hidden")
.style("background", "lightgrey")
.text("");

svg.selectAll("rect")
    .on("mouseover", function(event, d) {
        tooltip.style("visibility", "visible").text(d.category);
    })
    .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
               .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
    });

