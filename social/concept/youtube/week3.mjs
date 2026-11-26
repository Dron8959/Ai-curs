// YouTube Shorts titles, descriptions and tags for the Instagram pack, posts 37-46 (week 3, new course of 25 Nov 2026).
// Written 25 Nov by the YouTube Shorts desk from review/week3-texts.mjs (key 0 = post 37 ... key 9 = post 46).
// Owner's rule (audit of 24 Nov): 80% of posts are about the parent's fears and wishes, 20% about the course.
// The hook is about the viewer; the course comes only in the last lines (free lesson, price). No "Comment X" ask:
// Shorts has no keyword replies. ai: reels carry AI pictures or a cloned voice (true); carousels 41 and 42 follow
// Instagram's isAiGenerated flag, check it when the posts are built. kind 'carousel' = youtube.mp4 from the slides.
const FREE = 'First lesson free, no card: makeshowlab.com';
const PRICE = 'The full course is $197, paid once. No subscription.';
const foot = `${FREE}\n${PRICE}`;

export const WEEK3_YT = {
  37: { kind: 'reel', ai: true, kw: 'ai homework help for kids', title: 'AI Homework Help for Kids: Have It Quiz Them Instead',
    tags: ['ai homework help for kids', 'homework help', 'kids and ai', 'parenting tips', 'ai for kids'],
    body: `AI homework help for kids that doesn't do the homework: before your kid asks for an answer, have them type "Don't give me the answer. Ask me questions until I get it."

The AI turns into a patient tutor, and your kid does the thinking. Try it tonight with one math problem.

${foot}

#aiforkids #homeworkhelp #parentingtips` },
  38: { kind: 'reel', ai: true, kw: 'why does ai make things up', title: 'Why Does AI Make Things Up? Explain It to a 7-Year-Old',
    tags: ['why does ai make things up', 'ai for kids', 'kids and ai', 'ai safety for kids', 'parenting tips'],
    body: `Why does AI make things up? Here's how to explain it to a 7-year-old: AI writes by guessing the next word, one word at a time. Most guesses are right. A wrong guess sounds just as sure as a right one.

So the rule at our house is simple: if it sounds too smooth, check one fact together.

${foot}

#aiforkids #kidsandai #aisafety` },
  39: { kind: 'reel', ai: true, kw: 'gift ideas for kids who have everything', title: 'Gift Ideas for Kids Who Have Everything: One They Make',
    tags: ['gift ideas for kids who have everything', 'black friday gift ideas', 'non toy gifts', 'ai for kids', 'gifts for kids'],
    body: `Gift ideas for kids who have everything: a gift they make instead of one you buy. A song from their own words, a cartoon from their drawing, a game the family can play.

Linda, a grandmother from our early-access group, wanted to give her grandson "something more meaningful than another toy." Her family got the course free and shared honest feedback.

${foot}

#giftideas #blackfriday #aiforkids` },
  40: { kind: 'reel', ai: true, kw: 'rainy day activities for kids', title: 'Rainy Day Activities for Kids: A 20-Minute Game Plan',
    tags: ['rainy day activities for kids', 'kids activities at home', 'kids make a game with ai', 'family activities', 'ai for kids'],
    body: `Rainy day activities for kids: bored kid, one laptop, a 20-minute plan.

1. Your kid picks an idea for a game. Anything: a dragon who bakes cookies works.
2. They talk, you type, and the AI builds it.
3. You play it against each other on the couch.

Our free first lesson walks you through exactly this. No card, just an email.

${foot}

#rainydayactivities #kidsactivities #aiforkids` },
  41: { kind: 'carousel', ai: false, kw: 'is chatgpt safe for kids', title: 'Is ChatGPT Safe for Kids? 3 Questions to Ask Together',
    tags: ['is chatgpt safe for kids', 'chatgpt for kids', 'ai safety for kids', 'online safety for kids', 'parenting tips'],
    body: `Is ChatGPT safe for kids? Before your kid opens it, ask these 3 questions together.

1. Whose account is it? Yours. Your kid never signs up anywhere alone.
2. What stays out? Full name with school, home address, passwords, photos of their face.
3. What if it says something wrong? Stop, show me, and we check it together.

${foot}

#chatgptforkids #aisafety #parentingtips` },
  42: { kind: 'carousel', ai: false, kw: 'ai rules for kids', title: 'AI Rules for Kids: 5 Rules for the Fridge, Read Together',
    tags: ['ai rules for kids', 'ai safety rules for kids', 'online safety for kids', 'kids and ai', 'parenting tips'],
    body: `AI rules for kids: five to read with your kid tonight.

1. The account is yours. Every AI tool runs on your account.
2. No chats with strangers, in any app.
3. Some things stay out of AI: full name with school, home address, passwords, photos of their face.
4. Links get a second look. Looks strange? Ask first.
5. Too perfect? Check it. A picture, a video or a text can be fake.

${foot}

#aisafety #onlinesafety #kidsandai` },
  43: { kind: 'reel', ai: true, kw: 'healthy screen time for kids', title: 'Healthy Screen Time for Kids: Watching or Making? Ask This',
    tags: ['healthy screen time for kids', 'screen time for kids', 'screen time ideas', 'parenting tips', 'kids and ai'],
    body: `Healthy screen time for kids: watching or making? You can tell in 10 seconds. Ask one question: "What did you make?"

If the answer is nothing, it was watching. If they pull up something to show you, it was making. Kids don't need more screen time. They need a reason to show you something.

Our free first lesson is one where your kid makes a game.

${foot}

#screentime #parentingtips #kidsandai` },
  44: { kind: 'reel', ai: true, kw: 'is using ai cheating', title: 'Is Using AI Cheating? The One Habit That Decides It',
    tags: ['is using ai cheating', 'ai and critical thinking', 'kids and ai', 'parenting tips', 'ai for kids'],
    body: `Is using AI cheating, or building? It comes down to one habit. The idea comes from your kid. The AI does the work. Then your kid checks what it made and fixes what's wrong.

When the idea and the fixing are theirs, the thinking is theirs too.

${foot}

#aiforkids #kidsandai #parentingtips` },
  45: { kind: 'reel', ai: true, kw: 'kids using ai for homework', title: 'Kids Using AI for Homework: One Question to Ask After',
    tags: ['kids using ai for homework', 'ai homework help for kids', 'homework help', 'parenting tips', 'kids and ai'],
    body: `Kids using AI for homework: AI can write the homework. It can't explain it for your kid. So after homework, ask one thing: "Explain it to me in your own words."

If they can, they learned it, however they got there. If they can't, sit down and go back through it together.

${foot}

#homeworkhelp #parentingtips #kidsandai` },
  46: { kind: 'reel', ai: true, kw: 'family game night idea', title: 'Family Game Night Idea: Ask AI the Same Question 3 Ways',
    tags: ['family game night idea', 'family game night', 'kids activities', 'kids and ai', 'ai for kids'],
    body: `A family game night idea for tonight: ask AI the same question 3 ways. Pick one question with your kid, like "Why does it rain?" Then ask: explain it like I'm 6. Now like I'm 12. Now like my grandma.

Read the three answers out loud and vote for the best one. Your kid learns the topic and learns that how you ask changes what you get.

${foot}

#familygamenight #kidsactivities #aiforkids` },
  47: { kind: 'carousel', ai: false, kw: 'black friday gifts for kids', title: 'Black Friday Gifts for Kids: Gift a Skill, Not Another Toy',
    tags: ['black friday gifts for kids', 'gift ideas for kids', 'non toy gifts', 'ai for kids', 'gifts for kids'],
    body: `Black Friday gifts for kids: gift a skill this year, not another toy.

It's an AI course your kid makes things in, with you right next to them: a game, a cartoon, a song, a website, a sticker pack, a voiceover in their own voice. Lessons take 6 to 20 minutes, and each one ends with something finished to show the family. Under the tree goes a certificate with their name on it.

$197 paid once, or $297 with homework checked the same day. No subscription.
${FREE}

#blackfriday #giftideas #aiforkids` },
  48: { kind: 'reel', ai: true, kw: 'christmas gifts for kids', title: 'Christmas Gifts for Kids: One They Open, Then Use All Winter',
    tags: ['christmas gifts for kids', 'gift ideas for kids', 'non toy gifts', 'ai for kids', 'gifts for kids'],
    body: `Christmas gifts for kids: a gift they open, then use all winter. Not another toy that's forgotten by January. In our AI course your kid makes a game, a song, a cartoon, a website, with you next to them. Under the tree goes a certificate with their name.

$197 paid once, or $297 with homework checked the same day. No subscription.
${FREE}

#christmasgifts #giftideas #aiforkids` },
  49: { kind: 'carousel', ai: false, kw: 'cyber monday gifts for kids', title: 'Cyber Monday Gifts for Kids: This One Fits in an Email',
    tags: ['cyber monday gifts for kids', 'gift ideas for kids', 'last minute gifts', 'ai for kids', 'gifts for kids'],
    body: `Cyber Monday gifts for kids, still shopping? This gift fits in an email. No shipping: the login comes to your email right after you buy. We send you a certificate with your kid's name to print and put under the tree.

Inside: a game, a cartoon, a song, a website, a sticker pack, a voiceover, all made by your kid with you next to them. $197 paid once, or $297 with homework checked the same day. No subscription.
${FREE}

#cybermonday #giftideas #aiforkids` },
  50: { kind: 'reel', ai: true, kw: 'last minute gifts for kids', title: 'Last Minute Gifts for Kids: No Shipping, Print the Card',
    tags: ['last minute gifts for kids', 'christmas gifts for kids', 'gift ideas for kids', 'ai for kids', 'gifts for kids'],
    body: `Last minute gifts for kids: this one needs no shipping. The login to our AI course comes by email right after you buy, and we send you a certificate with your kid's name to print and put under the tree. Inside: a game, a cartoon, a song, a website, made by your kid with you next to them.

$197 paid once, or $297 with homework checked the same day. No subscription.
${FREE}

#lastminutegifts #christmasgifts #aiforkids` },
};
