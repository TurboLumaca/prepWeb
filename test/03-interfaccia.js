const { chromium } = require('playwright-core');
const B=process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const URL='http://127.0.0.1:8099/index.html';
let problems=[];
function P(m){ problems.push(m); console.log('  ** '+m); }

async function run(label, viewport){
  console.log('\n===== '+label+' =====');
  const browser = await chromium.launch({ executablePath: B });
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errs=[];
  page.on('pageerror', e=>errs.push('pageerror: '+e.message));
  page.on('console', m=>{ if(m.type()==='error' && !/favicon/.test(m.text())) errs.push('console: '+m.text()); });
  await page.goto(URL,{waitUntil:'networkidle'});

  // orizzontale? nessun overflow
  async function noHScroll(where){
    const o = await page.evaluate(()=>({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth}));
    if (o.sw > o.cw + 2) P(`${label}: scorrimento orizzontale su ${where} (${o.sw} > ${o.cw})`);
  }
  await noHScroll('dashboard');

  // fase 2 e 3 devono essere bloccate all'inizio
  const locked = await page.evaluate(()=>[PREP.catalog.phaseUnlocked(1),PREP.catalog.phaseUnlocked(2),PREP.catalog.phaseUnlocked(3)]);
  console.log('  sblocco iniziale fasi [1,2,3]:', JSON.stringify(locked));
  if (locked[1] || locked[2]) P('le fasi successive non risultano bloccate all\'avvio');

  await page.goto(URL+'#/fase/2',{waitUntil:'networkidle'});
  const lockTxt = await page.textContent('#view');
  if(!/bloccata/i.test(lockTxt)) P('la pagina della fase 2 non segnala il blocco');
  console.log('  fase 2 bloccata: ok');

  // --- QUIZ ---
  await page.goto(URL+'#/att/q-html',{waitUntil:'networkidle'});
  await page.waitForSelector('.opt');
  await noHScroll('quiz');
  await page.click('.opts li:nth-child(1) .opt');
  const fbq = await page.$('.fb');
  console.log('  quiz: feedback mostrato ->', !!fbq);
  if(!fbq) P('il quiz non mostra feedback');
  const good = await page.$('.opt.good');
  if(!good) P('il quiz non evidenzia la risposta corretta');

  // --- FLASHCARD (requeue degli sbagliati) ---
  await page.goto(URL+'#/att/fl-html',{waitUntil:'networkidle'});
  const n0 = await page.textContent('.counter');
  await page.click('button:has-text("Gira la carta")');
  await page.click('button:has-text("No, ripropinimela")');
  const n1 = await page.textContent('.counter');
  console.log('  flashcard: contatore', n0.trim(), '->', n1.trim());
  if(parseInt(n1.split('/')[1]) <= parseInt(n0.split('/')[1])) P('la flashcard sbagliata non e\' stata rimessa in pila');

  // --- COMPLETAMENTO ---
  await page.goto(URL+'#/att/fi-html',{waitUntil:'networkidle'});
  await page.waitForSelector('.blank');
  const nb = await page.$$eval('.blank', e=>e.length);
  const sol = await page.evaluate(()=>PREP.data.fill.find(x=>x.lang==='html').sol);
  for (const s of sol){ await page.click(`.chip:text-is("${s===''?'(stringa vuota)':s}")`); }
  await page.click('.btnrow .btn:not([disabled])');
  const fillOk = await page.$('.fb.ok');
  console.log('  completamento:', nb, 'spazi, esito corretto ->', !!fillOk);
  if(!fillOk) P('il completamento con le tessere giuste non risulta corretto');

  // --- TROVA L'ERRORE ---
  await page.goto(URL+'#/att/bu-html',{waitUntil:'networkidle'});
  const bugLine = await page.evaluate(()=>PREP.data.bugs.find(x=>x.lang==='html').line);
  await page.click(`button.ln:nth-of-type(${bugLine})`);
  await page.waitForSelector('.opt');
  console.log('  trova l\'errore: seconda fase mostrata ->', !!(await page.$('.opt')));

  // sblocco fasi 1 e 2 segnando i loro esercizi come risolti, per poter provare la fase 3
  await page.evaluate(()=>{
    PREP.catalog.phases.slice(0,2).forEach(ph=>ph.itemIds.forEach(id=>PREP.store.record(id,true,'test')));
    PREP.store.saveNow();
  });
  await page.goto(URL+'#/',{waitUntil:'networkidle'});
  const unlocked = await page.evaluate(()=>[PREP.catalog.phaseUnlocked(2),PREP.catalog.phaseUnlocked(3)]);
  console.log('  sblocco dopo completamento fasi 1 e 2 [2,3]:', JSON.stringify(unlocked));
  if(!unlocked[0]||!unlocked[1]) P('le fasi non si sbloccano al completamento della precedente');

  // --- PRODUZIONE DI CODICE: incollo la soluzione e verifico ---
  await page.goto(URL+'#/att/mi-html',{waitUntil:'networkidle'});
  await page.waitForSelector('.ed-ta');
  await noHScroll('editor');
  const solHtml = await page.evaluate(()=>PREP.data.micro.find(x=>x.lang==='html').solution);
  await page.evaluate((v)=>{const t=document.querySelector('.ed-ta');t.value=v;t.dispatchEvent(new Event('input',{bubbles:true}));}, solHtml);
  // l'evidenziazione deve conservare il testo esatto
  const same = await page.evaluate(()=>{
    const ta=document.querySelector('.ed-ta'), code=document.querySelector('.ed-hl code');
    return ta.value === code.textContent.replace(/\n$/,'');
  });
  console.log('  editor: testo evidenziato identico al sorgente ->', same);
  if(!same) P('l\'evidenziazione altera il testo (la sovrapposizione si disallineerebbe)');

  await page.click('button:has-text("Verifica i requisiti")');
  await page.waitForSelector('.checks', {timeout:10000});
  const score = await page.textContent('.score');
  console.log('  verifica HTML:', score.trim());
  if(!/^(\d+) requisiti soddisfatti su \1$/.test(score.trim())) P('la soluzione HTML non supera tutti i requisiti nella UI');
  const solShown = await page.$('details:has-text("Soluzione di riferimento")');
  if(!solShown) P('la soluzione non compare dopo il tentativo');

  // anteprima
  await page.click('button:has-text("Anteprima")');
  await page.waitForSelector('iframe.frame',{timeout:8000});
  console.log('  anteprima HTML resa ->', !!(await page.$('iframe.frame')));

  // --- CSS con anteprima ---
  await page.goto(URL+'#/att/mi-css',{waitUntil:'networkidle'});
  await page.waitForSelector('.ed-ta');
  const solCss = await page.evaluate(()=>PREP.data.micro.find(x=>x.lang==='css').solution);
  await page.evaluate((v)=>{const t=document.querySelector('.ed-ta');t.value=v;t.dispatchEvent(new Event('input',{bubbles:true}));}, solCss);
  await page.click('button:has-text("Verifica i requisiti")');
  await page.waitForSelector('.checks',{timeout:10000});
  console.log('  verifica CSS:', (await page.textContent('.score')).trim());

  // --- JS con console ---
  await page.goto(URL+'#/att/mi-js',{waitUntil:'networkidle'});
  await page.waitForSelector('.ed-ta');
  const solJs = await page.evaluate(()=>PREP.data.micro.find(x=>x.lang==='js').solution);
  await page.evaluate((v)=>{const t=document.querySelector('.ed-ta');t.value=v;t.dispatchEvent(new Event('input',{bubbles:true}));}, solJs);
  await page.click('button:has-text("Verifica i requisiti")');
  await page.waitForSelector('.checks',{timeout:12000});
  console.log('  verifica JS:', (await page.textContent('.score')).trim());

  // --- TEORIA ---
  await page.goto(URL+'#/att/th-css',{waitUntil:'networkidle'});
  await page.waitForSelector('.ta');
  await page.fill('.ta','La cascata risolve i conflitti fra piu dichiarazioni sullo stesso elemento usando origine e importanza, poi la specificita del selettore, infine l ordine di dichiarazione: vince un solo valore.');
  await page.click('button:has-text("Ho finito")');
  await page.waitForSelector('.checks');
  const kp = await page.textContent('.score');
  console.log('  teoria aperta:', kp.trim());
  if(!(await page.$('details:has-text("Risposta di riferimento")'))) P('la teoria non mostra la risposta di riferimento');

  // --- ESAME: cronometro ---
  await page.goto(URL+'#/att/fn-html',{waitUntil:'networkidle'});
  await page.waitForSelector('.timer');
  const t1 = await page.textContent('.timer');
  await page.waitForTimeout(1300);
  const t2 = await page.textContent('.timer');
  console.log('  cronometro esame:', t1.trim(), '->', t2.trim());
  if(t1.trim()===t2.trim()) P('il cronometro non avanza');
  await noHScroll('esame');

  // --- persistenza ---
  const before = await page.evaluate(()=>Object.keys(PREP.store.raw.items).length);
  await page.reload({waitUntil:'networkidle'});
  const after = await page.evaluate(()=>Object.keys(PREP.store.raw.items).length);
  console.log('  persistenza: esercizi registrati', before, '-> dopo ricarica', after);
  if(after < before) P('i progressi non sopravvivono alla ricarica');

  // --- ripasso mirato ---
  await page.goto(URL+'#/ripasso',{waitUntil:'networkidle'});
  const rip = await page.textContent('#view');
  console.log('  ripasso mirato reso ->', /Ripasso mirato/.test(rip));

  if(errs.length){ P('errori JavaScript: '+errs.slice(0,4).join(' ; ')); }
  else console.log('  nessun errore JavaScript in console');

  await browser.close();
}

(async()=>{
  await run('DESKTOP 1280x900', {width:1280,height:900});
  await run('TELEFONO 390x780', {width:390,height:780});
  console.log('\n'+(problems.length? problems.length+' PROBLEMI:\n - '+problems.join('\n - ') : 'Tutti i controlli della UI superati'));
  process.exit(problems.length?1:0);
})();
