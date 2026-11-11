// Screenshots the phone with the Instagram profile from the preview page, whole grid, white as in the app.
//   node social/concept/preview/shot.cjs        ->  social/concept/out/instagram-profile.png
// Run make_page.py first: it writes profile.html next to this file.
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const page = path.join(__dirname, 'profile.html');
  const out = path.join(__dirname, '..', 'out', 'instagram-profile.png');
  const b = await chromium.launch();
  const pg = await (await b.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 })).newPage();
  const errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto('file://' + page);
  await pg.waitForTimeout(1500);
  // the phone on the page scrolls inside a fixed frame; for the picture it is opened to its full height
  await pg.addStyleTag({ content: '.screen{height:auto!important;overflow:visible!important}.phone-col{position:static!important}.bar{position:static!important}' });
  await pg.waitForTimeout(600);
  await (await pg.$('.phone')).screenshot({ path: out });
  await b.close();
  if (errs.length) { console.error('page errors:', errs); process.exit(1); }
  console.log('wrote', path.relative(process.cwd(), out));
})();
