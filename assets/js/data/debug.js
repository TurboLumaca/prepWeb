/* Fase 2 - debug. Il codice di partenza è sintatticamente valido ma NON
   conforme alla specifica. Va individuato il difetto e corretto nell'editor.
   La correzione avviene sulla struttura reale prodotta, non per confronto
   con la soluzione. */
PREP.data.debug = [

/* ============================ HTML ============================ */
{id:'d001',lang:'html',topic:'a11y',title:'Etichette non associate',
 spec:['Ogni campo deve avere una `<label>` realmente associata tramite `for`/`id`.',
       'Non modificare i testi delle etichette né i `name`.'],
 starter:'<form action="invia" method="post">\n  <label for="nome">Nome</label>\n  <input type="text" id="campoNome" name="nome">\n\n  <label for="cognome">Cognome</label>\n  <input type="text" name="cognome">\n\n  <button type="submit">Invia</button>\n</form>',
 checks:[
  {id:'c1',label:'Il campo del nome ha un nome accessibile "Nome"',
   test:c=>{var i=c.q('input[name="nome"]');return !!i&&c.hasLabel(i)&&c.accName(i)==='nome';}},
  {id:'c2',label:'Il campo del cognome ha un nome accessibile "Cognome"',
   test:c=>{var i=c.q('input[name="cognome"]');return !!i&&c.hasLabel(i)&&c.accName(i)==='cognome';}},
  {id:'c3',label:'Ogni `for` punta a un `id` realmente presente nel documento',
   test:c=>c.qa('label[for]').every(l=>!!c.q('#'+CSS.escape(l.getAttribute('for'))))},
  {id:'c4',label:'I due campi conservano i `name` originali',
   test:c=>!!c.q('input[name="nome"]')&&!!c.q('input[name="cognome"]')}],
 solution:'<form action="invia" method="post">\n  <label for="nome">Nome</label>\n  <input type="text" id="nome" name="nome">\n\n  <label for="cognome">Cognome</label>\n  <input type="text" id="cognome" name="cognome">\n\n  <button type="submit">Invia</button>\n</form>',
 why:'Il primo campo ha un `id` che non corrisponde al `for`; il secondo non ha `id` affatto. La vicinanza visiva non basta: senza corrispondenza `for`/`id` il controllo resta privo di nome accessibile (WCAG 1.3.1 e 4.1.2, livello A).'},

{id:'d002',lang:'html',topic:'html-form',title:'Scelta esclusiva che non è esclusiva',
 spec:['I quattro controlli devono permettere UNA sola scelta fra economy, premium economy, business e prima classe.',
       'Il gruppo deve avere un titolo accessibile "Classe di viaggio".'],
 starter:'<div>\n  <p>Classe di viaggio</p>\n  <input type="checkbox" id="eco" name="eco" value="economy">\n  <label for="eco">Economy</label>\n  <input type="checkbox" id="pre" name="pre" value="premium">\n  <label for="pre">Premium economy</label>\n  <input type="checkbox" id="bus" name="bus" value="business">\n  <label for="bus">Business</label>\n  <input type="checkbox" id="pri" name="pri" value="prima">\n  <label for="pri">Prima classe</label>\n</div>',
 checks:[
  {id:'c1',label:'I quattro controlli sono `<input type="radio">`',
   test:c=>c.qa('input[type="radio"]').length===4&&c.qa('input[type="checkbox"]').length===0},
  {id:'c2',label:'I quattro radio condividono lo stesso `name`',
   test:c=>{var n=c.qa('input[type="radio"]').map(i=>i.getAttribute('name'));
     return n.length===4&&n.every(x=>x&&x===n[0]);}},
  {id:'c3',label:'Il gruppo è racchiuso in un `<fieldset>` con `<legend>` "Classe di viaggio"',
   test:c=>{var fs=c.q('fieldset');if(!fs)return false;var lg=fs.querySelector('legend');
     return !!lg&&c.norm(lg.textContent).indexOf('classe di viaggio')>=0&&
       fs.querySelectorAll('input[type="radio"]').length===4;}},
  {id:'c4',label:'Ogni radio ha la propria etichetta associata',
   test:c=>{var r=c.qa('input[type="radio"]');return r.length===4&&r.every(i=>c.hasLabel(i)&&c.accName(i));}}],
 solution:'<fieldset>\n  <legend>Classe di viaggio</legend>\n  <input type="radio" id="eco" name="classe" value="economy">\n  <label for="eco">Economy</label>\n  <input type="radio" id="pre" name="classe" value="premium">\n  <label for="pre">Premium economy</label>\n  <input type="radio" id="bus" name="classe" value="business">\n  <label for="bus">Business</label>\n  <input type="radio" id="pri" name="classe" value="prima">\n  <label for="pri">Prima classe</label>\n</fieldset>',
 why:'Le checkbox consentono selezioni multiple e, con `name` diversi, sarebbero indipendenti anche da radio. Serve un solo `name` condiviso, e il titolo del gruppo va dato con `<legend>`: un `<p>` non crea alcuna associazione.'},

{id:'d003',lang:'html',topic:'html-tabelle',title:'Tabella non accessibile',
 spec:['La tabella deve avere un titolo.',
       'La prima riga deve essere di intestazione di colonna.',
       'Il nome del personaggio deve essere una cella di intestazione di riga.'],
 starter:'<table>\n  <tr>\n    <td><strong>Nome</strong></td>\n    <td><strong>Casa</strong></td>\n  </tr>\n  <tr>\n    <td>Harry</td>\n    <td>Grifondoro</td>\n  </tr>\n  <tr>\n    <td>Hermione</td>\n    <td>Grifondoro</td>\n  </tr>\n</table>',
 checks:[
  {id:'c1',label:'La tabella ha una `<caption>` come primo figlio',
   test:c=>{var t=c.q('table');if(!t)return false;var f=t.firstElementChild;
     return !!f&&f.tagName.toLowerCase()==='caption'&&!!c.norm(f.textContent);}},
  {id:'c2',label:'Le due intestazioni di colonna sono `<th scope="col">`',
   test:c=>{var th=c.qa('th[scope="col"]');return th.length===2&&
     c.norm(th[0].textContent)==='nome'&&c.norm(th[1].textContent)==='casa';}},
  {id:'c3',label:'Il nome di ogni personaggio è un `<th scope="row">`',
   test:c=>{var th=c.qa('th[scope="row"]');return th.length===2&&
     th.map(x=>c.norm(x.textContent)).join('|')==='harry|hermione';}},
  {id:'c4',label:'Le celle di dato rimaste sono `<td>`',
   test:c=>c.qa('td').length===2}],
 solution:'<table>\n  <caption>Personaggi di Harry Potter</caption>\n  <thead>\n    <tr>\n      <th scope="col">Nome</th>\n      <th scope="col">Casa</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th scope="row">Harry</th>\n      <td>Grifondoro</td>\n    </tr>\n    <tr>\n      <th scope="row">Hermione</th>\n      <td>Grifondoro</td>\n    </tr>\n  </tbody>\n</table>',
 why:'`<strong>` è solo enfasi visiva: non dice al software che quella cella intesta una colonna. Servono `<th>` con `scope`, così lo screen reader può annunciare "Casa: Grifondoro" spostandosi fra le celle.'},

{id:'d004',lang:'html',topic:'a11y',title:'Requisiti di livello A mancanti',
 spec:['Il documento deve dichiarare la propria lingua (italiano).',
       'Deve avere un titolo significativo.',
       'L\'immagine informativa deve avere un\'alternativa testuale; quella decorativa deve essere ignorata dalle tecnologie assistive.'],
 starter:'<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <title></title>\n</head>\n<body>\n  <h1>Prenotazione Volo</h1>\n  <img src="aereo.png">\n  <img src="onda-decorativa.png" alt="onda decorativa">\n</body>\n</html>',
 checks:[
  {id:'c1',label:'`<html>` dichiara `lang="it"`',
   test:c=>c.norm(c.docLang).indexOf('it')===0},
  {id:'c2',label:'Il `<title>` non è vuoto',
   test:c=>!!c.title},
  {id:'c3',label:'L\'immagine informativa ha un `alt` descrittivo e non vuoto',
   test:c=>{var i=c.q('img[src="aereo.png"]');return !!i&&i.hasAttribute('alt')&&c.norm(i.getAttribute('alt')).length>2;}},
  {id:'c4',label:'L\'immagine decorativa ha `alt=""`',
   test:c=>{var i=c.q('img[src="onda-decorativa.png"]');return !!i&&i.hasAttribute('alt')&&i.getAttribute('alt')==='';}}],
 solution:'<!DOCTYPE html>\n<html lang="it">\n<head>\n  <meta charset="utf-8">\n  <title>Prenotazione Volo</title>\n</head>\n<body>\n  <h1>Prenotazione Volo</h1>\n  <img src="aereo.png" alt="Aereo in fase di decollo">\n  <img src="onda-decorativa.png" alt="">\n</body>\n</html>',
 why:'Tre criteri di livello A in quattro righe: 3.1.1 lingua, 2.4.2 titolo della pagina, 1.1.1 contenuti non testuali. Sull\'immagine decorativa l\'errore è descriverla: così lo screen reader legge un rumore inutile, mentre `alt=""` la salta.'},

{id:'d005',lang:'html',topic:'html-form',title:'Vincoli sul campo numerico',
 spec:['Il numero di passeggeri deve essere un intero compreso fra 1 e 5.',
       'Il campo è obbligatorio.'],
 starter:'<label for="pax">Numero di passeggeri</label>\n<input type="text" id="pax" name="pax" maxlength="5">',
 checks:[
  {id:'c1',label:'Il campo è di tipo `number`',
   test:c=>{var i=c.q('#pax');return !!i&&(i.getAttribute('type')||'').toLowerCase()==='number';}},
  {id:'c2',label:'Il valore massimo è 5 (`max="5"`)',
   test:c=>{var i=c.q('#pax');return !!i&&String(i.getAttribute('max'))==='5';}},
  {id:'c3',label:'Il valore minimo è 1 (`min="1"`)',
   test:c=>{var i=c.q('#pax');return !!i&&String(i.getAttribute('min'))==='1';}},
  {id:'c4',label:'Il campo è obbligatorio (`required`)',
   test:c=>{var i=c.q('#pax');return !!i&&i.hasAttribute('required');}},
  {id:'c5',label:'`maxlength` è stato rimosso: non ha effetto sui campi numerici',
   test:c=>{var i=c.q('#pax');return !!i&&!i.hasAttribute('maxlength');}},
  {id:'c6',label:'L\'etichetta resta associata al campo',
   test:c=>{var i=c.q('#pax');return !!i&&c.hasLabel(i);}}],
 solution:'<label for="pax">Numero di passeggeri</label>\n<input type="number" id="pax" name="pax" min="1" max="5" required>',
 why:'`maxlength` limita i caratteri digitati e su `type="number"` viene ignorato del tutto. Il vincolo "massimo consentito 5" si esprime con `max="5"`.'},

{id:'d006',lang:'html',topic:'html-form',title:'Pulsanti della form',
 spec:['La form deve avere un pulsante che la invia e un pulsante che la azzera.',
       'Il pulsante "Aiuto" non deve inviare nulla.'],
 starter:'<form action="invia" method="post">\n  <label for="q">Ricerca</label>\n  <input type="text" id="q" name="q">\n  <button>Invia</button>\n  <button>Cancella</button>\n  <button>Aiuto</button>\n</form>',
 checks:[
  {id:'c1',label:'Esiste esattamente un pulsante di invio',
   test:c=>{var b=c.qa('button,input[type="submit"]').filter(function(x){
     var t=(x.getAttribute('type')||'').toLowerCase();
     return x.tagName.toLowerCase()==='input'?t==='submit':(t===''||t==='submit');});
     return b.length===1&&c.norm(b[0].textContent||b[0].getAttribute('value'))==='invia';}},
  {id:'c2',label:'Il pulsante "Cancella" ha `type="reset"`',
   test:c=>{var b=c.qa('button,input').filter(x=>c.norm(x.textContent||x.getAttribute('value')||'')==='cancella');
     return b.length===1&&(b[0].getAttribute('type')||'').toLowerCase()==='reset';}},
  {id:'c3',label:'Il pulsante "Aiuto" ha `type="button"` e quindi non invia',
   test:c=>{var b=c.qa('button,input').filter(x=>c.norm(x.textContent||x.getAttribute('value')||'')==='aiuto');
     return b.length===1&&(b[0].getAttribute('type')||'').toLowerCase()==='button';}}],
 solution:'<form action="invia" method="post">\n  <label for="q">Ricerca</label>\n  <input type="text" id="q" name="q">\n  <button type="submit">Invia</button>\n  <button type="reset">Cancella</button>\n  <button type="button">Aiuto</button>\n</form>',
 why:'Senza `type` esplicito ogni `<button>` dentro una form vale `submit`: qui tutti e tre inviavano la form. È un difetto invisibile finche\' non si prova a usarla.'},

/* ============================ CSS ============================ */
{id:'d007',lang:'css',topic:'css-box',title:'Bordo che non si vede',
 spec:['La form deve avere un bordo tratteggiato, arancione scuro, largo 5px.'],
 html:'<form><p>Contenuto della form</p></form>',
 starter:'form {\n  border: 5px darkorange;\n}',
 checks:[
  {id:'c1',label:'Lo stile del bordo è `dashed`',
   test:c=>c.computed('form','border-top-style')==='dashed'},
  {id:'c2',label:'La larghezza del bordo è 5px',
   test:c=>c.px(c.computed('form','border-top-width'))===5},
  {id:'c3',label:'Il colore del bordo è darkorange',
   test:c=>c.sameColor(c.computed('form','border-top-color'),'darkorange')}],
 solution:'form {\n  border: 5px dashed darkorange;\n}',
 why:'`border-style` vale `none` come valore iniziale: senza `dashed` (o `solid`) larghezza e colore non disegnano nulla. La forma abbreviata deve contenere tutti e tre i valori.'},

{id:'d008',lang:'css',topic:'css-box',title:'Ombra orientata dalla parte sbagliata',
 spec:['I fieldset devono avere un\'ombra orientata a SINISTRA e in ALTO, con scostamento di 5px, sfocatura di 10px, colore orange.'],
 html:'<fieldset><legend>Dati</legend><p>contenuto</p></fieldset>',
 starter:'fieldset {\n  border: 2px solid darkorange;\n  box-shadow: 5px 5px 10px orange;\n}',
 checks:[
  {id:'c1',label:'Lo scostamento orizzontale è -5px (verso sinistra)',
   test:c=>{var s=c.shadow('fieldset');return !!s&&s.x===-5;}},
  {id:'c2',label:'Lo scostamento verticale è -5px (verso l\'alto)',
   test:c=>{var s=c.shadow('fieldset');return !!s&&s.y===-5;}},
  {id:'c3',label:'La sfocatura è 10px',
   test:c=>{var s=c.shadow('fieldset');return !!s&&s.blur===10;}},
  {id:'c4',label:'Il colore dell\'ombra è orange',
   test:c=>{var s=c.shadow('fieldset');return !!s&&c.sameColor(s.color,'orange');}},
  {id:'c5',label:'Il bordo pieno arancione scuro di 2px è rimasto',
   test:c=>c.computed('fieldset','border-top-style')==='solid'&&
     c.px(c.computed('fieldset','border-top-width'))===2&&
     c.sameColor(c.computed('fieldset','border-top-color'),'darkorange')}],
 solution:'fieldset {\n  border: 2px solid darkorange;\n  box-shadow: -5px -5px 10px orange;\n}',
 why:'Gli scostamenti positivi spingono l\'ombra a destra e in basso. "A sinistra e in alto" si ottiene solo con valori negativi su entrambi gli assi.'},

{id:'d009',lang:'css',topic:'css-selettori',title:'Lo stato hover non si attiva',
 spec:['I pulsanti hanno sfondo darkorange e testo white, in grassetto.',
       'Al passaggio del puntatore i due colori si scambiano.'],
 html:'<button type="submit">Invia</button> <button type="reset">Cancella</button>',
 starter:'button {\n  background-color: darkorange;\n  color: white;\n  font-weight: bold;\n}\nbutton.hover {\n  background-color: white;\n  color: darkorange;\n}',
 checks:[
  {id:'c1',label:'Nello stato base lo sfondo è darkorange e il testo white',
   test:c=>c.sameColor(c.computed('button','background-color'),'darkorange')&&
     c.sameColor(c.computed('button','color'),'white')},
  {id:'c2',label:'Il testo dei pulsanti è in grassetto',
   test:c=>{var w=c.computed('button','font-weight');return w==='bold'||parseInt(w,10)>=700;}},
  {id:'c3',label:'Esiste una regola per la pseudo-classe `:hover` sui pulsanti',
   test:c=>!!c.hover('button','background-color')},
  {id:'c4',label:'Su `:hover` lo sfondo diventa white',
   test:c=>c.sameColor(c.hover('button','background-color'),'white')},
  {id:'c5',label:'Su `:hover` il testo diventa darkorange',
   test:c=>c.sameColor(c.hover('button','color'),'darkorange')}],
 solution:'button {\n  background-color: darkorange;\n  color: white;\n  font-weight: bold;\n}\nbutton:hover,\nbutton:focus {\n  background-color: white;\n  color: darkorange;\n}',
 why:'`button.hover` seleziona i pulsanti con `class="hover"`, che non esistono. Lo stato del puntatore è una pseudo-classe: `button:hover`. Conviene aggiungere anche `:focus` per chi naviga da tastiera.'},

{id:'d010',lang:'css',topic:'css-testo',title:'Il carattere non arriva ai controlli',
 spec:['TUTTI i testi del documento devono essere resi in Arial, compresi quelli dei controlli di form.'],
 html:'<form><label for="a">Nome</label> <input type="text" id="a"> <select><option>x</option></select> <textarea></textarea> <button>Invia</button></form>',
 starter:'body {\n  font-family: Arial, sans-serif;\n}',
 checks:[
  {id:'c1',label:'Il testo del corpo è in Arial',
   test:c=>c.tight(c.computed('body','font-family')).indexOf('arial')>=0},
  {id:'c2',label:'Il campo di testo è in Arial',
   test:c=>c.tight(c.computed('input','font-family')).indexOf('arial')>=0},
  {id:'c3',label:'La select è in Arial',
   test:c=>c.tight(c.computed('select','font-family')).indexOf('arial')>=0},
  {id:'c4',label:'La textarea è in Arial',
   test:c=>c.tight(c.computed('textarea','font-family')).indexOf('arial')>=0},
  {id:'c5',label:'Il pulsante è in Arial',
   test:c=>c.tight(c.computed('button','font-family')).indexOf('arial')>=0}],
 solution:'body,\ninput,\nselect,\ntextarea,\nbutton {\n  font-family: Arial, sans-serif;\n}\n\n/* in alternativa: */\n/* body { font-family: Arial, sans-serif; }\n   input, select, textarea, button { font-family: inherit; } */',
 why:'I controlli di form ricevono dal browser uno stile che NON eredita il carattere. "Tutti i font devono avere lo stesso font-family" richiede quindi di elencarli, oppure di usare `font-family: inherit`.'},

{id:'d011',lang:'css',topic:'css-layout',title:'Misure sbagliate',
 spec:['La form occupa il 90% della larghezza della pagina.',
       'Ha un padding laterale sinistro pari al 5%.',
       'Il colore del testo delle etichette è darkorange.'],
 html:'<form><label for="a">Nome</label> <input type="text" id="a"></form>',
 starter:'form {\n  width: 900px;\n  padding-left: 5px;\n}\nlabel {\n  font-color: darkorange;\n}',
 checks:[
  {id:'c1',label:'La larghezza della form è espressa come 90%',
   test:c=>c.tight(c.declared('form','width'))==='90%'},
  {id:'c2',label:'Il padding sinistro è espresso come 5%',
   test:c=>c.tight(c.declared('form','padding-left'))==='5%'},
  {id:'c3',label:'Le etichette hanno il testo darkorange',
   test:c=>c.sameColor(c.computed('label','color'),'darkorange')},
  {id:'c4',label:'La proprietà inesistente `font-color` è stata eliminata',
   test:c=>!/font-color/i.test(c.raw)}],
 solution:'form {\n  width: 90%;\n  padding-left: 5%;\n}\nlabel {\n  color: darkorange;\n}',
 why:'900px è una misura fissa che coincide con il 90% solo su una finestra di 1000px. E `font-color` non esiste: la dichiarazione viene scartata in silenzio e il testo resta nero.'},

{id:'d012',lang:'css',topic:'css-selettori',title:'Sfondo applicato agli elementi sbagliati',
 spec:['I controlli di TESTO (campi di testo e textarea) hanno sfondo darkorange e testo white.',
       'I pulsanti non devono essere toccati da questa regola.'],
 html:'<form><input type="text" id="a"><textarea id="b"></textarea><input type="checkbox" id="c"><input type="submit" value="Invia"></form>',
 starter:'input, textarea {\n  background-color: darkorange;\n  color: white;\n}',
 checks:[
  {id:'c1',label:'Il campo di testo ha sfondo darkorange',
   test:c=>c.sameColor(c.computed('input[type="text"]','background-color'),'darkorange')},
  {id:'c2',label:'Il campo di testo ha il testo white',
   test:c=>c.sameColor(c.computed('input[type="text"]','color'),'white')},
  {id:'c3',label:'La textarea ha sfondo darkorange',
   test:c=>c.sameColor(c.computed('textarea','background-color'),'darkorange')},
  {id:'c4',label:'Il pulsante di invio NON ha lo sfondo darkorange',
   test:c=>!c.sameColor(c.computed('input[type="submit"]','background-color'),'darkorange')},
  {id:'c5',label:'La casella di controllo NON è toccata dalla regola',
   test:c=>!c.sameColor(c.computed('input[type="checkbox"]','background-color'),'darkorange')}],
 solution:'input[type="text"],\ntextarea {\n  background-color: darkorange;\n  color: white;\n}',
 why:'`input` da solo colpisce ogni tipo di `<input>`, pulsanti e caselle comprese. Per distinguere serve il selettore di attributo `input[type="text"]`.'},

/* ============================ JavaScript ============================ */
{id:'d013',lang:'js',topic:'js-eventi',title:'Il gestore non scatta',
 spec:['Al clic sul pulsante, nel `<p id="out">` deve comparire il testo "premuto".'],
 html:'<button id="b">Premi</button>\n<p id="out"></p>',
 starter:'const btn = document.getElementById("b");\nbtn.addEventListener("click", scrivi());\n\nfunction scrivi() {\n  document.getElementById("out").textContent = "premuto";\n}',
 run:async c=>{ c.click('#b'); await c.wait(60); },
 checks:[
  {id:'c1',label:'Dopo il clic il paragrafo contiene "premuto"',
   test:c=>c.text(c.q('#out'))==='premuto'},
  {id:'c2',label:'Il gestore è registrato passando il riferimento alla funzione, non la sua invocazione',
   test:c=>!/addEventListener\s*\(\s*["']click["']\s*,\s*[A-Za-z_$][\w$]*\s*\(\s*\)/.test(c.raw)}],
 solution:'const btn = document.getElementById("b");\nbtn.addEventListener("click", scrivi);\n\nfunction scrivi() {\n  document.getElementById("out").textContent = "premuto";\n}',
 why:'`scrivi()` esegue la funzione subito e registra come gestore il suo valore di ritorno, `undefined`. Va passato il riferimento: `scrivi`, senza parentesi.'},

{id:'d014',lang:'js',topic:'js-dom',title:'Elenco costruito ma non inserito',
 spec:['Al clic, nel `<main>` deve comparire un elenco NON ordinato con una voce per ogni proprietà dell\'oggetto, nella forma "chiave: valore".'],
 html:'<button id="b">Mostra</button>\n<main></main>',
 starter:'const dati = { nome: "Harry", casa: "Grifondoro", anno: 1980 };\n\ndocument.getElementById("b").addEventListener("click", function () {\n  const ul = document.createElement("ul");\n  for (const k in dati) {\n    const li = document.createElement("li");\n    li.textContent = k + ": " + dati[k];\n  }\n  document.querySelector("main").appendChild(ul);\n});',
 run:async c=>{ c.click('#b'); await c.wait(80); },
 checks:[
  {id:'c1',label:'Nel `<main>` compare un elenco non ordinato',
   test:c=>!!c.q('main ul')},
  {id:'c2',label:'L\'elenco contiene tre voci',
   test:c=>c.qa('main ul li').length===3},
  {id:'c3',label:'Le voci hanno la forma "chiave: valore"',
   test:c=>{var t=c.qa('main ul li').map(l=>c.text(l));
     return t.length===3&&t[0].indexOf('nome: harry')>=0&&t[1].indexOf('casa: grifondoro')>=0&&t[2].indexOf('anno: 1980')>=0;}},
  {id:'c4',label:'Non sono stati usati elenchi ordinati',
   test:c=>c.qa('main ol').length===0}],
 solution:'const dati = { nome: "Harry", casa: "Grifondoro", anno: 1980 };\n\ndocument.getElementById("b").addEventListener("click", function () {\n  const ul = document.createElement("ul");\n  for (const k in dati) {\n    const li = document.createElement("li");\n    li.textContent = k + ": " + dati[k];\n    ul.appendChild(li);\n  }\n  document.querySelector("main").appendChild(ul);\n});',
 why:'I `<li>` vengono creati ma mai agganciati alla `<ul>`: nella pagina finisce una lista vuota. Manca `ul.appendChild(li)` dentro il ciclo.'},

{id:'d015',lang:'js',topic:'js-ajax',title:'Dati usati prima di essere arrivati',
 spec:['Al clic i dati vanno letti da `personaggio.json` e mostrati nel `<p id="out">` come "nome - casa".'],
 html:'<button id="b">Leggi</button>\n<p id="out"></p>',
 files:{'personaggio.json':{nome:'Harry Potter',casa:'Grifondoro'}},
 starter:'document.getElementById("b").addEventListener("click", function () {\n  let dati;\n  fetch("personaggio.json")\n    .then(function (r) { return r.json(); })\n    .then(function (d) { dati = d; });\n\n  document.getElementById("out").textContent = dati.nome + " - " + dati.casa;\n});',
 run:async c=>{ c.click('#b'); await c.until(()=>c.text(c.q('#out')).length>0,1500); },
 checks:[
  {id:'c1',label:'Viene eseguita una richiesta GET verso personaggio.json',
   test:c=>c.callTo(/personaggio\.json/,'GET').length>=1},
  {id:'c2',label:'Il paragrafo mostra "Harry Potter - Grifondoro"',
   test:c=>c.text(c.q('#out'))==='harry potter - grifondoro'},
  {id:'c3',label:'L\'esecuzione non produce errori',
   test:c=>{var e=c.errors();return e.length===0||{ok:false,why:'errore rilevato: '+e[0].text};}}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  fetch("personaggio.json")\n    .then(function (r) { return r.json(); })\n    .then(function (d) {\n      document.getElementById("out").textContent = d.nome + " - " + d.casa;\n    });\n});',
 why:'La riga che usa `dati` viene eseguita subito, molto prima che la risposta arrivi: `dati` vale ancora `undefined` e il codice solleva un\'eccezione. Tutto ciò che dipende dalla risposta va dentro il `.then()`.'},

{id:'d016',lang:'js',topic:'js-ajax',title:'Metodo HTTP sbagliato',
 spec:['Al clic su "Salva" i dati vanno inviati a `personaggi.json` con una richiesta POST, con il corpo in JSON.',
       'Alla risposta, il numero di personaggi ricevuti va scritto nel `<p id="out">`.'],
 html:'<button id="b">Salva</button>\n<p id="out"></p>',
 files:{'personaggi.json':[{nome:'Harry'},{nome:'Ron'},{nome:'Hermione'}]},
 starter:'document.getElementById("b").addEventListener("click", function () {\n  fetch("personaggi.json?nome=Harry")\n    .then(function (r) { return r.json(); })\n    .then(function (d) {\n      document.getElementById("out").textContent = d.length;\n    });\n});',
 run:async c=>{ c.click('#b'); await c.until(()=>c.text(c.q('#out')).length>0,1500); },
 checks:[
  {id:'c1',label:'La richiesta a personaggi.json usa il metodo POST',
   test:c=>c.callTo(/personaggi\.json/,'POST').length>=1},
  {id:'c2',label:'Non viene più effettuata una GET verso personaggi.json',
   test:c=>c.callTo(/personaggi\.json/,'GET').length===0},
  {id:'c3',label:'La richiesta trasporta un corpo',
   test:c=>{var k=c.callTo(/personaggi\.json/,'POST');return k.length>0&&!!k[0].body;}},
  {id:'c4',label:'Il paragrafo riporta il numero di personaggi ricevuti (3)',
   test:c=>c.text(c.q('#out'))==='3'}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  fetch("personaggi.json", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ nome: "Harry" })\n  })\n    .then(function (r) { return r.json(); })\n    .then(function (d) {\n      document.getElementById("out").textContent = d.length;\n    });\n});',
 why:'Senza il secondo argomento `fetch` esegue una GET, e i dati finiscono nella query string invece che nel corpo. Per una POST servono `method` e `body`.'},

{id:'d017',lang:'js',topic:'js-dom',title:'Tabella generata non accessibile',
 spec:['Al clic va costruita nel `<main>` una tabella con i personaggi.',
       'Il nome deve essere una cella di INTESTAZIONE di riga.',
       'La prima riga deve contenere le intestazioni di colonna "Nome" e "Casa".'],
 html:'<button id="b">Mostra</button>\n<main></main>',
 starter:'const dati = [\n  { nome: "Harry", casa: "Grifondoro" },\n  { nome: "Draco", casa: "Serpeverde" }\n];\n\ndocument.getElementById("b").addEventListener("click", function () {\n  const t = document.createElement("table");\n  const intest = document.createElement("tr");\n  ["Nome", "Casa"].forEach(function (x) {\n    const td = document.createElement("td");\n    td.textContent = x;\n    intest.appendChild(td);\n  });\n  t.appendChild(intest);\n\n  dati.forEach(function (p) {\n    const tr = document.createElement("tr");\n    const a = document.createElement("td");\n    a.textContent = p.nome;\n    const b = document.createElement("td");\n    b.textContent = p.casa;\n    tr.appendChild(a);\n    tr.appendChild(b);\n    t.appendChild(tr);\n  });\n\n  document.querySelector("main").appendChild(t);\n});',
 run:async c=>{ c.click('#b'); await c.wait(80); },
 checks:[
  {id:'c1',label:'Nel `<main>` compare una tabella',
   test:c=>!!c.q('main table')},
  {id:'c2',label:'Le intestazioni di colonna sono `<th scope="col">` e valgono "Nome" e "Casa"',
   test:c=>{var th=c.qa('main th[scope="col"]');
     return th.length===2&&c.norm(th[0].textContent)==='nome'&&c.norm(th[1].textContent)==='casa';}},
  {id:'c3',label:'Il nome di ogni personaggio è un `<th scope="row">`',
   test:c=>{var th=c.qa('main th[scope="row"]');
     return th.length===2&&th.map(x=>c.norm(x.textContent)).join('|')==='harry|draco';}},
  {id:'c4',label:'Le case restano celle di dato `<td>`',
   test:c=>{var td=c.qa('main td');return td.length===2&&
     td.map(x=>c.norm(x.textContent)).join('|')==='grifondoro|serpeverde';}}],
 solution:'const dati = [\n  { nome: "Harry", casa: "Grifondoro" },\n  { nome: "Draco", casa: "Serpeverde" }\n];\n\ndocument.getElementById("b").addEventListener("click", function () {\n  const t = document.createElement("table");\n  const intest = document.createElement("tr");\n  ["Nome", "Casa"].forEach(function (x) {\n    const th = document.createElement("th");\n    th.setAttribute("scope", "col");\n    th.textContent = x;\n    intest.appendChild(th);\n  });\n  t.appendChild(intest);\n\n  dati.forEach(function (p) {\n    const tr = document.createElement("tr");\n    const th = document.createElement("th");\n    th.setAttribute("scope", "row");\n    th.textContent = p.nome;\n    const td = document.createElement("td");\n    td.textContent = p.casa;\n    tr.appendChild(th);\n    tr.appendChild(td);\n    t.appendChild(tr);\n  });\n\n  document.querySelector("main").appendChild(t);\n});',
 why:'La tabella è corretta come griglia ma muta per una tecnologia assistiva: senza `<th>` e `scope` non esiste alcuna relazione fra intestazioni e dati. È esattamente ciò che chiede l\'esercizio 4 del compito.'},

{id:'d018',lang:'js',topic:'js-linguaggio',title:'Validazione assente',
 spec:['Al clic va letto il contenuto del campo e verificato che sia un intero positivo.',
       'Se non lo è, nel `<p id="out">` deve comparire esattamente "valore non valido" e NON deve partire alcuna richiesta.',
       'Se lo è, va eseguita una GET verso `personaggio.json`.'],
 html:'<label for="n">Identificativo</label>\n<input type="text" id="n" value="3">\n<button id="b">Leggi</button>\n<p id="out"></p>',
 files:{'personaggio.json':{nome:'Harry'}},
 starter:'document.getElementById("b").addEventListener("click", function () {\n  const v = document.getElementById("n").value;\n  fetch("personaggio.json")\n    .then(function (r) { return r.json(); })\n    .then(function (d) {\n      document.getElementById("out").textContent = d.nome;\n    });\n});',
 run:async c=>{
   c.setValue('#n','-2.5'); c.click('#b'); await c.wait(250);
   c._dopoNonValido = c.text(c.q('#out'));
   c._chiamateNonValido = c.callTo(/personaggio\.json/).length;
   c.setValue('#n','3'); c.click('#b'); await c.until(()=>c.text(c.q('#out'))==='harry',1500);
 },
 checks:[
  {id:'c1',label:'Con un valore non valido compare "valore non valido"',
   test:c=>c._dopoNonValido==='valore non valido'||{ok:false,why:'nel paragrafo compariva: "'+c._dopoNonValido+'"'}},
  {id:'c2',label:'Con un valore non valido non parte alcuna richiesta',
   test:c=>c._chiamateNonValido===0||{ok:false,why:'sono partite '+c._chiamateNonValido+' richieste'}},
  {id:'c3',label:'Con un valore valido parte la GET verso personaggio.json',
   test:c=>c.callTo(/personaggio\.json/,'GET').length>=1},
  {id:'c4',label:'Con un valore valido compare il nome del personaggio',
   test:c=>c.text(c.q('#out'))==='harry'}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  const out = document.getElementById("out");\n  const n = Number(document.getElementById("n").value);\n\n  if (!Number.isInteger(n) || n <= 0) {\n    out.textContent = "valore non valido";\n    return;\n  }\n\n  fetch("personaggio.json")\n    .then(function (r) { return r.json(); })\n    .then(function (d) {\n      out.textContent = d.nome;\n    });\n});',
 why:'"Controllare che sia un numero intero positivo" è una richiesta esplicita della consegna d\'esame e vale punti. Il valore di un `<input>` è sempre una stringa: va convertito con `Number` e verificato con `Number.isInteger`, uscendo con `return` prima di inviare la richiesta.'}

];
