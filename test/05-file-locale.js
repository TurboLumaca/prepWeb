const { chromium } = require('playwright-core');
(async()=>{
  // nessun flag permissivo: e' esattamente cio' che accade con un doppio clic
  const browser = await chromium.launch({ executablePath:process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await (await browser.newContext()).newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.goto('file:///home/user/prepWeb/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.PREP&&PREP.catalog,{timeout:15000}).catch(()=>{});

  const boot = await page.evaluate(()=>({
    app: !!(window.PREP&&PREP.catalog),
    storage: PREP.store.available,
    items: PREP.catalog.phases.reduce((n,p)=>n+p.itemIds.length,0)
  }));
  console.log('avvio:', JSON.stringify(boot));

  // la correzione richiede di leggere il DOM di un iframe: e' il punto critico su file://
  const grade = await page.evaluate(async ()=>{
    const out={};
    for(const lang of ['html','css','js']){
      const it = PREP.data.micro.find(x=>x.lang===lang);
      try{ const r = await PREP.grader.grade(it,it.solution); out[lang]=r.passed+'/'+r.total; }
      catch(e){ out[lang]='ERRORE: '+e.message; }
    }
    return out;
  });
  console.log('correzione su file://:', JSON.stringify(grade));

  // persistenza su file://
  const persist = await page.evaluate(()=>{ PREP.store.record('prova-file',true,'t'); PREP.store.saveNow();
    try{ return !!localStorage.getItem('prepweb.v1'); }catch(e){ return 'eccezione: '+e.message; } });
  console.log('salvataggio progressi su file://:', persist);
  if(errs.length) console.log('errori:', errs.slice(0,3));
  await browser.close();
})();
