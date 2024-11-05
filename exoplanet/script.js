var data = [];
d3.csv("data.csv").then((d) => {
    d.forEach((point) => {
        if (point["pl_rade"]) {
            data.push({
                r: point["pl_rade"],
                group: 1
            });
        }
    });

    console.log(data);
    data = data.slice(-100).map(Object.create);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

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

    svg.on("pointermove", pointermoved);

    function pointermoved(event) {
        const [x, y] = d3.pointer(event);
        nodes[0].fx = x - width / 2;
        nodes[0].fy = y - height / 2;
    }

    const circles = svg.selectAll("circle")
        .data(nodes.slice(1))
        .enter().append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => color(d.group));

    function ticked() {
        circles
            .attr("cx", d => width / 2 + d.x)
            .attr("cy", d => height / 2 + d.y);
    }

    window.addEventListener("unload", () => simulation.stop());
});
