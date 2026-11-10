// Presentation sheets for the logo: system overview and the reel mock.
//   node sheets.cjs <reel-frame.png> <photo.jpg> <out-dir>
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const [,, frame, photo, outDir]=process.argv;
const u=(p)=>'file://'+path.resolve(p);
(async()=>{
const kit=await import(path.resolve(__dirname,'../../../engine/kit.mjs'));
const b=await chromium.launch();
const shot=async(html,out,w)=>{const p=await b.newPage({viewport:{width:w,height:900},deviceScaleFactor:1});
  fs.writeFileSync('.s.html',html);await p.goto('file://'+process.cwd()+'/.s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
  await p.screenshot({path:out,fullPage:true});await p.close();fs.unlinkSync('.s.html');};

// ---------- 1. system sheet ----------
const sw=(c,name,hex)=>`<div class="sw"><i style="background:${c}"></i><b>${name}</b><span>${hex}</span></div>`;
const sys=`<style>
*{box-sizing:border-box}body{margin:0;background:#EEF0F6;font-family:Inter,sans-serif;color:#141A33;padding:40px;width:1800px}
h2{font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:#5B6180;margin:0 0 14px;font-weight:700}
.g{display:grid;gap:24px}.p{border-radius:22px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.dk{background:#070A1F}.lt{background:#FFF8EA;box-shadow:inset 0 0 0 1px #E6DFCB}.wh{background:#fff;box-shadow:inset 0 0 0 1px #DCDCEA}
.ph{background:url(${u(photo)}) 0% 0%/330%}
.cap{position:absolute;left:22px;bottom:16px;font-size:13.5px;color:#8E96B8;font-weight:500}.lt .cap,.wh .cap{color:#5B6180}.ph .cap{color:#fff;text-shadow:0 1px 6px #000}
.av{display:flex;align-items:flex-end;gap:26px}.av img{border-radius:50%;display:block}.av div{text-align:center;font-size:12.5px;color:#8E96B8}.av div img{margin:0 auto 8px}
.sz{display:flex;align-items:flex-end;gap:34px}.sz div{text-align:center;font-size:12.5px;color:#8E96B8}.sz img{display:block;margin:0 auto 10px}
.sep{width:1px;align-self:stretch;background:#1E2547;margin:0 6px}
.sws{display:flex;gap:16px}.sw{font-size:13px}.sw i{display:block;width:118px;height:70px;border-radius:14px;margin-bottom:8px;box-shadow:inset 0 0 0 1px rgba(20,26,51,.12)}.sw b{display:block}.sw span{color:#5B6180}
.ty{font-size:14px;color:#5B6180;line-height:1.6}.ty b{color:#141A33;font-size:16px}
</style>
<h2>makeshowlab · логотип, версия 4</h2>
<div class="g">
  <div class="p dk" style="height:470px"><img src="logo-horizontal-dark.svg" width="1260"><span class="cap">Основной логотип, тёмный фон</span></div>
  <div class="g" style="grid-template-columns:1.55fr 1fr 1fr">
    <div class="p lt" style="height:400px"><img src="logo-horizontal-light.svg" width="640"><span class="cap">Светлый фон</span></div>
    <div class="p dk"><img src="logo-stacked-dark.svg" width="380"><span class="cap">Вертикальный</span></div>
    <div class="p dk"><div class="av"><div><img src="avatar.svg" width="210" height="210">аватар</div><div><img src="avatar.svg" width="89" height="89">в профиле</div><div><img src="avatar.svg" width="34" height="34">в ленте</div></div></div>
  </div>
  <div class="g" style="grid-template-columns:680px 1fr">
    <div class="g">
      <div class="p dk" style="height:200px"><img src="plate.svg" style="filter:drop-shadow(0 8px 18px rgba(0,0,0,.4));margin-bottom:14px"><span class="cap">Плашка для видео</span></div>
      <div class="p ph" style="height:200px"><img src="plate.svg" style="filter:drop-shadow(0 8px 18px rgba(0,0,0,.4));margin-bottom:14px"><span class="cap">Она же на живом кадре</span></div>
    </div>
    <div class="p dk"><div class="sz">
      <div><img src="icon-plain.svg" width="128">128 px</div><div><img src="icon-plain.svg" width="96">96</div>
      <span class="sep"></span>
      <div><img src="icon-small.svg" width="64">64</div><div><img src="icon-small.svg" width="48">48</div><div><img src="icon-small.svg" width="32">32</div>
    </div><span class="cap">Слева основной рисунок, справа упрощённый для мелких размеров</span></div>
  </div>
  <div class="p wh" style="height:150px;justify-content:space-between;padding:0 34px">
    <div class="sws">${sw('#141A33','Navy','#141A33')}${sw('#FFC533','Yellow','#FFC533')}${sw('#FF6F4A','Coral','#FF6F4A')}${sw('#5FE0A8','Mint','#5FE0A8')}${sw('#FFF4DC','Cream','#FFF4DC')}</div>
    <div class="ty"><b>Sora ExtraBold</b> — надпись, буква l перерисована<br><b>Urbanist Bold</b> — строка под надписью</div>
  </div>
</div>`;
await shot(sys,path.join(outDir,'logo-system.png'),1800);

// ---------- 2. reel mock ----------
const ui=`<div class="ui"><div class="hd"><i></i>Reels</div><div class="col"><b></b><b></b><b></b><b class="s"></b></div>
  <div class="ft"><span class="av"></span><span class="l1"></span><span class="l2"></span><span class="l3"></span></div></div>`;
const plate=`<img class="plate" src="${u('plate.svg')}">`;
const end=`<div class="f paper planet" style="isolation:isolate">
  <div style="position:absolute;left:90px;right:90px;top:330px;display:flex;flex-direction:column;gap:30px;align-items:flex-start;z-index:2">
    <h2 class="title" style="font-size:118px">Try it <span class="swipe">tonight.</span></h2>
    <p style="font-size:44px;color:var(--muted);font-weight:500">First lesson free. No card.</p>
    <span class="btn">makeshowlab.com</span></div>
  <img src="${u('logo-stacked-dark.svg')}" style="position:absolute;z-index:2;left:50%;top:930px;width:690px;transform:translateX(-50%);filter:drop-shadow(0 0 46px rgba(255,197,51,.28))">${ui}</div>`;
const frames={
  before:`<div class="f" style="background-image:url(${u(frame)})">${ui}</div>`,
  after:`<div class="f" style="background-image:url(${u(frame)})"><div class="patch"></div>${plate}${ui}</div>`,
  live:`<div class="f" style="background:#222 url(${u(photo)}) 50% 40%/cover">${plate}${ui}</div>`,
  end,
};
const labels={before:['Сейчас','значок 62 px, попадает под шапку Instagram'],after:['Плашка в начале и по ходу ролика','значок 128 px, ниже шапки, свой фон'],
  live:['На живом видео','тёмная подложка держит логотип на любом фоне'],end:['Финальный кадр','логотип крупно, с подписью и сайтом']};
const mock=`<style>${kit.baseCss()}
body{background:#EEF0F6;font-family:Inter,sans-serif;color:#141A33;padding:40px;width:1826px;overflow:visible}
h3{font:700 14px Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#5B6180;margin:0 0 18px}
.row{display:flex;gap:42px}.cell{width:405px}
.phn{width:405px;height:720px;border-radius:26px;overflow:hidden;position:relative;box-shadow:0 20px 50px -20px rgba(20,26,51,.45)}
.phn .f{transform:scale(.375);transform-origin:0 0}
.f{width:1080px;height:1920px;position:relative;background-size:cover;overflow:hidden}
.lab{margin-top:14px}.lab b{display:block;font-size:18px;font-weight:700}.lab span{font-size:14px;color:#5B6180}
.patch{position:absolute;left:50px;top:80px;width:520px;height:130px;background:rgb(0,2,11)}
.plate{position:absolute;left:36px;top:234px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.4))}
.btn{display:inline-flex;align-items:center;min-height:110px;padding:0 54px;border-radius:999px;color:#1A0A02;background:linear-gradient(180deg,#FFD08A,#FF8A3D);font-weight:800;font-size:40px;box-shadow:0 14px 44px rgba(255,138,61,.45)}
.ui{position:absolute;inset:0;z-index:9;color:#fff;font:600 46px Inter,sans-serif;opacity:.92}
.hd{position:absolute;left:44px;top:138px;display:flex;align-items:center;gap:22px}
.hd i{width:26px;height:26px;border-left:6px solid #fff;border-bottom:6px solid #fff;transform:rotate(45deg);margin-left:10px}
.col{position:absolute;right:38px;top:1060px;display:grid;gap:64px}.col b{width:72px;height:72px;border-radius:50%;border:6px solid #fff}.col b.s{border-radius:16px}
.ft{position:absolute;left:44px;bottom:110px}.ft span{display:block;background:#fff;border-radius:12px}
.ft .av{width:84px;height:84px;border-radius:50%;margin-bottom:26px}.l1{width:300px;height:26px;margin:-88px 0 62px 106px}.l2{width:640px;height:22px;margin-bottom:18px;opacity:.85}.l3{width:420px;height:22px;opacity:.6}
.crops{display:flex;gap:42px}.crop{height:200px;border-radius:16px;overflow:hidden;position:relative;background:#000}
.crop .f{position:absolute}.crop .ui{display:none}
</style>
<h3>Как логотип выглядит на ролике · экран телефона</h3>
<div class="row">${Object.keys(frames).map(k=>`<div class="cell"><div class="phn">${frames[k]}</div><div class="lab"><b>${labels[k][0]}</b><span>${labels[k][1]}</span></div></div>`).join('')}</div>
<h3 style="margin-top:36px">Тот же угол кадра в полном размере</h3>
<div class="crops">
  <div class="crop" style="width:440px"><div style="position:absolute;left:-60px;top:-50px">${frames.before}</div></div>
  <div class="crop" style="width:610px"><div style="position:absolute;left:-10px;top:-226px">${frames.after}</div></div>
  <div class="crop" style="width:610px"><div style="position:absolute;left:-10px;top:-226px">${frames.live}</div></div>
</div>`;
await shot(mock,path.join(outDir,'reel-mock.png'),1826);
await b.close();})();
