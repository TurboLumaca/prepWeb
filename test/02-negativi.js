const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'networkidle' });

  // 1. Gli starter degli esercizi di debug devono FALLIRE la propria checklist
  const deb = await page.evaluate(async () => {
    const out = [];
    for (const it of PREP.data.debug) {
      const r = await PREP.grader.grade(it, it.starter);
      out.push({ id: it.id, lang: it.lang, passed: r.passed, total: r.total, ok: r.ok });
    }
    return out;
  });
  let bad = 0;
  console.log('--- starter difettosi (devono NON superare la checklist) ---');
  for (const r of deb) {
    if (r.ok) { console.log(`  PROBLEMA ${r.id}: lo starter passa gia' tutti i ${r.total} requisiti`); bad++; }
  }
  console.log(`  ${deb.length} starter controllati, ${bad} problematici`);
  console.log('  requisiti gia' + "'" + ' soddisfatti dallo starter: ' +
    deb.map(r=>r.id+' '+r.passed+'/'+r.total).join(', '));

  // 2. Codice vuoto o insensato non deve superare nulla
  const empty = await page.evaluate(async () => {
    const out = [];
    const pools = ['micro','blocks','final'];
    for (const pool of pools) for (const it of PREP.data[pool]) {
      const r = await PREP.grader.grade(it, it.lang==='html' ? '<p>niente</p>' : '/* niente */');
      if (r.ok) out.push(pool+'/'+it.id);
    }
    return out;
  });
  console.log('--- codice fittizio ---');
  console.log(empty.length ? ('  PROBLEMA: superano la checklist ' + empty.join(', ')) : '  nessun esercizio superato con codice fittizio: corretto');
  bad += empty.length;

  // 3. Il guard sui cicli infiniti interrompe davvero l'esecuzione
  const t0 = Date.now();
  const loop = await page.evaluate(async () => {
    const it = { lang:'js', html:'<p id="o"></p>', checks:[], files:{} };
    const host = document.createElement('div'); document.body.appendChild(host);
    const f = await PREP.sandbox.mount(host, { hidden:true, html:'<p id="o"></p>', js:'while(true){}\ndocument.getElementById("o").textContent="fine";', timeout: 12000 });
    const txt = f.logs.map(l=>l.type+': '+l.text).join(' | ');
    f.destroy();
    return txt;
  });
  console.log('--- protezione dai cicli infiniti ---');
  console.log('  ' + (loop || '(nessun messaggio)') + '   [' + (Date.now()-t0) + 'ms]');
  if (!/ciclo infinito/i.test(loop)) { console.log('  PROBLEMA: il ciclo infinito non e\' stato interrotto'); bad++; }

  await browser.close();
  console.log(bad ? `\n${bad} PROBLEMI` : '\nTutti i controlli negativi superati');
  process.exit(bad?1:0);
})();
