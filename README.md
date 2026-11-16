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

- Foto: cinque ritratti in `public/portraits/`, generati con ElevenLabs dalla foto fornita dall’utente. `src/main.js` seleziona la versione neutra o stagionale con dissolvenza e conserva il ritratto elastico. La foto originale aziendale non viene pubblicata nel repository.
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

Atmosphere starts off. A season dropdown and one contextual action sit beside the language switcher: Breeze in autumn/winter, Smooth the sand in summer, Make it bloom in spring. The action label remains visible on mobile. Hammer, magnet, spirit level, toolbox, damage and rebuilding have been removed. The action is unavailable until a season is selected. Breeze is disabled with reduced motion; planted flowers appear fully grown in that mode.

Autumn uses warm cream and terracotta, with individually simulated leaves. Winter snow settles on letter ink heights and component edges. Settled leaves expire after 12–22 seconds and snow after 18–30 seconds, with a four-second fade; a 90-second total lifetime prevents indefinite accumulation. Spring has four butterflies and two bees. Make it bloom enables click/tap placement; four flower forms vary in height, leaf shapes, corolla, petal count and palette. Stems and leaves grow over six seconds, followed by a five-second bloom. Insects choose nearby blooming flowers within 700 pixels, accounting for visitors already resting or approaching; they land on individual petals, pause for 3–7 seconds and prefer a different flower next. Up to 24 flowers are retained, and switching seasons clears them.

Summer turns the document into a textured beach, with slowly moving sunlight/shadows and the sea at the actual end of the page: a translucent wash advances and retreats over textured sand, leaving a slowly drying wet edge, broken foam and moving reflections. Breeze increases wave reach, amplitude and speed, adding localized chop and small spray near the pointer; water relaxes gradually when Breeze stops. The shoreline has its own space after the footer, keeping content and controls clear. Mouse and pen dragging carve document-anchored grooves with recessed channels, continuous raised banks and scattered grains; waves gradually erase submerged marks. Smooth the sand in the header uses a wave icon and triggers a roughly 8.5-second wash (2.6-second advance, 0.4-second pause and 5.5-second retreat): water rises from the bottom of the viewport, pauses, then retreats behind an irregular, broken foam front. Water is mostly transparent, with colour and reflections concentrated near the crest. The same front function renders the wave and tests every groove point; points disappear exactly when the retreating front crosses them, before the sand is drawn for that frame. The button is disabled during the wash; changing season cancels it. With reduced motion, marks are cleared immediately. Drawing excludes interactive elements and touch keeps native scrolling. At most 100 strokes of 500 points are retained; leaving summer clears them. On reduced motion the sea and lighting are static.

Breeze applies wind impulses to leaves and snow in autumn and winter. Summer waves now run naturally without a Breeze action. Pointer and touch input leave links and native scrolling usable. Escape, the toggle or the hint close button stops the wind. Atmosphere Off and the footer interaction switch clear the scene. Canvas effects do not receive pointer events.

GeoPieno remains static. Keepify recomposes its actual description over approximately four seconds while preserving accessible text, then restores the plain paragraph. It starts when the Projects heading reaches the center band on desktop, or its own heading reaches it on mobile. Reduced motion keeps the description static.

Validation: syntax/build checks, IT/EN browser walkthrough, actual wave response and relaxation, document-anchored sand drawing, tidal erasure and wash timing, flower variety/growth, distributed insect visits and flower-to-flower movement, particle wind response, link navigation with Breeze active, mobile layout and static reduced-motion rendering. Source: `src/playground.js` and `src/playground.css`.

Atmosphere controls start as a single “Atmosfera” / “Atmosphere” button. Selecting a season splits the control into two capsules with an SVG liquid neck that narrows over 1.7 seconds. Active controls display icons only, with accessible labels and hover titles; switching off merges them again. The action is inert and hidden while off. Reduced-motion preferences skip the morph.

Winter has its own Disgelo / Thaw tool: snow within 105 px of the pointer melts progressively, releasing short-lived droplets that gather briefly and fall. Autumn retains Breeze, spring Make it bloom, and summer Smooth the sand. Seasonal changes clear droplets and active tools.

Portrait variants: neutral studio/navy overshirt; spring sage and garden; summer linen and sea; autumn copper foliage; winter wool and snow. Generated via ElevenLabs gpt-image-2.5-sunburst, flow `eC2kkIvoYipaC7ifRv47`. Assets load on demand and are cached; stale loads cannot override newer season choices.

Additional portrait studies are available at `public/portraits/index.html`: ski, snorkeling (shirtless beach portrait), Ducati Multistrada road trip and olive harvest. Each season selection uses a single random draw: 2/3 professional portrait, 1/3 playful portrait. Atmosphere off always uses neutral-v2. Failed playful-image loads fall back to the professional image. The default portrait now uses `neutral-v2.png` (light blue shirt); the original neutral study is retained for comparison. The Teams profile photo was viewed in the desktop app, but no original image was exported or used for generation.

## Stato attuale del sito

Ordine delle sezioni: introduzione, Come lavoro, Progetti, Percorso, aziende e Contatti. Il pulsante principale iniziale porta a Come lavoro; quello secondario ai progetti. Entrambe le lingue condividono layout e interazioni, verificati da 320 a 1440 px.

Le immagini utilizzate sono in `public/portraits/corrected/`: nove ritratti con correzione fotografica locale delle occhiaie. Le versioni precedenti sono conservate per il confronto nella galleria. `src/portrait-framing.js` uniforma le inquadrature, lasciando più spazio al panorama nella foto in moto.

Gli strumenti attuali sono Soffio in autunno, Disgelo in inverno, Fai sbocciare in primavera e Paletta in estate. Il pannello della paletta contiene Pulisci 🌊, che richiama l’onda. La crescita del fiore richiede circa cinque secondi, seguita da 4,2 secondi per la fioritura. La divisione dei controlli dura circa 1,05 secondi e include un rimbalzo leggero. Queste indicazioni sostituiscono i dettagli delle precedenti iterazioni descritti sopra.
