const fs = require("fs");
const Papa = require("papaparse");
const { Item } = require("./item.js");

exports.ItemsList = function () {
  this.items = [];

  this.load = function (fileName) {
    csv = fs.readFileSync(fileName, "utf8");
    results = Papa.parse(csv);
    this.items = loadItems(results.data);
    this.itemsMap = mapItems(this.items);
  };

  this.findItem = function (sku) {
    return this.itemsMap.get(sku);
  };
};

function loadItems(data) {
  const nbRows = data.length;
  const firstRow = 1;
  const nbCols = data[0].length;
  const firstCol = 0;
  const items = [];

  for (let row = firstRow; row < nbRows; row++) {
    const sku = data[row][0];
    const type = data[row][1];
    const category = data[row][2];
    const name = data[row][3];
    const year_released = data[row][4];

    if (sku != "") {
      item = new Item(sku, type, name, category, year_released);
      items.push(item);
    }
  }

  return items;
}

function mapItems(items) {
  const map = new Map();

  for (var item of items) {
    map.set(item.sku, item);
  }

  return map;
}
