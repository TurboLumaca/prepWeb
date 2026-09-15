/* Fase 3 - micro-esercizi: una riga o un singolo elemento che soddisfi una
   specifica puntuale. Adatti anche allo schermo di uno smartphone. */
PREP.data.micro = [

/* ============================ HTML ============================ */
{id:'m001',lang:'html',topic:'html-form',title:'Campo di testo etichettato',
 brief:'Scrivere un campo di testo per il cognome, con etichetta "Cognome" correttamente associata. Il dato deve essere inviato con la chiave `cognome`.',
 starter:'',
 checks:[
  {id:'a',label:'Esiste un `<input type="text">`',test:c=>!!c.q('input[type="text"]')},
  {id:'b',label:'Il campo ha `name="cognome"`',test:c=>{var i=c.q('input');return !!i&&i.getAttribute('name')==='cognome';}},
  {id:'c',label:'Esiste una `<label>` associata tramite `for`/`id`',test:c=>{var i=c.q('input');return !!i&&c.hasLabel(i);}},
  {id:'d',label:'Il nome accessibile del campo è "Cognome"',test:c=>{var i=c.q('input');return !!i&&c.accName(i)==='cognome';}}],
 solution:'<label for="cognome">Cognome</label>\n<input type="text" id="cognome" name="cognome">',
 why:'Lo schema label/controllo è il mattone di ogni esercizio di form: `for` uguale a `id`, più il `name` per la trasmissione.'},

{id:'m002',lang:'html',topic:'html-form',title:'Campo data',
 brief:'Scrivere un campo per la data di partenza, con etichetta "Data di partenza" associata, obbligatorio.',
 starter:'',
 checks:[
  {id:'a',label:'Il campo è di tipo `date`',test:c=>!!c.q('input[type="date"]')},
  {id:'b',label:'Il campo è obbligatorio (`required`)',test:c=>{var i=c.q('input');return !!i&&i.hasAttribute('required');}},
  {id:'c',label:'Il campo ha un attributo `name`',test:c=>{var i=c.q('input');return !!i&&!!i.getAttribute('name');}},
  {id:'d',label:'Il nome accessibile è "Data di partenza"',test:c=>{var i=c.q('input');return !!i&&c.hasLabel(i)&&c.accName(i)==='data di partenza';}}],
 solution:'<label for="partenza">Data di partenza</label>\n<input type="date" id="partenza" name="partenza" required>',
 why:'`type="date"` è il tipo HTML5 previsto. `required` è un attributo booleano: si scrive senza valore.'},

{id:'m003',lang:'html',topic:'html-form',title:'Campo numerico vincolato',
 brief:'Scrivere il campo "Numero di passeggeri", numerico, con minimo 1 e massimo consentito 5, etichetta associata.',
 starter:'',
 checks:[
  {id:'a',label:'Il campo è di tipo `number`',test:c=>!!c.q('input[type="number"]')},
  {id:'b',label:'`min="1"`',test:c=>{var i=c.q('input');return !!i&&String(i.getAttribute('min'))==='1';}},
  {id:'c',label:'`max="5"`',test:c=>{var i=c.q('input');return !!i&&String(i.getAttribute('max'))==='5';}},
  {id:'d',label:'Il nome accessibile è "Numero di passeggeri"',test:c=>{var i=c.q('input');return !!i&&c.hasLabel(i)&&c.accName(i)==='numero di passeggeri';}},
  {id:'e',label:'Non è stato usato `maxlength`, che qui non ha effetto',test:c=>{var i=c.q('input');return !!i&&!i.hasAttribute('maxlength');}}],
 solution:'<label for="pax">Numero di passeggeri</label>\n<input type="number" id="pax" name="pax" min="1" max="5">',
 why:'"Massimo consentito: 5" è un vincolo sul VALORE, quindi `max`. È la formulazione letterale del compito d\'esame.'},

{id:'m004',lang:'html',topic:'a11y',title:'Gruppo di pulsanti radio',
 brief:'Scrivere un gruppo di due pulsanti radio per scegliere fra "Andata e ritorno" e "Solo andata". Il gruppo deve avere il titolo accessibile "Tipo di viaggio". I dati vanno inviati con la chiave `viaggio`.',
 starter:'',
 checks:[
  {id:'a',label:'Esistono due `<input type="radio">`',test:c=>c.qa('input[type="radio"]').length===2},
  {id:'b',label:'Entrambi hanno `name="viaggio"`',test:c=>c.qa('input[type="radio"]').every(i=>i.getAttribute('name')==='viaggio')},
  {id:'c',label:'Ciascuno ha un `value` distinto',test:c=>{var v=c.qa('input[type="radio"]').map(i=>i.getAttribute('value'));
    return v.length===2&&v[0]&&v[1]&&v[0]!==v[1];}},
  {id:'d',label:'Ciascuno ha la propria etichetta associata',test:c=>{var r=c.qa('input[type="radio"]');
    return r.length===2&&r.every(i=>c.hasLabel(i)&&!!c.accName(i));}},
  {id:'e',label:'Il gruppo è in un `<fieldset>` con `<legend>` "Tipo di viaggio"',test:c=>{var f=c.q('fieldset');
    if(!f)return false;var l=f.querySelector('legend');
    return !!l&&c.norm(l.textContent)==='tipo di viaggio'&&f.querySelectorAll('input[type="radio"]').length===2;}}],
 solution:'<fieldset>\n  <legend>Tipo di viaggio</legend>\n  <input type="radio" id="ar" name="viaggio" value="andata-ritorno">\n  <label for="ar">Andata e ritorno</label>\n  <input type="radio" id="sa" name="viaggio" value="sola-andata">\n  <label for="sa">Solo andata</label>\n</fieldset>',
 why:'Tre cose insieme: stesso `name` per l\'esclusivita\', `value` distinti per sapere quale è stato scelto, `fieldset`/`legend` per il titolo accessibile del gruppo.'},

{id:'m005',lang:'html',topic:'html-form',title:'Elenco a discesa',
 brief:'Scrivere un elenco a discesa "Nazionalità" con almeno tre opzioni, etichetta associata, chiave di invio `nazionalita`.',
 starter:'',
 checks:[
  {id:'a',label:'Esiste una `<select>` con `name="nazionalita"`',test:c=>{var s=c.q('select');return !!s&&s.getAttribute('name')==='nazionalita';}},
  {id:'b',label:'Contiene almeno tre `<option>`',test:c=>c.qa('select option').length>=3},
  {id:'c',label:'Ogni opzione ha un `value`',test:c=>{var o=c.qa('select option');return o.length>=3&&o.every(x=>x.hasAttribute('value')&&x.getAttribute('value')!=='');}},
  {id:'d',label:'Il nome accessibile della select è "Nazionalità"',test:c=>{var s=c.q('select');
    return !!s&&c.hasLabel(s)&&c.norm(c.accName(s)).indexOf('nazionalit')===0;}}],
 solution:'<label for="naz">Nazionalità</label>\n<select id="naz" name="nazionalita">\n  <option value="it">Italiana</option>\n  <option value="fr">Francese</option>\n  <option value="de">Tedesca</option>\n</select>',
 why:'Il dato inviato è il `value` dell\'opzione scelta; il testo interno è solo ciò che l\'utente legge.'},

{id:'m006',lang:'html',topic:'html-form',title:'Pulsanti della form',
 brief:'Scrivere i due pulsanti di una form: uno che invia, con testo "Invia", e uno che azzera i campi, con testo "Cancella".',
 starter:'',
 checks:[
  {id:'a',label:'Esiste un controllo di invio con testo "Invia"',test:c=>{
    var b=c.qa('button,input[type="submit"]').filter(x=>c.norm(x.textContent||x.getAttribute('value')||'')==='invia');
    if(!b.length)return false;var t=(b[0].getAttribute('type')||'').toLowerCase();
    return b[0].tagName.toLowerCase()==='input'?t==='submit':(t===''||t==='submit');}},
  {id:'b',label:'Esiste un controllo di azzeramento con testo "Cancella"',test:c=>{
    var b=c.qa('button,input').filter(x=>c.norm(x.textContent||x.getAttribute('value')||'')==='cancella');
    return b.length===1&&(b[0].getAttribute('type')||'').toLowerCase()==='reset';}},
  {id:'c',label:'Sono presenti esattamente due controlli',test:c=>c.qa('button,input').length===2}],
 solution:'<button type="submit">Invia</button>\n<button type="reset">Cancella</button>',
 why:'"Bottoni di Submit e Cancella della form" è la formulazione del compito: il secondo è un `reset`, non un pulsante generico.'},

{id:'m007',lang:'html',topic:'html-tabelle',title:'Riga di intestazione accessibile',
 brief:'Scrivere la riga di intestazione di una tabella con le tre colonne "Nome", "Casa" e "Anno", resa accessibile.',
 starter:'<table>\n\n</table>',
 checks:[
  {id:'a',label:'La riga contiene tre celle di intestazione `<th>`',test:c=>c.qa('table tr th').length===3},
  {id:'b',label:'Ogni `<th>` ha `scope="col"`',test:c=>{var t=c.qa('table tr th');return t.length===3&&t.every(x=>x.getAttribute('scope')==='col');}},
  {id:'c',label:'I testi sono "Nome", "Casa", "Anno" nell\'ordine',test:c=>c.qa('table tr th').map(x=>c.norm(x.textContent)).join('|')==='nome|casa|anno'},
  {id:'d',label:'Non sono stati usati `<td>` per le intestazioni',test:c=>c.qa('table td').length===0}],
 solution:'<table>\n  <tr>\n    <th scope="col">Nome</th>\n    <th scope="col">Casa</th>\n    <th scope="col">Anno</th>\n  </tr>\n</table>',
 why:'`scope="col"` è ciò che distingue una tabella accessibile da una semplicemente in grassetto.'},

{id:'m008',lang:'html',topic:'a11y',title:'Immagini informativa e decorativa',
 brief:'Scrivere due immagini: `aereo.png`, che mostra un aereo in decollo ed è informativa, e `sfondo.png`, puramente decorativa.',
 starter:'',
 checks:[
  {id:'a',label:'Entrambe le immagini hanno l\'attributo `alt`',test:c=>{var i=c.qa('img');return i.length===2&&i.every(x=>x.hasAttribute('alt'));}},
  {id:'b',label:'`aereo.png` ha un\'alternativa testuale non vuota e descrittiva',test:c=>{var i=c.q('img[src="aereo.png"]');
    return !!i&&c.norm(i.getAttribute('alt')).length>3;}},
  {id:'c',label:'`sfondo.png` ha `alt=""`',test:c=>{var i=c.q('img[src="sfondo.png"]');
    return !!i&&i.getAttribute('alt')==='';}},
  {id:'d',label:'L\'alternativa dell\'immagine informativa non inizia con "immagine di"',test:c=>{var i=c.q('img[src="aereo.png"]');
    return !!i&&!/^(immagine|foto|icona)\s+(di|del|della)/.test(c.norm(i.getAttribute('alt')));}}],
 solution:'<img src="aereo.png" alt="Aereo in fase di decollo">\n<img src="sfondo.png" alt="">',
 why:'La differenza fra `alt=""` e l\'assenza dell\'attributo è sostanziale: nel secondo caso molti screen reader leggono il nome del file.'},

{id:'m009',lang:'html',topic:'html-struttura',title:'Testata del documento',
 brief:'Scrivere l\'apertura di un documento HTML5 in italiano, con codifica UTF-8 e titolo "Prenotazione Volo", fino alla chiusura del `<head>`.',
 starter:'',
 checks:[
  {id:'a',label:'Il documento inizia con `<!DOCTYPE html>`',test:c=>c.hasDoctype},
  {id:'b',label:'`<html>` dichiara `lang="it"`',test:c=>c.norm(c.docLang).indexOf('it')===0},
  {id:'c',label:'E\' dichiarata la codifica UTF-8',test:c=>{var m=c.q('meta[charset]');
    return !!m&&c.norm(m.getAttribute('charset')).replace('-','')==='utf8';}},
  {id:'d',label:'Il `<title>` vale "Prenotazione Volo"',test:c=>c.title==='prenotazione volo'}],
 solution:'<!DOCTYPE html>\n<html lang="it">\n<head>\n  <meta charset="utf-8">\n  <title>Prenotazione Volo</title>\n</head>',
 why:'Quattro righe che valgono punti in ogni compito: doctype, lingua, codifica, titolo. Conviene impararle come un blocco unico.'},

{id:'m010',lang:'html',topic:'a11y',title:'Casella di controllo singola',
 brief:'Scrivere un controllo che consenta di indicare che le date sono flessibili, con etichetta "Date flessibili" associata e chiave di invio `flessibili`.',
 starter:'',
 checks:[
  {id:'a',label:'Il controllo è una casella di controllo (`checkbox`)',test:c=>c.qa('input[type="checkbox"]').length===1},
  {id:'b',label:'Ha `name="flessibili"`',test:c=>{var i=c.q('input');return !!i&&i.getAttribute('name')==='flessibili';}},
  {id:'c',label:'Il nome accessibile è "Date flessibili"',test:c=>{var i=c.q('input');return !!i&&c.hasLabel(i)&&c.accName(i)==='date flessibili';}},
  {id:'d',label:'Non è stato usato un radio isolato',test:c=>c.qa('input[type="radio"]').length===0}],
 solution:'<input type="checkbox" id="flessibili" name="flessibili" value="si">\n<label for="flessibili">Date flessibili</label>',
 why:'Una singola opzione attivabile in modo indipendente è una checkbox. Un radio isolato, una volta selezionato, non si può più deselezionare.'},

/* ============================ CSS ============================ */
{id:'m011',lang:'css',topic:'css-box',title:'Bordo tratteggiato',
 brief:'Dare alla `<form>` un bordo di tipo dashed, di colore Dark orange, larghezza 5px.',
 html:'<form><p>contenuto</p></form>',starter:'form {\n\n}',
 checks:[
  {id:'a',label:'Lo stile del bordo è `dashed`',test:c=>c.computed('form','border-top-style')==='dashed'},
  {id:'b',label:'La larghezza è 5px',test:c=>c.px(c.computed('form','border-top-width'))===5},
  {id:'c',label:'Il colore è darkorange',test:c=>c.sameColor(c.computed('form','border-top-color'),'darkorange')},
  {id:'d',label:'Il bordo è applicato su tutti e quattro i lati',test:c=>['top','right','bottom','left']
    .every(s=>c.px(c.computed('form','border-'+s+'-width'))===5)}],
 solution:'form {\n  border: 5px dashed darkorange;\n}',
 why:'La forma abbreviata `border` richiede tutti e tre i valori: senza lo stile il bordo non viene disegnato.'},

{id:'m012',lang:'css',topic:'css-box',title:'Ombra a sinistra e in alto',
 brief:'Dare ai `<fieldset>` un\'ombreggiatura orientata a sinistra e in alto, con un offset di 5px, una sfocatura di 10px, di colore Orange.',
 html:'<fieldset><legend>Dati</legend><p>contenuto</p></fieldset>',starter:'fieldset {\n\n}',
 checks:[
  {id:'a',label:'Lo scostamento orizzontale è -5px',test:c=>{var s=c.shadow('fieldset');return !!s&&s.x===-5;}},
  {id:'b',label:'Lo scostamento verticale è -5px',test:c=>{var s=c.shadow('fieldset');return !!s&&s.y===-5;}},
  {id:'c',label:'La sfocatura è 10px',test:c=>{var s=c.shadow('fieldset');return !!s&&s.blur===10;}},
  {id:'d',label:'Il colore è orange',test:c=>{var s=c.shadow('fieldset');return !!s&&c.sameColor(s.color,'orange');}},
  {id:'e',label:'L\'ombra non è interna (`inset`)',test:c=>{var s=c.shadow('fieldset');return !!s&&!s.inset;}}],
 solution:'fieldset {\n  box-shadow: -5px -5px 10px orange;\n}',
 why:'Ordine: `offset-x offset-y blur color`. "A sinistra e in alto" impone il segno negativo su entrambi gli scostamenti.'},

{id:'m013',lang:'css',topic:'css-testo',title:'Carattere unico per tutto',
 brief:'Fare in modo che TUTTI i testi del documento, compresi quelli dei controlli di form, siano resi in Arial, con dimensione del 100%.',
 html:'<form><label for="a">Nome</label><input type="text" id="a"><select><option>x</option></select><textarea></textarea><button>Invia</button></form><p>testo</p>',
 starter:'',
 checks:[
  {id:'a',label:'Il testo del corpo è in Arial',test:c=>c.tight(c.computed('body','font-family')).indexOf('arial')>=0},
  {id:'b',label:'Il campo di testo è in Arial',test:c=>c.tight(c.computed('input','font-family')).indexOf('arial')>=0},
  {id:'c',label:'La select è in Arial',test:c=>c.tight(c.computed('select','font-family')).indexOf('arial')>=0},
  {id:'d',label:'La textarea è in Arial',test:c=>c.tight(c.computed('textarea','font-family')).indexOf('arial')>=0},
  {id:'e',label:'Il pulsante è in Arial',test:c=>c.tight(c.computed('button','font-family')).indexOf('arial')>=0},
  {id:'f',label:'La dimensione è dichiarata come 100%',test:c=>c.tight(c.declared('body','font-size'))==='100%'}],
 solution:'body,\ninput,\nselect,\ntextarea,\nbutton {\n  font-family: Arial, sans-serif;\n  font-size: 100%;\n}',
 why:'I controlli di form non ereditano il carattere: "tutti i font" richiede di elencarli esplicitamente.'},

{id:'m014',lang:'css',topic:'css-layout',title:'Larghezza e padding percentuali',
 brief:'La `<form>` occupa il 90% della larghezza della pagina e ha un padding laterale sinistro pari al 5%.',
 html:'<form><p>contenuto</p></form>',starter:'form {\n\n}',
 checks:[
  {id:'a',label:'La larghezza è dichiarata come 90%',test:c=>c.tight(c.declared('form','width'))==='90%'},
  {id:'b',label:'Il padding sinistro è dichiarato come 5%',test:c=>c.tight(c.declared('form','padding-left'))==='5%'},
  {id:'c',label:'Non è stato aggiunto padding sugli altri lati',test:c=>{
    var r=c.px(c.computed('form','padding-right')),t=c.px(c.computed('form','padding-top'));
    return r===0&&t===0;}}],
 solution:'form {\n  width: 90%;\n  padding-left: 5%;\n}',
 why:'"Padding laterale sinistro" è solo `padding-left`: la scorciatoia `padding` lo applicherebbe a tutti i lati.'},

{id:'m015',lang:'css',topic:'css-selettori',title:'Scambio dei colori sull\'hover',
 brief:'I bottoni hanno sfondo Dark orange e testo white, in grassetto. Sull\'hover, colore di sfondo e di foreground si scambiano.',
 html:'<button type="submit">Invia</button><button type="reset">Cancella</button>',starter:'',
 checks:[
  {id:'a',label:'Stato base: sfondo darkorange',test:c=>c.sameColor(c.computed('button','background-color'),'darkorange')},
  {id:'b',label:'Stato base: testo white',test:c=>c.sameColor(c.computed('button','color'),'white')},
  {id:'c',label:'Testo in grassetto',test:c=>{var w=c.computed('button','font-weight');return w==='bold'||parseInt(w,10)>=700;}},
  {id:'d',label:'Su `:hover` lo sfondo diventa white',test:c=>c.sameColor(c.hover('button','background-color'),'white')},
  {id:'e',label:'Su `:hover` il testo diventa darkorange',test:c=>c.sameColor(c.hover('button','color'),'darkorange')}],
 solution:'button {\n  background-color: darkorange;\n  color: white;\n  font-weight: bold;\n}\nbutton:hover,\nbutton:focus {\n  background-color: white;\n  color: darkorange;\n}',
 why:'"I colori si scambiano" si traduce nei due stessi valori invertiti nello stato `:hover`.'},

{id:'m016',lang:'css',topic:'css-selettori',title:'Selettore di attributo',
 brief:'I soli campi di TESTO (`type="text"`) hanno sfondo Dark orange e colore del testo white. Gli altri controlli non devono essere toccati.',
 html:'<form><input type="text" id="a"><input type="checkbox" id="b"><input type="submit" value="Invia"></form>',starter:'',
 checks:[
  {id:'a',label:'Il campo di testo ha sfondo darkorange',test:c=>c.sameColor(c.computed('input[type="text"]','background-color'),'darkorange')},
  {id:'b',label:'Il campo di testo ha testo white',test:c=>c.sameColor(c.computed('input[type="text"]','color'),'white')},
  {id:'c',label:'La casella di controllo non è toccata',test:c=>!c.sameColor(c.computed('input[type="checkbox"]','background-color'),'darkorange')},
  {id:'d',label:'Il pulsante di invio non è toccato',test:c=>!c.sameColor(c.computed('input[type="submit"]','background-color'),'darkorange')}],
 solution:'input[type="text"] {\n  background-color: darkorange;\n  color: white;\n}',
 why:'Il selettore `input` colpisce ogni tipo di input. Per distinguerli serve il selettore di attributo.'},

{id:'m017',lang:'css',topic:'css-box',title:'Fieldset con bordo e testo intonati',
 brief:'I `<fieldset>` hanno testo di colore Dark orange e un bordo solid, di colore Dark orange, larghezza 2px.',
 html:'<fieldset><legend>Dati Volo</legend><p>contenuto</p></fieldset>',starter:'',
 checks:[
  {id:'a',label:'Lo stile del bordo è `solid`',test:c=>c.computed('fieldset','border-top-style')==='solid'},
  {id:'b',label:'La larghezza del bordo è 2px',test:c=>c.px(c.computed('fieldset','border-top-width'))===2},
  {id:'c',label:'Il colore del bordo è darkorange',test:c=>c.sameColor(c.computed('fieldset','border-top-color'),'darkorange')},
  {id:'d',label:'Il testo del fieldset è darkorange',test:c=>c.sameColor(c.computed('fieldset','color'),'darkorange')},
  {id:'e',label:'Anche la `<legend>` risulta darkorange',test:c=>c.sameColor(c.computed('legend','color'),'darkorange')}],
 solution:'fieldset {\n  border: 2px solid darkorange;\n  color: darkorange;\n}',
 why:'`color` si eredita, quindi dichiararlo sul fieldset basta a colorare anche legend e testo interno.'},

{id:'m018',lang:'css',topic:'css-selettori',title:'Etichette colorate',
 brief:'Tutte le `<label>` del documento hanno il testo di colore Dark orange.',
 html:'<form><label for="a">Nome</label><input id="a"><label for="b">Cognome</label><input id="b"></form>',starter:'',
 checks:[
  {id:'a',label:'Le label hanno testo darkorange',test:c=>c.sameColor(c.computed('label','color'),'darkorange')},
  {id:'b',label:'La regola vale per tutte le label, non solo per la prima',test:c=>{
    var l=c.qa('label');return l.length===2&&l.every(x=>c.sameColor(c.computedOn(x,'color'),'darkorange'));}},
  {id:'c',label:'Non è stata usata la proprietà inesistente `font-color`',test:c=>!/font-color/i.test(c.raw)}],
 solution:'label {\n  color: darkorange;\n}',
 why:'Il selettore di elemento colpisce tutte le occorrenze. `font-color` non esiste e verrebbe scartata in silenzio.'},

{id:'m019',lang:'css',topic:'css-selettori',title:'Più selettori, stesse dichiarazioni',
 brief:'I campi di testo, i campi numerici, i campi data e le textarea hanno tutti sfondo Dark orange e testo white. Scrivere una sola regola.',
 html:'<form><input type="text" id="a"><input type="number" id="b"><input type="date" id="c"><textarea id="d"></textarea><input type="submit" value="ok"></form>',
 starter:'',
 checks:[
  {id:'a',label:'Il campo di testo ha sfondo darkorange',test:c=>c.sameColor(c.computed('input[type="text"]','background-color'),'darkorange')},
  {id:'b',label:'Il campo numerico ha sfondo darkorange',test:c=>c.sameColor(c.computed('input[type="number"]','background-color'),'darkorange')},
  {id:'c',label:'Il campo data ha sfondo darkorange',test:c=>c.sameColor(c.computed('input[type="date"]','background-color'),'darkorange')},
  {id:'d',label:'La textarea ha sfondo darkorange',test:c=>c.sameColor(c.computed('textarea','background-color'),'darkorange')},
  {id:'e',label:'Tutti e quattro hanno testo white',test:c=>['input[type="text"]','input[type="number"]','input[type="date"]','textarea']
    .every(s=>c.sameColor(c.computed(s,'color'),'white'))},
  {id:'f',label:'Il pulsante di invio non è stato incluso',test:c=>!c.sameColor(c.computed('input[type="submit"]','background-color'),'darkorange')}],
 solution:'input[type="text"],\ninput[type="number"],\ninput[type="date"],\ntextarea {\n  background-color: darkorange;\n  color: white;\n}',
 why:'La virgola separa selettori indipendenti che condividono lo stesso blocco: è il modo di evitare quattro regole identiche.'},

{id:'m020',lang:'css',topic:'css-selettori',title:'Figli diretti',
 brief:'Solo i paragrafi che sono figli DIRETTI della `<form>` diventano di colore Dark orange. I paragrafi più interni devono restare invariati.',
 html:'<form><p id="p1">diretto</p><fieldset><p id="p2">annidato</p></fieldset></form>',starter:'',
 checks:[
  {id:'a',label:'Il paragrafo figlio diretto è darkorange',test:c=>c.sameColor(c.computedOn(c.q('#p1'),'color'),'darkorange')},
  {id:'b',label:'Il paragrafo annidato NON è darkorange',test:c=>!c.sameColor(c.computedOn(c.q('#p2'),'color'),'darkorange')},
  {id:'c',label:'E\' stato usato il combinatore di figlio `>`',test:c=>c.rules().some(r=>/form\s*>\s*p/.test(r.selectorText))}],
 solution:'form > p {\n  color: darkorange;\n}',
 why:'Lo spazio seleziona i discendenti a qualunque profondita\'; `>` solo i figli diretti.'},

/* ============================ JavaScript ============================ */
{id:'m021',lang:'js',topic:'js-dom',title:'Reagire al clic',
 brief:'Al clic sul pulsante con id `b`, scrivere il testo "premuto" dentro il `<p id="out">`.',
 html:'<button id="b">Premi</button><p id="out"></p>',starter:'',
 run:async c=>{c.click('#b');await c.wait(60);},
 checks:[
  {id:'a',label:'Dopo il clic il paragrafo contiene "premuto"',test:c=>c.text(c.q('#out'))==='premuto'},
  {id:'b',label:'Il gestore è registrato con `addEventListener`',test:c=>/addEventListener/.test(c.raw)},
  {id:'c',label:'L\'esecuzione non produce errori',test:c=>{var e=c.errors();return e.length===0||{ok:false,why:e[0].text};}}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  document.getElementById("out").textContent = "premuto";\n});',
 why:'Lo schema base: selezione dell\'elemento, registrazione del gestore, modifica del DOM.'},

{id:'m022',lang:'js',topic:'js-linguaggio',title:'Validare un intero positivo',
 brief:'Al clic sul pulsante, leggere il valore del campo `#n`. Se non è un numero intero positivo, scrivere "non valido" nel `<p id="out">`; altrimenti scrivervi il numero.',
 html:'<input type="text" id="n" value="7"><button id="b">Controlla</button><p id="out"></p>',starter:'',
 run:async c=>{
   c.click('#b');await c.wait(60);c._v7=c.text(c.q('#out'));
   c.setValue('#n','3.5');c.click('#b');await c.wait(60);c._vd=c.text(c.q('#out'));
   c.setValue('#n','-2');c.click('#b');await c.wait(60);c._vn=c.text(c.q('#out'));
   c.setValue('#n','abc');c.click('#b');await c.wait(60);c._va=c.text(c.q('#out'));},
 checks:[
  {id:'a',label:'Con "7" scrive 7',test:c=>c._v7==='7'||{ok:false,why:'ha scritto: "'+c._v7+'"'}},
  {id:'b',label:'Con "3.5" scrive "non valido"',test:c=>c._vd==='non valido'||{ok:false,why:'ha scritto: "'+c._vd+'"'}},
  {id:'c',label:'Con "-2" scrive "non valido"',test:c=>c._vn==='non valido'||{ok:false,why:'ha scritto: "'+c._vn+'"'}},
  {id:'d',label:'Con "abc" scrive "non valido"',test:c=>c._va==='non valido'||{ok:false,why:'ha scritto: "'+c._va+'"'}}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  const out = document.getElementById("out");\n  const n = Number(document.getElementById("n").value);\n  if (!Number.isInteger(n) || n <= 0) {\n    out.textContent = "non valido";\n    return;\n  }\n  out.textContent = n;\n});',
 why:'Attenzione a `parseInt`, che accetterebbe "3.5" (restituendo 3) e "12abc". `Number` più `Number.isInteger` è il controllo corretto.'},

{id:'m023',lang:'js',topic:'js-dom',title:'Creare un elemento',
 brief:'Al clic, aggiungere dentro il `<main>` un paragrafo con il testo "ciao". Usare `createElement`.',
 html:'<button id="b">Aggiungi</button><main></main>',starter:'',
 run:async c=>{c.click('#b');await c.wait(60);},
 checks:[
  {id:'a',label:'Nel `<main>` compare un `<p>`',test:c=>!!c.q('main p')},
  {id:'b',label:'Il paragrafo contiene "ciao"',test:c=>c.text(c.q('main p'))==='ciao'},
  {id:'c',label:'E\' stato usato `createElement`',test:c=>/createElement/.test(c.raw)},
  {id:'d',label:'E\' stato inserito nel documento con `appendChild` o `append`',test:c=>/append/.test(c.raw)}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  const p = document.createElement("p");\n  p.textContent = "ciao";\n  document.querySelector("main").appendChild(p);\n});',
 why:'Creare non basta: finche\' non si inserisce il nodo nell\'albero, non compare nella pagina.'},

{id:'m024',lang:'js',topic:'js-dom',title:'Elenco non ordinato da un oggetto',
 brief:'Al clic, costruire dentro il `<main>` un elenco NON ordinato con una voce per ogni proprietà dell\'oggetto `dati`, nella forma "chiave: valore".',
 html:'<button id="b">Mostra</button><main></main>',
 starter:'const dati = { nome: "Harry", casa: "Grifondoro", anno: 1980 };\n\n',
 run:async c=>{c.click('#b');await c.wait(80);},
 checks:[
  {id:'a',label:'Nel `<main>` compare una `<ul>`',test:c=>!!c.q('main ul')},
  {id:'b',label:'L\'elenco ha tre voci',test:c=>c.qa('main ul li').length===3},
  {id:'c',label:'Le voci hanno la forma "chiave: valore"',test:c=>{
    var t=c.qa('main ul li').map(l=>c.text(l));
    return t.length===3&&t[0].indexOf('nome: harry')>=0&&t[1].indexOf('casa: grifondoro')>=0&&t[2].indexOf('anno: 1980')>=0;}},
  {id:'d',label:'Non è stato usato un elenco ordinato',test:c=>c.qa('main ol').length===0}],
 solution:'const dati = { nome: "Harry", casa: "Grifondoro", anno: 1980 };\n\ndocument.getElementById("b").addEventListener("click", function () {\n  const ul = document.createElement("ul");\n  for (const k in dati) {\n    const li = document.createElement("li");\n    li.textContent = k + ": " + dati[k];\n    ul.appendChild(li);\n  }\n  document.querySelector("main").appendChild(ul);\n});',
 why:'`for...in` scorre le chiavi; il valore si ottiene con `dati[k]`. È lo schema richiesto dall\'esercizio 4 del compito.'},

{id:'m025',lang:'js',topic:'js-ajax',title:'Richiesta GET',
 brief:'Al clic, effettuare una richiesta GET al file `personaggio.json` e scrivere nel `<p id="out">` il valore della proprietà `nome` ricevuta.',
 html:'<button id="b">Leggi</button><p id="out"></p>',
 files:{'personaggio.json':{nome:'Harry Potter',casa:'Grifondoro'}},starter:'',
 run:async c=>{c.click('#b');await c.until(()=>c.text(c.q('#out')).length>0,1800);},
 checks:[
  {id:'a',label:'Parte una richiesta verso personaggio.json',test:c=>c.callTo(/personaggio\.json/).length>=1},
  {id:'b',label:'Il metodo usato è GET',test:c=>c.callTo(/personaggio\.json/,'GET').length>=1},
  {id:'c',label:'Il paragrafo contiene "Harry Potter"',test:c=>c.text(c.q('#out'))==='harry potter'},
  {id:'d',label:'L\'esecuzione non produce errori',test:c=>{var e=c.errors();return e.length===0||{ok:false,why:e[0].text};}}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  fetch("personaggio.json")\n    .then(function (r) { return r.json(); })\n    .then(function (d) {\n      document.getElementById("out").textContent = d.nome;\n    });\n});',
 why:'`fetch` senza secondo argomento esegue una GET. Il corpo si legge con `r.json()`, a sua volta asincrona.'},

{id:'m026',lang:'js',topic:'js-ajax',title:'Richiesta POST',
 brief:'Al clic, effettuare una richiesta POST al file `personaggi.json` inviando nel corpo il JSON `{"id": 1}`. Alla risposta, scrivere nel `<p id="out">` quanti personaggi sono stati ricevuti.',
 html:'<button id="b">Invia</button><p id="out"></p>',
 files:{'personaggi.json':[{nome:'Harry'},{nome:'Ron'},{nome:'Hermione'}]},starter:'',
 run:async c=>{c.click('#b');await c.until(()=>c.text(c.q('#out')).length>0,1800);},
 checks:[
  {id:'a',label:'La richiesta usa il metodo POST',test:c=>c.callTo(/personaggi\.json/,'POST').length>=1},
  {id:'b',label:'La richiesta trasporta un corpo',test:c=>{var k=c.callTo(/personaggi\.json/,'POST');return k.length>0&&!!k[0].body;}},
  {id:'c',label:'Il corpo contiene l\'identificativo 1',test:c=>{var k=c.callTo(/personaggi\.json/,'POST');
    return k.length>0&&/"?id"?\s*[:=]\s*1/.test(String(k[0].body));}},
  {id:'d',label:'Il paragrafo riporta 3',test:c=>c.text(c.q('#out'))==='3'}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  fetch("personaggi.json", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify({ id: 1 })\n  })\n    .then(function (r) { return r.json(); })\n    .then(function (d) {\n      document.getElementById("out").textContent = d.length;\n    });\n});',
 why:'Per una POST servono `method` e `body`; l\'oggetto va serializzato con `JSON.stringify`.'},

{id:'m027',lang:'js',topic:'js-dom',title:'Cella di intestazione accessibile',
 brief:'Al clic, inserire nel `<main>` una tabella con una sola riga contenente due celle di INTESTAZIONE di colonna: "Nome" e "Casa".',
 html:'<button id="b">Crea</button><main></main>',starter:'',
 run:async c=>{c.click('#b');await c.wait(80);},
 checks:[
  {id:'a',label:'Nel `<main>` compare una tabella con una riga',test:c=>c.qa('main table tr').length===1},
  {id:'b',label:'La riga contiene due `<th>`',test:c=>c.qa('main table tr th').length===2},
  {id:'c',label:'Entrambi i `<th>` hanno `scope="col"`',test:c=>c.qa('main table th').every(x=>x.getAttribute('scope')==='col')},
  {id:'d',label:'I testi sono "Nome" e "Casa"',test:c=>c.qa('main table th').map(x=>c.norm(x.textContent)).join('|')==='nome|casa'}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  const t = document.createElement("table");\n  const tr = document.createElement("tr");\n  ["Nome", "Casa"].forEach(function (x) {\n    const th = document.createElement("th");\n    th.setAttribute("scope", "col");\n    th.textContent = x;\n    tr.appendChild(th);\n  });\n  t.appendChild(tr);\n  document.querySelector("main").appendChild(t);\n});',
 why:'`setAttribute("scope", "col")` è ciò che rende accessibile la tabella costruita da programma.'},

{id:'m028',lang:'js',topic:'js-eventi',title:'Invio intercettato',
 brief:'Intercettare l\'invio della form impedendo il ricaricamento della pagina, e scrivere nel `<p id="out">` il valore del campo `#q`.',
 html:'<form id="f"><input type="text" id="q" value="Harry"><button type="submit">Cerca</button></form><p id="out"></p>',
 starter:'',
 run:async c=>{
   try{c.q('#f').dispatchEvent(new c.win.Event('submit',{bubbles:true,cancelable:true}));}catch(e){}
   await c.wait(80);},
 checks:[
  {id:'a',label:'E\' registrato un gestore sull\'evento `submit`',test:c=>/["']submit["']/.test(c.raw)},
  {id:'b',label:'Viene chiamato `preventDefault()`',test:c=>/preventDefault\s*\(\s*\)/.test(c.raw)},
  {id:'c',label:'Il paragrafo contiene "Harry"',test:c=>c.text(c.q('#out'))==='harry'}],
 solution:'document.getElementById("f").addEventListener("submit", function (e) {\n  e.preventDefault();\n  document.getElementById("out").textContent = document.getElementById("q").value;\n});',
 why:'Senza `preventDefault()` il browser invia la form e ricarica la pagina, annullando ogni effetto del codice.'},

{id:'m029',lang:'js',topic:'js-dom',title:'Svuotare prima di riempire',
 brief:'Al clic, il `<main>` deve contenere UN SOLO paragrafo con il testo "aggiornato", anche se il pulsante viene premuto più volte.',
 html:'<button id="b">Aggiorna</button><main><p>vecchio</p></main>',starter:'',
 run:async c=>{c.click('#b');await c.wait(50);c.click('#b');await c.wait(50);c.click('#b');await c.wait(60);},
 checks:[
  {id:'a',label:'Dopo tre clic il `<main>` contiene un solo paragrafo',test:c=>{
    var n=c.qa('main p').length;return n===1||{ok:false,why:'ne contiene '+n};}},
  {id:'b',label:'Il paragrafo contiene "aggiornato"',test:c=>c.text(c.q('main p'))==='aggiornato'},
  {id:'c',label:'Il contenuto iniziale "vecchio" è stato rimosso',test:c=>c.text(c.q('main')).indexOf('vecchio')<0}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  const main = document.querySelector("main");\n  main.innerHTML = "";\n  const p = document.createElement("p");\n  p.textContent = "aggiornato";\n  main.appendChild(p);\n});',
 why:'Difetto classico: senza svuotare, ogni clic accoda un nuovo blocco. Si nota solo premendo due volte.'},

{id:'m030',lang:'js',topic:'js-ajax',title:'Gestire l\'errore della richiesta',
 brief:'Al clic, richiedere il file `mancante.json` (che non esiste). Se la risposta non è andata a buon fine, scrivere nel `<p id="out">` il testo "errore"; altrimenti scrivervi il nome ricevuto.',
 html:'<button id="b">Leggi</button><p id="out"></p>',
 files:{'presente.json':{nome:'Harry'}},starter:'',
 run:async c=>{c.click('#b');await c.until(()=>c.text(c.q('#out')).length>0,1800);},
 checks:[
  {id:'a',label:'Parte una richiesta verso mancante.json',test:c=>c.callTo(/mancante\.json/).length>=1},
  {id:'b',label:'Il paragrafo contiene "errore"',test:c=>c.text(c.q('#out'))==='errore'||{ok:false,why:'contiene: "'+c.text(c.q('#out'))+'"'}},
  {id:'c',label:'L\'esito viene distinto controllando `response.ok` oppure `status`',test:c=>/\.ok\b/.test(c.raw)||/status/.test(c.raw)}],
 solution:'document.getElementById("b").addEventListener("click", function () {\n  const out = document.getElementById("out");\n  fetch("mancante.json")\n    .then(function (r) {\n      if (!r.ok) { throw new Error("errore " + r.status); }\n      return r.json();\n    })\n    .then(function (d) { out.textContent = d.nome; })\n    .catch(function () { out.textContent = "errore"; });\n});',
 why:'`fetch` NON rifiuta la Promise sugli errori HTTP: un 404 arriva regolarmente al `.then`. Va controllato `response.ok`.'}

];
