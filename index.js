"use strict";
exports.__esModule = true;
var fs = require("fs");
fs.watch("data.md", function () {
    main();
});
function main() {
    var extractExecPostexec = function (text) {
        var execList = [];
        var postexecList = [];
        while (true) {
            var start = text.indexOf("<");
            var end = text.indexOf(">");
            if (start === -1 || end === -1) {
                break;
            }
            var execOrPostexec = text.substring(start + 1, end).trim();
            if (execOrPostexec[execOrPostexec.length - 1] === "/") {
                postexecList.push(execOrPostexec.slice(0, -1).trim());
            }
            else {
                execList.push(execOrPostexec);
            }
            text = text.slice(0, start).trim() + text.slice(end + 1).trim();
        }
        return [text, execList, postexecList];
    };
    var parseMarkdown = function (file) {
        try {
            if (!fs.existsSync(file)) {
                throw new Error("The file \"".concat(file, "\" does not exist."));
            }
            var input = fs.readFileSync(file, "utf8");
            var lines = input.split("\n");
            var reName = /`(.+?)`\((\d+)\): (.+)/;
            var reOption = /- (.+) \*\*(.+)\*\*/;
            var currentBlock = "";
            var json = {};
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (!line) {
                    continue;
                }
                if (line.startsWith("**")) {
                    currentBlock = line.slice(2, -2);
                    if (!json[currentBlock]) {
                        json[currentBlock] = [];
                    }
                }
                else if (line.startsWith("`")) {
                    var match = line.match(reName);
                    if (!match) {
                        throw new Error("Malformed markdown file at line ".concat(i + 1, ": ").concat(line));
                    }
                    var _ = match[0], name_1 = match[1], subimage = match[2], message = match[3];
                    var item = { name: name_1, subimage: subimage, message: message };
                    json[currentBlock].push(item);
                }
                else if (line.startsWith("-")) {
                    var match = line.match(reOption);
                    if (!match) {
                        throw new Error("Malformed markdown file at line ".concat(i + 1, ": ").concat(line));
                    }
                    var _ = match[0], response = match[1], goto = match[2];
                    var item = { response: response, goto: goto };
                    var lastItem = json[currentBlock][json[currentBlock].length - 1];
                    if (!lastItem.options) {
                        lastItem.options = [];
                    }
                    lastItem.options.push(item);
                }
            }
            for (var key in json) {
                if (json.hasOwnProperty(key)) {
                    for (var i = 0; i < json[key].length; i++) {
                        var item = json[key][i];
                        var _a = extractExecPostexec(item.message), text = _a[0], execList = _a[1], postexecList = _a[2];
                        item.message = text;
                        item.exec = execList;
                        item.postexec = postexecList;
                        if (item.options) {
                            for (var j = 0; j < item.options.length; j++) {
                                var option = item.options[j];
                                var _b = extractExecPostexec(option.response), text_1 = _b[0], execList_1 = _b[1], postexecList_1 = _b[2];
                                option.response = text_1;
                                option.exec = execList_1;
                                option.postexec = postexecList_1;
                            }
                        }
                    }
                }
            }
            return json;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    };
    var writeToFile = function (json, file) {
        try {
            fs.writeFileSync(file, JSON.stringify(json, null, 2));
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    };
    var markdownToJson = function (inputFile, outputFile) {
        var json = parseMarkdown(inputFile);
        if (!json) {
            return false;
        }
        return writeToFile(json, outputFile);
    };
    markdownToJson("data.md", "data.json");
}
