import * as fs from "fs";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("What is the file name? ", (fileName: string) => {
  console.log(`Watching ${fileName} for changes... (press Ctrl+C to exit)`);
  readline.close();

  fs.watch(fileName, () => {
    main(fileName);
  });
});

function main(fileName: string) {
  // Extracts the exec and postexec commands from a given text
  const extractExecPostexec = (text: string): [string, string[], string[]] => {
    let execList: string[] = []; // An array to store exec commands
    let postexecList: string[] = []; // An array to store postexec commands
    // Loop through the text to find exec and postexec commands
    while (true) {
      let start = text.indexOf("<");
      let end = text.indexOf(">");
      // If no more exec or postexec commands are found, break the loop
      if (start === -1 || end === -1) {
        break;
      }
      let execOrPostexec = text.substring(start + 1, end).trim();
      // Check if the command is postexec or exec
      if (execOrPostexec[execOrPostexec.length - 1] === "/") {
        postexecList.push(execOrPostexec.slice(0, -1).trim());
      } else {
        execList.push(execOrPostexec);
      }
      // Remove the exec or postexec command from the text
      text = text.slice(0, start).trim() + text.slice(end + 1).trim();
    }
    return [text, execList, postexecList];
  };

  // An interface for the items in the markdown file
  interface Item {
    name: string;
    subimage: string;
    message: string;
    exec?: string[];
    postexec?: string[];
    options?: Option[];
  }

  // An interface for the options in the markdown file
  interface Option {
    response: string;
    goto: string;
    exec?: string[];
    postexec?: string[];
  }

  // Parses a markdown file and returns a JSON object
  const parseMarkdown = (file: string): { [key: string]: Item[] } | null => {
    try {
      // Check if the file exists
      if (!fs.existsSync(file)) {
        throw new Error(`The file "${file}" does not exist.`);
      }

      // Read the contents of the file
      const input = fs.readFileSync(file, "utf8");
      const lines = input.split("\n");
      // A regular expression to match the name and message of an item
      const reName = /`(.+?)`\((\d+)\): (.+)/;
      // A regular expression to match the response and goto of an option
      const reOption = /- (.+) \*\*(.+)\*\*/;

      let currentBlock = ""; // The current block in the markdown file
      let json: { [key: string]: Item[] } = {}; // The JSON object to return

      // Loop through each line in the markdown file
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip empty lines
        if (!line) {
          continue;
        }

        // Check if the line starts with "**"
        if (line.startsWith("**")) {
          currentBlock = line.slice(2, -2);
          // Initialize the current block in the JSON object if it doesn't exist
          if (!json[currentBlock]) {
            json[currentBlock] = [];
          }
        }
        // Check if the line starts with "`"
        else if (line.startsWith("`")) {
          const match = line.match(reName);
          // If the line doesn't match the expected format, throw an error
          if (!match) {
            throw new Error(
              `Malformed markdown file at line ${i + 1}: ${line}`
            );
          }
          const [_, name, subimage, message] = match;
          const item: Item = { name, subimage, message };
          // Add the item to the current block in the JSON object
          json[currentBlock].push(item);
        }
        // Check if the line starts with "-"
        else if (line.startsWith("-")) {
          const match = line.match(reOption);
          // If the line doesn't match the expected format, throw an error
          if (!match) {
            throw new Error(
              `Malformed markdown file at line ${i + 1}: ${line}`
            );
          }
          const [_, response, goto] = match;
          const item: Option = { response, goto };
          // Get the last item in the current block in the JSON object
          const lastItem = json[currentBlock][json[currentBlock].length - 1];
          // Initialize the options array if it doesn't exist
          if (!lastItem.options) {
            lastItem.options = [];
          }
          // Add the option to the last item
          lastItem.options.push(item);
        }
      }

      // Loop through each block in the JSON object
      for (let key in json) {
        if (json.hasOwnProperty(key)) {
          // Loop through each item in the block
          for (let i = 0; i < json[key].length; i++) {
            let item = json[key][i];
            // Extract the exec and postexec commands from the item's message
            let [text, execList, postexecList] = extractExecPostexec(
              item.message
            );
            item.message = text;
            item.exec = execList;
            item.postexec = postexecList;
            // Check if the item has options
            if (item.options) {
              // Loop through each option
              for (let j = 0; j < item.options.length; j++) {
                let option = item.options[j];
                // Extract the exec and postexec commands from the option's response
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
      // Return the JSON object
      return json;
    } catch (error) {
      // Log any errors
      console.error(error);
      return null;
    }
  };

  // Writes a JSON object to a file
  const writeToFile = (
    json: { [key: string]: Item[] },
    file: string
  ): boolean => {
    try {
      // Write the JSON object to the file
      fs.writeFileSync(file, JSON.stringify(json, null, 2));
      return true;
    } catch (error) {
      // Log any errors
      console.error(error);
      return false;
    }
  };

  // Converts a markdown file to a JSON file
  const markdownToJson = (inputFile: string, outputFile: string): boolean => {
    // Parse the markdown file
    const json = parseMarkdown(inputFile);
    if (!json) {
      return false;
    }
    // Write the JSON object to a file
    return writeToFile(json, outputFile);
  };

  markdownToJson(fileName, "data.json");
}
