// Holiday sales posts 47-50 ("Gift a skill", owner 26 Nov): tiles. Same look as pack 3: logo only on top, the cartoon
// tinted behind (frames with the kids seen from behind), the comment word in quotes on the button.
// Gender-neutral on purpose (owner): the gift can go to a boy, so the pictures are the certificate, icons and the game.
import { C, card, icon, cartoonBg, top } from '../kit.mjs';
import { H } from './holiday-texts.mjs';

export const CERT = 'social/concept/out/holiday/gift-certificate.png';
const h1 = (html, top = 190, size = 104) => `<h1 class="t" style="top:${top}px;font-size:${size}px;white-space:nowrap">${html}</h1>`;
export const badge = (name, l, t, d, bg, rot = -6) => `<i class="badge" style="left:${l}px;top:${t}px;width:${d}px;height:${d}px;background:${bg};transform:rotate(${rot}deg)">${icon(name, Math.round(d * 0.5), '#141A33', 2.2)}</i>`;
const cert = (l, t, w, rot) => card({ l, t, w, h: Math.round(w * 1275 / 1650), rot, src: CERT });
const P = Object.fromEntries(H.map((p) => [p.n, p]));

export const TILESH = {
  47: { theme: 'y', html: `${top('')}${h1(P[47].tile, 190, 108)}
    ${cert(90, 580, 800, -3)}${badge('gift', 720, 1000, 230, C.coral, 8)}` },
  48: { theme: 'm', html: `${top('')}${h1(P[48].tile, 190, 96)}
    ${cert(90, 560, 800, -2)}${badge('snowflake', 720, 1000, 230, '#FFF4DC', 8)}` },
  49: { theme: 'y', html: `${top('')}${h1(P[49].tile, 190, 96)}
    ${cert(170, 720, 760, 3)}${badge('mail', 80, 1020, 240, C.yellow, -8)}` },
  50: { theme: 'm', html: `${top('')}${h1('Still need a gift?<br><mark>No shipping needed.</mark>', 190, 84)}
    ${cert(90, 600, 780, -2)}${badge('package-x', 720, 1020, 230, C.yellow, 8)}` },
};
export const BGH = { 47: ['f22', .7], 48: ['f14', .7], 49: ['f22', .7], 50: ['f14', .7] };
export const KWH = Object.fromEntries(H.map((p) => [p.n, p.kw]));
// btn = false: the reel cover leaves the button out (on a phone it sits under the caption)
export const tileHtmlH = (n, btn = true) => `${cartoonBg(...BGH[n])}${TILESH[n].html}${btn ? `<span class="btn" style="right:56px;bottom:46px;height:84px;padding:0 34px;font-size:36px;box-shadow:8px 8px 0 #fff;z-index:12">Comment “${KWH[n]}”</span>` : ''}`;
