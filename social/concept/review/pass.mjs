// The text remake of the first ten posts (12 Nov 2026): what the skills found, and what was changed in
// content.mjs, reels.mjs and sound/VOICEOVER.md. Rules used: mk-copywriting/references/ai-tells.md, mk-social
// (short-form video, carousel frameworks), caption-writer-sms, hook-writer-sms, ig-human (its checks by hand),
// social/brand/voice.md and social/brand/facts.md. Lint of every line: node social/concept/review/texts.mjs.
//
// verdict: one line. notes: what was found. before/after: the caption (after = null means unchanged).
// screen: changes to words on screen and voice lines: [where, before, after]. open: what still needs the owner.

export const COMMON = [
  'The words were already clean: no stock vocabulary, no long dashes, no emoji, every fact from facts.md, the eight reviews word for word from the site. The machine feel came from the shape, so the remake is about shape.',
  'Fragment rhythm. "One lesson. Three steps." "She decided. She told the AI. She checked. She fixed." On a card that builds on screen it is the format and it stays. In captions and voice lines nobody talks like that, so those are rewritten as sentences.',
  'The same phrases in every post. "our AI course for kids" was in all 10 captions (now 6, where the search phrase earns its place), "you sit next to them" in 5 (now 1), "Send this to..." opened 3 (now 2), "the thinking stays with her" was in 3 places of one reel (now 1 plus the end card).',
  'The "not X, it is Y" shape, the number one AI tell. "Not a corporation", "Not more screen time", "A screen she makes on is not a screen she scrolls", "Don\'t let AI think for your child. Teach them to think with it." These are the brand\'s own lines from the site, so each stays once, on screen, where it is the headline. Captions say the plain fact instead.',
  'Tidy closers that could end any post ("Every lesson ends with something your kid made", "The thinking stays with your child"): cut where they repeat what the post already said.',
  'Meaning lost in four places, all fixed: post 5 said "she" with nobody named; post 7 promised "a game you can play"; post 10 said "Then decide" without what; post 3 named rules without saying what they mean.',
  'One concrete detail added where the picture backs it: the truck on the rainbow (post 1). Nothing else was invented.',
];

export const PASS = {
  1: {
    verdict: 'Two caption lines and one voice line.',
    notes: [
      'Hook kept: 10 words, the share ask, no hashtag, no emoji.',
      '"That\'s how our AI course for kids works" was filler. Now the sentence says what happens, and one specific detail from the picture is in: the truck on top of the rainbow is in both the drawing and the cartoon.',
      '"You sit right next to them" (in five posts) became "You\'re side by side the whole time", a brand word.',
      'Voice line 3 was three fragments; now one spoken sentence.',
      'Fact confirmed by Anna on 12 Nov: a 6-year-old drew the rainbow.',
    ],
    before: `Send this to the parent whose fridge is covered in drawings.

A 6-year-old drew this rainbow with crayons. One lesson later it was a cartoon.

That's how our AI course for kids works. The kid has the idea and makes the drawing. The AI follows it. You sit right next to them.

#aiforkids #kidsart #kidsdrawing #creativekids #familyactivities`,
    screen: [
      ['voice 3 (Anna)', "Kid's idea. AI follows the drawing. And you're right there.", "The kid draws it, the AI follows it, and you're right there."],
    ],
  },
  2: {
    verdict: 'Caption split into sentences; Kamilla gets a line a kid would say; the long voice line shortened.',
    notes: [
      'Hook kept: the reel opens with the faces, so line 1 can carry the offer.',
      'The second paragraph was four sentences in one block: now three short ones. "Not a corporation" stays once, as its own sentence.',
      'Kamilla\'s voice line "Not a corporation." sounded like a slogan from a 10-year-old. Now "My mom and me." On screen the card still says "Not a corporation."',
      'Anna\'s line in scene 5 ran 0.5 s longer than the scene. Now she says the first half; "What lost her attention got cut" stays on screen as text.',
      'The last line ("A mom, a daughter, and you") is said by both together, so it is not cloned. It stays text on the end card.',
    ],
    before: `The first lesson is free. It's in our bio.

We're Anna and Kamilla, a mom and a daughter, not a corporation. I built every lesson of this AI course for kids myself and tested each one on Kamilla at our kitchen table. She's 10. What lost her attention got cut.

In the course she goes first. She shows the finished thing, then your kid makes their own.

#aiforkids #momanddaughter #kidsandai #familyactivities`,
    screen: [
      ['voice 2 (Kamilla)', 'Not a corporation.', 'My mom and me.'],
      ['voice 5 (Anna)', 'We tested it all at our kitchen table. What lost her attention got cut.', 'We tested every lesson at our kitchen table.'],
    ],
    open: 'Scene 3 says "She checks homework the same day." On the site that is the Creator + Homework plan ($297), not the base course. Keep it on screen, or drop it?',
  },
  3: {
    verdict: 'The rules now say what they mean; one negation list rewritten; the ask names where to send it.',
    notes: [
      'Value-Stack carousel (mk-social): the cover promises five, the slides deliver five, slide 8 is the screenshot. Structure kept.',
      'Rule 3 "Some things AI never hears" read as "AI cannot hear some things". Now "Some things stay out of AI" on the slides and "stay out of AI, and the kid knows which" in the caption.',
      'Rule 1 was "The account is the parent\'s" in the caption and "yours, not theirs" on the slides: now "The account is yours" everywhere, without the contrast.',
      'Slide 4 "No DMs. No comments. Nobody your kid doesn\'t know." was a negation list. Now it says what is true: the course has no DMs and no comments, so no stranger can reach your kid there.',
      '"Send it to a parent who needs it" was a stock ask. The post is built for the parents\' group chat, so the caption and slide 9 say that.',
      'The number (9 in 10, Common Sense Media 2026) keeps its source on the slide and in the caption.',
    ],
    before: `Five rules we set before any kid touches an AI tool.

1. The account is the parent's.
2. No chats with strangers.
3. Some things AI never hears.
4. Links get a second look.
5. If it looks too perfect, check it.

Almost 9 in 10 American kids aged 9 to 17 already use AI, and almost half have never talked about safety with a parent (Common Sense Media, 2026). These five are how every lesson of our AI course for kids is set up.

Send it to a parent who needs it.

#aisafety #kidsandai #aiforkids #parentingtips #onlinesafety`,
    screen: [
      ['slides 1 and 8, rule 1', 'The account is yours, not theirs', 'The account is yours'],
      ['slides 1, 5 and 8, rule 3', 'Some things AI never hears', 'Some things stay out of AI'],
      ['slide 4 text', "No DMs. No comments. Nobody your kid doesn't know.", 'The course has no DMs and no comments, so no stranger can reach your kid there.'],
      ['slide 9 title', 'Send it to a parent who needs it.', "Drop it in your parents' group chat."],
    ],
  },
  4: {
    verdict: 'Caption kept. One repeated closer removed from the reel. Still held on one fact.',
    notes: [
      'The caption reads like a person: the times, the corgi, "against each other at the same table". Kept.',
      'Scene 4 ended with "The thinking stayed with her." Post 8 owns that idea; here it was a second closer under a card that already landed. Removed.',
      'The four-line card "She decided. She told the AI. She checked. She fixed." builds word by word on screen: that is the format, kept.',
    ],
    before: null,
    screen: [
      ['scene 4, line under the card', 'The thinking stayed with her.', '(removed)'],
    ],
    open: 'Anna confirms the 7:02 to 7:41 story is about Kamilla\'s game. Until then the post does not go out, and the voice is not cloned (the lines may change).',
  },
  5: {
    verdict: 'The caption no longer loses the reader at "she".',
    notes: [
      '"A screen she makes on is not a screen she scrolls" needs Kamilla in the picture to work. In the reel she is; in the caption nobody was named. The caption now gives the plain fact behind the line; the line itself stays on screen as the reel\'s one clever card.',
      '"Kids don\'t need more screen time. They need a reason to show you something." is the site\'s line: kept as the hook of the body.',
      '"our AI course for kids" became "our course": the search phrase is already in the posts around it.',
    ],
    before: `Send this to the person you argue about screen time with.

Kids don't need more screen time. They need a reason to show you something. A screen she makes on is not a screen she scrolls.

In our AI course for kids every lesson ends with a thing to show, like a game or a cartoon.

#screentime #parentingtips #aiforkids #kidsandai`,
    screen: [],
  },
  6: {
    verdict: 'Closer cut from the caption; Kamilla\'s five voice lines rewritten as speech.',
    notes: [
      'In the caption "Watch: / Make: / Show:" are the names of the three steps, so the colons stay.',
      '"Every lesson ends with something your kid made." was a tidy closer and post 5 says the same. Cut.',
      '"you sit next to them" became "you stay right there".',
      'The voice lines said "Watch: I show you the finished thing." Nobody speaks a colon. Now each step is a sentence a 10-year-old would say. The cards on screen keep the one-word steps.',
    ],
    before: `Save this for the night you try lesson one.

One lesson of our AI course for kids takes 6 to 20 minutes and has three steps. Watch: Kamilla shows the finished thing first. Make: your kid builds it and you sit next to them. Show: play it, show the family, send it to grandma.

Every lesson ends with something your kid made.

#aiforkids #kidsandai #familyactivities #homeschoolideas`,
    screen: [
      ['voice 1 (Kamilla)', 'One lesson. Three steps.', 'One lesson has three steps.'],
      ['voice 2 (Kamilla)', 'Watch: I show you the finished thing.', 'First you watch. I show you the finished thing.'],
      ['voice 3 (Kamilla)', 'Make: you build yours, with a parent next to you.', 'Then you make yours, with a parent next to you.'],
      ['voice 4 (Kamilla)', 'Show: play it, and send it to grandma.', 'Then you show it. Play it, send it to grandma.'],
      ['voice 5 (Kamilla)', 'One lesson. One real thing.', 'One lesson, and you made a real thing.'],
    ],
  },
  7: {
    verdict: '"A game you can play" promised what is not there. Fixed on screen, in the voice and in the caption.',
    notes: [
      'The viewer cannot play Kamilla\'s game from a reel. Now the card says "A game she made." and she says "A game I made."',
      'The caption\'s long list after a colon is split so her age is not lost in the middle.',
      '"with a parent sitting next to them" became "with a parent right there"; "our AI course" became "our course".',
    ],
    before: `The first lesson is free. Link in bio.

Everything in this video was made by Kamilla, who is 10: a cartoon with her own characters, a game you can play and a sticker pack of her own character. No code.

That's what kids make in our AI course, with a parent sitting next to them.

#aiforkids #kidscartoon #kidsgames #creativekids`,
    screen: [
      ['scene 3 (screen)', 'A game you can play.', 'A game she made.'],
      ['voice 3 (Kamilla)', 'A game you can play.', 'A game I made.'],
    ],
  },
  8: {
    verdict: 'New hook aimed at the objection; the idea said once instead of three times; the long voice line fits now.',
    notes: [
      'Three posts opened with "Send this to...". This one now opens with the parent\'s objection as a question, then the ask: "Know a parent who thinks AI makes kids lazy? Send them this."',
      '"Will AI think for my kid?" followed by the answer is the reader\'s own question, so it stays (the ban is on staged ones like "The result?").',
      'The reel said the same thing three times: a handwritten "the thinking stays with her" under the steps, then "Don\'t let AI think for your child. Teach them to think with it.", then the end card "Let them do the thinking." The handwritten note is gone; the brand line and the end card (which echoes the hook, as every reel does) stay.',
      'The caption\'s closer "The thinking stays with your child." was the fourth time: cut.',
      'Anna\'s voice line 3 ran 1.3 s longer than its scene; the shorter line fits. Her hook line and the brand line did not fit either, so scenes 1 and 2 got a beat more each (the reel is 19.4 s now, music still on the bar lines) and the brand line is split: the first half in scene 4, the second half over the end card.',
    ],
    before: `Send this to a parent who is on the fence about AI.

Will AI think for my kid? Only if the AI is the one with the ideas. In every lesson of our AI course for kids the child decides what to make, tells the AI, checks what comes back and fixes it.

The thinking stays with your child.

#kidsandai #aiforkids #parentingtips #criticalthinking`,
    screen: [
      ['scene 3, handwritten note', 'the thinking stays with her', '(removed)'],
      ['voice 3 (Anna)', 'In every lesson she decides, tells the AI, checks it, fixes it.', 'She decides, tells the AI, checks it and fixes it.'],
      ['voice 4 (Anna)', "Don't let AI think for your child. Teach them to think with it.", "Don't let AI think for your child."],
      ['voice 5 (Anna)', 'Let them do the thinking.', 'Teach them to think with it.'],
    ],
  },
  9: {
    verdict: 'No change.',
    notes: [
      'All six quotes checked word for word against social/media/landing/reviews/quotes.md: exact sentences from the reviews. Jessica\'s "actually" is hers.',
      'The note that the families got the course free is in the hook, on slides 1, 2 and 9 and in the caption: required, kept.',
      'Four grandmothers and four moms, kids 7 to 10, cartoons, songs, games and a website: matches facts.md.',
    ],
    before: null,
    screen: [],
  },
  10: {
    verdict: 'One vague line made plain; dashes out.',
    notes: [
      'Slide 5 ended with "Then decide." Now "Then decide if you want the rest."',
      '"10–20 min" used an en dash on slides 1 and 6; the house rule is no dashes.',
      'The lint flagged "If it isn\'t a fit... It\'s the first lesson" as a contrast reveal: false alarm, two separate facts. Kept.',
      'The caption keeps "our AI course for kids 6 to 14": this is the offer, the search phrase belongs here.',
    ],
    before: null,
    screen: [
      ['slide 5 text', 'Then decide.', 'Then decide if you want the rest.'],
      ['slides 1 and 6', '10–20 min', '10-20 min'],
    ],
  },
};
