// Writes posts/<NN>-*/youtube.md from youtube/week2.mjs for every post whose folder already exists, and lints each entry.
// Usage: node social/concept/youtube/write.mjs
import { readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WEEK2_YT } from './week2.mjs';
const POSTS = join(dirname(fileURLToPath(import.meta.url)), '..', 'posts');
const dirs = readdirSync(POSTS);
let bad = 0, wrote = 0, waiting = [];
for (const [n, y] of Object.entries(WEEK2_YT)) {
  const errs = [];
  const t = y.title.toLowerCase(), kw = y.kw.toLowerCase(), b = y.body.toLowerCase();
  if (y.title.length < 50 || y.title.length > 60) errs.push(`title ${y.title.length} chars (want 50-60)`);
  if (!(t.indexOf(kw) >= 0 && t.indexOf(kw) + kw.length <= 45)) errs.push('search phrase not in the first 40 chars of the title');
  if (!b.includes(kw)) errs.push('description lacks the search phrase');
  if (y.tags[0].toLowerCase() !== kw) errs.push('first tag is not the search phrase');
  if ((y.body.match(/#\w+/g) || []).length > 3) errs.push('more than 3 hashtags');
  if (/https?:\/\//.test(y.body)) errs.push('link in description');
  if (/[–—]/.test(y.title + y.body)) errs.push('long dash');
  if (errs.length) { bad++; console.log(`#${n}: ${errs.join('; ')}`); continue; }
  const d = dirs.find((x) => x.startsWith(`${String(n).padStart(2, '0')}-`));
  if (!d) { waiting.push(n); continue; }
  writeFileSync(join(POSTS, d, 'youtube.md'), `---
post: ${n}
network: youtube shorts
title: "${y.title}"
title_length: ${y.title.length}
media: ${y.kind === 'reel' ? 'reel.mp4' : 'youtube.mp4 (built from the slides: python3 social/concept/youtube/carousels.py ' + d + ')'}
category: Education
privacy: public
made_for_kids: "No" (the videos speak to parents; the owner confirmed this on 16 Nov 2026)
altered_content: ${y.ai ? 'yes, isAiGeneratedContent true' : 'no, isAiGeneratedContent false'}
tags: [${y.tags.join(', ')}]
---
${y.body.trim()}
`);
  wrote++;
}
console.log(`${Object.keys(WEEK2_YT).length} entries: ${bad} with problems, ${wrote} written, ${waiting.length} waiting for their folder (${waiting.join(', ')})`);
if (bad) process.exit(1);
