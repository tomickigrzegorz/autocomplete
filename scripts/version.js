const fs = require("fs");

const pkg = require("../package.json");

const newVersion = pkg.version;

function updateVersion(file, newVersion) {
  fs.readFile(file, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const matches = data.match(/\@(.*?)\/dist/i)[1];

    const reg = new RegExp(matches.replace(/\./g, "\\."), "g");

    const result = data.replace(reg, newVersion);

    fs.writeFile(file, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}

// ------------------------------------------------------------

const someFiles = ["README.md", "docs/index.html"];

someFiles.forEach((file) => {
  updateVersion(file, newVersion);
});
