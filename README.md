# Alessandro Bertoletti — sito personale

Portfolio in italiano: sviluppo full stack, consulenza e agenti AI. HTML, CSS e JavaScript senza dipendenze di build. Node.js 20+ per i comandi locali.

## Avvio

```sh
npm run dev
```

Aprire http://127.0.0.1:4173. `npm run check` verifica la sintassi; `npm run build` prepara `dist/`; `npm run preview` serve la build. La cartella `dist/` può essere pubblicata su un hosting statico, anche in un sottopercorso.

## Contenuti da completare

- Foto: aggiungere `public/portrait.webp` e impostare `portraitImage` in `src/main.js`. Il placeholder resta intenzionalmente separato dalla foto nel CV.
- Geopieno e Kipify: aggiungere descrizioni approvate, contributo, screenshot e URL in `index.html`. Le grafiche attuali sono composizioni illustrative, non screenshot o identità ufficiali dei prodotti.
- Altri progetti: sostituire o ampliare l’area Coming Soon.
- Contatto: solo email, senza social, telefono o indirizzo.

## Interazioni

Ritratto deformabile tramite una mesh canvas: trascinamento con mouse/touch e impulso con Invio o Spazio. Il rilascio ritorna a riposo con una molla. L’effetto funziona anche sulla futura foto. Tre clic sul riquadro Coming Soon rivelano una sorpresa. Il comando nel footer disattiva il gioco; la preferenza di sistema reduced-motion viene rispettata. I contenuti principali rimangono disponibili senza JavaScript.

## Direzione visiva e fonti

Fondo caldo, accenti arancio, titoli editoriali e grafiche originali dei progetti. DM Sans e DM Serif Display sono caricati da Google Fonts con fallback di sistema.

Riferimenti per le interazioni, senza riutilizzare codice o asset:

- https://www.bruno-simon.com/ — esplorazione giocosa di un portfolio.
- https://whimsy.joshwcomeau.com/ — microinterazioni e animazioni legate alle azioni.

Timeline ricavata dal curriculum e corretta secondo le indicazioni del proprietario: FrameTECH maggio 2015–agosto 2018, Logol dipendente settembre 2018–2023, consulente dal 2023 con Logol e collaborazione con Dynabit SRLS. Il CV originale non è incluso nel repository.
