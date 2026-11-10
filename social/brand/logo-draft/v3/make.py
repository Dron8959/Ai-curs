# makeshowlab logo v3: Anna + Kamilla behind a laptop, in the original logo's language
# (navy outline, yellow ring, mint + coral accents, sparkles).
N='#141A33'; Y='#FFC533'; CREAM='#FFF4DC'; MINT='#5FE0A8'; CORAL='#FF6F4A'; SKIN='#F7D3B8'
W=22
def T(g,dx,dy,s): return f'<g transform="translate({dx} {dy}) scale({s})">{g}</g>'
def star(cx,cy,r,fill=Y,stroke=None,sw=0):
    k=r*0.26
    d=f'M{cx} {cy-r} Q{cx+k} {cy-k} {cx+r} {cy} Q{cx+k} {cy+k} {cx} {cy+r} Q{cx-k} {cy+k} {cx-r} {cy} Q{cx-k} {cy-k} {cx} {cy-r}Z'
    st=f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{st}/>'
def person(hair, hi, outfit, kid):
    sw=W/ (0.68 if kid else 0.78)          # keep outline weight equal after scaling
    back=(f'<path d="M-185 -40 C -200 -190, -110 -250, 0 -250 C 110 -250, 200 -190, 185 -40 '
          f'C 205 40, 182 90, 205 150 C 225 200, 195 240, 212 310 L -212 310 C -195 240, -225 200, -205 150 '
          f'C -182 90, -205 40, -185 -40 Z" fill="{hair}" stroke="{N}" stroke-width="{sw}" stroke-linejoin="round"/>')
    body=f'<path d="M-275 560 C -265 300, -170 228, 0 228 C 170 228, 265 300, 275 560 Z" fill="{outfit}" stroke="{N}" stroke-width="{sw}" stroke-linejoin="round"/>'
    neck=f'<path d="M-42 140 L -42 226 Q 0 250 42 226 L 42 140 Z" fill="{SKIN}" stroke="{N}" stroke-width="{sw*.8}" stroke-linejoin="round"/>'
    face=f'<ellipse cx="0" cy="0" rx="150" ry="166" fill="{SKIN}" stroke="{N}" stroke-width="{sw}"/>'
    front=''
    for m in (1,-1):
        front+=(f'<path d="M0 -206 C {-30*m} -150, {-95*m} -112, {-132*m} -66 C {-152*m} -20, {-152*m} 60, {-160*m} 150 '
                f'L {-200*m} 150 C {-212*m} 30, {-205*m} -100, {-150*m} -180 C {-108*m} -222, {-40*m} -230, 0 -206 Z" '
                f'fill="{hair}" stroke="{N}" stroke-width="{sw*.8}" stroke-linejoin="round"/>')
        front+=f'<path d="M{-44*m} -196 C {-84*m} -170, {-122*m} -140, {-152*m} -92" fill="none" stroke="{hi}" stroke-width="13" stroke-linecap="round"/>'
    eyes=''.join(f'<ellipse cx="{x}" cy="14" rx="19" ry="27" fill="{N}"/><circle cx="{x+7}" cy="3" r="7.5" fill="#FFF"/>' for x in (-58,58))
    cheeks=f'<ellipse cx="-96" cy="72" rx="27" ry="15" fill="#FF9C86" opacity=".7"/><ellipse cx="96" cy="72" rx="27" ry="15" fill="#FF9C86" opacity=".7"/>'
    if kid:
        mouth=(f'<path d="M-40 84 Q 0 100 40 84 Q 30 138 0 138 Q -30 138 -40 84 Z" fill="{N}" stroke="{N}" stroke-width="12" stroke-linejoin="round"/>'
               f'<path d="M-20 122 Q 0 108 20 122 Q 10 134 0 134 Q -10 134 -20 122Z" fill="{CORAL}"/>')
        hs=(f'<path d="M-170 -6 C -176 -236, 176 -236, 170 -6" fill="none" stroke="{N}" stroke-width="{sw+8}"/>'
            f'<path d="M-170 -6 C -176 -236, 176 -236, 170 -6" fill="none" stroke="{MINT}" stroke-width="12"/>'
            f'<rect x="-216" y="-22" width="84" height="112" rx="40" fill="{MINT}" stroke="{N}" stroke-width="{sw}"/>'
            f'<rect x="132" y="-22" width="84" height="112" rx="40" fill="{MINT}" stroke="{N}" stroke-width="{sw}"/>')
    else:
        mouth=f'<path d="M-36 92 Q 0 124 36 92" fill="none" stroke="{N}" stroke-width="15" stroke-linecap="round"/>'
        hs=''
    return back+body+neck+face+front+eyes+cheeks+mouth+hs

CX,CY,R,r=480,548,424,358
def icon(bg=CREAM):
    anna=T(person('#3B2A22','#C8A27A',CORAL,False),382,452,0.78)
    kam =T(person('#5A3423','#8A5A3F',MINT,True),606,512,0.68)
    laptop=(f'<rect x="286" y="660" width="388" height="232" rx="26" fill="#FFFFFF" stroke="{N}" stroke-width="{W}"/>'
            f'<rect x="286" y="660" width="388" height="232" rx="26" fill="none" stroke="#E7E1D2" stroke-width="6" transform="translate(0 0)" opacity="0"/>'
            + star(480,772,52,MINT,N,14) + star(540,716,17,Y) +
            f'<rect x="226" y="884" width="508" height="46" rx="23" fill="#FFFFFF" stroke="{N}" stroke-width="{W}"/>'
            f'<rect x="436" y="884" width="88" height="16" rx="8" fill="{N}"/>')
    sparks=star(868,150,62)+star(770,78,26)+star(950,268,30)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">'
            f'<defs><clipPath id="d"><circle cx="{CX}" cy="{CY}" r="{r}"/></clipPath></defs>'
            f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="{Y}" stroke="{N}" stroke-width="{W+4}"/>'
            f'<circle cx="{CX}" cy="{CY}" r="{r}" fill="{bg}"/>'
            f'<g clip-path="url(#d)"><circle cx="{CX}" cy="1010" r="400" fill="#FFE2A8"/>{anna}{kam}</g>'
            f'<circle cx="{CX}" cy="{CY}" r="{r}" fill="none" stroke="{N}" stroke-width="{W}"/>'
            f'{laptop}{sparks}</svg>')
open('icon.svg','w').write(icon())
