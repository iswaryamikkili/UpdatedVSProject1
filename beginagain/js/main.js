// import { drawMap } from './map.js';
// import { renderBarChart } from './barchart.js';  // Import the renderBarChart function

// d3.csv("data/filtered_data1.csv").then(data => {
//   d3.json("data/counties-10m.json").then(geoData => {
//     // Draw maps
//     drawMap(data, geoData, "#map1", "#attributeSelect1");
//     drawMap(data, geoData, "#map2", "#attributeSelect2");

//     renderBarChart(data, 'attribute1ForChart1', 'attribute2ForChart1', '#barChartContainer1');

//     // Bar chart 2
//     renderBarChart(data, 'attribute1ForChart2', 'attribute2ForChart2', '#barChartContainer2');
// });
// });


import { drawMap } from "./map.js";
import { renderBarChart } from "./barchart.js";

// Assume you already loaded this data beforehand
let data, geoData;

Promise.all([
  d3.csv("data/filtered_data1.csv"),         // contains county data
  d3.json("data/counties-10m.json")  // map geometry
]).then(([loadedData, loadedGeoData]) => {
  data = loadedData;
  geoData = loadedGeoData;

  setupDropdowns();
  updateVisualizations(); // initial render
});

function setupDropdowns() {
  const attributes = Object.keys(data[0]).slice(2); // adjust slice as needed

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

  attr1Select.on("change", updateVisualizations);
  attr2Select.on("change", updateVisualizations);
}

function updateVisualizations() {
  const attr1 = d3.select("#attribute1Select").property("value");
  const attr2 = d3.select("#attribute2Select").property("value");

  // Update maps
  d3.select("#mapContainer1").html("");  // clear before redraw
  d3.select("#mapContainer2").html("");

  drawMap(data, geoData, "#mapContainer1", attr1);
  drawMap(data, geoData, "#mapContainer2", attr2);

  // Update bar charts
  renderBarChart(data, attr1, attr2, "#barChartContainer1");
renderBarChart(data, attr2, attr1, "#barChartContainer2"); // reverse for variation
}