# Table of Contents

- [Introduction](#introduction)
- [Download](#download)
- [Features](#features)
- [Requirements](#requirements)
- [Syntax](#syntax)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

# Introduction

HermitScript is a software designed to make writing dialogue for video games easier and more efficient. Written in TypeScript and using Node.js, this software provides a clear and concise syntax for writing dialogue.

# Download

You can download the latest version of HermitScript from the [releases](google.com) page.

# Features

- A clear and concise syntax for writing dialogue
- Easy integration with video games and other related software
- Support for custom actions and commands in dialogue

# Syntax

The syntax for writing dialogue in HermitScript is as follows:

```md
**TestConversation**
`Andrew`(2): Hi, I'm Andrew. How are you doing today? <SET apples 10/> <GET oranges 3/> <HELP 4 5 3> <SHAKE hands/> <SET Grapes 4 5>
`Lara`(1): I'm doing [wave]great[/wave], thanks for asking. How are you? <HELP 4 5 3/> <SHAKE hands>

- I'm doing great **TestConversationGreat**
- I'm doing okay **TestConversationOkay**
- I'm doing bad **TestConversationBad**

**TestConversationGreat**
`Andrew`(0): I'm doing great as well!
`Lara`(0): That's great to hear! <Shake 3 5 4>

**TestConversationOkay**
`Andrew`(0): I'm doing okay!

**TestConversationBad**
`Andrew`(0): I'm not doing so good...
```

Each conversation is marked by a heading in the format **ConversationName**. Each line of dialogue is written in the format ``Speaker(subimage): Message, where Speaker is the name of the speaker, subimage is an optional subimage number, and Message is the text of the message. Custom actions and commands can be added using tags in the format <ActionName Param1 Param2 ...>.

# Development

Clone the repository to your local machine
Run npm install to install the dependencies
Build the project using npm run build
Run the project using npm start

# License

HermitScript is released under the MIT License. You are free to use, modify, and distribute the software as long as you follow the license terms.
