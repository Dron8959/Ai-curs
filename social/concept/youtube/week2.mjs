// YouTube Shorts titles, descriptions and tags for the Instagram pack of 19-25 Nov 2026 (posts 13-34).
// Written 17 Nov by the YouTube Shorts desk, from the captions in review/week2-texts.mjs (Instagram wrote them).
// Rule (README, "Video lane"): the Instagram desk puts the post into Metricool on all four platforms.
// Comment-word asks ("Comment GAME ...") are dropped: they work only where we answer comments by hand.
// ai: the Short carries AI pictures or a cloned voice (YouTube altered-content flag). For the carousels
// (17, 20, 24, 30) it follows Instagram's isAiGenerated flag: check it when the post is built.
// kind: 'reel' (reel.mp4) or 'carousel' (youtube.mp4, built by youtube/carousels.py from the slides).
const FREE = 'First lesson free, no card: makeshowlab.com';
const PRICE = 'The full course is $197, paid once. No subscription.';
const foot = `${FREE}\n${PRICE}`;

export const WEEK2_YT = {
  13: { kind: 'reel', ai: true, kw: '10-year-old made a cartoon with ai', title: '10-Year-Old Made a Cartoon With AI: How She Did It',
    tags: ['10-year-old made a cartoon with ai', 'kids cartoon maker', 'ai for kids', 'kids and ai', 'creative kids'],
    body: `A 10-year-old made a cartoon with AI, and she didn't draw a single frame.

Kamilla told the AI her story and her characters, checked every scene and fixed the ones that came out wrong. About 20 minutes, two or three tries a scene. That's one project in our AI course for kids.

${foot}

#aiforkids #kidscartoon #creativekids` },
  14: { kind: 'reel', ai: true, kw: 'chatgpt for kids', title: 'ChatGPT for Kids: How to Say Yes, With One Safety Rule',
    tags: ['chatgpt for kids', 'ai safety for kids', 'kids and ai', 'online safety for kids', 'parenting tips'],
    body: `ChatGPT for kids: your kid asks for it because everyone at school has it. You can say yes, with one rule. It's your account, not theirs.

They never sign up anywhere alone, and you sit next to them, so you see everything they make. That's how every lesson of our AI course for kids works.

${foot}

#aisafety #kidsandai #parentingtips` },
  15: { kind: 'reel', ai: true, kw: 'how does ai draw pictures', title: 'How Does AI Draw Pictures? It Starts From TV Static',
    tags: ['how does ai draw pictures', 'how ai works for kids', 'ai art for kids', 'ai for kids', 'curious kids'],
    body: `How does AI draw pictures? Not on a blank page. It starts with pure static, like an old TV, and removes a little noise at a time, each step nudged toward the words it was given.

That's why better words make better pictures. In our AI course for kids the words are your kid's idea.

${foot}

#aiforkids #aiart #curiouskids` },
  16: { kind: 'reel', ai: true, kw: 'ai game for kids', title: 'AI Game for Kids: Build It Tonight, Play It on the Couch',
    tags: ['ai game for kids', 'kids make a game with ai', 'free ai lesson for kids', 'family game night', 'ai for kids'],
    body: `An AI game for kids, made tonight: leave your email, no card. Your kid builds a game in 10 to 20 minutes on a laptop or a tablet, with you right there. Then you play it against each other on the couch.

${FREE}
${PRICE}

#aiforkids #kidsgames #familygamenight` },
  17: { kind: 'carousel', ai: false, kw: 'gift ideas for grandkids', title: 'Gift Ideas for Grandkids: What 4 Grandmothers Made',
    tags: ['gift ideas for grandkids', 'grandparent activities', 'ai for kids', 'family activities', 'non toy gifts'],
    body: `Gift ideas for grandkids that aren't another toy: four grandmothers tried our course with their grandkids before launch. They made a cartoon, a song, a game and a gift.

They received the course free and shared honest feedback. Names and photos are used with their permission.

${foot}

#grandparents #aiforkids #giftideas` },
  19: { kind: 'reel', ai: true, kw: 'ai for 6 year olds', title: 'AI for 6 Year Olds: They Talk, You Type, They Create',
    tags: ['ai for 6 year olds', 'ai for young kids', 'ai for kids', 'kids activities', 'parenting tips'],
    body: `AI for 6 year olds: a 6-year-old doesn't need to read or type to make something with AI. They talk, you type, and the idea stays theirs.

Our AI course is for kids 6 to 14, made side by side with a parent. Lessons take 6 to 20 minutes.

${foot}

#aiforkids #kidsactivities #parentingtips` },
  20: { kind: 'carousel', ai: true, kw: 'is this picture real', title: 'Is This Picture Real? How to Spot an AI Fake With Your Kid',
    tags: ['is this picture real', 'how to spot ai pictures', 'media literacy for kids', 'ai safety for kids', 'parenting tips'],
    body: `"Mom, is this picture real?" Skip the face, AI draws faces best. Look at the hands: six fingers or a cup held by nothing is your answer. If the hands look fine, read any sign in the picture. AI often scrambles the letters.

Spotting fakes is one of the safety lessons in our AI course for kids.

${foot}

#aisafety #kidsandai #medialiteracy` },
  21: { kind: 'reel', ai: true, kw: 'kids make stickers with ai', title: 'Kids Make Stickers With AI: A Whole Pack, Her Own Character',
    tags: ['kids make stickers with ai', 'ai sticker maker for kids', 'ai for kids', 'creative kids', 'kids projects'],
    body: `Kids make stickers with AI: Kamilla, 10, made her own character and turned it into a sticker pack. Happy, surprised, silly, a whole set.

That's one of the projects in our AI course for kids.

${foot}

#aiforkids #stickers #creativekids` },
  22: { kind: 'reel', ai: true, kw: 'is ai alive', title: 'Is AI Alive? How to Explain It to Your Kid in Plain Words',
    tags: ['is ai alive', 'what is ai for kids', 'kids and ai', 'ai for kids', 'curious kids'],
    body: `Is AI alive? It talks like a friend because it learned from a huge amount of text that people wrote. So it sounds like a person. It doesn't eat, sleep or miss anyone.

Ask your kid first, then show them this.

${foot}

#kidsandai #aiforkids #curiouskids` },
  23: { kind: 'reel', ai: true, kw: 'cartoon gift for grandma', title: "Cartoon Gift for Grandma: From a Kid's Drawing, With AI",
    tags: ['cartoon gift for grandma', 'thanksgiving gift for grandma', 'kids drawing to cartoon with ai', 'ai for kids', 'kids art ideas'],
    body: `A cartoon gift for grandma this Thanksgiving: a drawing your kid made, turned into a cartoon, is a gift she will keep. In our course the kid has the idea and makes the drawing, and the AI follows it.

The first lesson is free and ends with a game. The cartoon comes later in the course.

${foot}

#thanksgiving #giftsforgrandma #aiforkids` },
  24: { kind: 'carousel', ai: false, kw: 'what not to tell an ai chatbot', title: 'What Not to Tell an AI Chatbot: A Rule for Your Kid',
    tags: ['what not to tell an ai chatbot', 'ai safety for kids', 'online safety for kids', 'kids and ai', 'parenting tips'],
    body: `What not to tell an AI chatbot: your kid is chatting, it feels like a friend, and they type the name of their school. On its own a school is harmless. Next to a full name, it points to one real kid, and you can't take back what you typed.

What never to tell an AI is one of the safety lessons in our course. Make the list together, so your kid knows why each thing is on it.

${foot}

#aisafety #onlinesafety #kidsandai` },
  26: { kind: 'reel', ai: true, kw: 'learn ai with your kid', title: 'Learn AI With Your Kid: No Experience Needed, Start at Zero',
    tags: ['learn ai with your kid', 'ai course for kids and parents', 'ai for kids', 'kids and ai', 'parenting tips'],
    body: `Learn AI with your kid: you don't need to know anything about AI. Every lesson starts from zero for both of you, on a laptop or a tablet, with nothing to install.

The full course is $197, paid once, no subscription. With Anna checking homework the same day, it's $297.

${FREE}

#aiforkids #parentingtips #learnai` },
  27: { kind: 'reel', ai: true, kw: 'kids write a song with ai', title: 'Kids Write a Song With AI: Her Words, AI Makes the Music',
    tags: ['kids write a song with ai', 'ai music for kids', 'ai for kids', 'grandparent activities', 'creative kids'],
    body: `Kids write a song with AI: in one of our lessons your kid writes the words and the AI makes the music. Susan, grandmother of an 8-year-old, told us: "We made a song together, and she wanted to show it to everyone in the family!"

Susan's family got the course free before launch and shared honest feedback.

${foot}

#aiforkids #grandparents #kidsmusic` },
  28: { kind: 'reel', ai: true, kw: 'is it a real person or ai', title: 'Is It a Real Person or AI? A Rule for Every Kids App',
    tags: ['is it a real person or ai', 'ai safety for kids', 'kids and ai', 'online safety for kids', 'parenting tips'],
    body: `Is it a real person or AI? If a lesson in our course is led by an AI version of Kamilla, the lesson says so. Kids should always know whether they're talking to a person or to an AI.

It's a rule for every app, not just ours.

${foot}

#aisafety #kidsandai #aiforkids` },
  29: { kind: 'reel', ai: true, kw: "how ai turns a kid's drawing into a cartoon", title: "How AI Turns a Kid's Drawing Into a Cartoon, Explained",
    tags: ["how ai turns a kid's drawing into a cartoon", 'kids drawing to cartoon with ai', 'ai art for kids', 'kids art ideas', 'ai for kids'],
    body: `How AI turns a kid's drawing into a cartoon: it doesn't start over. It starts from the drawing, keeps the shapes and redraws them in a new style. That's why the monster truck on top of the rainbow is still there.

A 6-year-old drew this rainbow in one of our lessons.

${foot}

#kidsart #aiforkids #kidsdrawing` },
  30: { kind: 'carousel', ai: false, kw: 'ai course for kids price', title: 'AI Course for Kids Price: What You Pay and What You Get',
    tags: ['ai course for kids price', 'ai course for kids', 'ai for kids', 'homeschool ideas', 'parenting tips'],
    body: `AI course for kids price: Creator is $197, paid once. That's the whole course, every lesson and project, for you and your kid, at your own pace. Creator + Homework is $297: the same, plus Anna checks homework the same day.

Both are paid once, and nobody will call to sell you anything. The first lesson is free.

${FREE}

#aiforkids #kidsandai #homeschool` },
  31: { kind: 'reel', ai: true, kw: 'try an ai course for kids free', title: 'Try an AI Course for Kids Free: Worst Case, 20 Minutes',
    tags: ['try an ai course for kids free', 'free ai lesson for kids', 'ai for kids', 'family game night', 'kids games'],
    body: `Try an AI course for kids free: if it isn't a fit for your family, you've lost nothing but 20 minutes on the couch. Leave your email, no card. Your kid builds a game, then you play it against each other.

If you like it, the full course is $197, paid once.

${FREE}

#aiforkids #kidsgames #familytime` },
  32: { kind: 'reel', ai: true, kw: 'kids cartoon with ai', title: 'Kids Cartoon With AI: A Cat With a Croissant, Her Idea',
    tags: ['kids cartoon with ai', 'kids cartoon maker', 'ai for kids', 'kids and ai', 'creative kids'],
    body: `A kids cartoon with AI: a cat with a croissant was Kamilla's idea. She's 10. She told the AI her characters and her story, then fixed the scenes that came out wrong. The AI drew, she directed.

Making a cartoon is one of the projects in our AI course for kids 6 to 14.

${foot}

#aiforkids #kidscartoon #creativekids` },
  34: { kind: 'reel', ai: true, kw: 'kids make a cartoon with ai', title: 'Kids Make a Cartoon With AI: Every Character Her Idea',
    tags: ['kids make a cartoon with ai', 'kids cartoon maker', 'ai for kids', 'kids and ai', 'creative kids'],
    body: `Kids make a cartoon with AI: every character in this one came from Kamilla, 10. The girls, the cat, the trip to Paris. She told the AI who they are and tried again when a scene came out wrong.

Ask your kid who would be in their cartoon. Making one is a project in our AI course.

${foot}

#aiforkids #kidscartoon #creativekids` },
};
