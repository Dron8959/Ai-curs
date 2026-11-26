// Holiday sales posts (owner, 26 Nov): "Gift a skill". Course facts from social/brand/facts.md; the gift works by DM:
// buy on the site, send the kid's first name, get the certificate (out/holiday/gift-certificate.pdf).
// No discount numbers until the owner names them (DISCOUNT stays null). No Winter Break Challenge picture (owner).
// Imagery stays gender-neutral: the gift can go to a boy or a girl.
export const DISCOUNT = null;   // e.g. { line: '...', until: '...' } once the owner gives size, plan, code and end time
export const H = [
  { n: 47, slug: 'gift-a-skill', grid: 'H1', date: 'Fri 27 Nov (Black Friday)', kw: 'GIFT', format: 'Carousel', theme: 'y',
    tile: 'Gift a skill,<br><mark>not another toy.</mark>',
    slides: [
      ['Gift a skill, not another toy', 'For the kid who has everything.'],
      ['What they’ll make', 'A game, a cartoon, a song, a website, a sticker pack, a voiceover.'],
      ['With you next to them', 'Lessons of 6 to 20 minutes. Each one ends with something finished.'],
      ['Under the tree', 'A certificate with their name on it.'],
      ['$197, paid once', 'Or $297 with homework checked by Anna the same day. No subscription.'],
      ['Comment “GIFT”', 'I’ll send you how it works.']],
    caption: `Gift a skill this year, not another toy.

It's an AI course your kid makes things in, with you right next to them: a game, a cartoon, a song, a website, a sticker pack, a voiceover in their own voice. Lessons take 6 to 20 minutes, and each one ends with something finished to show the family.

Under the tree goes a certificate with their name on it.

Comment "GIFT" and I'll send you how it works.

#blackfriday #giftideas #giftsforkids #aiforkids` },

  { n: 48, slug: 'gift-all-winter', grid: 'H2', date: 'Sat 28 Nov', kw: 'GIFT', format: 'Reel', theme: 'm',
    tile: 'A gift they open,<br><mark>then use all winter.</mark>',
    scenes: [['Not another<br><mark>toy.</mark>', 'icon:gift'], ['A game. A song.<br><mark>A cartoon.</mark>', 'img:landing/game.jpg'], ['Their name on<br><mark>the certificate.</mark>', 'img:certificate']],
    end: 'Gift<br><mark>a skill.</mark>',
    voice: ['A gift they open, then use all winter.', 'Not another toy they forget by January.', 'They make a game, a song, a cartoon.', 'Their name goes on the certificate.', 'Want the details? Type gift below.'],
    caption: `A gift they open, then use all winter.

Not another toy that's forgotten by January. In our AI course your kid makes a game, a song, a cartoon, a website, with you next to them. Under the tree goes a certificate with their name.

$197 paid once, or $297 with homework checked the same day. No subscription.

Comment "GIFT" and I'll send you how it works.

#giftsforkids #christmasgifts #giftideas #aiforkids` },

  { n: 49, slug: 'gift-in-an-email', grid: 'H3', date: 'Mon 30 Nov (Cyber Monday)', kw: 'GIFT', format: 'Carousel', theme: 'n',
    tile: 'Still shopping?<br><mark>This gift fits</mark><br><mark>in an email.</mark>',
    slides: [
      ['Still shopping? This gift fits in an email', 'No shipping, no waiting.'],
      ['The login comes by email', 'Right after you buy.'],
      ['A certificate to print', 'With their name, for under the tree.'],
      ['What’s inside', 'A game, a cartoon, a song, a website, a sticker pack, a voiceover.'],
      ['$197, paid once', 'Or $297 with homework checked by Anna the same day.'],
      ['Comment “GIFT”', 'I’ll send you how it works.']],
    caption: `Still shopping? This gift fits in an email.

No shipping and no waiting: the login comes to your email right after you buy. We send you a certificate with your kid's name to print and put under the tree.

Inside: a game, a cartoon, a song, a website, a sticker pack, a voiceover, all made by your kid with you next to them. $197 paid once, or $297 with homework checked the same day.

Comment "GIFT" and I'll send you how it works.

#cybermonday #giftideas #giftsforkids #aiforkids` },

  { n: 50, slug: 'last-minute-gift', grid: 'H5', date: 'about 15 Dec', kw: 'GIFT', format: 'Reel', theme: 'c',
    tile: 'Still need a gift?<br><mark>No shipping needed.</mark>',
    scenes: [['No shipping.<br><mark>No waiting.</mark>', 'icon:mail'], ['The login comes<br><mark>by email.</mark>', 'icon:laptop'], ['Print the<br><mark>certificate.</mark>', 'img:certificate']],
    end: 'Ready by<br><mark>tonight.</mark>',
    voice: ['Still need a gift? This one needs no shipping.', 'No boxes, no waiting at the door.', 'The login comes by email right after you buy.', 'Print the certificate with their name.', 'Want the details? Type gift below.'],
    caption: `Still need a gift? This one needs no shipping.

The login to our AI course comes by email right after you buy, and we send you a certificate with your kid's name to print and put under the tree. Inside: a game, a cartoon, a song, a website, made by your kid with you next to them.

$197 paid once, or $297 with homework checked the same day.

Comment "GIFT" and I'll send you how it works.

#lastminutegifts #giftsforkids #christmasgifts #aiforkids` },
];
