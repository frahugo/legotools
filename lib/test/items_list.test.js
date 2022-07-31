const { assert, expect } = require("chai");
const should = require("chai").should();
const path = require("path");
const { ItemsList } = require("../src/itemsList.js");

describe("itemsList", function () {
  beforeEach(function () {
    const csv_file = path.resolve(path.join(__dirname, "fixtures/items.csv"));

    this.itemsList = new ItemsList();
    this.itemsList.load(csv_file);
  });

  context("loading itemsList", function () {
    it("should load items", function () {
      const items = this.itemsList.items;
      items.should.have.lengthOf(1);
      item = items[0];
      item.should.have.property("sku").and.equal("tnt019");
      item.should.have.property("type").and.equal("minifig");
      item.should.have.property("name").and.equal("Donatello, Frown");
      item.should.have.property("category").and.equal("Teenage Mutant Ninja Turtles");
      item.should.have.property("year_released").and.equal("2013");
    });

    it("should load a map of items", function () {
      const itemsMap = this.itemsList.itemsMap;
      itemsMap.should.have.lengthOf(1);
      item = itemsMap.get("tnt019");
      item.should.have.property("name").equal("Donatello, Frown");
    });
  });

  context("querying itemsList", function () {
    it("should return an item for a given sku", function () {
      buyer = this.itemsList.findItem("tnt019");
      buyer.should.not.be.null;
    });
  });
});
