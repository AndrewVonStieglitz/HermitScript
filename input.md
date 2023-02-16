# Conversation 1

## Dialogue 1

- Character A: Hello there!
- Character B: Hi, how are you? <Help "Person", 22, 11> <Shake 3, 6>
- Character A: I'm doing well, thanks. How about you? <Shake 4, 7>
- Character B: I'm good too. What are you up to today? <Action>
- Character A: Not much, just exploring the area. What about you?
- Character B: I'm on a quest to find the magical sword of legend!
  - options:
    - text: Yes
      goto: Dialogue 2
    - text: No
      goto: Dialogue 3

## Dialogue 2

- Character A: Wow, that sounds exciting. Do you need any help?
- Character B: Sure, I could use a hand. Let's go! <StarQuest "magical asss sword", "flaming", 22>

## Dialogue 3

- Character A: Oh, okay. Good luck with your quest!
