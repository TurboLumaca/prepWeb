/* PrepWeb - utilità condivise. Script classico, nessun modulo, nessuna dipendenza. */
window.PREP = window.PREP || {};
PREP.data = PREP.data || {};

(function (P) {
  'use strict';

  function el(tag, attrs, kids) {
    var n = document.createElement(tag), k;
    if (attrs) for (k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
      var v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'on') { for (var e in v) n.addEventListener(e, v[e]); }
      else if (k === 'dataset') { for (var d in v) n.dataset[d] = v[d]; }
      else n.setAttribute(k, v === true ? '' : v);
    }
    if (kids) (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Trasforma `codice` in <code> e **testo** in <strong>, con escaping di tutto il resto. */
  function rich(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function clamp(n, a, b) { return n < a ? a : (n > b ? b : n); }

  function fmtDur(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h + 'h ' + String(m).padStart(2, '0') + 'm';
  }
  function fmtClock(ms) {
    var s = Math.max(0, Math.round(ms / 1000));
    var m = Math.floor(s / 60);
    return String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  /* Normalizza testo per confronti tolleranti. */
  function norm(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/ /g, ' ').trim().replace(/\s+/g, ' ').toLowerCase();
  }
  /* Rimuove ogni spazio: utile per confrontare valori CSS o attributi. */
  function tight(s) { return String(s || '').replace(/\s+/g, '').toLowerCase(); }

  /* Normalizzazione che ignora anche gli accenti: "piu" e "più" si equivalgono.
     Serve per confrontare le risposte aperte, dove lo studente puo' scrivere
     indifferentemente "perche" o "perché". */
  function fold(s) {
    return norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/'/g, '');
  }

  /* Shuffle deterministico a partire da un seme, così l'ordine resta stabile
     per lo stesso esercizio tra una sessione e l'altra. */
  function seeded(seed) {
    var h = 2166136261 >>> 0;
    var str = String(seed);
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return function () { h += 0x6D2B79F5; var t = h; t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function shuffle(arr, seed) {
    var a = arr.slice(), rnd = seeded(seed), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(rnd() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function letter(i) { return 'ABCDEFGHIJ'.charAt(i) || String(i + 1); }

  function say(msg) {
    var live = document.getElementById('live');
    if (live) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30); }
  }

  /* Dedentazione di un template letterale scritto indentato nel sorgente. */
  function dedent(s) {
    var lines = String(s).replace(/^\n/, '').replace(/\s+$/, '').split('\n');
    var min = Infinity;
    lines.forEach(function (l) {
      if (!l.trim()) return;
      var m = l.match(/^[ \t]*/)[0].length;
      if (m < min) min = m;
    });
    if (!isFinite(min)) min = 0;
    return lines.map(function (l) { return l.slice(min); }).join('\n');
  }

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  P.u = { el: el, esc: esc, rich: rich, clamp: clamp, fmtDur: fmtDur, fmtClock: fmtClock,
    norm: norm, tight: tight, fold: fold, shuffle: shuffle, seeded: seeded, letter: letter, say: say,
    dedent: dedent, sleep: sleep };
})(window.PREP);
