/* Fase 3 - esercizi finali in stile esame. Ampiezza ridotta rispetto al compito
   reale, ma consegna formulata nello stesso modo e cronometro attivo. */
PREP.data.final = [

{id:'fn001',lang:'html',topic:'html-form',points:7,minutes:35,
 title:'ESERCIZIO N. 1 (7 punti)',
 brief:'Scrivere il codice HTML5 valido, ben formato, accessibile e semanticamente corretto per realizzare un documento che contenga una intestazione di primo livello "Prenotazione Treno" e un form diviso in due parti:',
 bullets:[
  'La prima parte, dal titolo "Dati Passeggero", deve consentire i seguenti input: Nome, Cognome, Data di nascita.',
  'La seconda parte, dal titolo "Dati Viaggio", deve consentire i seguenti input: Stazione di partenza, Stazione di arrivo, numero di biglietti (massimo consentito: 4), Data di partenza.',
  'Un insieme di controlli per consentire la scelta tra viaggio andata e ritorno e viaggio di sola andata.',
  'Un insieme di controlli per consentire la scelta tra: seconda classe, prima classe, business.',
  'Uno o più controlli per consentire l\'indicazione di posto vicino al finestrino.',
  'Bottoni di Submit e Cancella della form'],
 note:'Il documento deve essere HTML5 accessibile secondo le WCAG2.0 a livello A (la validazione con tool automatici dell\'accessibilità non è di per se\' sufficiente).',
 starter:'<!DOCTYPE html>\n<html lang="it">\n<head>\n  <meta charset="utf-8">\n  <title></title>\n</head>\n<body>\n\n</body>\n</html>',
 checks:[
  {id:'a',label:'Documento HTML5 con doctype, `lang="it"`, codifica e `<title>` non vuoto',
   test:c=>c.hasDoctype&&c.norm(c.docLang).indexOf('it')===0&&!!c.q('meta[charset]')&&!!c.title},
  {id:'b',label:'Esiste una sola intestazione di primo livello, con testo "Prenotazione Treno"',
   test:c=>{var h=c.qa('h1');return h.length===1&&c.norm(h[0].textContent)==='prenotazione treno';}},
  {id:'c',label:'Esiste una sola `<form>`',
   test:c=>{var f=c.qa('form').length;return f===1||{ok:false,why:'form trovate: '+f};}},
  {id:'d',label:'La form è divisa in parti, con `<fieldset>` provvisti di `<legend>`',
   test:c=>{var f=c.qa('form fieldset');
     return f.length>=2&&f.every(x=>{var l=x.querySelector('legend');return !!l&&!!c.norm(l.textContent);});}},
  {id:'e',label:'Esiste la parte "Dati Passeggero" con Nome, Cognome e Data di nascita',
   test:c=>{var f=c.qa('fieldset').find(x=>c.norm((x.querySelector('legend')||{}).textContent||'').indexOf('dati passeggero')>=0);
     if(!f)return {ok:false,why:'nessun fieldset con legend "Dati Passeggero"'};
     var g=c.fields(f).map(i=>c.accName(i));
     return ['nome','cognome','data di nascita'].every(n=>g.some(x=>x.indexOf(n)>=0))||
       {ok:false,why:'campi trovati: '+g.join(', ')};}},
  {id:'f',label:'Esiste la parte "Dati Viaggio" con stazione di partenza, di arrivo e data di partenza',
   test:c=>{var f=c.qa('fieldset').find(x=>c.norm((x.querySelector('legend')||{}).textContent||'').indexOf('dati viaggio')>=0);
     if(!f)return {ok:false,why:'nessun fieldset con legend "Dati Viaggio"'};
     var g=c.fields(f).map(i=>c.accName(i));
     return ['partenza','arrivo'].every(n=>g.some(x=>x.indexOf(n)>=0))&&
       f.querySelectorAll('input[type="date"]').length>=1||
       {ok:false,why:'campi trovati: '+g.join(', ')};}},
  {id:'g',label:'Il numero di biglietti è numerico con massimo 4',
   test:c=>{var n=c.qa('input[type="number"]').find(x=>c.accName(x).indexOf('bigliett')>=0);
     if(!n)return {ok:false,why:'nessun campo numerico etichettato "biglietti"'};
     return String(n.getAttribute('max'))==='4'||{ok:false,why:'max vale "'+n.getAttribute('max')+'"'};}},
  {id:'h',label:'La scelta andata/ritorno o sola andata è un gruppo di 2 radio con `name` comune',
   test:c=>{var g=c.groups('radio');
     var k=Object.keys(g).filter(n=>g[n].length===2);
     return k.length>=1||{ok:false,why:'gruppi di radio trovati: '+Object.keys(g).map(n=>n+'('+g[n].length+')').join(', ')};}},
  {id:'i',label:'La scelta della classe è un gruppo di 3 radio con `name` comune, diverso dal precedente',
   test:c=>{var g=c.groups('radio');
     var tre=Object.keys(g).filter(n=>g[n].length===3);
     var due=Object.keys(g).filter(n=>g[n].length===2);
     return (tre.length>=1&&due.length>=1&&tre[0]!==due[0])||
       {ok:false,why:'gruppi trovati: '+Object.keys(g).map(n=>n+'('+g[n].length+')').join(', ')};}},
  {id:'j',label:'Ogni gruppo di radio è racchiuso in un `<fieldset>` con `<legend>`',
   test:c=>{var r=c.qa('input[type="radio"]');
     return r.length>0&&r.every(x=>{var f=x.closest('fieldset');return !!f&&!!f.querySelector('legend');});}},
  {id:'k',label:'Il posto vicino al finestrino è indicato con una casella di controllo etichettata',
   test:c=>{var k=c.qa('input[type="checkbox"]');
     return (k.length>=1&&k.every(x=>c.hasLabel(x))&&k.some(x=>c.accName(x).indexOf('finestrino')>=0))||
       {ok:false,why:'nessuna checkbox etichettata che citi il finestrino'}}},
  {id:'l',label:'TUTTI i controlli hanno una `<label>` associata tramite `for`/`id`',
   test:c=>{var f=c.fields();var senza=f.filter(i=>!c.hasLabel(i));
     return senza.length===0||{ok:false,why:senza.length+' controlli senza label associata'};}},
  {id:'m',label:'TUTTI i controlli hanno un attributo `name`',
   test:c=>{var senza=c.fields().filter(i=>!i.getAttribute('name'));
     return senza.length===0||{ok:false,why:senza.length+' controlli senza name'};}},
  {id:'n',label:'Gli `id` presenti nel documento sono tutti distinti',
   test:c=>{var ids=c.qa('[id]').map(e=>e.id);
     return new Set(ids).size===ids.length||{ok:false,why:'ci sono id duplicati'};}},
  {id:'o',label:'Esistono i pulsanti di Submit e di Cancella (reset)',
   test:c=>{var sub=c.qa('button,input').some(x=>{var t=(x.getAttribute('type')||'').toLowerCase();
       return x.tagName.toLowerCase()==='button'?(t===''||t==='submit'):t==='submit';});
     var res=c.qa('button,input').some(x=>(x.getAttribute('type')||'').toLowerCase()==='reset');
     if(!sub)return {ok:false,why:'manca il pulsante di invio'};
     if(!res)return {ok:false,why:'manca il pulsante di reset'};
     return true;}},
  {id:'p',label:'Il documento è ben formato: tag chiusi e annidati correttamente',
   test:c=>{var w=c.wellFormed();return w.ok||{ok:false,why:w.msg};}}],
 solution:'<!DOCTYPE html>\n<html lang="it">\n<head>\n  <meta charset="utf-8">\n  <title>Prenotazione Treno</title>\n</head>\n<body>\n\n<h1>Prenotazione Treno</h1>\n\n<form action="prenota" method="post">\n\n  <fieldset>\n    <legend>Dati Passeggero</legend>\n\n    <label for="nome">Nome</label>\n    <input type="text" id="nome" name="nome">\n\n    <label for="cognome">Cognome</label>\n    <input type="text" id="cognome" name="cognome">\n\n    <label for="nascita">Data di nascita</label>\n    <input type="date" id="nascita" name="nascita">\n  </fieldset>\n\n  <fieldset>\n    <legend>Dati Viaggio</legend>\n\n    <label for="partenza">Stazione di partenza</label>\n    <input type="text" id="partenza" name="partenza">\n\n    <label for="arrivo">Stazione di arrivo</label>\n    <input type="text" id="arrivo" name="arrivo">\n\n    <label for="biglietti">Numero di biglietti</label>\n    <input type="number" id="biglietti" name="biglietti" min="1" max="4">\n\n    <label for="dataPartenza">Data di partenza</label>\n    <input type="date" id="dataPartenza" name="dataPartenza">\n\n    <fieldset>\n      <legend>Tipo di viaggio</legend>\n      <input type="radio" id="ar" name="viaggio" value="andata-ritorno">\n      <label for="ar">Andata e ritorno</label>\n      <input type="radio" id="sa" name="viaggio" value="sola-andata">\n      <label for="sa">Solo andata</label>\n    </fieldset>\n\n    <fieldset>\n      <legend>Classe</legend>\n      <input type="radio" id="seconda" name="classe" value="seconda">\n      <label for="seconda">Seconda classe</label>\n      <input type="radio" id="prima" name="classe" value="prima">\n      <label for="prima">Prima classe</label>\n      <input type="radio" id="business" name="classe" value="business">\n      <label for="business">Business</label>\n    </fieldset>\n\n    <input type="checkbox" id="finestrino" name="finestrino" value="si">\n    <label for="finestrino">Posto vicino al finestrino</label>\n  </fieldset>\n\n  <button type="submit">Invia</button>\n  <button type="reset">Cancella</button>\n\n</form>\n\n</body>\n</html>',
 why:'Rispetto alla consegna contano tre cose, in quest\'ordine: che ci siano TUTTI i controlli richiesti, che le due parti siano `<fieldset>` con `<legend>` dal titolo esatto, che ogni controllo abbia label e name. I gruppi di radio vanno a loro volta in un `<fieldset>` annidato con la propria `<legend>`: senza, il gruppo resta privo di titolo accessibile.'},

{id:'fn002',lang:'css',topic:'css-box',points:6,minutes:25,
 title:'ESERCIZIO N. 2 (6 punti) CSS',
 brief:'Dato il file html relativo all\'esercizio precedente, realizzare il file .css (esterno), tenendo in considerazione quanto segue:',
 bullets:[
  'Tutti i font devono avere lo stesso font-family, che deve essere Verdana. La dimensione deve essere del 100%.',
  'Il form occupa l\'80% della larghezza della pagina, ed ha un padding laterale destro pari al 4%.',
  'Il form ha un bordo di tipo dotted, di colore Navy, larghezza 3px.',
  'I fieldset hanno testo di colore Navy, un bordo solid, di colore Navy, larghezza 1px.',
  'I fieldset hanno una ombreggiatura orientata a destra e in basso, con un offset di 4px, una sfocatura di 8px, di colore Silver.',
  'I controlli di testo hanno uno sfondo di colore Navy, con colore del testo white.',
  'Le label hanno colore del testo Navy.',
  'I bottoni hanno colore di sfondo Navy e colore del testo white, in grassetto. Sull\'hover, colore di sfondo e di foreground si scambiano.'],
 note:'L\'uso delle media-query non è richiesto.',
 html:'<h1>Prenotazione Treno</h1>\n<form>\n  <fieldset>\n    <legend>Dati Passeggero</legend>\n    <label for="nome">Nome</label>\n    <input type="text" id="nome" name="nome">\n    <label for="nascita">Data di nascita</label>\n    <input type="date" id="nascita" name="nascita">\n    <label for="note">Note</label>\n    <textarea id="note" name="note"></textarea>\n  </fieldset>\n  <fieldset>\n    <legend>Dati Viaggio</legend>\n    <label for="biglietti">Numero di biglietti</label>\n    <input type="number" id="biglietti" name="biglietti" min="1" max="4">\n    <input type="checkbox" id="fin" name="fin">\n    <label for="fin">Finestrino</label>\n  </fieldset>\n  <button type="submit">Invia</button>\n  <input type="reset" value="Cancella">\n</form>',
 starter:'',
 checks:[
  {id:'a',label:'Il carattere Verdana è applicato al corpo e ai controlli di form',
   test:c=>{var m=['body','input','textarea','button'].filter(s=>c.tight(c.computed(s,'font-family')).indexOf('verdana')<0);
     return m.length===0||{ok:false,why:'non è Verdana su: '+m.join(', ')};}},
  {id:'b',label:'La dimensione del carattere è dichiarata come 100%',
   test:c=>c.tight(c.declared('body','font-size'))==='100%'},
  {id:'c',label:'La form occupa l\'80% della larghezza',
   test:c=>c.tight(c.declared('form','width'))==='80%'},
  {id:'d',label:'La form ha padding laterale DESTRO del 4%',
   test:c=>{var r=c.tight(c.declared('form','padding-right'));
     if(r!=='4%')return {ok:false,why:'padding-right vale "'+r+'"'};
     return c.px(c.computed('form','padding-left'))===0||{ok:false,why:'e\' stato aggiunto anche padding a sinistra'};}},
  {id:'e',label:'La form ha bordo 3px dotted navy',
   test:c=>c.computed('form','border-top-style')==='dotted'&&
     c.px(c.computed('form','border-top-width'))===3&&
     c.sameColor(c.computed('form','border-top-color'),'navy')},
  {id:'f',label:'I fieldset hanno bordo 1px solid navy',
   test:c=>c.computed('fieldset','border-top-style')==='solid'&&
     c.px(c.computed('fieldset','border-top-width'))===1&&
     c.sameColor(c.computed('fieldset','border-top-color'),'navy')},
  {id:'g',label:'I fieldset hanno il testo navy',
   test:c=>c.sameColor(c.computed('fieldset','color'),'navy')},
  {id:'h',label:'L\'ombra dei fieldset è 4px 4px 8px silver (a destra e in basso)',
   test:c=>{var s=c.shadow('fieldset');
     if(!s)return {ok:false,why:'nessun box-shadow applicato ai fieldset'};
     if(s.x!==4||s.y!==4)return {ok:false,why:'scostamenti letti: '+s.x+'px '+s.y+'px'};
     if(s.blur!==8)return {ok:false,why:'sfocatura letta: '+s.blur+'px'};
     return c.sameColor(s.color,'silver')||{ok:false,why:'colore letto: '+s.color};}},
  {id:'i',label:'I controlli di testo hanno sfondo navy e testo white',
   test:c=>['input[type="text"]','input[type="date"]','input[type="number"]','textarea']
     .every(s=>c.sameColor(c.computed(s,'background-color'),'navy')&&c.sameColor(c.computed(s,'color'),'white'))},
  {id:'j',label:'La casella di controllo non è stata trattata come controllo di testo',
   test:c=>!c.sameColor(c.computed('input[type="checkbox"]','background-color'),'navy')},
  {id:'k',label:'Le label hanno testo navy',
   test:c=>c.sameColor(c.computed('label','color'),'navy')},
  {id:'l',label:'I bottoni hanno sfondo navy, testo white, in grassetto',
   test:c=>{var w=c.computed('button','font-weight');
     return c.sameColor(c.computed('button','background-color'),'navy')&&
       c.sameColor(c.computed('button','color'),'white')&&(w==='bold'||parseInt(w,10)>=700);}},
  {id:'m',label:'Anche `input[type="reset"]` è trattato come bottone',
   test:c=>{var w=c.computed('input[type="reset"]','font-weight');
     return (c.sameColor(c.computed('input[type="reset"]','background-color'),'navy')&&
       c.sameColor(c.computed('input[type="reset"]','color'),'white')&&(w==='bold'||parseInt(w,10)>=700))||
       {ok:false,why:'il pulsante Cancella è un input[type="reset"] e va incluso fra i bottoni'};}},
  {id:'n',label:'Sull\'hover i colori dei bottoni si scambiano',
   test:c=>{var b=c.hover('button','background-color'),f=c.hover('button','color');
     if(!b&&!f)return {ok:false,why:'nessuna regola :hover trovata per i bottoni'};
     return (c.sameColor(b,'white')&&c.sameColor(f,'navy'))||{ok:false,why:'sfondo hover: '+b+', testo hover: '+f};}}],
 solution:'body,\ninput,\nselect,\ntextarea,\nbutton {\n  font-family: Verdana, sans-serif;\n  font-size: 100%;\n}\n\nform {\n  width: 80%;\n  padding-right: 4%;\n  border: 3px dotted navy;\n}\n\nfieldset {\n  color: navy;\n  border: 1px solid navy;\n  box-shadow: 4px 4px 8px silver;\n}\n\ninput[type="text"],\ninput[type="date"],\ninput[type="number"],\ntextarea {\n  background-color: navy;\n  color: white;\n}\n\nlabel {\n  color: navy;\n}\n\nbutton,\ninput[type="submit"],\ninput[type="reset"] {\n  background-color: navy;\n  color: white;\n  font-weight: bold;\n}\n\nbutton:hover,\nbutton:focus,\ninput[type="submit"]:hover,\ninput[type="reset"]:hover {\n  background-color: white;\n  color: navy;\n}',
 why:'La consegna è un elenco di vincoli: conviene tradurne uno per volta, nell\'ordine in cui sono scritti, e rileggere alla fine spuntandoli. Le tre insidie ricorrenti: i controlli di form che non ereditano il carattere; "controlli di testo" che NON comprende caselle e pulsanti; "i bottoni" che comprende anche `input[type="submit"]` e `input[type="reset"]`.'},

{id:'fn003',lang:'js',topic:'js-ajax',points:7,minutes:35,
 title:'ESERCIZIO N. 3 (7 punti) Javascript',
 brief:'Dato il file html `esercizio_javascript.html` in allegato, modificare il file `soluzione.js` utilizzando JavaScript in modo tale che:',
 bullets:[
  'Al click sul bottone Leggi Personaggio si dovrà: leggere il contenuto dell\'input e controllare che sia un numero intero positivo; fare una richiesta GET al file personaggio.json; in caso di successo, visualizzare i dati del personaggio sotto forma di elenco non ordinato nel main.',
  'Al click sul bottone Leggi Personaggi si dovrà: fare una richiesta POST al file personaggi.json; in caso di successo, visualizzare i dati dei personaggi sotto forma di tabella, considerando che il nome deve essere una cella di intestazione e che la tabella deve essere accessibile.'],
 note:'NB: NON SONO AMMESSE MODIFICHE AL FILE HTML. In caso di input non valido, scrivere nel paragrafo con id "errore" il testo "valore non valido".',
 html:'<h1>Personaggi</h1>\n<label for="id">Identificativo personaggio</label>\n<input type="text" id="id" name="id" value="1">\n<button id="leggiPersonaggio">Leggi Personaggio</button>\n<button id="leggiPersonaggi">Leggi Personaggi</button>\n<p id="errore"></p>\n<main></main>',
 files:{
  'personaggio.json':{name:'Harry Potter',house:'Grifondoro',ancestry:'half-blood',yearOfBirth:1980},
  'personaggi.json':[
   {name:'Harry Potter',house:'Grifondoro',ancestry:'half-blood'},
   {name:'Draco Malfoy',house:'Serpeverde',ancestry:'pure-blood'},
   {name:'Luna Lovegood',house:'Corvonero',ancestry:'pure-blood'}]},
 starter:'// soluzione.js\n// Non modificare il file HTML.\n\n',
 run:async c=>{
   // 1) identificativo non valido: non deve partire nulla
   c.setValue('#id','-1');c.click('#leggiPersonaggio');await c.wait(300);
   c._err=c.text(c.q('#errore'));
   c._chiamateNonValide=c.callTo(/personaggio\.json/).length;
   // 2) identificativo valido: si fotografa l'elenco PRIMA di premere il secondo bottone,
   //    perché la tabella sostituirà il contenuto del main
   c.setValue('#id','1');c.click('#leggiPersonaggio');
   await c.until(()=>c.qa('main ul li').length>0,1800);
   c._ul=c.qa('main ul').length;
   c._ol=c.qa('main ol').length;
   c._voci=c.qa('main ul li').map(l=>c.text(l));
   // 3) secondo bottone: POST e tabella accessibile
   c.click('#leggiPersonaggi');
   await c.until(()=>!!c.q('main table'),1800);
 },
 checks:[
  {id:'a',label:'Con un identificativo non valido compare "valore non valido"',
   test:c=>c._err==='valore non valido'||{ok:false,why:'nel paragrafo #errore compariva: "'+c._err+'"'}},
  {id:'b',label:'Con un identificativo non valido non parte alcuna richiesta',
   test:c=>c._chiamateNonValide===0||{ok:false,why:'sono partite '+c._chiamateNonValide+' richieste'}},
  {id:'c',label:'Il bottone "Leggi Personaggio" esegue una GET su personaggio.json',
   test:c=>c.callTo(/personaggio\.json/,'GET').length>=1},
  {id:'d',label:'I dati del personaggio compaiono nel `<main>` come elenco NON ordinato',
   test:c=>{if(!c._ul)return {ok:false,why:'nessuna <ul> dentro il main dopo la GET'};
     return c._ol===0||{ok:false,why:'e\' stato usato un elenco ordinato'};}},
  {id:'e',label:'L\'elenco riporta tutte e quattro le proprietà ricevute',
   test:c=>{var n=(c._voci||[]).length;return n===4||{ok:false,why:'voci trovate: '+n};}},
  {id:'f',label:'Le voci dell\'elenco riportano nome e valore di ciascuna proprietà',
   test:c=>{var t=(c._voci||[]).join(' | ');
     return (t.indexOf('harry potter')>=0&&t.indexOf('grifondoro')>=0&&t.indexOf('1980')>=0)||
       {ok:false,why:'contenuto letto: '+t};}},
  {id:'g',label:'Il bottone "Leggi Personaggi" esegue una POST su personaggi.json',
   test:c=>c.callTo(/personaggi\.json/,'POST').length>=1||
     {ok:false,why:'metodi usati: '+(c.callTo(/personaggi\.json/).map(x=>x.method).join(', ')||'nessuna richiesta')}},
  {id:'h',label:'Non viene usata una GET per personaggi.json',
   test:c=>c.callTo(/personaggi\.json/,'GET').length===0},
  {id:'i',label:'I personaggi compaiono nel `<main>` sotto forma di tabella',
   test:c=>!!c.q('main table')},
  {id:'j',label:'La tabella ha una riga di intestazione con `<th scope="col">`',
   test:c=>{var th=c.qa('main th[scope="col"]');
     return th.length>=2||{ok:false,why:'celle th[scope=col] trovate: '+th.length};}},
  {id:'k',label:'Il nome di ciascun personaggio è una cella di intestazione `<th scope="row">`',
   test:c=>{var th=c.qa('main th[scope="row"]').map(x=>c.norm(x.textContent));
     return (th.length===3&&th.join('|')==='harry potter|draco malfoy|luna lovegood')||
       {ok:false,why:'th[scope=row] trovati: '+(th.join(', ')||'nessuno')};}},
  {id:'l',label:'Gli altri dati sono celle `<td>`',
   test:c=>{var n=c.qa('main td').length;return n>=6||{ok:false,why:'celle td trovate: '+n};}},
  {id:'m',label:'La tabella ha tre righe di dati più l\'intestazione',
   test:c=>{var n=c.qa('main tr').length;return n===4||{ok:false,why:'righe trovate: '+n};}},
  {id:'n',label:'Il contenuto precedente del `<main>` viene sostituito, non accodato',
   test:c=>{var u=c.qa('main ul').length;
     return u===0||{ok:false,why:'l\'elenco precedente è ancora presente insieme alla tabella'};}},
  {id:'o',label:'L\'esecuzione non produce errori non gestiti',
   test:c=>{var e=c.errors();return e.length===0||{ok:false,why:e[0].text};}}],
 solution:'// soluzione.js\n\nfunction svuotaMain() {\n  const main = document.querySelector("main");\n  main.innerHTML = "";\n  return main;\n}\n\n/* ---------- Leggi Personaggio: GET + elenco non ordinato ---------- */\n\ndocument.getElementById("leggiPersonaggio").addEventListener("click", function () {\n  const errore = document.getElementById("errore");\n  errore.textContent = "";\n\n  const n = Number(document.getElementById("id").value);\n  if (!Number.isInteger(n) || n <= 0) {\n    errore.textContent = "valore non valido";\n    return;\n  }\n\n  fetch("personaggio.json")\n    .then(function (r) {\n      if (!r.ok) { throw new Error("errore " + r.status); }\n      return r.json();\n    })\n    .then(function (p) {\n      const main = svuotaMain();\n      const ul = document.createElement("ul");\n      for (const k in p) {\n        const li = document.createElement("li");\n        li.textContent = k + ": " + p[k];\n        ul.appendChild(li);\n      }\n      main.appendChild(ul);\n    })\n    .catch(function (e) {\n      errore.textContent = e.message;\n    });\n});\n\n/* ---------- Leggi Personaggi: POST + tabella accessibile ---------- */\n\ndocument.getElementById("leggiPersonaggi").addEventListener("click", function () {\n  const errore = document.getElementById("errore");\n  errore.textContent = "";\n\n  fetch("personaggi.json", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({})\n  })\n    .then(function (r) {\n      if (!r.ok) { throw new Error("errore " + r.status); }\n      return r.json();\n    })\n    .then(function (lista) {\n      const main = svuotaMain();\n      const tabella = document.createElement("table");\n\n      const didascalia = document.createElement("caption");\n      didascalia.textContent = "Elenco dei personaggi";\n      tabella.appendChild(didascalia);\n\n      // intestazioni di colonna, ricavate dalle chiavi del primo elemento\n      const chiavi = Object.keys(lista[0]);\n      const rigaIntestazione = document.createElement("tr");\n      chiavi.forEach(function (k) {\n        const th = document.createElement("th");\n        th.setAttribute("scope", "col");\n        th.textContent = k;\n        rigaIntestazione.appendChild(th);\n      });\n      tabella.appendChild(rigaIntestazione);\n\n      // una riga per personaggio: il nome è intestazione di riga\n      lista.forEach(function (p) {\n        const tr = document.createElement("tr");\n\n        const th = document.createElement("th");\n        th.setAttribute("scope", "row");\n        th.textContent = p.name;\n        tr.appendChild(th);\n\n        chiavi.slice(1).forEach(function (k) {\n          const td = document.createElement("td");\n          td.textContent = p[k];\n          tr.appendChild(td);\n        });\n\n        tabella.appendChild(tr);\n      });\n\n      main.appendChild(tabella);\n    })\n    .catch(function (e) {\n      errore.textContent = e.message;\n    });\n});',
 why:'E\' l\'esercizio 4 del compito, con il vincolo esplicito di non toccare l\'HTML: tutto va costruito da JavaScript. I punti che si perdono più spesso sono tre: la validazione dell\'input (che deve impedire la richiesta, non solo segnalare), il metodo POST sul secondo bottone, e `scope` sulle celle di intestazione. Svuotare il `<main>` prima di riempirlo evita che i due risultati si accumulino.'}

];
