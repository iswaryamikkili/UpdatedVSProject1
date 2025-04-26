function renderBoxPlot(dataset, attribute, containerSelector) {
  const margin = { top: 40, right: 30, bottom: 40, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Clear previous content
  const svg = d3.select(containerSelector).html("").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const values = dataset.map(d => +d[attribute]).sort(d3.ascending);

  const q1 = d3.quantile(values, 0.25);
  const median = d3.quantile(values, 0.5);
  const q3 = d3.quantile(values, 0.75);
  const iqr = q3 - q1;
  const min = d3.max([d3.min(values), q1 - 1.5 * iqr]);
  const max = d3.min([d3.max(values), q3 + 1.5 * iqr]);

  const y = d3.scaleLinear()
    .domain([min, max])
    .range([height, 0]);

  const x = d3.scaleBand()
    .range([0, width])
    .domain([attribute])
    .padding(0.5);

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "boxplot-tooltip")
    .style("position", "absolute")
    .style("display", "none")
    .style("padding", "6px")
    .style("background", "lightsteelblue")
    .style("border-radius", "4px")
    .style("font-size", "12px");

  function showTooltip(event, text) {
    tooltip
      .html(text)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 28) + "px")
      .style("display", "block");
  }

  function hideTooltip() {
    tooltip.style("display", "none");
  }

  // Box
  svg.append("rect")
    .attr("x", x(attribute))
    .attr("y", y(q3))
    .attr("height", y(q1) - y(q3))
    .attr("width", x.bandwidth())
    .attr("stroke", "black")
    .attr("fill", "lightsteelblue")
    .on("mouseover", (event) => showTooltip(event, `Q1: ${q1}<br>Q3: ${q3}<br>IQR: ${iqr}`))
    .on("mouseout", hideTooltip);

  // Median line
  svg.append("line")
    .attr("x1", x(attribute))
    .attr("x2", x(attribute) + x.bandwidth())
    .attr("y1", y(median))
    .attr("y2", y(median))
    .attr("stroke", "black")
    .on("mouseover", (event) => showTooltip(event, `Median: ${median}`))
    .on("mouseout", hideTooltip);

  // Whiskers and min/max
  svg.append("line")
    .attr("x1", x(attribute) + x.bandwidth() / 2)
    .attr("x2", x(attribute) + x.bandwidth() / 2)
    .attr("y1", y(min))
    .attr("y2", y(max))
    .attr("stroke", "black");

  svg.append("line")
    .attr("x1", x(attribute) + x.bandwidth() / 4)
    .attr("x2", x(attribute) + x.bandwidth() * 3 / 4)
    .attr("y1", y(max))
    .attr("y2", y(max))
    .attr("stroke", "black")
    .on("mouseover", (event) => showTooltip(event, `Max: ${max}`))
    .on("mouseout", hideTooltip);

  svg.append("line")
    .attr("x1", x(attribute) + x.bandwidth() / 4)
    .attr("x2", x(attribute) + x.bandwidth() * 3 / 4)
    .attr("y1", y(min))
    .attr("y2", y(min))
    .attr("stroke", "black")
    .on("mouseover", (event) => showTooltip(event, `Min: ${min}`))
    .on("mouseout", hideTooltip);

  // Y axis
  svg.append("g").call(d3.axisLeft(y));

  // X axis
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -5)
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text(`Boxplot of ${attribute.replace(/_/g, " ")}`);
}

export { renderBoxPlot };
