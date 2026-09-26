# Suite di verifica

Controlla che i 326 esercizi e il motore di correzione siano corretti. Non serve per usare
la piattaforma: serve per non romperla quando si aggiungono o si modificano esercizi.

## Cosa verifica

| File | Controllo |
|---|---|
| `00-dati.js` | integrità dei dati: id univoci, `lang` e `topic` presenti, conteggi per linguaggio |
| `01-soluzioni.js` | **ognuna delle 65 soluzioni di riferimento supera la propria checklist** |
| `02-negativi.js` | gli starter difettosi NON la superano, il codice fittizio nemmeno, la guardia sui cicli infiniti interrompe l'esecuzione |
| `03-interfaccia.js` | percorso completo su desktop e su telefono: blocco delle fasi, ogni tipo di esercizio, editor, persistenza, cronometro, assenza di scorrimento orizzontale e di errori JavaScript |
| `04-accessibilita.js` | la piattaforma stessa: `lang`, un solo `h1`, gerarchia delle intestazioni, nomi accessibili dei controlli, navigazione e attivazione da tastiera |
| `05-file-locale.js` | che tutto funzioni anche aperta con un doppio clic (`file://`), correzione e salvataggio compresi |
| `06-sincronizzazione.js` | il merge fra dispositivi non perde progressi, non retrocede un esercizio già risolto, non gonfia tempi ed errori con import ripetuti, il download e il caricamento reali (non solo la funzione) funzionano dalla UI, e il promemoria compare quando serve |

`01`, `02` e `03` sono i più utili: il primo è quello che impedisce di pubblicare un esercizio
la cui checklist non è soddisfacibile.

## Come eseguirla

```
npm install playwright-core          # unica dipendenza, solo per i test
python3 -m http.server 8099          # in un altro terminale
node test/00-dati.js assets/js/data/*.js
node test/01-soluzioni.js
node test/02-negativi.js
node test/03-interfaccia.js
node test/04-accessibilita.js
node test/05-file-locale.js
node test/06-sincronizzazione.js
```

Se Chromium non è in `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, indicane il percorso
con la variabile d'ambiente `CHROME_PATH`. Il percorso usato da `05-file-locale.js` è assoluto:
adattalo se la cartella del progetto è altrove.
