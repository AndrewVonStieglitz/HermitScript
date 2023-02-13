const fs = require("fs");

const extractExecPostexec = (text) => {
  let execList = [];
  let postexecList = [];
  while (true) {
    let start = text.indexOf("<");
    let end = text.indexOf(">");
    if (start === -1 || end === -1) {
      break;
    }
    let execOrPostexec = text.substring(start + 1, end).trim();
    if (execOrPostexec[execOrPostexec.length - 1] === "/") {
      postexecList.push(execOrPostexec.slice(0, -1).trim());
    } else {
      execList.push(execOrPostexec);
    }
    text = text.slice(0, start).trim() + text.slice(end + 1).trim();
  }
  return [text, execList, postexecList];
};

const parseMarkdown = (file) => {
  try {
    if (!fs.existsSync(file)) {
      throw new Error(`The file "${file}" does not exist.`);
    }

    const input = fs.readFileSync(file, "utf8");
    const lines = input.split("\n");
    const reName = /`(.+?)`\((\d+)\): (.+)/;
    const reOption = /- (.+) \*\*(.+)\*\*/;

    let currentBlock = null;
    let json = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        continue;
      }

      if (line.startsWith("**")) {
        currentBlock = line.slice(2, -2);
        if (!json[currentBlock]) {
          json[currentBlock] = [];
        }
      } else if (line.startsWith("`")) {
        const [_, name, subimage, message] = line.match(reName);
        if (!name || !subimage || !message) {
          throw new Error(`Malformed markdown file at line ${i + 1}: ${line}`);
        }
        const item = { name, subimage, message };
        json[currentBlock].push(item);
      } else if (line.startsWith("-")) {
        const [_, response, goto] = line.match(reOption);
        if (!response || !goto) {
          throw new Error(`Malformed markdown file at line ${i + 1}: ${line}`);
        }
        const item = { response, goto };
        const lastItem = json[currentBlock][json[currentBlock].length - 1];
        if (!lastItem.hasOwnProperty("options")) {
          lastItem.options = [];
        }
        lastItem.options.push(item);
      }
    }

    for (let key in json) {
      if (json.hasOwnProperty(key)) {
        for (let i = 0; i < json[key].length; i++) {
          let item = json[key][i];
          let [text, execList, postexecList] = extractExecPostexec(
            item.message
          );
          item.message = text;
          item.exec = execList;
          item.postexec = postexecList;
          if (item.options) {
            for (let j = 0; j < item.options.length; j++) {
              let option = item.options[j];
              let [text, execList, postexecList] = extractExecPostexec(
                option.response
              );
              option.response = text;
              option.exec = execList;
              option.postexec = postexecList;
            }
          }
        }
      }
    }
    return json;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const writeToFile = (json, file) => {
  try {
    fs.writeFileSync(file, JSON.stringify(json, null, 2));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const markdownToJson = (inputFile, outputFile) => {
  const json = parseMarkdown(inputFile);
  if (!json) {
    return false;
  }
  return writeToFile(json, outputFile);
};

markdownToJson("data.md", "data.json");
