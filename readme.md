# HermitScript

HermitScript is a software designed to make writing dialogue for video games easier and more efficient. Written in TypeScript and using Node.js, this software provides a clear and concise syntax for writing dialogue.

# Table of Contents

- [Download](#download)
- [Features](#features)
- [Requirements](#requirements)
- [Syntax](#syntax)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

# Download

You can download the latest version of HermitScript from the [releases](google.com) page.

# Features

- A clear and concise syntax for writing dialogue
- Easy integration with video games and other related software
- Support for custom actions and commands in dialogue

# Syntax

The syntax for writing dialogue in HermitScript is as follows:

```md
<!--  -->

**SimpleConversation**
`Jack`(0): Hello Jill how are doing today?
`Jill`(1): I'm doing great!
`Jack`(1): Me too! Want to go climb up that steep hill?
`Jill`(3): Maybe later, I'm a little tired.
`Jack`(2): Oh, okay. I'll see you later then.

<!--  -->

**ConversationWithQuestions**
`Jack`(0): Hello Jill how are doing today?
`Jill`(1): I'm doing great! How are you?

- I'm doing great! **ConversationWithQuestionsGreat**
- I'm doing okay. **ConversationWithQuestionsOkay**
- I'm doing terrible. **ConversationWithQuestionsTerrible**

**ConversationWithQuestionsGreat**
`Jack`(0): Me too! What amazing weather we're having!

**ConversationWithQuestionsOkay**
`Jack`(0): I'm alright i guess.

**ConversationWithQuestionsTerrible**
`Jack`(0): Nothing is going right for me today.

<!--  -->

**FunctionsExample**
`Jack`(0): Hello Jill how are doing today? <Wave 45 /> <!-- The /> at the end indicates that this function is run after the text is displayed -->
`Jill`(1): I'm busy right now! <Shake 2 2> <!-- The > at the end indicates that this function is run before the text is displayed -->
`Jack`(2): Oh, okay. I'll see you later then.

<!-- Note: Dont add function to the end of questions, that wouldn't make much sense anyway -->
```

Each conversation is marked by a heading in the format **ConversationName**. Each line of dialogue is written in the format ``Speaker(subimage): Message, where Speaker is the name of the speaker, subimage is an optional subimage number, and Message is the text of the message. Custom actions and commands can be added using tags in the format <ActionName Param1 Param2 ...>.

# Development

Clone the repository to your local machine
Run npm install to install the dependencies
Run tsc index.ts to compile the TypeScript code
Run node index.js to run the program

# License

HermitScript is released under the MIT License. You are free to use, modify, and distribute the software as long as you follow the license terms.
