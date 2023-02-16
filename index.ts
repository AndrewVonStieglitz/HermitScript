import * as fs from "fs";

interface Action {
  name: string;
  arguments: string[];
}

interface SubSection {
  text: string;
  actions: Action[];
}

interface Section {
  [subsection: string]: SubSection[];
}

interface Output {
  [section: string]: Section;
}

function parseInput(input: string): Output {
  const output: Output = {};

  let currentSection: string | null = null;
  let currentSubSection: string | null = null;

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
      output[currentSection!][subSectionName] = [];
      currentSubSection = subSectionName;
    } else if (line.trim() !== "") {
      // Parse line for actions
      const [text, actions] = parseLine(line);
      output[currentSection!][currentSubSection!].push({
        text,
        actions,
      });
    }
  });

  return output;
}

function parseLine(line: string): [string, Action[]] {
  const actions: Action[] = [];
  let text: string = line;

  // Find all action syntax in the line and add them to the actions array
  const regex = /<([A-Za-z]+)(\s+([^>]+))?>/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    const [fullMatch, actionName, argumentString] = match;
    let args: string[] = [];
    if (argumentString) {
      args = argumentString.split(/\s+/);
      let insideBackticks = false;
      let backtickArgs: string[] = [];
      for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith("`")) {
          insideBackticks = true;
          backtickArgs.push(args[i]);
        } else if (insideBackticks) {
          backtickArgs.push(args[i]);
          if (args[i].endsWith("`")) {
            const fullArg = backtickArgs.join(" ").slice(1, -1);
            args.splice(
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
    const filteredArgs = args.filter((arg) => arg !== "");
    actions.push({ name: actionName, arguments: filteredArgs });
    text = text.replace(fullMatch, "");
  }

  return [text.trim(), actions];
}

const input = fs.readFileSync("./input.md", "utf8");
const output = parseInput(input);
const outputJson = JSON.stringify(output, null, 2);

// Write output to file
fs.writeFileSync("./output.json", outputJson);
