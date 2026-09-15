const { chromium } = require('playwright-core');
const U='http://127.0.0.1:8099/index.html';
(async()=>{
  const browser = await chromium.launch({ executablePath:process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await (await browser.newContext({viewport:{width:1100,height:900}})).newPage();
  await page.goto(U,{waitUntil:'networkidle'});
  await page.evaluate(()=>{PREP.catalog.phases.slice(0,2).forEach(ph=>ph.itemIds.forEach(id=>PREP.store.record(id,true,'t')));PREP.store.saveNow();});
  let bad=0; const P=m=>{bad++;console.log('  ** '+m);};

  for (const [name,hash] of [['dashboard','#/'],['fase 1','#/fase/1'],['quiz','#/att/q-html'],
       ['esercizio di codice','#/att/mi-html'],['esame','#/att/fn-html'],['impostazioni','#/impostazioni']]){
    await page.goto(U+hash,{waitUntil:'networkidle'});
    await page.waitForTimeout(250);
    const a = await page.evaluate(()=>{
      const r={};
      r.lang = document.documentElement.lang;
      r.h1 = document.querySelectorAll('h1').length;
      r.title = !!document.title;
      r.imgSenzaAlt = [...document.querySelectorAll('img')].filter(i=>!i.hasAttribute('alt')).length;
      r.controlliSenzaNome = [...document.querySelectorAll('input,select,textarea,button')].filter(c=>{
        if (c.getAttribute('aria-hidden')==='true') return false;
        if (c.getAttribute('aria-label')||c.getAttribute('title')) return false;
        if (c.id && document.querySelector('label[for="'+CSS.escape(c.id)+'"]')) return false;
        if (c.closest('label')) return false;
        return !(c.textContent||'').trim() && !(c.value||'').trim();
      }).length;
      r.iframeSenzaTitolo = [...document.querySelectorAll('iframe')].filter(f=>!f.getAttribute('title')).length;
      // salti nella gerarchia delle intestazioni
      const lv=[...document.querySelectorAll('h1,h2,h3,h4')].map(h=>+h.tagName[1]);
      r.saltiIntestazioni = lv.filter((v,i)=>i>0 && v-lv[i-1]>1).length;
      r.live = !!document.querySelector('[aria-live]');
      return r;
    });
    console.log(`  ${name.padEnd(20)} lang=${a.lang} h1=${a.h1} img-no-alt=${a.imgSenzaAlt} controlli-senza-nome=${a.controlliSenzaNome} iframe-no-title=${a.iframeSenzaTitolo} salti-h=${a.saltiIntestazioni}`);
    if(a.lang!=='it') P(name+': lang mancante');
    if(a.h1!==1) P(name+': h1 presenti '+a.h1+' (atteso 1)');
    if(a.imgSenzaAlt) P(name+': immagini senza alt');
    if(a.controlliSenzaNome) P(name+': '+a.controlliSenzaNome+' controlli senza nome accessibile');
    if(a.iframeSenzaTitolo) P(name+': iframe senza title');
    if(a.saltiIntestazioni) P(name+': salti nella gerarchia delle intestazioni');
  }

  // navigazione da tastiera: si raggiunge il primo pulsante di risposta?
  await page.goto(U+'#/att/q-html',{waitUntil:'networkidle'});
  let reached=false;
  for(let i=0;i<25;i++){
    await page.keyboard.press('Tab');
    if(await page.evaluate(()=>document.activeElement && document.activeElement.classList.contains('opt'))){reached=true;break;}
  }
  console.log('  opzioni del quiz raggiungibili con Tab ->', reached);
  if(!reached) P('le opzioni non si raggiungono da tastiera');
  // e si attivano con Invio?
  if(reached){
    await page.keyboard.press('Enter');
    const fb = await page.$('.fb');
    console.log('  attivazione con Invio ->', !!fb);
    if(!fb) P('le opzioni non si attivano da tastiera');
  }
  await browser.close();
  console.log(bad? '\n'+bad+' PROBLEMI DI ACCESSIBILITA\'' : '\nAutodiagnosi di accessibilita\' superata');
})();
