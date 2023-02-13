<!--  -->

**SimpleConversation**
`Jack`(4): Hello Jill how are doing today?
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
