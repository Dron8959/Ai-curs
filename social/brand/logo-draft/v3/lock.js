const {chromium}=require('playwright');const fs=require('fs');
const F='/tmp/claude-0/-home-user-Ai-curs/cd4ade8b-8c8f-532d-b409-9d7d76b3c453/scratchpad/fonts/node_modules/@fontsource';const icon=fs.readFileSync('icon.svg','utf8');
const fonts=`
@font-face{font-family:Outfit;font-weight:700;src:url(file://${F}/outfit/files/outfit-latin-700-normal.woff2)}
@font-face{font-family:Outfit;font-weight:800;src:url(file://${F}/outfit/files/outfit-latin-800-normal.woff2)}
@font-face{font-family:Sora;font-weight:800;src:url(file://${F}/sora/files/sora-latin-800-normal.woff2)}
@font-face{font-family:Urbanist;font-weight:700;src:url(file://${F}/urbanist/files/urbanist-latin-700-normal.woff2)}
@font-face{font-family:Bricolage;font-weight:700 800;src:url(file:///home/user/Ai-curs/assets/fonts/bricolage-grotesque-latin.woff2)}`;
const lock=(id,font,weight,ls,dark,tag=true)=>`<div class="lk ${dark?'dk':'lt'}" id="${id}"><div class="ic">${icon}</div><div class="tx">
<div class="wm" style="font-family:${font};font-weight:${weight};letter-spacing:${ls}em"><span class="a">make</span><span class="b">show</span><span class="c">lab</span></div>
${tag?'<div class="tg">AI creativity for kids <i>+</i> parents</div>':''}</div></div>`;
const stack=(id,font,weight,ls,dark)=>`<div class="lk st ${dark?'dk':'lt'}" id="${id}"><div class="ic">${icon}</div><div class="tx">
<div class="wm" style="font-family:${font};font-weight:${weight};letter-spacing:${ls}em"><span class="a">make</span><span class="b">show</span><span class="c">lab</span></div>
<div class="tg">AI creativity for kids <i>+</i> parents</div></div></div>`;
const html=`<style>${fonts}
body{margin:0;background:#05071A;display:flex;flex-direction:column;gap:24px;padding:24px;align-items:flex-start}
.lk{display:inline-flex;align-items:center;gap:26px;padding:28px 44px 28px 30px}
.lk.st{flex-direction:column;gap:10px;padding:36px 48px;text-align:center}
.lk.st .ic{width:360px;height:360px}.lk.st .ic svg{width:360px;height:360px}
.ic{width:230px;height:230px;flex:none}.ic svg{width:230px;height:230px;display:block}
.wm{font-size:112px;line-height:1}
.tg{font-family:Urbanist;font-weight:700;font-size:23px;letter-spacing:.2em;text-transform:uppercase;margin-top:12px;padding-left:5px}
.tg i{font-style:normal}
.dk{background:#05071A}.dk .a{color:#FFF4DC}.dk .b{color:#FFC533}.dk .c{color:#FF6F4A}.dk .tg{color:#9AA1C2}.dk .tg i{color:#5FE0A8}
.lt{background:#FFF8EA}.lt .a{color:#141A33}.lt .b{color:#F2A900}.lt .c{color:#FF6F4A}.lt .tg{color:#5B6180}.lt .tg i{color:#2FBF8A}
</style>
${lock('A-dark','Bricolage',800,-.035,true)}${lock('B-dark','Outfit',800,-.03,true)}${lock('C-dark','Sora',800,-.045,true)}
${lock('A-light','Bricolage',800,-.035,false)}${stack('A-stack','Bricolage',800,-.035,true)}${lock('A-plain','Bricolage',800,-.035,true,false)}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:2200},deviceScaleFactor:2});
fs.writeFileSync('.lock.html',html);await p.goto('file://'+process.cwd()+'/.lock.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
for(const id of ['A-dark','B-dark','C-dark','A-light','A-stack','A-plain']){await (await p.$('#'+id)).screenshot({path:'lockup-'+id+'.png'});}
// transparent version of A
await p.addStyleTag({content:'body,.lk{background:transparent!important}'});
await (await p.$('#A-dark')).screenshot({path:'lockup-A-transparent.png',omitBackground:true});
await (await p.$('#A-plain')).screenshot({path:'lockup-A-plain-transparent.png',omitBackground:true});
await b.close()})();
