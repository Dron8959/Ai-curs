// Facebook captions for the week-2 pack (Instagram plan: review/week2.mjs, texts: review/week2-texts.mjs).
// Owner's rule, 17 Nov: one post, four platforms; every platform writes its caption before approval.
// Facebook differs from Instagram: no comment keyword (the link sits in the first comment), the post ends on a real
// question or a share, never both; a little warmer (grandparents read here); two hashtags. Facts are the same as in
// the Instagram caption, nothing added. Posts 11 and 18 went out on 17 Nov (posts/<id>/facebook.md); 33 and 35 took their slots (Instagram, 17 Nov).
//   node social/concept/review/week2-facebook.mjs   -> checks the rules and prints the count

const SITE = 'https://www.makeshowlab.com/';
const link = (n, anchor = 'free') => `${SITE}?utm_source=facebook&utm_medium=social&utm_campaign=w2-${n}#${anchor}`;
const FREE = (n) => `The first lesson is free. No card, just an email: ${link(n)}`;

export const FB2 = {
  32: { caption: `A cat with a croissant was Kamilla's idea. She's 10.

She told the AI her characters and her story, then fixed the scenes that came out wrong. The AI drew, she directed.

What would your kid put in their first cartoon?

#aiforkids #kidscartoon`, comment: FREE(32) },

  13: { caption: `Kamilla is 10. She made this cartoon without drawing a single frame.

She told the AI her story and her characters, checked every scene and fixed the ones that came out wrong. About 20 minutes, two or three tries a scene.

Share this with someone who thinks kids just watch cartoons.

#aiforkids #kidscartoon`, comment: FREE(13) },

  14: { caption: `Your kid asks for ChatGPT because everyone at school has it.

You can say yes, with one rule: it's your account, not theirs. They never sign up anywhere alone, and you sit next to them, so you see everything they make.

That's how every lesson of our course works. Would that rule work at your house?

#aisafety #kidsandai`, comment: `How the course keeps kids safe: ${link(14, 'safe')}` },

  15: { caption: `AI doesn't draw on a blank page.

It starts with pure static, like an old TV, and removes a little noise at a time, each step nudged toward the words it was given. That's why better words make better pictures.

In our course the words are your kid's idea. What would your kid ask it to draw?

#aiforkids #aiart`, comment: FREE(15) },

  16: { caption: `Tonight: a game your kid made.

Leave your email, no card. Your kid builds a game in 10 to 20 minutes on a laptop or a tablet, with you right there. Then you play it against each other on the couch.

Who would win at your house?

#aiforkids #familygamenight`, comment: `Start the free lesson here: ${link(16)}` },

  17: { caption: `4 grandmas, 4 grandkids. What they made together.

Four grandmothers sat down with their grandkids, 7 to 10, and made something side by side: a cartoon, a song, a game. Linda wanted to give her grandson "something more meaningful than another toy."

What they got was a thing the kid made and wanted to show the family, and an evening together.

They received the course free and shared honest feedback. Names and photos are used with their permission.

Share this with a grandma before the holidays.

#grandparents #giftideas`, comment: `All eight reviews are here: ${link(17, 'families')}` },

  19: { caption: `Your kid is 6. Can they make something with AI?

They don't need to read or type. They talk, you type, and the idea stays theirs.

Our course is for kids 6 to 14, made side by side with a parent. Lessons take 6 to 20 minutes. How old is your youngest?

#aiforkids #kidsactivities`, comment: FREE(19) },

  20: { caption: `"Mom, is this real?"

Skip the face, AI draws faces best. Look at the hands: six fingers or a cup held by nothing is your answer. If the hands look fine, read any sign in the picture. AI often scrambles the letters.

Spotting fakes is one of the safety lessons in our course. Has a fake picture ever fooled you?

#aisafety #kidsandai`, comment: `How the course keeps kids safe: ${link(20, 'safe')}` },

  21: { caption: `Kamilla, 10, made her own character and turned it into a sticker pack. Happy, surprised, silly, a whole set.

That's one of the projects in our course.

Share this with your family group chat.

#aiforkids #creativekids`, comment: `See what kids make in the course: ${link(21, 'works')}` },

  22: { caption: `Is AI alive? It talks like a friend, so it's a fair question for a kid.

It learned from a huge amount of text that people wrote, so it sounds like a person. It doesn't eat, sleep or miss anyone.

How would your kid or grandkid answer: alive or not?

#kidsandai #curiouskids`, comment: FREE(22) },

  23: { caption: `Thursday is Thanksgiving.

A drawing your kid made, turned into a cartoon, is a gift grandma will keep. In our course the kid has the idea and makes the drawing, and the AI follows it.

The first lesson is free and ends with a game. The cartoon comes later in the course.

Share this with the family before Thursday.

#thanksgiving #giftsforgrandma`, comment: FREE(23) },

  24: { caption: `Your kid is chatting with an AI, it feels like a friend, and they type the name of their school.

On its own a school is harmless. Next to a full name, it points to one real kid, and you can't take back what you typed.

What never to tell an AI is one of the safety lessons in our course. What would be on your family's list?

#aisafety #onlinesafety`, comment: `How the course keeps kids safe: ${link(24, 'safe')}` },

  34: { caption: `Every character in this cartoon came from Kamilla, 10.

The girls, the cat, the trip to Paris. She told the AI who they are and tried again when a scene came out wrong.

Who would be in your kid's cartoon?

#aiforkids #kidscartoon`, comment: FREE(34) },

  26: { caption: `"Do I need to know AI first?" No.

Every lesson starts from zero for both of you, on a laptop or a tablet, with nothing to install.

The full course is $197, paid once, no subscription. With Anna checking homework the same day, it's $297.

What would you want to ask us before you start?

#aiforkids #learnai`, comment: FREE(26) },

  27: { caption: `In one of our lessons your kid writes the words and the AI makes the music.

Susan, grandmother of an 8-year-old, told us: "We made a song together, and she wanted to show it to everyone in the family!"

Susan's family got the course free before launch and shared honest feedback.

What would your grandkid write a song about?

#grandparents #kidsmusic`, comment: `All eight reviews are here: ${link(27, 'families')}` },

  28: { caption: `If a lesson in our course is led by an AI version of Kamilla, the lesson says so.

Kids should always know whether they're talking to a person or to an AI. It's a rule for every app, not just ours.

Does your kid know when they're talking to an AI?

#aisafety #kidsandai`, comment: `How the course keeps kids safe: ${link(28, 'safe')}` },

  29: { caption: `When AI turns a kid's drawing into a cartoon, it doesn't start over.

It starts from the drawing, keeps the shapes and redraws them in a new style. That's why the monster truck on top of the rainbow is still there. A 6-year-old drew this rainbow in one of our lessons.

Share this with the parent whose fridge is covered in drawings.

#kidsart #aiforkids`, comment: FREE(29) },

  30: { caption: `What the course costs, and what you get.

Creator, $197 paid once: every lesson (6 to 20 minutes each), and every project: a game, a cartoon, a song, a website, a sticker pack, a voiceover in your kid's own voice. Plus the AI safety lessons. For you and your kid, at your own pace.

Creator + Homework, $297: all of that, plus homework, and Anna checks it the same day.

No subscription, and nobody will call to sell you anything. The first lesson is free.

Which would fit your family better?

#aiforkids #homeschool`, comment: `Both plans and the free first lesson: ${link(30)}` },

  31: { caption: `Worst case: 20 minutes on the couch.

If it isn't a fit for your family, that's all you've lost. Leave your email, no card. Your kid builds a game, then you play it against each other.

If you like it, the full course is $197, paid once.

Got 20 minutes this week?

#aiforkids #familytime`, comment: `Start the free lesson here: ${link(31)}` },
  33: { caption: `This is Paris in Kamilla's cartoon.

The AI drew every street. Kamilla, 10, decided where her characters go and what happens there, and asked again when a scene came out wrong.

Where would your kid's cartoon go?

#aiforkids #kidscartoon`, comment: FREE(33) },

  35: { caption: `Two or three tries a scene.

Not every scene in Kamilla's cartoon came out right the first time. So she looked and told the AI what to fix. The whole cartoon took about 20 minutes.

Checking and fixing what the AI makes is part of every lesson in our course. Would your kid fix it, or keep it?

#aiforkids #kidscartoon`, comment: FREE(35) },
};

// Checks: no link and no long dash in the post, no comment keyword, two hashtags, a link in the comment.
if (import.meta.url === `file://${process.argv[1]}`) {
  let bad = 0;
  for (const [n, p] of Object.entries(FB2)) {
    const errs = [];
    if (/https?:|makeshowlab\.com/i.test(p.caption)) errs.push('link in post');
    if (/[—–]/.test(p.caption + p.comment)) errs.push('long dash');
    if (/Comment "/.test(p.caption)) errs.push('comment keyword');
    if ((p.caption.match(/#\w+/g) || []).length !== 2) errs.push('hashtags != 2');
    if (!/https:\/\/www\.makeshowlab\.com\//.test(p.comment)) errs.push('no link in comment');
    if (errs.length) { bad++; console.log(n, errs.join(', ')); }
  }
  console.log(`${Object.keys(FB2).length} Facebook captions, ${bad} with problems`);
  process.exit(bad ? 1 : 0);
}
