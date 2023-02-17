const fs = require("fs");
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
  const [name, text, ...tags] = line.split(" ");
  const result = {
    name: name.slice(0, -1),
    text: tags.join(" ").trim(),
    options: [],
  };
  return result;
}

function parseOption(line) {
  const [text, next] = line.substring(2).split(" > ");
  return { text: text.trim(), next: next.trim() };
}

function convertJsonData(jsonData) {
  let sections = jsonData.BigSection;
  for (let key in sections) {
    if (sections.hasOwnProperty(key)) {
      let smallSections = sections[key];
      for (let i = 0; i < smallSections.length; i++) {
        let section = smallSections[i];
        if (section.text) {
          let regex = /<([^>]+)>/g;
          let matches = section.text.match(regex);
          if (matches) {
            section.actions = [];
            for (let j = 0; j < matches.length; j++) {
              let match = matches[j];
              let parts = match.slice(1, -1).split(",");
              section.actions.push({
                action: parts[0],
                arguments: parts.slice(1),
              });
            }
            section.text = section.text.replace(regex, "");
          }
        }
      }
    }
  }
  return jsonData;
}

// Read input from index.md
const markdownInput = fs.readFileSync("./index.md", "utf8");

// Convert markdown to YAML
const yamlOutput = convertToYAML(markdownInput);
const yamlData = yaml.load(yamlOutput);
console.log(yamlData);

// Convert YAML to JSON
const jsonData = convertJsonData(yamlData);
const formattedJsonData = JSON.stringify(jsonData, null, 2);

//write to output.json
fs.writeFileSync("./output.json", formattedJsonData);
