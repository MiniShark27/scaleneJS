"use strict";
const { ArgumentParser, RawTextHelpFormatter } = require("argparse");
const { execSync } = require("child_process");
const fs = require("fs");

const express = require("express");
const app = express();
const path = require("path");

getCommandLineInput();

function getCommandLineInput() {
  const parser = new ArgumentParser({
    description:
      "ScaleneJS: Automatically runs scalene and creates a local website with the results",
    prog: "scaleneJS",
    formatter_class: RawTextHelpFormatter,
  });

  parser.add_argument("-f", "--file", {
    help: "path to python file to test",
    required: true,
  });
  parser.add_argument("-c", "--console", {
    help: "Prints scalene to console instead of makeing web page",
    required: false,
    action: "store_true",
  });
  parser.add_argument("-o", "--original", {
    help: "Gets Original HTML instead of New HTML",
    required: false,
    action: "store_true",
  });

  const args = parser.parse_args();
  runScalene(args.file, args.console, args.original);
}

function parseOutput() {
  const tbodyContents = fs
    .readFileSync("temp.txt", "UTF-8")
    .split(/\r?\n/)
    .filter((line) => line.match(/^\s*\d+ \│/gm))
    .map((line) =>
      line.split("│").map((cell, index) => {
        switch (index) {
          case 6:
            const val = Math.trunc(((cell.lastIndexOf("▄") + 1) * 100) / 14);
            return `<div class="progress">
                <div class="progress-bar bg-info" 
                role="progressbar" 
                style="width:${val}%" 
                aria-valuenow="${val}" 
                aria-valuemin="0" 
                aria-valuemax="100"></div>
            </div>`;
          case 8:
            return cell.replace(/\s*$/gm, "");
          default:
            return cell.replace(/\s/g, "");
        }
      })
    )
    .reduce(
      (html, row) =>
        html +
        `<tr>${row.reduce(
          (rowstr, cell) => rowstr + `<td>${cell}</td>\n`,
          ""
        )}</tr>\n`,
      ""
    );
  const template = fs.readFileSync("template.html").toString("utf8");
  const splitIndex = template.indexOf("<tbody>") + 8;
  fs.writeFileSync("new.html", template.substring(0, splitIndex));
  fs.writeFileSync("new.html", tbodyContents, { flag: "a" });
  fs.writeFileSync("new.html", template.substring(splitIndex), { flag: "a" });
  hostPage("new.html");
}

function runScalene(file, consoleMode, originalMode) {
  console.log("Running Scalene")
  if (consoleMode) {
    execSync("scalene " + file, { stdio: [null, process.stdout] });
  } else if (originalMode) {
    execSync("scalene " + file + " --html --outfile original.html", {
      stdio: "inherit",
    });
    hostPage("original.html");
  } else {
    execSync("scalene " + file + " --outfile temp.txt", {
      stdio: "inherit",
    });
    parseOutput();
  }
}

function hostPage(page) {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/" + page));
  });

  app.listen(3000, () => {
    console.log("Go to http://localhost:3000/ to view the output of the call");
  });
}
