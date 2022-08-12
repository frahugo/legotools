const fs = require("fs");
const path = require("path");
const Dymo = require("dymojs");
const wrap = require("word-wrap");
const readlineSync = require("readline-sync");

const { Catalog } = require("legotools-lib/src/catalog");
const { Palette } = require("legotools-lib/src/palette");

exports.command = "part";
exports.desc = "Print part label";
exports.builder = {};
exports.handler = function (argv) {
  const catalog = new Catalog();
  const palette = new Palette();

  catalog.load("catalog.txt");
  palette.load("colors.txt");

  print(catalog, palette);
};

async function print(catalog, palette) {
  const partLabelFile = path.resolve(path.join(__dirname, "../../../resources/part.label"));

  const labelConfig = {
    dymo: new Dymo(),
    partLabelXml: fs.readFileSync(partLabelFile, "utf8"),
  };

  // Note: need recursion so the promises to work sequentially with the prompts.
  printPart(catalog, palette, labelConfig.dymo, labelConfig.partLabelXml);
}

function printPart(catalog, palette, dymo, labelXml) {
  const labelParts = [];
  var answer;
  var part;
  var partNumber;
  var colorId;
  var color;

  answer = readlineSync.question("Part number (and optional color id): ");
  [partNumber, colorId] = answer.split(" ");

  if (partNumber.startsWith("q")) {
    return;
  }

  if (colorId != undefined) {
    color = palette.findColor(colorId);
  } else {
    color = null;
  }

  part = catalog.findPart(partNumber);
  if (part == null) {
    console.log("Part not found!");
    printPart(catalog, dymo, labelXml);
    return;
  } else if (part.name.includes("Undetermined Type")) {
    // console.log(part.number + " " + part.name);
    part = findSuffix(catalog, part);
  }

  var prompt;

  if (color != null) {
    prompt = `Print part ${part.number} ${part.name} in ${color.name} (y/n/q)? `;
  } else {
    prompt = `Print part ${part.number} ${part.name} (y/n/q)? `;
  }

  var answer = readlineSync.keyIn(prompt, {
    limit: "$<ynq>",
  });
  switch (answer) {
    case "y":
      labelParts.push("<LabelSet>");
      recordXml = buildRecordXml(part, color);
      labelParts.push(recordXml);
      labelParts.push("</LabelSet>");

      let labelSetXml = labelParts.join("");

      printLabel(dymo, labelXml, labelSetXml).then((result) => {
        printPart(catalog, palette, dymo, labelXml);
      });
      break;
    case "n":
      printPart(catalog, palette, dymo, labelXml);
      break;
    case "q":
      break;
  }
}

function findSuffix(catalog, part) {
  const letters = ["a", "b", "c", "d", "e", "f", "g"];
  var otherParts;

  otherParts = letters
    .map((letter) => {
      var number = part.number + letter;
      return catalog.findPart(number);
    })
    .filter((part) => part != undefined);

  otherParts.forEach((part, i) => {
    console.log(`${i + 1}) ${part.name}`);
  });

  var answer = readlineSync.keyIn("Which alternate part? ");
  var index = parseInt(answer);

  return otherParts[index - 1];
}

function buildRecordXml(part, color) {
  const name = wrap(part.name, { width: 20 });
  const category = wrap(part.categoryName, { width: 24 });
  var colorName;

  if (color != null) {
    colorName = wrap(color.name, { width: 24 });
  } else {
    colorName = "";
  }

  return `<LabelRecord>
        <ObjectData Name="NUMBER">${part.number}</ObjectData>
        <ObjectData Name="NAME">${name}</ObjectData>
        <ObjectData Name="CATEGORY">${category}</ObjectData>
        <ObjectData Name="COLOR">${colorName}</ObjectData>
    </LabelRecord>`;
}

function printLabel(dymo, labelXml, labelSetXml) {
  return (
    dymo
      // .print("DYMO LabelWriter 450 rPi @ pi-top", labelXml, labelSetXml)
      .print("DYMO LabelWriter 450", labelXml, labelSetXml)
      .then((result) => {
        true;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      })
  );
}
