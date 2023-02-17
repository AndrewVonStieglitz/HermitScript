function convertJSON(json) {
  let sections = json.BigSection;
  for (let key in sections) {
    if (sections.hasOwnProperty(key)) {
      let smallSections = sections[key];
      for (let i = 0; i < smallSections.length; i++) {
        let section = smallSections[i];
        if (section.text) {
          let regex = /<([^>]+)>/g;
          let matches = section.text.match(regex);
          if (matches) {
            section.actions = [];
            for (let j = 0; j < matches.length; j++) {
              let match = matches[j];
              let parts = match.slice(1, -1).split(",");
              section.actions.push({
                action: parts[0],
                arguments: parts.slice(1),
              });
            }
            section.text = section.text.replace(regex, "");
          }
        }
      }
    }
  }
  return json;
}

testjson = `{
	"BigSection": {
	  "SmallSection": [
		{
		  "name": "Ruth",
		  "text": "how are you? <Shake,10,10> <Set,Apples,5>",
		  "options": []
		},
		{
		  "name": "Eve",
		  "text": "fine, thanks. And you? <Name,Andrew Von Stieglitz,23,Australia> <Set,Apples,3>",
		  "options": [
			{
			  "text": "I'm doing great",
			  "next": "Great"
			},
			{
			  "text": "I'm doing good",
			  "next": "Good"
			},
			{
			  "text": "I'm doing bad",
			  "next": "Bad"
			}
		  ]
		}
	  ],
	  "Great": [
		{
		  "name": "Eve",
		  "text": "great!",
		  "options": []
		},
		{
		  "name": "Ruth",
		  "text": "know, right?",
		  "options": []
		}
	  ],
	  "Good": [
		{
		  "name": "Eve",
		  "text": "",
		  "options": []
		}
	  ],
	  "Bad": [
		{
		  "name": "Eve",
		  "text": "want to talk about it? <Flash,2,2> <Scream,help help,7>",
		  "options": []
		},
		{
		  "name": "Ruth",
		  "text": "I'm fine.",
		  "options": []
		},
		{
		  "name": "Eve",
		  "text": "but if you need to talk, I'm here for you.",
		  "options": []
		},
		{
		  "name": "Ruth",
		  "text": "I know.",
		  "options": []
		}
	  ]
	}
  }
  `;

console.log(JSON.stringify(convertJSON(JSON.parse(testjson)), null, 2));