// function renderScatterPlot(dataset, attribute1, attribute2, containerSelector, onBrushCallback) {
//     const margin = { top: 20, right: 20, bottom: 30, left: 40 };
//     const width = 800 - margin.left - margin.right;
//     const height = 800 - margin.top - margin.bottom;
  
//     // Clear any previous SVG content
//     const svg = d3.select(containerSelector).html("").append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);
  
//     // Define x and y scales based on the selected attributes
//     const x = d3.scaleLinear()
//       .range([0, width])
//       .domain(d3.extent(dataset, d => +d[attribute1]));
  
//     const y = d3.scaleLinear()
//       .range([height, 0])
//       .domain(d3.extent(dataset, d => +d[attribute2]));
  
//     // Create Tooltip element (hidden by default)
//     const tooltip = d3.select(containerSelector).append("div")
//       .attr("class", "tooltip")
//       .style("position", "absolute")
//       .style("visibility", "hidden")
//       .style("background-color", "lightsteelblue")
//       .style("padding", "5px")
//       .style("border-radius", "5px")
//       .style("font-size", "12px")
//       .style("pointer-events", "none");
  
//     // Create the scatter plot circles
//     svg.selectAll(".dot")
//       .data(dataset)
//       .enter().append("circle")
//       .attr("class", "dot")
//       .attr("r", 4)
//       .attr("cx", d => x(+d[attribute1]))
//       .attr("cy", d => y(+d[attribute2]))
//       .style("fill", "#008080")
//       .style("opacity", 0.7)
//       // Show tooltip on mouseover
//       .on("mouseover", function(event, d) {
//         tooltip.style("visibility", "visible")
//           .html("Name: " + d["display_name"] + "<br/>" + 
//                 attribute1 + ": " + d[attribute1] + "<br/>" + 
//                 attribute2 + ": " + d[attribute2])
//           .style("left", (event.pageX -10) + "px")
//           .style("top", (event.pageY + 10) + "px");
//       })
//       // Hide tooltip on mouseout
//       .on("mouseout", function() {
//         tooltip.style("visibility", "hidden");
//       });
  
//     // Add x-axis
//     svg.append("g")
//       .attr("transform", `translate(0,${height})`)
//       .call(d3.axisBottom(x))
//       .append("text")
//       .attr("x", width / 2)
//       .attr("y", 25)
//       .style("text-anchor", "middle")
//       .text(attribute1); // Label for x-axis
  
//     // Add y-axis
//     svg.append("g")
//       .call(d3.axisLeft(y))
//       .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", -35)
//       .attr("x", -height / 2)
//       .style("text-anchor", "middle")
//       .text(attribute2); // Label for y-axis
  
//     // Brushing functionality
//     const brush = d3.brush()
//       .extent([[0, 0], [width, height]])
//       .on("end", ({ selection }) => {
//         if (!selection) {
//           onBrushCallback(null); // Clear the brush filter
//           return;
//         }
  
//         const [[x0, y0], [x1, y1]] = selection;
//         const brushed = dataset.filter(d => {
//           const cx = x(+d[attribute1]);
//           const cy = y(+d[attribute2]);
//           return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
//         });
  
//         onBrushCallback(brushed); // Return the filtered counties
//       });
  
//     // Add brush to scatterplot
//     svg.append("g").call(brush);
//   }
  
//   export { renderScatterPlot };
  


function renderScatterPlot(dataset, attribute1, attribute2, containerSelector, onBrushCallback) {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
  
    // Clear any previous SVG content
    const svg = d3.select(containerSelector).html("").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Define x and y scales based on the selected attributes
    const x = d3.scaleLinear()
      .range([0, width])
      .domain(d3.extent(dataset, d => +d[attribute1]));
  
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain(d3.extent(dataset, d => +d[attribute2]));
  
    // Create Tooltip element (hidden by default)
    const tooltip = d3.select(containerSelector).append("div")
      .attr("class", "data-tooltip")  // Use the new class name
      .style("visibility", "hidden")  // Initially hidden
      .style("pointer-events", "none"); // Prevent tooltip from interfering with mouse events
  
    // Create the scatter plot circles
    svg.selectAll(".dot")
      .data(dataset)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", d => x(+d[attribute1]))
      .attr("cy", d => y(+d[attribute2]))
      .style("fill", "#008080")
      .style("opacity", 0.7)
      // Show tooltip on mouseover
      .on("mouseover", function(event, d) {
        const [mouseX, mouseY] = d3.pointer(event);  // Get mouse position
        tooltip.style("visibility", "visible")
          .html("Name: " + d["display_name"] + "<br/>" + 
                attribute1 + ": " + d[attribute1] + "<br/>" + 
                attribute2 + ": " + d[attribute2])
          .style("left", (mouseX + 10) + "px")  // Offset by 10px from mouseX
          .style("top", (mouseY + 10) + "px"); // Offset by 10px from mouseY
      })
      // Hide tooltip on mouseout
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
      });
  
    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 25)
      .style("text-anchor", "middle")
      .text(attribute1); // Label for x-axis
  
    // Add y-axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .text(attribute2); // Label for y-axis
  
    // Brushing functionality
    const brush = d3.brush()
      .extent([[0, 0], [width, height]])
      .on("end", ({ selection }) => {
        if (!selection) {
          onBrushCallback(null); // Clear the brush filter
          return;
        }
  
        const [[x0, y0], [x1, y1]] = selection;
        const brushed = dataset.filter(d => {
          const cx = x(+d[attribute1]);
          const cy = y(+d[attribute2]);
          return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
        });
  
        onBrushCallback(brushed); // Return the filtered counties
      });
  
    // Add brush to scatterplot
    svg.append("g").call(brush);
}
  
export { renderScatterPlot };
