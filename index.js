const yaml = require("js-yaml");

function convertToYAML(input) {
  const lines = input.split("\n").filter((line) => line.trim() !== "");
  const result = {};

  let currentSection = null;
  let currentSubsection = null;
  let currentOptions = null;

  for (let line of lines) {
    if (line.startsWith("# ")) {
      currentSection = line.substring(2).trim();
      result[currentSection] = {};
    } else if (line.startsWith("## ")) {
      currentSubsection = line.substring(3).trim();
      result[currentSection][currentSubsection] = [];
      currentOptions = result[currentSection][currentSubsection];
    } else if (line.includes(": ")) {
      currentOptions.push(parseLine(line));
    } else if (line.startsWith("- ")) {
      currentOptions[currentOptions.length - 1].options.push(parseOption(line));
    }
  }

  return yaml.dump(result);
}

function parseLine(line) {
  const [name, text] = line.split(": ");
  return { [name]: text.trim(), options: [] };
}

function parseOption(line) {
  const [text, next] = line.substring(2).split(" > ");
  return { text: text.trim(), next: next.trim() };
}

//read from index.md
const fs = require("fs");
const customSyntax = fs.readFileSync("./index.md", "utf8");

//convert to yaml
const yamlOutput = convertToYAML(customSyntax);
const jsonData = yaml.load(yamlOutput);
console.log(JSON.stringify(jsonData, null, 2));
