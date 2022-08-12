const fs = require("fs");
const Papa = require("papaparse");
const { Color } = require("./color.js");

exports.Palette = function () {
  this.colors = [];

  this.load = function (fileName) {
    csv = fs.readFileSync(fileName, "utf8");
    results = Papa.parse(csv);
    this.colors = loadColors(results.data);
    this.colorsMap = mapColors(this.colors);
  };

  this.findColor = function (id) {
    return this.colorsMap.get(id);
  };
};

function loadColors(data) {
  const nbRows = data.length;
  const firstRow = 1;
  const nbCols = data[0].length;
  const firstCol = 0;
  const colors = [];

  for (let row = firstRow; row < nbRows; row++) {
    const id = data[row][0];
    const name = data[row][1];

    if (id != "" && id != "0") {
      color = new Color(id, name);
      colors.push(color);
    }
  }

  return colors;
}

function mapColors(colors) {
  const map = new Map();

  for (var color of colors) {
    map.set(color.id, color);
  }

  return map;
}
