const fs = require("fs");
const Papa = require("papaparse");
const { Part } = require("./part.js");

exports.Catalog = function () {
  this.parts = [];

  this.load = function (fileName) {
    csv = fs.readFileSync(fileName, "utf8");
    results = Papa.parse(csv);
    this.parts = loadParts(results.data);
    this.partsMap = mapParts(this.parts);
  };

  this.findPart = function (number) {
    return this.partsMap.get(number);
  };
};

function loadParts(data) {
  const nbRows = data.length;
  const firstRow = 1;
  const nbCols = data[0].length;
  const firstCol = 0;
  const parts = [];

  for (let row = firstRow; row < nbRows; row++) {
    const categoryId = data[row][0];
    const categoryName = data[row][1];
    const number = data[row][2];
    const name = data[row][3];

    if (categoryId != "") {
      part = new Part(categoryId, categoryName, number, name);
      parts.push(part);
    }
  }

  return parts;
}

function mapParts(parts) {
  const map = new Map();

  for (var part of parts) {
    map.set(part.number, part);
  }

  return map;
}
