import { drawMap } from "./map.js";
import { renderBarChart } from "./barchart.js";
import { renderScatterPlot } from "./scatterplot.js";


let data, geoData;

Promise.all([
  d3.csv("data/filtered_data1.csv"),
  d3.json("data/counties-10m.json")
]).then(([loadedData, loadedGeoData]) => {
  data = loadedData;
  geoData = loadedGeoData;

  setupDropdowns();

  // Initial render
  updateAttr1Visuals();
  updateAttr2Visuals();
});

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

  attr1Select.on("change", updateAttr1Visuals);
  attr2Select.on("change", updateAttr2Visuals);
}

function updateAttr1Visuals() {
  const attr1 = d3.select("#attribute1Select").property("value");
  const attr2 = d3.select("#attribute2Select").property("value");

  // Clear and redraw Map 1 + BarChart 1
  d3.select("#mapContainer1").html("");
  drawMap(data, geoData, "#mapContainer1", attr1);

  renderBarChart(data, attr1, attr2, "#barChartContainer1");
}

function updateAttr2Visuals() {
  const attr1 = d3.select("#attribute1Select").property("value");
  const attr2 = d3.select("#attribute2Select").property("value");

  // Clear and redraw Map 2 + BarChart 2
  d3.select("#mapContainer2").html("");
  drawMap(data, geoData, "#mapContainer2", attr2);

  renderBarChart(data, attr2, attr1, "#barChartContainer2");
  renderScatterPlot(data, attr1, attr2, "#scatterPlotContainer");

}
