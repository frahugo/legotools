const fs = require("fs");
const path = require("path");
const Dymo = require("dymojs");
const wrap = require("word-wrap");

const { ItemsList } = require("legotools-lib/src/itemsList");

exports.command = "items <list_csv_file>";
exports.desc = "Print items from a list";
exports.builder = {};
exports.handler = function (argv) {
  const itemsList = new ItemsList();
  itemsList.load(argv.list_csv_file);
  print(itemsList);
};

async function print(itemsList) {
  const itemLabelFile = path.resolve(path.join(__dirname, "../../../resources/item.label"));

  const labelConfig = {
    dymo: new Dymo(),
    itemLabelXml: fs.readFileSync(itemLabelFile, "utf8"),
  };

  console.log("%d items to print.", itemsList.items.length);

  // Note: need recursion so the promises to work sequentially with the prompts.
  printItems(itemsList.items, labelConfig.dymo, labelConfig.itemLabelXml);
}

function printItems(items, dymo, labelXml) {
  const labelParts = [];

  labelParts.push("<LabelSet>");
  for (var item of items) {
    recordXml = buildRecordXml(item);
    labelParts.push(recordXml);
  }
  labelParts.push("</LabelSet>");

  let labelSetXml = labelParts.join("");

  return printLabels(dymo, labelXml, labelSetXml);
}

function buildRecordXml(item) {
  const name = wrap(item.name, { width: 16 });
  const category = wrap(item.category, { width: 16 });
  return `<LabelRecord>
        <ObjectData Name="SKU">${item.sku}</ObjectData>
        <ObjectData Name="NAME">${name}</ObjectData>
        <ObjectData Name="CATEGORY">${category}</ObjectData>
        <ObjectData Name="YEAR_RELEASED">${item.year_released}</ObjectData>
    </LabelRecord>`;
}

function printLabels(dymo, labelXml, labelSetXml) {
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
