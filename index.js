const fs = require("fs");
const input = fs.readFileSync("./input.md", "utf8");

function initialOutputFunction(input) {
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
    let argArray = [];
    if (arguments) {
      argArray = arguments.split(/\s+/);
      let insideBackticks = false;
      let backtickArgs = [];
      for (let i = 0; i < argArray.length; i++) {
        if (argArray[i].startsWith("`")) {
          insideBackticks = true;
          backtickArgs.push(argArray[i]);
        } else if (insideBackticks) {
          backtickArgs.push(argArray[i]);
          if (argArray[i].endsWith("`")) {
            const fullArg = backtickArgs.join(" ").slice(1, -1);
            argArray.splice(
              i - backtickArgs.length + 1,
              backtickArgs.length,
              fullArg
            );
            i -= backtickArgs.length - 1;
            backtickArgs = [];
            insideBackticks = false;
          }
        }
      }
    }
    const filteredArgs = argArray.filter((arg) => arg !== "");
    actions.push({ Name: name, Arguments: filteredArgs });
    text = text.replace(fullMatch, "");
  }

  return [text.trim(), actions];
}

let initialOutput = initialOutputFunction(input);
let initialOutputJson = JSON.stringify(initialOutput, null, 2);

//write to file
fs.writeFileSync("./output.json", initialOutputJson);
