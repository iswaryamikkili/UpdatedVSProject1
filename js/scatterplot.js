function renderScatterPlot(dataset, attribute1, attribute2, containerSelector, onBrushCallback) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
  
    // Clear previous SVG and tooltip content
    d3.select(containerSelector).html("");
    d3.selectAll(containerSelector + " .tooltip").remove();
  
    const svg = d3.select(containerSelector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    const x = d3.scaleLinear()
      .range([0, width])
      .domain(d3.extent(dataset, d => +d[attribute1]));
  
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain(d3.extent(dataset, d => +d[attribute2]));
  
    d3.select(containerSelector).style("position", "relative");
    const tooltip = d3.select(containerSelector).append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "lightsteelblue")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", 10);
  
    let isBrushing = false;
  
    const dots = svg.selectAll(".dot")
      .data(dataset)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", d => x(+d[attribute1]))
      .attr("cy", d => y(+d[attribute2]))
      .style("fill", "#008080")
      .style("opacity", 0.7);
  
    function bindTooltip() {
      dots
        .on("mouseover", function (event, d) {
          if (isBrushing) return;
          tooltip.style("visibility", "visible")
            .html(`County: ${d["display_name"]}<br/>${attribute1}: ${d[attribute1]}<br/>${attribute2}: ${d[attribute2]}`)
            .style("left", (event.offsetX + 10) + "px")
            .style("top", (event.offsetY - 10) + "px");
        })
        .on("mousemove", function (event) {
          if (isBrushing) return;
          tooltip.style("left", (event.offsetX + 10) + "px")
            .style("top", (event.offsetY - 10) + "px");
        })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
        });
    }
  
    bindTooltip();
  
    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .style("text-anchor", "middle")
      .text(attribute1);
  
    svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .text(attribute2);
  
    const togglebox = document.querySelector("#togglebox");
  
    if (togglebox?.checked) {
      const brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("start", () => {
          isBrushing = true;
          tooltip.style("visibility", "hidden");
        })
        .on("end", ({ selection }) => {
          isBrushing = false;
          if (!selection) {
            onBrushCallback(null);
            return;
          }
  
          const [[x0, y0], [x1, y1]] = selection;
          const brushed = dataset.filter(d => {
            const cx = x(+d[attribute1]);
            const cy = y(+d[attribute2]);
            return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
          });
  
          onBrushCallback(brushed);
        });
  
      svg.append("g").call(brush);
    }
  }
  
export { renderScatterPlot };