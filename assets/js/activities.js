/* PrepWeb - resa dei singoli tipi di esercizio.
   Ogni tipo espone render(host, item, api). L'api è fornita dal runner. */
(function (P) {
  'use strict';
  var u = P.u, el = u.el, rich = u.rich;

  /* ---------------- elementi riutilizzabili ---------------- */

  function fb(ok, title, bodyHtml) {
    var box = el('div', { class: 'fb ' + (ok ? 'ok' : 'bad') });
    box.appendChild(el('p', { class: 'fb-h', html: (ok ? '&#10003; ' : '&#10007; ') + u.esc(title) }));
    if (bodyHtml) box.appendChild(el('p', { html: bodyHtml }));
    return box;
  }

  function solutionBox(code, lang, why, label) {
    var d = el('details', { class: 'card cd-info' });
    d.appendChild(el('summary', { text: label || 'Soluzione di riferimento e spiegazione' }));
    if (code) d.appendChild(P.codeBlock(code, lang));
    if (why) d.appendChild(el('p', { html: rich(why), class: 'mb0' }));
    return d;
  }

  /* Elenco di opzioni a scelta singola. */
  function options(list, onPick) {
    var ul = el('ul', { class: 'opts' });
    var btns = [];
    list.forEach(function (t, i) {
      var b = el('button', { class: 'opt', type: 'button' }, [
        el('span', { class: 'k', text: u.letter(i) }),
        el('span', { class: 't', html: rich(t) })
      ]);
      b.addEventListener('click', function () { onPick(i, btns); });
      btns.push(b);
      ul.appendChild(el('li', null, b));
    });
    return { el: ul, btns: btns };
  }

  function lockOptions(btns, chosen, right) {
    btns.forEach(function (b, i) {
      b.disabled = true;
      if (i === right) b.classList.add('good');
      else if (i === chosen) b.classList.add('wrong');
    });
  }

  /* ============================ QUIZ ============================ */
  function renderQuiz(host, it, api) {
    host.appendChild(el('p', { class: 'prompt', html: rich(it.q) }));
    if (it.code) host.appendChild(P.codeBlock(it.code, it.lang === 'teoria' ? 'html' : it.lang));

    var order = u.shuffle(it.opts.map(function (t, i) { return i; }), it.id);
    var shown = order.map(function (i) { return it.opts[i]; });
    var rightPos = order.indexOf(it.a);

    var o = options(shown, function (pos, btns) {
      var ok = pos === rightPos;
      lockOptions(btns, pos, rightPos);
      host.appendChild(fb(ok, ok ? 'Corretto' : 'Non corretto', rich(it.why)));
      api.resolve(ok);
    });
    host.appendChild(o.el);
  }

  /* ============================ RICONOSCIMENTO (associazioni) ============================ */
  function renderPair(host, it, api) {
    host.appendChild(el('p', { class: 'prompt', html: rich(it.dir) }));

    var right = u.shuffle(it.items.map(function (x, i) { return { i: i, b: x.b }; }), it.id + 'b');
    var wrap = el('div', { class: 'grid' });
    var selects = [];

    it.items.forEach(function (x, i) {
      var row = el('div', { class: 'card', style: 'margin-bottom:.5rem;padding:.7rem .8rem' });
      row.appendChild(el('div', { html: '<strong>' + rich(x.a) + '</strong>', style: 'margin-bottom:.4rem' }));
      var sel = el('select', { class: 'inp', 'aria-label': 'Descrizione per ' + x.a });
      sel.appendChild(el('option', { value: '', text: '- scegli la descrizione -' }));
      right.forEach(function (r, k) {
        sel.appendChild(el('option', { value: String(r.i), text: (k + 1) + '. ' + r.b }));
      });
      selects.push({ sel: sel, want: i, row: row });
      row.appendChild(sel);
      wrap.appendChild(row);
    });
    host.appendChild(wrap);

    var btn = el('button', { class: 'btn', type: 'button', text: 'Verifica le associazioni' });
    host.appendChild(el('div', { class: 'btnrow' }, btn));

    btn.addEventListener('click', function () {
      btn.disabled = true;
      var good = 0;
      selects.forEach(function (s) {
        s.sel.disabled = true;
        var ok = s.sel.value !== '' && Number(s.sel.value) === s.want;
        if (ok) good++;
        s.row.classList.add(ok ? 'cd-ok' : 'cd-bad');
        if (!ok) s.row.appendChild(el('p', { class: 'small mb0', style: 'margin-top:.4rem',
          html: '<strong>Corretta:</strong> ' + u.esc(it.items[s.want].b) }));
      });
      var allOk = good === selects.length;
      host.appendChild(fb(allOk, good + ' associazioni corrette su ' + selects.length,
        allOk ? '' : 'Le associazioni sbagliate sono segnate in rosso con la risposta corretta.'));
      api.resolve(allOk);
    });
  }

  /* ============================ FLASHCARD ============================ */
  function renderFlash(host, it, api) {
    host.appendChild(el('p', { class: 'small', text: 'Rispondi mentalmente, poi gira la carta.' }));
    var front = el('div', { class: 'card', style: 'min-height:5rem' }, [
      el('p', { class: 'prompt mb0', html: rich(it.front) })
    ]);
    host.appendChild(front);

    var reveal = el('button', { class: 'btn', type: 'button', text: 'Gira la carta' });
    var row = el('div', { class: 'btnrow' }, reveal);
    host.appendChild(row);

    reveal.addEventListener('click', function () {
      row.remove();
      var back = el('div', { class: 'card cd-info' });
      if (it.bl) back.appendChild(P.codeBlock(it.back, it.bl));
      else back.appendChild(el('p', { class: 'mb0', style: 'white-space:pre-wrap', text: it.back }));
      host.appendChild(back);

      host.appendChild(el('p', { class: 'small', text: 'La sapevi?' }));
      var ko = el('button', { class: 'btn btn-ghost', type: 'button', text: 'No, ripropinimela' });
      var ok = el('button', { class: 'btn', type: 'button', text: 'Si\', la sapevo' });
      var r2 = el('div', { class: 'selfassess' }, [ok, ko]);
      host.appendChild(r2);
      ok.addEventListener('click', function () { api.resolve(true); api.next(); });
      ko.addEventListener('click', function () { api.resolve(false); api.requeue(); api.next(); });
    });
  }

  /* ============================ COMPLETAMENTO ============================ */
  function renderFill(host, it, api) {
    host.appendChild(el('p', { class: 'prompt', html: rich(it.dir) }));

    var filled = it.sol.map(function () { return null; });
    var blanks = [];
    var active = 0;

    var pre = el('pre', { class: 'code' });
    var code = el('code');
    var parts = it.code.split(/(__\d+__)/);
    parts.forEach(function (p) {
      var m = /^__(\d+)__$/.exec(p);
      if (m) {
        var idx = Number(m[1]) - 1;
        var b = el('button', { class: 'blank', type: 'button', text: '?' , 'aria-label': 'Spazio ' + (idx + 1) });
        b.addEventListener('click', function () {
          if (filled[idx] !== null) { filled[idx] = null; paint(); }
          setActive(idx);
        });
        blanks[idx] = b;
        code.appendChild(b);
      } else if (p) {
        var s = el('span');
        s.innerHTML = P.hl(p, it.lang);
        code.appendChild(s);
      }
    });
    pre.appendChild(code);
    host.appendChild(pre);

    var bank = u.shuffle(it.bank.slice(), it.id);
    var chipRow = el('div', { class: 'chips' });
    var chips = [];
    bank.forEach(function (t) {
      var c = el('button', { class: 'chip', type: 'button', text: t === '' ? '(stringa vuota)' : t });
      c.addEventListener('click', function () {
        if (active < 0 || active >= filled.length) return;
        filled[active] = t;
        var nx = filled.indexOf(null);
        paint();
        setActive(nx);
      });
      chips.push({ el: c, t: t });
      chipRow.appendChild(c);
    });
    host.appendChild(chipRow);

    function setActive(i) {
      active = i;
      blanks.forEach(function (b, k) {
        b.style.outline = (k === i) ? '2px solid var(--acc)' : '';
      });
      if (i >= 0 && blanks[i]) blanks[i].focus();
      btn.disabled = filled.indexOf(null) >= 0;
    }
    function paint() {
      filled.forEach(function (v, k) {
        blanks[k].textContent = v === null ? '?' : (v === '' ? '""' : v);
        blanks[k].classList.toggle('filled', v !== null);
      });
      btn.disabled = filled.indexOf(null) >= 0;
    }

    var btn = el('button', { class: 'btn', type: 'button', text: 'Verifica', disabled: true });
    host.appendChild(el('div', { class: 'btnrow' }, btn));
    setActive(0);

    btn.addEventListener('click', function () {
      btn.disabled = true;
      chips.forEach(function (c) { c.el.disabled = true; });
      var good = 0;
      filled.forEach(function (v, k) {
        var ok = v === it.sol[k];
        if (ok) good++;
        blanks[k].classList.add(ok ? 'y' : 'n');
        blanks[k].disabled = true;
        if (!ok) blanks[k].textContent = (v === '' ? '""' : v) + ' → ' + (it.sol[k] === '' ? '""' : it.sol[k]);
      });
      var allOk = good === filled.length;
      host.appendChild(fb(allOk, good + ' spazi corretti su ' + filled.length, rich(it.why)));
      api.resolve(allOk);
    });
  }

  /* ============================ TROVA L'ERRORE ============================ */
  function renderBug(host, it, api) {
    host.appendChild(el('p', { class: 'prompt', text: 'Individua la riga che contiene l\'errore, poi indica il motivo.' }));

    var lines = it.code.split('\n');
    var pre = el('pre', { class: 'code lines' });
    var codeEl = el('code');
    var btns = [];
    lines.forEach(function (l, i) {
      var b = el('button', { class: 'ln', type: 'button' });
      b.dataset.n = String(i + 1);
      b.innerHTML = P.hl(l, it.lang) || '&nbsp;';
      b.addEventListener('click', function () { pickLine(i + 1); });
      btns.push(b);
      codeEl.appendChild(b);
    });
    pre.appendChild(codeEl);
    host.appendChild(pre);

    var step2 = el('div');
    host.appendChild(step2);
    var chosenLine = null;

    function pickLine(n) {
      if (chosenLine !== null) return;
      chosenLine = n;
      btns.forEach(function (b) { b.disabled = true; });
      var lineOk = n === it.line;
      btns[n - 1].classList.add(lineOk ? 'good' : 'wrong');
      if (!lineOk) btns[it.line - 1].classList.add('good');

      step2.appendChild(el('p', { class: 'prompt', style: 'margin-top:1rem',
        html: lineOk ? 'Riga corretta. Ora: <strong>perché</strong> è sbagliata?'
                     : 'La riga sbagliata era la <strong>' + it.line + '</strong>, evidenziata in verde. Perché?' }));

      var order = u.shuffle(it.opts.map(function (t, i) { return i; }), it.id);
      var shown = order.map(function (i) { return it.opts[i]; });
      var rightPos = order.indexOf(it.a);

      var o = options(shown, function (pos, ob) {
        var reasonOk = pos === rightPos;
        lockOptions(ob, pos, rightPos);
        var all = lineOk && reasonOk;
        step2.appendChild(fb(all,
          all ? 'Riga e motivo corretti' : (lineOk ? 'Riga giusta, motivo sbagliato' : 'Riga sbagliata'),
          rich(it.why)));
        api.resolve(all);
      });
      step2.appendChild(o.el);
    }
  }

  /* ============================ PREDIZIONE ============================ */
  function renderPredict(host, it, api) {
    host.appendChild(el('p', { class: 'prompt', html: rich(it.q) }));
    host.appendChild(P.codeBlock(it.code, it.lang));

    var order = u.shuffle(it.opts.map(function (t, i) { return i; }), it.id);
    var shown = order.map(function (i) { return it.opts[i]; });
    var rightPos = order.indexOf(it.a);

    var o = options(shown, function (pos, btns) {
      var ok = pos === rightPos;
      lockOptions(btns, pos, rightPos);
      host.appendChild(fb(ok, ok ? 'Corretto' : 'Non corretto', rich(it.why)));
      if (it.demo) runDemo(host, it);
      api.resolve(ok);
    });
    host.appendChild(o.el);
  }

  function runDemo(host, it) {
    var box = el('div', { class: 'card' });
    box.appendChild(el('p', { class: 'frame-lbl', text: 'Verifica: il frammento eseguito davvero' }));
    host.appendChild(box);

    if (it.lang === 'js') {
      var cons = P.sandbox.consoleBox();
      box.appendChild(cons.el);
      P.sandbox.mount(box, {
        hidden: true, html: it.html || '', js: it.code, files: it.files || {},
        onLog: function (e) { cons.push(e); }
      }).then(function (f) { setTimeout(function () { f.destroy(); }, 2500); });
    } else {
      P.sandbox.mount(box, { mode: 'html', html: it.code, height: 180,
        title: 'Resa del frammento' }).then(function (f) { f.autosize(); setTimeout(f.autosize, 250); });
    }
  }

  /* ============================ SCELTA PROGETTUALE ============================ */
  function renderChoice(host, it, api) {
    host.appendChild(el('p', { class: 'prompt', html: rich(it.q) }));

    var grid = el('div', { class: 'grid' + (it.alts.length === 2 ? ' g2' : '') });
    it.alts.forEach(function (alt) {
      var c = el('div', { class: 'card' });
      c.appendChild(el('p', { html: '<strong>Alternativa ' + u.esc(alt.t) + '</strong>', style: 'margin:0 0 .5rem' }));
      c.appendChild(P.codeBlock(alt.code, it.view || it.lang));
      grid.appendChild(c);
    });
    host.appendChild(grid);

    var labels = it.alts.map(function (a) { return 'Alternativa ' + a.t; });
    var o = options(labels, function (pos, btns) {
      var ok = pos === it.a;
      lockOptions(btns, pos, it.a);
      host.appendChild(fb(ok, ok ? 'Scelta corretta' : 'Scelta non corretta', rich(it.why)));
      api.resolve(ok);
    });
    host.appendChild(el('p', { class: 'small', text: 'Quale scegli?' }));
    host.appendChild(o.el);
  }

  /* ============================ DAL REQUISITO AGLI ELEMENTI ============================ */
  function renderPlan(host, it, api) {
    host.appendChild(el('div', { class: 'consegna' }, [
      el('h2', { text: 'Requisito' }),
      el('p', { class: 'mb0', html: rich(it.req) })
    ]));
    host.appendChild(el('p', { class: 'prompt',
      text: 'Seleziona tutte e sole le voci necessarie per soddisfarlo.' }));

    var order = u.shuffle(it.opts.map(function (o, i) { return i; }), it.id);
    var list = el('ul', { class: 'opts' });
    var boxes = [];
    order.forEach(function (idx) {
      var opt = it.opts[idx];
      var id = it.id + '-' + idx;
      var cb = el('input', { type: 'checkbox', id: id, style: 'width:20px;height:20px;flex:none;margin-top:.15rem' });
      var lab = el('label', { class: 'opt', for: id }, [cb, el('span', { class: 't', html: rich(opt.t) })]);
      boxes.push({ cb: cb, ok: opt.ok, lab: lab });
      list.appendChild(el('li', null, lab));
    });
    host.appendChild(list);

    var btn = el('button', { class: 'btn', type: 'button', text: 'Verifica' });
    host.appendChild(el('div', { class: 'btnrow' }, btn));

    btn.addEventListener('click', function () {
      btn.disabled = true;
      var errors = 0;
      boxes.forEach(function (b) {
        b.cb.disabled = true;
        var chosen = b.cb.checked;
        if (chosen && b.ok) b.lab.classList.add('good');
        else if (!chosen && b.ok) { b.lab.classList.add('wrong'); errors++;
          b.lab.appendChild(el('span', { class: 'tag bad', text: 'mancante' })); }
        else if (chosen && !b.ok) { b.lab.classList.add('wrong'); errors++;
          b.lab.appendChild(el('span', { class: 'tag bad', text: 'di troppo' })); }
      });
      var ok = errors === 0;
      host.appendChild(fb(ok, ok ? 'Elenco corretto' : errors + ' voci sbagliate', rich(it.why)));
      api.resolve(ok);
    });
  }

  /* ============================ TEORIA APERTA ============================ */
  function renderTheory(host, it, api) {
    host.appendChild(el('div', { class: 'consegna' }, [
      el('h2', { text: 'Domanda d\'esame' + (it.points ? ' · ' + it.points + ' punti' : '') }),
      el('p', { class: 'mb0', html: rich(it.q) })
    ]));
    host.appendChild(el('p', { class: 'small',
      text: 'Scrivi la risposta come la scriveresti sul file .txt del compito. Nessun suggerimento prima del tentativo.' }));

    var ta = el('textarea', { class: 'ta', 'aria-label': 'La tua risposta',
      placeholder: 'Scrivi qui la tua risposta...', style: 'min-height:11rem' });
    var saved = P.store.draft(it.id);
    if (saved) ta.value = saved;
    ta.addEventListener('input', function () { P.store.setDraft(it.id, ta.value); });
    host.appendChild(ta);

    var btn = el('button', { class: 'btn', type: 'button', text: 'Ho finito: mostra la risposta di riferimento' });
    var row = el('div', { class: 'btnrow' }, btn);
    host.appendChild(row);

    btn.addEventListener('click', function () {
      if (u.norm(ta.value).length < 15) {
        if (!row.querySelector('.warnmsg')) row.appendChild(el('span', { class: 'small warnmsg',
          text: 'Scrivi qualcosa di più: il confronto ha senso solo dopo un tentativo vero.' }));
        return;
      }
      row.remove();
      ta.readOnly = true;

      var risposta = u.fold(ta.value);
      var marks = [];

      var panel = el('div', { class: 'card' });
      panel.appendChild(el('h3', { class: 'mt0', text: 'Punti attesi' }));
      panel.appendChild(el('p', { class: 'small',
        text: 'La proposta accanto a ogni punto è automatica e serve solo da traccia: confermala o correggila leggendo la risposta di riferimento.' }));

      var ul = el('ul', { class: 'checks' });
      it.keys.forEach(function (k, i) {
        var guess = (k.k || []).some(function (w) { return risposta.indexOf(u.fold(w)) >= 0; });
        var li = el('li', { class: guess ? 'y' : 'n' });
        var mk = el('span', { class: 'mk', text: guess ? '✓' : '✗' });
        var body = el('span', { class: 'why', style: 'flex:1', html: rich(k.t) });
        var toggle = el('button', { class: 'btn btn-ghost btn-sm', type: 'button',
          text: guess ? 'l\'ho scritto' : 'non l\'ho scritto',
          'aria-label': 'Cambia valutazione del punto ' + (i + 1) });
        marks[i] = guess;
        toggle.addEventListener('click', function () {
          marks[i] = !marks[i];
          li.className = marks[i] ? 'y' : 'n';
          mk.textContent = marks[i] ? '✓' : '✗';
          toggle.textContent = marks[i] ? 'l\'ho scritto' : 'non l\'ho scritto';
          score();
        });
        li.appendChild(mk);
        li.appendChild(body);
        li.appendChild(toggle);
        ul.appendChild(li);
      });
      panel.appendChild(ul);

      var scoreLine = el('p', { class: 'score' });
      panel.appendChild(scoreLine);
      host.appendChild(panel);

      var ref = el('details', { class: 'card cd-info', open: true });
      ref.appendChild(el('summary', { text: 'Risposta di riferimento' }));
      ref.appendChild(el('div', { style: 'white-space:pre-wrap;margin-top:.6rem', text: it.ref }));
      host.appendChild(ref);

      var confirm = el('button', { class: 'btn', type: 'button', text: 'Registra l\'autovalutazione' });
      host.appendChild(el('div', { class: 'btnrow' }, confirm));

      function score() {
        var n = marks.filter(Boolean).length;
        scoreLine.textContent = n + ' punti attesi su ' + marks.length +
          ' · equivale a circa ' + Math.round(n / marks.length * (it.points || 5) * 10) / 10 +
          ' punti su ' + (it.points || 5);
      }
      score();

      confirm.addEventListener('click', function () {
        confirm.disabled = true;
        var n = marks.filter(Boolean).length;
        var ok = n >= Math.ceil(marks.length * 0.6);
        host.appendChild(fb(ok,
          ok ? 'Risposta sufficiente: ' + n + '/' + marks.length + ' punti attesi'
             : 'Risposta incompleta: ' + n + '/' + marks.length + ' punti attesi',
          ok ? 'Rileggi comunque la risposta di riferimento per i punti che ti sono sfuggiti.'
             : 'Questa domanda tornerà nel ripasso mirato.'));
        api.resolve(ok);
      });
    });
  }

  /* ============================ PRODUZIONE DI CODICE ============================ */
  function renderCode(host, it, api) {
    var isExam = !!it.bullets;

    /* --- consegna --- */
    var cons = el('div', { class: 'consegna' });
    cons.appendChild(el('h2', { text: it.title || 'Consegna' }));
    cons.appendChild(el('p', { html: rich(it.brief) }));
    if (it.bullets) {
      var bl = el('ul');
      it.bullets.forEach(function (b) { bl.appendChild(el('li', { html: rich(b) })); });
      cons.appendChild(bl);
    }
    if (it.note) cons.appendChild(el('p', { class: 'mb0', html: '<strong>' + rich(it.note) + '</strong>' }));
    host.appendChild(cons);

    if (it.spec) {
      var sp = el('div', { class: 'note' });
      sp.appendChild(el('strong', { text: 'Specifica da rispettare' }));
      var sl = el('ul', { style: 'margin:.3rem 0 0;padding-left:1.1rem' });
      (Array.isArray(it.spec) ? it.spec : [it.spec]).forEach(function (s) {
        sl.appendChild(el('li', { html: rich(s) }));
      });
      sp.appendChild(sl);
      host.appendChild(sp);
    }

    /* --- contesto dato (html fisso per css/js) --- */
    if (it.html && it.lang !== 'html') {
      var d = el('details', { class: 'card' });
      d.appendChild(el('summary', { text: it.lang === 'css' ? 'File HTML fornito (non modificabile)' : 'File HTML fornito (NON sono ammesse modifiche)' }));
      d.appendChild(P.codeBlock(it.html, 'html'));
      host.appendChild(d);
    }
    if (it.files) {
      var df = el('details', { class: 'card' });
      df.appendChild(el('summary', { text: 'File JSON disponibili sul server' }));
      Object.keys(it.files).forEach(function (k) {
        df.appendChild(el('p', { class: 'small mb0', html: '<code class="inline-code">' + u.esc(k) + '</code>' }));
        df.appendChild(P.codeBlock(JSON.stringify(it.files[k], null, 2), 'js'));
      });
      host.appendChild(df);
    }

    /* --- editor --- */
    var lang = it.lang;
    var start = P.store.draft(it.id);
    if (start === null || start === undefined) start = it.starter || '';
    var ed = new P.Editor({ lang: lang, value: start,
      label: 'Editor ' + lang + ' per l\'esercizio ' + (it.title || it.id),
      onInput: function (v) { P.store.setDraft(it.id, v); } });
    host.appendChild(ed.el);

    /* --- barra dei comandi --- */
    var bRun = el('button', { class: 'btn btn-ghost', type: 'button',
      text: lang === 'js' ? 'Esegui' : 'Anteprima' });
    var bCheck = el('button', { class: 'btn', type: 'button', text: 'Verifica i requisiti' });
    var bReset = el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Azzera' });
    var bar = el('div', { class: 'btnrow' }, [bCheck, bRun, el('span', { class: 'spacer' }), bReset]);
    host.appendChild(bar);

    /* L'esito della verifica e l'anteprima hanno contenitori distinti: cosi'
       si puo' rieseguire il codice senza perdere l'elenco dei requisiti. */
    var checkOut = el('div');
    var runOut = el('div');
    host.appendChild(checkOut);
    host.appendChild(runOut);
    var solHost = el('div');
    host.appendChild(solHost);

    bReset.addEventListener('click', function () {
      ed.setValue(it.starter || '');
      P.store.setDraft(it.id, it.starter || '');
      checkOut.textContent = '';
      runOut.textContent = '';
    });

    /* --- esecuzione / anteprima --- */
    var liveFrame = null;
    bRun.addEventListener('click', function () {
      runOut.textContent = '';
      var box = el('div', { class: 'card' });
      runOut.appendChild(box);
      if (liveFrame) { try { liveFrame.destroy(); } catch (e) {} liveFrame = null; }

      if (lang === 'js') {
        box.appendChild(el('p', { class: 'frame-lbl', text: 'Output ed errori' }));
        var cons2 = P.sandbox.consoleBox();
        box.appendChild(cons2.el);
        box.appendChild(el('p', { class: 'frame-lbl', text: 'Pagina' }));
        P.sandbox.mount(box, { html: it.html || '', js: ed.getValue(), files: it.files || {},
          height: 200, title: 'Esecuzione del codice',
          onLog: function (e) { cons2.push(e); } })
          .then(function (f) { liveFrame = f; f.autosize(); setTimeout(f.autosize, 250); });
      } else if (lang === 'css') {
        box.appendChild(el('p', { class: 'frame-lbl', text: 'Anteprima con il tuo foglio di stile' }));
        P.sandbox.mount(box, { html: it.html || '', css: ed.getValue(), height: 240,
          title: 'Anteprima del foglio di stile' })
          .then(function (f) { liveFrame = f; f.autosize(); setTimeout(f.autosize, 250); });
      } else {
        box.appendChild(el('p', { class: 'frame-lbl', text: 'Anteprima del documento' }));
        P.sandbox.mount(box, { mode: 'html', html: ed.getValue(), height: 240,
          title: 'Anteprima del documento' })
          .then(function (f) { liveFrame = f; f.autosize(); setTimeout(f.autosize, 250); });
        var wf = P.grader.wellFormed(ed.getValue());
        if (!wf.ok) box.appendChild(el('p', { class: 'small', style: 'color:var(--bad)',
          text: 'Attenzione, il documento non è ben formato: ' + wf.msg }));
      }
    });

    /* --- correzione --- */
    var attempted = false;
    bCheck.addEventListener('click', function () {
      var code = ed.getValue();
      if (!u.norm(code)) { u.say('Scrivi qualcosa prima di verificare.'); return; }
      bCheck.disabled = true;
      bCheck.textContent = 'Verifica in corso...';
      checkOut.textContent = '';

      P.grader.grade(it, code).then(function (res) {
        bCheck.disabled = false;
        bCheck.textContent = 'Verifica i requisiti';
        attempted = true;

        var card = el('div', { class: 'card ' + (res.ok ? 'cd-ok' : (res.passed ? '' : 'cd-bad')) });
        card.appendChild(el('p', { class: 'score mt0',
          text: res.passed + ' requisiti soddisfatti su ' + res.total }));

        var ul = el('ul', { class: 'checks' });
        res.results.forEach(function (r) {
          var li = el('li', { class: r.ok ? 'y' : 'n' });
          li.appendChild(el('span', { class: 'mk', text: r.ok ? '✓' : '✗' }));
          var b = el('span', { style: 'flex:1' });
          b.innerHTML = rich(r.label);
          if (!r.ok && r.why) b.appendChild(el('span', { class: 'why', text: r.why }));
          li.appendChild(b);
          ul.appendChild(li);
        });
        card.appendChild(ul);
        checkOut.appendChild(card);

        if (res.logs && res.logs.length) {
          var lc = el('div', { class: 'card' });
          lc.appendChild(el('p', { class: 'frame-lbl', text: 'Messaggi prodotti durante l\'esecuzione' }));
          var cb = P.sandbox.consoleBox();
          res.logs.forEach(function (l) { cb.push(l); });
          lc.appendChild(cb.el);
          checkOut.appendChild(lc);
        }

        /* la soluzione compare solo dopo il tentativo */
        if (attempted && !solHost.childElementCount) {
          solHost.appendChild(solutionBox(it.solution, lang, it.why));
        }

        api.resolve(res.ok);
        u.say(res.passed + ' requisiti su ' + res.total + ' soddisfatti.');
      });
    });
  }

  P.activities = {
    quiz: renderQuiz, pair: renderPair, flash: renderFlash, fill: renderFill,
    bug: renderBug, predict: renderPredict, choice: renderChoice, plan: renderPlan,
    theory: renderTheory, code: renderCode, debug: renderCode
  };
  P.ui = { fb: fb, options: options, lockOptions: lockOptions, solutionBox: solutionBox };
})(window.PREP);
