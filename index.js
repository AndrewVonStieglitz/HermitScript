const fs = require("fs");
const markdown = require("markdown-it")();
const cheerio = require("cheerio");
const chokidar = require("chokidar");

const inputFile = "input.md";

// Function to convert Markdown to HTML and return it
const convertMarkdown = () => {
  const inputMd = fs.readFileSync(inputFile, "utf8");
  const html = markdown.render(inputMd);
  return html;
};

const convertToHeadingsAndParagraphs = (html) => {
  const $ = cheerio.load(html);
  const data = {};

  let currentSection = null;
  let currentSubsection = null;

  $("h1, h2, p").each((i, el) => {
    const tagName = el.tagName;
    if (tagName === "h1") {
      const sectionTitle = $(el).text();
      data[sectionTitle] = {};
      currentSection = sectionTitle;
    } else if (tagName === "h2") {
      const subsectionTitle = $(el).text();
      data[currentSection][subsectionTitle] = [];
      currentSubsection = subsectionTitle;
    } else if (tagName === "p") {
      const text = $(el).text();
      data[currentSection][currentSubsection].push(text);
    }
  });

  return data;
};

// Initial conversion
const html = convertMarkdown();

console.log(html);

const data = convertToHeadingsAndParagraphs(html);

console.log(JSON.stringify(data, null, 2));
