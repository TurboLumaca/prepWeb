/* PrepWeb - editor di codice con evidenziazione della sintassi.
   Implementazione: <textarea> trasparente sovrapposta a un <pre> evidenziato.
   L'altezza cresce con il contenuto, così non serve sincronizzare lo scroll e
   il comportamento su smartphone resta quello nativo (tastiera, selezione,
   annulla/ripeti, accessibilità). */
(function (P) {
  'use strict';
  var el = P.u.el;

  var LANG_LABEL = { html: 'html', css: 'css', js: 'javascript' };

  function Editor(opts) {
    opts = opts || {};
    var lang = opts.lang || 'html';
    var self = this;

    this.lang = lang;

    var ta = el('textarea', {
      class: 'ed-ta', spellcheck: 'false', autocapitalize: 'off',
      autocorrect: 'off', autocomplete: 'off', wrap: 'soft',
      'aria-label': opts.label || ('Editor di codice ' + (LANG_LABEL[lang] || lang))
    });
    var pre = el('pre', { class: 'ed-hl', 'aria-hidden': 'true' });
    var code = el('code');
    pre.appendChild(code);

    var ed = el('div', { class: 'ed' }, [pre, ta]);

    var bar = el('div', { class: 'ed-bar' }, [
      el('span', { class: 'lang', text: LANG_LABEL[lang] || lang })
    ]);
    if (opts.hint) bar.appendChild(el('span', { text: opts.hint }));
    this.bar = bar;

    var wrap = el('div', { class: 'ed-wrap' }, [bar, ed]);

    this.el = wrap;
    this.ta = ta;
    this.code = code;

    function paint() {
      // il \n finale garantisce che l'ultima riga vuota venga renderizzata
      code.innerHTML = P.hl(ta.value + '\n', lang);
    }
    this.paint = paint;

    ta.addEventListener('input', function () { paint(); if (opts.onInput) opts.onInput(ta.value); });
    ta.addEventListener('scroll', function () { ta.scrollTop = 0; });

    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey) {
        // Tab inserisce due spazi; Esc prima di Tab permette comunque di uscire
        if (self._escaped) { self._escaped = false; return; }
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd, v = ta.value;
        if (s !== en && v.slice(s, en).indexOf('\n') >= 0) {
          var a = v.lastIndexOf('\n', s - 1) + 1;
          var block = v.slice(a, en);
          var out = e.shiftKey
            ? block.replace(/^ {1,2}/gm, '')
            : block.replace(/^/gm, '  ');
          ta.value = v.slice(0, a) + out + v.slice(en);
          ta.selectionStart = a; ta.selectionEnd = a + out.length;
        } else {
          ta.value = v.slice(0, s) + '  ' + v.slice(en);
          ta.selectionStart = ta.selectionEnd = s + 2;
        }
        paint();
        if (opts.onInput) opts.onInput(ta.value);
        return;
      }
      if (e.key === 'Escape') { self._escaped = true; return; }
      self._escaped = false;

      if (e.key === 'Enter') {
        // mantiene l'indentazione della riga corrente
        var st = ta.selectionStart, va = ta.value;
        if (st !== ta.selectionEnd) return;
        var ls = va.lastIndexOf('\n', st - 1) + 1;
        var ind = (va.slice(ls, st).match(/^[ \t]*/) || [''])[0];
        var before = va.slice(0, st).replace(/[ \t]*$/, '');
        var extra = /[{([>]$/.test(before) ? '  ' : '';
        if (!ind && !extra) return;
        e.preventDefault();
        var ins = '\n' + ind + extra;
        ta.value = va.slice(0, st) + ins + va.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = st + ins.length;
        paint();
        if (opts.onInput) opts.onInput(ta.value);
      }
    });

    this.setValue(opts.value || '');
  }

  Editor.prototype.getValue = function () { return this.ta.value; };
  Editor.prototype.setValue = function (v) {
    this.ta.value = String(v === undefined || v === null ? '' : v);
    this.paint();
  };
  Editor.prototype.focus = function () { try { this.ta.focus(); } catch (e) {} };
  Editor.prototype.addBarItem = function (node) { this.bar.appendChild(node); };

  P.Editor = Editor;
})(window.PREP);
