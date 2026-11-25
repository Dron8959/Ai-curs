// Pack 3 tiles (owner audit 24 Nov: the hook is about the parent, the course only at the end).
// Same look as pack 2: logo only on top, Kamilla's cartoon tinted behind, the comment word in quotes on the button.
import { C, M, card, ring, pill, star, icon, cartoonBg, top } from '../kit.mjs';
import { bubble } from './week2-art.mjs';
import { W3 } from './week3-texts.mjs';

const h1 = (html, top = 190, size = 104) => `<h1 class="t" style="top:${top}px;font-size:${size}px">${html}</h1>`;
const badge = (name, l, t, d, bg, rot = -6) => `<i class="badge" style="left:${l}px;top:${t}px;width:${d}px;height:${d}px;background:${bg};transform:rotate(${rot}deg)">${icon(name, Math.round(d * 0.5), '#141A33', 2.2)}</i>`;
const mini = (ok, text, l, t, rot) => `<div class="card" style="left:${l}px;top:${t}px;width:430px;height:auto;padding:34px 36px;transform:rotate(${rot}deg);background:#FFF4DC">
  <b style="display:grid;place-items:center;width:84px;height:84px;border-radius:50%;background:${ok ? C.mint : C.coral};border:5px solid #141A33;font:800 46px Sora;color:#141A33">${ok ? '✓' : '✕'}</b>
  <p style="margin-top:22px;font:800 52px/1.05 Sora;letter-spacing:-.04em;color:#141A33">${text}</p></div>`;
const step = (n, text, l, t, bg) => `<div style="position:absolute;z-index:6;left:${l}px;top:${t}px;display:flex;align-items:center;gap:26px">
  <span class="num" style="position:relative;width:120px;height:120px;font-size:62px;flex:none;background:${bg}">${n}</span>
  <p style="font:800 64px Sora;letter-spacing:-.04em;color:#141A33">${text}</p></div>`;

export const TILES3 = {
  37: { theme: 'c', html: `${top('')}${h1(W3[0].tile, 190, 92)}
    ${bubble('Do my math homework.', 84, 760, 640, { rot: -2, size: 50 })}
    ${bubble('Don’t give me the answer. Ask me questions until I get it.', 220, 960, 780, { me: true, rot: 2, size: 46 })}` },
  38: { theme: 'k', html: `${top('')}${h1(W3[1].tile, 190, 108)}
    ${bubble('Penguins live at the North Pole!', 90, 620, 760, { rot: -2, size: 60 })}
    <b style="position:absolute;z-index:8;left:640px;top:880px;display:grid;place-items:center;width:230px;height:230px;border-radius:50%;background:${C.coral};border:8px solid #141A33;font:800 130px Sora;color:#141A33;transform:rotate(-10deg)">✕</b>
    <span class="note" style="left:110px;top:960px;transform:rotate(-4deg);font-size:64px">sounds so sure</span>` },
  39: { theme: 'y', html: `${top('')}${h1(W3[2].tile, 190, 124)}
    ${ring({ l: 90, t: 600, d: 420, src: `${M}/landing/reviews/linda.jpg`, pos: '50% 25%', zoom: 175, pad: 14 })}
    <div class="card" style="left:540px;top:700px;width:460px;height:auto;padding:38px 40px;transform:rotate(2deg);background:#FFF4DC"><p style="font:700 50px/1.2 Urbanist;color:#141A33">“something more meaningful than another toy”</p><p style="margin-top:18px;font:800 24px Sora;letter-spacing:.06em;text-transform:uppercase;color:#4B5070">Linda · got the course free</p></div>
    ${badge('gift', 160, 1060, 220, C.coral)}` },
  40: { theme: 'm', html: `${top('')}${h1(W3[3].tile, 190, 96)}
    ${step(1, 'they pick an idea', 90, 720, C.yellow)}${step(2, 'AI builds a game', 90, 880, C.yellow)}${step(3, 'you play it', 90, 1040, C.yellow)}
    ${badge('cloud-rain', 760, 560, 200, '#FFF4DC', 8)}` },
  41: { theme: 'c', html: `${top('')}${h1(W3[4].tile, 190, 104)}
    ${[['Whose account?', -2], ['What stays out?', 2], ['What if it’s wrong?', -1]].map(([q, r], i) => `<div class="card" style="left:${90 + (i % 2) * 70}px;top:${700 + i * 175}px;width:820px;height:auto;padding:26px 36px;transform:rotate(${r}deg);background:#FFF4DC;display:flex;align-items:center;gap:26px"><span class="num" style="position:relative;width:90px;height:90px;font-size:48px;flex:none">${i + 1}</span><p style="font:800 56px Sora;letter-spacing:-.04em;color:#141A33">${q}</p></div>`).join('')}` },
  42: { theme: 'k', html: `${top('')}${h1(W3[5].tile, 190, 118)}
    <span style="position:absolute;z-index:7;left:470px;top:470px;transform:rotate(-4deg);font:400 64px 'Caveat Brush';color:#141A33">read them together</span>
    <div class="card" style="left:110px;top:620px;width:860px;height:auto;padding:40px 46px;transform:rotate(-1.5deg);background:#FFF4DC;display:grid;gap:22px">
    ${['The account is yours.', 'No chats with strangers.', 'Some things stay out.', 'Links get a second look.', 'Too perfect? Check it.'].map((r, i) => `<div style="display:flex;align-items:center;gap:22px"><span class="num" style="position:relative;width:70px;height:70px;font-size:38px;flex:none">${i + 1}</span><p style="font:800 48px Sora;letter-spacing:-.04em;color:#141A33">${r}</p></div>`).join('')}</div>` },
  43: { theme: 'n', html: `${top('')}${h1(W3[6].tile, 190, 100)}
    ${mini(false, 'watched 40 videos', 80, 720, -3)}${mini(true, 'made a game to show you', 560, 760, 3)}` },
  44: { theme: 'm', html: `${top('')}${h1(W3[7].tile, 190, 92)}
    ${[['lightbulb', 'idea: your kid', C.yellow], ['bot', 'work: AI', '#FFF4DC'], ['pencil', 'fix: your kid', C.yellow]].map(([ic, t, bg], i) =>
      `${badge(ic, 90 + i * 320, 790 + (i % 2) * 60, 230, bg, i % 2 ? 6 : -6)}${pill(t, 70 + i * 320, 1080 + (i % 2) * 60, i % 2 ? 3 : -3)}`).join('')}` },
  45: { theme: 'c', html: `${top('')}${h1(W3[8].tile, 190, 88)}
    ${bubble('Explain it to me in your own words.', 160, 900, 760, { me: true, rot: 2, size: 56 })}` },
  46: { theme: 'k', html: `${top('')}${h1(W3[9].tile, 190, 108)}
    ${bubble('Explain rain like I’m 6.', 84, 640, 700, { rot: -2, size: 52 })}
    ${bubble('Now like I’m 12.', 300, 840, 600, { rot: 2, size: 52 })}
    ${bubble('Now like my grandma.', 120, 1040, 680, { rot: -1, size: 52 })}` },
};
export const BG3 = { 37: ['f8', .7], 38: ['f9', .7], 39: ['f17', .7], 40: ['f19', .7], 41: ['f3', .7], 42: ['f14', .7], 43: ['f11', .7], 44: ['f22', .7],
  45: ['f5', .7], 46: ['f1', .7] };
export const KW3 = Object.fromEntries(W3.map((p) => [p.n, p.kw]));
export const tileHtml3 = (n) => `${cartoonBg(...BG3[n])}${TILES3[n].html}<span class="btn" style="right:56px;bottom:46px;height:84px;padding:0 34px;font-size:36px;box-shadow:8px 8px 0 #fff;z-index:12">Comment “${KW3[n]}”</span>`;
