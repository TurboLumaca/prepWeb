/* Fase 2 - scelta progettuale motivata fra implementazioni alternative.
   Tutte le alternative "funzionano": si valuta semantica, accessibilità
   e conformità alla specifica. */
PREP.data.choice = [

{id:'ch001',lang:'html',topic:'a11y',
 q:'La consegna chiede di consentire la scelta fra viaggio di andata e ritorno e viaggio di sola andata. Quale implementazione è preferibile?',
 alts:[
  {t:'A',code:'<fieldset>\n  <legend>Tipo di viaggio</legend>\n  <input type="radio" id="ar" name="viaggio" value="ar">\n  <label for="ar">Andata e ritorno</label>\n  <input type="radio" id="sa" name="viaggio" value="sa">\n  <label for="sa">Solo andata</label>\n</fieldset>'},
  {t:'B',code:'<p>Tipo di viaggio</p>\n<input type="radio" id="ar" name="viaggio" value="ar">\n<label for="ar">Andata e ritorno</label>\n<input type="radio" id="sa" name="viaggio" value="sa">\n<label for="sa">Solo andata</label>'},
  {t:'C',code:'<label for="viaggio">Tipo di viaggio</label>\n<select id="viaggio" name="viaggio">\n  <option value="ar">Andata e ritorno</option>\n  <option value="sa">Solo andata</option>\n</select>'}],
 a:0,
 why:'A. La consegna parla di "un insieme di controlli": sono i radio. B ha gli stessi controlli ma il titolo è un semplice `<p>`, che non viene associato al gruppo da nessuna tecnologia assistiva. C funziona ed è accessibile, ma sostituisce un insieme di controlli con un singolo controllo: si scosta dalla specifica, e all\'esame conta la conformità alla specifica.'},

{id:'ch002',lang:'html',topic:'a11y',
 q:'Due modi di etichettare un campo. Quale scegliere?',
 alts:[
  {t:'A',code:'<label for="nome">Nome</label>\n<input type="text" id="nome" name="nome">'},
  {t:'B',code:'<input type="text" name="nome" placeholder="Nome">'}],
 a:0,
 why:'A. Il `placeholder` non è un\'etichetta: sparisce appena si inizia a digitare, ha contrasto basso, non è annunciato in modo affidabile e lascia il campo senza nome accessibile. Usarlo al posto della `<label>` è una violazione di livello A (4.1.2). Il placeholder può semmai affiancare la label come suggerimento di formato.'},

{id:'ch003',lang:'html',topic:'html-semantica',
 q:'Si deve marcare l\'intestazione di primo livello "Prenotazione Volo". Quale soluzione è corretta?',
 alts:[
  {t:'A',code:'<h1>Prenotazione Volo</h1>'},
  {t:'B',code:'<div class="titolo-grande">Prenotazione Volo</div>'},
  {t:'C',code:'<p><strong><big>Prenotazione Volo</big></strong></p>'}],
 a:0,
 why:'A. Solo `<h1>` dichiara "questa è l\'intestazione di primo livello": gli screen reader costruiscono su queste informazioni la navigazione rapida per intestazioni. B e C ottengono lo stesso aspetto con il CSS ma nessuna semantica; `<big>` per giunta non esiste più in HTML5.'},

{id:'ch004',lang:'html',topic:'html-form',
 q:'La consegna chiede "uno o più controlli per consentire l\'indicazione di date flessibili". Quale implementazione è più adeguata?',
 alts:[
  {t:'A',code:'<input type="checkbox" id="flex" name="flex" value="si">\n<label for="flex">Date flessibili (+/- 3 giorni)</label>'},
  {t:'B',code:'<input type="radio" id="flex" name="flex" value="si">\n<label for="flex">Date flessibili</label>'},
  {t:'C',code:'<input type="text" id="flex" name="flex">\n<label for="flex">Date flessibili</label>'}],
 a:0,
 why:'A. Si tratta di una singola opzione attivabile o meno, indipendente dalle altre: è esattamente una checkbox. Un radio isolato è un errore, perché una volta selezionato non si può più deselezionare e non ha alternative nel gruppo. Un campo di testo libero non esprime una scelta binaria.'},

{id:'ch005',lang:'html',topic:'html-struttura',
 q:'Due modi di dividere la form nelle due parti "Dati Anagrafici" e "Dati Volo". Quale è preferibile?',
 alts:[
  {t:'A',code:'<form>\n  <fieldset>\n    <legend>Dati Anagrafici</legend>\n    ...\n  </fieldset>\n  <fieldset>\n    <legend>Dati Volo</legend>\n    ...\n  </fieldset>\n</form>'},
  {t:'B',code:'<form>\n  <h2>Dati Anagrafici</h2>\n  ...\n</form>\n<form>\n  <h2>Dati Volo</h2>\n  ...\n</form>'}],
 a:0,
 why:'A. La consegna dice "un form diviso in due parti": la form resta UNA, e le parti si esprimono con due `<fieldset>`. B spezza la form in due, quindi i dati verrebbero inviati separatamente: si perde il requisito principale, oltre al titolo accessibile dei gruppi.'},

{id:'ch006',lang:'html',topic:'a11y',
 q:'Come conviene marcare i dati di un personaggio ricevuti dal server, quando la consegna chiede "sotto forma di elenco non ordinato"?',
 alts:[
  {t:'A',code:'<ul>\n  <li>Nome: Harry Potter</li>\n  <li>Casa: Grifondoro</li>\n</ul>'},
  {t:'B',code:'<div>\n  Nome: Harry Potter<br>\n  Casa: Grifondoro<br>\n</div>'},
  {t:'C',code:'<table>\n  <tr><td>Nome</td><td>Harry Potter</td></tr>\n</table>'}],
 a:0,
 why:'A. La consegna chiede letteralmente un elenco non ordinato: `<ul>` con `<li>`. B produce lo stesso aspetto ma senza struttura (lo screen reader non annuncia "elenco di 2 elementi"). C usa una tabella per dati che non sono tabellari, e comunque contraddice la specifica.'},

{id:'ch007',lang:'css',topic:'css-selettori',
 q:'Il requisito è: "i controlli di testo hanno sfondo darkorange e testo white". Quale foglio di stile è corretto?',
 alts:[
  {t:'A',code:'input[type="text"],\ninput[type="number"],\ninput[type="date"],\ntextarea {\n  background-color: darkorange;\n  color: white;\n}'},
  {t:'B',code:'input {\n  background-color: darkorange;\n  color: white;\n}'},
  {t:'C',code:'.campo-testo {\n  background-color: darkorange;\n  color: white;\n}'}],
 a:0,
 why:'A. B colpisce anche radio, checkbox e pulsanti, cioe\' controlli che non sono "di testo", e finisce per contraddire la regola separata sui bottoni. C funzionerebbe, ma impone di aggiungere una classe a ogni campo dell\'HTML: se la consegna vieta di modificare l\'HTML, o se l\'HTML è già consegnato, non è praticabile.'},

{id:'ch008',lang:'css',topic:'css-cascata',
 q:'Due modi di ottenere lo stesso risultato visivo. Quale è preferibile in un compito d\'esame che chiede un file .css esterno?',
 alts:[
  {t:'A',code:'/* stile.css */\nform {\n  width: 90%;\n  padding-left: 5%;\n}'},
  {t:'B',code:'<form style="width: 90%; padding-left: 5%;">'}],
 a:0,
 why:'A. La consegna chiede esplicitamente un file `.css` esterno. Oltre a questo, lo stile in linea mescola presentazione e struttura, non è riutilizzabile, non si può sostituire per dispositivi diversi ed è scavalcabile solo con `!important`.'},

{id:'ch009',lang:'css',topic:'css-selettori',
 q:'Come esprimere "sull\'hover, colore di sfondo e di foreground si scambiano"?',
 alts:[
  {t:'A',code:'button {\n  background-color: darkorange;\n  color: white;\n}\nbutton:hover,\nbutton:focus {\n  background-color: white;\n  color: darkorange;\n}'},
  {t:'B',code:'button {\n  background-color: darkorange;\n  color: white;\n}\nbutton:hover {\n  filter: invert(1);\n}'}],
 a:0,
 why:'A. È la traduzione letterale della specifica e i due colori restano quelli richiesti. B produce un effetto casualmente simile ma i colori risultanti non sono darkorange e white, e non è ciò che la consegna chiede. In più A dichiara anche `:focus`, così l\'effetto è percepibile anche navigando da tastiera.'},

{id:'ch010',lang:'css',topic:'css-testo',
 q:'Requisito: "tutti i font devono avere lo stesso font-family, che deve essere Arial; la dimensione deve essere del 100%". Quale versione lo soddisfa?',
 alts:[
  {t:'A',code:'body, input, select, textarea, button {\n  font-family: Arial, sans-serif;\n  font-size: 100%;\n}'},
  {t:'B',code:'* {\n  font-family: Arial;\n  font-size: 100%;\n}'},
  {t:'C',code:'body {\n  font-family: Arial, sans-serif;\n  font-size: 100%;\n}'}],
 a:0,
 why:'A. C non raggiunge i controlli di form, che non ereditano il carattere dal `body`. B funziona ma applica `font-size: 100%` a OGNI elemento, azzerando la scala relativa di intestazioni e testi piccoli: cambia il rendering ben oltre la richiesta. A è mirata e completa; la famiglia generica finale è un ripiego prudente se Arial manca.'},

{id:'ch011',lang:'js',topic:'js-dom',
 q:'Si devono inserire nel `<main>` i dati ricevuti dal server. Quale versione è preferibile?',
 alts:[
  {t:'A',code:'const li = document.createElement("li");\nli.textContent = chiave + ": " + valore;\nul.appendChild(li);'},
  {t:'B',code:'ul.innerHTML += "<li>" + chiave + ": " + valore + "</li>";'}],
 a:0,
 view:'js',
 why:'A. `textContent` neutralizza automaticamente i caratteri speciali, quindi un dato che contenesse `<` non può iniettare marcatura. B ricostruisce inoltre l\'intero contenuto a ogni giro, perdendo eventuali gestori di evento già registrati sui nodi esistenti.'},

{id:'ch012',lang:'js',topic:'js-eventi',
 q:'Quale modo di registrare il gestore del clic è preferibile?',
 alts:[
  {t:'A',code:'btn.addEventListener("click", leggiPersonaggio);'},
  {t:'B',code:'btn.onclick = leggiPersonaggio;'},
  {t:'C',code:'<button onclick="leggiPersonaggio()">Leggi</button>'}],
 a:0,
 view:'js',
 why:'A. Consente più gestori sullo stesso evento senza sovrascriverli, permette di rimuoverli e di configurare la fase di propagazione. B ne ammette uno solo. C mescola comportamento e struttura dentro l\'HTML, e in un compito che vieta di modificare il file HTML non è nemmeno praticabile.'},

{id:'ch013',lang:'js',topic:'js-ajax',
 q:'Due modi di gestire la risposta. Quale è più corretto?',
 alts:[
  {t:'A',code:'fetch(url)\n  .then(function (r) {\n    if (!r.ok) { throw new Error("errore " + r.status); }\n    return r.json();\n  })\n  .then(mostra)\n  .catch(function (e) { mostraErrore(e.message); });'},
  {t:'B',code:'fetch(url)\n  .then(function (r) { return r.json(); })\n  .then(mostra);'}],
 a:0,
 view:'js',
 why:'A. `fetch` NON rifiuta la Promise sugli errori HTTP: una risposta 404 arriva regolarmente al `.then`, e senza il controllo su `r.ok` si prova a interpretare come JSON una pagina di errore. La consegna dice "in caso di successo": occorre quindi distinguere il successo dal fallimento, e il `.catch` rende visibile il caso d\'errore.'},

{id:'ch014',lang:'js',topic:'js-dom',
 q:'Si deve ricostruire il contenuto del `<main>` a ogni richiesta. Quale approccio è corretto?',
 alts:[
  {t:'A',code:'const main = document.querySelector("main");\nmain.innerHTML = "";\nmain.appendChild(nuovoContenuto);'},
  {t:'B',code:'const main = document.querySelector("main");\nmain.appendChild(nuovoContenuto);'}],
 a:0,
 view:'js',
 why:'A. Senza lo svuotamento, a ogni clic il nuovo elenco si accoda ai precedenti e la pagina accumula copie. È un difetto che si nota solo premendo il pulsante due volte: conviene provarlo sempre.'},

{id:'ch015',lang:'js',topic:'js-linguaggio',
 q:'Si deve controllare che il contenuto di un campo sia un intero positivo. Quale controllo è corretto?',
 alts:[
  {t:'A',code:'const n = Number(v);\nif (!Number.isInteger(n) || n <= 0) { /* non valido */ }'},
  {t:'B',code:'if (parseInt(v) == NaN) { /* non valido */ }'},
  {t:'C',code:'if (typeof v !== "number") { /* non valido */ }'}],
 a:0,
 view:'js',
 why:'A. B contiene due errori: `parseInt("12abc")` vale 12 e passa il controllo, e soprattutto nessun confronto con `NaN` è mai vero (`NaN != NaN`); va usato `Number.isNaN`. C fallisce sempre, perché il valore di un `<input>` è per definizione una stringa.'}

];
