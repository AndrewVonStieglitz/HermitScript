const originalJson = {
  BigSection: {
    SmallSection: [
      {
        name: "Ruth",
        text: "how are you? <Shake,10,10> <Set,Apples,5>",
        options: [],
      },
      {
        name: "Eve",
        text: "fine, thanks. And you? <Name,Andrew Von Stieglitz,23,Australia> <Set,Apples,3>",
        options: [
          {
            text: "I'm doing great",
            next: "Great",
          },
          {
            text: "I'm doing good",
            next: "Good",
          },
          {
            text: "I'm doing bad",
            next: "Bad",
          },
        ],
      },
    ],
    Great: [
      {
        name: "Eve",
        text: "great!",
        options: [],
      },
      {
        name: "Ruth",
        text: "know, right?",
        options: [],
      },
    ],
    Good: [
      {
        name: "Eve",
        text: "",
        options: [],
      },
    ],
    Bad: [
      {
        name: "Eve",
        text: "want to talk about it?",
        options: [],
      },
      {
        name: "Ruth",
        text: "I'm fine.",
        options: [],
      },
      {
        name: "Eve",
        text: "but if you need to talk, I'm here for you.",
        options: [],
      },
      {
        name: "Ruth",
        text: "I know.",
        options: [],
      },
    ],
  },
};

function convertJson(originalJson) {
  const newJson = {};

  for (const key in originalJson) {
    const value = originalJson[key];

    if (Array.isArray(value)) {
      newJson[key] = value.map((item) => {
        if (item.text.includes("<")) {
          const actions = [];
          let text = item.text;

          while (text.includes("<")) {
            const start = text.indexOf("<");
            const end = text.indexOf(">") + 1;
            const actionText = text.slice(start, end);
            const actionParts = actionText.slice(1, -1).split(",");
            const actionName = actionParts.shift();
            const actionParams = actionParts.map((p) => {
              if (!isNaN(p)) {
                return parseInt(p);
              }
              return p;
            });

            actions.push({ [actionName.toLowerCase()]: actionParams });

            text = text.slice(0, start) + text.slice(end);
          }

          return {
            ...item,
            text: text.trim(),
            actions,
          };
        }

        return item;
      });
    } else if (typeof value === "object" && value !== null) {
      newJson[key] = convertJson(value);
    } else {
      newJson[key] = value;
    }
  }

  return newJson;
}

const convertedJson = convertJson(originalJson);

console.log(JSON.stringify(convertedJson, null, 2));
