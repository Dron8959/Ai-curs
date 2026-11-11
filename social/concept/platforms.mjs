// The video lane: the same ten posts on Instagram, TikTok, Facebook and YouTube Shorts.
//
// The file is the same on all four (one master reel, one set of slides). The words are not: each
// platform reads them differently, so each gets its own. Instagram captions live in content.mjs.
//
//   TikTok    the caption is search: the phrase a parent would type comes first (about the first 100
//             characters), then what they get. Two to four niche tags, never #fyp. Comments, Duet and
//             Stitch stay on. "Your brand" disclosure is on: these promote our own course.
//   YouTube   a Short needs a title: the search phrase inside the first 40 characters, 50-60 in all.
//             Short description, the address as text (links in Shorts are not clickable), tags led by
//             the exact phrase. Category Education. "Made for kids": No, the videos speak to parents.
//   Facebook  a conversation, a little warmer (grandparents are here). The link goes in the first
//             comment, not in the post. It ends on a real question or a share, never both.
//
// Copy rules are the brand's: only facts from social/brand/facts.md, no long dashes, one ask per post.

const SITE = 'https://www.makeshowlab.com/';
const link = (source, campaign, anchor = 'free') => `${SITE}?utm_source=${source}&utm_medium=social&utm_campaign=${campaign}#${anchor}`;
const fbComment = (campaign, anchor = 'free', text = 'The first lesson is free. No card, just an email:') => `${text} ${link('facebook', campaign, anchor)}`;

export const packaging = {
  '01-crayon-to-cartoon': {
    keyword: 'kids drawing to cartoon with AI',
    tiktok: { caption: `Kids drawing to cartoon with AI: a 6-year-old drew this rainbow, and one lesson later it was a cartoon. The kid has the idea and makes the drawing. The AI follows it. You sit right next to them. First lesson is free at makeshowlab.com

#kidsdrawing #aiforkids #kidsart #creativekids` },
    youtube: { title: 'Kids Drawing to Cartoon With AI: One Lesson Later',
      description: `A 6-year-old drew this rainbow with crayons. One lesson later it was a cartoon.

Kids drawing to cartoon with AI, in one lesson: the kid has the idea and makes the drawing, the AI follows it, and a parent sits right next to them.

First lesson free: makeshowlab.com

#kidsdrawing #aiforkids #kidsart`,
      tags: ['kids drawing to cartoon with ai', 'ai for kids', 'kids art ideas', 'ai art for kids', 'things to do with kids'] },
    facebook: { caption: `A 6-year-old drew this rainbow with crayons. One lesson later it was a cartoon.

The idea and the drawing are the kid's. The AI only follows it. And a grown-up sits right next to them the whole time.

Whose drawing would you turn into a cartoon first?

#kidsart #aiforkids`, comment: fbComment('01-crayon-to-cartoon') },
  },

  '02-meet-anna-kamilla': {
    keyword: 'AI course for kids and parents',
    tiktok: { caption: `AI course for kids and parents, made by a mom and her 10-year-old daughter. I'm Anna. I built every lesson myself and tested each one on Kamilla at our kitchen table. What lost her attention got cut. She goes first, then your kid makes their own.

#aiforkids #momanddaughter #kidsandai` },
    youtube: { title: 'AI Course for Kids and Parents: Meet Anna and Kamilla',
      description: `We're a mom and a daughter, not a corporation.

Make Show Lab is an AI course for kids and parents: ages 6 to 14, done side by side. Anna built every lesson and tested each one on Kamilla, 10, at their kitchen table. Kamilla shows the finished thing first, then your kid makes their own.

First lesson free: makeshowlab.com

#aiforkids #kidsandai #momanddaughter`,
      tags: ['ai course for kids and parents', 'ai for kids', 'kids and ai', 'learn ai with your kid', 'make show lab'] },
    facebook: { caption: `Hi, we're Anna and Kamilla. A mom and a daughter, not a corporation.

I built every lesson of our AI course myself and tested each one on Kamilla at our kitchen table. She's 10. If a lesson lost her attention, it got cut.

In the course she goes first. She shows the finished thing, then your kid makes their own, with you next to them.

Say hi in the comments. How old is your kid?

#aiforkids #momanddaughter`, comment: fbComment('02-meet-anna-kamilla', 'team', 'More about us and the course:') },
  },

  '03-ai-house-rules': {
    keyword: 'AI safety rules for kids',
    tiktok: { photo: true, caption: `AI safety rules for kids: 5 house rules to set before your kid opens any AI tool. The account is the parent's. No chats with strangers. Some things AI never hears. Links get a second look. Too perfect? Check it. Save it for the fridge.

#aisafety #kidsandai #onlinesafety #parentingtips` },
    youtube: null,
    facebook: { caption: `Five rules we set before any kid touches an AI tool.

1. The account is the parent's.
2. No chats with strangers.
3. Some things AI never hears.
4. Links get a second look.
5. If it looks too perfect, check it.

Almost 9 in 10 American kids aged 9 to 17 already use AI, and almost half have never talked about safety with a parent (Common Sense Media, 2026).

Share it with a parent or a grandparent who needs it.

#aisafety #kidsandai`, comment: fbComment('03-ai-house-rules', 'safe', 'How the course keeps kids safe:') },
  },

  '04-idea-to-game': {
    keyword: 'kids make a game with AI',
    tiktok: { caption: `Kids make a game with AI, no code: her idea at 7:02 pm, playing it by 7:41. A park, a girl and her corgi. She decided, told the AI, checked what came back and fixed it. Then we played against each other at the same table.

#kidsgames #aiforkids #nocode #familygamenight` },
    youtube: { title: 'Kids Make a Game With AI, No Code: Idea at 7:02, Playing by 7:41',
      description: `Her idea at 7:02 pm: a park, a girl and her corgi. By 7:41 we were playing it against each other.

This is how kids make a game with AI and no code: she decided what to make, told the AI, checked what came back and fixed it. The thinking stayed with her.

First lesson free: makeshowlab.com

#kidsgames #aiforkids #nocode`,
      tags: ['kids make a game with ai', 'no code game for kids', 'ai for kids', 'game making for kids', 'family game night'] },
    facebook: { caption: `Kamilla had the idea at 7:02 pm: a park, a girl and her corgi. By 7:41 we were playing her game against each other at the same table.

She decided what to make, told the AI, checked what came back and fixed it. No code.

What would your kid's game be about?

#kidsgames #aiforkids`, comment: fbComment('04-idea-to-game') },
  },

  '05-reason-to-show': {
    keyword: 'screen time for kids',
    tiktok: { caption: `Screen time for kids, turned around: kids don't need more screen time. They need a reason to show you something. A screen she makes on is not a screen she scrolls. Every lesson of ours ends with a thing to show.

#screentime #parentingtips #kidsandai` },
    youtube: { title: 'Screen Time for Kids: A Screen She Makes On, Not Scrolls',
      description: `Kids don't need more screen time. They need a reason to show you something.

A different look at screen time for kids: a screen she makes on is not a screen she scrolls. In our AI course every lesson ends with a thing your kid made and wants to show, like a game or a cartoon.

First lesson free: makeshowlab.com

#screentime #parenting #kidsandai`,
      tags: ['screen time for kids', 'healthy screen time', 'screen time ideas', 'ai for kids', 'parenting tips'] },
    facebook: { caption: `Kids don't need more screen time. They need a reason to show you something.

A screen she makes on is not a screen she scrolls. That's the idea behind every lesson we make: it ends with a thing your kid made and wants to show you.

What was the last thing your kid made on a screen instead of watching?

#screentime #parenting`, comment: fbComment('05-reason-to-show') },
  },

  '06-watch-make-show': {
    keyword: 'AI lesson for kids',
    tiktok: { caption: `AI lesson for kids in three steps: Watch, Make, Show. Kamilla shows the finished thing first. Your kid builds it and you sit next to them. Then you play it, show the family, send it to grandma. 6 to 20 minutes, and it ends with a real thing.

#aiforkids #kidsandai #homeschool` },
    youtube: { title: 'AI Lesson for Kids in 3 Steps: Watch, Make, Show',
      description: `What happens in one AI lesson for kids: three steps, 6 to 20 minutes.

Watch: Kamilla shows the finished thing first. Make: your kid builds it and you sit next to them. Show: play it, show the family, send it to grandma. Every lesson ends with something your kid made.

First lesson free: makeshowlab.com

#aiforkids #kidsandai #homeschool`,
      tags: ['ai lesson for kids', 'how to teach kids ai', 'ai for kids', 'homeschool technology', 'kids and ai'] },
    facebook: { caption: `What actually happens in one of our AI lessons? Three steps, 6 to 20 minutes.

Watch: Kamilla shows the finished thing first.
Make: your kid builds it, and you sit next to them.
Show: play it, show the family, send it to grandma.

Every lesson ends with something your kid made. Save this for the night you try the first one.

#aiforkids #familytime`, comment: fbComment('06-watch-make-show') },
  },

  '07-made-by-10-year-old': {
    keyword: 'AI projects for kids',
    tiktok: { caption: `AI projects for kids: everything here was made by Kamilla, who is 10. A cartoon with her own characters. A game you can play. A sticker pack of her own character. No code. She had the ideas and gave the directions.

#aiforkids #kidsprojects #creativekids` },
    youtube: { title: 'AI Projects for Kids: What a 10-Year-Old Made (No Code)',
      description: `Everything in this video was made by Kamilla, who is 10.

Three AI projects for kids from our course: a cartoon with her own characters, a game you can play and a sticker pack of her own character. No code. She had the ideas and gave the directions, with a parent next to her.

First lesson free: makeshowlab.com

#aiforkids #kidsprojects #creativekids`,
      tags: ['ai projects for kids', 'what kids can make with ai', 'ai for kids', 'kids cartoon maker', 'creative kids'] },
    facebook: { caption: `Everything in this video was made by Kamilla. She's 10.

A cartoon with her own characters. A game you can play. A sticker pack of her own character. No code.

She had the ideas and gave the directions. That's the part we care about.

What would your kid make first: a cartoon, a game or stickers?

#aiforkids #creativekids`, comment: fbComment('07-made-by-10-year-old', 'works', 'See what kids make in the course:') },
  },

  '08-will-ai-think': {
    keyword: 'will AI think for my kid',
    tiktok: { caption: `Will AI think for my kid? Only if the AI has the ideas. In every lesson of our course the child decides what to make, tells the AI, checks what comes back and fixes it. The AI is the tool. The thinking stays with your kid.

#kidsandai #parentingtips #criticalthinking` },
    youtube: { title: 'Will AI Think for My Kid? Only If the AI Has the Ideas',
      description: `Will AI think for my kid? Only if the AI is the one with the ideas.

In every lesson the child decides what to make, tells the AI, checks what comes back and fixes it. The AI is the tool. The thinking stays with your child. Don't let AI think for your child. Teach them to think with it.

First lesson free: makeshowlab.com

#kidsandai #parenting #criticalthinking`,
      tags: ['will ai think for my kid', 'kids and ai', 'ai and critical thinking', 'ai for kids', 'parenting tips'] },
    facebook: { caption: `"Will AI think for my kid?"

Only if the AI is the one with the ideas.

In every lesson the child decides what to make, tells the AI, checks what comes back and fixes it. The AI is the tool. The thinking stays with your child.

Do you agree, or does AI at home still worry you? Tell us why.

#kidsandai #parenting`, comment: fbComment('08-will-ai-think') },
  },

  '09-first-families': {
    keyword: 'AI course for kids reviews',
    tiktok: { photo: true, caption: `AI course for kids reviews: the first 8 families tried it before launch. Four grandmothers and four moms, kids from 7 to 10. They made cartoons, songs, games and a website. They received the course free and shared honest feedback.

#aiforkids #grandparents #familyactivities` },
    youtube: null,
    facebook: { caption: `Eight families tried our course before anyone else. They paid nothing, and we asked them to tell us what really happened at their table.

Four grandmothers and four moms, kids from 7 to 10. They made cartoons, songs, games and a website. Their own words are in the pictures.

They received the course free and shared honest feedback. Names and photos are used with their permission.

Who would you do this with: a kid or a grandkid?

#aiforkids #grandparents`, comment: fbComment('09-first-families', 'families', 'All eight reviews are here:') },
  },

  '10-free-first-lesson': {
    keyword: 'free AI lesson for kids',
    tiktok: { photo: true, caption: `Free AI lesson for kids: your kid builds a game tonight. Leave your email, no card. Your kid builds a game in 10 to 20 minutes while you sit next to them. Then you play it against each other on the same couch. makeshowlab.com

#aiforkids #kidsgames #freelesson` },
    youtube: null,
    facebook: { caption: `Your kid can build a game tonight. The first lesson is free.

1. Leave your email. No card.
2. Your kid builds a game in 10 to 20 minutes. You sit next to them.
3. You play it against each other, on the same couch.

If it isn't a fit for your family, you've lost nothing but 20 minutes. The link is in the first comment.

#aiforkids #familytime`, comment: fbComment('10-free-first-lesson', 'free', 'Start the free lesson here:') },
  },
};
