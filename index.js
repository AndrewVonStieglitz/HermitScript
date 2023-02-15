//get input from reading input.md
const fs = require("fs");
const input = fs.readFileSync("./input.md", "utf8");

function convertToInitialJson(input) {
  const output = {};

  let currentSection = null;
  let currentSubSection = null;

  input.split("\r\n").forEach((line) => {
    if (line.startsWith("# ")) {
      // New section
      const sectionName = line.substring(2);
      output[sectionName] = {};
      currentSection = sectionName;
      currentSubSection = null;
    } else if (line.startsWith("## ")) {
      // New subsection
      const subSectionName = line.substring(3);
      output[currentSection][subSectionName] = [];
      currentSubSection = subSectionName;
    } else if (line.trim() !== "") {
      // Add line to current subsection
      output[currentSection][currentSubSection].push(line);
    }
  });

  return output;
}

let initialJson = convertToInitialJson(input);
console.log(initialJson);
