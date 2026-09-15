/* Fase 3 - esercizi intermedi: un blocco completo (una form, un gruppo di
   selettori, una funzione). Ampiezza maggiore dei micro, minore dell'esame. */
PREP.data.blocks = [

/* ============================ HTML ============================ */
{id:'bk001',lang:'html',topic:'html-form',title:'Sezione "Dati Anagrafici"',
 brief:'Scrivere la prima parte di una form, dal titolo "Dati Anagrafici", che consenta i seguenti input: Nome, Cognome, Data di nascita, Nazionalità. Il codice deve essere accessibile secondo le WCAG 2.0 a livello A.',
 starter:'',
 checks:[
  {id:'a',label:'Il blocco è un `<fieldset>` con `<legend>` "Dati Anagrafici"',test:c=>{
    var f=c.q('fieldset');if(!f)return false;var l=f.querySelector('legend');
    return !!l&&c.norm(l.textContent)==='dati anagrafici';}},
  {id:'b',label:'Sono presenti quattro controlli di inserimento',test:c=>{
    var n=c.fields().length;return n===4||{ok:false,why:'ne sono stati trovati '+n};}},
  {id:'c',label:'Ogni controllo ha un `name`',test:c=>c.fields().every(i=>!!i.getAttribute('name'))},
  {id:'d',label:'Ogni controllo ha una `<label>` associata tramite `for`/`id`',test:c=>{
    var f=c.fields();return f.length>0&&f.every(i=>c.hasLabel(i));}},
  {id:'e',label:'I nomi accessibili sono Nome, Cognome, Data di nascita, Nazionalità',test:c=>{
    var got=c.fields().map(i=>c.accName(i));
    var need=['nome','cognome','data di nascita','nazionalit'];
    return need.every(n=>got.some(g=>g.indexOf(n)>=0))||{ok:false,why:'trovati: '+got.join(', ')};}},
  {id:'f',label:'La data di nascita usa `type="date"`',test:c=>{
    var d=c.qa('input[type="date"]');return d.length===1&&c.accName(d[0]).indexOf('nascita')>=0;}},
  {id:'g',label:'Tutti gli `id` sono distinti',test:c=>{
    var ids=c.qa('[id]').map(e=>e.id);return new Set(ids).size===ids.length;}}],
 solution:'<fieldset>\n  <legend>Dati Anagrafici</legend>\n\n  <label for="nome">Nome</label>\n  <input type="text" id="nome" name="nome">\n\n  <label for="cognome">Cognome</label>\n  <input type="text" id="cognome" name="cognome">\n\n  <label for="nascita">Data di nascita</label>\n  <input type="date" id="nascita" name="nascita">\n\n  <label for="nazionalita">Nazionalità</label>\n  <input type="text" id="nazionalita" name="nazionalita">\n</fieldset>',
 why:'"La prima parte, dal titolo X" si traduce sempre in `<fieldset>` + `<legend>`. La nazionalità può essere un campo di testo o una `<select>`: entrambe vanno bene, purche\' etichettate.'},

{id:'bk002',lang:'html',topic:'html-form',title:'Sezione "Dati Volo"',
 brief:'Scrivere la seconda parte di una form, dal titolo "Dati Volo", che consenta: aeroporto di partenza, aeroporto di destinazione, numero di passeggeri (massimo consentito: 5), data di partenza. Tutto accessibile secondo le WCAG 2.0 a livello A.',
 starter:'',
 checks:[
  {id:'a',label:'Il blocco è un `<fieldset>` con `<legend>` "Dati Volo"',test:c=>{
    var f=c.q('fieldset');if(!f)return false;var l=f.querySelector('legend');
    return !!l&&c.norm(l.textContent)==='dati volo';}},
  {id:'b',label:'Sono presenti quattro controlli di inserimento',test:c=>{
    var n=c.fields().length;return n===4||{ok:false,why:'ne sono stati trovati '+n};}},
  {id:'c',label:'Ogni controllo ha una `<label>` associata',test:c=>{
    var f=c.fields();return f.length>0&&f.every(i=>c.hasLabel(i));}},
  {id:'d',label:'Sono presenti aeroporto di partenza e di destinazione',test:c=>{
    var g=c.fields().map(i=>c.accName(i));
    return g.some(x=>x.indexOf('partenza')>=0)&&g.some(x=>x.indexOf('destinazione')>=0);}},
  {id:'e',label:'Il numero di passeggeri è `type="number"` con `max="5"`',test:c=>{
    var n=c.q('input[type="number"]');
    return !!n&&String(n.getAttribute('max'))==='5'&&c.accName(n).indexOf('passegger')>=0;}},
  {id:'f',label:'La data di partenza usa `type="date"`',test:c=>c.qa('input[type="date"]').length>=1},
  {id:'g',label:'Ogni controllo ha un `name`',test:c=>c.fields().every(i=>!!i.getAttribute('name'))}],
 solution:'<fieldset>\n  <legend>Dati Volo</legend>\n\n  <label for="partenza">Aeroporto di partenza</label>\n  <input type="text" id="partenza" name="partenza">\n\n  <label for="destinazione">Aeroporto di destinazione</label>\n  <input type="text" id="destinazione" name="destinazione">\n\n  <label for="pax">Numero di passeggeri</label>\n  <input type="number" id="pax" name="passeggeri" min="1" max="5">\n\n  <label for="data">Data di partenza</label>\n  <input type="date" id="data" name="dataPartenza">\n</fieldset>',
 why:'Attenzione a non confondere "data di partenza" (`type="date"`) con "aeroporto di partenza" (testo): la consegna li nomina in modo simile.'},

{id:'bk003',lang:'html',topic:'a11y',title:'Tre gruppi di controlli',
 brief:'Scrivere tre gruppi di controlli accessibili: (1) scelta fra viaggio di andata e ritorno e sola andata, titolo "Tipo di viaggio"; (2) scelta fra economy, premium economy, business e prima classe, titolo "Classe"; (3) uno o più controlli per indicare date flessibili.',
 starter:'',
 checks:[
  {id:'a',label:'Esistono almeno due `<fieldset>`, ciascuno con la propria `<legend>`',test:c=>{
    var f=c.qa('fieldset');return f.length>=2&&f.every(x=>!!x.querySelector('legend')&&!!c.norm(x.querySelector('legend').textContent));}},
  {id:'b',label:'Il gruppo "Tipo di viaggio" ha due radio con lo stesso `name`',test:c=>{
    var f=c.qa('fieldset').find(x=>c.norm(x.querySelector('legend')&&x.querySelector('legend').textContent||'').indexOf('tipo di viaggio')>=0);
    if(!f)return {ok:false,why:'nessun fieldset con legend "Tipo di viaggio"'};
    var r=Array.prototype.slice.call(f.querySelectorAll('input[type="radio"]'));
    return r.length===2&&r[0].getAttribute('name')&&r[0].getAttribute('name')===r[1].getAttribute('name');}},
  {id:'c',label:'Il gruppo "Classe" ha quattro radio con lo stesso `name`',test:c=>{
    var f=c.qa('fieldset').find(x=>c.norm(x.querySelector('legend')&&x.querySelector('legend').textContent||'').indexOf('classe')>=0);
    if(!f)return {ok:false,why:'nessun fieldset con legend "Classe"'};
    var r=Array.prototype.slice.call(f.querySelectorAll('input[type="radio"]'));
    return r.length===4&&r.every(x=>x.getAttribute('name')===r[0].getAttribute('name'));}},
  {id:'d',label:'I due gruppi di radio usano `name` diversi fra loro',test:c=>{
    var g=c.groups('radio');return Object.keys(g).length===2;}},
  {id:'e',label:'Ogni radio ha `value` e etichetta associata',test:c=>{
    var r=c.qa('input[type="radio"]');
    return r.length===6&&r.every(x=>!!x.getAttribute('value')&&c.hasLabel(x)&&!!c.accName(x));}},
  {id:'f',label:'Le date flessibili sono espresse con una checkbox etichettata',test:c=>{
    var k=c.qa('input[type="checkbox"]');
    return k.length>=1&&k.every(x=>c.hasLabel(x))&&k.some(x=>c.accName(x).indexOf('flessibil')>=0);}}],
 solution:'<fieldset>\n  <legend>Tipo di viaggio</legend>\n  <input type="radio" id="ar" name="viaggio" value="ar">\n  <label for="ar">Andata e ritorno</label>\n  <input type="radio" id="sa" name="viaggio" value="sa">\n  <label for="sa">Solo andata</label>\n</fieldset>\n\n<fieldset>\n  <legend>Classe</legend>\n  <input type="radio" id="eco" name="classe" value="economy">\n  <label for="eco">Economy</label>\n  <input type="radio" id="pre" name="classe" value="premium">\n  <label for="pre">Premium economy</label>\n  <input type="radio" id="bus" name="classe" value="business">\n  <label for="bus">Business</label>\n  <input type="radio" id="pri" name="classe" value="prima">\n  <label for="pri">Prima classe</label>\n</fieldset>\n\n<input type="checkbox" id="flex" name="flessibili" value="si">\n<label for="flex">Date flessibili</label>',
 why:'Due gruppi esclusivi distinti richiedono due `name` diversi: se coincidessero, scegliere la classe deselezionerebbe il tipo di viaggio.'},

{id:'bk004',lang:'html',topic:'html-tabelle',title:'Tabella di dati accessibile',
 brief:'Scrivere una tabella con i personaggi Harry (Grifondoro, 1980) e Draco (Serpeverde, 1980). Le colonne sono Nome, Casa, Anno. Il nome deve essere una cella di intestazione. La tabella deve essere accessibile e avere un titolo.',
 starter:'',
 checks:[
  {id:'a',label:'La `<caption>` è il primo figlio della tabella e non è vuota',test:c=>{
    var t=c.q('table');if(!t)return false;var f=t.firstElementChild;
    return !!f&&f.tagName.toLowerCase()==='caption'&&!!c.norm(f.textContent);}},
  {id:'b',label:'Ci sono tre intestazioni di colonna `<th scope="col">`',test:c=>{
    var th=c.qa('th[scope="col"]');
    return th.length===3&&th.map(x=>c.norm(x.textContent)).join('|')==='nome|casa|anno';}},
  {id:'c',label:'I nomi dei personaggi sono `<th scope="row">`',test:c=>{
    var th=c.qa('th[scope="row"]');
    return th.length===2&&th.map(x=>c.norm(x.textContent)).join('|')==='harry|draco';}},
  {id:'d',label:'Le altre celle sono `<td>` e sono quattro',test:c=>{
    var td=c.qa('td');return td.length===4||{ok:false,why:'ne sono stati trovati '+td.length};}},
  {id:'e',label:'I dati sono corretti e allineati alle colonne',test:c=>{
    var rows=c.qa('tbody tr').length?c.qa('tbody tr'):c.qa('tr').slice(1);
    if(rows.length!==2)return {ok:false,why:'righe di dati trovate: '+rows.length};
    var r1=Array.prototype.slice.call(rows[0].children).map(x=>c.norm(x.textContent)).join('|');
    var r2=Array.prototype.slice.call(rows[1].children).map(x=>c.norm(x.textContent)).join('|');
    return r1==='harry|grifondoro|1980'&&r2==='draco|serpeverde|1980';}},
  {id:'f',label:'Il documento è ben formato (tag tutti chiusi correttamente)',test:c=>{
    var w=c.wellFormed();return w.ok||{ok:false,why:w.msg};}}],
 solution:'<table>\n  <caption>Personaggi di Harry Potter</caption>\n  <thead>\n    <tr>\n      <th scope="col">Nome</th>\n      <th scope="col">Casa</th>\n      <th scope="col">Anno</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th scope="row">Harry</th>\n      <td>Grifondoro</td>\n      <td>1980</td>\n    </tr>\n    <tr>\n      <th scope="row">Draco</th>\n      <td>Serpeverde</td>\n      <td>1980</td>\n    </tr>\n  </tbody>\n</table>',
 why:'"Il nome deve essere una cella di intestazione" significa `<th scope="row">`: una tabella a doppia entrata in cui ogni dato è descritto sia dalla colonna sia dalla riga.'},

{id:'bk005',lang:'html',topic:'html-struttura',title:'Documento completo minimo',
 brief:'Scrivere un documento HTML5 valido, ben formato, accessibile e semanticamente corretto, in italiano, che contenga: il titolo di pagina "Voli", una intestazione di primo livello "Voli disponibili", una zona di navigazione con due collegamenti, e il contenuto principale con un paragrafo.',
 starter:'',
 checks:[
  {id:'a',label:'Doctype HTML5 e `lang="it"`',test:c=>c.hasDoctype&&c.norm(c.docLang).indexOf('it')===0},
  {id:'b',label:'Codifica dichiarata e `<title>` "Voli"',test:c=>!!c.q('meta[charset]')&&c.title==='voli'},
  {id:'c',label:'Esiste un solo `<h1>` con testo "Voli disponibili"',test:c=>{
    var h=c.qa('h1');return h.length===1&&c.norm(h[0].textContent)==='voli disponibili';}},
  {id:'d',label:'Esiste un elemento `<nav>` con due collegamenti',test:c=>c.qa('nav a[href]').length===2},
  {id:'e',label:'I collegamenti hanno un testo significativo',test:c=>c.qa('nav a').every(a=>c.norm(a.textContent).length>2)},
  {id:'f',label:'Esiste un solo `<main>` che contiene un paragrafo',test:c=>c.qa('main').length===1&&c.qa('main p').length>=1},
  {id:'g',label:'Il documento è ben formato',test:c=>{var w=c.wellFormed();return w.ok||{ok:false,why:w.msg};}}],
 solution:'<!DOCTYPE html>\n<html lang="it">\n<head>\n  <meta charset="utf-8">\n  <title>Voli</title>\n</head>\n<body>\n  <h1>Voli disponibili</h1>\n\n  <nav>\n    <a href="partenze.html">Partenze</a>\n    <a href="arrivi.html">Arrivi</a>\n  </nav>\n\n  <main>\n    <p>Elenco dei voli in partenza nelle prossime ore.</p>\n  </main>\n</body>\n</html>',
 why:'Lo scheletro va saputo a memoria: doctype, lang, charset, title, un solo h1, landmark semantici. Sono i punti che si perdono per distrazione.'},

/* ============================ CSS ============================ */
{id:'bk006',lang:'css',topic:'css-box',title:'Foglio di stile della form',
 brief:'Scrivere il foglio di stile con questi vincoli: tutti i font sono Arial, dimensione 100%; la form occupa il 90% della larghezza e ha padding laterale sinistro del 5%; la form ha un bordo dashed, Dark orange, 5px; i fieldset hanno testo Dark orange e bordo solid Dark orange di 2px.',
 html:'<form><fieldset><legend>Dati</legend><label for="a">Nome</label><input type="text" id="a"><button>Invia</button></fieldset></form>',
 starter:'',
 checks:[
  {id:'a',label:'Il carattere è Arial su corpo e controlli di form',test:c=>['body','input','button']
    .every(s=>c.tight(c.computed(s,'font-family')).indexOf('arial')>=0)},
  {id:'b',label:'La dimensione del carattere è dichiarata come 100%',test:c=>c.tight(c.declared('body','font-size'))==='100%'},
  {id:'c',label:'La form è larga il 90%',test:c=>c.tight(c.declared('form','width'))==='90%'},
  {id:'d',label:'La form ha padding sinistro del 5%',test:c=>c.tight(c.declared('form','padding-left'))==='5%'},
  {id:'e',label:'La form ha bordo 5px dashed darkorange',test:c=>
    c.computed('form','border-top-style')==='dashed'&&
    c.px(c.computed('form','border-top-width'))===5&&
    c.sameColor(c.computed('form','border-top-color'),'darkorange')},
  {id:'f',label:'I fieldset hanno bordo 2px solid darkorange',test:c=>
    c.computed('fieldset','border-top-style')==='solid'&&
    c.px(c.computed('fieldset','border-top-width'))===2&&
    c.sameColor(c.computed('fieldset','border-top-color'),'darkorange')},
  {id:'g',label:'I fieldset hanno il testo darkorange',test:c=>c.sameColor(c.computed('fieldset','color'),'darkorange')}],
 solution:'body,\ninput,\nselect,\ntextarea,\nbutton {\n  font-family: Arial, sans-serif;\n  font-size: 100%;\n}\n\nform {\n  width: 90%;\n  padding-left: 5%;\n  border: 5px dashed darkorange;\n}\n\nfieldset {\n  color: darkorange;\n  border: 2px solid darkorange;\n}',
 why:'Sono i primi quattro punti dell\'esercizio 2 del compito, nella loro formulazione letterale. Conviene tradurre un vincolo alla volta, in ordine.'},

{id:'bk007',lang:'css',topic:'css-selettori',title:'Controlli, etichette e bottoni',
 brief:'Completare il foglio di stile: i controlli di TESTO hanno sfondo Dark orange e testo white; le label hanno testo Dark orange; i bottoni hanno sfondo Dark orange e testo white in grassetto, e sull\'hover i due colori si scambiano.',
 html:'<form><label for="a">Nome</label><input type="text" id="a"><textarea id="b"></textarea><input type="checkbox" id="c"><button type="submit">Invia</button><input type="reset" value="Cancella"></form>',
 starter:'',
 checks:[
  {id:'a',label:'I campi di testo hanno sfondo darkorange e testo white',test:c=>
    c.sameColor(c.computed('input[type="text"]','background-color'),'darkorange')&&
    c.sameColor(c.computed('input[type="text"]','color'),'white')},
  {id:'b',label:'Le textarea hanno lo stesso trattamento',test:c=>
    c.sameColor(c.computed('textarea','background-color'),'darkorange')&&
    c.sameColor(c.computed('textarea','color'),'white')},
  {id:'c',label:'La casella di controllo NON è stata colorata',test:c=>
    !c.sameColor(c.computed('input[type="checkbox"]','background-color'),'darkorange')},
  {id:'d',label:'Le label hanno testo darkorange',test:c=>c.sameColor(c.computed('label','color'),'darkorange')},
  {id:'e',label:'I bottoni hanno sfondo darkorange, testo white, in grassetto',test:c=>{
    var w=c.computed('button','font-weight');
    return c.sameColor(c.computed('button','background-color'),'darkorange')&&
      c.sameColor(c.computed('button','color'),'white')&&(w==='bold'||parseInt(w,10)>=700);}},
  {id:'f',label:'Anche `input[type="reset"]` è trattato come bottone',test:c=>{
    var w=c.computed('input[type="reset"]','font-weight');
    return c.sameColor(c.computed('input[type="reset"]','background-color'),'darkorange')&&
      c.sameColor(c.computed('input[type="reset"]','color'),'white')&&(w==='bold'||parseInt(w,10)>=700);}},
  {id:'g',label:'Su `:hover` i colori dei bottoni si scambiano',test:c=>
    c.sameColor(c.hover('button','background-color'),'white')&&
    c.sameColor(c.hover('button','color'),'darkorange')}],
 solution:'input[type="text"],\ntextarea {\n  background-color: darkorange;\n  color: white;\n}\n\nlabel {\n  color: darkorange;\n}\n\nbutton,\ninput[type="submit"],\ninput[type="reset"] {\n  background-color: darkorange;\n  color: white;\n  font-weight: bold;\n}\n\nbutton:hover,\nbutton:focus,\ninput[type="submit"]:hover,\ninput[type="reset"]:hover {\n  background-color: white;\n  color: darkorange;\n}',
 why:'"I bottoni" comprende anche `input[type="submit"]` e `input[type="reset"]`, non solo l\'elemento `<button>`: è una dimenticanza che costa punti.'},

{id:'bk008',lang:'css',topic:'css-box',title:'Ombre e riquadri',
 brief:'I fieldset hanno un\'ombreggiatura orientata a sinistra e in alto, offset 5px, sfocatura 10px, colore Orange. I paragrafi figli DIRETTI della form hanno testo Dark orange; quelli più interni no. Il documento non deve usare `!important`.',
 html:'<form><p id="p1">diretto</p><fieldset><legend>L</legend><p id="p2">annidato</p></fieldset></form>',
 starter:'',
 checks:[
  {id:'a',label:'Ombra con scostamenti -5px e -5px',test:c=>{var s=c.shadow('fieldset');return !!s&&s.x===-5&&s.y===-5;}},
  {id:'b',label:'Sfocatura 10px e colore orange',test:c=>{var s=c.shadow('fieldset');
    return !!s&&s.blur===10&&c.sameColor(s.color,'orange');}},
  {id:'c',label:'Il paragrafo figlio diretto è darkorange',test:c=>c.sameColor(c.computedOn(c.q('#p1'),'color'),'darkorange')},
  {id:'d',label:'Il paragrafo annidato NON è darkorange',test:c=>!c.sameColor(c.computedOn(c.q('#p2'),'color'),'darkorange')},
  {id:'e',label:'Non è stato usato `!important`',test:c=>!/!\s*important/i.test(c.raw)}],
 solution:'fieldset {\n  box-shadow: -5px -5px 10px orange;\n}\n\nform > p {\n  color: darkorange;\n}',
 why:'Il combinatore `>` risolve il vincolo senza bisogno di classi aggiuntive nell\'HTML, che in un compito d\'esame potrebbe essere vietato modificare.'},

{id:'bk009',lang:'css',topic:'css-cascata',title:'Vincere un conflitto senza !important',
 brief:'Nel documento la regola `p { color: green; }` è già presente e non va rimossa. Aggiungere le regole necessarie perché il paragrafo con `class="avviso"` risulti rosso e quello con `id="chiave"` risulti blu. Non si può usare `!important`.',
 html:'<p id="normale">normale</p><p class="avviso">avviso</p><p id="chiave" class="avviso">chiave</p>',
 starter:'p {\n  color: green;\n}\n\n',
 checks:[
  {id:'a',label:'Il paragrafo normale resta verde',test:c=>c.sameColor(c.computedOn(c.q('#normale'),'color'),'green')},
  {id:'b',label:'Il paragrafo con classe `avviso` è rosso',test:c=>c.sameColor(c.computedOn(c.q('.avviso'),'color'),'red')},
  {id:'c',label:'Il paragrafo con id `chiave` è blu, pur avendo anche la classe `avviso`',test:c=>
    c.sameColor(c.computedOn(c.q('#chiave'),'color'),'blue')},
  {id:'d',label:'Non è stato usato `!important`',test:c=>!/!\s*important/i.test(c.raw)},
  {id:'e',label:'La regola `p { color: green; }` non è stata rimossa',test:c=>/p\s*\{[^}]*green/i.test(c.raw)}],
 solution:'p {\n  color: green;\n}\n\n.avviso {\n  color: red;\n}\n\n#chiave {\n  color: blue;\n}',
 why:'Non serve `!important`: basta la specificità. La classe (0,1,0) batte l\'elemento (0,0,1), e l\'id (1,0,0) batte la classe. È il cascading applicato.'},

/* ============================ JavaScript ============================ */
{id:'bk010',lang:'js',topic:'js-dom',title:'Funzione che costruisce un elenco',
 brief:'Scrivere la funzione `mostraPersonaggio(dati)` che svuota il `<main>` e vi inserisce un elenco NON ordinato con una voce per ogni proprietà dell\'oggetto ricevuto, nella forma "chiave: valore". La funzione viene poi chiamata al clic sul pulsante.',
 html:'<button id="b">Mostra</button><main><p>vecchio</p></main>',
 starter:'const dati = { nome: "Harry", casa: "Grifondoro", anno: 1980 };\n\nfunction mostraPersonaggio(d) {\n  \n}\n\ndocument.getElementById("b").addEventListener("click", function () {\n  mostraPersonaggio(dati);\n});',
 run:async c=>{c.click('#b');await c.wait(60);c.click('#b');await c.wait(80);},
 checks:[
  {id:'a',label:'Nel `<main>` compare una `<ul>`',test:c=>!!c.q('main ul')},
  {id:'b',label:'Dopo due clic c\'e\' una sola `<ul>`: il contenuto viene svuotato',test:c=>{
    var n=c.qa('main ul').length;return n===1||{ok:false,why:'ne sono state trovate '+n};}},
  {id:'c',label:'Il contenuto iniziale "vecchio" è stato rimosso',test:c=>c.text(c.q('main')).indexOf('vecchio')<0},
  {id:'d',label:'L\'elenco ha tre voci nella forma "chiave: valore"',test:c=>{
    var t=c.qa('main ul li').map(l=>c.text(l));
    return t.length===3&&t[0].indexOf('nome: harry')>=0&&t[1].indexOf('casa: grifondoro')>=0&&t[2].indexOf('anno: 1980')>=0;}},
  {id:'e',label:'La funzione si chiama `mostraPersonaggio`',test:c=>{
    try{return typeof c.win.mostraPersonaggio==='function'||/function\s+mostraPersonaggio/.test(c.raw);}catch(e){return /mostraPersonaggio/.test(c.raw);}}}],
 solution:'const dati = { nome: "Harry", casa: "Grifondoro", anno: 1980 };\n\nfunction mostraPersonaggio(d) {\n  const main = document.querySelector("main");\n  main.innerHTML = "";\n\n  const ul = document.createElement("ul");\n  for (const k in d) {\n    const li = document.createElement("li");\n    li.textContent = k + ": " + d[k];\n    ul.appendChild(li);\n  }\n  main.appendChild(ul);\n}\n\ndocument.getElementById("b").addEventListener("click", function () {\n  mostraPersonaggio(dati);\n});',
 why:'Isolare la costruzione del DOM in una funzione che riceve i dati la rende riutilizzabile sia con la risposta del server sia in prova.'},

{id:'bk011',lang:'js',topic:'js-dom',title:'Funzione che costruisce una tabella accessibile',
 brief:'Scrivere la funzione `mostraTabella(elenco)` che svuota il `<main>` e vi inserisce una tabella con i personaggi. La prima riga contiene le intestazioni di colonna "Nome" e "Casa". Il nome di ogni personaggio deve essere una cella di intestazione di riga. La tabella deve essere accessibile.',
 html:'<button id="b">Mostra</button><main></main>',
 starter:'const elenco = [\n  { nome: "Harry", casa: "Grifondoro" },\n  { nome: "Draco", casa: "Serpeverde" },\n  { nome: "Luna", casa: "Corvonero" }\n];\n\nfunction mostraTabella(lista) {\n  \n}\n\ndocument.getElementById("b").addEventListener("click", function () {\n  mostraTabella(elenco);\n});',
 run:async c=>{c.click('#b');await c.wait(80);},
 checks:[
  {id:'a',label:'Nel `<main>` compare una tabella',test:c=>!!c.q('main table')},
  {id:'b',label:'Le intestazioni di colonna sono `<th scope="col">` e valgono "Nome" e "Casa"',test:c=>{
    var th=c.qa('main th[scope="col"]');
    return th.length===2&&th.map(x=>c.norm(x.textContent)).join('|')==='nome|casa';}},
  {id:'c',label:'I nomi sono `<th scope="row">`, uno per personaggio',test:c=>{
    var th=c.qa('main th[scope="row"]');
    return th.length===3&&th.map(x=>c.norm(x.textContent)).join('|')==='harry|draco|luna';}},
  {id:'d',label:'Le case sono celle di dato `<td>`',test:c=>{
    var td=c.qa('main td').map(x=>c.norm(x.textContent));
    return td.length===3&&td.join('|')==='grifondoro|serpeverde|corvonero';}},
  {id:'e',label:'La tabella ha quattro righe (una di intestazione e tre di dati)',test:c=>{
    var n=c.qa('main tr').length;return n===4||{ok:false,why:'righe trovate: '+n};}},
  {id:'f',label:'La tabella ha una `<caption>` non vuota',test:c=>{
    var cap=c.q('main caption');return !!cap&&!!c.norm(cap.textContent);}}],
 solution:'const elenco = [\n  { nome: "Harry", casa: "Grifondoro" },\n  { nome: "Draco", casa: "Serpeverde" },\n  { nome: "Luna", casa: "Corvonero" }\n];\n\nfunction mostraTabella(lista) {\n  const main = document.querySelector("main");\n  main.innerHTML = "";\n\n  const t = document.createElement("table");\n\n  const cap = document.createElement("caption");\n  cap.textContent = "Personaggi";\n  t.appendChild(cap);\n\n  const intest = document.createElement("tr");\n  ["Nome", "Casa"].forEach(function (x) {\n    const th = document.createElement("th");\n    th.setAttribute("scope", "col");\n    th.textContent = x;\n    intest.appendChild(th);\n  });\n  t.appendChild(intest);\n\n  lista.forEach(function (p) {\n    const tr = document.createElement("tr");\n    const th = document.createElement("th");\n    th.setAttribute("scope", "row");\n    th.textContent = p.nome;\n    const td = document.createElement("td");\n    td.textContent = p.casa;\n    tr.appendChild(th);\n    tr.appendChild(td);\n    t.appendChild(tr);\n  });\n\n  main.appendChild(t);\n}\n\ndocument.getElementById("b").addEventListener("click", function () {\n  mostraTabella(elenco);\n});',
 why:'E\' esattamente la seconda meta\' dell\'esercizio 4 del compito. Da saper scrivere senza esitazioni: `createElement`, `setAttribute("scope", ...)`, `appendChild`.'},

{id:'bk012',lang:'js',topic:'js-ajax',title:'GET con validazione e gestione dell\'errore',
 brief:'Al clic sul pulsante: leggere il contenuto dell\'input e controllare che sia un numero intero positivo; se non lo è, scrivere "valore non valido" nel `<p id="out">` e non inviare nulla. Altrimenti fare una richiesta GET al file `personaggio.json` e, in caso di successo, scrivere nel paragrafo il nome ricevuto; in caso di errore scrivere "errore".',
 html:'<label for="n">Identificativo</label><input type="text" id="n" value="1"><button id="b">Leggi Personaggio</button><p id="out"></p>',
 files:{'personaggio.json':{nome:'Harry Potter',casa:'Grifondoro'}},
 starter:'',
 run:async c=>{
   c.setValue('#n','0');c.click('#b');await c.wait(250);
   c._zero=c.text(c.q('#out'));c._chiamate0=c.callTo(/personaggio\.json/).length;
   c.setValue('#n','abc');c.click('#b');await c.wait(250);c._abc=c.text(c.q('#out'));
   c.setValue('#n','2');c.click('#b');await c.until(()=>c.text(c.q('#out'))==='harry potter',1800);},
 checks:[
  {id:'a',label:'Con "0" scrive "valore non valido"',test:c=>c._zero==='valore non valido'||{ok:false,why:'ha scritto: "'+c._zero+'"'}},
  {id:'b',label:'Con "0" non parte alcuna richiesta',test:c=>c._chiamate0===0||{ok:false,why:'sono partite '+c._chiamate0+' richieste'}},
  {id:'c',label:'Con "abc" scrive "valore non valido"',test:c=>c._abc==='valore non valido'||{ok:false,why:'ha scritto: "'+c._abc+'"'}},
  {id:'d',label:'Con "2" parte una GET verso personaggio.json',test:c=>c.callTo(/personaggio\.json/,'GET').length>=1},
  {id:'e',label:'Con "2" il paragrafo mostra "Harry Potter"',test:c=>c.text(c.q('#out'))==='harry potter'},
  {id:'f',label:'L\'esito della risposta viene verificato (`response.ok` o `status`)',test:c=>/\.ok\b/.test(c.raw)||/status/.test(c.raw)},
  {id:'g',label:'L\'esecuzione non produce errori non gestiti',test:c=>{var e=c.errors();return e.length===0||{ok:false,why:e[0].text};}}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  const out = document.getElementById("out");\n  const n = Number(document.getElementById("n").value);\n\n  if (!Number.isInteger(n) || n <= 0) {\n    out.textContent = "valore non valido";\n    return;\n  }\n\n  fetch("personaggio.json")\n    .then(function (r) {\n      if (!r.ok) { throw new Error("errore " + r.status); }\n      return r.json();\n    })\n    .then(function (d) {\n      out.textContent = d.nome;\n    })\n    .catch(function () {\n      out.textContent = "errore";\n    });\n});',
 why:'Riproduce la prima meta\' dell\'esercizio 4 del compito. I tre punti che valgono: validazione con uscita anticipata, GET, gestione del successo distinta da quella dell\'errore.'},

{id:'bk013',lang:'js',topic:'js-ajax',title:'POST che genera la tabella',
 brief:'Al clic sul pulsante "Leggi Personaggi": fare una richiesta POST al file `personaggi.json`; in caso di successo visualizzare i dati nel `<main>` sotto forma di tabella, considerando che il nome deve essere una cella di intestazione e che la tabella deve essere accessibile.',
 html:'<button id="b">Leggi Personaggi</button><main></main>',
 files:{'personaggi.json':[{nome:'Harry',casa:'Grifondoro'},{nome:'Ron',casa:'Grifondoro'}]},
 starter:'',
 run:async c=>{c.click('#b');await c.until(()=>!!c.q('main table'),1800);},
 checks:[
  {id:'a',label:'La richiesta a personaggi.json usa il metodo POST',test:c=>c.callTo(/personaggi\.json/,'POST').length>=1},
  {id:'b',label:'Nel `<main>` compare una tabella',test:c=>!!c.q('main table')},
  {id:'c',label:'Le intestazioni di colonna sono `<th scope="col">`',test:c=>{
    var th=c.qa('main th[scope="col"]');return th.length>=2;}},
  {id:'d',label:'Il nome di ogni personaggio è un `<th scope="row">`',test:c=>{
    var th=c.qa('main th[scope="row"]').map(x=>c.norm(x.textContent));
    return th.length===2&&th.join('|')==='harry|ron';}},
  {id:'e',label:'Le case compaiono come celle di dato',test:c=>{
    var td=c.qa('main td').map(x=>c.norm(x.textContent));
    return td.length===2&&td.join('|')==='grifondoro|grifondoro';}},
  {id:'f',label:'L\'esecuzione non produce errori non gestiti',test:c=>{var e=c.errors();return e.length===0||{ok:false,why:e[0].text};}}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  fetch("personaggi.json", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({})\n  })\n    .then(function (r) {\n      if (!r.ok) { throw new Error("errore " + r.status); }\n      return r.json();\n    })\n    .then(function (lista) {\n      const main = document.querySelector("main");\n      main.innerHTML = "";\n\n      const t = document.createElement("table");\n      const cap = document.createElement("caption");\n      cap.textContent = "Personaggi";\n      t.appendChild(cap);\n\n      const intest = document.createElement("tr");\n      ["Nome", "Casa"].forEach(function (x) {\n        const th = document.createElement("th");\n        th.setAttribute("scope", "col");\n        th.textContent = x;\n        intest.appendChild(th);\n      });\n      t.appendChild(intest);\n\n      lista.forEach(function (p) {\n        const tr = document.createElement("tr");\n        const th = document.createElement("th");\n        th.setAttribute("scope", "row");\n        th.textContent = p.nome;\n        const td = document.createElement("td");\n        td.textContent = p.casa;\n        tr.appendChild(th);\n        tr.appendChild(td);\n        t.appendChild(tr);\n      });\n\n      main.appendChild(t);\n    });\n});',
 why:'Unisce POST e costruzione della tabella accessibile: è la seconda meta\' dell\'esercizio 4, da provare finche\' non viene di getto.'},

{id:'bk014',lang:'js',topic:'js-eventi',title:'Form gestita senza ricaricare',
 brief:'Intercettare l\'invio della form senza che la pagina si ricarichi. Se il campo è vuoto, scrivere "campo obbligatorio" nel `<p id="out">`. Altrimenti scrivervi "cercato: " seguito dal valore del campo. In entrambi i casi la pagina non deve essere inviata.',
 html:'<form id="f"><label for="q">Ricerca</label><input type="text" id="q" name="q"><button type="submit">Cerca</button></form><p id="out"></p>',
 starter:'',
 run:async c=>{
   function invia(){try{c.q('#f').dispatchEvent(new c.win.Event('submit',{bubbles:true,cancelable:true}));}catch(e){}}
   c.setValue('#q','');invia();await c.wait(80);c._vuoto=c.text(c.q('#out'));
   c.setValue('#q','Harry');invia();await c.wait(80);},
 checks:[
  {id:'a',label:'E\' registrato un gestore sull\'evento `submit`',test:c=>/["']submit["']/.test(c.raw)},
  {id:'b',label:'Viene chiamato `preventDefault()`',test:c=>/preventDefault\s*\(\s*\)/.test(c.raw)},
  {id:'c',label:'Con il campo vuoto compare "campo obbligatorio"',test:c=>c._vuoto==='campo obbligatorio'||{ok:false,why:'ha scritto: "'+c._vuoto+'"'}},
  {id:'d',label:'Con il campo compilato compare "cercato: Harry"',test:c=>c.text(c.q('#out'))==='cercato: harry'||{ok:false,why:'ha scritto: "'+c.text(c.q('#out'))+'"'}}],
 solution:'document.getElementById("f").addEventListener("submit", function (e) {\n  e.preventDefault();\n\n  const out = document.getElementById("out");\n  const v = document.getElementById("q").value.trim();\n\n  if (v === "") {\n    out.textContent = "campo obbligatorio";\n    return;\n  }\n\n  out.textContent = "cercato: " + v;\n});',
 why:'Intercettare `submit` invece del `click` sul pulsante copre anche l\'invio con Invio da tastiera: è la scelta più corretta anche dal punto di vista dell\'accessibilità.'}

];
