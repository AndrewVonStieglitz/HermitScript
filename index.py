import markdown
import json
from bs4 import BeautifulSoup

# Read the Markdown file
with open("input.md", "r") as f:
	input_md = f.read()

# Convert the Markdown to HTML
html = markdown.markdown(input_md)

# Parse the HTML and create the JSON output
data = {}
current_heading = None
current_subheading = None
soup = BeautifulSoup(html, "html.parser")
for element in soup.find_all(["h1", "h2", "p"]):
    if element.name == "h1":
        current_heading = element.text.strip()
        data[current_heading] = {}
    elif element.name == "h2":
        current_subheading = element.text.strip()
        data[current_heading][current_subheading] = []
    elif element.name == "p":
        paragraph = element.text.strip()
        responses = []
        for link in element.find_all("a"):
            link_label = link.text.strip()
            link_target = link["href"][1:].replace("-", " ")
            responses.append({"label": link_label, "goto": link_target})
        if responses:
            data[current_heading][current_subheading].append({"paragraph": paragraph, "responses": responses})
        else:
            data[current_heading][current_subheading].append({"paragraph": paragraph})

# Output the JSON
output_json = json.dumps(data, indent=2)

# Write the JSON to a file
with open("output.json", "w") as f:
	f.write(output_json)
