const fs = require("fs");
const markdown = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  indent: "    ", // Use 4 spaces for indentation
});

const chokidar = require("chokidar");

const inputFile = "input.md";
const outputFile = "output.html";

// Function to convert Markdown to HTML and write to file
const convertMarkdown = () => {
  fs.readFile(inputFile, "utf8", (err, inputMd) => {
    if (err) throw err;
    const html = markdown.render(inputMd);
    fs.writeFile(outputFile, html, (err) => {
      if (err) throw err;
      console.log("Conversion complete!");
    });
  });
};

// Initial conversion
convertMarkdown();
