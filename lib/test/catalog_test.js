const { assert, expect } = require("chai");
const should = require("chai").should();
const path = require("path");
const { Catalog } = require("../src/catalog.js");

describe("catalog", function () {
  beforeEach(function () {
    const csv_file = path.resolve(path.join(__dirname, "fixtures/catalog.txt"));

    this.catalog = new Catalog();
    this.catalog.load(csv_file);
  });

  context("loading list of partas", function () {
    it("should load parts", function () {
      const parts = this.catalog.parts;
      parts.should.have.lengthOf(17);
      part = parts[0];
      part.should.have.property("number").and.equal("sticker");
      part.should.have.property("name").and.equal("Sticker (Unsorted, Generic Entry)");
    });

    it("should load a map of parts", function () {
      const partsMap = this.catalog.partsMap;
      partsMap.should.have.lengthOf(17);
      buyer = partsMap.get("194");
      buyer.should.have.property("name").equal("Minifigure, Utensil Hose Nozzle Simple");
    });
  });

  context("querying catalog", function () {
    it("should return a part for a given number", function () {
      part = this.catalog.findPart("194");
      part.should.not.be.null;
    });
  });
});
