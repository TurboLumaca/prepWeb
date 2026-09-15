/* PrepWeb - catalogo delle attività, organizzate nelle tre fasi.
   La bilanciatura fra i linguaggi segue il peso che hanno nel compito d'esame:
   HTML+accessibilità 7 punti, CSS 6, teoria 5, JavaScript 7. */
(function (P) {
  'use strict';

  function byLang(pool, lang) {
    return (P.data[pool] || []).filter(function (x) { return x.lang === lang; });
  }
  function byIds(pool, ids) {
    var m = {};
    (P.data[pool] || []).forEach(function (x) { m[x.id] = x; });
    return ids.map(function (i) { return m[i]; }).filter(Boolean);
  }
  function all(pool) { return (P.data[pool] || []).slice(); }

  var A = function (id, type, title, desc, items, extra) {
    var a = { id: id, type: type, title: title, desc: desc, items: items };
    if (extra) for (var k in extra) a[k] = extra[k];
    return a;
  };

  var phases = [
    {
      n: 1,
      title: 'Conoscenza di base',
      tag: 'Riconoscere e richiamare',
      desc: 'Riconoscimento e richiamo, per costruire memoria di sintassi. Sono esercizi brevi: si fanno benissimo dal telefono.',
      activities: [
        A('q-html', 'quiz', 'Quiz - HTML e accessibilità', 'Sintassi, attributi e requisiti WCAG di livello A.', byLang('quiz', 'html')),
        A('q-css', 'quiz', 'Quiz - CSS', 'Selettori, box model, colori, cascata.', byLang('quiz', 'css')),
        A('q-js', 'quiz', 'Quiz - JavaScript', 'DOM, eventi, richieste asincrone, linguaggio.', byLang('quiz', 'js')),
        A('q-teoria', 'quiz', 'Quiz - Teoria', 'I concetti che ricorrono nelle domande aperte d\'esame.', byLang('quiz', 'teoria')),

        A('pair', 'pair', 'Riconoscimento', 'Associare tag, attributi, proprietà e funzioni alla loro descrizione, e viceversa.', all('pairs')),

        A('fl-html', 'flash', 'Flashcard - HTML', 'Le carte sbagliate tornano finche\' non le sai.', byLang('flash', 'html')),
        A('fl-css', 'flash', 'Flashcard - CSS', 'Le carte sbagliate tornano finche\' non le sai.', byLang('flash', 'css')),
        A('fl-js', 'flash', 'Flashcard - JavaScript', 'Le carte sbagliate tornano finche\' non le sai.', byLang('flash', 'js')),
        A('fl-teoria', 'flash', 'Flashcard - Teoria', 'Definizioni da avere pronte per le domande aperte.', byLang('flash', 'teoria')),

        A('fi-html', 'fill', 'Completamento - HTML', 'Riempire i buchi scegliendo dalle tessere proposte.', byLang('fill', 'html')),
        A('fi-css', 'fill', 'Completamento - CSS', 'Riempire i buchi scegliendo dalle tessere proposte.', byLang('fill', 'css')),
        A('fi-js', 'fill', 'Completamento - JavaScript', 'Riempire i buchi scegliendo dalle tessere proposte.', byLang('fill', 'js')),

        A('bu-html', 'bug', 'Trova l\'errore - HTML', 'Indicare la riga sbagliata e il motivo.', byLang('bugs', 'html')),
        A('bu-css', 'bug', 'Trova l\'errore - CSS', 'Indicare la riga sbagliata e il motivo.', byLang('bugs', 'css')),
        A('bu-js', 'bug', 'Trova l\'errore - JavaScript', 'Indicare la riga sbagliata e il motivo.', byLang('bugs', 'js'))
      ]
    },
    {
      n: 2,
      title: 'Ragionamento',
      tag: 'Prevedere, valutare, correggere',
      desc: 'Ragionare sul comportamento del codice. Le predizioni vengono poi verificate eseguendo davvero il frammento.',
      activities: [
        A('pr-html', 'predict', 'Predizione - HTML', 'Che cosa produce il parser, che cosa sente chi usa uno screen reader.', byLang('predict', 'html')),
        A('pr-css', 'predict', 'Predizione - CSS', 'Come viene reso il frammento, e perché.', byLang('predict', 'css')),
        A('pr-js', 'predict', 'Predizione - JavaScript', 'Che cosa stampa la console, e in quale ordine.', byLang('predict', 'js')),

        A('db-html', 'debug', 'Debug - HTML', 'Codice valido ma non conforme alla specifica: trovare e correggere.', byLang('debug', 'html')),
        A('db-css', 'debug', 'Debug - CSS', 'Codice valido ma non conforme alla specifica: trovare e correggere.', byLang('debug', 'css')),
        A('db-js', 'debug', 'Debug - JavaScript', 'Codice valido ma non conforme alla specifica: trovare e correggere.', byLang('debug', 'js')),

        A('ch-html', 'choice', 'Scelte progettuali - HTML', 'Fra due o più implementazioni corrette, quale rispetta la specifica.', byLang('choice', 'html')),
        A('ch-cssjs', 'choice', 'Scelte progettuali - CSS e JavaScript', 'Semantica, accessibilità e conformità alla consegna.',
          byLang('choice', 'css').concat(byLang('choice', 'js'))),

        A('plan', 'plan', 'Dal requisito agli elementi', 'Tradurre una consegna nell\'elenco di elementi e attributi necessari, senza scrivere codice.', all('plan')),

        A('th-css', 'theory', 'Teoria aperta - Fogli di stile', 'Domande in stile esame. Cascading, specificità, ereditarietà, box model.',
          byIds('theory', ['th001', 'th002', 'th003', 'th009', 'th013', 'th018'])),
        A('th-a11y', 'theory', 'Teoria aperta - Accessibilità', 'WCAG 2.0, label, tabelle, tastiera.',
          byIds('theory', ['th004', 'th005', 'th006', 'th007', 'th020'])),
        A('th-html', 'theory', 'Teoria aperta - HTML', 'Semantica, validità, form, attributi identificativi.',
          byIds('theory', ['th008', 'th014', 'th015', 'th016', 'th019'])),
        A('th-js', 'theory', 'Teoria aperta - JavaScript', 'DOM, asincronia, GET e POST, eventi.',
          byIds('theory', ['th010', 'th011', 'th012', 'th017']))
      ]
    },
    {
      n: 3,
      title: 'Produzione di codice',
      tag: 'Scrivere a memoria',
      desc: 'Scrittura vera, in ordine crescente di ampiezza. Il codice viene eseguito e verificato requisito per requisito.',
      activities: [
        A('mi-html', 'code', 'Micro - HTML', 'Un singolo elemento che soddisfi una specifica puntuale.', byLang('micro', 'html'), { size: 'micro' }),
        A('mi-css', 'code', 'Micro - CSS', 'Una regola che soddisfi una specifica puntuale.', byLang('micro', 'css'), { size: 'micro' }),
        A('mi-js', 'code', 'Micro - JavaScript', 'Poche righe che producano un comportamento preciso.', byLang('micro', 'js'), { size: 'micro' }),

        A('bk-html', 'code', 'Blocchi - HTML', 'Una sezione di form, una tabella, un documento completo.', byLang('blocks', 'html'), { size: 'medio' }),
        A('bk-css', 'code', 'Blocchi - CSS', 'Un foglio di stile che rispetti un elenco di vincoli.', byLang('blocks', 'css'), { size: 'medio' }),
        A('bk-js', 'code', 'Blocchi - JavaScript', 'Una funzione completa, dalla richiesta alla costruzione del DOM.', byLang('blocks', 'js'), { size: 'medio' }),

        A('fn-html', 'code', 'Esame - Esercizio HTML', 'Consegna in stile esame, 7 punti, cronometro attivo.', byIds('final', ['fn001']), { size: 'esame', exam: true }),
        A('fn-css', 'code', 'Esame - Esercizio CSS', 'Consegna in stile esame, 6 punti, cronometro attivo.', byIds('final', ['fn002']), { size: 'esame', exam: true }),
        A('fn-js', 'code', 'Esame - Esercizio JavaScript', 'Consegna in stile esame, 7 punti, cronometro attivo.', byIds('final', ['fn003']), { size: 'esame', exam: true })
      ]
    }
  ];

  var index = {};
  phases.forEach(function (ph) {
    ph.itemIds = [];
    ph.activities.forEach(function (a) {
      a.phase = ph.n;
      a.itemIds = a.items.map(function (i) { return i.id; });
      ph.itemIds = ph.itemIds.concat(a.itemIds);
      index[a.id] = a;
    });
  });

  function activity(id) { return index[id] || null; }
  function phase(n) { return phases[n - 1] || null; }

  /* Una fase è completata quando ogni suo esercizio è stato risolto almeno una volta. */
  function phaseDone(n) {
    var ph = phase(n);
    if (!ph) return false;
    return ph.itemIds.every(function (id) { return P.store.isDone(id); });
  }
  function phaseUnlocked(n) {
    if (n === 1) return true;
    return phaseDone(n - 1);
  }

  /* Elenco degli esercizi sbagliati almeno una volta, per il ripasso mirato. */
  function weak() {
    var out = [];
    phases.forEach(function (ph) {
      ph.activities.forEach(function (a) {
        a.items.forEach(function (it) {
          var r = P.store.get(it.id);
          if (r && r.w > 0) out.push({ act: a, item: it, rec: r });
        });
      });
    });
    return out.sort(function (x, y) { return y.rec.w - x.rec.w; });
  }

  P.catalog = { phases: phases, activity: activity, phase: phase,
    phaseDone: phaseDone, phaseUnlocked: phaseUnlocked, weak: weak, index: index };
})(window.PREP);
