# My Conversation

## Introduction

Ruth: Hey there, how's it going? <Set,Mood,Neutral> <Shake,5,5>
Eve: Pretty good, thanks for asking. How about you? <Set,Mood,Good> <Name,Michael Smith,35,USA>

- I'm feeling great today > Great
- I'm feeling alright > Alright
- I'm not feeling too good > NotGood

## Great

Eve: That's fantastic to hear! <Jump, End>

## Alright

Eve: Well, at least it's not a bad day, right? <Wait, 3>
Ruth: Yeah, it could be worse.

- Yeah, it could be worse > Continue
- Actually, it's been a tough day > NotGood

## NotGood

Eve: Oh no, what's been going on? <Wait, 2>
Ruth: I've just been feeling a bit overwhelmed with work and personal stuff.

- Thanks for asking, but I don't want to talk about it > End
- Actually, it would be good to talk about it > Talk

## Talk

Eve: I'm sorry to hear that. Is there anything I can do to help? <Wait, 2>
Ruth: No, I think I just need to take some time for myself and recharge.

- Okay, take care > End
- Want to grab a coffee and chat? > Coffee

## Coffee

Eve: Okay, let's go. <Set,Location,CoffeeShop> <Jump, End>

## End

Eve: Well, it was nice talking to you. <Wait, 2>
Ruth: Yeah, you too. <Wait, 2>
Eve: Bye! <Wait, 2>
