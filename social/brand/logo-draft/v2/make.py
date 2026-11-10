# Flat characters in the makeshowlab logo style: navy outline, yellow ring, mint accents.
N='#141A33'; Y='#FFC533'; CREAM='#FFF4DC'; MINT='#5FE0A8'; MINTD='#2FBF8A'; CORAL='#FF6F4A'; SKIN='#F7D3B8'
def T(g,dx,dy,s): return f'<g transform="translate({dx} {dy}) scale({s})">{g}</g>'
def person(hair, hair_hi, eye, outfit, kid=True, headset=True, necklace=False):
    # drawn around face centre (0,0); face rx 150 ry 165
    w=20
    back = (f'<path d="M-185 -40 C -200 -190, -110 -250, 0 -250 C 110 -250, 200 -190, 185 -40 '
            f'C 195 60, 210 160, 190 250 C 170 290, 130 300, 110 280 L -110 280 C -130 300, -170 290, -190 250 '
            f'C -210 160, -195 60, -185 -40 Z" fill="{hair}" stroke="{N}" stroke-width="{w}" stroke-linejoin="round"/>')
    if kid:  # wavy ends
        back += (f'<path d="M-205 150 q-22 -40 0 -80 M205 150 q22 -40 0 -80" fill="none" stroke="{N}" stroke-width="14" stroke-linecap="round"/>')
    body = (f'<path d="M-270 520 C -260 290, -170 225, 0 225 C 170 225, 260 290, 270 520 Z" fill="{outfit}" stroke="{N}" stroke-width="{w}" stroke-linejoin="round"/>')
    if kid:
        body += f'<path d="M-62 228 Q 0 272 62 228" fill="none" stroke="{N}" stroke-width="16" stroke-linecap="round"/>'
        body += f'<path d="M-62 228 Q 0 262 62 228 Q 0 244 -62 228Z" fill="#FFFFFF"/>'
    else:
        body += f'<path d="M-90 240 L -60 520 M90 240 L 60 520" stroke="{N}" stroke-width="16" stroke-linecap="round"/>'
    neck = f'<path d="M-42 140 L -42 225 Q 0 248 42 225 L 42 140 Z" fill="{SKIN}" stroke="{N}" stroke-width="16" stroke-linejoin="round"/>'
    if necklace:
        neck += f'<path d="M-42 190 Q 0 250 42 190" fill="none" stroke="{Y}" stroke-width="7"/><circle cx="0" cy="222" r="9" fill="{Y}" stroke="{N}" stroke-width="5"/>'
    face = f'<ellipse cx="0" cy="0" rx="150" ry="168" fill="{SKIN}" stroke="{N}" stroke-width="{w}"/>'
    # front hair: middle part, two curtains
    front = ''
    for m in (1,-1):
        front += (f'<path d="M0 -206 C {-30*m} -150, {-95*m} -112, {-132*m} -66 C {-152*m} -20, {-152*m} 60, {-160*m} 150 '
                  f'L {-200*m} 150 C {-212*m} 30, {-205*m} -100, {-150*m} -180 C {-108*m} -222, {-40*m} -230, 0 -206 Z" '
                  f'fill="{hair}" stroke="{N}" stroke-width="16" stroke-linejoin="round"/>')
        front += f'<path d="M{-40*m} -196 C {-80*m} -170, {-120*m} -140, {-150*m} -90" fill="none" stroke="{hair_hi}" stroke-width="12" stroke-linecap="round"/>'
    eyes = ''.join(f'<ellipse cx="{x}" cy="18" rx="36" ry="40" fill="#FFFFFF" stroke="{N}" stroke-width="14"/>'
                   f'<circle cx="{x+4}" cy="24" r="23" fill="{eye}"/><circle cx="{x+5}" cy="26" r="11" fill="{N}"/><circle cx="{x+12}" cy="14" r="7" fill="#FFF"/>' for x in (-60,60))
    brows = f'<path d="M-95 -38 q35 -18 70 -4 M25 -42 q35 -14 70 4" fill="none" stroke="{N}" stroke-width="12" stroke-linecap="round"/>'
    cheeks = f'<ellipse cx="-92" cy="80" rx="28" ry="15" fill="#FF9C86" opacity=".65"/><ellipse cx="92" cy="80" rx="28" ry="15" fill="#FF9C86" opacity=".65"/>'
    smile = f'<path d="M-38 100 q38 32 76 0" fill="none" stroke="{N}" stroke-width="14" stroke-linecap="round"/>'
    hs = ''
    if headset:
        hs = (f'<path d="M-170 -10 C -175 -230, 175 -230, 170 -10" fill="none" stroke="{N}" stroke-width="18"/>'
              f'<path d="M-170 -10 C -175 -230, 175 -230, 170 -10" fill="none" stroke="{MINT}" stroke-width="7"/>'
              f'<circle cx="-168" cy="30" r="46" fill="{MINT}" stroke="{N}" stroke-width="18"/>'
              f'<circle cx="168" cy="30" r="46" fill="{MINT}" stroke="{N}" stroke-width="18"/>'
              # antenna from the right ear cup, like the robot
              f'<path d="M190 -10 L 240 -120" stroke="{N}" stroke-width="14" stroke-linecap="round"/>'
              f'<circle cx="246" cy="-134" r="22" fill="{MINT}" stroke="{N}" stroke-width="12"/>')
    return back+body+neck+face+front+eyes+brows+cheeks+smile+hs

def badge(inner, sparkles=True):
    cx,cy,R,r=470,560,412,345
    sp = (f'<g fill="{Y}"><path d="M842 120 q10 52 58 62 q-48 10 -58 62 q-10 -52 -58 -62 q48 -10 58 -62z"/>'
          f'<path d="M920 240 q12 64 72 76 q-60 12 -72 76 q-12 -64 -72 -76 q60 -12 72 -76z"/>'
          f'<path d="M930 470 q7 36 40 43 q-33 7 -40 43 q-7 -36 -40 -43 q33 -7 40 -43z"/></g>') if sparkles else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">'
            f'<defs><clipPath id="d"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath></defs>{sp}'
            f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="{Y}"/><circle cx="{cx}" cy="{cy}" r="{r}" fill="{CREAM}"/>'
            f'<g clip-path="url(#d)"><circle cx="{cx}" cy="1060" r="430" fill="#FFE2A8"/>{inner}</g>'
            f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{N}" stroke-width="28"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{N}" stroke-width="20"/></svg>')

kam = dict(hair='#5A3423', hair_hi='#7A4A33', eye='#7A4B2A', outfit=MINT, kid=True, headset=True)
anna = dict(hair='#3B2A22', hair_hi='#C49A70', eye='#6B4226', outfit='#1E2547', kid=False, headset=False, necklace=True)
open('kamilla.svg','w').write(badge(T(person(**kam),470,535,0.98)))
duo = T(person(**anna),345,500,0.84) + T(person(**kam),610,600,0.74)
open('kamilla-anna.svg','w').write(badge(duo))
