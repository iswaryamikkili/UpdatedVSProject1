// ✅ Add this BEFORE drawMap
const attributeMeta = {
  median_household_income: {
    label: "Median Household Income",
    format: "currency",
    unit: "($)"
  },
  poverty_perc: {
    label: "Poverty Percentage",
    format: "percentage",
    unit: "(%)"
  },
  percent_no_heath_insurance: {
    label: "No Health Insurance",
    format: "percentage",
    unit: "(%)"
  },
  percent_high_blood_pressure: {
    label: "High Blood Pressure",
    format: "percentage",
    unit: "(%)"
  },
  education_less_than_high_school_percent: {
    label: "Less than High School Education",
    format: "percentage",
    unit: "(%)"
  }
};

function formatValue(value, formatType) {
  if (formatType === "currency") {
    return `$${(+value).toLocaleString()}`;
  } else if (formatType === "percentage") {
    return `${(+value).toFixed(1)}%`;
  }
  return value;
}

export function drawMap(data, geoData, mapContainerId, attribute) {
  const width = 960, height = 600;

  const svg = d3.select(mapContainerId).append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoAlbersUsa().scale(1280).translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);

  const colorScale = d3.scaleSequential(d3.interpolateOranges);

  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  const idToData = Object.fromEntries(data.map(d => [d.cnty_fips.padStart(5, '0'), d]));

  function update(attribute) {
    const values = data.map(d => +d[attribute]);
    colorScale.domain([d3.min(values), d3.max(values)]);

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
          const meta = attributeMeta[attribute] || {};
          tooltip.html(`${record.display_name}<br>${meta.label || attribute.replace(/_/g, ' ')}: ${formatValue(record[attribute], meta.format)}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        }
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    renderLegend(colorScale, attribute);
  }

  function renderLegend(colorScale, attribute) {
    const legendWidth = 300;
    const legendHeight = 10;

    svg.selectAll(".legend").remove();
    svg.select("#legend-gradient").remove();

    const meta = attributeMeta[attribute] || {};
    const format = meta.format || null;
    const label = meta.label || attribute.replace(/_/g, " ");
    const unit = meta.unit || "";

    const legendSvg = svg.selectAll(".legend").data([colorScale]).join("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - legendWidth - 40}, ${height - 40})`);

    const legendLinear = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendLinear)
      .ticks(5)
      .tickFormat(d => formatValue(d, format));

    const defs = svg.append("defs");
    const linearGradient = defs.append("linearGradient").attr("id", "legend-gradient");

    linearGradient.selectAll("stop")
      .data(colorScale.range().map((color, i) => ({
        offset: `${(i / (colorScale.range().length - 1)) * 100}%`,
        color: color
      })))
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    legendSvg.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    legendSvg.append("g")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis);

    legendSvg.append("text")
      .attr("x", legendWidth / 2)
      .attr("y", legendHeight + 30)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text(`${label} ${unit}`);
  }

  update(attribute);
}
