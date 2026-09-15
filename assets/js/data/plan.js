/* Fase 2 - traduzione di un requisito in linguaggio naturale nell'elenco degli
   elementi e attributi necessari, senza ancora scrivere il codice.
   Vanno selezionate TUTTE le voci necessarie e nessuna voce superflua o errata. */
PREP.data.plan = [

{id:'pl001',lang:'html',topic:'html-form',
 req:'"La prima parte, dal titolo Dati Anagrafici, deve consentire i seguenti input: Nome, Cognome, Data di nascita, Nazionalità."',
 opts:[
  {t:'`<fieldset>`',ok:true},
  {t:'`<legend>` con testo "Dati Anagrafici"',ok:true},
  {t:'Quattro `<label>` con attributo `for`',ok:true},
  {t:'Quattro controlli con `id` e `name`',ok:true},
  {t:'`<input type="date">` per la data di nascita',ok:true},
  {t:'`<table>` per allineare i campi',ok:false},
  {t:'`<h2>` al posto della `<legend>`',ok:false},
  {t:'`<input type="datetime">` per la data di nascita',ok:false}],
 why:'La "parte dal titolo X" si traduce in `<fieldset>` + `<legend>`. Ogni campo richiede la coppia label/controllo con `for`/`id`, e il `name` per la trasmissione. Le tabelle di impaginazione sono una pratica superata e danneggiano la lettura assistita; `datetime` è stato rimosso dallo standard.'},

{id:'pl002',lang:'html',topic:'html-form',
 req:'"Un insieme di controlli per consentire la scelta fra: economy, premium economy, business, prima classe."',
 opts:[
  {t:'Quattro `<input type="radio">`',ok:true},
  {t:'Lo stesso `name` su tutti e quattro',ok:true},
  {t:'Un `value` distinto su ciascuno',ok:true},
  {t:'Un `id` distinto su ciascuno, con la `<label>` associata',ok:true},
  {t:'`<fieldset>` con `<legend>` che intitola il gruppo',ok:true},
  {t:'Quattro `<input type="checkbox">`',ok:false},
  {t:'L\'attributo `required` su tutti e quattro',ok:false},
  {t:'Lo stesso `id` su tutti e quattro',ok:false}],
 why:'Scelta singola fra alternative note: radio con `name` comune e `value` distinti. Gli `id` devono essere unici nel documento, altrimenti le label si associano tutte al primo. `required` su un gruppo di radio basta dichiararlo su uno solo per rendere obbligatoria la scelta, e qui la consegna non lo chiede.'},

{id:'pl003',lang:'html',topic:'html-form',
 req:'"Numero di passeggeri (massimo consentito: 5)."',
 opts:[
  {t:'`<input type="number">`',ok:true},
  {t:'Attributo `max="5"`',ok:true},
  {t:'Attributo `min="1"`',ok:true},
  {t:'`<label for="...">` associata',ok:true},
  {t:'Attributo `maxlength="5"`',ok:false},
  {t:'Attributo `size="5"`',ok:false},
  {t:'`<input type="range">`',ok:false}],
 why:'`max` limita il VALORE, `maxlength` il numero di caratteri e su `type="number"` viene ignorato; `size` riguarda solo la larghezza visiva. Un `range` non consente di leggere il numero esatto ed è meno adatto a un dato da digitare.'},

{id:'pl004',lang:'html',topic:'html-tabelle',
 req:'"Visualizzare i dati dei personaggi sotto forma di tabella, considerando che il nome deve essere una cella di intestazione e che la tabella deve essere accessibile."',
 opts:[
  {t:'`<table>`',ok:true},
  {t:'`<th scope="col">` per le intestazioni di colonna',ok:true},
  {t:'`<th scope="row">` per il nome di ciascun personaggio',ok:true},
  {t:'`<caption>` che descrive la tabella',ok:true},
  {t:'`<td>` per le altre celle di dato',ok:true},
  {t:'`<th>` senza `scope` per il nome',ok:false},
  {t:'`<div>` con `role="table"`',ok:false},
  {t:'`<strong>` sulle celle di intestazione',ok:false}],
 why:'"Il nome deve essere una cella di intestazione" significa `<th>`; "la tabella deve essere accessibile" aggiunge `scope` e un `<caption>`. Il grassetto è solo presentazione, e reinventare una tabella con `<div>` e ruoli ARIA è inutilmente fragile quando esiste l\'elemento nativo.'},

{id:'pl005',lang:'html',topic:'a11y',
 req:'"Il documento deve essere HTML5 accessibile secondo le WCAG 2.0 a livello A." Quali requisiti vanno verificati a colpo d\'occhio su un documento con form e immagini?',
 opts:[
  {t:'`lang` sull\'elemento `<html>`',ok:true},
  {t:'`<title>` significativo nel `<head>`',ok:true},
  {t:'`alt` su ogni `<img>`',ok:true},
  {t:'Ogni controllo di form ha una `<label>` associata',ok:true},
  {t:'Ogni gruppo di radio ha `<fieldset>` e `<legend>`',ok:true},
  {t:'Ordine gerarchico delle intestazioni senza salti',ok:true},
  {t:'Rapporto di contrasto di almeno 4.5:1',ok:false},
  {t:'Sottotitoli per i contenuti audio preregistrati',ok:false}],
 why:'Il contrasto minimo (1.4.3) è di livello AA, non A. I sottotitoli per l\'audio preregistrato sono sì di livello A (1.2.2) ma non pertinenti a un documento senza contenuti multimediali: la domanda chiede cosa verificare SU QUESTO documento.'},

{id:'pl006',lang:'html',topic:'html-struttura',
 req:'"Scrivere il codice HTML5 valido, ben formato, accessibile e semanticamente corretto per realizzare un documento che contenga una intestazione di primo livello Prenotazione Volo e un form diviso in due parti."',
 opts:[
  {t:'`<!DOCTYPE html>`',ok:true},
  {t:'`<html lang="it">`',ok:true},
  {t:'`<meta charset="utf-8">` e `<title>`',ok:true},
  {t:'Un solo `<h1>` con testo "Prenotazione Volo"',ok:true},
  {t:'Un solo `<form>` contenente due `<fieldset>`',ok:true},
  {t:'Due `<form>` distinti',ok:false},
  {t:'Un `<link rel="stylesheet">` obbligatorio',ok:false},
  {t:'`<h1>` ripetuto per ciascuna delle due parti',ok:false}],
 why:'"Un form diviso in due parti" significa una sola `<form>`. Il foglio di stile è oggetto di un esercizio separato e qui non è richiesto: aggiungere cose non richieste non porta punti e può introdurre errori.'},

{id:'pl007',lang:'css',topic:'css-box',
 req:'"Il form ha un bordo di tipo dashed, di colore Dark orange, larghezza 5px. I fieldset hanno una ombreggiatura orientata a sinistra e in alto, con un offset di 5px, una sfocatura di 10px, di colore Orange."',
 opts:[
  {t:'Selettore `form` con `border: 5px dashed darkorange`',ok:true},
  {t:'Selettore `fieldset` con `box-shadow`',ok:true},
  {t:'Scostamento orizzontale `-5px`',ok:true},
  {t:'Scostamento verticale `-5px`',ok:true},
  {t:'Sfocatura `10px`',ok:true},
  {t:'Colore dell\'ombra `orange`',ok:true},
  {t:'Parola chiave `inset` nell\'ombra',ok:false},
  {t:'Scostamenti positivi `5px 5px`',ok:false}],
 why:'"A sinistra e in alto" impone valori negativi su entrambi gli assi. `inset` produrrebbe un\'ombra interna, che non è ciò che si chiede. Nota che il colore del bordo (`darkorange`) e quello dell\'ombra (`orange`) sono due colori diversi: è un dettaglio che si perde facilmente.'},

{id:'pl008',lang:'css',topic:'css-selettori',
 req:'"I bottoni hanno colore di sfondo dark orange e colore del testo white, in grassetto. Sull\'hover, colore di sfondo e di foreground si scambiano."',
 opts:[
  {t:'Una regola per lo stato base dei pulsanti',ok:true},
  {t:'`background-color: darkorange` e `color: white`',ok:true},
  {t:'`font-weight: bold`',ok:true},
  {t:'Una seconda regola con la pseudo-classe `:hover`',ok:true},
  {t:'Nella regola hover, `background-color: white` e `color: darkorange`',ok:true},
  {t:'Un selettore di classe `.hover`',ok:false},
  {t:'`font-style: bold`',ok:false},
  {t:'`!important` per far vincere la regola hover',ok:false}],
 why:'Lo stato del puntatore è una pseudo-classe, non una classe. Il grassetto è `font-weight`, non `font-style`. E `!important` è inutile: `button:hover` ha già specificità maggiore di `button`.'},

{id:'pl009',lang:'css',topic:'css-testo',
 req:'"Tutti i font devono avere lo stesso font-family, che deve essere Arial. La dimensione deve essere del 100%."',
 opts:[
  {t:'`font-family: Arial` dichiarata anche sui controlli di form',ok:true},
  {t:'`font-size: 100%`',ok:true},
  {t:'Elencare `input`, `select`, `textarea`, `button` nel selettore',ok:true},
  {t:'Una famiglia generica di ripiego, es. `sans-serif`',ok:true},
  {t:'`font-family` dichiarata solo su `body`',ok:false},
  {t:'`font-size: 16px`',ok:false},
  {t:'`@font-face` con il file di Arial',ok:false}],
 why:'I controlli di form non ereditano il carattere: dichiararlo solo su `body` lascia fuori proprio i campi della form. `100%` non è equivalente a `16px`: è relativo alla dimensione predefinita scelta dall\'utente, e conservarlo è una scelta di accessibilità.'},

{id:'pl010',lang:'js',topic:'js-ajax',
 req:'"Al click sul bottone Leggi Personaggio si dovrà: leggere il contenuto dell\'input e controllare che sia un numero intero positivo; fare una richiesta GET al file personaggio.json; in caso di successo, visualizzare i dati del personaggio sotto forma di elenco non ordinato nel main."',
 opts:[
  {t:'`addEventListener("click", ...)` sul pulsante',ok:true},
  {t:'Lettura di `.value` dal campo',ok:true},
  {t:'Conversione con `Number(...)` e controllo con `Number.isInteger`',ok:true},
  {t:'Uscita anticipata se il valore non è valido',ok:true},
  {t:'`fetch` senza opzioni, cioe\' in GET',ok:true},
  {t:'`response.json()` per leggere il corpo',ok:true},
  {t:'`createElement("ul")` e `createElement("li")` con `appendChild`',ok:true},
  {t:'Modifica del file HTML per aggiungere la `<ul>`',ok:false},
  {t:'`fetch` con `method: "POST"`',ok:false}],
 why:'La consegna d\'esame dice espressamente "NON SONO AMMESSE MODIFICHE AL FILE HTML": la lista va costruita da JavaScript. E "richiesta GET" significa `fetch` senza secondo argomento.'},

{id:'pl011',lang:'js',topic:'js-dom',
 req:'"Al click sul bottone Leggi Personaggi si dovrà: fare una richiesta POST al file personaggi.json; in caso di successo, visualizzare i dati dei personaggi sotto forma di tabella, considerando che il nome deve essere una cella di intestazione e che la tabella deve essere accessibile."',
 opts:[
  {t:'`fetch(url, { method: "POST", body: ... })`',ok:true},
  {t:'Controllo di `response.ok` prima di interpretare il corpo',ok:true},
  {t:'`createElement("table")`, `("tr")`, `("th")`, `("td")`',ok:true},
  {t:'`setAttribute("scope", "col")` sulle intestazioni di colonna',ok:true},
  {t:'`setAttribute("scope", "row")` sul nome di ciascun personaggio',ok:true},
  {t:'Svuotamento del `<main>` prima di inserire la tabella',ok:true},
  {t:'`document.write` per generare la tabella',ok:false},
  {t:'`innerHTML` con le stringhe dei dati ricevuti',ok:false}],
 why:'`document.write` dopo il caricamento azzera l\'intero documento. Costruire la tabella concatenando stringhe in `innerHTML` funziona ma espone i dati esterni a iniezione di marcatura: con `createElement` e `textContent` il problema non si pone. Lo svuotamento evita di accodare una tabella nuova a ogni clic.'},

{id:'pl012',lang:'js',topic:'js-eventi',
 req:'"Un pulsante dentro una form deve eseguire una richiesta asincrona senza che la pagina si ricarichi."',
 opts:[
  {t:'`type="button"` sul pulsante, oppure',ok:true},
  {t:'Intercettare l\'evento `submit` della form',ok:true},
  {t:'Chiamare `event.preventDefault()` nel gestore',ok:true},
  {t:'`event.stopPropagation()` al posto di `preventDefault()`',ok:false},
  {t:'`return false` da `addEventListener`',ok:false},
  {t:'Rimuovere l\'attributo `action` dalla form',ok:false}],
 why:'Il ricaricamento è l\'azione predefinita del browser e si annulla con `preventDefault()`. `stopPropagation()` ferma la risalita dell\'evento, che è un\'altra cosa; `return false` ha effetto solo sui gestori assegnati con `onclick`, non su quelli registrati con `addEventListener`.'}

];
