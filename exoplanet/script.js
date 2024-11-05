var data = [];
var nodes = []
d3.csv("data.csv").then((d)=>{
    d.forEach((point)=>{
        if(point["pl_rade"]){
            data.push({
                r:point["pl_rade"],
                group: 1
            })
        }
    })

    console.log(data)
    data = data.slice(-100).map(Object.create)




    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    
    const nodes = data.map(Object.create);
    const simulation = d3.forceSimulation(nodes)
        .alphaTarget(0.3)
        .velocityDecay(0.1)
        .force("x", d3.forceX().strength(0.01))
        .force("y", d3.forceY().strength(0.01))
        .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3))
        .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 2 / 3))
        .on("tick", ticked);
    
    canvas.addEventListener("pointermove", pointermoved);
    canvas.addEventListener("touchmove", event => event.preventDefault());
    
    function pointermoved(event) {
        const [x, y] = d3.pointer(event);
        nodes[0].fx = x - width / 2;
        nodes[0].fy = y - height / 2;
    }
    
    function ticked() {
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(width / 2, height / 2);
        for (let i = 1; i < nodes.length; ++i) {
        const d = nodes[i];
        context.beginPath();
        context.moveTo(d.x + d.r, d.y);
        context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
        context.fillStyle = color(d.group);
        context.fill();
        }
        context.restore();
    }
    
    window.addEventListener("unload", () => simulation.stop());

})

function $(s){
    var a = document.querySelectorAll(s);
    return a.length > 0 ? a : a[0];
}


