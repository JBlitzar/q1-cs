var data = [];
var nodes = []
d3.csv("data.csv").then((d)=>{
    d.forEach((point)=>{
        if(point["pl_rade"]){
            data.push(point)
        }
    })

    console.log(data)
    nodes = data.slice(-100)//.map(Object.create)

    const simulation = d3.forceSimulation(nodes)
    .alphaTarget(0.3) // stay hot
    .velocityDecay(0.1) // low friction
    .force("x", d3.forceX().strength(0.01))
    .force("y", d3.forceY().strength(0.01))
    .force("collide", d3.forceCollide().radius((d) =>{return 100}).iterations(3))
    //.force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 2 / 3))
    .on("tick", ticked);

})
const svg = d3.select("svg");

function $(s){
    var a = document.querySelectorAll(s);
    return a.length > 0 ? a : a[0];
}



var ticked = function(){
    console.log(nodes)
    svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("x", (d, i) => d.x * 20 ) 
    .attr("y", d => d.y * 20) 
    .attr("r", (d, i) => d["pl_rade"] ? +d["pl_rade"]: 0)
    .attr("fill", (d,i) => {if(d["pl_rade"]>= 100){return "teal"};return "red"}); // Color

    svg.selectAll("circle").exit().remove()
}
