// node render.cjs file.svg out.png [width]
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const [,, src, out, w]=process.argv;const svg=fs.readFileSync(src,'utf8');
const m=svg.match(/width="([\d.]+)" height="([\d.]+)"/);const W=+m[1],H=+m[2];const k=w?(+w)/W:1;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:Math.ceil(W*k),height:Math.ceil(H*k)}});
fs.writeFileSync('.r.html',`<body style="margin:0;background:transparent"><img src="${src}" style="display:block;width:${W*k}px;height:${H*k}px">`);
await p.goto('file://'+process.cwd()+'/.r.html');await p.waitForTimeout(150);await p.screenshot({path:out,omitBackground:true});await b.close();fs.unlinkSync('.r.html')})();
