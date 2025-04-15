export function drawMap(data, geoData) {
    const width = 960, height = 600;
    const svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);
  
    const projection = d3.geoAlbersUsa().scale(1280).translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    const attributes = Object.keys(data[0]).slice(2);
    const colorScale = d3.scaleSequential(d3.interpolateOranges);

    const select = d3.select("#attributeSelect");
    select.selectAll("option")
        .data(attributes)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d.replace(/_/g, " "));
  
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const idToData = Object.fromEntries(data.map(d => [d.cnty_fips.padStart(5, '0'), d]));
  
    function update(attribute) {
        const values = data.map(d => +d[attribute]);
        colorScale.domain([d3.min(values), d3.max(values)]);

        // Remove old map paths
        svg.selectAll("path")
            .data(topojson.feature(geoData, geoData.objects.counties).features)
            .join("path")
            .attr("d", path)
            .attr("fill", d => {
                const record = idToData[d.id];
                return record ? colorScale(+record[attribute]) : "#ccc";
            })
            .on("mouseover", (event, d) => {
                const record = idToData[d.id];
                if (record) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`${record.display_name}<br>${attribute.replace(/_/g, ' ')}: ${record[attribute]}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                }
            })
            .on("mouseout", () => {
                tooltip.transition().duration(500).style("opacity", 0);
            });
      
        // Call the function to render the legend
        renderLegend(colorScale);
    }

    // Function to render the legend
    function renderLegend(colorScale) {
        const legendWidth = 300;
        const legendHeight = 10;
    // Remove old legend (important!)
  svg.selectAll(".legend").remove();
  svg.select("#legend-gradient").remove();

    
        const legendSvg = svg.selectAll(".legend").data([colorScale]).join("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - legendWidth - 40}, ${height - 40})`);
    
        const legendLinear = d3.scaleLinear()
            .domain(colorScale.domain())
            .range([0, legendWidth]);
    
        const legendAxis = d3.axisBottom(legendLinear)
            .ticks(5)
            .tickFormat(d => `$${d.toLocaleString()}`);
    
        // Gradient for legend
        const defs = svg.append("defs");
    
        const linearGradient = defs.append("linearGradient")
            .attr("id", "legend-gradient");
    
        linearGradient.selectAll("stop")
            .data(colorScale.range().map((color, i) => ({
                offset: `${(i / (colorScale.range().length - 1)) * 100}%`,
                color: color
            })))
            .enter()
            .append("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);
    
        // Append gradient bar
        legendSvg.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#legend-gradient)");

        // Append axis
        legendSvg.append("g")
            .attr("transform", `translate(0, ${legendHeight})`)
            .call(legendAxis);
    }
  
    select.on("change", (event) => update(event.target.value));
    update(attributes[0]);
}