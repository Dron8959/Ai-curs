// Every word a viewer sees or hears in the first ten posts, in one place, with a lint for AI tells.
//   node social/concept/review/texts.mjs            all texts + lint hits
//   node social/concept/review/texts.mjs --json     the same as JSON
// The lint is a heuristic (TELLS from threads-lint.mjs plus the structural bans of mk-copywriting/ai-tells.md):
// a clean line means "no known tell found", not "sounds human". The read-aloud pass is done by a person.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { posts } from '../content.mjs';
import { reels } from '../reels.mjs';
import { TELLS } from '../threads-lint.mjs';
const concept = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const strip = (h) => h.replace(/<br\s*\/?>/gi, ' ').replace(/<(style|script)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#39;|&rsquo;/g, "'").replace(/\s+/g, ' ').trim();
const MORE = [
  [/\b\w+\?\s+[A-Z][^?]{0,40}\./, 'rhetorical question, then answer'],
  [/^[A-Z][\w' ]{1,25}:\s+\w/, 'colon reveal'],
  [/(?:^|\.\s)(?:[A-Z][^.?!]{0,22}[.?!]\s*){3,}/, 'fragment drumbeat (3+ very short sentences)'],
  [/\b(?:truly|genuinely|incredibly|simply|actually|literally|unlock|empower|journey|seamless|game-changer)\b/i, 'stock word'],
];
const lint = (t) => [...TELLS, ...MORE].filter(([re]) => re.test(t)).map(([, w]) => w);

const vo = readFileSync(join(concept, 'sound', 'VOICEOVER.md'), 'utf8');
export function texts() {
  return posts.map((p) => {
    const dir = readdirSync(join(concept, 'posts')).find((d) => d.startsWith(p.id.slice(0, 3)));
    const cap = readFileSync(join(concept, 'posts', dir, 'caption.md'), 'utf8').replace(/^---[\s\S]*?---\n/, '').trim();
    const items = [{ where: 'caption', text: cap }];
    items.push({ where: 'cover', text: strip(p.tile || '') });
    (p.slides || []).forEach((s, i) => items.push({ where: `slide ${i + 1}`, text: strip(typeof s === 'string' ? s : s.html || '') }));
    (reels[p.id] || []).forEach((s, i) => items.push({ where: `scene ${i + 1}`, text: strip(s.html || '') }));
    const sec = vo.split(/^### /m).find((s) => s.startsWith(p.id));
    if (sec) [...sec.matchAll(/^\| (\d+) \| [\d.]+-[\d.]+ \| (.+?) \| [\d.]+/gm)].forEach((r) => items.push({ where: `voice ${r[1]}`, text: r[2] }));
    return { n: p.n, id: p.id, items: items.map((it) => ({ ...it, lint: lint(it.text) })) };
  });
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const all = texts();
  if (process.argv.includes('--json')) { console.log(JSON.stringify(all, null, 1)); process.exit(0); }
  for (const p of all) {
    console.log(`\n### ${p.n} ${p.id}`);
    for (const it of p.items) console.log(`[${it.where}] ${it.text}${it.lint.length ? `\n    >> ${it.lint.join('; ')}` : ''}`);
  }
}
