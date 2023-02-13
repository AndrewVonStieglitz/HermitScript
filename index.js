"use strict";
exports.__esModule = true;
var fs = require("fs");
// Watch the "data.md" file and call main() function whenever it changes
fs.watch("data.md", function () {
    main();
});
function main() {
    // Extracts the exec and postexec commands from a given text
    var extractExecPostexec = function (text) {
        var execList = []; // An array to store exec commands
        var postexecList = []; // An array to store postexec commands
        // Loop through the text to find exec and postexec commands
        while (true) {
            var start = text.indexOf("<");
            var end = text.indexOf(">");
            // If no more exec or postexec commands are found, break the loop
            if (start === -1 || end === -1) {
                break;
            }
            var execOrPostexec = text.substring(start + 1, end).trim();
            // Check if the command is postexec or exec
            if (execOrPostexec[execOrPostexec.length - 1] === "/") {
                postexecList.push(execOrPostexec.slice(0, -1).trim());
            }
            else {
                execList.push(execOrPostexec);
            }
            // Remove the exec or postexec command from the text
            text = text.slice(0, start).trim() + text.slice(end + 1).trim();
        }
        return [text, execList, postexecList];
    };
    // Parses a markdown file and returns a JSON object
    var parseMarkdown = function (file) {
        try {
            // Check if the file exists
            if (!fs.existsSync(file)) {
                throw new Error("The file \"".concat(file, "\" does not exist."));
            }
            // Read the contents of the file
            var input = fs.readFileSync(file, "utf8");
            var lines = input.split("\n");
            // A regular expression to match the name and message of an item
            var reName = /`(.+?)`\((\d+)\): (.+)/;
            // A regular expression to match the response and goto of an option
            var reOption = /- (.+) \*\*(.+)\*\*/;
            var currentBlock = ""; // The current block in the markdown file
            var json = {}; // The JSON object to return
            // Loop through each line in the markdown file
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
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
                    var match = line.match(reName);
                    // If the line doesn't match the expected format, throw an error
                    if (!match) {
                        throw new Error("Malformed markdown file at line ".concat(i + 1, ": ").concat(line));
                    }
                    var _ = match[0], name_1 = match[1], subimage = match[2], message = match[3];
                    var item = { name: name_1, subimage: subimage, message: message };
                    // Add the item to the current block in the JSON object
                    json[currentBlock].push(item);
                }
                // Check if the line starts with "-"
                else if (line.startsWith("-")) {
                    var match = line.match(reOption);
                    // If the line doesn't match the expected format, throw an error
                    if (!match) {
                        throw new Error("Malformed markdown file at line ".concat(i + 1, ": ").concat(line));
                    }
                    var _ = match[0], response = match[1], goto = match[2];
                    var item = { response: response, goto: goto };
                    // Get the last item in the current block in the JSON object
                    var lastItem = json[currentBlock][json[currentBlock].length - 1];
                    // Initialize the options array if it doesn't exist
                    if (!lastItem.options) {
                        lastItem.options = [];
                    }
                    // Add the option to the last item
                    lastItem.options.push(item);
                }
            }
            // Loop through each block in the JSON object
            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    // Loop through each item in the block
                    for (var i = 0; i < json[key].length; i++) {
                        var item = json[key][i];
                        // Extract the exec and postexec commands from the item's message
                        var _a = extractExecPostexec(item.message), text = _a[0], execList = _a[1], postexecList = _a[2];
                        item.message = text;
                        item.exec = execList;
                        item.postexec = postexecList;
                        // Check if the item has options
                        if (item.options) {
                            // Loop through each option
                            for (var j = 0; j < item.options.length; j++) {
                                var option = item.options[j];
                                // Extract the exec and postexec commands from the option's response
                                var _b = extractExecPostexec(option.response), text_1 = _b[0], execList_1 = _b[1], postexecList_1 = _b[2];
                                option.response = text_1;
                                option.exec = execList_1;
                                option.postexec = postexecList_1;
                            }
                        }
                    }
                }
            }
            // Return the JSON object
            return json;
        }
        catch (error) {
            // Log any errors
            console.error(error);
            return null;
        }
    };
    // Writes a JSON object to a file
    var writeToFile = function (json, file) {
        try {
            // Write the JSON object to the file
            fs.writeFileSync(file, JSON.stringify(json, null, 2));
            return true;
        }
        catch (error) {
            // Log any errors
            console.error(error);
            return false;
        }
    };
    // Converts a markdown file to a JSON file
    var markdownToJson = function (inputFile, outputFile) {
        // Parse the markdown file
        var json = parseMarkdown(inputFile);
        if (!json) {
            return false;
        }
        // Write the JSON object to a file
        return writeToFile(json, outputFile);
    };
    // Convert the "data.md" file to "data.json" file
    markdownToJson("data.md", "data.json");
}
