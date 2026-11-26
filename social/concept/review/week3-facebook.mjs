// Facebook captions for pack 3 (posts 37-46; Instagram texts: review/week3-texts.mjs).
// Owner's audit, 24 Nov: 80% about the parent's fear or wish, 20% about the course. The first line is about the
// viewer; the course is only the last line. Facebook rules on top: no comment keyword (the link sits in the first
// comment), one real question or one share ask, two hashtags, a little warmer (grandparents read here).
// Facts are the same as in the Instagram caption, nothing added.
//   node social/concept/review/week3-facebook.mjs   -> checks the rules and prints the count

const SITE = 'https://www.makeshowlab.com/';
const link = (n, anchor = 'free') => `${SITE}?utm_source=facebook&utm_medium=social&utm_campaign=w3-${n}#${anchor}`;
const FREE = (n) => `The first lesson is free. No card, just an email: ${link(n)}`;
const LAST = 'The free first lesson of our AI course for kids is in the first comment.';

export const FB3 = {
  37: { caption: `Don't let AI do the homework. Make it quiz your kid instead.

Before your kid asks for an answer, have them type this: "Don't give me the answer. Ask me questions until I get it." The AI turns into a patient tutor, and your kid does the thinking.

Will you try it tonight with one math problem?

${LAST}

#homeworkhelp #parentingtips`, comment: FREE(37) },

  38: { caption: `Why does AI sometimes make things up? Here's how to explain it to a 7-year-old.

AI writes by guessing the next word, one word at a time. Most guesses are right. A wrong guess sounds just as sure as a right one. So the rule at our house is simple: if it sounds too smooth, check one fact together.

How would you explain it to your kid or grandkid?

${LAST}

#kidsandai #aisafety`, comment: FREE(38) },

  39: { caption: `A gift idea for the kid who has everything: something they make instead of something you buy.

A song from their own words, a cartoon from their drawing, a game the family can play. Linda, a grandmother from our early-access group, wanted to give her grandson "something more meaningful than another toy." Her family got the course free and shared honest feedback.

Share this with a grandparent who is still looking for a gift.

${LAST}

#giftideas #grandparents`, comment: `All eight reviews are here: ${link(39, 'families')}` },

  40: { caption: `Rainy Saturday, bored kid, one laptop. Here's a 20-minute plan.

1. Your kid picks an idea for a game. Anything: a dragon who bakes cookies works.
2. They talk, you type, and the AI builds it.
3. You play it against each other on the couch.

What would your kid's game be about?

Our free first lesson walks you through exactly this, no card, just an email. The link is in the first comment.

#rainydayactivities #familytime`, comment: `Start the free lesson here: ${link(40)}` },

  41: { caption: `Before your kid opens ChatGPT, ask these 3 questions together.

1. Whose account is it? Yours. Your kid never signs up anywhere alone.
2. What stays out? Full name with school, home address, passwords, photos of their face.
3. What if it says something wrong? Stop, show me, and we check it together.

Share this with a parent whose kid just asked for ChatGPT.

${LAST}

#aisafety #parentingtips`, comment: `How the course keeps kids safe: ${link(41, 'safe')}` },

  42: { caption: `5 AI rules for the fridge. Read them with your kid or grandkid tonight.

1. The account is yours. Every AI tool runs on your account.
2. No chats with strangers, in any app.
3. Some things stay out of AI: full name with school, home address, passwords, photos of their face.
4. Links get a second look. Looks strange? Ask first.
5. Too perfect? Check it. A picture, a video or a text can be fake.

Which rule would be the hardest at your house?

${LAST}

#aisafety #onlinesafety`, comment: `How the course keeps kids safe: ${link(42, 'safe')}` },

  43: { caption: `Watching or making? You can tell in 10 seconds.

Ask one question: "What did you make?" If the answer is nothing, it was watching. If they pull up something to show you, it was making. Kids don't need more screen time. They need a reason to show you something.

What was the last thing your kid made on a screen?

${LAST}

#screentime #parentingtips`, comment: FREE(43) },

  44: { caption: `Cheating with AI or building with it? It comes down to one habit.

The idea comes from your kid. The AI does the work. Then your kid checks what it made and fixes what's wrong. When the idea and the fixing are theirs, the thinking is theirs too.

Where do you draw the line at your house?

${LAST}

#kidsandai #parentingtips`, comment: FREE(44) },

  45: { caption: `AI can write the homework. It can't explain it for your kid.

So after homework, ask one thing: "Explain it to me in your own words." If they can, they learned it, however they got there. If they can't, sit down and go back through it together.

Would your kid pass the "explain it to me" test?

${LAST}

#homeworkhelp #parentingtips`, comment: FREE(45) },

  46: { caption: `A game for tonight: ask AI the same question 3 ways.

Pick one question with your kid, like "Why does it rain?" Then ask: explain it like I'm 6. Now like I'm 12. Now like my grandma. Read the three answers out loud and vote for the best one. Your kid learns the topic and learns that how you ask changes what you get.

Which version do you think your kid would pick?

${LAST}

#familygamenight #kidsactivities`, comment: FREE(46) },
  // Holiday "Gift a skill" posts (owner, 26 Nov; Instagram texts: review/holiday-texts.mjs). Sales posts: the course is
  // named, prices only as on Instagram, no discounts. The gift works by message: buy on the site, send us the kid's
  // first name, get the certificate to print.
  47: { caption: `Gift a skill this year, not another toy.

For the kid who has everything: an AI course they make things in, with you or a grandparent right next to them. A game, a cartoon, a song, a website, a sticker pack, a voiceover in their own voice. Lessons take 6 to 20 minutes, and each one ends with something finished to show the family.

Under the tree goes a certificate with their name on it. Send us a message with your kid's first name after you buy, and we'll send it to you.

Who on your list has everything already?

#giftideas #giftsforkids`, comment: `How the gift works, and the free first lesson: ${link(47, 'pricing')}` },

  48: { caption: `A gift they open, then use all winter.

Not another toy that's forgotten by January. In our AI course your kid makes a game, a song, a cartoon, a website, with you next to them. Under the tree goes a certificate with their name.

$197 paid once, or $297 with homework checked the same day. No subscription.

Share this with a grandparent who is still looking for a gift.

#giftsforkids #christmasgifts`, comment: `How the gift works, and the free first lesson: ${link(48, 'pricing')}` },

  49: { caption: `Still shopping? This gift fits in an email.

No shipping and no waiting: the login comes to your email right after you buy. Send us a message with your kid's first name, and we send you a certificate to print and put under the tree.

Inside: a game, a cartoon, a song, a website, a sticker pack, a voiceover, all made by your kid with you next to them. $197 paid once, or $297 with homework checked the same day.

Share this with someone who still has a name left on their list.

#giftideas #giftsforkids`, comment: `How the gift works, and the free first lesson: ${link(49, 'pricing')}` },

  50: { caption: `Still need a gift? This one needs no shipping.

The login to our AI course comes by email right after you buy. Send us a message with your kid's first name, and we send you a certificate to print and put under the tree. Inside: a game, a cartoon, a song, a website, made by your kid with you next to them.

$197 paid once, or $297 with homework checked the same day.

Who is still left on your list?

#lastminutegifts #giftsforkids`, comment: `How the gift works, and the free first lesson: ${link(50, 'pricing')}` },
};

// Checks: no link and no long dash in the post, no comment keyword, two hashtags, a link in the comment,
// the course is named only in the last paragraph before the hashtags.
if (import.meta.url === `file://${process.argv[1]}`) {
  let bad = 0;
  for (const [n, p] of Object.entries(FB3)) {
    const errs = [];
    if (/https?:|makeshowlab\.com/i.test(p.caption)) errs.push('link in post');
    if (/[—–]/.test(p.caption + p.comment)) errs.push('long dash');
    if (/Comment "/.test(p.caption)) errs.push('comment keyword');
    if ((p.caption.match(/#\w+/g) || []).length !== 2) errs.push('hashtags != 2');
    if (!/https:\/\/www\.makeshowlab\.com\//.test(p.comment)) errs.push('no link in comment');
    const paras = p.caption.split('\n\n'); const body = paras.slice(0, -2).join('\n\n');
    if (/our (AI )?course|first lesson/i.test(body) && !['39', '47', '48', '49', '50'].includes(n)) errs.push('course before the last line');
    if (errs.length) { bad++; console.log(n, errs.join(', ')); }
  }
  console.log(`${Object.keys(FB3).length} Facebook captions, ${bad} with problems`);
  process.exit(bad ? 1 : 0);
}
