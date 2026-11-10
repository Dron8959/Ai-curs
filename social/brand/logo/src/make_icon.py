#!/usr/bin/env python3
"""makeshowlab logo icon, v4: Anna and Kamilla at a laptop.

Same language as the original robot logo: navy outline, yellow ring, mint and coral accents,
sparkles. Writes icon.svg (full), icon-small.svg (optical size for <= 64 px) and avatar.svg.

    python3 make_icon.py
"""
N = '#141A33'
Y = '#FFC533'
CREAM = '#FFF4DC'
SAND = '#FFE7B8'
MINT = '#5FE0A8'
CORAL = '#FF6F4A'
SKIN = '#F8D6BC'
BLUSH = '#FF9C86'
WHITE = '#FFFFFF'
SPACE = '#070A1F'


def f(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


def T(g, dx, dy, s):
    return f'<g transform="translate({f(dx)} {f(dy)}) scale({s})">{g}</g>'


def star(cx, cy, r, fill=Y, stroke=None, sw=0):
    k = r * 0.26
    d = (f'M{f(cx)} {f(cy - r)} Q{f(cx + k)} {f(cy - k)} {f(cx + r)} {f(cy)} Q{f(cx + k)} {f(cy + k)} {f(cx)} {f(cy + r)} '
         f'Q{f(cx - k)} {f(cy + k)} {f(cx - r)} {f(cy)} Q{f(cx - k)} {f(cy - k)} {f(cx)} {f(cy - r)}Z')
    st = f' stroke="{stroke}" stroke-width="{f(sw)}" stroke-linejoin="round"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{st}/>'


def person(kind, s, W, detail=True):
    """One head and shoulders, drawn around the face centre (0, 0). s is the placement scale, so
    stroke widths are divided by it and every outline ends up W px wide in the final icon."""
    sw = W / s
    A = kind == 'anna'
    hair = '#3B2A22' if A else '#5C3A28'
    hi = '#C8A27A'
    top = CORAL if A else MINT
    rx, ry = (146, 170) if A else (150, 162)
    ey = 2 if A else 14
    o = []

    # 1. hair silhouette: straight for Anna, wavy for Kamilla
    if A:
        sil = ('M0 -254 C112 -254 204 -192 194 -40 C206 70 214 200 200 310 L200 420 L-200 420 L-200 310 '
               'C-214 200 -206 70 -194 -40 C-204 -192 -112 -254 0 -254Z')
    else:
        sil = ('M0 -250 C110 -250 200 -192 190 -44 C216 16 186 86 210 150 C230 212 198 262 216 330 L216 420 '
               'L-216 420 L-216 330 C-198 262 -230 212 -210 150 C-186 86 -216 16 -190 -44 C-200 -192 -110 -250 0 -250Z')
    o.append(f'<path d="{sil}" fill="{hair}" stroke="{N}" stroke-width="{f(sw)}" stroke-linejoin="round"/>')

    # 2. shoulders and neck
    o.append(f'<path d="M-280 640 C-270 300 -172 232 0 232 C172 232 270 300 280 640Z" fill="{top}" '
             f'stroke="{N}" stroke-width="{f(sw)}" stroke-linejoin="round"/>')
    o.append(f'<path d="M-42 120 L-42 234 Q0 262 42 234 L42 120Z" fill="{SKIN}" stroke="{N}" '
             f'stroke-width="{f(sw * .85)}" stroke-linejoin="round"/>')

    # 3. face
    o.append(f'<ellipse cx="0" cy="0" rx="{rx}" ry="{ry}" fill="{SKIN}" stroke="{N}" stroke-width="{f(sw)}"/>')

    # 4. front hair: a fill that covers the top of the face, then one clean hairline stroke
    ay = -ry + 26

    def half(m):  # parting apex -> jaw
        return f'C{36 * m} {ay + 34} {94 * m} -116 {124 * m} -60 C{137 * m} -14 {142 * m} 58 {118 * m} 100'

    def half_rev(m):  # jaw -> parting apex
        return f'C{142 * m} 58 {137 * m} -14 {124 * m} -60 C{94 * m} -116 {36 * m} {ay + 34} 0 {ay}'

    o.append(f'<path d="M0 {ay} {half(1)} L170 100 L172 -40 C176 -168 98 -230 0 -230 C-98 -230 -176 -168 -172 -40 '
             f'L-170 100 L-118 100 {half_rev(-1)}Z" fill="{hair}"/>')
    if A and detail:  # sun-lightened strands
        for m in (1, -1):
            o.append(f'<path d="M{34 * m} -210 C{86 * m} -194 {138 * m} -150 {160 * m} -70" fill="none" '
                     f'stroke="{hi}" stroke-width="12" stroke-linecap="round"/>')
    o.append(f'<path d="M-118 100 {half_rev(-1)} {half(1)}" fill="none" stroke="{N}" stroke-width="{f(sw)}" '
             f'stroke-linecap="round" stroke-linejoin="round"/>')
    if detail and A:
        o.append(f'<path d="M0 {ay} L0 {ay - 40}" stroke="{N}" stroke-width="{f(sw * .6)}" stroke-linecap="round"/>')

    # 5. eyes, cheeks, mouth
    ex = 56 if A else 58
    erx, ery = (16, 23) if A else (19, 27)
    if not detail:
        erx, ery = erx + 4, ery + 4
    for m in (1, -1):
        if detail:
            o.append(f'<ellipse cx="{(94 if A else 86) * m}" cy="{ey + 60}" rx="26" ry="14" fill="{BLUSH}" opacity=".7"/>')
        o.append(f'<ellipse cx="{ex * m}" cy="{ey}" rx="{erx}" ry="{ery}" fill="{N}"/>')
        if detail:
            o.append(f'<circle cx="{ex * m + 6}" cy="{ey - 9}" r="{6.5 if A else 7.5}" fill="#FFF"/>')
    if A:
        o.append(f'<path d="M-34 {ey + 84} Q0 {ey + 114} 34 {ey + 84}" fill="none" stroke="{N}" '
                 f'stroke-width="{f(sw * .62)}" stroke-linecap="round"/>')
    else:
        my = ey + 60
        o.append(f'<path d="M-40 {my} Q0 {my + 14} 40 {my} Q32 {my + 52} 0 {my + 52} Q-32 {my + 52} -40 {my}Z" '
                 f'fill="{N}" stroke="{N}" stroke-width="12" stroke-linejoin="round"/>')
        if detail:
            o.append(f'<path d="M-19 {my + 39} Q0 {my + 25} 19 {my + 39} Q10 {my + 50} 0 {my + 50} '
                     f'Q-10 {my + 50} -19 {my + 39}Z" fill="{CORAL}"/>')

    # 6. Kamilla's headphones (the robot's mint ear)
    if not A:
        band = 'M-172 -4 C-178 -230 178 -230 172 -4'
        o.append(f'<path d="{band}" fill="none" stroke="{N}" stroke-width="{f(sw + 16)}" stroke-linecap="round"/>')
        o.append(f'<path d="{band}" fill="none" stroke="{MINT}" stroke-width="16" stroke-linecap="round"/>')
        for x in (-216, 132):
            o.append(f'<rect x="{x}" y="-26" width="84" height="118" rx="40" fill="{MINT}" stroke="{N}" '
                     f'stroke-width="{f(sw)}"/>')
    return ''.join(o)


CX, CY = 490, 545


def scene(W, detail=True, boost=1.0):
    """Both heads and the laptop, in icon coordinates (ring centre CX, CY)."""
    sa, sk = .88 * boost, .77 * boost
    anna = T(person('anna', sa, W, detail), 372 - (boost - 1) * 60, 452, sa)
    kam = T(person('kam', sk, W, detail), 628 + (boost - 1) * 50, 526, sk)
    lap = (f'<rect x="300" y="656" width="380" height="236" rx="28" fill="{WHITE}" stroke="{N}" stroke-width="{W}"/>'
           + star(490, 770, 54 if detail else 66, MINT, N, 14 if detail else 20)
           + (star(553, 712, 17, Y) if detail else '')
           + f'<rect x="232" y="882" width="516" height="48" rx="24" fill="{WHITE}" stroke="{N}" stroke-width="{W}"/>'
           + (f'<rect x="446" y="882" width="88" height="17" rx="8.5" fill="{N}"/>' if detail else ''))
    return anna + kam, lap


def icon(W=22, RO=432, RI=372, detail=True, sparkles=True, boost=1.0, uid='i'):
    people, lap = scene(W, detail, boost)
    sp = (star(878, 150, 60) + star(780, 84, 24) + star(952, 262, 28)) if sparkles else ''
    return (f'<defs><clipPath id="clip-{uid}"><circle cx="{CX}" cy="{CY}" r="{RI}"/></clipPath></defs>'
            f'<circle cx="{CX}" cy="{CY}" r="{RO}" fill="{Y}" stroke="{N}" stroke-width="{W}"/>'
            f'<circle cx="{CX}" cy="{CY}" r="{RI}" fill="{CREAM}"/>'
            f'<g clip-path="url(#clip-{uid})"><circle cx="{CX}" cy="{CY + 470}" r="400" fill="{SAND}"/>{people}</g>'
            f'<circle cx="{CX}" cy="{CY}" r="{RI}" fill="none" stroke="{N}" stroke-width="{W - 2}"/>'
            f'{lap}{sp}')


def svg(inner, box=(0, 0, 1024, 1024), size=None, bg=None):
    x, y, w, h = box
    size = size or (w, h)
    rect = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" width="{size[0]}" height="{size[1]}">'
            f'{rect}{inner}</svg>')


if __name__ == '__main__':
    import json
    open('icon.svg', 'w').write(svg(icon()))
    # inner markup of each variant, for the lockup builder (ring centre CX, CY; outer edge = RO + W / 2)
    json.dump({
        'cx': CX, 'cy': CY,
        'full': {'svg': icon(), 'r': 443},
        'plain': {'svg': icon(sparkles=False, uid='p'), 'r': 443},
        'small': {'svg': icon(W=30, RO=436, RI=384, detail=False, sparkles=False, boost=1.06, uid='s'), 'r': 451},
    }, open('icons.json', 'w'))
    # optical size for small use: heavier lines, no fine detail, no outer sparkles, tight box around the ring
    small = icon(W=30, RO=436, RI=384, detail=False, sparkles=False, boost=1.06, uid='s')
    open('icon-small.svg', 'w').write(svg(small, box=(CX - 456, CY - 456, 912, 912), size=(1024, 1024)))
    open('icon-plain.svg', 'w').write(svg(icon(sparkles=False, uid='p'), box=(CX - 456, CY - 456, 912, 912), size=(1024, 1024)))

    # avatar: the icon with its sparkles on navy, placed so that everything sits inside the circle
    # the networks crop to (smallest circle around the ring and the sparkle tips, plus a 6% margin)
    import math
    pts = [(878, 90), (938, 150), (780, 60), (804, 84), (952, 234), (980, 262)]      # sparkle tips
    ex, ey = CX, CY
    for _ in range(4000):                                                           # shrink towards the farthest point
        far = max(pts + [(ex + (ex - CX or 1e-9), ey + (ey - CY))], key=lambda p: math.hypot(p[0] - ex, p[1] - ey))
        dr = math.hypot(ex - CX, ey - CY) + 443
        dp = max(math.hypot(p[0] - ex, p[1] - ey) for p in pts)
        if dp > dr:                                                                  # move towards the sparkles
            far = max(pts, key=lambda p: math.hypot(p[0] - ex, p[1] - ey))
            ex += (far[0] - ex) * .002; ey += (far[1] - ey) * .002
        else:                                                                        # move back towards the ring
            ex += (CX - ex) * .002; ey += (CY - ey) * .002
    R = max(math.hypot(ex - CX, ey - CY) + 443, max(math.hypot(p[0] - ex, p[1] - ey) for p in pts))
    k = 540 * .94 / R
    open('avatar.svg', 'w').write(svg(
        f'<rect width="1080" height="1080" fill="{SPACE}"/>'
        f'<g transform="translate(540 540) scale({k:.4f}) translate({-ex:.1f} {-ey:.1f})">{icon(uid="a")}</g>', box=(0, 0, 1080, 1080)))
    print('avatar: ring radius %.0f px of 540, scale %.3f' % (443 * k, k))

    # the two characters on their own, for posts and reels (head and shoulders, transparent ground)
    for name in ('anna', 'kam'):
        g = T(person(name, 1, 20), 300, 300, 1)
        open(f'char-{"anna" if name == "anna" else "kamilla"}.svg', 'w').write(svg(g, box=(0, 0, 600, 640)))
