// Stage 3a of next week's pack: every word of the 21 posts. Captions, voice lines (reels) and slides (carousels).
// Facts: social/brand/facts.md, quotes word for word from social/media/landing/reviews/quotes.md, general knowledge
// about how AI works said simply. Voice rules: social/brand/voice.md. Checked with node social/concept/review/texts.mjs rules.
// Sales posts (owner, 16 Nov: about one in 7-10): 26 and 30 say what the course costs, 31 adds one price line.

export const TEXTS = {
  11: { who: 'Anna', voice: [
      'Why does AI draw six fingers?',
      'It can paint a face that looks like a photo.',
      'But in its photos, hands are half hidden.',
      'It knows how a hand looks. Not how many fingers.',
      'So kids count the fingers.'],
    caption: `Send this to the kid who asks you everything.

AI can paint a face that looks like a photo and still give someone six fingers. It learned hands from millions of pictures where they're half hidden, holding a cup or tucked in a pocket. It knows how a hand looks, not how many fingers it has.

In our lessons kids check what the AI makes. Counting fingers is a good start.

#aiforkids #kidsandai #aiart #curiouskids` },

  12: { slides: [
      ['How much AI at 6, 10 and 14?', 'The younger the kid, the less they touch the keyboard.'],
      ['Age 6', 'They talk, you type. The idea is theirs, the keyboard is yours.'],
      ['Age 10', 'They do most of it. You sit next to them and help when they ask.'],
      ['Age 14', 'You stay in the room. They run it, you see what they make.'],
      ['At every age', 'The account is yours and the idea is theirs.'],
      ['Save this for the first lesson.', 'One course for kids 6 to 14, made side by side with a parent.']],
    caption: `How much should a kid do with AI on their own? It depends on the age.

6: they talk, you type. 10: they do most of it. 14: you stay in the room. At every age the idea is theirs and the account is yours.

That's how our AI course for kids 6 to 14 is set up. Save this for the first lesson.

#aiforkids #parentingtips #kidsandai #screentime` },

  13: { who: 'Kamilla', voice: [
      'I\'m ten, and I made this cartoon.',
      'I didn\'t draw a single frame.',
      'I told the AI my story and my characters.',
      'Then I checked every scene and fixed the ones that came out wrong.',
      'About twenty minutes. Two or three tries a scene.'],
    caption: `Send this to someone who thinks kids just watch cartoons.

Kamilla is 10. She made this cartoon without drawing a single frame. She told the AI her story and her characters, checked every scene and fixed the ones that came out wrong. About 20 minutes, two or three tries a scene.

That's one project in our AI course for kids.

#aiforkids #kidscartoon #creativekids #kidsandai` },

  14: { who: 'Anna', voice: [
      'Five safe ways to give your kid AI.',
      'One. It\'s your account, not theirs.',
      'Two. You sit side by side. Three. No chats with strangers.',
      'Four. Some things never go into an AI. Five. Too perfect? Check it.',
      'Comment RULES and I\'ll send you the fridge card.'],
    caption: `Comment RULES and I'll send you the fridge card.

1. Your account, not theirs. Your kid never signs up alone.
2. You sit side by side.
3. No chats with strangers.
4. Some things stay out of AI: full name with school, address, passwords.
5. If it looks too perfect, check it.

Every lesson of our AI course for kids is set up this way.

#aisafety #kidsandai #parentingtips #onlinesafety #aiforkids` },

  15: { who: 'Anna', voice: [
      'How does AI draw from words?',
      'It doesn\'t start with a blank page. It starts with static, like an old TV.',
      'Step by step it removes a little noise, nudged toward the words.',
      'Until the picture matches what you asked for.',
      'In our lessons, the words are your kid\'s idea.'],
    caption: `Comment GAME and I'll send you the free first lesson.

AI doesn't draw on a blank page. It starts with pure static, like an old TV, and removes a little noise at a time, each step nudged toward the words it was given. That's why better words make better pictures.

In our AI course for kids the words are your kid's idea.

#aiforkids #aiart #kidsandai #curiouskids` },

  16: { who: 'Anna', voice: [
      'Tonight, your kid can make a game.',
      'Leave your email. No card.',
      'Ten to twenty minutes, on a laptop or a tablet.',
      'Then you play it against each other.',
      'Comment GAME and I\'ll send you the link.'],
    caption: `Comment GAME and I'll send you the link to the free first lesson.

Leave your email, no card. Your kid builds a game in 10 to 20 minutes on a laptop or a tablet, with you right there. Then you play it against each other on the couch.

#aiforkids #kidsgames #familygamenight #kidsandai` },

  17: { slides: [
      ['What 4 grandmothers made with AI', 'A cartoon, a song, a gift and a game.'],
      ['They tried it first.', 'Before launch, we asked families to tell us what really happened at their table. Four of them were grandmothers.'],
      ['Margaret · cartoon', '“We made a little cartoon together, and he was so proud of it.”'],
      ['Susan · song', '“We made a song together, and she wanted to show it to everyone in the family!”'],
      ['Linda · gift', '“I wanted to give my grandson something more meaningful than another toy.”'],
      ['Patricia · game', '“We created a little game together, and seeing her excitement was priceless.”'],
      ['Send this to your mom before the holidays.', 'They received the course free and shared honest feedback. Names and photos are used with their permission.']],
    caption: `Send this to your mom before the holidays.

Four grandmothers tried our course with their grandkids before launch. They made a cartoon, a song, a game and a gift that wasn't another toy.

They received the course free and shared honest feedback. Names and photos are used with their permission.

#grandparents #aiforkids #giftideas #familyactivities` },

  18: { who: 'Anna', voice: [
      'Why does AI sound so sure when it\'s wrong?',
      'It isn\'t looking anything up.',
      'It writes the most likely next word, again and again.',
      'Likely and true aren\'t the same thing.',
      'So kids check what comes back.'],
    caption: `Send this to the parent whose kid uses ChatGPT for homework.

A chatbot doesn't look anything up. It writes the most likely next word, again and again. Likely and true aren't the same thing, and it sounds just as calm either way.

In every lesson of our course kids check what the AI gives back, then fix it.

#kidsandai #aiforkids #criticalthinking #parentingtips` },

  19: { who: 'Anna', voice: [
      'Your kid is six. Can they do this?',
      'They don\'t need to read or type.',
      'They talk, and you type.',
      'The idea is theirs. The keyboard is yours.',
      'Comment GAME for the free first lesson.'],
    caption: `Comment GAME and I'll send you the free first lesson.

A 6-year-old doesn't need to read or type to make something with AI. They talk, you type, and the idea stays theirs.

Our AI course is for kids 6 to 14, made side by side with a parent. Lessons take 6 to 20 minutes.

#aiforkids #kidsactivities #kidsandai #parentingtips` },

  20: { slides: [
      ['Is this picture real? 4 checks', 'Fakes hide in the boring parts.'],
      ['1 · Hands', 'Count the fingers. Look at how they hold things.'],
      ['2 · Letters', 'Signs, labels and logos. AI often scrambles the words.'],
      ['3 · Shadows', 'Light comes from one place. Shadows should agree.'],
      ['4 · Edges', 'Hair, ears, fences. Look for things melting into the background.'],
      ['Save this for the next picture that looks too perfect.', 'No single check is proof. Together they are a good start.']],
    caption: `Save this for the next picture that looks too perfect.

Four quick checks: hands and fingers, letters on signs, shadows that point different ways, edges melting into the background. None of them is proof on its own, but together they're a good start.

Spotting fakes is one of the safety lessons in our AI course for kids.

#aisafety #kidsandai #medialiteracy #parentingtips` },

  21: { who: 'Kamilla', voice: [
      'I made a character.',
      'Then I turned her into stickers.',
      'Happy, surprised, silly. A whole pack.',
      'That was one lesson.',
      'What would your character be?'],
    caption: `Send this to the family group chat.

Kamilla, 10, made her own character and turned it into a sticker pack. Happy, surprised, silly, a whole set.

That's one of the projects in our AI course for kids.

#aiforkids #stickers #creativekids #kidsandai` },

  22: { who: 'Anna', voice: [
      'Is AI alive? It talks like a friend.',
      'It learned how people write by reading a huge amount of text.',
      'So it sounds like a person.',
      'But it doesn\'t eat, or sleep, or miss you.',
      'Ask your kid what they think.'],
    caption: `Ask your kid first, then send this to them.

AI talks like a friend because it learned from a huge amount of text that people wrote. So it sounds like a person. It doesn't eat, sleep or miss anyone.

#kidsandai #aiforkids #curiouskids #parentingtips` },

  23: { who: 'Anna', voice: [
      'A cartoon for grandma this Thanksgiving.',
      'Your kid draws it. Crayons are fine.',
      'Then the AI turns the drawing into a cartoon.',
      'The idea and the drawing stay theirs.',
      'Start with the free first lesson. Comment GAME.'],
    caption: `Comment GAME and I'll send you the free first lesson.

Thursday is Thanksgiving. A drawing your kid made, turned into a cartoon, is a gift grandma will keep. In our course the kid has the idea and makes the drawing, and the AI follows it.

The first lesson is free and ends with a game. The cartoon comes later in the course.

#thanksgiving #giftsforgrandma #aiforkids #kidsart` },

  24: { slides: [
      ['What your kid should never tell an AI', 'The chatbot is friendly. Kids tell friends everything.'],
      ['Full name with their school', 'Together they point to one real kid.'],
      ['Home address', 'Or where they are right now.'],
      ['Passwords and codes', 'Not even “just to test it”.'],
      ['Photos of their face', 'Pictures stay with the family.'],
      ['Make the list together', 'So they know why each thing is on it. Comment RULES for the fridge card.']],
    caption: `Comment RULES and I'll send you the fridge card.

A chatbot is friendly, and kids tell friends everything. Four things stay out: full name with their school, home address or where they are right now, passwords, photos of their face.

What never to share with an AI is one of the safety lessons in our course.

#aisafety #onlinesafety #kidsandai #parentingtips` },

  25: { who: 'Anna', voice: [
      'Ask AI the same question twice.',
      'You\'ll often get two different answers.',
      'It picks its words with a little chance each time.',
      'So try it tonight, then check one fact together.',
      'Same question. Two answers.'],
    caption: `Save this and try it tonight with your kid.

Ask an AI the same question twice and you'll often get two different answers. It picks its words with a little chance each time. Then check one of the facts together.

#kidsandai #aiforkids #criticalthinking #familyactivities` },

  26: { who: 'Anna', voice: [
      'Do I need to know AI first?',
      'No. Everything starts from zero, for both of you.',
      'A laptop or a tablet. Nothing to install.',
      'The full course is one hundred ninety-seven dollars, paid once.',
      'Or start with the free first lesson.'],
    caption: `Comment GAME and I'll send you the free first lesson.

You don't need to know anything about AI. Every lesson starts from zero for both of you, on a laptop or a tablet, with nothing to install.

The full course is $197, paid once, no subscription. With Anna checking homework the same day, it's $297.

#aiforkids #parentingtips #kidsandai #learnai` },

  27: { who: 'Anna', voice: [
      'A song from her own words.',
      'Your kid writes the words. The AI makes the music.',
      'Susan, a grandmother, made one with her granddaughter.',
      'Here\'s what she told us.',
      'Send this to grandma.'],
    caption: `Send this to grandma.

In one of our lessons your kid writes the words and the AI makes the music. Susan, grandmother of an 8-year-old, told us: "We made a song together, and she wanted to show it to everyone in the family!"

Susan's family got the course free before launch and shared honest feedback.

#aiforkids #grandparents #kidsmusic #familyactivities` },

  28: { who: 'Anna', voice: [
      'Is that Kamilla, or her AI version?',
      'If a lesson is led by an AI version of Kamilla, it says so.',
      'Every time.',
      'Kids should always know who they\'re talking to.',
      'One rule for every app.'],
    caption: `Save this. It's a rule for every app, not just ours.

If a lesson in our course is led by an AI version of Kamilla, the lesson says so. Kids should always know whether they're talking to a person or to an AI.

#aisafety #kidsandai #aiforkids #parentingtips` },

  29: { who: 'Anna', voice: [
      'How does a crayon drawing become a cartoon?',
      'The AI doesn\'t start over. It starts from the drawing.',
      'It keeps the shapes and redraws them in a new style.',
      'That\'s why the truck on the rainbow is still there.',
      'The idea stays the kid\'s.'],
    caption: `Send this to the parent whose fridge is covered in drawings.

When AI turns a kid's drawing into a cartoon, it doesn't start over. It starts from the drawing, keeps the shapes and redraws them in a new style. That's why the monster truck on top of the rainbow is still there.

A 6-year-old drew this rainbow in one of our lessons.

#kidsart #aiforkids #kidsdrawing #creativekids` },

  30: { slides: [
      ['What it costs. What you get.', 'Two plans, both paid once.'],
      ['Creator · $197', 'The whole course: every lesson and project, for you and your kid, at your own pace.'],
      ['Creator + Homework · $297', 'Everything in Creator, and Anna checks homework the same day.'],
      ['No subscription', 'No sales calls. Payment through Stripe.'],
      ['Less than a month of tutoring', 'Most families do a lesson every day or two and finish in about two weeks.'],
      ['Start free', 'The first lesson is free. No card, just an email.']],
    caption: `Save this for when you decide.

Creator is $197, paid once: the whole course, every lesson and project, for you and your kid, at your own pace. Creator + Homework is $297: the same, plus Anna checks homework the same day.

Both are paid once, and nobody will call to sell you anything. The first lesson is free.

#aiforkids #kidsandai #homeschool #parentingtips` },

  31: { who: 'Anna', voice: [
      'Worst case: twenty minutes on the couch.',
      'Leave your email. No card.',
      'Your kid builds a game, and you play it together.',
      'If it isn\'t a fit, that\'s all you lose.',
      'Comment GAME and I\'ll send you the link.'],
    caption: `Comment GAME and I'll send you the free first lesson.

If it isn't a fit for your family, you've lost nothing but 20 minutes on the couch. Leave your email, no card. Your kid builds a game, then you play it against each other.

If you like it, the full course is $197, paid once.

#aiforkids #kidsgames #familytime #kidsandai` },
};
