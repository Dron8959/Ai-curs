#!/usr/bin/env node
// Checks Threads texts for "AI tells": the patterns that make a post read as machine-written.
// Source list: .claude/skills/mk-copywriting/references/ai-tells.md and mk-social (MIT, Corey Haines).
//
//   node social/concept/threads-lint.mjs           old posts (text.mjs, threads.mjs) and the v2 drafts (threads-v2.mjs)
//
// It is a heuristic: a clean result means "no known tell found", not "sounds human". Read the post aloud too.

import { posts as shared } from './text.mjs';
import { posts as only } from './threads.mjs';
import { posts as v2 } from './threads-v2.mjs';

export const TELLS = [
  [/\b(?:it|that|this)['’]?s not\b[^.\n]{0,90}[.,;]\s*(?:it|that|this)['’]?s\b/i, 'contrast reveal "it\'s not X, it\'s Y"'],
  [/\b(?:isn['’]?t|aren['’]?t|is not|are not)\b[^.\n]{1,70}\.\s+(?:it['’]?s|that['’]?s|they['’]?re|this is)\b/i, 'contrast reveal "X isn\'t Y. It\'s Z."'],
  [/\bnot because\b/i, '"not because X. because Y"'],
  [/\b(?:no|zero) [^.\n,]{2,30}, (?:no|zero) [^.\n,]{2,30}/i, 'negation list "no X, no Y"'],
  [/\b(?:agree\??|thoughts\??|let that sink in|read that again|here['’]?s the thing|here['’]?s how|say goodbye)\b(?!\s+(?:with|to))/i, 'engagement bait or stock phrase'],
  [/\b(?:the (?:result|catch|answer|truth)|why does this matter)\?\s/i, 'rhetorical question, then answer'],
  [/[—–]/, 'em dash'],
  [/[\u{1F300}-\u{1FAFF}✅\u{1F680}]/u, 'emoji as decoration'],
];

export function lint(text) {
  const hits = TELLS.filter(([re]) => re.test(text)).map(([, why]) => why);
  const len = [...text].length;
  if (len > 300) hits.push(`${len} characters: too long for a phone read (aim for 150 to 250)`);
  return hits;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const groups = [
    ['old, text.mjs', shared.map((p) => [p.id, p.threads.text])],
    ['old, threads.mjs', only.map((p) => [p.id, p.text])],
    ['v2 drafts', v2.map((p) => [p.id, p.text])],
  ];
  for (const [name, list] of groups) {
    const bad = list.map(([id, t]) => [id, lint(t)]).filter(([, h]) => h.length);
    console.log(`\n${name}: ${list.length - bad.length} of ${list.length} clean`);
    for (const [id, h] of bad) console.log(`  ${id}: ${h.join('; ')}`);
  }
}
