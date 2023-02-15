const fs = require("fs");
const markdown = require("markdown-it")();

// Read the Markdown file
fs.readFile("input.md", "utf8", (err, inputMd) => {
  if (err) throw err;

  // Convert the Markdown to HTML
  const html = markdown.render(inputMd);

  // Write the HTML to a file
  fs.writeFile("output.html", html, (err) => {
    if (err) throw err;
    console.log("Conversion complete!");
  });
});
