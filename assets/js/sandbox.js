/* PrepWeb - esecuzione del codice dello studente dentro un iframe locale.
   Nessuna rete: le richieste fetch/XMLHttpRequest sono servite da file JSON
   precaricati nell'esercizio, e le chiamate effettuate vengono registrate in
   modo da poterle verificare in fase di correzione. */
(function (P) {
  'use strict';
  var el = P.u.el;
  var seq = 0;

  /* ============================================================
     1. Protezione dai cicli infiniti
     Un `while(true)` dentro un iframe della stessa origine blocca l'intera
     scheda: non basta rimuovere l'iframe. Per questo il codice dello studente
     viene strumentato inserendo una guardia all'inizio del corpo di ogni ciclo.
     ============================================================ */

  var GUARD_RT =
    'var __lgN=0,__lgT0=0,__lgL=0;\n' +
    'function __lg(){if((++__lgN&1023)!==0)return;var n=Date.now();' +
    'if(n-__lgL>150){__lgT0=n;}__lgL=n;' +
    'if(n-__lgT0>4000){throw new Error("Esecuzione interrotta dopo 4 secondi: probabile ciclo infinito.");}}\n';

  /* Scansione del sorgente saltando stringhe, template, commenti ed espressioni
     regolari, per individuare la posizione reale dei cicli. */
  function scanPositions(src) {
    var n = src.length, i = 0, out = [], prevSig = '';
    function last(k) { return src.slice(Math.max(0, i - k), i); }
    while (i < n) {
      var c = src[i], c2 = src[i] + src[i + 1];
      if (c2 === '//') { var e = src.indexOf('\n', i); i = e < 0 ? n : e; continue; }
      if (c2 === '/*') { var e2 = src.indexOf('*/', i + 2); i = e2 < 0 ? n : e2 + 2; continue; }
      if (c === '"' || c === "'" || c === '`') {
        var q = c; i++;
        while (i < n) {
          if (src[i] === '\\') { i += 2; continue; }
          if (src[i] === q) { i++; break; }
          if (q === '`' && src[i] === '$' && src[i + 1] === '{') {
            var d = 1; i += 2;
            while (i < n && d > 0) { if (src[i] === '{') d++; else if (src[i] === '}') d--; i++; }
            continue;
          }
          i++;
        }
        continue;
      }
      if (c === '/') {
        // espressione regolare oppure divisione
        var before = src.slice(0, i).replace(/\s+$/, '');
        var lastCh = before.slice(-1);
        var isRe = !(/[\w$)\]]/.test(lastCh)) || /\b(return|typeof|case|in|of|new|delete|void|instanceof)$/.test(before);
        if (isRe) {
          i++;
          while (i < n) {
            if (src[i] === '\\') { i += 2; continue; }
            if (src[i] === '[') { while (i < n && src[i] !== ']') { if (src[i] === '\\') i++; i++; } }
            if (src[i] === '/') { i++; break; }
            if (src[i] === '\n') break;
            i++;
          }
          continue;
        }
        i++; continue;
      }
      if (/[a-zA-Z_$]/.test(c)) {
        var m = /^[\w$]+/.exec(src.slice(i));
        var word = m[0];
        var pch = last(1);
        if ((word === 'while' || word === 'for' || word === 'do') && pch !== '.') {
          out.push({ word: word, at: i });
        }
        i += word.length; continue;
      }
      i++;
    }
    return out;
  }

  function matchParen(src, open) {
    var d = 0, i = open, n = src.length;
    while (i < n) {
      var c = src[i];
      if (c === '"' || c === "'" || c === '`') {
        var q = c; i++;
        while (i < n) { if (src[i] === '\\') { i += 2; continue; } if (src[i] === q) { i++; break; } i++; }
        continue;
      }
      if (src[i] + src[i + 1] === '//') { var e = src.indexOf('\n', i); i = e < 0 ? n : e; continue; }
      if (src[i] + src[i + 1] === '/*') { var e2 = src.indexOf('*/', i); i = e2 < 0 ? n : e2 + 2; continue; }
      if (c === '(') d++;
      else if (c === ')') { d--; if (d === 0) return i; }
      i++;
    }
    return -1;
  }

  function stmtEnd(src, from) {
    var d = 0, i = from, n = src.length;
    while (i < n) {
      var c = src[i];
      if (c === '"' || c === "'" || c === '`') {
        var q = c; i++;
        while (i < n) { if (src[i] === '\\') { i += 2; continue; } if (src[i] === q) { i++; break; } i++; }
        continue;
      }
      if (c === '(' || c === '[' || c === '{') d++;
      else if (c === ')' || c === ']' || c === '}') { d--; if (d < 0) return i; }
      else if (c === ';' && d === 0) return i + 1;
      i++;
    }
    return n;
  }

  function instrument(src) {
    var ins = [];
    scanPositions(src).forEach(function (h) {
      var bodyAt = -1;
      if (h.word === 'do') {
        bodyAt = h.at + 2;
      } else {
        var op = src.indexOf('(', h.at);
        if (op < 0) return;
        // fra la parola chiave e la '(' devono esserci solo spazi
        if (/[^\s]/.test(src.slice(h.at + h.word.length, op))) return;
        var cl = matchParen(src, op);
        if (cl < 0) return;
        bodyAt = cl + 1;
      }
      var k = bodyAt;
      while (k < src.length && /\s/.test(src[k])) k++;
      if (k >= src.length) return;
      if (src[k] === '{') {
        ins.push({ at: k + 1, txt: '__lg();' });
      } else if (src[k] === ';') {
        ins.push({ at: k, txt: '__lg()' });
      } else {
        var end = stmtEnd(src, k);
        ins.push({ at: k, txt: '{__lg();' });
        ins.push({ at: end, txt: '}' });
      }
    });
    if (!ins.length) return src;
    ins.sort(function (a, b) { return b.at - a.at || b.txt.length - a.txt.length; });
    var out = src;
    ins.forEach(function (x) { out = out.slice(0, x.at) + x.txt + out.slice(x.at); });
    // se la strumentazione avesse rotto la sintassi, si torna al sorgente originale
    try { new Function(out); } catch (e) {
      try { new Function(src); return src; } catch (e2) { return src; }
    }
    return out;
  }

  /* ============================================================
     2. Preludio iniettato nell'iframe
     ============================================================ */

  function prelude(frameId, files) {
    return '(function(){\n' +
      'var FILES=' + JSON.stringify(files || {}) + ';\n' +
      'var PID=' + JSON.stringify(frameId) + ';\n' +
      'window.__prepCalls=[];\n' +
      'function post(t,a){try{parent.postMessage({__prep:1,id:PID,type:t,args:a},"*");}catch(e){}}\n' +
      'function fmt(v){try{if(typeof v==="string")return v;if(v instanceof Error)return v.name+": "+v.message;' +
      'return JSON.stringify(v,function(k,x){return x instanceof Node?("<"+x.nodeName.toLowerCase()+">"):x;},1);}catch(e){return String(v);}}\n' +
      '["log","info","warn","error","debug"].forEach(function(m){var o=console[m]&&console[m].bind(console);' +
      'console[m]=function(){var a=[].slice.call(arguments).map(fmt);post(m,a);if(o)try{o.apply(null,arguments);}catch(e){}};});\n' +
      'window.addEventListener("error",function(e){post("error",[String(e.message)+(e.lineno?(" (riga "+e.lineno+")"):"")]);});\n' +
      'window.addEventListener("unhandledrejection",function(e){post("error",["Promise non gestita: "+fmt(e.reason)]);});\n' +
      'function key(u){u=String(u).split("?")[0].split("#")[0];var p=u.split("/");return p[p.length-1];}\n' +
      'function body(b){if(b==null)return null;if(typeof b==="string")return b;' +
      'if(typeof FormData!=="undefined"&&b instanceof FormData){var o={};b.forEach(function(v,k){o[k]=v;});return JSON.stringify(o);}' +
      'if(typeof URLSearchParams!=="undefined"&&b instanceof URLSearchParams)return b.toString();try{return JSON.stringify(b);}catch(e){return String(b);}}\n' +
      'function resp(st,txt){return{ok:st>=200&&st<300,status:st,statusText:st===200?"OK":"Not Found",url:"",\n' +
      'headers:{get:function(k){return String(k).toLowerCase()==="content-type"?"application/json":null;}},\n' +
      'text:function(){return Promise.resolve(txt);},json:function(){try{return Promise.resolve(JSON.parse(txt));}\n' +
      'catch(e){return Promise.reject(new SyntaxError("JSON non valido"));}}};}\n' +
      'window.fetch=function(u,init){init=init||{};var mth=String(init.method||"GET").toUpperCase();\n' +
      'var rec={url:String(u&&u.url?u.url:u),method:mth,body:body(init.body),headers:init.headers||null};\n' +
      'window.__prepCalls.push(rec);var k=key(rec.url);\n' +
      'return new Promise(function(res){setTimeout(function(){\n' +
      'if(Object.prototype.hasOwnProperty.call(FILES,k)){rec.status=200;res(resp(200,JSON.stringify(FILES[k])));}\n' +
      'else{rec.status=404;res(resp(404,JSON.stringify({error:"file non trovato: "+k})));}},10);});};\n' +
      'function FakeXHR(){this.readyState=0;this.status=0;this.responseText="";this.response="";' +
      'this.onreadystatechange=null;this.onload=null;this.onerror=null;this._l={};this._h={};}\n' +
      'FakeXHR.prototype.open=function(m,u){this._m=String(m).toUpperCase();this._u=String(u);this.readyState=1;};\n' +
      'FakeXHR.prototype.setRequestHeader=function(k,v){this._h[k]=v;};\n' +
      'FakeXHR.prototype.addEventListener=function(t,f){(this._l[t]=this._l[t]||[]).push(f);};\n' +
      'FakeXHR.prototype.getResponseHeader=function(k){return String(k).toLowerCase()==="content-type"?"application/json":null;};\n' +
      'FakeXHR.prototype.abort=function(){};\n' +
      'FakeXHR.prototype._fire=function(t){var self=this;if(this["on"+t])try{this["on"+t].call(this,{target:this});}catch(e){post("error",[fmt(e)]);}\n' +
      '(this._l[t]||[]).forEach(function(f){try{f.call(self,{target:self});}catch(e){post("error",[fmt(e)]);}});};\n' +
      'FakeXHR.prototype.send=function(b){var self=this;var rec={url:this._u,method:this._m||"GET",body:body(b),headers:this._h,via:"xhr"};\n' +
      'window.__prepCalls.push(rec);var k=key(this._u);\n' +
      'setTimeout(function(){var has=Object.prototype.hasOwnProperty.call(FILES,k);\n' +
      'self.status=has?200:404;rec.status=self.status;\n' +
      'self.responseText=has?JSON.stringify(FILES[k]):JSON.stringify({error:"file non trovato: "+k});\n' +
      'self.response=self.responseText;self.readyState=4;\n' +
      'self._fire("readystatechange");self._fire("load");},10);};\n' +
      'window.XMLHttpRequest=FakeXHR;\n' +
      GUARD_RT +
      'window.__lg=__lg;\n' +
      'post("ready",[]);\n' +
      '})();';
  }

  /* ============================================================
     3. Creazione e gestione degli iframe
     ============================================================ */

  var listeners = {};
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.__prep !== 1) return;
    var fn = listeners[d.id];
    if (fn) fn(d.type, d.args);
  });

  function buildDoc(opts) {
    var id = opts.frameId;
    var head = '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
    var pre = '<script>' + prelude(id, opts.files) + '<\/script>';
    var css = opts.css ? '<style>\n' + opts.css + '\n</style>' : '';
    var js = '';
    if (opts.js) {
      var code = opts.guard === false ? opts.js : instrument(opts.js);
      js = '<script>\ntry{\n' + code + '\n}catch(err){' +
        'console.error(err && err.message ? (err.name+": "+err.message) : String(err));}\n<\/script>';
    }

    if (opts.mode === 'html') {
      // il documento è interamente dello studente: si iniettano solo preludio e stili di supporto
      var src = String(opts.html || '');
      if (/<head[^>]*>/i.test(src)) src = src.replace(/<head([^>]*)>/i, '<head$1>' + pre);
      else if (/<html[^>]*>/i.test(src)) src = src.replace(/<html([^>]*)>/i, '<html$1><head>' + head + pre + '</head>');
      else src = pre + src;
      if (css) src += css;
      if (js) src += js;
      return src;
    }

    return '<!DOCTYPE html><html lang="it"><head>' + head + pre + css +
      '</head><body>' + (opts.html || '') + js + '</body></html>';
  }

  /* Monta un iframe e risolve quando il documento è pronto.
     Restituisce {frame, win, doc, console:[], destroy()} */
  function mount(container, opts) {
    opts = opts || {};
    var id = 'pf' + (++seq);
    opts.frameId = id;
    var logs = [];

    var frame = el('iframe', {
      class: 'frame',
      title: opts.title || 'Anteprima del codice',
      style: 'height:' + (opts.height || 240) + 'px'
    });
    if (opts.hidden) {
      frame.setAttribute('aria-hidden', 'true');
      frame.style.cssText = 'position:absolute;left:-10000px;top:0;width:900px;height:700px;border:0';
      frame.setAttribute('tabindex', '-1');
    }
    container.appendChild(frame);

    return new Promise(function (resolve) {
      var settled = false;
      listeners[id] = function (type, args) {
        if (type === 'ready') return;
        logs.push({ type: type, text: (args || []).join(' ') });
        if (opts.onLog) opts.onLog(logs[logs.length - 1], logs);
      };

      function done() {
        if (settled) return;
        settled = true;
        var win = null, doc = null;
        try { win = frame.contentWindow; doc = frame.contentDocument || (win && win.document); } catch (e) {}
        resolve({
          frame: frame, win: win, doc: doc, logs: logs, id: id,
          destroy: function () { delete listeners[id]; if (frame.parentNode) frame.parentNode.removeChild(frame); },
          autosize: function () {
            try {
              var h = doc.documentElement.scrollHeight;
              frame.style.height = P.u.clamp(h + 12, 120, 620) + 'px';
            } catch (e) {}
          }
        });
      }

      frame.addEventListener('load', function () { setTimeout(done, opts.settle === undefined ? 40 : opts.settle); });
      setTimeout(done, opts.timeout || 3500);
      try { frame.srcdoc = buildDoc(opts); }
      catch (e) { done(); }
    });
  }

  /* Riquadro console riutilizzabile. */
  function consoleBox() {
    var pre = el('pre', { class: 'console', tabindex: '0', 'aria-label': 'Output della console' });
    pre.appendChild(el('span', { class: 'c-dim', text: '// nessun output' }));
    var empty = true;
    return {
      el: pre,
      push: function (entry) {
        if (empty) { pre.textContent = ''; empty = false; }
        var cls = entry.type === 'error' ? 'c-err' : (entry.type === 'warn' ? 'c-warn' : '');
        pre.appendChild(el('span', { class: cls, text: entry.text + '\n' }));
        pre.scrollTop = pre.scrollHeight;
      },
      clear: function () {
        pre.textContent = '';
        pre.appendChild(el('span', { class: 'c-dim', text: '// nessun output' }));
        empty = true;
      }
    };
  }

  P.sandbox = { mount: mount, consoleBox: consoleBox, instrument: instrument };
})(window.PREP);
