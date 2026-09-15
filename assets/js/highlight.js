/* PrepWeb - evidenziazione della sintassi.
   Requisito di correttezza: la funzione deve restituire ESATTAMENTE gli stessi
   caratteri dell'input (solo con escaping ed eventuali <span>), altrimenti il
   testo evidenziato non si sovrappone più alla textarea dell'editor. */
(function (P) {
  'use strict';
  var esc = P.u.esc;

  function span(cls, txt) { return '<span class="tk-' + cls + '">' + esc(txt) + '</span>'; }

  /* ---------------- HTML ---------------- */
  function hlHtml(src) {
    var out = '', i = 0, n = src.length;
    while (i < n) {
      var lt = src.indexOf('<', i);
      if (lt < 0) { out += esc(src.slice(i)); break; }
      if (lt > i) out += esc(src.slice(i, lt));

      if (src.startsWith('<!--', lt)) {
        var end = src.indexOf('-->', lt + 4);
        end = end < 0 ? n : end + 3;
        out += span('com', src.slice(lt, end)); i = end; continue;
      }
      if (src.startsWith('<!', lt)) {
        var e2 = src.indexOf('>', lt); e2 = e2 < 0 ? n : e2 + 1;
        out += span('doc', src.slice(lt, e2)); i = e2; continue;
      }
      var m = /^<\/?([a-zA-Z][\w:.-]*)/.exec(src.slice(lt));
      if (!m) { out += esc('<'); i = lt + 1; continue; }

      // apertura tag + nome
      out += span('tag', m[0]);
      var j = lt + m[0].length;
      // attributi fino a > (rispettando le virgolette)
      while (j < n && src[j] !== '>') {
        var c = src[j];
        if (/\s/.test(c)) { out += esc(c); j++; continue; }
        if (c === '/') { out += span('tag', '/'); j++; continue; }
        if (c === '=') { out += span('punct', '='); j++; continue; }
        if (c === '"' || c === "'") {
          var q = src.indexOf(c, j + 1);
          q = q < 0 ? n : q + 1;
          out += span('str', src.slice(j, q)); j = q; continue;
        }
        var am = /^[^\s=>/"']+/.exec(src.slice(j));
        if (!am) { out += esc(c); j++; continue; }
        // valore non quotato subito dopo un '='
        var prev = src.slice(lt, j).replace(/\s+$/, '');
        out += span(prev.endsWith('=') ? 'str' : 'attr', am[0]);
        j += am[0].length;
      }
      if (j < n) { out += span('tag', '>'); j++; }
      i = j;

      // contenuto grezzo di script/style: evidenziato con il rispettivo linguaggio
      var name = m[1].toLowerCase();
      if (!m[0].startsWith('</') && (name === 'script' || name === 'style')) {
        var close = src.toLowerCase().indexOf('</' + name, i);
        if (close < 0) close = n;
        var body = src.slice(i, close);
        out += (name === 'script' ? hlJs(body) : hlCss(body));
        i = close;
      }
    }
    return out;
  }

  /* -------- motore generico a regex alternate (nessun carattere perso) -------- */
  function runner(re, pick) {
    return function (src) {
      var out = '', last = 0, m;
      re.lastIndex = 0;
      while ((m = re.exec(src)) !== null) {
        if (m[0] === '') { re.lastIndex++; continue; }
        if (m.index > last) out += esc(src.slice(last, m.index));
        var cls = pick(m);
        out += cls ? span(cls, m[0]) : esc(m[0]);
        last = re.lastIndex;
      }
      out += esc(src.slice(last));
      return out;
    };
  }

  /* ---------------- CSS ---------------- */
  var CSS_RE = new RegExp([
    '(\\/\\*[\\s\\S]*?(?:\\*\\/|$))',                     // 1 commento
    '("(?:[^"\\\\\\n]|\\\\.)*"|\'(?:[^\'\\\\\\n]|\\\\.)*\')', // 2 stringa
    '(@[\\w-]+)',                                          // 3 at-rule
    '([-a-zA-Z]+)(?=\\s*:[^:])',                           // 4 proprietà
    '(#[0-9a-fA-F]{3,8}\\b|\\b\\d*\\.?\\d+(?:px|em|rem|%|s|ms|vh|vw|fr|deg|pt|ch|ex)?\\b)', // 5 numero
    '(::?[a-zA-Z-]+)',                                     // 6 pseudo
    '([{}();,])'                                           // 7 punteggiatura
  ].join('|'), 'g');

  var hlCss = runner(CSS_RE, function (m) {
    if (m[1]) return 'com'; if (m[2]) return 'str'; if (m[3]) return 'kw';
    if (m[4]) return 'prop'; if (m[5]) return 'num'; if (m[6]) return 'tag';
    if (m[7]) return 'punct'; return null;
  });

  /* ---------------- JavaScript ---------------- */
  var JS_KW = 'const|let|var|function|return|if|else|for|while|do|switch|case|default|break|continue|' +
    'new|class|extends|super|this|typeof|instanceof|try|catch|finally|throw|async|await|of|in|' +
    'delete|void|yield|null|undefined|true|false|import|export|static|get|set';

  var JS_RE = new RegExp([
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?(?:\\*\\/|$))',        // 1 commento
    '(`(?:[^`\\\\]|\\\\[\\s\\S])*`?)',                     // 2 template
    '("(?:[^"\\\\\\n]|\\\\.)*"?|\'(?:[^\'\\\\\\n]|\\\\.)*\'?)', // 3 stringa
    '\\b(' + JS_KW + ')\\b',                               // 4 keyword
    '\\b(\\d*\\.?\\d+)\\b',                                // 5 numero
    '([A-Za-z_$][\\w$]*)(?=\\s*\\()',                      // 6 chiamata
    '(\\.[A-Za-z_$][\\w$]*)',                              // 7 proprietà
    '([{}()\\[\\];,])'                                     // 8 punteggiatura
  ].join('|'), 'g');

  var hlJs = runner(JS_RE, function (m) {
    if (m[1]) return 'com'; if (m[2]) return 'str'; if (m[3]) return 'str';
    if (m[4]) return 'kw'; if (m[5]) return 'num'; if (m[6]) return 'fn';
    if (m[7]) return 'prop'; if (m[8]) return 'punct'; return null;
  });

  function hl(src, lang) {
    src = String(src === undefined || src === null ? '' : src);
    try {
      if (lang === 'html') return hlHtml(src);
      if (lang === 'css') return hlCss(src);
      if (lang === 'js' || lang === 'javascript') return hlJs(src);
    } catch (e) { /* in caso di problemi si ripiega sul testo semplice */ }
    return esc(src);
  }

  /* Blocco di codice statico, con o senza numeri di riga. */
  function codeBlock(src, lang, opts) {
    opts = opts || {};
    var pre = P.u.el('pre', { class: 'code' + (opts.lines ? ' lines' : '') });
    var code = P.u.el('code');
    if (!opts.lines) {
      code.innerHTML = hl(src, lang);
      pre.appendChild(code);
      return pre;
    }
    var lines = String(src).split('\n');
    lines.forEach(function (l, idx) {
      var s = P.u.el('span', { class: 'ln' });
      s.dataset.n = String(idx + 1);
      s.innerHTML = hl(l, lang) || '&nbsp;';
      code.appendChild(s);
    });
    pre.appendChild(code);
    return pre;
  }

  P.hl = hl;
  P.codeBlock = codeBlock;
})(window.PREP);
