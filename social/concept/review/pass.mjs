// The skills pass over every text of the first ten posts: captions, words on screen, voice lines.
// Rules used: mk-copywriting/references/ai-tells.md, mk-social, caption-writer-sms, hook-writer-sms, ig-human
// (its scripts are not installed here, so its checks are applied by hand), social/brand/voice.md, social/brand/facts.md.
// Lint of every line: node social/concept/review/texts.mjs. Nothing here is applied to the posts until the owner says ok.
//
// verdict: one line. notes: what was found. after: the proposed caption (null = keep as is).
// screen: proposed changes to words on screen or voice lines: [where, now, proposed].

export const COMMON = [
  'The words are clean: no stock vocabulary, no long dashes, no emoji, every fact is in facts.md, the eight reviews are word for word from the site. The machine feel comes from the shape, not the words.',
  'Fragment rhythm everywhere. "One lesson. Three steps." "She decided. She told the AI. She checked. She fixed." On a card on screen that is the format. In a caption or a voice line nobody talks like that. Fixed in captions and voice lines, kept on screen.',
  'The same phrases in every post. "our AI course for kids" is in all 10 captions, "you sit next to them" in 5, "Send this to..." opens 3 and closes a 4th, "the thinking stays with her/your child" is in 3 places. Seen one by one it is fine; on a profile people binge, it reads like a template. Varied below; the search phrase stays in 5 captions.',
  'The "not X, it is Y" shape (the number one AI tell): "Not a corporation", "Not more screen time", "is not a screen she scrolls", "Don\'t let AI think for your child. Teach them to think with it." Most of these are the brand\'s own lines from the site, so they stay, but each once, not twice in the same post.',
  'Tidy closers: a neat last line that could end any post ("Every lesson ends with something your kid made", "The thinking stays with your child", "Let them do the thinking"). Cut where they repeat what the post already said.',
  'Meaning lost in four places: post 5 says "she" with nobody named before it; post 7 says "a game you can play" (the viewer cannot play it); post 10 says "Then decide" (decide what); post 3 lists rule names without saying what they mean.',
];

export const PASS = {
  1: {
    verdict: 'Close to ready. Two small caption fixes, one voice line.',
    notes: [
      'Hook kept: 10 words, the share ask, no hashtag or emoji.',
      '"That\'s how our AI course for kids works" is filler: the same sentence in present tense instead, the search phrase stays once.',
      '"You sit right next to them" becomes "You\'re side by side the whole time" (brand word, and "sit next to them" is in four other posts).',
      'Fact confirmed by Anna on 12 Nov: a 6-year-old drew the rainbow. "Crayons" is visible in the drawing. No gender guessed.',
      'Voice line 3 is three fragments in a row. Said aloud it sounds read, not spoken.',
    ],
    after: `Send this to the parent whose fridge is covered in drawings.

A 6-year-old drew this rainbow with crayons. One lesson later it was a cartoon.

In our AI course for kids, the kid has the idea and makes the drawing. The AI follows it. You're side by side the whole time.

#aiforkids #kidsart #kidsdrawing #creativekids #familyactivities`,
    screen: [
      ['voice 3 (Anna)', "Kid's idea. AI follows the drawing. And you're right there.", "The idea is the kid's. The AI follows the drawing, and you're right there."],
    ],
  },
  2: {
    verdict: 'Facts clean. "Not a corporation" said four times; one long paragraph; one question for you.',
    notes: [
      'Hook kept: the reel opens with the faces, so line 1 can carry the offer.',
      '"Not a corporation" is on the cover, on screen, in the voice and in the caption. On screen it stays (it is the site\'s line), the caption drops it, and Kamilla\'s voice line gets a version a kid would say (next point).',
      'The second paragraph is four sentences in one block: split, same words.',
      'Kamilla saying "Not a corporation." sounds like a slogan from a 10-year-old. A line a kid would say is offered instead, but only if it is true that the company is just the two of you; otherwise the old line stays.',
      'Open question: scene 3 says "She checks homework the same day." On the site that is the Creator + Homework plan ($297). Keep it or drop it?',
      'Voice, scene 5: Anna\'s line is 0.5 s longer than the scene. A: two beats longer scene. B: voice only the first sentence.',
      'AI label ON once the cloned voice is in.',
    ],
    after: `The first lesson is free. It's in our bio.

We're Anna and Kamilla, a mom and her daughter.

I built every lesson of this AI course for kids myself. Then I tested each one on Kamilla at our kitchen table. She's 10. What lost her attention got cut.

In the course she goes first. She shows the finished thing, then your kid makes their own.

#aiforkids #momanddaughter #kidsandai #familyactivities`,
    screen: [
      ['voice 2 (Kamilla)', 'Not a corporation.', 'Just my mom and me.'],
    ],
  },
  3: {
    verdict: 'The most useful post of the ten. The caption list says rule names without what they mean; two slides use banned shapes.',
    notes: [
      'Hook kept: specific, 9 words, promises a list.',
      'Rule 3 "Some things AI never hears" reads like "AI cannot hear some things". Made plain: "Some things never get typed into an AI."',
      'Slide 4 "No DMs. No comments. Nobody your kid doesn\'t know." is a negation list (banned). Said as what is true instead.',
      'Rule 1 says "The account is the parent\'s" in the caption and "The account is yours, not theirs" on the slides: one wording, without the "not theirs" contrast.',
      '"Send it to a parent who needs it" is a stock ask and it is on slide 9 too. The post is meant for the parents\' group chat, so the ask says so.',
      'The number (9 in 10, Common Sense Media 2026) has its source on the slide and in the caption: kept.',
    ],
    after: `Five rules we set before any kid touches an AI tool.

1. The account is the parent's.
2. No chats with strangers.
3. Some things never get typed into an AI.
4. Links get a second look.
5. If it looks too perfect, check it.

Almost 9 in 10 American kids aged 9 to 17 already use AI, and almost half have never talked about safety with a parent (Common Sense Media, 2026). Every lesson of our AI course for kids is set up this way.

Drop it in your parents' group chat.

#aisafety #kidsandai #aiforkids #parentingtips #onlinesafety`,
    screen: [
      ['slides 1 and 8, rule 1', 'The account is yours, not theirs', 'The account is yours'],
      ['slides 1 and 8, rule 3, slide 5 title', 'Some things AI never hears', 'Some things never go into an AI'],
      ['slide 4 text', "No DMs. No comments. Nobody your kid doesn't know.", "The course has no DMs and no comments, so no stranger can reach your kid there."],
      ['slide 5 text', 'Kids learn what never to share with an AI. And why.', 'Kids learn what never to share with an AI, and why.'],
      ['slide 9 title', 'Send it to a parent who needs it.', "Drop it in your parents' group chat."],
    ],
  },
  4: {
    verdict: 'Still held: the 7:02 to 7:41 story needs Anna\'s yes. Text is fine apart from one repeated closer.',
    notes: [
      'Caption reads like a person: times, the corgi, "against each other at the same table". Kept.',
      'Scene 4 ends with "The thinking stayed with her." Post 8 is built on that idea and says it three times; here it goes, so post 8 keeps it.',
      'Scene 4 "She decided. She told the AI. She checked. She fixed." is four fragments, but it is a card that builds word by word on screen: kept.',
    ],
    after: null,
    screen: [
      ['scene 4, last line', 'The thinking stayed with her.', '(removed)'],
    ],
  },
  5: {
    verdict: 'The caption loses its meaning in the middle: "she" with no one named before.',
    notes: [
      '"A screen she makes on is not a screen she scrolls." In the reel Kamilla is on screen, so "she" works there. In the caption nobody is named, so a reader stops at "she".',
      'It is also the "not X" shape and a play on words. On screen it stays as the reel\'s one clever line; in the caption it is replaced with the plain fact behind it.',
      '"Kids don\'t need more screen time. They need a reason to show you something." is the brand\'s own line from the site: kept.',
      '"our AI course for kids" becomes "our course": the phrase is in every other caption.',
    ],
    after: `Send this to the person you argue about screen time with.

Kids don't need more screen time. They need a reason to show you something.

In our course every lesson ends with something your kid made to show you: a game, a cartoon, a song.

#screentime #parentingtips #aiforkids #kidsandai`,
    screen: [],
  },
  6: {
    verdict: 'Caption fine apart from the closer. The voice lines are written, not spoken.',
    notes: [
      'In the caption "Watch: / Make: / Show:" are the names of the method, not a colon trick: kept.',
      '"Every lesson ends with something your kid made." is a tidy closer and post 5 says the same: cut.',
      '"you sit next to them" (fifth time across the posts) becomes "you stay right there".',
      'Kamilla\'s voice lines say "Watch: I show you the finished thing." Nobody speaks with a colon. Rewritten the way a 10-year-old would say it; the cards on screen stay.',
    ],
    after: `Save this for the night you try lesson one.

One lesson of our AI course for kids takes 6 to 20 minutes and has three steps. Watch: Kamilla shows the finished thing first. Make: your kid builds their own and you stay right there. Show: play it, show the family, send it to grandma.

#aiforkids #kidsandai #familyactivities #homeschoolideas`,
    screen: [
      ['voice 1 (Kamilla)', 'One lesson. Three steps.', 'One lesson has three steps.'],
      ['voice 2 (Kamilla)', 'Watch: I show you the finished thing.', 'First you watch. I show you the finished thing.'],
      ['voice 3 (Kamilla)', 'Make: you build yours, with a parent next to you.', 'Then you make your own, with a parent next to you.'],
      ['voice 4 (Kamilla)', 'Show: play it, and send it to grandma.', 'Then you show it. Play it, send it to grandma.'],
      ['voice 5 (Kamilla)', 'One lesson. One real thing.', 'One lesson, and you made a real thing.'],
    ],
  },
  7: {
    verdict: 'One phrase promises what is not there: "a game you can play".',
    notes: [
      '"a game you can play" reads as "you, the viewer, can play it". There is no link to the game. Changed to what is true: the game is hers.',
      'The list after the colon is fine; split into two sentences so the age is not lost in the middle.',
      '"with a parent sitting next to them" (repeat) becomes "with a parent right there"; "our AI course" becomes "our course".',
    ],
    after: `The first lesson is free. Link in bio.

Everything in this video was made by Kamilla. She's 10. A cartoon with her own characters, a game of her own and a sticker pack of her character. No code.

That's the kind of thing kids make in our course, with a parent right there.

#aiforkids #kidscartoon #kidsgames #creativekids`,
    screen: [
      ['scene 3 (screen)', 'A game you can play.', 'A game she made.'],
      ['voice 3 (Kamilla)', 'A game you can play.', 'A game I made.'],
    ],
  },
  8: {
    verdict: 'One idea said three times in 17 seconds, and the hook repeats the formula of posts 1 and 5.',
    notes: [
      'Three posts open with "Send this to...". This one gets a different hook with the same ask, aimed at the objection itself.',
      'The parent\'s question "Will AI think for my kid?" followed by the answer is allowed (it is the reader\'s own question, not a staged one): kept.',
      'Scene 3 pill "the thinking stays with her", scene 4 "Don\'t let AI think for your child. Teach them to think with it." and scene 5 "Let them do the thinking." are the same thought three times. Scene 4 is the brand\'s main line: it stays. The other two go; the end card asks for the free lesson instead.',
      'The caption\'s last line "The thinking stays with your child." is the fourth time: cut.',
      'Voice: Anna\'s voice is cloned for all five lines, but line 3 runs 1.3 s longer than its scene (a person needs 5.4 s, the scene has 4.1). The shorter line below fits; otherwise the scene gets longer.',
    ],
    after: `Know a parent who thinks AI makes kids lazy? Send them this.

Will AI think for my kid? Only if the AI is the one with the ideas.

In every lesson of our course the child decides what to make, tells the AI, checks what comes back and fixes it.

#kidsandai #aiforkids #parentingtips #criticalthinking`,
    screen: [
      ['scene 3 pill and cover', 'the thinking stays with her', '(removed)'],
      ['scene 5 (end card)', 'Let them do the thinking.', 'Try it with yours.'],
      ['voice 3 (Anna)', 'In every lesson she decides, tells the AI, checks it, fixes it.', 'She decides, tells the AI, checks it and fixes it.'],
      ['voice 5 (Anna)', 'Let them do the thinking.', "Try the first lesson tonight. It's free."],
    ],
  },
  9: {
    verdict: 'Clean. No changes proposed.',
    notes: [
      'All six quotes checked word for word against social/media/landing/reviews/quotes.md: they are exact sentences from the reviews. Jessica\'s "actually" is hers, so it stays.',
      'The note that the families got the course free is in the hook, on slides 1, 2 and 9 and in the caption: required by the rules, kept.',
      'Facts match: four grandmothers and four moms, kids 7 to 10, cartoons, songs, games and a website.',
    ],
    after: null,
    screen: [],
  },
  10: {
    verdict: 'Close. One vague line, and dashes in "10–20 min".',
    notes: [
      'Slide 5 ends with "Then decide." Decide what? Said in full.',
      '"10–20 min" uses an en dash on slides 1 and 6; the house rule is no dashes, so a hyphen.',
      'The lint flagged "If it isn\'t a fit... It\'s the first lesson" as a "not X, it is Y": false alarm, two separate facts. Kept.',
      'Caption keeps "our AI course for kids 6 to 14": this is the offer, the search phrase belongs here.',
    ],
    after: null,
    screen: [
      ['slide 5 text', 'Then decide.', 'Then decide if you want the rest.'],
      ['slides 1 and 6', '10–20 min', '10-20 min'],
    ],
  },
};
