# PrepWeb — preparazione all'esame di Tecnologie Web

Piattaforma locale di preparazione alla prova di **Tecnologie Web** (Università di Bologna,
Ingegneria e Scienze Informatiche, campus di Cesena), tarata sul compito d'esame reale del
17/02/2023 (Compito A).

Copre **6 ore di studio effettivo** su **HTML, CSS e JavaScript**, con l'accessibilità WCAG 2.0
livello A integrata trasversalmente. **PHP è fuori perimetro** e non compare in nessun esercizio.

L'obiettivo non è "aver capito": è **saper produrre in fretta e a memoria** i frammenti di codice
che il compito richiede. Ogni scelta di progettazione è subordinata a questo.

---

## Avvio

Non serve installare nulla, non serve compilare nulla, non serve una connessione a Internet.

### Modo 1 — doppio clic (zero passaggi)

Apri `index.html` con un doppio clic. È tutto.

Funziona così com'è: l'applicazione parte, gli esercizi si correggono, i progressi si salvano.
Verificato su Chromium aprendo direttamente `file:///.../index.html`, senza alcun parametro.

### Modo 2 — server locale (consigliato se usi più browser)

Dalla cartella del progetto:

```
python3 -m http.server 8000
```

poi apri <http://localhost:8000>.

Va bene qualunque server statico (`npx serve`, l'estensione Live Server di VS Code, ecc.).
Il vantaggio è solo che `localStorage` resta legato a un'origine stabile: i progressi
sopravvivono anche se sposti la cartella.

### Dal telefono

Con il Modo 2, sulla stessa rete Wi‑Fi, apri `http://<ip-del-computer>:8000` dal telefono.
Le fasi 1 e 2 sono pensate per essere fatte interamente da smartphone.

---

## Perché questo stack

HTML, CSS e JavaScript puri. Nessun framework, nessun bundler, nessuna dipendenza, nessun
`npm install`, nessun passo di build. Script classici (niente moduli ES), così la pagina
funziona anche aperta da `file://`.

Le ragioni sono tre:

1. **Avvio immediato.** Il requisito era "meno passaggi servono, meglio è": il minimo assoluto
   è zero, e con un doppio clic ci si arriva.
2. **Nessuna dipendenza da servizi esterni.** Tutto il contenuto degli esercizi è precaricato
   staticamente in file `.js`. Non esiste alcuna chiamata di rete in fase di utilizzo: anche le
   richieste `fetch` e `XMLHttpRequest` degli esercizi JavaScript sono servite da file JSON
   simulati dentro la piattaforma.
3. **Coerenza con la materia.** Lo strumento con cui si studia Tecnologie Web è scritto nelle
   tecnologie dell'esame, ed è a sua volta accessibile: si naviga da tastiera, ha un solo `h1`
   per pagina, landmark semantici e annunci per le tecnologie assistive.

L'editor con evidenziazione della sintassi è scritto in casa (poco più di 100 righe): una `<textarea>`
trasparente sovrapposta a un blocco evidenziato. Rispetto a CodeMirror o Monaco evita di
importare centinaia di kilobyte, e soprattutto conserva il comportamento nativo su smartphone
(tastiera di sistema, selezione, annulla/ripeti, accessibilità).

---

## Struttura delle 6 ore

La progressione è obbligata: **una fase si sblocca solo quando ogni esercizio della precedente
è stato risolto almeno una volta.**

### Fase 1 — Conoscenza di base (~2 h, 187 esercizi)

Riconoscimento e richiamo, per costruire memoria di sintassi. Tutto fruibile da telefono.

| Attività | Esercizi |
|---|---|
| Quiz a scelta multipla (HTML, CSS, JS, teoria) | 66 |
| Riconoscimento: tag/attributi/proprietà ↔ descrizione | 14 insiemi |
| Flashcard, con ripresentazione dei soli elementi sbagliati | 56 |
| Completamento di snippet scegliendo da una lista | 30 |
| Individuazione dell'errore in un frammento breve | 21 |

### Fase 2 — Ragionamento (~2 h, 92 esercizi)

Ragionare sul comportamento del codice. Fruibile da telefono.

| Attività | Esercizi |
|---|---|
| Predizione dell'output o del rendering | 27 |
| Debug: codice valido ma non conforme alla specifica | 18 |
| Scelta progettuale motivata fra alternative | 15 |
| Dal requisito in linguaggio naturale all'elenco di elementi e attributi | 12 |
| Teoria aperta in stile esame, con risposta di riferimento | 20 |

Nella predizione, **dopo** la risposta il frammento viene realmente eseguito e se ne mostra il
risultato: la verifica è un fatto osservabile, non una nozione.

### Fase 3 — Produzione di codice (~2 h, 47 esercizi)

Scrittura vera, in ordine crescente di ampiezza.

| Attività | Esercizi |
|---|---|
| Micro-esercizi: un elemento, una regola, poche righe | 30 |
| Blocchi: una sezione di form, un foglio di stile, una funzione | 14 |
| Esame: consegna in stile compito, cronometro attivo | 3 |

I tre esercizi finali replicano la formulazione letterale del compito allegato (esercizio HTML
da 7 punti, CSS da 6, JavaScript da 7), con ampiezza ridotta e conto alla rovescia.

**Totale: 326 esercizi**, con margine per la ripetizione degli sbagliati.

---

## Come vengono valutate le risposte

Per gli esercizi a risposta chiusa la correzione è diretta.

Per gli esercizi di **scrittura di codice** non c'è alcun confronto carattere per carattere con
una soluzione attesa: sarebbe inutilizzabile, perché soluzioni diverse sono ugualmente corrette.
Ogni esercizio porta invece una **checklist di requisiti verificabili**, e ciascun requisito è
una funzione che ispeziona la struttura reale prodotta dal codice dello studente.

- **HTML** — il codice viene analizzato con `DOMParser` e si verificano presenza, annidamento e
  attributi degli elementi richiesti, comprese le associazioni di accessibilità: nome accessibile
  dei controlli, corrispondenza `for`/`id`, `fieldset`/`legend`, `th`/`scope`, `alt`, `lang`.
  C'è anche un controllo di buona formazione (tag chiusi e annidati correttamente).
- **CSS** — il foglio di stile viene applicato a un documento reale in un iframe, e si leggono
  sia le dichiarazioni (via CSSOM, per verificare che `90%` sia davvero scritto `90%`) sia gli
  stili calcolati. I colori sono normalizzati, quindi `darkorange`, `#ff8c00` e `rgb(255,140,0)`
  sono equivalenti. Gli stati come `:hover`, che non si possono simulare, sono verificati
  ispezionando le regole.
- **JavaScript** — il codice viene eseguito, si interagisce con la pagina (clic, compilazione dei
  campi) e si verifica il **comportamento osservabile**: che cosa compare nel DOM, quali richieste
  partono e con quale metodo HTTP, quali errori vengono sollevati.

Il feedback indica **uno per uno** quali requisiti sono soddisfatti e quali no, con il dettaglio
di che cosa è stato effettivamente trovato quando un requisito fallisce.

**La soluzione di riferimento e la spiegazione compaiono solo dopo il tentativo**, mai prima e mai
in forma parziale come suggerimento anticipato.

### Due garanzie sulla correzione

Il progetto include una suite di verifica (cartella `test/`) che controlla, su browser reale, che:

- ognuna delle **65 soluzioni di riferimento superi la propria checklist** (65/65);
- nessuno starter difettoso e nessun codice fittizio la superi;
- ogni tipo di esercizio funzioni sia su desktop sia su schermo da 390px, senza errori
  JavaScript e senza scorrimento orizzontale.

Serve a non pubblicare per sbaglio un esercizio la cui checklist non è soddisfacibile. Istruzioni
in `test/README.md`; l'unica dipendenza è `playwright-core`, e riguarda solo i test, non la
piattaforma.

---

## Dettagli utili

- **Persistenza.** Progressi, tempi, statistiche di errore e bozze di codice sono salvati in
  `localStorage`. Rientrando in un'attività si riparte dal primo esercizio non ancora risolto, e
  la dashboard propone il punto di interruzione. `localStorage` è però legato al singolo browser
  su quel dispositivo: non si sincronizza da solo fra telefono, iPad e computer.
- **Tracciamento degli errori.** Ogni errore viene attribuito a un argomento (form, selettori,
  cascata, DOM, AJAX, accessibilità…). Il *Ripasso mirato* elenca gli esercizi sbagliati, dal più
  sbagliato al meno, filtrabili per linguaggio.
- **Monte ore.** Il conteggio avanza solo mentre la scheda è visibile e c'è stata interazione
  negli ultimi tre minuti: misura studio effettivo, non tempo a scheda aperta.
- **Cronometro.** Attivabile in tutta la fase 3 da *Impostazioni*; negli esercizi in stile esame
  parte da solo con il conto alla rovescia del tempo previsto.
- **Su schermo piccolo.** In fase 3 i micro-esercizi vengono messi per primi e un avviso segnala
  che i blocchi e le prove d'esame rendono meglio da computer — ma restano tutti accessibili:
  non si resta mai bloccati.
- **Cicli infiniti.** Un `while(true)` in un iframe della stessa origine bloccherebbe l'intera
  scheda. Il codice dello studente viene perciò strumentato con una guardia che interrompe
  l'esecuzione dopo 4 secondi con un messaggio esplicito. Se la strumentazione dovesse alterare
  la sintassi, si ripiega automaticamente sul sorgente originale.

---

## Portare i progressi da un dispositivo all'altro (telefono, iPad, computer)

Nessun account, nessun server, nessun database online: i progressi si spostano come un file
`.json` che rimane sempre sotto il tuo controllo.

1. Su un dispositivo, apri *Impostazioni* → **Salva su file**. Viene scaricato
   `prepweb-progressi-AAAA-MM-GG-hhmm.json` — su iPhone/iPad finisce nell'app File, di solito
   nella cartella Download.
2. Sposta quel file sull'altro dispositivo con qualunque mezzo tu preferisca: AirDrop, iCloud
   Drive/Google Drive/Dropbox, Mail, Messaggi, un cavo. Sono tutti trasferimenti di file
   ordinari: la piattaforma non partecipa e non serve alcuna connessione durante l'uso.
3. Sull'altro dispositivo apri *Impostazioni* → **Carica da file** e scegli quel file.

Il caricamento **unisce** i progressi, non li sovrascrive: per ogni esercizio vale il risultato
migliore fra i due dispositivi (prima chi lo ha risolto, poi chi ci ha lavorato di più), i tempi
di studio si prendono come massimo tra le due copie e gli argomenti da rivedere vengono
ricalcolati dagli esercizi uniti. Puoi quindi lavorare un po' sul telefono e un po' sull'iPad,
scambiarvi il file quante volte vuoi, senza mai perdere nulla su nessuno dei due lati.

La dashboard mostra un promemoria quando ci sono parecchi esercizi non ancora salvati su file.

---

## Struttura dei file

```
index.html                 pagina unica dell'applicazione
assets/css/app.css         foglio di stile unico
assets/js/
  util.js                  funzioni di supporto
  store.js                 persistenza, statistiche, monte ore
  highlight.js             evidenziazione di HTML, CSS, JavaScript
  editor.js                editor (textarea sovrapposta al testo evidenziato)
  sandbox.js               esecuzione in iframe, fetch/XHR simulati, guardia sui cicli
  grader.js                motore di correzione a checklist
  catalog.js               le tre fasi e le 37 attività
  activities.js            resa degli 11 tipi di esercizio
  app.js                   navigazione e viste
  data/                    i 326 esercizi, precaricati staticamente
```

---

## Taratura sul compito d'esame

| Esercizio del compito | Punti | Trattato qui |
|---|---|---|
| 1 — HTML5 valido, ben formato, accessibile, semanticamente corretto | 7 | sì |
| 2 — Foglio di stile CSS esterno | 6 | sì |
| 3 — Domanda di teoria aperta (cascading) | 5 | sì |
| 4 — JavaScript: DOM, GET/POST, tabella accessibile | 7 | sì |
| 5 — PHP | 7 | **no**, fuori perimetro |

Gli esercizi sono bilanciati su queste proporzioni. L'accessibilità non è un modulo separato:
compare dentro gli esercizi di HTML, come accade nel compito, dove è un vincolo ricorrente.
Le consegne della fase 3 sono modellate sullo stile letterale del compito, non su uno stile
didattico generico, perché il punteggio dipende dalla conformità alla specifica.

---

## Limiti dichiarati

- **Il validatore HTML del W3C non è replicato.** In laboratorio è uno degli strumenti concessi e
  va usato. Qui il controllo di buona formazione copre gli errori più frequenti (tag non chiusi,
  annidamenti sbagliati), non l'intera grammatica di HTML5.
- **Le risposte di teoria aperta non sono corrette automaticamente.** Nessun software può
  giudicare in modo affidabile un testo libero in italiano. Dopo il tentativo compare la risposta
  di riferimento insieme all'elenco dei punti attesi: per ciascuno viene proposta una prima
  valutazione basata sulle parole usate, che lo studente conferma o corregge. È autovalutazione
  assistita, ed è dichiarata come tale nell'interfaccia.
- **Il PDF di introduzione al corso non era fra gli allegati ricevuti.** La taratura si basa sul
  compito d'esame del 17/02/2023 (Compito A), che contiene comunque regole, durata, strumenti
  ammessi, struttura in esercizi separati e punteggi.
