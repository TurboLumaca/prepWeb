/* PrepWeb - persistenza dei progressi (localStorage) e contabilità del tempo. */
(function (P) {
  'use strict';

  var KEY = 'prepweb.v1';
  var TARGET_MS = 6 * 3600 * 1000;      // monte ore complessivo
  var PHASE_TARGET_MS = 2 * 3600 * 1000; // obiettivo per fase

  function blank() {
    return {
      v: 1,
      items: {},        // id -> {s:'new|wrong|done', a:attempts, w:wrong, t:lastTs}
      topics: {},       // topic -> {w:wrong, n:total}
      timeMs: 0,
      phaseTime: { 1: 0, 2: 0, 3: 0 },
      last: null,       // {hash, label}
      drafts: {},       // id -> ultimo codice scritto dallo studente
      settings: { timer: false, phone: null },
      startedAt: Date.now(),
      lastExportAt: 0,      // ultima volta che i progressi sono stati salvati su file
      changesSinceExport: 0 // esercizi/bozze registrati dall'ultimo salvataggio su file
    };
  }

  var mem = blank();
  var available = true;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && d.v === 1) {
          mem = Object.assign(blank(), d);
          mem.items = d.items || {};
          mem.topics = d.topics || {};
          mem.phaseTime = Object.assign({ 1: 0, 2: 0, 3: 0 }, d.phaseTime || {});
          mem.settings = Object.assign({ timer: false, phone: null }, d.settings || {});
          mem.drafts = d.drafts || {};
          mem.lastExportAt = d.lastExportAt || 0;
          mem.changesSinceExport = d.changesSinceExport || 0;
        }
      }
    } catch (e) { available = false; }
  }

  var saveTimer = null;
  function save() {
    if (!available) return;
    if (saveTimer) return;
    saveTimer = setTimeout(function () {
      saveTimer = null;
      try { localStorage.setItem(KEY, JSON.stringify(mem)); }
      catch (e) { available = false; }
    }, 250);
  }
  function saveNow() {
    if (!available) return;
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { available = false; }
  }

  /* ---- stato dei singoli esercizi ---- */

  function get(id) { return mem.items[id] || null; }
  function status(id) { var r = mem.items[id]; return r ? r.s : 'new'; }
  function isDone(id) { return status(id) === 'done'; }

  /* Registra un tentativo. ok=true -> l'item è risolto (resta risolto per sempre,
     ma i conteggi di errore restano per il ripasso mirato). */
  function record(id, ok, topic) {
    var r = mem.items[id] || { s: 'new', a: 0, w: 0, t: 0 };
    r.a++;
    r.t = Date.now();
    if (ok) { r.s = 'done'; }
    else { r.w++; if (r.s !== 'done') r.s = 'wrong'; }
    mem.items[id] = r;
    mem.changesSinceExport++;

    if (topic) {
      var t = mem.topics[topic] || { w: 0, n: 0 };
      t.n++;
      if (!ok) t.w++;
      mem.topics[topic] = t;
    }
    save();
    return r;
  }

  function resetItem(id) { delete mem.items[id]; save(); }

  /* Bozze di codice: ciò che lo studente ha scritto viene conservato fra le sessioni. */
  function draft(id) { return Object.prototype.hasOwnProperty.call(mem.drafts, id) ? mem.drafts[id] : null; }
  function setDraft(id, txt) {
    if (txt === null || txt === undefined) delete mem.drafts[id];
    else mem.drafts[id] = String(txt);
    mem.changesSinceExport++;
    save();
  }

  /* ---- statistiche ---- */

  function statsFor(ids) {
    var done = 0, wrong = 0, seen = 0, attempts = 0, errs = 0;
    ids.forEach(function (id) {
      var r = mem.items[id];
      if (!r) return;
      seen++;
      attempts += r.a;
      errs += r.w;
      if (r.s === 'done') done++; else wrong++;
    });
    return { total: ids.length, done: done, wrong: wrong, seen: seen,
      attempts: attempts, errors: errs,
      pct: ids.length ? Math.round(done / ids.length * 100) : 0 };
  }

  /* Elenco degli id sbagliati almeno una volta, dal più sbagliato al meno. */
  function weakItems(ids) {
    return ids.filter(function (id) { var r = mem.items[id]; return r && r.w > 0; })
      .sort(function (a, b) { return mem.items[b].w - mem.items[a].w; });
  }

  function topicStats() {
    var out = [];
    for (var k in mem.topics) {
      if (!Object.prototype.hasOwnProperty.call(mem.topics, k)) continue;
      var t = mem.topics[k];
      out.push({ topic: k, wrong: t.w, total: t.n,
        rate: t.n ? Math.round(t.w / t.n * 100) : 0 });
    }
    return out.sort(function (a, b) { return b.wrong - a.wrong || b.rate - a.rate; });
  }

  /* ---- tempo attivo ---- */

  var tickTimer = null, lastTick = Date.now(), curPhase = 0, idleSince = Date.now();

  function markActivity() { idleSince = Date.now(); }

  function startClock() {
    if (tickTimer) return;
    lastTick = Date.now();
    tickTimer = setInterval(function () {
      var now = Date.now();
      var dt = now - lastTick;
      lastTick = now;
      // conta solo se la scheda è visibile e c'e' stata interazione negli ultimi 3 minuti
      if (document.hidden) return;
      if (now - idleSince > 3 * 60 * 1000) return;
      if (dt > 20000) dt = 20000;
      mem.timeMs += dt;
      if (curPhase >= 1 && curPhase <= 3) mem.phaseTime[curPhase] = (mem.phaseTime[curPhase] || 0) + dt;
      save();
      if (P.onTick) P.onTick();
    }, 5000);
  }

  function setPhase(p) { curPhase = p || 0; }

  ['click', 'keydown', 'pointerdown', 'input', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, markActivity, { passive: true, capture: true });
  });
  document.addEventListener('visibilitychange', function () {
    lastTick = Date.now();
    if (!document.hidden) markActivity();
    else saveNow();
  });
  window.addEventListener('pagehide', saveNow);
  window.addEventListener('beforeunload', saveNow);

  /* ---- ripresa ---- */
  function setLast(hash, label) {
    if (!hash || hash === '#/' ) return;
    mem.last = { hash: hash, label: label || '', t: Date.now() };
    save();
  }

  function wipe() {
    mem = blank();
    try { localStorage.removeItem(KEY); } catch (e) {}
    saveNow();
  }

  function exportJson() { return JSON.stringify(mem, null, 2); }

  /* Da chiamare subito dopo aver offerto il file in scaricamento: azzera il
     contatore delle modifiche non salvate e registra il momento. */
  function markExported() {
    mem.lastExportAt = Date.now();
    mem.changesSinceExport = 0;
    saveNow();
  }

  /* Sostituzione integrale (usata solo per ripristinare un file esportato da
     QUESTO stesso dispositivo, o quando lo studente sceglie esplicitamente
     di sovrascrivere). Per portare i progressi da un dispositivo all'altro
     si usa invece mergeJson, che non perde ciò che è gia' presente. */
  function importJson(txt) {
    var d = JSON.parse(txt);
    if (!d || d.v !== 1) throw new Error('Formato non riconosciuto');
    mem = Object.assign(blank(), d);
    saveNow();
  }

  /* Unisce un file esportato da un altro dispositivo con lo stato presente,
     senza cancellare nulla. Per ogni esercizio vince il lato con il
     progresso maggiore (prima "risolto", poi piu' tentativi, poi il piu'
     recente); i tempi totali si prendono come massimo, cosi' importazioni
     ripetute non li gonfiano; gli argomenti da rivedere vengono ricalcolati
     dagli esercizi uniti, cosi' non si contano due volte gli stessi errori. */
  function mergeJson(txt) {
    var inc = JSON.parse(txt);
    if (!inc || inc.v !== 1) throw new Error('Formato non riconosciuto: questo non e\' un file di progressi di PrepWeb.');

    var incItems = inc.items || {}, incDrafts = inc.drafts || {};
    var ids = {};
    Object.keys(mem.items).forEach(function (id) { ids[id] = true; });
    Object.keys(incItems).forEach(function (id) { ids[id] = true; });

    var mergedItems = {}, incomingWins = {};
    var aggiornati = 0, invariati = 0, nuovi = 0;

    Object.keys(ids).forEach(function (id) {
      var a = mem.items[id], b = incItems[id];
      if (!a && !b) return;
      if (!a) { mergedItems[id] = b; incomingWins[id] = true; nuovi++; return; }
      if (!b) { mergedItems[id] = a; incomingWins[id] = false; invariati++; return; }

      var aDone = a.s === 'done', bDone = b.s === 'done';
      var bWins;
      if (aDone !== bDone) bWins = bDone;
      else if ((a.a || 0) !== (b.a || 0)) bWins = (b.a || 0) > (a.a || 0);
      else bWins = (b.t || 0) > (a.t || 0);

      var merged = {
        s: (aDone || bDone) ? 'done' : (bWins ? b.s : a.s),
        a: Math.max(a.a || 0, b.a || 0),
        w: Math.max(a.w || 0, b.w || 0),
        t: Math.max(a.t || 0, b.t || 0)
      };
      mergedItems[id] = merged;
      incomingWins[id] = bWins;
      if (merged.s !== a.s || merged.a !== a.a || merged.w !== a.w) aggiornati++;
      else invariati++;
    });

    /* le bozze seguono lo stesso lato che ha "vinto" il merge dell'esercizio */
    var mergedDrafts = {};
    var draftIds = {};
    Object.keys(mem.drafts).forEach(function (id) { draftIds[id] = true; });
    Object.keys(incDrafts).forEach(function (id) { draftIds[id] = true; });
    Object.keys(draftIds).forEach(function (id) {
      var cur = mem.drafts[id], inn = incDrafts[id];
      var pick;
      if (Object.prototype.hasOwnProperty.call(incomingWins, id)) {
        pick = incomingWins[id] ? (inn !== undefined ? inn : cur) : (cur !== undefined ? cur : inn);
      } else {
        pick = inn !== undefined ? inn : cur;
      }
      if (pick !== undefined) mergedDrafts[id] = pick;
    });

    /* argomenti da rivedere: ricalcolati dagli esercizi uniti (attempts/errori
       per esercizio), non sommati dai due file, per evitare di contare due
       volte lo stesso tentativo a ogni sincronizzazione successiva. */
    var mergedTopics = {};
    Object.keys(mergedItems).forEach(function (id) {
      var it = P.catalog && P.catalog.item ? P.catalog.item(id) : null;
      var topic = it && it.topic;
      if (!topic) return;
      var rec = mergedItems[id];
      var t = mergedTopics[topic] || { w: 0, n: 0 };
      t.n += rec.a || 0;
      t.w += rec.w || 0;
      mergedTopics[topic] = t;
    });

    mem.items = mergedItems;
    mem.drafts = mergedDrafts;
    mem.topics = mergedTopics;
    mem.timeMs = Math.max(mem.timeMs || 0, inc.timeMs || 0);
    mem.phaseTime = mem.phaseTime || { 1: 0, 2: 0, 3: 0 };
    [1, 2, 3].forEach(function (n) {
      mem.phaseTime[n] = Math.max(mem.phaseTime[n] || 0, (inc.phaseTime || {})[n] || 0);
    });
    mem.startedAt = Math.min(mem.startedAt || Date.now(), inc.startedAt || Date.now());
    var incLast = inc.last, curLast = mem.last;
    if (incLast && (!curLast || (incLast.t || 0) > (curLast.t || 0))) mem.last = incLast;

    mem.changesSinceExport = 0;
    mem.lastExportAt = Date.now();
    saveNow();

    return { aggiornati: aggiornati, invariati: invariati, nuovi: nuovi,
      totale: Object.keys(mergedItems).length };
  }

  load();

  P.store = {
    TARGET_MS: TARGET_MS, PHASE_TARGET_MS: PHASE_TARGET_MS,
    get: get, status: status, isDone: isDone, record: record, resetItem: resetItem,
    draft: draft, setDraft: setDraft,
    statsFor: statsFor, weakItems: weakItems, topicStats: topicStats,
    startClock: startClock, setPhase: setPhase, setLast: setLast,
    wipe: wipe, exportJson: exportJson, importJson: importJson, mergeJson: mergeJson, markExported: markExported,
    saveNow: saveNow,
    get available() { return available; },
    get raw() { return mem; },
    settings: function () { return mem.settings; },
    setSetting: function (k, v) { mem.settings[k] = v; save(); }
  };
})(window.PREP);
