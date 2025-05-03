import { drawMap } from "./map.js";
import { renderBarChart } from "./barchart.js";
import { renderScatterPlot } from "./scatterplot.js";
import { renderBoxPlot } from "./boxplot.js";

let data, geoData;

Promise.all([
  d3.csv("data/filtered_data1.csv"),
  d3.json("data/counties-10m.json")
]).then(([loadedData, loadedGeoData]) => {
  data = loadedData;
  geoData = loadedGeoData;

  setupDropdowns();
  setupDropdown(); // for boxplot
  setupBrushToggle(); // brushing toggle event

  // Initial render
  updateAttr1Visuals();
  updateAttr2Visuals();
});

function setupDropdown() {
  const attributes = Object.keys(data[0]).slice(2);
  const dropdown = d3.select("#dropdownButton");

  dropdown.selectAll("option")
    .data(attributes)
    .enter()
    .append("option")
    .text(d => d.replace(/_/g, " "))
    .attr("value", d => d);

  dropdown.on("change", function () {
    const selectedAttribute = d3.select(this).property("value");
    if (selectedAttribute) {
      renderBoxPlot(data, selectedAttribute, "#boxplotArea");
    }
  });
}

function setupDropdowns() {
  const attributes = Object.keys(data[0]).slice(2);

  const attr1Select = d3.select("#attribute1Select");
  const attr2Select = d3.select("#attribute2Select");

  attr1Select.selectAll("option")
    .data(attributes)
    .enter()
    .append("option")
    .text(d => d.replace(/_/g, " "))
    .attr("value", d => d);

  attr2Select.selectAll("option")
    .data(attributes)
    .enter()
    .append("option")
    .text(d => d.replace(/_/g, " "))
    .attr("value", d => d);

  attr1Select.on("change", () => {
    updateAttr1Visuals();
    updateAttr2Visuals();
  });

  attr2Select.on("change", () => {
    updateAttr1Visuals();
    updateAttr2Visuals();
  });
}

function setupBrushToggle() {
  d3.select("#togglebox").on("change", () => {
    updateAttr1Visuals();
    updateAttr2Visuals();
  });
}

function updateAttr1Visuals() {
  const attr1 = d3.select("#attribute1Select").property("value");
  const attr2 = d3.select("#attribute2Select").property("value");
  const enableBrushing = d3.select("#togglebox").property("checked");

  d3.select("#mapContainer1").html("");
  drawMap(data, geoData, "#mapContainer1", attr1);
  renderBarChart(data, attr1, "#barChartContainer1");

  renderScatterPlot(data, attr1, attr2, "#scatterPlotContainer", brushedData => {
    updateAllVisuals(brushedData || data);
  }, enableBrushing);
}

function updateAttr2Visuals() {
  const attr1 = d3.select("#attribute1Select").property("value");
  const attr2 = d3.select("#attribute2Select").property("value");
  const enableBrushing = d3.select("#togglebox").property("checked");

  d3.select("#mapContainer2").html("");
  drawMap(data, geoData, "#mapContainer2", attr2);
  renderBarChart(data, attr2, "#barChartContainer2");

  renderScatterPlot(data, attr1, attr2, "#scatterPlotContainer", brushedData => {
    updateAllVisuals(brushedData || data);
  }, enableBrushing);
}

function updateAllVisuals(filteredData) {
  const attr1 = d3.select("#attribute1Select").property("value");
  const attr2 = d3.select("#attribute2Select").property("value");

  d3.select("#mapContainer1").html("");
  drawMap(filteredData, geoData, "#mapContainer1", attr1);
  renderBarChart(filteredData, attr1, "#barChartContainer1");

  d3.select("#mapContainer2").html("");
  drawMap(filteredData, geoData, "#mapContainer2", attr2);
  renderBarChart(filteredData, attr2, "#barChartContainer2");

  renderBoxPlot(filteredData, attr2, "#boxplotArea");
}
