legotools
======

Javascript Tools for printing labels on a Dymo printer.

-----

The tools were developed on Mac OS X.

- Dymo LabelWriter 450
- [Dymo Label Software v8.7.5](https://download.dymo.com/dymo/Software/Mac/DLS8Setup.8.7.5.dmg) for editing labels if necessary
- `Dymo Label Web Service` running on port 41951
- labels
- NodeJS 16.11+ installed


Installation
-----

- Clone the git repo locally
- If necessary, install NodeJS. If you use [ASDF](https://github.com/asdf-vm/asdf), you can follow [these instructions](https://github.com/asdf-vm/asdf-nodejs).
- Install the packages:

```
cd legotools
cd lib
npm install
cd ../cli
npm install
```
Usage
----

Open a terminal window and `cd` to the repository, in the `cli` sub-folder.

To print part labels interactively (catalog was downloaded from Bricklink):

    bin/legotools print part catalog.txt

To print labels for a list of items:

    bin/legotools print items inventory.csv

For an example of the CSV format, see lib/test/fixtures/items.csv

To show help:

    bin/legotools

Development
---

To run the tests and watch for changes:

    cd lib
    npm run test
