/* Fase 1 - riconoscimento: associare tag, attributi, proprietà e funzioni
   alla loro descrizione (e viceversa). Ogni insieme è un singolo esercizio. */
PREP.data.pairs = [

{ id:'p001', lang:'html', topic:'html-form', title:'Attributi dei controlli di form',
  dir:'Associa ogni attributo alla descrizione corrispondente.',
  items:[
    {a:'required', b:'Impedisce l\'invio della form se il campo è rimasto vuoto'},
    {a:'name',     b:'Chiave con cui il valore viene trasmesso al server'},
    {a:'id',       b:'Identificatore unico nel documento, usato dalla label per l\'associazione'},
    {a:'max',      b:'Valore numerico massimo ammesso'},
    {a:'checked',  b:'Rende selezionato di partenza un radio o una casella di controllo'},
    {a:'value',    b:'Valore iniziale del controllo, oppure dato inviato per radio e checkbox'},
    {a:'disabled', b:'Disattiva il controllo: non è modificabile e non viene inviato'}
  ]},

{ id:'p002', lang:'html', topic:'html-form', title:'Tipi di <input>',
  dir:'Associa ogni valore di `type` a ciò che produce.',
  items:[
    {a:'type="text"',     b:'Riga singola di testo libero'},
    {a:'type="number"',   b:'Valore numerico, con `min`, `max` e `step`'},
    {a:'type="date"',     b:'Selettore di data giorno/mese/anno'},
    {a:'type="radio"',    b:'Scelta singola fra alternative che condividono il `name`'},
    {a:'type="checkbox"', b:'Opzione attivabile in modo indipendente dalle altre'},
    {a:'type="submit"',   b:'Pulsante che invia la form'},
    {a:'type="reset"',    b:'Pulsante che riporta i campi ai valori iniziali'}
  ]},

{ id:'p003', lang:'html', topic:'html-semantica', title:'Elementi semantici di struttura',
  dir:'Associa ogni elemento al ruolo che dichiara.',
  items:[
    {a:'<header>',  b:'Intestazione introduttiva di una pagina o di una sezione'},
    {a:'<nav>',     b:'Blocco di collegamenti di navigazione'},
    {a:'<main>',    b:'Contenuto principale, unico nel documento'},
    {a:'<article>', b:'Contenuto autonomo, sensato anche estratto dal contesto'},
    {a:'<section>', b:'Raggruppamento tematico, di norma con una propria intestazione'},
    {a:'<aside>',   b:'Contenuto collaterale rispetto a quello circostante'},
    {a:'<footer>',  b:'Chiusura con note, contatti o riferimenti'}
  ]},

{ id:'p004', lang:'html', topic:'html-tabelle', title:'Elementi di tabella',
  dir:'Associa ogni elemento alla sua funzione.',
  items:[
    {a:'<table>',   b:'Contenitore dell\'intera tabella'},
    {a:'<caption>', b:'Titolo della tabella; deve essere il primo figlio'},
    {a:'<thead>',   b:'Raggruppa le righe di intestazione'},
    {a:'<tbody>',   b:'Raggruppa le righe di dati'},
    {a:'<tr>',      b:'Una riga della tabella'},
    {a:'<th>',      b:'Cella di intestazione, da corredare con `scope`'},
    {a:'<td>',      b:'Cella di dati'}
  ]},

{ id:'p005', lang:'html', topic:'a11y', title:'Costrutti di accessibilità',
  dir:'Associa ogni costrutto al problema che risolve.',
  items:[
    {a:'alt',                b:'Alternativa testuale di un\'immagine'},
    {a:'lang',               b:'Lingua del documento, per la corretta pronuncia vocale'},
    {a:'<label for="...">',  b:'Nome accessibile di un controllo di form'},
    {a:'<fieldset>/<legend>',b:'Titolo comune a un gruppo di controlli correlati'},
    {a:'scope',              b:'Direzione di riferimento di una cella di intestazione'},
    {a:'aria-label',         b:'Nome accessibile quando non esiste testo visibile da usare'},
    {a:'<caption>',          b:'Descrizione del contenuto complessivo di una tabella'}
  ]},

{ id:'p006', lang:'css', topic:'css-box', title:'Proprietà del box',
  dir:'Associa ogni proprietà al suo effetto.',
  items:[
    {a:'width',       b:'Larghezza dell\'area di contenuto'},
    {a:'padding',     b:'Spazio interno fra contenuto e bordo'},
    {a:'border',      b:'Linea di contorno: larghezza, stile e colore'},
    {a:'margin',      b:'Spazio esterno che separa il box da quelli vicini'},
    {a:'box-shadow',  b:'Ombra proiettata: scostamento, sfocatura e colore'},
    {a:'box-sizing',  b:'Stabilisce se padding e bordo rientrino dentro `width`'}
  ]},

{ id:'p007', lang:'css', topic:'css-testo', title:'Proprietà tipografiche',
  dir:'Associa ogni proprietà al suo effetto.',
  items:[
    {a:'font-family',     b:'Elenco di caratteri da usare, in ordine di preferenza'},
    {a:'font-size',       b:'Dimensione del carattere'},
    {a:'font-weight',     b:'Spessore del tratto, ad esempio `bold`'},
    {a:'font-style',      b:'Corsivo o tondo'},
    {a:'color',           b:'Colore del testo'},
    {a:'text-align',      b:'Allineamento orizzontale del testo nel blocco'},
    {a:'text-decoration', b:'Sottolineatura, sopralineatura, barratura'}
  ]},

{ id:'p008', lang:'css', topic:'css-selettori', title:'Selettori',
  dir:'Associa ogni selettore a ciò che individua.',
  items:[
    {a:'.nota',            b:'Elementi con `class="nota"`'},
    {a:'#nota',            b:'L\'elemento con `id="nota"`'},
    {a:'p',                b:'Tutti i paragrafi del documento'},
    {a:'input[type="text"]',b:'Gli `<input>` il cui attributo `type` vale `text`'},
    {a:'button:hover',     b:'I pulsanti nel momento in cui il puntatore vi passa sopra'},
    {a:'form p',           b:'I paragrafi discendenti di una form, a qualunque profondita\''},
    {a:'form > p',         b:'I soli paragrafi figli diretti della form'}
  ]},

{ id:'p009', lang:'css', topic:'css-box', title:'Stili di bordo e unità di misura',
  dir:'Associa ogni valore al suo significato.',
  items:[
    {a:'solid',  b:'Linea continua'},
    {a:'dashed', b:'Linea tratteggiata'},
    {a:'dotted', b:'Linea puntinata'},
    {a:'none',   b:'Nessun bordo visibile'},
    {a:'px',     b:'Unità assoluta in pixel'},
    {a:'%',      b:'Quota della dimensione corrispondente del contenitore'},
    {a:'em',     b:'Multiplo della dimensione del carattere in uso'}
  ]},

{ id:'p010', lang:'js', topic:'js-dom', title:'Selezione e creazione di nodi',
  dir:'Associa ogni metodo a ciò che fa.',
  items:[
    {a:'document.getElementById(id)',  b:'Restituisce l\'elemento con quell\'id, oppure `null`'},
    {a:'document.querySelector(sel)',  b:'Restituisce il primo elemento che soddisfa il selettore CSS'},
    {a:'document.querySelectorAll(sel)',b:'Restituisce la NodeList di tutti gli elementi che soddisfano il selettore'},
    {a:'document.createElement(tag)',  b:'Crea un nuovo elemento, non ancora inserito nel documento'},
    {a:'padre.appendChild(nodo)',      b:'Inserisce il nodo come ultimo figlio'},
    {a:'nodo.remove()',                b:'Stacca il nodo dal documento'},
    {a:'el.setAttribute(n, v)',        b:'Imposta il valore di un attributo qualunque'}
  ]},

{ id:'p011', lang:'js', topic:'js-dom', title:'Proprietà dei nodi',
  dir:'Associa ogni proprietà al suo contenuto.',
  items:[
    {a:'textContent', b:'Il testo dell\'elemento, senza interpretare la marcatura'},
    {a:'innerHTML',   b:'Il contenuto interpretato come marcatura HTML'},
    {a:'value',       b:'Il valore corrente di un controllo di form'},
    {a:'classList',   b:'Elenco delle classi, con `add`, `remove` e `toggle`'},
    {a:'style',       b:'Le dichiarazioni CSS in linea dell\'elemento'},
    {a:'children',    b:'Gli elementi figli diretti'}
  ]},

{ id:'p012', lang:'js', topic:'js-ajax', title:'Richieste asincrone',
  dir:'Associa ogni elemento al suo ruolo.',
  items:[
    {a:'fetch(url)',        b:'Avvia una richiesta e restituisce una Promise di `Response`'},
    {a:'response.ok',       b:'Vale `true` se il codice di stato è compreso fra 200 e 299'},
    {a:'response.json()',   b:'Legge il corpo e lo converte, restituendo una Promise'},
    {a:'method',            b:'Opzione che stabilisce il verbo HTTP della richiesta'},
    {a:'body',              b:'Opzione che trasporta i dati inviati con una POST'},
    {a:'xhr.readyState',    b:'Stato di avanzamento della richiesta: vale 4 quando è conclusa'},
    {a:'xhr.status',        b:'Codice di stato HTTP restituito dal server'}
  ]},

{ id:'p013', lang:'js', topic:'js-eventi', title:'Eventi',
  dir:'Associa ogni voce al suo significato.',
  items:[
    {a:'addEventListener',   b:'Registra una funzione da eseguire al verificarsi di un evento'},
    {a:'"click"',            b:'Evento generato dalla pressione su un elemento'},
    {a:'"submit"',           b:'Evento generato dall\'invio di una form'},
    {a:'"change"',           b:'Evento generato quando il valore di un controllo è stato modificato'},
    {a:'event.preventDefault()',b:'Annulla il comportamento predefinito del browser'},
    {a:'event.target',       b:'L\'elemento su cui l\'evento si è originato'}
  ]},

{ id:'p014', lang:'js', topic:'js-linguaggio', title:'Costrutti del linguaggio',
  dir:'Associa ogni voce al suo significato.',
  items:[
    {a:'const',             b:'Dichiara un legame non riassegnabile, con ambito di blocco'},
    {a:'let',               b:'Dichiara una variabile riassegnabile, con ambito di blocco'},
    {a:'===',               b:'Confronto senza conversione di tipo'},
    {a:'Number.isInteger(n)',b:'Vero se il valore è un numero intero'},
    {a:'Array.isArray(v)',  b:'Vero se il valore è un array'},
    {a:'JSON.parse(s)',     b:'Converte una stringa JSON in un valore JavaScript'},
    {a:'JSON.stringify(o)', b:'Converte un valore JavaScript in una stringa JSON'}
  ]}

];
