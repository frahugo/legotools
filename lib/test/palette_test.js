const { assert, expect } = require("chai");
const should = require("chai").should();
const path = require("path");
const { Palette } = require("../src/palette.js");

describe("palette", function () {
  beforeEach(function () {
    const csv_file = path.resolve(path.join(__dirname, "fixtures/colors.txt"));

    this.palette = new Palette();
    this.palette.load(csv_file);
  });

  context("loading list of colors", function () {
    it("should load colors", function () {
      const colors = this.palette.colors;
      colors.should.have.lengthOf(5);
      color = colors[0];
      color.should.have.property("id").and.equal("41");
      color.should.have.property("name").and.equal("Aqua");
    });

    it("should load a map of colors", function () {
      const colorsMap = this.palette.colorsMap;
      colorsMap.should.have.lengthOf(5);
      buyer = colorsMap.get("97");
      buyer.should.have.property("name").equal("Blue-Violet");
    });
  });

  context("querying colors", function () {
    it("should return a color for a given id", function () {
      color = this.palette.findColor("97");
      color.should.not.be.null;
    });
  });
});
