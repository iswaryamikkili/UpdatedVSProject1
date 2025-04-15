// main.js
import { drawMap } from './map.js';

d3.csv("data/filtered_data1.csv").then(data => {
  d3.json("data/counties-10m.json").then(geoData => {
    drawMap(data, geoData);
  });
});
