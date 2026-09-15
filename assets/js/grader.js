/* PrepWeb - motore di correzione.
   Il codice dello studente NON viene confrontato con una soluzione attesa:
   per ogni esercizio esiste una checklist di requisiti verificabili, e ogni
   requisito è una funzione che ispeziona la struttura reale prodotta.
     - HTML : si analizza il DOM risultante (elementi, annidamento, attributi,
              associazioni di accessibilità).
     - CSS  : il foglio di stile viene applicato in un iframe e si verificano
              sia le dichiarazioni (CSSOM) sia gli stili calcolati.
     - JS   : il codice viene eseguito e si verifica il comportamento osservabile.
*/
(function (P) {
  'use strict';
  var u = P.u;

  var VOID = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];
  var OPTIONAL_CLOSE = ['li','dt','dd','p','option','thead','tbody','tfoot','tr','td','th','head','body','html'];

  /* -------- elementi di supporto comuni a tutti i contesti -------- */
  function commonHelpers(ctx) {
    ctx.q = function (sel, root) { try { return (root || ctx.doc).querySelector(sel); } catch (e) { return null; } };
    ctx.qa = function (sel, root) { try { return Array.prototype.slice.call((root || ctx.doc).querySelectorAll(sel)); } catch (e) { return []; } };
    ctx.text = function (n) { return n ? u.norm(n.textContent) : ''; };
    ctx.norm = u.norm;
    ctx.tight = u.tight;
    ctx.attr = function (n, a) { return n && n.hasAttribute(a) ? n.getAttribute(a) : null; };

    /* Nome accessibile calcolato secondo l'ordine di precedenza usuale. */
    ctx.accName = function (n) {
      if (!n) return '';
      var d = n.ownerDocument || ctx.doc;
      var lb = n.getAttribute('aria-labelledby');
      if (lb) {
        var t = lb.split(/\s+/).map(function (id) {
          var r = d.getElementById(id); return r ? r.textContent : '';
        }).join(' ');
        if (u.norm(t)) return u.norm(t);
      }
      if (u.norm(n.getAttribute('aria-label'))) return u.norm(n.getAttribute('aria-label'));

      var tag = n.tagName.toLowerCase();
      if (tag === 'img' || tag === 'area') {
        return n.hasAttribute('alt') ? u.norm(n.getAttribute('alt')) : '';
      }
      if (tag === 'input' || tag === 'select' || tag === 'textarea') {
        var ty = (n.getAttribute('type') || '').toLowerCase();
        if (tag === 'input' && (ty === 'submit' || ty === 'reset' || ty === 'button')) {
          if (n.hasAttribute('value')) return u.norm(n.getAttribute('value'));
          if (ty === 'submit') return 'submit';
          if (ty === 'reset') return 'reset';
        }
        if (n.id) {
          var l = d.querySelector('label[for="' + cssEscape(n.id) + '"]');
          if (l) return u.norm(l.textContent);
        }
        var anc = n.closest ? n.closest('label') : null;
        if (anc) return u.norm(anc.textContent);
        if (n.hasAttribute('title')) return u.norm(n.getAttribute('title'));
        return '';
      }
      if (u.norm(n.textContent)) return u.norm(n.textContent);
      if (n.hasAttribute('title')) return u.norm(n.getAttribute('title'));
      return '';
    };

    /* true se il controllo ha una <label> realmente associata (non solo un titolo). */
    ctx.hasLabel = function (n) {
      if (!n) return false;
      var d = n.ownerDocument || ctx.doc;
      if (n.id && d.querySelector('label[for="' + cssEscape(n.id) + '"]')) return true;
      if (n.closest && n.closest('label')) return true;
      return false;
    };

    /* Controlli di form "veri", esclusi i pulsanti. */
    ctx.fields = function (root) {
      return ctx.qa('input,select,textarea', root).filter(function (n) {
        var ty = (n.getAttribute('type') || '').toLowerCase();
        return ['submit', 'reset', 'button', 'image', 'hidden'].indexOf(ty) < 0;
      });
    };

    /* Testo della <legend> del fieldset che contiene l'elemento. */
    ctx.legendOf = function (n) {
      var fs = n && n.closest ? n.closest('fieldset') : null;
      if (!fs) return null;
      var lg = fs.querySelector(':scope > legend') || fs.querySelector('legend');
      return lg ? u.norm(lg.textContent) : null;
    };

    ctx.byName = function (name, type) {
      return ctx.qa('input[name="' + cssEscape(name) + '"]').filter(function (n) {
        return !type || (n.getAttribute('type') || '').toLowerCase() === type;
      });
    };

    /* Gruppi di radio/checkbox presenti nel documento, raggruppati per name. */
    ctx.groups = function (type) {
      var map = {};
      ctx.qa('input[type="' + type + '"]').forEach(function (n) {
        var nm = n.getAttribute('name') || '';
        (map[nm] = map[nm] || []).push(n);
      });
      return map;
    };

    ctx.src = ctx.raw || '';
    ctx.rx = function (re) { try { return re.test(ctx.src); } catch (e) { return false; } };
  }

  function cssEscape(s) { return String(s).replace(/["\\]/g, '\\$&'); }

  /* Controllo di buona formazione: tag chiusi e annidati correttamente. */
  function wellFormed(src) {
    var re = /<\/?([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g, m, stack = [];
    var clean = String(src).replace(/<!--[\s\S]*?-->/g, '').replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
    while ((m = re.exec(clean))) {
      var name = m[1].toLowerCase();
      if (m[0].charAt(1) === '/') {
        if (!stack.length) return { ok: false, msg: 'chiusura </' + name + '> senza apertura' };
        var i = stack.length - 1;
        while (i >= 0 && stack[i] !== name && OPTIONAL_CLOSE.indexOf(stack[i]) >= 0) i--;
        if (i < 0 || stack[i] !== name) {
          return { ok: false, msg: '</' + name + '> chiude mentre è ancora aperto <' + stack[stack.length - 1] + '>' };
        }
        stack.length = i;
      } else {
        if (VOID.indexOf(name) >= 0 || /\/\s*$/.test(m[2])) continue;
        if (name === 'script' || name === 'style') {
          var close = clean.toLowerCase().indexOf('</' + name, re.lastIndex);
          if (close < 0) return { ok: false, msg: '<' + name + '> non chiuso' };
          re.lastIndex = close;
          continue;
        }
        stack.push(name);
      }
    }
    var left = stack.filter(function (t) { return OPTIONAL_CLOSE.indexOf(t) < 0; });
    if (left.length) return { ok: false, msg: 'tag non chiuso: <' + left[left.length - 1] + '>' };
    return { ok: true, msg: '' };
  }

  /* ============================ contesto HTML ============================ */
  function htmlContext(ex, code) {
    var doc = new DOMParser().parseFromString(code, 'text/html');
    var ctx = { lang: 'html', doc: doc, raw: code };
    commonHelpers(ctx);
    ctx.hasDoctype = /^\s*<!doctype\s+html\s*>/i.test(code);
    ctx.wellFormed = function () { return wellFormed(code); };
    ctx.docLang = (doc.documentElement && doc.documentElement.getAttribute('lang')) || '';
    ctx.title = u.norm(doc.title || '');
    return Promise.resolve(ctx);
  }

  /* ============================ contesto CSS ============================ */
  function cssContext(ex, code, host) {
    return P.sandbox.mount(host, {
      hidden: true, css: code, html: ex.html || '', files: ex.files || {}, timeout: 3000
    }).then(function (f) {
      var doc = f.doc, win = f.win;
      var ctx = { lang: 'css', doc: doc, win: win, frame: f, raw: code };
      commonHelpers(ctx);

      var probe = null;
      function getProbe() {
        if (!probe) {
          probe = doc.createElement('span');
          probe.style.display = 'none';
          doc.body.appendChild(probe);
        }
        return probe;
      }
      /* Riduce qualunque notazione di colore alla forma rgb() canonica. */
      ctx.color = function (v) {
        if (!v) return '';
        var p = getProbe();
        p.style.color = '';
        p.style.color = String(v);
        if (!p.style.color) return u.tight(v);
        return u.tight(win.getComputedStyle(p).color);
      };
      ctx.sameColor = function (a, b) {
        if (!a || !b) return false;
        return ctx.color(a) === ctx.color(b);
      };

      ctx.computed = function (sel, prop) {
        var n = ctx.q(sel);
        if (!n) return '';
        try { return win.getComputedStyle(n).getPropertyValue(prop).trim(); } catch (e) { return ''; }
      };
      ctx.computedOn = function (node, prop) {
        if (!node) return '';
        try { return win.getComputedStyle(node).getPropertyValue(prop).trim(); } catch (e) { return ''; }
      };

      /* Tutte le regole di stile del documento, inclusi i blocchi @media. */
      function allRules() {
        var out = [];
        function walk(list) {
          for (var i = 0; i < list.length; i++) {
            var r = list[i];
            if (r.type === 1 /* STYLE_RULE */) out.push(r);
            else if (r.cssRules) walk(r.cssRules);
          }
        }
        try {
          for (var s = 0; s < doc.styleSheets.length; s++) {
            try { walk(doc.styleSheets[s].cssRules); } catch (e) {}
          }
        } catch (e) {}
        return out;
      }
      ctx.rules = allRules;

      function parts(sel) { return String(sel).split(',').map(function (s) { return s.trim(); }).filter(Boolean); }

      /* Ultimo valore dichiarato per una proprietà sulle regole che si applicano
         all'elemento nello stato indicato (stato '' = stato base). */
      function declaredOn(node, prop, state) {
        if (!node) return '';
        var found = '';
        allRules().forEach(function (r) {
          var hit = parts(r.selectorText).some(function (s) {
            if (state) {
              if (s.toLowerCase().indexOf(state) < 0) return false;
              s = s.replace(new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
              if (!s.trim()) return false;
            }
            try { return node.matches(s); } catch (e) { return false; }
          });
          if (!hit) return;
          var v = r.style.getPropertyValue(prop);
          if (v) found = v.trim();
        });
        return found;
      }
      ctx.declared = function (sel, prop) { return declaredOn(ctx.q(sel), prop, ''); };
      ctx.declaredOn = function (node, prop) { return declaredOn(node, prop, ''); };
      ctx.hover = function (sel, prop) { return declaredOn(ctx.q(sel), prop, ':hover'); };
      ctx.hoverOn = function (node, prop) { return declaredOn(node, prop, ':hover'); };

      /* Valore dichiarato o, in mancanza, valore calcolato. */
      ctx.value = function (sel, prop) {
        return ctx.declared(sel, prop) || ctx.computed(sel, prop);
      };

      /* Scompone un box-shadow qualunque sia l'ordine dei componenti.
         Il colore va estratto e RIMOSSO prima di leggere i numeri: altrimenti i
         canali di un rgb(192, 192, 192) verrebbero scambiati per scostamenti. */
      ctx.shadow = function (sel) {
        var v = ctx.computed(sel, 'box-shadow') || ctx.declared(sel, 'box-shadow');
        if (!v || v === 'none') return null;
        var raw = v, col = '', m;
        if ((m = v.match(/rgba?\([^)]*\)/))) { col = m[0]; v = v.replace(m[0], ' '); }
        else if ((m = v.match(/#[0-9a-fA-F]{3,8}\b/))) { col = m[0]; v = v.replace(m[0], ' '); }
        else {
          var words = (v.match(/\b[a-zA-Z]{3,}\b/g) || []).filter(function (w) { return !/^(inset|none)$/i.test(w); });
          if (words.length) { col = words[0]; v = v.replace(words[0], ' '); }
        }
        var nums = (v.match(/-?\d*\.?\d+(?:px|em|rem|pt)?/g) || []).map(parseFloat)
          .filter(function (n) { return !isNaN(n); });
        return { raw: raw, color: col, inset: /inset/i.test(raw),
          x: nums[0], y: nums[1], blur: nums[2], spread: nums[3] };
      };

      ctx.px = function (v) { var n = parseFloat(v); return isNaN(n) ? null : n; };
      return ctx;
    });
  }

  /* ============================ contesto JS ============================ */
  function jsContext(ex, code, host) {
    return P.sandbox.mount(host, {
      hidden: true, html: ex.html || '', js: code, css: ex.css || '',
      files: ex.files || {}, timeout: 3500
    }).then(function (f) {
      var doc = f.doc, win = f.win;
      var ctx = { lang: 'js', doc: doc, win: win, frame: f, raw: code, logs: f.logs };
      commonHelpers(ctx);

      ctx.calls = function () { try { return win.__prepCalls || []; } catch (e) { return []; } };
      ctx.callTo = function (nameRe, method) {
        return ctx.calls().filter(function (c) {
          var okU = nameRe instanceof RegExp ? nameRe.test(c.url) : String(c.url).indexOf(nameRe) >= 0;
          return okU && (!method || c.method === String(method).toUpperCase());
        });
      };
      ctx.errors = function () { return f.logs.filter(function (l) { return l.type === 'error'; }); };

      ctx.click = function (sel) {
        var n = typeof sel === 'string' ? ctx.q(sel) : sel;
        if (!n) return false;
        try { n.click(); } catch (e) { return false; }
        return true;
      };
      ctx.setValue = function (sel, v) {
        var n = typeof sel === 'string' ? ctx.q(sel) : sel;
        if (!n) return false;
        n.value = String(v);
        try {
          n.dispatchEvent(new win.Event('input', { bubbles: true }));
          n.dispatchEvent(new win.Event('change', { bubbles: true }));
        } catch (e) {}
        return true;
      };
      ctx.wait = u.sleep;
      /* Attende che una condizione diventi vera, con scadenza. */
      ctx.until = function (fn, ms) {
        var end = Date.now() + (ms || 1200);
        return new Promise(function (res) {
          (function loop() {
            var v = false;
            try { v = fn(); } catch (e) { v = false; }
            if (v) return res(true);
            if (Date.now() > end) return res(false);
            setTimeout(loop, 30);
          })();
        });
      };
      return ctx;
    });
  }

  /* ============================ esecuzione ============================ */

  function buildContext(ex, code, host) {
    if (ex.lang === 'css') return cssContext(ex, code, host);
    if (ex.lang === 'js') return jsContext(ex, code, host);
    return htmlContext(ex, code);
  }

  /* Corregge un esercizio di scrittura. Restituisce l'esito requisito per requisito. */
  function grade(ex, code) {
    var host = document.createElement('div');
    host.style.cssText = 'position:absolute;left:-10000px;top:0;width:0;height:0;overflow:hidden';
    document.body.appendChild(host);

    var cleanup = function () {
      try { if (host.parentNode) host.parentNode.removeChild(host); } catch (e) {}
    };

    return buildContext(ex, code, host).then(function (ctx) {
      var chain = Promise.resolve();
      if (typeof ex.run === 'function') {
        chain = chain.then(function () { return ex.run(ctx); }).catch(function () {});
      }
      var results = [];
      (ex.checks || []).forEach(function (c) {
        chain = chain.then(function () {
          return Promise.resolve()
            .then(function () { return c.test(ctx); })
            .then(function (r) {
              var ok = r === true || (r && r.ok === true);
              results.push({ id: c.id, label: c.label, ok: ok, why: (r && r.why) || '' });
            })
            .catch(function (err) {
              results.push({ id: c.id, label: c.label, ok: false,
                why: 'la verifica non ha potuto essere completata (' + (err && err.message ? err.message : err) + ')' });
            });
        });
      });
      return chain.then(function () {
        var passed = results.filter(function (r) { return r.ok; }).length;
        var out = {
          results: results, passed: passed, total: results.length,
          ok: results.length > 0 && passed === results.length,
          logs: ctx.logs || []
        };
        cleanup();
        return out;
      });
    }).catch(function (err) {
      cleanup();
      return { results: [{ id: 'err', label: 'Esecuzione del codice', ok: false,
        why: String(err && err.message ? err.message : err) }], passed: 0, total: 1, ok: false, logs: [] };
    });
  }

  P.grader = { grade: grade, wellFormed: wellFormed };
})(window.PREP);
