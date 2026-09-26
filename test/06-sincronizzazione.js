const { chromium } = require('playwright-core');
const B = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const U = 'http://127.0.0.1:8099/index.html';
let bad = 0; const P = m => { bad++; console.log('  ** ' + m); };

(async () => {
  const browser = await chromium.launch({ executablePath: B });
  const page = await (await browser.newContext({ viewport: { width: 1100, height: 900 } })).newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(U, { waitUntil: 'networkidle' });

  console.log('=== 1. merge non distruttivo: due dispositivi con progressi diversi ===');
  const r1 = await page.evaluate(() => {
    // dispositivo A: risolve i primi 5 esercizi di fase 1, poi esporta
    const ph1 = PREP.catalog.phase(1);
    const idsA = ph1.itemIds.slice(0, 5);
    idsA.forEach(id => PREP.store.record(id, true, 'test'));
    const fileA = PREP.store.exportJson();

    // simulo che il dispositivo riparta da zero (nuova installazione = dispositivo B)
    PREP.store.wipe();

    // dispositivo B: risolve altri 5 esercizi (diversi)
    const idsB = ph1.itemIds.slice(5, 10);
    idsB.forEach(id => PREP.store.record(id, true, 'test'));

    // ora importa il file di A: B deve avere ENTRAMBI i gruppi risolti
    const report = PREP.store.mergeJson(fileA);
    const doneAfter = ph1.itemIds.filter(id => PREP.store.isDone(id));
    return { idsA, idsB, doneAfter, report };
  });
  const gotAll = r1.idsA.concat(r1.idsB).every(id => r1.doneAfter.includes(id));
  console.log('  esercizi A:', r1.idsA.length, ' esercizi B:', r1.idsB.length, ' risolti dopo il merge:', r1.doneAfter.length);
  console.log('  report:', JSON.stringify(r1.report));
  if (!gotAll) P('il merge ha perso esercizi risolti su uno dei due lati');
  else console.log('  tutti gli esercizi di entrambi i lati risultano risolti: corretto');

  console.log('\n=== 2. il merge non retrocede un esercizio già risolto ===');
  const r2 = await page.evaluate(() => {
    PREP.store.wipe();
    const id = PREP.catalog.phase(1).itemIds[0];
    PREP.store.record(id, true, 'test');       // risolto qui
    const fileHere = PREP.store.exportJson();
    // un file "vecchio" dove quell'esercizio risultava ancora sbagliato
    const old = JSON.parse(fileHere);
    old.items[id] = { s: 'wrong', a: 1, w: 1, t: Date.now() - 100000 };
    PREP.store.mergeJson(JSON.stringify(old));
    return PREP.store.isDone(id);
  });
  console.log('  esercizio risolto, poi importato un file dove risultava sbagliato -> resta risolto:', r2);
  if (!r2) P('un file più vecchio ha retrocesso un esercizio già risolto');

  console.log('\n=== 3. il tempo di studio non si gonfia con import ripetuti ===');
  const r3 = await page.evaluate(() => {
    PREP.store.wipe();
    PREP.store.raw.timeMs = 3600000; // 1 ora
    PREP.store.saveNow();
    const file = PREP.store.exportJson();
    PREP.store.mergeJson(file);
    PREP.store.mergeJson(file);
    PREP.store.mergeJson(file);
    return PREP.store.raw.timeMs;
  });
  console.log('  tempo dopo 3 import dello stesso file (atteso 3600000):', r3);
  if (r3 !== 3600000) P('il tempo totale si gonfia reimportando lo stesso file (' + r3 + ' invece di 3600000)');

  console.log('\n=== 4. gli argomenti da rivedere non raddoppiano gli errori ===');
  const r4 = await page.evaluate(() => {
    PREP.store.wipe();
    const it = PREP.data.quiz[0];
    PREP.store.record(it.id, false, it.topic);   // 1 errore
    const file = PREP.store.exportJson();
    PREP.store.mergeJson(file);
    PREP.store.mergeJson(file);
    const t = PREP.store.topicStats().find(x => x.topic === it.topic);
    return t;
  });
  console.log('  statistiche argomento dopo 2 import dello stesso file:', JSON.stringify(r4));
  if (!r4 || r4.wrong !== 1 || r4.total !== 1) P('gli errori per argomento si accumulano reimportando lo stesso file');

  console.log('\n=== 5. file non valido: errore chiaro, nessun crash ===');
  const r5 = await page.evaluate(() => {
    try { PREP.store.mergeJson('{"non":"un file di progressi"}'); return 'NESSUN ERRORE SOLLEVATO'; }
    catch (e) { return e.message; }
  });
  console.log('  ', r5);
  if (r5 === 'NESSUN ERRORE SOLLEVATO') P('un file non valido non solleva errore');

  console.log('\n=== 6. UI: pulsante "Salva su file" scarica davvero un file ===');
  await page.evaluate(() => { PREP.store.wipe(); PREP.catalog.phase(1).activities[0].items.slice(0,3).forEach(it=>PREP.store.record(it.id,true,it.topic)); });
  await page.goto(U + '#/impostazioni', { waitUntil: 'networkidle' });
  const dl = page.waitForEvent('download');
  await page.click('button:has-text("Salva su file")');
  const download = await dl;
  const fname = download.suggestedFilename();
  console.log('  nome del file scaricato:', fname);
  if (!/^prepweb-progressi-.*\.json$/.test(fname)) P('il nome del file scaricato non è quello atteso');
  const path = await download.path();
  const content = require('fs').readFileSync(path, 'utf8');
  const parsed = JSON.parse(content);
  console.log('  file valido, v=' + parsed.v + ', esercizi registrati:', Object.keys(parsed.items).length);
  if (parsed.v !== 1) P('il contenuto del file scaricato non è un progresso valido');

  console.log('\n=== 7. UI: promemoria sulla dashboard dopo molte modifiche ===');
  const r7 = await page.evaluate(() => {
    PREP.store.wipe();
    const ids = PREP.catalog.phase(1).itemIds.slice(0, 12);
    ids.forEach(id => PREP.store.record(id, true, 'test'));
    return PREP.store.raw.changesSinceExport;
  });
  await page.goto(U + '#/', { waitUntil: 'networkidle' });
  const reminder = await page.$("text=dall'ultimo salvataggio su file");
  console.log('  modifiche non salvate:', r7, ' promemoria visibile:', !!reminder);
  if (r7 >= 10 && !reminder) P('il promemoria di sincronizzazione non compare con 12 modifiche in sospeso');

  console.log('\n=== 8. UI: caricamento file dalla pagina Impostazioni ===');
  // ricreo un file "esterno" con un esercizio diverso, e lo carico tramite l'input file reale
  const otherId = await page.evaluate(() => PREP.catalog.phase(1).itemIds[20]);
  const fs = require('fs');
  const tmpFile = '/tmp/claude-0/-home-user-prepWeb/c1682e7d-51ff-5d17-94c0-d0c771530a6c/scratchpad/prepweb-esterno.json';
  const externalJson = await page.evaluate((id) => {
    const blank = { v: 1, items: {}, topics: {}, timeMs: 0, phaseTime: {1:0,2:0,3:0}, last: null,
      drafts: {}, settings: {timer:false,phone:null}, startedAt: Date.now(), lastExportAt: 0, changesSinceExport: 0 };
    blank.items[id] = { s: 'done', a: 1, w: 0, t: Date.now() };
    return JSON.stringify(blank);
  }, otherId);
  fs.writeFileSync(tmpFile, externalJson);

  await page.goto(U + '#/impostazioni', { waitUntil: 'networkidle' });
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('button:has-text("Carica da file")')
  ]);
  await fileChooser.setFiles(tmpFile);
  await page.waitForTimeout(1200);
  const afterLoad = await page.evaluate((id) => PREP.store.isDone(id), otherId);
  console.log('  esercizio esterno caricato tramite input file reale -> risolto:', afterLoad);
  if (!afterLoad) P('il caricamento da file reale (input) non ha unito i progressi');

  if (errs.length) P('errori JavaScript: ' + errs.slice(0, 4).join(' ; '));
  else console.log('\n  nessun errore JavaScript in console');

  await browser.close();
  console.log('\n' + (bad ? bad + ' PROBLEMI' : 'Tutti i controlli sulla sincronizzazione superati'));
  process.exit(bad ? 1 : 0);
})();
