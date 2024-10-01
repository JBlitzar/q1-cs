// Sample data
let data;

d3.csv("superheroes.csv").then(function(data) {
    console.log(data); // Log the data to the console

    // Process the data (for example, convert numeric values)
    data.forEach(d => {
        const _attrs = ["Height", "Weight"]
        _attrs.forEach((a)=>{
            d[a] = +d[a];
        })
        
    });

    

// Select the SVG element
const svg = d3.select("svg");

// Create bars
svg.selectAll("rect") //selects all elements of rect, currently empty
    .data(data) // assigns data? idk
    .enter() // Enter the data in
    .append("circle") // Append rects for each
    .attr("cx", (d, i) => d.Height) // Position each bar, d is data and I is i
    .attr("cy", d => d.Weight) // Height of each bar
    .attr("width", (d, i) => 10) // Width of each bar
    .attr("r", d => 10) // Height from data
    .attr("fill", (d,i) => {if(d.Alignment == "good"){return "teal"};return "red"}); // Color

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

svg.selectAll("circle")
    .on("mouseover", function(event, d) {
        tooltip.style("visibility", "visible").text(d.name);
    })
    .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 10) + "px")
               .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
    });


    // Now you can use the data for visualizations
}).catch(function(error) {
    console.error('Error loading the CSV file:', error);
});

