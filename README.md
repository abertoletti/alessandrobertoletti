# Alessandro Bertoletti — sito personale

Portfolio in italiano e inglese: sviluppo full stack, consulenza e agenti AI. HTML, CSS e JavaScript senza dipendenze di build. Node.js 20+ per i comandi locali.

## Lingue

La pagina italiana è `index.html`, quella inglese `en/index.html`. Il selettore IT / EN funziona anche senza JavaScript. Entrambe hanno metadata, lingua del documento e riferimenti hreflang; i messaggi delle interazioni seguono la lingua della pagina. Per aggiornare i contenuti, modificare entrambe le pagine. Stili, logica e immagini sono condivisi.

## Avvio

```sh
npm run dev
```

Aprire http://127.0.0.1:4173. `npm run check` verifica la sintassi; `npm run build` prepara `dist/`; `npm run preview` serve la build. La cartella `dist/` può essere pubblicata su un hosting statico, anche in un sottopercorso.

## Contenuti da completare

- Foto: aggiungere `public/portrait.webp` e impostare `portraitImage` in `src/main.js`. Il placeholder resta intenzionalmente separato dalla foto nel CV.
- GeoPieno e Keepify: schede, funzionalità, link e marchi ricavati dai repository. Eventuali screenshot e approfondimenti sul contributo personale si possono aggiungere in entrambe le lingue.
- Altri progetti: sostituire o ampliare l’area Coming Soon.
- Contatto: solo email, senza social, telefono o indirizzo.

## Interazioni

Ritratto deformabile tramite una mesh canvas: trascinamento con mouse/touch e impulso con Invio o Spazio. Il placeholder è un monogramma neutro. Il rilascio ritorna a riposo con una molla e l’effetto funziona anche sulla futura foto. Tre clic sul riquadro Coming Soon rivelano un messaggio discreto, senza coriandoli. Il comando nel footer disattiva le animazioni; la preferenza di sistema reduced-motion viene rispettata. I contenuti principali rimangono disponibili senza JavaScript.

## Direzione visiva e fonti

Fondo neutro, accenti verde/grigio, tipografia pulita e nome del professionista in primo piano. Tono diretto e concreto, incentrato su prodotto, sviluppo e semplificazione. Le interazioni restano secondarie rispetto ai contenuti. DM Sans è caricato da Google Fonts con fallback di sistema.

Riferimenti per le interazioni, senza riutilizzare codice o asset:

- https://www.bruno-simon.com/ — esplorazione giocosa di un portfolio.
- https://whimsy.joshwcomeau.com/ — microinterazioni e animazioni legate alle azioni.

Timeline ricavata dal curriculum e corretta secondo le indicazioni del proprietario: FrameTECH maggio 2015–agosto 2018, Logol dipendente settembre 2018–2023, consulente dal 2023 con Logol e collaborazione con Dynabit SRLS. Il CV originale non è incluso nel repository.

## Fonti delle schede progetto

- GeoPieno: README, frontend/README.md e descrizione store 0.9.4 in frontend/marketing/releases/0.9.4/apple-review/metadata/store-listing-it.json del repository GeoPieno. Marchio da frontend/public/geopieno-mark-bare.svg.
- Keepify: README, apps/website/README.md e docs/product/status.md del repository Keepify. Logo approvato da output/branding/keepify-brand-kit/brand/logo-color.svg. Le app mobile sono descritte come test privato, senza promettere disponibilità pubblica negli store.
- Solo informazioni di prodotto e asset di branding: nessun dato di utenti, credenziale o registrazione importati.

## Company logo sources

The “Ho lavorato con / I’ve worked with” section reflects the employment and consulting relationships described by the owner. Original logo assets were retrieved from the official websites on 2026-11-16:

- FrameTECH: https://www.longwave.it/chi-siamo/la-nostra-storia/ (historical company logo).
- Logol: https://www.logol.com/.
- Dynabit: https://www.dynabit.it/.

## Optional seasons and tools

The bilingual “Esplora / Explore” panel starts closed with the original atmosphere. It offers calendar-based or manual seasons, snow caps on components, leaves, clickable spring buds and summer sun accents. No geolocation or network request is used. Seasonal decorations are rebuilt on selection; no preference is persisted.

Tools operate on selected headings, the portrait, project headings and skill tags: three hammer clicks loosen an element, the magnet attracts skill tags, the blower disperses decorations and the spirit level tilts the elements. Escape puts the tool away. Links outside hammer targets keep their usual behaviour. Restore resets tools, damage, transforms and the atmosphere; rebuilding follows understanding, prioritisation and construction, with small numbered repair agents. These are visual effects only.

The car/refuelling and word-organisation stories start once when each project enters view. The footer interaction toggle and system reduced-motion preference disable animation; static content remains readable without JavaScript. Source: `src/playground.js` and `src/playground.css`.

Validation: syntax/build checks and a Chromium walkthrough covered all seasons, bud activation, hammer/rebuild, blower, level, magnet, Escape, OFF, English controls, 390px layout overflow and reduced motion with no JavaScript errors. Screenshots were reviewed on desktop and mobile. The tools are a first visual implementation for owner review.
