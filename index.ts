import * as fs from "fs";

fs.watch("data.md", () => {
  main();
});

function main() {
  const extractExecPostexec = (text: string): [string, string[], string[]] => {
    let execList: string[] = [];
    let postexecList: string[] = [];
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

  interface Item {
    name: string;
    subimage: string;
    message: string;
    exec?: string[];
    postexec?: string[];
    options?: Option[];
  }

  interface Option {
    response: string;
    goto: string;
    exec?: string[];
    postexec?: string[];
  }

  const parseMarkdown = (file: string): { [key: string]: Item[] } | null => {
    try {
      if (!fs.existsSync(file)) {
        throw new Error(`The file "${file}" does not exist.`);
      }

      const input = fs.readFileSync(file, "utf8");
      const lines = input.split("\n");
      const reName = /`(.+?)`\((\d+)\): (.+)/;
      const reOption = /- (.+) \*\*(.+)\*\*/;

      let currentBlock = "";
      let json: { [key: string]: Item[] } = {};

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
          const match = line.match(reName);
          if (!match) {
            throw new Error(
              `Malformed markdown file at line ${i + 1}: ${line}`
            );
          }
          const [_, name, subimage, message] = match;
          const item: Item = { name, subimage, message };
          json[currentBlock].push(item);
        } else if (line.startsWith("-")) {
          const match = line.match(reOption);
          if (!match) {
            throw new Error(
              `Malformed markdown file at line ${i + 1}: ${line}`
            );
          }
          const [_, response, goto] = match;
          const item: Option = { response, goto };
          const lastItem = json[currentBlock][json[currentBlock].length - 1];
          if (!lastItem.options) {
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

  const writeToFile = (
    json: { [key: string]: Item[] },
    file: string
  ): boolean => {
    try {
      fs.writeFileSync(file, JSON.stringify(json, null, 2));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const markdownToJson = (inputFile: string, outputFile: string): boolean => {
    const json = parseMarkdown(inputFile);
    if (!json) {
      return false;
    }
    return writeToFile(json, outputFile);
  };

  markdownToJson("data.md", "data.json");
}
