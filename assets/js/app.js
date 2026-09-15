/* PrepWeb - avvio, navigazione e viste. */
(function (P) {
  'use strict';
  var u = P.u, el = u.el, rich = u.rich;
  var store = P.store, cat = P.catalog;

  var view = document.getElementById('view');
  var LANG_LABEL = { html: 'HTML', css: 'CSS', js: 'JavaScript', teoria: 'Teoria' };
  var TOPIC_LABEL = {
    'html-struttura': 'HTML / struttura del documento',
    'html-form': 'HTML / form e controlli',
    'html-tabelle': 'HTML / tabelle',
    'html-semantica': 'HTML / semantica',
    'html-media': 'HTML / collegamenti e media',
    'a11y': 'Accessibilità (WCAG 2.0 A)',
    'css-selettori': 'CSS / selettori',
    'css-box': 'CSS / box model e bordi',
    'css-testo': 'CSS / tipografia',
    'css-colori': 'CSS / colori',
    'css-layout': 'CSS / dimensioni e impaginazione',
    'css-cascata': 'CSS / cascata ed ereditarietà',
    'js-dom': 'JavaScript / DOM',
    'js-eventi': 'JavaScript / eventi',
    'js-ajax': 'JavaScript / richieste asincrone',
    'js-linguaggio': 'JavaScript / linguaggio'
  };

  function isPhone() { return window.matchMedia('(max-width: 620px)').matches; }

  /* ======================= intestazione ======================= */
  function paintHeader() {
    var hv = document.getElementById('hoursVal');
    if (hv) hv.textContent = u.fmtDur(store.raw.timeMs);
    var box = document.getElementById('hoursBox');
    if (box) box.title = 'Tempo di studio effettivo: ' + u.fmtDur(store.raw.timeMs) + ' su 6 ore';

    var bar = document.getElementById('phasebar');
    if (!bar) return;
    bar.textContent = '';
    cat.phases.forEach(function (ph) {
      var st = store.statsFor(ph.itemIds);
      var unlocked = cat.phaseUnlocked(ph.n);
      var done = cat.phaseDone(ph.n);
      var d = el('div', { class: 'pb' + (done ? ' done' : '') + (unlocked ? '' : ' locked') });
      d.appendChild(el('div', { class: 'pb-l' }, [
        el('b', { text: 'Fase ' + ph.n }),
        el('span', { text: unlocked ? (st.done + '/' + st.total) : 'bloccata' })
      ]));
      var t = el('div', { class: 'pb-t' });
      t.appendChild(el('i', { style: 'width:' + (unlocked ? st.pct : 0) + '%' }));
      d.appendChild(t);
      bar.appendChild(d);
    });
  }
  P.onTick = paintHeader;

  function setNav(hash) {
    document.querySelectorAll('.mainnav a').forEach(function (a) {
      var h = '#' + a.dataset.nav;
      if (hash === h || (a.dataset.nav !== '/' && hash.indexOf(h) === 0)) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  /* ======================= dashboard ======================= */
  function viewHome() {
    var f = document.createDocumentFragment();
    f.appendChild(el('h1', { text: 'Preparazione all\'esame di Tecnologie Web' }));
    f.appendChild(el('p', { class: 'lead',
      text: 'Sei ore di lavoro effettivo su HTML, CSS e JavaScript, con l\'accessibilità integrata negli esercizi. '
        + 'L\'obiettivo non è capire: è saper produrre in fretta e a memoria ciò che il compito richiede.' }));

    if (!store.available) {
      f.appendChild(el('div', { class: 'card cd-warn' }, [
        el('p', { class: 'mb0', text: 'Il browser non consente di salvare i progressi (memoria locale non disponibile). '
          + 'Puoi comunque usare la piattaforma, ma l\'avanzamento andrà perso chiudendo la scheda.' })
      ]));
    }

    var last = store.raw.last;
    if (last && last.hash) {
      f.appendChild(el('div', { class: 'card cd-info' }, [
        el('p', { style: 'margin:0 0 .6rem', html: 'Riprendi da dove avevi interrotto: <strong>' + u.esc(last.label) + '</strong>' }),
        el('a', { class: 'btn', href: last.hash, text: 'Riprendi' })
      ]));
    }

    /* monte ore */
    var tot = store.raw.timeMs;
    var hours = el('div', { class: 'card' });
    hours.appendChild(el('h2', { class: 'mt0', style: 'margin-bottom:.5rem', text: 'Monte ore' }));
    var hb = el('div', { class: 'pb-t', style: 'height:10px' });
    hb.appendChild(el('i', { style: 'width:' + u.clamp(tot / store.TARGET_MS * 100, 0, 100) + '%' }));
    hours.appendChild(hb);
    hours.appendChild(el('p', { class: 'small', style: 'margin:.4rem 0 0',
      text: u.fmtDur(tot) + ' di studio effettivo su un obiettivo di 6 ore (circa 2 ore per fase). '
        + 'Il conteggio avanza solo mentre la scheda è attiva e stai lavorando.' }));
    var st = el('div', { class: 'stat' });
    cat.phases.forEach(function (ph) {
      st.appendChild(el('div', null, [
        el('b', { text: u.fmtDur(store.raw.phaseTime[ph.n] || 0) }),
        el('span', { text: 'Fase ' + ph.n })
      ]));
    });
    hours.appendChild(st);
    f.appendChild(hours);

    /* fasi */
    f.appendChild(el('h2', { text: 'Le tre fasi' }));
    var grid = el('div', { class: 'grid' });
    cat.phases.forEach(function (ph) {
      var unlocked = cat.phaseUnlocked(ph.n);
      var s = store.statsFor(ph.itemIds);
      var card = el(unlocked ? 'a' : 'div', {
        class: 'card phase-card', href: unlocked ? '#/fase/' + ph.n : null,
        'aria-disabled': unlocked ? null : 'true'
      });
      card.appendChild(el('span', { class: 'tag ' + (cat.phaseDone(ph.n) ? 'ok' : (unlocked ? 'acc' : '')),
        text: cat.phaseDone(ph.n) ? 'completata' : (unlocked ? 'fase ' + ph.n : 'bloccata') }));
      card.appendChild(el('h3', { text: ph.title }));
      card.appendChild(el('p', { text: ph.desc }));
      var t = el('div', { class: 'pb-t' });
      t.appendChild(el('i', { style: 'width:' + (unlocked ? s.pct : 0) + '%' }));
      card.appendChild(t);
      card.appendChild(el('p', { class: 'small', style: 'margin:.4rem 0 0',
        text: unlocked ? (s.done + ' esercizi risolti su ' + s.total)
                       : 'Si sblocca completando la fase ' + (ph.n - 1) + '.' }));
      grid.appendChild(card);
    });
    f.appendChild(grid);

    /* punti deboli */
    var weak = cat.weak();
    if (weak.length) {
      f.appendChild(el('h2', { text: 'Argomenti da rivedere' }));
      var ts = store.topicStats().filter(function (t) { return t.wrong > 0; }).slice(0, 5);
      var c = el('div', { class: 'card' });
      var tb = el('table', { class: 'kv' });
      ts.forEach(function (t) {
        tb.appendChild(el('tr', null, [
          el('th', { text: TOPIC_LABEL[t.topic] || t.topic }),
          el('td', { text: t.wrong + ' errori su ' + t.total + ' tentativi (' + t.rate + '%)' })
        ]));
      });
      c.appendChild(tb);
      c.appendChild(el('div', { class: 'btnrow' },
        el('a', { class: 'btn', href: '#/ripasso', text: 'Ripasso mirato (' + weak.length + ' esercizi)' })));
      f.appendChild(c);
    }

    f.appendChild(el('h2', { text: 'Come è tarata la piattaforma' }));
    var info = el('div', { class: 'card' });
    var kv = el('table', { class: 'kv' });
    [['Prova di riferimento', 'Tecnologie Web, prova individuale di 2 ore in laboratorio, esercizi separati e valutati singolarmente.'],
     ['Perimetro', 'Solo HTML, CSS e JavaScript. PHP è escluso: sarà affrontato in una fase successiva.'],
     ['Peso degli argomenti', 'HTML e accessibilità 7 punti, CSS 6, teoria aperta 5, JavaScript 7. Gli esercizi seguono queste proporzioni.'],
     ['Accessibilità', 'WCAG 2.0 livello A, integrata trasversalmente negli esercizi di HTML, mai come modulo separato.'],
     ['Correzione del codice', 'Nessun confronto carattere per carattere: ogni esercizio ha una checklist di requisiti verificati sulla struttura reale prodotta.']
    ].forEach(function (r) {
      kv.appendChild(el('tr', null, [el('th', { text: r[0] }), el('td', { text: r[1] })]));
    });
    info.appendChild(kv);
    f.appendChild(info);

    view.textContent = '';
    view.appendChild(f);
  }

  /* ======================= pagina di fase ======================= */
  function viewPhase(n) {
    var ph = cat.phase(n);
    if (!ph) return viewHome();
    store.setPhase(n);

    var f = document.createDocumentFragment();
    f.appendChild(el('p', { class: 'small', html: '<a href="#/">Dashboard</a> / Fase ' + n }));
    f.appendChild(el('h1', { text: 'Fase ' + n + ' · ' + ph.title }));
    f.appendChild(el('p', { class: 'lead', text: ph.desc }));

    if (!cat.phaseUnlocked(n)) {
      var prev = cat.phase(n - 1);
      var s = store.statsFor(prev.itemIds);
      f.appendChild(el('div', { class: 'card cd-warn locknote' }, [
        el('span', { class: 'ic', html: '&#128274;', 'aria-hidden': 'true' }),
        el('div', null, [
          el('p', { style: 'margin:0 0 .5rem',
            html: '<strong>Fase bloccata.</strong> Si sblocca quando ogni esercizio della fase ' + (n - 1)
              + ' è stato risolto almeno una volta: mancano ancora <strong>' + (s.total - s.done) + '</strong> esercizi.' }),
          el('a', { class: 'btn', href: '#/fase/' + (n - 1), text: 'Vai alla fase ' + (n - 1) })
        ])
      ]));
      view.textContent = '';
      view.appendChild(f);
      return;
    }

    var acts = ph.activities.slice();
    if (n === 3 && isPhone()) {
      var rank = { micro: 0, medio: 1, esame: 2 };
      acts.sort(function (a, b) { return (rank[a.size] || 0) - (rank[b.size] || 0); });
      f.appendChild(el('div', { class: 'card cd-info' }, [
        el('p', { class: 'mb0', text: 'Schermo piccolo rilevato: i micro-esercizi sono stati messi per primi. '
          + 'I blocchi e le prove d\'esame restano accessibili, ma su telefono conviene affrontarli in orizzontale o da computer.' })
      ]));
    }

    var st = store.statsFor(ph.itemIds);
    f.appendChild(el('p', { class: 'small', text: st.done + ' esercizi risolti su ' + st.total
      + ' · tempo speso in questa fase: ' + u.fmtDur(store.raw.phaseTime[n] || 0) + ' su circa 2 ore' }));

    var list = el('ul', { class: 'alist' });
    acts.forEach(function (a) {
      var s = store.statsFor(a.itemIds);
      var row = el('a', { class: 'arow', href: '#/att/' + a.id });
      row.appendChild(el('span', { class: 'dot ' + (s.done === s.total ? 'done' : (s.seen ? 'part' : '')),
        'aria-hidden': 'true' }));
      var b = el('span', { class: 'arow-b' });
      b.appendChild(el('strong', { text: a.title }));
      b.appendChild(el('span', { text: a.desc }));
      row.appendChild(b);
      row.appendChild(el('span', { class: 'arow-p' }, [
        el('b', { text: s.done + '/' + s.total }),
        el('span', { text: a.size === 'esame' ? 'esame' : (a.size || '') })
      ]));
      list.appendChild(el('li', null, row));
    });
    f.appendChild(list);

    if (cat.phaseDone(n) && n < 3) {
      f.appendChild(el('div', { class: 'card cd-ok' }, [
        el('p', { style: 'margin:0 0 .6rem', text: 'Fase ' + n + ' completata. La fase successiva è sbloccata.' }),
        el('a', { class: 'btn', href: '#/fase/' + (n + 1), text: 'Vai alla fase ' + (n + 1) })
      ]));
    }

    view.textContent = '';
    view.appendChild(f);
  }

  /* ======================= runner ======================= */
  var R = null;

  function viewActivity(id, startAt) {
    var a = cat.activity(id);
    if (!a) return viewHome();
    if (!cat.phaseUnlocked(a.phase)) { location.hash = '#/fase/' + a.phase; return; }
    store.setPhase(a.phase);

    var queue = a.items.slice();
    /* si riparte dal primo esercizio non ancora risolto */
    var idx = 0;
    if (startAt !== undefined && startAt !== null && !isNaN(startAt)) idx = u.clamp(startAt, 0, queue.length - 1);
    else {
      var k = queue.findIndex(function (x) { return !store.isDone(x.id); });
      idx = k < 0 ? 0 : k;
    }

    R = { act: a, queue: queue, idx: idx, resolved: false, timer: null };
    store.setLast('#/att/' + a.id, a.title);
    drawRunner();
  }

  function drawRunner() {
    var a = R.act, it = R.queue[R.idx];
    var f = document.createDocumentFragment();

    f.appendChild(el('p', { class: 'small bc',
      html: '<a href="#/">Dashboard</a> / <a href="#/fase/' + a.phase + '">Fase ' + a.phase + '</a> / ' + u.esc(a.title) }));

    var top = el('div', { class: 'runner-top' });
    top.appendChild(el('h1', { style: 'font-size:1.15rem;margin:0;flex:1', text: a.title }));
    top.appendChild(el('span', { class: 'counter', text: (R.idx + 1) + ' / ' + R.queue.length }));
    if (a.phase === 3) top.appendChild(timerWidget(it));
    f.appendChild(top);

    var bar = el('div', { class: 'qbar' });
    bar.appendChild(el('i', { style: 'width:' + ((R.idx) / R.queue.length * 100) + '%' }));
    f.appendChild(bar);

    var meta = el('div', { class: 'chips', style: 'margin-top:0' });
    meta.appendChild(el('span', { class: 'tag acc', text: LANG_LABEL[it.lang] || it.lang }));
    if (it.topic) meta.appendChild(el('span', { class: 'tag', text: TOPIC_LABEL[it.topic] || it.topic }));
    var rec = store.get(it.id);
    if (rec && rec.s === 'done') meta.appendChild(el('span', { class: 'tag ok', text: 'già risolto' }));
    else if (rec && rec.w) meta.appendChild(el('span', { class: 'tag bad', text: rec.w + ' errori' }));
    f.appendChild(meta);

    var host = el('div');
    f.appendChild(host);

    var nav = el('div', { class: 'btnrow' });
    var bPrev = el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: '← Precedente',
      disabled: R.idx === 0 });
    var bNext = el('button', { class: 'btn', type: 'button',
      text: R.idx + 1 >= R.queue.length ? 'Concludi' : 'Successivo →' });
    var bSkip = el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Salta' });
    nav.appendChild(bPrev);
    nav.appendChild(el('span', { class: 'spacer' }));
    nav.appendChild(bSkip);
    nav.appendChild(bNext);
    f.appendChild(el('hr', { class: 'hr' }));
    f.appendChild(nav);

    bPrev.addEventListener('click', function () { go(R.idx - 1); });
    bNext.addEventListener('click', function () { go(R.idx + 1); });
    bSkip.addEventListener('click', function () { go(R.idx + 1); });

    var api = {
      act: a,
      resolve: function (ok) {
        if (R.resolved) return;
        R.resolved = true;
        store.record(it.id, ok, it.topic);
        bNext.classList.remove('btn-ghost');
        paintHeader();
        if (R.timer && R.timer.stop) R.timer.stop();
      },
      next: function () { go(R.idx + 1); },
      requeue: function () {
        /* le flashcard sbagliate tornano in fondo alla pila */
        if (R.queue.indexOf(it) === R.queue.lastIndexOf(it)) R.queue.push(it);
      }
    };

    view.textContent = '';
    view.appendChild(f);
    window.scrollTo(0, 0);

    var render = P.activities[a.type];
    R.resolved = false;
    try { render(host, it, api); }
    catch (e) {
      host.appendChild(el('div', { class: 'card cd-bad' },
        el('p', { class: 'mb0', text: 'Errore nella resa di questo esercizio: ' + e.message })));
    }

    function go(n) {
      if (R.timer && R.timer.stop) R.timer.stop();
      if (n < 0) return;
      if (n >= R.queue.length) return finish();
      R.idx = n;
      drawRunner();
    }
  }

  function finish() {
    var a = R.act;
    var s = store.statsFor(a.itemIds);
    var f = document.createDocumentFragment();
    f.appendChild(el('p', { class: 'small',
      html: '<a href="#/">Dashboard</a> / <a href="#/fase/' + a.phase + '">Fase ' + a.phase + '</a>' }));
    f.appendChild(el('h1', { text: 'Fine: ' + a.title }));

    var card = el('div', { class: 'card ' + (s.done === s.total ? 'cd-ok' : '') });
    card.appendChild(el('p', { class: 'score mt0', text: s.done + ' esercizi risolti su ' + s.total }));
    if (s.done < s.total) {
      card.appendChild(el('p', { class: 'mb0',
        text: 'Gli esercizi non ancora risolti restano in sospeso: rientrando nell\'attività riparti dal primo di questi.' }));
    } else {
      card.appendChild(el('p', { class: 'mb0', text: 'Attività completata.' }));
    }
    f.appendChild(card);

    var weak = a.items.filter(function (it) { var r = store.get(it.id); return r && r.w > 0; });
    if (weak.length) {
      f.appendChild(el('div', { class: 'card' }, [
        el('p', { style: 'margin:0 0 .6rem', text: weak.length + ' esercizi sono stati sbagliati almeno una volta.' }),
        el('a', { class: 'btn', href: '#/ripasso', text: 'Ripassa gli sbagliati' })
      ]));
    }

    var row = el('div', { class: 'btnrow' });
    row.appendChild(el('a', { class: 'btn btn-ghost', href: '#/fase/' + a.phase, text: 'Torna alla fase ' + a.phase }));
    var nxt = nextActivity(a);
    if (nxt) row.appendChild(el('a', { class: 'btn', href: '#/att/' + nxt.id, text: 'Prossima: ' + nxt.title }));
    else if (a.phase < 3 && cat.phaseDone(a.phase))
      row.appendChild(el('a', { class: 'btn', href: '#/fase/' + (a.phase + 1), text: 'Vai alla fase ' + (a.phase + 1) }));
    f.appendChild(row);

    view.textContent = '';
    view.appendChild(f);
    window.scrollTo(0, 0);
    paintHeader();
  }

  function nextActivity(a) {
    var ph = cat.phase(a.phase);
    var i = ph.activities.indexOf(a);
    for (var k = i + 1; k < ph.activities.length; k++) {
      var s = store.statsFor(ph.activities[k].itemIds);
      if (s.done < s.total) return ph.activities[k];
    }
    return null;
  }

  /* ======================= cronometro ======================= */
  function timerWidget(it) {
    var limit = it.minutes ? it.minutes * 60000 : 0;
    var box = el('span', { class: 'timer', role: 'timer', 'aria-label': 'Cronometro' });
    var btn = el('button', { class: 'btn btn-ghost btn-sm', type: 'button' });
    var wrap = el('span', { style: 'display:inline-flex;gap:.35rem;align-items:center' }, [box, btn]);

    var t0 = null, iv = null, running = false;
    function paint() {
      var passed = running ? Date.now() - t0 : 0;
      if (limit) {
        var left = limit - passed;
        box.textContent = (left < 0 ? '-' : '') + u.fmtClock(Math.abs(left));
        box.classList.toggle('low', left < 5 * 60000);
      } else {
        box.textContent = u.fmtClock(passed);
      }
      box.classList.toggle('run', running);
    }
    function start() {
      if (running) return;
      running = true; t0 = Date.now();
      iv = setInterval(paint, 500);
      btn.textContent = 'Ferma';
      paint();
    }
    function stop() {
      if (!running) return;
      running = false;
      clearInterval(iv); iv = null;
      btn.textContent = 'Riavvia';
      box.classList.remove('run');
    }
    btn.addEventListener('click', function () { running ? stop() : start(); });

    btn.textContent = 'Avvia';
    paint();
    if (limit || store.settings().timer) start();

    return Object.assign(wrap, { stop: stop });
  }

  /* ======================= ripasso mirato ======================= */
  function viewRipasso() {
    var weak = cat.weak();
    var f = document.createDocumentFragment();
    f.appendChild(el('p', { class: 'small', html: '<a href="#/">Dashboard</a> / Ripasso mirato' }));
    f.appendChild(el('h1', { text: 'Ripasso mirato' }));
    f.appendChild(el('p', { class: 'lead',
      text: 'Solo gli esercizi che hai sbagliato almeno una volta, dal più sbagliato al meno. '
        + 'Restano in elenco anche dopo che li hai risolti, così puoi ripeterli.' }));

    var ts = store.topicStats().filter(function (t) { return t.wrong > 0; });
    if (ts.length) {
      var c = el('div', { class: 'card' });
      c.appendChild(el('h2', { class: 'mt0', style: 'font-size:1rem', text: 'Errori per argomento' }));
      var tb = el('table', { class: 'kv' });
      ts.forEach(function (t) {
        tb.appendChild(el('tr', null, [
          el('th', { text: TOPIC_LABEL[t.topic] || t.topic }),
          el('td', { text: t.wrong + ' errori su ' + t.total + ' tentativi (' + t.rate + '%)' })
        ]));
      });
      c.appendChild(tb);
      f.appendChild(c);
    }

    if (!weak.length) {
      f.appendChild(el('div', { class: 'card cd-ok' },
        el('p', { class: 'mb0', text: 'Nessun errore registrato finora. Continua con le fasi: qui compariranno gli esercizi da rivedere.' })));
      view.textContent = ''; view.appendChild(f); return;
    }

    /* filtri per argomento */
    var langs = {};
    weak.forEach(function (w) { langs[w.item.lang] = (langs[w.item.lang] || 0) + 1; });
    var filter = null;
    var chips = el('div', { class: 'chips' });
    var listBox = el('div');

    function chip(label, val) {
      var b = el('button', { class: 'chip', type: 'button', text: label });
      b.addEventListener('click', function () { filter = val; paintList(); 
        chips.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('used'); });
        b.classList.add('used'); });
      return b;
    }
    chips.appendChild(chip('tutti (' + weak.length + ')', null));
    Object.keys(langs).forEach(function (l) {
      chips.appendChild(chip((LANG_LABEL[l] || l) + ' (' + langs[l] + ')', l));
    });
    f.appendChild(chips);
    f.appendChild(listBox);

    function paintList() {
      listBox.textContent = '';
      var rows = weak.filter(function (w) { return !filter || w.item.lang === filter; });
      var list = el('ul', { class: 'alist' });
      rows.slice(0, 80).forEach(function (w) {
        var pos = w.act.items.indexOf(w.item);
        var row = el('a', { class: 'arow', href: '#/att/' + w.act.id + '/' + pos });
        row.appendChild(el('span', { class: 'dot ' + (w.rec.s === 'done' ? 'done' : 'part'), 'aria-hidden': 'true' }));
        var b = el('span', { class: 'arow-b' });
        b.appendChild(el('strong', { text: label(w.item) }));
        b.appendChild(el('span', { text: w.act.title + ' · ' + (TOPIC_LABEL[w.item.topic] || w.item.topic) }));
        row.appendChild(b);
        row.appendChild(el('span', { class: 'arow-p' }, [
          el('b', { text: w.rec.w + ' ✗' }),
          el('span', { text: w.rec.s === 'done' ? 'poi risolto' : 'da risolvere' })
        ]));
        list.appendChild(el('li', null, row));
      });
      listBox.appendChild(list);
      if (rows.length > 80) listBox.appendChild(el('p', { class: 'small', text: 'Mostrati i primi 80 di ' + rows.length + '.' }));
    }
    paintList();

    view.textContent = '';
    view.appendChild(f);
  }

  function label(it) {
    var t = it.title || it.q || it.dir || it.req || it.front || it.brief || it.id;
    t = String(t).replace(/`/g, '');
    return t.length > 90 ? t.slice(0, 88) + '…' : t;
  }

  /* ======================= impostazioni ======================= */
  function viewSettings() {
    var f = document.createDocumentFragment();
    f.appendChild(el('p', { class: 'small', html: '<a href="#/">Dashboard</a> / Impostazioni' }));
    f.appendChild(el('h1', { text: 'Impostazioni' }));

    var c1 = el('div', { class: 'card' });
    c1.appendChild(el('h2', { class: 'mt0', style: 'font-size:1rem', text: 'Cronometro' }));
    var lab = el('label', { style: 'display:flex;gap:.6rem;align-items:flex-start;cursor:pointer' });
    var cb = el('input', { type: 'checkbox', style: 'width:20px;height:20px;margin-top:.15rem' });
    cb.checked = !!store.settings().timer;
    cb.addEventListener('change', function () { store.setSetting('timer', cb.checked); });
    lab.appendChild(cb);
    lab.appendChild(el('span', { text: 'Avvia il cronometro automaticamente in tutti gli esercizi della fase 3. '
      + 'Negli esercizi in stile esame parte comunque, con il conto alla rovescia del tempo previsto.' }));
    c1.appendChild(lab);
    f.appendChild(c1);

    var c2 = el('div', { class: 'card' });
    c2.appendChild(el('h2', { class: 'mt0', style: 'font-size:1rem', text: 'Progressi' }));
    var s = store.statsFor(cat.phases.reduce(function (acc, p) { return acc.concat(p.itemIds); }, []));
    c2.appendChild(el('p', { text: s.done + ' esercizi risolti su ' + s.total + ' · '
      + u.fmtDur(store.raw.timeMs) + ' di studio effettivo · ' + s.errors + ' errori registrati' }));

    var exp = el('button', { class: 'btn btn-ghost', type: 'button', text: 'Esporta i progressi' });
    exp.addEventListener('click', function () {
      var ta = el('textarea', { class: 'ta', style: 'min-height:9rem;font-family:var(--mono);font-size:.8rem' });
      ta.value = store.exportJson();
      ta.readOnly = true;
      c2.appendChild(el('p', { class: 'small', style: 'margin-top:.8rem',
        text: 'Copia questo testo per conservare i progressi o spostarli su un altro dispositivo:' }));
      c2.appendChild(ta);
      ta.select();
      exp.disabled = true;
    });

    var imp = el('button', { class: 'btn btn-ghost', type: 'button', text: 'Importa i progressi' });
    imp.addEventListener('click', function () {
      var ta = el('textarea', { class: 'ta', style: 'min-height:9rem;font-family:var(--mono);font-size:.8rem',
        placeholder: 'Incolla qui il testo esportato...' });
      var go = el('button', { class: 'btn', type: 'button', text: 'Conferma importazione' });
      go.addEventListener('click', function () {
        try { store.importJson(ta.value); location.hash = '#/'; location.reload(); }
        catch (e) { alert('Testo non valido: ' + e.message); }
      });
      c2.appendChild(ta);
      c2.appendChild(el('div', { class: 'btnrow' }, go));
      imp.disabled = true;
    });

    var wipe = el('button', { class: 'btn btn-danger', type: 'button', text: 'Azzera tutto' });
    wipe.addEventListener('click', function () {
      if (confirm('Azzerare progressi, tempi e bozze di codice? L\'operazione non è reversibile.')) {
        store.wipe(); location.hash = '#/'; location.reload();
      }
    });
    c2.appendChild(el('div', { class: 'btnrow' }, [exp, imp, el('span', { class: 'spacer' }), wipe]));
    f.appendChild(c2);

    var c3 = el('div', { class: 'card' });
    c3.appendChild(el('h2', { class: 'mt0', style: 'font-size:1rem', text: 'Contenuti' }));
    var tot = {}, grand = 0;
    cat.phases.forEach(function (p) { p.activities.forEach(function (a) {
      a.items.forEach(function (i) { tot[i.lang] = (tot[i.lang] || 0) + 1; grand++; });
    }); });
    var tb = el('table', { class: 'kv' });
    Object.keys(tot).forEach(function (l) {
      tb.appendChild(el('tr', null, [el('th', { text: LANG_LABEL[l] || l }),
        el('td', { text: tot[l] + ' esercizi (' + Math.round(tot[l] / grand * 100) + '%)' })]));
    });
    tb.appendChild(el('tr', null, [el('th', { text: 'Totale' }), el('td', { text: grand + ' esercizi' })]));
    c3.appendChild(tb);
    f.appendChild(c3);

    view.textContent = '';
    view.appendChild(f);
  }

  /* ======================= router ======================= */
  function route() {
    var h = location.hash || '#/';
    setNav(h.split('/').slice(0, 2).join('/'));
    var m;
    if ((m = /^#\/fase\/(\d+)/.exec(h))) { viewPhase(Number(m[1])); return; }
    if ((m = /^#\/att\/([\w-]+)(?:\/(\d+))?/.exec(h))) {
      viewActivity(m[1], m[2] === undefined ? undefined : Number(m[2]));
      return;
    }
    if (/^#\/ripasso/.test(h)) { store.setPhase(0); viewRipasso(); return; }
    if (/^#\/impostazioni/.test(h)) { store.setPhase(0); viewSettings(); return; }
    store.setPhase(0);
    viewHome();
  }

  window.addEventListener('hashchange', function () { route(); paintHeader(); });

  var mb = document.getElementById('menuBtn');
  if (mb) mb.addEventListener('click', function () {
    var n = document.getElementById('mainnav');
    var open = n.classList.toggle('open');
    mb.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.getElementById('mainnav').addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && window.innerWidth < 860) {
      document.getElementById('mainnav').classList.remove('open');
      if (mb) mb.setAttribute('aria-expanded', 'false');
    }
  });

  store.startClock();
  paintHeader();
  route();
})(window.PREP);
