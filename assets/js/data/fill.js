/* Fase 1 - completamento di frammenti. I segnaposto sono nella forma __1__.
   `bank` è l'elenco di tessere proposte (soluzioni più distrattori). */
PREP.data.fill = [

/* ---------------- HTML ---------------- */
{id:'fi001',lang:'html',topic:'html-form',
 dir:'Completa l\'associazione fra etichetta e campo di testo.',
 code:'<label __1__="citta">Città</label>\n<input type="text" __2__="citta" __3__="citta">',
 sol:['for','id','name'], bank:['for','id','name','class','label','value'],
 why:'`for` della label deve valere l\'`id` del controllo. Il `name` è un\'altra cosa: è la chiave con cui il dato viene inviato al server.'},

{id:'fi002',lang:'html',topic:'html-form',
 dir:'Completa il campo che accetta al massimo 5 passeggeri.',
 code:'<input type="__1__" id="pax" name="pax" min="1" __2__="5">',
 sol:['number','max'], bank:['number','max','text','maxlength','limit','size'],
 why:'`max` limita il valore, `maxlength` il numero di caratteri: su `type="number"` `maxlength` non ha alcun effetto.'},

{id:'fi003',lang:'html',topic:'a11y',
 dir:'Completa il gruppo di pulsanti radio con il suo titolo accessibile.',
 code:'<__1__>\n  <__2__>Tipo di viaggio</__2__>\n  <input type="radio" id="ar" __3__="viaggio" value="ar">\n  <label for="ar">Andata e ritorno</label>\n</__1__>',
 sol:['fieldset','legend','name'], bank:['fieldset','legend','name','section','caption','id'],
 why:'`<fieldset>` raggruppa, `<legend>` intitola il gruppo, e lo stesso `name` rende i radio mutuamente esclusivi.'},

{id:'fi004',lang:'html',topic:'html-struttura',
 dir:'Completa la testata del documento.',
 code:'<!DOCTYPE __1__>\n<html __2__="it">\n<head>\n  <meta __3__="utf-8">\n  <title>Prenotazione Volo</title>\n</head>',
 sol:['html','lang','charset'], bank:['html','lang','charset','html5','language','encoding'],
 why:'Il doctype HTML5 è `<!DOCTYPE html>`; `lang` sull\'elemento `<html>` soddisfa il criterio WCAG 3.1.1 di livello A.'},

{id:'fi005',lang:'html',topic:'html-tabelle',
 dir:'Completa la tabella rendendola accessibile.',
 code:'<table>\n  <__1__>Voli disponibili</__1__>\n  <tr>\n    <__2__ __3__="col">Partenza</__2__>\n    <__2__ __3__="col">Arrivo</__2__>\n  </tr>\n</table>',
 sol:['caption','th','scope'], bank:['caption','th','scope','title','td','headers'],
 why:'`<caption>` intitola la tabella e deve essere il primo figlio; `<th scope="col">` dichiara che la cella intesta una colonna.'},

{id:'fi006',lang:'html',topic:'html-form',
 dir:'Completa i due pulsanti della form.',
 code:'<button type="__1__">Invia</button>\n<button type="__2__">Cancella</button>',
 sol:['submit','reset'], bank:['submit','reset','button','clear','send','cancel'],
 why:'I soli tipi ammessi sono `submit`, `reset` e `button`. Senza `type`, un `<button>` vale `submit`.'},

{id:'fi007',lang:'html',topic:'html-form',
 dir:'Completa l\'elenco a discesa.',
 code:'<label for="cl">Classe</label>\n<__1__ id="cl" name="classe">\n  <__2__ __3__="economy">Economy</__2__>\n  <__2__ __3__="business">Business</__2__>\n</__1__>',
 sol:['select','option','value'], bank:['select','option','value','datalist','item','name'],
 why:'Il valore inviato è quello dell\'attributo `value` dell\'`<option>` selezionata; il testo interno è solo ciò che l\'utente legge.'},

{id:'fi008',lang:'html',topic:'a11y',
 dir:'Completa le due immagini: la prima informativa, la seconda decorativa.',
 code:'<img src="aereo.png" __1__="Aereo in decollo">\n<img src="onda.png" __1__="__2__">',
 sol:['alt',''], bank:['alt','','decorativa','title','src','immagine'],
 why:'`alt` va sempre dichiarato. Se l\'immagine è decorativa il valore corretto è la stringa VUOTA: così lo screen reader la ignora.'},

{id:'fi009',lang:'html',topic:'html-struttura',
 dir:'Completa i riferimenti ai file esterni.',
 code:'<link __1__="stylesheet" __2__="stile.css">\n<script __3__="soluzione.js"></script>',
 sol:['rel','href','src'], bank:['rel','href','src','type','link','source'],
 why:'`<link>` usa `href`, `<script>` e `<img>` usano `src`. L\'attributo `rel="stylesheet"` dichiara il tipo di relazione.'},

{id:'fi010',lang:'html',topic:'html-form',
 dir:'Completa l\'apertura della form e la casella di controllo.',
 code:'<form action="prenota" __1__="post">\n  <input type="__2__" id="flex" name="flex" value="si">\n  <label __3__="flex">Date flessibili</label>\n</form>',
 sol:['method','checkbox','for'], bank:['method','checkbox','for','type','radio','id'],
 why:'Una singola opzione attivabile in modo indipendente è una checkbox, non un radio: i radio hanno senso solo a gruppi di almeno due.'},

/* ---------------- CSS ---------------- */
{id:'fi011',lang:'css',topic:'css-box',
 dir:'Completa il bordo tratteggiato arancione scuro di 5 pixel.',
 code:'form {\n  __1__: 5px __2__ __3__;\n}',
 sol:['border','dashed','darkorange'], bank:['border','dashed','darkorange','outline','dotted','orange'],
 why:'`dashed` è tratteggiato, `dotted` puntinato. `outline` non occupa spazio nel box model e non è un bordo.'},

{id:'fi012',lang:'css',topic:'css-box',
 dir:'Completa l\'ombra orientata a sinistra e in alto, offset 5px, sfocatura 10px, arancione.',
 code:'fieldset {\n  __1__: __2__ __3__ 10px orange;\n}',
 sol:['box-shadow','-5px','-5px'], bank:['box-shadow','-5px','-5px','text-shadow','5px','10px'],
 why:'L\'ordine è `offset-x offset-y blur color`. Il segno negativo sposta a sinistra sull\'asse x e verso l\'alto sull\'asse y.'},

{id:'fi013',lang:'css',topic:'css-testo',
 dir:'Completa: stesso carattere Arial per tutto, dimensione al 100%.',
 code:'body, input, select, textarea, button {\n  __1__: Arial, sans-serif;\n  __2__: __3__;\n}',
 sol:['font-family','font-size','100%'], bank:['font-family','font-size','100%','font','text-size','16px'],
 why:'I controlli di form non ereditano il carattere dal `body`: vanno elencati esplicitamente, altrimenti restano con il font predefinito del browser.'},

{id:'fi014',lang:'css',topic:'css-layout',
 dir:'Completa: la form larga il 90% con padding sinistro del 5%.',
 code:'form {\n  __1__: 90%;\n  __2__: 5%;\n}',
 sol:['width','padding-left'], bank:['width','padding-left','margin-left','height','padding','left'],
 why:'`padding-left` è lo spazio interno a sinistra. Anche i padding percentuali si calcolano sulla larghezza del contenitore.'},

{id:'fi015',lang:'css',topic:'css-selettori',
 dir:'Completa lo scambio dei colori al passaggio del puntatore.',
 code:'button {\n  background-color: darkorange;\n  color: white;\n}\nbutton__1__ {\n  background-color: __2__;\n  color: __3__;\n}',
 sol:[':hover','white','darkorange'], bank:[':hover','white','darkorange','.hover',':focus','orange'],
 why:'"I colori si scambiano" significa scrivere nello stato `:hover` gli stessi due valori invertiti. Conviene dichiarare anche `:focus` per chi naviga da tastiera.'},

{id:'fi016',lang:'css',topic:'css-selettori',
 dir:'Completa il selettore che colpisce i soli campi di testo.',
 code:'input__1__type__2__"text"__3__ {\n  background-color: darkorange;\n  color: white;\n}',
 sol:['[','=',']'], bank:['[','=',']','(',':',')'],
 why:'La forma è `elemento[attributo="valore"]`. Le parentesi quadre sono la sintassi dei selettori di attributo.'},

{id:'fi017',lang:'css',topic:'css-selettori',
 dir:'Completa: colore del testo di tutte le etichette.',
 code:'__1__ {\n  __2__: darkorange;\n}',
 sol:['label','color'], bank:['label','color','.label','background-color','text-color','legend'],
 why:'`label` è un selettore di elemento e colpisce tutte le `<label>` del documento. Il colore del testo si imposta con `color`.'},

{id:'fi018',lang:'css',topic:'css-box',
 dir:'Completa il bordo pieno di 2 pixel del fieldset, con il testo dello stesso colore.',
 code:'fieldset {\n  border: 2px __1__ darkorange;\n  __2__: darkorange;\n}',
 sol:['solid','color'], bank:['solid','color','dashed','background-color','none','border-color'],
 why:'`solid` è la linea continua. Impostando `color` sul fieldset, il valore viene ereditato anche dalla `<legend>` e dal testo interno.'},

{id:'fi019',lang:'css',topic:'css-cascata',
 dir:'Completa il collegamento al foglio di stile esterno.',
 code:'<head>\n  <__1__ rel="__2__" href="stile.css">\n</head>',
 sol:['link','stylesheet'], bank:['link','stylesheet','style','css','script','text/css'],
 why:'`<style>` contiene CSS scritto nel documento; per riferire un file esterno serve `<link rel="stylesheet" href="...">`.'},

{id:'fi020',lang:'css',topic:'css-selettori',
 dir:'Completa i tre combinatori.',
 code:'form p     { }   /* discendenti */\nform __1__ p { }   /* soli figli diretti */\nh2 __2__ p   { }   /* il paragrafo subito dopo un h2 */',
 sol:['>','+'], bank:['>','+','~','*',' ','&'],
 why:'`>` è il figlio diretto, `+` il fratello immediatamente successivo, `~` un fratello successivo qualunque.'},

/* ---------------- JavaScript ---------------- */
{id:'fi021',lang:'js',topic:'js-dom',
 dir:'Completa il recupero dell\'elemento e la registrazione del gestore.',
 code:'const btn = document.__1__("leggi");\nbtn.__2__("__3__", function () {\n  console.log("premuto");\n});',
 sol:['getElementById','addEventListener','click'], bank:['getElementById','addEventListener','click','querySelectorAll','onclick','onClick'],
 why:'Il nome dell\'evento è `click`, senza prefisso `on`, e va passato il riferimento alla funzione, non la sua invocazione.'},

{id:'fi022',lang:'js',topic:'js-linguaggio',
 dir:'Completa il controllo "intero positivo" sul valore letto dal campo.',
 code:'const n = __1__(input.__2__);\nif (!Number.__3__(n) || n <= 0) {\n  return;\n}',
 sol:['Number','value','isInteger'], bank:['Number','value','isInteger','String','text','isNumber'],
 why:'Il valore di un `<input>` è sempre una stringa: va convertito con `Number(...)`. `Number.isInteger` esclude i decimali.'},

{id:'fi023',lang:'js',topic:'js-ajax',
 dir:'Completa la richiesta GET e la lettura del corpo.',
 code:'__1__("personaggio.json")\n  .then(function (r) { return r.__2__(); })\n  .then(function (dati) { mostra(dati); })\n  .__3__(function (e) { console.error(e); });',
 sol:['fetch','json','catch'], bank:['fetch','json','catch','ajax','parse','error'],
 why:'`fetch` senza opzioni esegue una GET. `response.json()` è a sua volta asincrona, da cui il secondo `.then`.'},

{id:'fi024',lang:'js',topic:'js-ajax',
 dir:'Completa la richiesta POST.',
 code:'fetch("personaggi.json", {\n  __1__: "__2__",\n  headers: { "Content-Type": "application/json" },\n  __3__: JSON.stringify({ id: 1 })\n});',
 sol:['method','POST','body'], bank:['method','POST','body','type','GET','data'],
 why:'Le chiavi dell\'oggetto di opzioni sono `method`, `headers` e `body`. `type` e `data` appartengono ad altre librerie.'},

{id:'fi025',lang:'js',topic:'js-dom',
 dir:'Completa la costruzione di un elenco non ordinato.',
 code:'const ul = document.__1__("ul");\nfor (const k in dati) {\n  const li = document.__1__("li");\n  li.__2__ = k + ": " + dati[k];\n  ul.__3__(li);\n}\ndocument.querySelector("main").__3__(ul);',
 sol:['createElement','textContent','appendChild'], bank:['createElement','textContent','appendChild','newElement','innerText','add'],
 why:'`createElement` crea il nodo scollegato, `appendChild` lo inserisce nell\'albero: finche\' non viene inserito non compare nella pagina.'},

{id:'fi026',lang:'js',topic:'js-dom',
 dir:'Completa la cella di intestazione accessibile.',
 code:'const th = document.createElement("__1__");\nth.__2__("scope", "__3__");\nth.textContent = "Nome";',
 sol:['th','setAttribute','col'], bank:['th','setAttribute','col','td','setAttr','row'],
 why:'Per una intestazione di colonna serve `<th scope="col">`. Se l\'intestazione è la prima cella di una riga, il valore è `row`.'},

{id:'fi027',lang:'js',topic:'js-eventi',
 dir:'Completa l\'invio della form intercettato senza ricaricare la pagina.',
 code:'form.addEventListener("__1__", function (e) {\n  e.__2__();\n  console.log(e.__3__);\n});',
 sol:['submit','preventDefault','target'], bank:['submit','preventDefault','target','click','stopPropagation','source'],
 why:'`preventDefault()` annulla l\'azione predefinita (l\'invio); `stopPropagation()` è un\'altra cosa e ferma la risalita dell\'evento.'},

{id:'fi028',lang:'js',topic:'js-ajax',
 dir:'Completa la richiesta con XMLHttpRequest.',
 code:'const xhr = new __1__();\nxhr.__2__("GET", "personaggio.json");\nxhr.onload = function () {\n  if (xhr.__3__ === 200) {\n    const dati = JSON.parse(xhr.responseText);\n  }\n};\nxhr.send();',
 sol:['XMLHttpRequest','open','status'], bank:['XMLHttpRequest','open','status','HttpRequest','connect','readyState'],
 why:'`readyState === 4` dice che il trasferimento è concluso, `status === 200` che l\'esito HTTP è positivo. Dentro `onload` il readyState è già 4.'},

{id:'fi029',lang:'js',topic:'js-dom',
 dir:'Completa lo svuotamento e il riempimento del contenitore.',
 code:'const main = document.__1__("main");\nmain.__2__ = "";\nmain.__3__(nuovaTabella);',
 sol:['querySelector','innerHTML','appendChild'], bank:['querySelector','innerHTML','appendChild','querySelectorAll','textContent','append'],
 why:'`querySelector` restituisce un solo elemento. Assegnare la stringa vuota a `innerHTML` è il modo più rapido per ripulire un contenitore prima di ricostruirlo.'},

{id:'fi030',lang:'js',topic:'js-linguaggio',
 dir:'Completa le due conversioni da e verso JSON.',
 code:'const oggetto = JSON.__1__(testo);\nconst stringa = JSON.__2__(oggetto);',
 sol:['parse','stringify'], bank:['parse','stringify','toObject','toString','decode','encode'],
 why:'Si analizza (parse) il testo ricevuto dal server e si serializza (stringify) l\'oggetto da spedire nel corpo di una POST.'}

];
