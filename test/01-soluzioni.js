const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e)));
  page.on('console', m => { if (m.type()==='error') pageErrors.push('console: '+m.text()); });

  await page.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'networkidle' });

  const boot = await page.evaluate(() => ({
    ok: !!(window.PREP && PREP.catalog && PREP.grader),
    counts: Object.fromEntries(Object.entries(PREP.data).map(([k,v]) => [k, Array.isArray(v)?v.length:0])),
    acts: PREP.catalog.phases.reduce((n,p)=>n+p.activities.length,0)
  }));
  console.log('boot:', JSON.stringify(boot));
  if (pageErrors.length) console.log('ERRORI DI PAGINA:', pageErrors.slice(0,5));

  // Verifica: ogni soluzione di riferimento supera la propria checklist
  const results = await page.evaluate(async () => {
    const pools = ['debug','micro','blocks','final'];
    const out = [];
    for (const pool of pools) {
      for (const it of (PREP.data[pool]||[])) {
        if (!it.checks || !it.solution) continue;
        let r;
        try { r = await PREP.grader.grade(it, it.solution); }
        catch (e) { out.push({pool, id: it.id, lang: it.lang, fatal: String(e)}); continue; }
        out.push({ pool, id: it.id, lang: it.lang, passed: r.passed, total: r.total,
          failed: r.results.filter(x=>!x.ok).map(x=>x.id + ': ' + x.label + (x.why?(' ['+x.why+']'):'')) });
      }
    }
    return out;
  });

  let bad = 0;
  for (const r of results) {
    if (r.fatal) { console.log('FATAL', r.pool, r.id, r.fatal); bad++; continue; }
    if (r.passed !== r.total) {
      bad++;
      console.log(`FAIL ${r.pool}/${r.id} (${r.lang}) ${r.passed}/${r.total}`);
      r.failed.forEach(f => console.log('       - ' + f));
    }
  }
  console.log(`\n${results.length} soluzioni verificate, ${bad} non superano la propria checklist`);
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
