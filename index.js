"use strict";
exports.__esModule = true;
var fs = require("fs");
function parseInput(input) {
    var output = {};
    var currentSection = null;
    var currentSubSection = null;
    input.split("\r\n").forEach(function (line) {
        if (line.startsWith("# ")) {
            // New section
            var sectionName = line.substring(2);
            output[sectionName] = {};
            currentSection = sectionName;
            currentSubSection = null;
        }
        else if (line.startsWith("## ")) {
            // New subsection
            var subSectionName = line.substring(3);
            output[currentSection][subSectionName] = [];
            currentSubSection = subSectionName;
        }
        else if (line.trim() !== "") {
            // Parse line for actions
            var _a = parseLine(line), text = _a[0], actions = _a[1];
            output[currentSection][currentSubSection].push({
                text: text,
                actions: actions
            });
        }
    });
    return output;
}
function parseLine(line) {
    var actions = [];
    var text = line;
    // Find all action syntax in the line and add them to the actions array
    var regex = /<([A-Za-z]+)(\s+([^>]+))?>/g;
    var match;
    while ((match = regex.exec(line)) !== null) {
        var fullMatch = match[0], actionName = match[1], argumentString = match[2];
        var args = [];
        if (argumentString) {
            args = argumentString.split(/\s+/);
            var insideBackticks = false;
            var backtickArgs = [];
            for (var i = 0; i < args.length; i++) {
                if (args[i].startsWith("`")) {
                    insideBackticks = true;
                    backtickArgs.push(args[i]);
                }
                else if (insideBackticks) {
                    backtickArgs.push(args[i]);
                    if (args[i].endsWith("`")) {
                        var fullArg = backtickArgs.join(" ").slice(1, -1);
                        args.splice(i - backtickArgs.length + 1, backtickArgs.length, fullArg);
                        i -= backtickArgs.length - 1;
                        backtickArgs = [];
                        insideBackticks = false;
                    }
                }
            }
        }
        var filteredArgs = args.filter(function (arg) { return arg !== ""; });
        actions.push({ name: actionName, arguments: filteredArgs });
        text = text.replace(fullMatch, "");
    }
    return [text.trim(), actions];
}
var input = fs.readFileSync("./input.md", "utf8");
var output = parseInput(input);
var outputJson = JSON.stringify(output, null, 2);
// Write output to file
fs.writeFileSync("./output.json", outputJson);
