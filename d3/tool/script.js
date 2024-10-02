const dropZone = d3.select("#drop-zone");
const svg = d3.select("svg");
const tooltip = d3.select(".tooltip");

let data = [];  // Store the data globally

dropZone.on("dragover", function(event) {
    event.preventDefault();
    d3.select(this).style("background", "#f0f0f0");
});

dropZone.on("dragleave", function() {
    d3.select(this).style("background", "#fff");
});

dropZone.on("drop", function(event) {
    event.preventDefault();
    document.getElementById("drop-zone").style="display:none";
    d3.select(this).style("background", "#fff");
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === "text/csv") {
            d3.csv(URL.createObjectURL(file)).then(loadedData => {
                data = loadedData;  // Store data globally
                document.getElementById("col-names").innerText += data.columns
                drawDotPlot();
            }).catch(error => {
                console.error('Error loading the CSV file:', error);
            });
        } else {
            alert("Please upload a valid CSV file.");
        }
    }
});

function drawDotPlot() {
    // Clear previous dots and axes
    svg.selectAll("circle").remove();
    svg.selectAll("g.axis").remove();

    // Create axes
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Height)])
        .range([0, 600]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Weight)])
        .range([400, 0]);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,400)")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));

    updateDots();  // Draw dots after creating axes
}

function updateDots() {
    console.log("update!")
    // Get user-defined attribute expressions
    const cxExpression = ()=>document.getElementById("cx-input").value;
    const cyExpression = ()=>document.getElementById("cy-input").value;
    const rExpression = ()=>document.getElementById("r-input").value;
    const fillExpression = ()=>document.getElementById("fill-input").value;
    const hoverExpression = ()=>document.getElementById("hover-input").value;

    document.getElementById("graph").innerHTML = "";

    // Create circles
    d3.select("svg").selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => eval(cxExpression()))
        .attr("cy", d => eval(cyExpression()))
        .attr("r", d => eval(rExpression()))
        .attr("fill", d => eval(fillExpression()))
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible").text(eval(hoverExpression()));
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                   .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });
}

// Update plot when button is clicked
document.getElementById("update-plot").addEventListener("click", updateDots);

// Handle casting to number
document.getElementById("cast-button").addEventListener("click", () => {
    const column = document.getElementById("cast-input").value;
    data.forEach(d => {
        if (d[column] !== undefined) {
            d[column] = +d[column];  // Cast to number
        }
    });
    alert(`Column "${column}" has been cast to numbers.`);
    
});

// Handle enumeration of qualitative columns
document.getElementById("enum-button").addEventListener("click", () => {
    const column = document.getElementById("enum-input").value;
    const uniqueValues = [...new Set(data.map(d => d[column]))];
    const enumMap = {};
    
    uniqueValues.forEach((value, index) => {
        enumMap[value] = index;
    });

    data.forEach(d => {
        if (d[column] !== undefined) {
            d[column] = enumMap[d[column]];  // Replace with enumeration
        }
    });
    
    alert(`Column "${column}" has been enumerated.`);
});
