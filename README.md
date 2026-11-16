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

Ritratto deformabile tramite una mesh canvas: trascinamento con mouse/touch e impulso con Invio o Spazio. Il placeholder è un monogramma neutro. Il rilascio ritorna a riposo con una molla e l’effetto funziona anche sulla futura foto. Il riquadro Coming Soon è statico e non risponde ai clic. Il comando nel footer disattiva le animazioni; la preferenza di sistema reduced-motion viene rispettata. I contenuti principali rimangono disponibili senza JavaScript.

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

## Optional seasons and Breeze

Atmosphere starts off. A season dropdown and a single Breeze toggle sit beside the language switcher. Hammer, magnet, spirit level, toolbox, damage and rebuilding have been removed. Breeze remains unavailable until a season is selected, and is disabled with reduced motion.

Autumn uses warm cream and terracotta, with individually simulated leaves. Winter snow settles on letter ink heights and component edges. Settled leaves expire after 12–22 seconds and snow after 18–30 seconds, with a four-second fade; a 90-second total lifetime prevents indefinite accumulation. Spring has five butterflies that fly, land for 3–6 seconds, and take off again.

Summer combines slowly moving sunlight/shadows with a thin coastal strip at the bottom of the viewport: layered turquoise water, a sandy edge, foam and highlights. Breeze increases wave amplitude and speed, with a local ripple near the pointer; water relaxes gradually when Breeze stops. Main content is layered above the sea and footer spacing keeps bottom controls clear. On reduced motion the sea and lighting are static.

Breeze applies wind impulses to leaves/snow and encourages butterflies to take off. Pointer and touch input leave links and native scrolling usable. Escape, the toggle or the hint close button stops the wind. Atmosphere Off and the footer interaction switch clear the scene. Canvas effects do not receive pointer events.

GeoPieno remains static. Keepify recomposes its actual description over approximately four seconds while preserving accessible text, then restores the plain paragraph. It starts when the Projects heading reaches the center band on desktop, or its own heading reaches it on mobile. Reduced motion keeps the description static.

Validation: syntax/build checks, IT/EN browser walkthrough, actual wave response and relaxation, particle wind response, link navigation with Breeze active, mobile layout and static reduced-motion rendering. Source: `src/playground.js` and `src/playground.css`.
