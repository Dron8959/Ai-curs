// Pack 3 (owner audit 24 Nov: 80% about the parent's fear or wish, 20% about the course).
// Rule: the hook is about the viewer; the course is only the last line; the comment word goes at the end.
// Voice: Anna's clone, 5 lines in the windows 0-4.2, 4.2-8.3, 8.3-12.5, 12.5-16.2, 16.2-19.4 s (about 2.5 words/s).
// Spoken keywords are lower case. Facts: social/brand/facts.md; general advice is marked as such in `note`.
// scenes: [on-screen line, picture idea] for scenes 2-4 of the reel; end: the closing card line.
export const W3 = [
  { n: 37, slug: 'homework-quiz', grid: 'A1', kw: 'LESSON', format: 'Reel', theme: 'n',
    tile: 'Don’t let AI do<br>the homework.<br><mark>Make it quiz</mark><br><mark>your kid.</mark>',
    tileVis: 'chat: kid “Do my math homework.” / prompt card “Don’t give me the answer. Ask me questions until I get it.”',
    scenes: [['Don’t let it<br><mark>answer.</mark>', 'say:Do my homework for me.'], ['Let it<br><mark>ask.</mark>', 'say-me:Ask me questions until I get it.'], ['Your kid<br><mark>does the thinking.</mark>', 'icon:brain']],
    end: 'Try it<br><mark>tonight.</mark>',
    voice: ['Don\'t let AI do the homework.', 'Make it quiz your kid instead.', 'Type: ask me questions until I get it.', 'Now your kid does the thinking.', 'Free first lesson? Type lesson below.'],
    note: 'General study advice (the prompt), no claim about Anna.',
    caption: `Don't let AI do the homework. Make it quiz your kid instead.

Before your kid asks for an answer, have them type this: "Don't give me the answer. Ask me questions until I get it." The AI turns into a patient tutor, and your kid does the thinking. Try it tonight with one math problem.

Comment "LESSON" and I'll send you the free first lesson of our AI course for kids.

#aiforkids #homeworkhelp #parentingtips #kidsandai` },

  { n: 38, slug: 'ai-makes-things-up', grid: 'D12', kw: 'RULES', format: 'Reel', theme: 'y',
    tile: 'Why does AI<br><mark>make things up?</mark>',
    tileVis: 'bubble: “Penguins live at the North Pole!” with a red ✕ stamp; note “sounds sure”',
    scenes: [['It guesses<br><mark>the next word.</mark>', 'icon:dice-5'], ['A good guess<br><mark>sounds sure.</mark>', 'say:Penguins live at the North Pole!'], ['Too smooth?<br><mark>Check it.</mark>', 'icon:search-check']],
    end: 'Check<br><mark>one fact.</mark>',
    voice: ['Why does AI make things up?', 'It guesses the next word, one at a time.', 'A wrong guess can still sound very sure.', 'So if it sounds too smooth, check it.', 'Want our five rules? Type rules below.'],
    note: 'General knowledge (language models predict words). Rule 5 of the fridge card.',
    caption: `Why does AI sometimes make things up? Here's how to explain it to a 7-year-old.

AI writes by guessing the next word, one word at a time. Most guesses are right. A wrong guess sounds just as sure as a right one. So the rule at our house is simple: if it sounds too smooth, check one fact together.

Comment "RULES" and I'll send you our 5 AI house rules for the fridge.

#aiforkids #kidsandai #aisafety #parentingtips` },

  { n: 39, slug: 'gifts-not-toys', grid: 'F18', kw: 'GIFT', format: 'Reel', theme: 'y',
    tile: 'Gifts that<br><mark>aren’t toys.</mark>',
    tileVis: 'Linda photo ring + quote “something more meaningful than another toy”',
    scenes: [['Made by them.<br><mark>Not bought.</mark>', 'img:landing/step-show.jpg'], ['A song. A cartoon.<br><mark>A game.</mark>', 'icon:gift'], ['Linda wanted<br><mark>more than a toy.</mark>', 'ring:linda']],
    end: 'A gift<br><mark>they made.</mark>',
    voice: ['For the kid who has everything.', 'A gift they make, instead of one you buy.', 'A song, a cartoon, a game, for grandma.', 'Linda wanted more than another toy.', 'Free first lesson? Type gift below.'],
    note: 'Linda: review on the site, early access, got the course free. Projects from facts.md.',
    caption: `Black Friday idea for the kid who has everything: a gift they make instead of one you buy.

It could be a song in their own words, or their drawing turned into a cartoon. Linda, a grandmother from our early-access group, wanted to give her grandson "something more meaningful than another toy." Her family got the course free and shared honest feedback.

Comment "GIFT" and I'll send you the free first lesson.

#giftideas #blackfriday #giftsforkids #aiforkids` },

  { n: 40, slug: 'rainy-saturday', grid: 'E15', kw: 'GAME', format: 'Reel', theme: 'y',
    tile: 'Rainy Saturday.<br>Bored kid.<br><mark>A 20-minute plan.</mark>',
    tileVis: 'three pills: 1 idea · 2 build · 3 play',
    scenes: [['1. Your kid<br><mark>picks an idea.</mark>', 'say:a dragon who bakes cookies'], ['2. They talk.<br><mark>You type.</mark>', 'img:landing/step-make.jpg'], ['3. Play it<br><mark>together.</mark>', 'img:landing/together-game.jpg']],
    end: '20 minutes.<br><mark>One game.</mark>',
    voice: ['Rainy Saturday, and your kid is bored.', 'First, your kid picks an idea.', 'They talk, you type, AI builds a game.', 'Then you play it against each other.', 'Want the free lesson? Type game below.'],
    note: 'facts.md: free lesson, a game in 10-20 minutes, play each other on the couch.',
    caption: `Rainy Saturday, and your kid is bored. Here's a 20-minute plan.

1. Your kid picks an idea for a game. Anything: a dragon who bakes cookies works.
2. They talk, you type, and the AI builds it.
3. You play it against each other on the couch.

Our free first lesson walks you through exactly this. No card, just an email.

Comment "GAME" and I'll send you the link.

#rainydayactivities #kidsactivities #familytime #aiforkids` },

  { n: 41, slug: 'three-questions', grid: 'A3', kw: 'RULES', format: 'Carousel', theme: 'y',
    tile: '3 questions<br>before your kid<br><mark>opens ChatGPT.</mark>',
    slides: [
      ['3 questions before your kid opens ChatGPT', 'Ask them out loud, together.'],
      ['1. Whose account<br>is it?', 'Yours. Your kid never signs up anywhere alone.'],
      ['2. What stays out?', 'Full name with school, home address, passwords, photos of their face.'],
      ['3. What if it says<br>something wrong?', 'Stop, show me, and we check it together.'],
      ['Three answers,<br>one evening', 'Then let them start, with you next to them.'],
      ['Comment “RULES”', 'I’ll send you all 5 rules for the fridge.']],
    note: 'Rules 1, 3, 5 of the fridge card (facts.md safety + general advice).',
    caption: `Before your kid opens ChatGPT, ask these 3 questions together.

1. Whose account is it? Yours. Your kid never signs up anywhere alone.
2. What stays out? Full name with school, home address, passwords, photos of their face.
3. What if it says something wrong? Stop, show me, and we check it together.

Save this for the day they ask.

Comment "RULES" and I'll send you all 5 rules for the fridge.

#chatgptforkids #aisafety #kidsandai #parentingtips` },

  { n: 42, slug: 'house-rules', grid: 'C8', kw: 'RULES', format: 'Carousel', theme: 'm',
    tile: '5 AI rules<br><mark>for the fridge.</mark>',
    slides: [
      ['5 AI rules for the fridge', 'Read them together. Both of you agree.'],
      ['1. The account is yours', 'Every AI tool runs on the parent’s account.'],
      ['2. No chats<br>with strangers', 'In any app.'],
      ['3. Some things<br>stay out of AI', 'Full name with school, home address, passwords, face photos.'],
      ['4. Links get<br>a second look', 'Looks strange? Don’t click. Ask first.'],
      ['5. Too perfect?<br>Check it', 'A picture, a video or a text can be fake.'],
      ['Comment “RULES”', 'I’ll send you the card to print.']],
    note: 'The RULES card (review/rules-card.mjs) as a carousel.',
    caption: `5 AI rules for the fridge. Read them with your kid tonight.

1. The account is yours. Every AI tool runs on your account.
2. No chats with strangers, in any app.
3. Some things stay out of AI: full name with school, home address, passwords, photos of their face.
4. Links get a second look. Looks strange? Ask first.
5. Too perfect? Check it. A picture, a video or a text can be fake.

Save this, or comment "RULES" and I'll send you the card to print.

#aisafety #onlinesafety #kidsandai #parentingtips` },

  { n: 43, slug: 'watching-or-making', grid: 'B6', kw: 'GAME', format: 'Reel', theme: 'n',
    tile: 'Watching<br>or making?<br><mark>Tell in 10 seconds.</mark>',
    tileVis: 'two cards: “watched 40 videos” ✕ / “made a game” ✓',
    scenes: [['Ask one<br><mark>question.</mark>', 'say:What did you make?'], ['Nothing?<br><mark>That was watching.</mark>', 'icon:tv'], ['Something<br>to show?<br><mark>That was making.</mark>', 'img:landing/step-show.jpg']],
    end: 'What did<br><mark>you make?</mark>',
    voice: ['Watching or making? Here\'s a ten-second test.', 'Ask one question: what did you make?', 'If the answer is nothing, it was watching.', 'If they show you something, it was making.', 'Want a first thing to make? Type game.'],
    note: 'General parenting advice; brand line from facts.md.',
    caption: `Watching or making? You can tell in 10 seconds.

Ask one question: "What did you make?" If the answer is nothing, it was watching. If they pull up something to show you, it was making. Kids don't need more screen time. They need a reason to show you something.

Comment "GAME" and I'll send you the free first lesson, where your kid makes a game.

#screentime #parentingtips #kidsandai #aiforkids` },

  { n: 44, slug: 'one-habit', grid: 'A2', kw: 'LESSON', format: 'Reel', theme: 'm',
    tile: 'Cheating with AI<br>or building with it?<br><mark>One habit.</mark>',
    tileVis: 'three steps: idea (kid) → work (AI) → fix (kid)',
    scenes: [['The idea is<br><mark>your kid’s.</mark>', 'icon:lightbulb'], ['AI does<br><mark>the work.</mark>', 'icon:bot'], ['Your kid checks<br><mark>and fixes it.</mark>', 'icon:pencil']],
    end: 'Idea. Work.<br><mark>Fix.</mark>',
    voice: ['Cheating with AI, or building with it?', 'It comes down to one habit.', 'The idea comes from your kid, AI does the work.', 'Then your kid checks it and fixes it.', 'Want the free lesson? Type lesson below.'],
    note: 'Brand idea: “Don’t let AI think for your child. Teach them to think with it.” (facts.md)',
    caption: `Cheating with AI or building with it? It comes down to one habit.

The idea comes from your kid. The AI does the work. Then your kid checks what it made and fixes what's wrong. When the idea and the fixing are theirs, the thinking is theirs too.

Comment "LESSON" and I'll send you the free first lesson of our AI course for kids.

#aiforkids #kidsandai #parentingtips #learning` },

  { n: 45, slug: 'explain-it-back', grid: 'A4', kw: 'LESSON', format: 'Reel', theme: 'n',
    tile: 'AI can write<br>the homework.<br><mark>It can’t explain it</mark><br><mark>for your kid.</mark>',
    tileVis: 'speech bubble from parent: “Explain it to me in your own words.”',
    scenes: [['Ask your kid<br><mark>to explain it.</mark>', 'say-me:Explain it to me in your own words.'], ['Can they?<br><mark>They learned it.</mark>', 'icon:check'], ['Can’t?<br><mark>Go back together.</mark>', 'icon:rotate-ccw']],
    end: 'Explain it<br><mark>back.</mark>',
    voice: ['AI can write the homework for your kid.', 'It can\'t explain it for them.', 'Ask your kid to explain it in their own words.', 'If they can, they learned it.', 'Free first lesson? Type lesson below.'],
    note: 'General study advice. Owner’s “teachers spot it in seconds” dropped (no source).',
    caption: `AI can write the homework. It can't explain it for your kid.

So after homework, ask one thing: "Explain it to me in your own words." If they can, they learned it, however they got there. If they can't, sit down and go back through it together.

Comment "LESSON" and I'll send you the free first lesson of our AI course for kids.

#homeworkhelp #parentingtips #kidsandai #aiforkids` },

  { n: 46, slug: 'three-ways', grid: 'D13', kw: 'LESSON', format: 'Reel', theme: 'y',
    tile: 'Ask AI<br>the same question<br><mark>3 ways.</mark>',
    tileVis: 'three bubbles: “like I’m 6” / “like I’m 12” / “like my grandma”',
    scenes: [['Explain rain<br><mark>like I’m 6.</mark>', 'say:Explain rain like I’m 6.'], ['Now<br><mark>like I’m 12.</mark>', 'say:Now like I’m 12.'], ['Now like<br><mark>my grandma.</mark>', 'say:Now like my grandma.']],
    end: 'Which one<br><mark>was best?</mark>',
    voice: ['Tonight\'s game: one question, three ways.', 'Ask AI: explain rain like I\'m six.', 'Then like I\'m twelve.', 'Then like my grandma. Which one was best?', 'Free first lesson? Type lesson below.'],
    note: 'General activity (from the Threads post “explain to a 6-year-old vs grandma”).',
    caption: `A game for tonight: ask AI the same question 3 ways.

Pick one question with your kid, like "Why does it rain?" Then ask: explain it like I'm 6. Now like I'm 12. Now like my grandma. Read the three answers out loud and vote for the best one. Your kid learns the topic and learns that how you ask changes what you get.

Comment "LESSON" and I'll send you the free first lesson of our AI course for kids.

#familygamenight #kidsactivities #kidsandai #aiforkids` },
];
