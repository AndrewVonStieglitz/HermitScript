const fs = require("fs");
const input = fs.readFileSync("./input.md", "utf8");

function convertToOutput(input) {
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
      // Parse line for actions
      const [text, actions] = parseLine(line);
      output[currentSection][currentSubSection].push({
        Text: text,
        Actions: actions,
      });
    }
  });

  return output;
}

function parseLine(line) {
  const actions = [];
  let text = line;

  // Find all action syntax in the line and add them to the actions array
  const regex = /<([A-Za-z]+)(\s+([^>]+))?>/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    const [fullMatch, name, arguments] = match;
    const argArray = arguments ? arguments.split(/\s+/) : [];
    const filteredArgs = argArray.filter((arg) => arg !== "");
    actions.push({ Name: name, Arguments: filteredArgs });
    text = text.replace(fullMatch, "");
  }

  return [text.trim(), actions];
}

let output = convertToOutput(input);
let outputJson = JSON.stringify(output, null, 2);
console.log(outputJson);
//write to file
fs.writeFileSync("./output.json", outputJson);
