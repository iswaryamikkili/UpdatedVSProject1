function renderScatterPlot(dataset, attribute1, attribute2, containerId) {
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Clear previous content
    const svg = d3.select(containerId).html("").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(dataset, d => +d[attribute1])]);

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(dataset, d => +d[attribute2])]);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "lightsteelblue")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("pointer-events", "none");

    // Dots
    svg.selectAll(".dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", d => x(+d[attribute1]))
        .attr("cy", d => y(+d[attribute2]))
        .style("fill", "cornflowerblue")
        .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible")
                .html(`Name: ${d["display_name"]}<br/>${attribute1}: ${d[attribute1]}<br/>${attribute2}: ${d[attribute2]}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 35)
        .style("text-anchor", "middle")
        .text(attribute1);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -35)
        .style("text-anchor", "middle")
        .text(attribute2);
}

export { renderScatterPlot };
