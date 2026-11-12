// One page the owner opens inside Claude: the phone with every post as it will look in the Instagram app,
// the reels playing with their voice, the captions, the checks and what changed in the remake.
//   node social/concept/review/artifact.mjs   ->  social/concept/out/review/site/instagram.html + the media next to it
// The Instagram desk publishes it with the Artifact tool (root: out/review/site), always to the same address.
import { readFileSync, readdirSync, existsSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { slotOf } from './schedule.mjs';
import { META } from './meta.mjs';
import { PASS, COMMON } from './pass.mjs';

const concept = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = join(concept, 'out', 'review', 'site');
rmSync(site, { recursive: true, force: true });
mkdirSync(join(site, 'm'), { recursive: true });

const vo = readFileSync(join(concept, 'sound', 'VOICEOVER.md'), 'utf8');
const parse = (dir) => {
  const raw = readFileSync(join(concept, 'posts', dir, 'caption.md'), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm = Object.fromEntries(m[1].split('\n').map((l) => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '').replace(/\\"/g, '"')]; }));
  return { fm, caption: m[2].trim() };
};
const checks = (c) => {
  const first = c.split('\n')[0], tags = c.match(/#\w+/g) || [];
  return [[first.length <= 125, `First line ${first.length} of 125 characters`], [tags.length <= 5, `${tags.length} hashtags (max 5)`],
    [!/https?:\/\/|www\./i.test(c), 'No links in the caption'], [!/[—–]/.test(c), 'No long dashes'],
    [/in (our )?bio|send this|save this|send it|drop it|send them/i.test(c), 'One call to action']];
};
copyFileSync(join(concept, 'preview', 'n', 'avatar.jpg'), join(site, 'm', 'avatar.jpg'));

const posts = readdirSync(join(concept, 'posts')).filter((d) => /^\d\d-/.test(d)).sort().map((dir) => {
  const { fm, caption } = parse(dir);
  const n = +fm.post, id = dir, nn = dir.slice(0, 2), reel = fm.type === 'reel';
  const pdir = join(concept, 'posts', dir);
  let video = null, slides = [], poster = null, voiced = false;
  if (reel) {
    const sample = join(concept, 'out', `voice-sample-${nn}.mp4`);
    voiced = existsSync(sample);
    const src = voiced ? sample : join(pdir, 'reel.mp4');
    video = `m/${nn}.mp4`; copyFileSync(src, join(site, video));
    poster = `m/${nn}-poster.jpg`;
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '1.2', '-i', src, '-frames:v', '1', '-vf', 'scale=540:-2', '-q:v', '4', join(site, poster)]);
  } else {
    slides = readdirSync(pdir).filter((f) => /^slide-\d+\.jpg$/.test(f)).sort().map((f, i) => {
      const out = `m/${nn}-${i + 1}.jpg`;
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(pdir, f), '-vf', 'scale=720:-2', '-q:v', '4', join(site, out)]);
      return out;
    });
  }
  const thumb = `m/${nn}-tile.jpg`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(pdir, 'tile.jpg'), '-vf', 'scale=216:-2', '-q:v', '5', join(site, thumb)]);
  const sec = vo.split(/^### /m).find((s) => s.startsWith(id));
  const lines = sec ? [...sec.matchAll(/^\| (\d+) \| ([\d.]+-[\d.]+) \| (.+?) \| [\d.]+/gm)].map((r) => ({ t: r[2], line: r[3] })) : [];
  const who = sec ? sec.split('\n')[0].replace(/^\S+ · /, '').replace(/ · [\d.]+ s$/, '') : '';
  const dur = reel ? +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', join(site, video)]).toString() : 0;
  const slot = slotOf(n);
  return { n, id, rubric: fm.rubric, reel, video, poster, voiced, slides, thumb, dur: +dur.toFixed(1), caption, checks: checks(caption), lines, who,
    ai: fm.ai_generated === 'true', alt: fm.alt || '', meta: META[n], pass: PASS[n], slot: slot ? slot.text : '' };
});

const DATA = JSON.stringify({ posts, common: COMMON });
const html = `<title>Make Show Lab Instagram</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Sora:wght@700;800&display=swap">
<style>
/* Layout: the phone stays put on the left (sticky on wide screens), the post picker above it, the notes scroll on the right. */
:root{--bg:#F6F1E6;--card:#FFFFFF;--ink:#141A33;--mut:#5B6180;--line:#E6DCC6;--soft:#FFF3D6;--accent:#FF6F4A;--yellow:#FFC533;--ok:#1E7F58;--okbg:#E8F8EF;--hold:#FFF1D2;--holdfg:#7A4A00;
  --app:#FFFFFF;--appfg:#0C0C0F;--appmut:#737380;--appline:#E6E6EA;--display:'Sora','Arial Black',system-ui,sans-serif;--body:'Onest',system-ui,-apple-system,'Segoe UI',sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0B0F24;--card:#141A33;--ink:#FFF4DC;--mut:#A9B0D0;--line:#262E55;--soft:#1B2247;--okbg:#12352A;--ok:#5FE0A8;--hold:#3A2A08;--holdfg:#FFD98A;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0B0F24;--card:#141A33;--ink:#FFF4DC;--mut:#A9B0D0;--line:#262E55;--soft:#1B2247;--okbg:#12352A;--ok:#5FE0A8;--hold:#3A2A08;--holdfg:#FFD98A;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 var(--body)}
.wrap{max-width:1180px;margin:0 auto;padding-block:18px 60px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1{font:800 26px/1.1 var(--display);letter-spacing:-.03em;margin:0 0 4px}.lead{color:var(--mut);margin:0 0 14px;font-size:14px}
.pick{display:grid;grid-template-columns:repeat(10,1fr);gap:6px;margin-bottom:16px}
.pick button{position:relative;border:2px solid transparent;border-radius:10px;padding:0;background:none;cursor:pointer;overflow:hidden;aspect-ratio:3/4}
.pick img{width:100%;height:100%;object-fit:cover;display:block;border-radius:8px}.pick button.on{border-color:var(--accent)}.pick button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.pick b{position:absolute;left:5px;top:5px;background:#141A33;color:#FFC533;font:800 12px var(--display);border-radius:6px;padding:1px 6px}
.pick i{position:absolute;right:5px;top:5px;width:14px;height:14px;color:#fff;filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))}
.cols{display:grid;grid-template-columns:372px minmax(0,1fr);gap:26px;align-items:start}
.phonecol{position:sticky;top:env(safe-area-inset-top,0px)}
.phone{border-radius:40px;padding:10px;background:#0B0D1C;box-shadow:0 30px 60px -30px rgba(20,26,51,.5)}
.screen{border-radius:31px;overflow:hidden;background:var(--app);color:var(--appfg);font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13.5px;line-height:1.38;position:relative}
.rv{aspect-ratio:9/16;background:#000;color:#fff;position:relative}.rv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}
.rv:after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.62),rgba(0,0,0,0) 36%,rgba(0,0,0,0) 82%,rgba(0,0,0,.35));pointer-events:none}
.rtop{position:absolute;z-index:2;top:14px;left:14px;right:14px;display:flex;gap:16px;font-size:17px;font-weight:700}.rtop span{opacity:.7;font-weight:600}
.rail{position:absolute;z-index:3;right:8px;bottom:132px;display:flex;flex-direction:column;gap:18px;align-items:center}.rail div{display:flex;flex-direction:column;align-items:center;font-size:10.5px;gap:2px}.rail svg{width:26px;height:26px}
.rb{position:absolute;z-index:3;left:12px;right:64px;bottom:14px}.who{display:flex;align-items:center;gap:7px;font-size:13.5px;font-weight:700}.who img{width:30px;height:30px;border-radius:50%;border:1.5px solid #fff}
.fol{border:1px solid #fff;border-radius:7px;padding:2px 8px;font-size:11.5px;font-weight:600}.rcap{margin-top:8px;font-size:13px}.rcap .tag{color:#fff}.more{color:#ccc}
.rmus{display:flex;align-items:center;gap:6px;margin-top:8px;font-size:12px}.rmus svg{width:13px;height:13px}
.snd{white-space:nowrap;position:absolute;z-index:4;left:50%;top:44%;transform:translateX(-50%);background:rgba(20,20,24,.78);color:#fff;border:0;border-radius:24px;padding:10px 18px;font:600 14px var(--body);cursor:pointer}.snd:focus-visible{outline:3px solid #FFC533}
.ph{display:flex;align-items:center;gap:9px;padding:11px 12px 9px}.ph img{width:32px;height:32px;border-radius:50%}.ph b{font-size:13.5px}.ph .d{margin-left:auto;width:20px}
.sw{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;aspect-ratio:4/5;background:#eee;position:relative}.sw::-webkit-scrollbar{display:none}.sw img{flex:none;width:100%;height:100%;object-fit:cover;scroll-snap-align:start}
.cnt{position:absolute;right:12px;top:12px;background:rgba(20,20,24,.72);color:#fff;border-radius:12px;padding:3px 10px;font-size:12px;font-weight:600;z-index:2}
.fw{position:relative}.acts{display:flex;align-items:center;gap:13px;padding:10px 12px 5px;position:relative}.acts span{width:24px;height:24px;display:block}.acts .sv{margin-left:auto}
.dots{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:4px}.dots u{width:6px;height:6px;border-radius:50%;background:#C7C7CC}.dots u.on{background:#0095F6}
.cap{padding:2px 12px 14px;font-size:13.5px}.cap b{font-weight:700}.tag{color:#00376B}
.note{color:var(--mut);font-size:12.5px;text-align:center;margin:10px 4px 0}
.side{display:flex;flex-direction:column;gap:14px;min-width:0}.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px}
.card h2{font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin:0 0 8px;font-weight:700}
.full{white-space:pre-wrap;font-size:15px}.full .tag{color:#2F6FD6}
.kv{display:grid;grid-template-columns:140px 1fr;gap:5px 12px;font-size:14px}.kv b{color:var(--mut);font-weight:600}
.chk{list-style:none;padding:0;margin:0;display:grid;gap:3px;font-size:14px}.chk li:before{content:'✓ ';color:var(--ok);font-weight:800}.chk li.bad:before{content:'✗ ';color:#D93A2B}
.pass{background:var(--okbg);border-color:transparent}.pass h2{color:var(--ok)}.notes{margin:0;padding-left:18px;display:grid;gap:4px;font-size:14px}
.hold{background:var(--hold);color:var(--holdfg);border-color:transparent}.hold h2{color:var(--holdfg)}
table{border-collapse:collapse;width:100%;font-size:13.5px}td{border-top:1px solid var(--line);padding:6px 6px;vertical-align:top}td:first-child{color:var(--mut);width:130px}.old{text-decoration:line-through;color:var(--mut)}.nw{font-weight:600}
.vo{display:grid;grid-template-columns:86px 1fr;gap:3px 10px;font-size:14px}.vo b{color:var(--mut);font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
.head{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}.head .n{background:#141A33;color:#FFC533;border-radius:8px;padding:0 10px;font:800 20px var(--display)}.head h3{margin:0;font:800 20px var(--display);letter-spacing:-.02em}.head span{color:var(--mut);font-size:13.5px}
details{border-top:1px solid var(--line);padding-top:10px;margin-top:4px}summary{cursor:pointer;font-weight:600;color:var(--mut)}
@media (max-width:860px){.cols{grid-template-columns:1fr}.phonecol{position:static;max-width:372px;margin:0 auto}.pick{grid-template-columns:repeat(5,1fr)}}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
</style>
<div class="wrap">
<h1>Make Show Lab Instagram</h1>
<p class="lead">The first ten posts of @make_showlab, each as it will look in the app. Tap a post. Reels play with their voice (tap the sound button), carousels swipe. Nothing here is published yet.</p>
<div class="pick" id="pick" role="tablist" aria-label="Posts"></div>
<div class="cols"><div class="phonecol"><div class="phone"><div class="screen" id="screen"></div></div><p class="note" id="note"></p></div><div class="side" id="side"></div></div>
</div>
<script>
const D=${DATA};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const tag=s=>esc(s).replace(/#(\\w+)/g,'<span class="tag">#$1</span>');
const I={heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20.5s-8-4.7-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 6.3-8 11-8 11z"/></svg>',
comment:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L3 21l1.5-5.4A8.5 8.5 0 1 1 21 12z"/></svg>',
send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M22 3 9.5 10.5M22 3l-7 18-5.5-10.5L22 3zM9.5 10.5 2 8.5 22 3"/></svg>',
save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>',
dots:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
music:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V6l11-2v12" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/></svg>',
reel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 8h18M8 3l3 5M13 3l3 5"/><path d="M10 12l5 3-5 3z" fill="currentColor"/></svg>',
car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="14" height="14" rx="3"/><path d="M8 3h11a2 2 0 0 1 2 2v11"/></svg>'};
const short=c=>{const f=c.replace(/\\s*\\n\\s*/g,' ');if(f.length<=92)return tag(f);return tag(f.slice(0,92).replace(/\\s+\\S*$/,'').replace(/[.,;:]+$/,''))+'<span class="more">… more</span>'};
const pick=document.getElementById('pick'),screen=document.getElementById('screen'),side=document.getElementById('side'),note=document.getElementById('note');
D.posts.forEach((p,i)=>{const b=document.createElement('button');b.role='tab';b.id='tab'+p.n;b.setAttribute('aria-label','Post '+p.n);b.innerHTML='<img src="'+p.thumb+'" alt=""><b>'+p.n+'</b><i>'+(p.reel?I.reel:I.car)+'</i>';b.onclick=()=>show(i);pick.appendChild(b)});
function phone(p){
 if(p.reel)return '<div class="rv"><video id="v" src="'+p.video+'" poster="'+p.poster+'" autoplay muted loop playsinline></video><div class="rtop">Reels<span>Friends</span></div>'+
 '<div class="rail"><div>'+I.heart+'Like</div><div>'+I.comment+'Comment</div><div>'+I.send+'Send</div><div>'+I.dots+'</div></div>'+
 '<div class="rb"><div class="who"><img src="m/avatar.jpg" alt="">make_showlab <span class="fol">Follow</span></div><div class="rcap">'+short(p.caption)+'</div><div class="rmus">'+I.music+'make_showlab · Original audio</div></div>'+
 '<button class="snd" id="snd">Tap for sound</button></div>';
 return '<div class="ph"><img src="m/avatar.jpg" alt=""><b>make_showlab</b><span class="d">'+I.dots+'</span></div><div class="fw"><div class="sw" id="sw">'+p.slides.map(s=>'<img src="'+s+'" alt="">').join('')+'</div><span class="cnt" id="cnt">1/'+p.slides.length+'</span></div>'+
 '<div class="acts"><span>'+I.heart+'</span><span>'+I.comment+'</span><span>'+I.send+'</span><i class="dots" id="dots">'+p.slides.map((s,i)=>'<u class="'+(i?'':'on')+'"></u>').join('')+'</i><span class="sv">'+I.save+'</span></div>'+
 '<div class="cap"><b>make_showlab</b> '+short(p.caption)+'</div>';
}
function panel(p){
 const m=p.meta,ps=p.pass;
 return '<div class="card"><div class="head"><span class="n">'+p.n+'</span><h3>'+esc(p.rubric)+' · '+(p.reel?'Reel, '+p.dur+' s':'Carousel, '+p.slides.length+' slides')+'</h3><span>'+esc(m.type)+' · '+esc(p.slot)+'</span></div></div>'+
 (ps&&ps.open?'<div class="card hold"><h2>Needs your answer</h2>'+esc(ps.open)+'</div>':'')+
 '<div class="card"><h2>Full caption (opens after "more")</h2><div class="full">'+tag(p.caption)+'</div></div>'+
 '<div class="card"><h2>Checks</h2><ul class="chk">'+p.checks.map(([ok,t])=>'<li class="'+(ok?'':'bad')+'">'+esc(t)+'</li>').join('')+'</ul></div>'+
 '<div class="card"><h2>Details</h2><div class="kv"><b>Why this post</b><span>'+esc(m.why)+'</span><b>Who forwards it</b><span>'+esc(m.fwd)+'</span>'+
 '<b>Music</b><span>'+(p.reel?'"Playground Fun" by Ahjay Stelino (Mixkit free licence), cut to the picture, real sound effects':'none')+'</span>'+
 '<b>Voice</b><span>'+(p.reel?(p.voiced?'cloned voice ('+esc(p.who)+') in this video; the owner decides by ear':'not in this video yet'):'none')+'</span>'+
 '<b>AI label</b><span>'+(p.ai?'on when publishing (AI-made pictures)'+(p.voiced?', and the voice is cloned':''):p.voiced?'on when publishing: the voice is cloned (pictures are real)':'off')+'</span>'+
 '<b>Slot</b><span>'+esc(p.slot)+' (proposed, not set in Metricool)</span>'+(p.alt?'<b>Alt text</b><span>'+esc(p.alt)+'</span>':'')+'</div></div>'+
 (p.lines.length?'<div class="card"><h2>Voice lines</h2><div class="vo">'+p.lines.map(l=>'<b>'+esc(l.t)+' s</b><span>'+esc(l.line)+'</span>').join('')+'</div></div>':'')+
 (ps?'<div class="card pass"><h2>Text remake: '+esc(ps.verdict)+'</h2><ul class="notes">'+ps.notes.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>'+
 (ps.before?'<details><summary>Caption before the remake</summary><div class="full old" style="text-decoration:none;margin-top:8px">'+tag(ps.before)+'</div></details>':'')+
 (ps.screen.length?'<details open><summary>Changed on screen and in the voice</summary><table>'+ps.screen.map(([w,a,c])=>'<tr><td>'+esc(w)+'</td><td class="old">'+esc(a)+'</td><td class="nw">'+esc(c)+'</td></tr>').join('')+'</table></details>':'')+'</div>':'')+
 '<div class="card"><h2>Across all ten</h2><ul class="notes">'+D.common.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul></div>';
}
function show(i){
 const p=D.posts[i];[...pick.children].forEach((b,j)=>{b.classList.toggle('on',i===j);b.setAttribute('aria-selected',i===j)});
 screen.innerHTML=phone(p);side.innerHTML=panel(p);
 note.textContent=p.reel?(p.voiced?'The reel plays silently until you tap for sound.':'Reel without voice yet.'):'Swipe the slides, '+p.slides.length+' of them.';
 if(p.reel){const v=document.getElementById('v'),s=document.getElementById('snd');s.onclick=()=>{v.muted=false;v.currentTime=0;v.play().catch(()=>{});s.hidden=true}}
 else{const sw=document.getElementById('sw'),c=document.getElementById('cnt'),d=document.getElementById('dots');sw.addEventListener('scroll',()=>{const k=Math.round(sw.scrollLeft/sw.clientWidth);c.textContent=(k+1)+'/'+p.slides.length;[...d.children].forEach((u,j)=>u.classList.toggle('on',j===k))})}
 try{localStorage.setItem('msl-post',String(i))}catch(e){}
 if(location.hash!=='#post'+p.n)history.replaceState(null,'','#post'+p.n);
}
function fromHash(){const m=location.hash.match(/^#post(\\d+)$/);if(m){const i=D.posts.findIndex(p=>p.n===+m[1]);if(i>=0)return i}return -1}
let start=fromHash();if(start<0){try{start=+localStorage.getItem('msl-post')||0}catch(e){start=0}}if(!(start>=0&&start<D.posts.length))start=0;
show(start);addEventListener('hashchange',()=>{const i=fromHash();if(i>=0)show(i)});
</script>`;
writeFileSync(join(site, 'instagram.html'), html);
const files = readdirSync(join(site, 'm')).map((f) => `m/${f}`);
writeFileSync(join(site, 'files.json'), JSON.stringify(Object.fromEntries(files.map((f) => [f, f]))));
const mb = files.reduce((s, f) => s + readFileSync(join(site, f)).length, 0) / 1e6;
console.log(`wrote ${site}/instagram.html + ${files.length} media files (${mb.toFixed(1)} MB)`);
