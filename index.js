const fs = require("fs");
const input = fs.readFileSync("./input.md", "utf8");

function parseInput(input) {
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
        text,
        actions,
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
    const [fullMatch, actionName, argumentString] = match;
    let arguments = [];
    if (argumentString) {
      arguments = argumentString.split(/\s+/);
      let insideBackticks = false;
      let backtickArgs = [];
      for (let i = 0; i < arguments.length; i++) {
        if (arguments[i].startsWith("`")) {
          insideBackticks = true;
          backtickArgs.push(arguments[i]);
        } else if (insideBackticks) {
          backtickArgs.push(arguments[i]);
          if (arguments[i].endsWith("`")) {
            const fullArg = backtickArgs.join(" ").slice(1, -1);
            arguments.splice(
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
    const filteredArgs = arguments.filter((arg) => arg !== "");
    actions.push({ name: actionName, arguments: filteredArgs });
    text = text.replace(fullMatch, "");
  }

  return [text.trim(), actions];
}

let output = parseInput(input);
let outputJson = JSON.stringify(output, null, 2);

// Write output to file
fs.writeFileSync("./output.json", outputJson);
