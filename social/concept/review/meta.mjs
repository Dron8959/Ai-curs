// What the owner needs next to each post: why it exists, who forwards it, what is unconfirmed. From PLAN.md sections 5 and 7.
export const META = {
  1: { type: 'Proof', why: 'The main promise in three seconds; "drawing comes alive" is the best-proven format in the niche.', fwd: 'A mom sends it to dad or grandma.', hold: 'Waiting for Anna: did a 6-year-old really draw the rainbow? (post 1 is held until she says yes)' },
  2: { type: 'Story', why: 'Before buying a kids\' product a parent looks at who is behind it. Pinned post.', fwd: 'A mom sends it to her partner.' },
  3: { type: 'Teach', why: 'Objection number one is safety. A reference post gets saved and forwarded.', fwd: 'A mom into the parents\' group chat, and to her partner.' },
  4: { type: 'Proof', why: 'Removes "I have no time": one evening, 39 minutes.', fwd: 'A mom to dad: "let\'s try it tonight".', hold: 'Waiting for Anna: is the 7:02 to 7:41 story really about Kamilla\'s game? If not, the reel is rebuilt without her name.' },
  5: { type: 'Opinion', why: 'A position people agree with and forward; it separates us from both "screens are evil" and "no AI means falling behind".', fwd: 'A mom to a friend or partner: "this is about us".' },
  6: { type: 'Teach', why: 'Explains the product in 15 seconds and removes "what would we even do".', fwd: 'A mom saves it for the night she tries lesson one.' },
  7: { type: 'Proof', why: 'The strongest proof and the strongest wish: "mine would love that". Pinned post.', fwd: 'A mom to her kid, or to grandma.' },
  8: { type: 'Opinion', why: 'Objection number two: "AI will make him lazy". The brand\'s main idea.', fwd: 'A mom to a skeptical partner or a teacher she knows.' },
  9: { type: 'Proof', why: 'Reviews from people who look like the viewer. Grandmothers open the gift question before the holidays.', fwd: 'A mom to her own mom.' },
  10: { type: 'Offer', why: 'The offer said plainly. Every other post leads here. Pinned post.', fwd: 'Saved or tapped, not forwarded.' },
};

// The skills pass (caption-writer-sms, hook-writer-sms, social/brand/voice.md): what it found and the proposed caption.
export const PASS = {
  1: {
    verdict: 'The caption is already close. Three small things.',
    notes: [
      'Hook (first line): 10 words, a forward-it ask, no hashtag, no emoji. Keeps the brand rule (12 words) and the Instagram share signal. Kept as is.',
      '"That\'s how our AI course for kids works" is filler. Replaced with the same sentence in present tense, so "AI course for kids" stays once for search.',
      '"You sit right next to them" becomes "You\'re side by side the whole time": "side by side" is a brand word (voice.md) and the line is shorter.',
      'Facts: "6-year-old" is from the old landing and is the open question for Anna. "Crayons" is visible in the drawing. No gender guessed.',
      'Left alone on purpose: one ask only (forwarding), 5 hashtags, no link, no long dash.',
    ],
    after: `Send this to the parent whose fridge is covered in drawings.

A 6-year-old drew this rainbow with crayons. One lesson later it was a cartoon.

In our AI course for kids, the kid has the idea and makes the drawing. The AI follows it. You're side by side the whole time.

#aiforkids #kidsart #kidsdrawing #creativekids #familyactivities`,
  },
  2: {
    verdict: 'Facts are clean. One structural fix, one question for you.',
    notes: [
      'Hook: "The first lesson is free. It\'s in our bio." is 9 words and is the one ask. Kept: the reel already opens with the face and the words on screen, so line 1 can do the offer.',
      'The second paragraph is one long block (4 sentences). The voice rule is one thought per line, so it is split into three short paragraphs. Same words, nothing added.',
      '"We" for who we are, "I" for what Anna built: kept on purpose, it is Anna talking.',
      'Facts checked against facts.md: Anna built every lesson, tested each on Kamilla at the kitchen table, what lost her attention got cut, Kamilla goes first. All present. Nothing invented.',
      'Question: scene 3 of the reel says "She checks homework the same day." On the site that is the Creator + Homework plan ($297), not the base course. The caption does not say it. Keep the line on screen, or drop it so nobody thinks homework checks come with every plan?',
      'AI label: the pictures are real photos, but once the cloned voice is in the reel the label goes ON.',
      'Voice: the lines are cloned and ready (Anna scenes 1, 3, 5; Kamilla scenes 2, 4). The last line is said by both together, so it is not made. Blocker: Anna\'s scene 5 line runs 0.5 s longer than its scene. Option A: add two beats to scene 5 (the reel becomes 0.9 s longer and I rebuild the music cut). Option B: voice only "We tested it all at our kitchen table." and leave "What lost her attention got cut." as text on screen.',
    ],
    after: `The first lesson is free. It's in our bio.

We're Anna and Kamilla. A mom and a daughter, not a corporation.

I built every lesson of this AI course for kids myself. Then I tested each one on Kamilla at our kitchen table. She's 10. What lost her attention got cut.

In the course she goes first. She shows the finished thing, then your kid makes their own.

#aiforkids #momanddaughter #kidsandai #familyactivities`,
  },
};
