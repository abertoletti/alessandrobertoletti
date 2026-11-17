---
name: "Alessandro Bertoletti — Lo studio aperto"
description: "Sistema esistente del portfolio: professionale, personale, con dettagli da scoprire."
colors:
  paper: "#f6f6f3"
  ink: "#242c29"
  muted: "#626b65"
  line: "#d8ddd7"
  accent: "#426653"
  about-surface: "#ebeee8"
  contact-surface: "#28362f"
  contact-text: "#f1f3ee"
  contact-muted: "#b5c2b9"
  action-text: "#ffffff"
  contact-accent: "#a4b7a5"
  contact-link-border: "#829288"
  tag-border: "#cdd5ca"
  selected: "#e7ebe4"
  menu-surface: "#fafbf8f5"
  autumn-paper: "#faf1e5"
  autumn-ink: "#352c26"
  autumn-muted: "#74604f"
  autumn-line: "#e3cfb9"
  autumn-accent: "#914a25"
  autumn-about: "#f0e2cf"
  autumn-contact: "#49372c"
  winter-muted: "#52605b"
  winter-paper: "#dee6ed"
  winter-line: "#b5c4d0"
  winter-about: "#d1dce5"
  spring-paper: "#f5f7f1"
  summer-paper: "#f3e7cd"
  summer-ink: "#3e382e"
  summer-muted: "#625843"
  summer-line: "#d9c9aa"
  summer-accent: "#2e6668"
typography:
  display:
    fontFamily: "\"DM Sans\", Arial, sans-serif"
    fontSize: "88px"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-4px"
  headline:
    fontFamily: "\"DM Sans\", Arial, sans-serif"
    fontSize: "50px"
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: "-1.8px"
  approach-headline:
    fontFamily: "\"DM Sans\", Arial, sans-serif"
    fontSize: "43px"
    fontWeight: 500
    lineHeight: 1.17
    letterSpacing: "-1.8px"
  title:
    fontFamily: "\"DM Sans\", Arial, sans-serif"
    fontSize: "23px"
    fontWeight: 500
    letterSpacing: "-0.5px"
  lead:
    fontFamily: "\"DM Sans\", Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.8
  body:
    fontFamily: "\"DM Sans\", Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.9
  body-compact:
    fontFamily: "\"DM Sans\", Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "\"DM Sans\", Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  action:
    fontFamily: "\"DM Sans\", Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
rounded:
  portrait: "2px"
  subtle: "3px"
  toast: "4px"
  menu-item: "9px"
  menu: "16px"
  dock-compact: "18px"
  control: "24px"
  dock: "30px"
spacing:
  micro: "8px"
  compact: "12px"
  control: "16px"
  mobile-gutter: "20px"
  related: "24px"
  row: "28px"
  group: "32px"
  desktop-gutter: "56px"
  section-mobile: "58px"
  section: "86px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.subtle}"
    typography: "{typography.action}"
    padding: "16px 21px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.action}"
  language-selected:
    backgroundColor: "{colors.selected}"
    textColor: "{colors.ink}"
    rounded: "{rounded.subtle}"
    padding: "8px"
  skill-tag:
    textColor: "{colors.ink}"
    rounded: "{rounded.subtle}"
    padding: "7px 11px"
  atmosphere-control:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    typography: "{typography.label}"
    height: "44px"
    width: "96px"
  atmosphere-control-split:
    height: "44px"
    width: "44px"
  atmosphere-menu:
    backgroundColor: "{colors.menu-surface}"
    rounded: "{rounded.menu}"
    padding: "10px"
    width: "238px"
  portrait-frame:
    rounded: "{rounded.portrait}"
    width: "370px"
---
# Design System: Alessandro Bertoletti

## Overview

**Creative North Star: "Lo studio aperto"**

Lo studio aperto è un luogo professionale ma personale: il lavoro si presenta con chiarezza, mentre la curiosità trova dettagli da scoprire. Il linguaggio visivo rimane essenziale, con testo ampio nei titoli, contenuti direttamente sulla pagina e pochi elementi di separazione.

La profondità è contenuta: pagina prevalentemente piatta; ombre e trasparenze riservate ai controlli, al ritratto e alle interazioni stagionali. Pulsanti, navigazione e schede progetto sono essenziali e discreti, con dettagli curati. Le stagioni costituiscono variazioni facoltative dello stesso sistema, non identità alternative.

**Key Characteristics:**
- Carta chiara, inchiostro verde e salvia come base riconoscibile.
- Una sola famiglia sans-serif, con gerarchia affidata a dimensione, peso e spazio.
- Contenuti aperti e separatori sottili invece di un sistema di card rialzate.
- Ritratto fotografico quadrato; curiosità e movimento rivelati su richiesta.
- Profondità mirata ai controlli e agli effetti; lettura calma nello stato iniziale.

Documento dello stato esistente, aggiornato dopo le correzioni di accessibilità e prestazioni del 17 novembre 2026 su codice e browser: italiano e inglese a 1440 e 390 px, più le quattro atmosfere. Ambito: portfolio e relativi controlli. Le pagine informative `/postiz/` non definiscono il sistema del portfolio. Le fonti sono `src/style.css`, `src/playground.css`, `src/main.js`, `src/playground.js` e `src/season-icons.js`. I valori nel frontmatter sono estratti dall'implementazione; non è stato eseguito un redesign. PRODUCT.md rimane l'autorità su prodotto, contenuti e vincoli.

## Colors

La palette concordata è **carta chiara, inchiostro verde e salvia**. I nomi macchina seguono le variabili del codice; i valori normativi sono nel frontmatter.

### Primary

- **Salvia** (`accent`, CSS `--accent`): dettagli del marchio, punteggiatura, link di progetto, stato hover del pulsante principale e focus.

### Neutral

- **Carta chiara** (`paper`, CSS `--paper`): fondo della pagina.
- **Inchiostro verde** (`ink`, CSS `--ink`): titoli, testo principale e superficie del pulsante primario.
- **Inchiostro attenuato** (`muted`): descrizioni, metadati e testo di supporto.
- **Tratto leggero** (`line`): separatori, bordi e raccordi dei controlli.
- **Carta salvia** (`about-surface`): campo tonale della sezione di approccio.
- **Studio scuro** (`contact-surface`) con testo chiaro (`contact-text`) e attenuato (`contact-muted`): chiusura di contatto.
- **Selezione salvia** (`selected`) e **vetro chiaro** (`menu-surface`): selettore di lingua e menu di atmosfera; il secondo mantiene la trasparenza originale.
- **Bordo dei tag** (`tag-border`): contorno leggero dei tag e delle voci di approccio.

### Seasonal variations

Le chiavi stagionali documentano gli override realmente presenti; non sostituiscono i token base quando l'atmosfera è spenta.

| Atmosfera | Carattere osservato | Override e comportamento |
|---|---|---|
| Autunno | Carta calda e accento terracotta | Override di carta, inchiostro, testo attenuato, linea e accento; campi di approccio e contatto più caldi. Foglie singole con vita limitata. |
| Inverno | Carta azzurra più scura | Override di carta, testo attenuato e linea, approccio freddo; neve chiara visibile sul fondo. Gli altri ruoli ereditano la base. |
| Primavera | Carta leggermente verde | Cambia il fondo; il resto della gerarchia cromatica rimane quello base. Fiori e insetti forniscono la variazione visiva. |
| Estate | Sabbia e accento acqua | Override completo dei cinque ruoli; grana di sabbia e mare in fondo. Approccio e contatto diventano trasparenti, con testo scuro. |

**The Quiet Base Rule.** Mantieni neutra la presentazione iniziale. Le atmosfere si attivano su scelta del visitatore e non devono nascondere il contenuto.

## Typography

**Display Font:** DM Sans, con fallback Arial e sans-serif.
**Body Font:** la stessa famiglia. Non è presente un carattere mono dedicato.

**Character:** una sans-serif comune a titoli, narrazione e controlli mantiene un tono diretto e personale. Titoli a peso medio e tracking stretto danno identità senza ricorrere a grassetti pesanti; il testo descrittivo usa un peso normale e interlinea generosa.

### Hierarchy

I token `display` e `headline` registrano il limite desktop superiore; il comportamento fluido effettivo è specificato qui e nei frammenti, perché il formato dei token dimensionali richiede valori semplici.

| Ruolo | Implementazione desktop | Adattamento osservato |
|---|---|---|
| Display | `clamp(54px, 6.4vw, 88px)`, peso 500, interlinea 1.08, tracking -4px | A 1000 px o meno: 64 px e tracking -3 px. A 700 px o meno: `clamp(46px, 12vw, 70px)` e tracking -2.3 px. |
| Headline | `clamp(34px, 3.8vw, 50px)`, peso 500, interlinea 1.17, tracking -1.8px | 36 px nel layout mobile generale. |
| Titolo approccio | 43 px, stessa struttura headline | 36 px a 1000 px o meno; 34 px a 700 px o meno. |
| Titoli di progetto e voci | 23 px per i progetti, 22 px per la timeline, 21 px per gli step | Timeline a 21 px su mobile. |
| Introduzione | 17 px, interlinea 1.8, larghezza massima 475 px | 15 px a 1000 px o meno; 16 px a 700 px o meno. |
| Corpo | 15 px per approccio e progetti; interlinea rispettivamente 1.9 e 1.8 | La dimensione resta 15 px su mobile. |
| Corpo compatto | 14 px per step e timeline, interlinea 1.8 | La dimensione resta 14 px su mobile. |
| Navigazione e azioni | Navigazione e pulsante primario a 13 px | Navigazione e pulsante a 12 px su mobile; lingua a 12 px con bersaglio minimo 32 × 32 px. |
| Titolo contatto | `clamp(45px, 5.5vw, 72px)` con tracking -2.5px | 44 px e tracking -1.5px su mobile. |

Le etichette funzionali, le date, i tag, le informazioni sul ritratto e i comandi del footer usano ora almeno 12 px. La precedente scala da 8–10 px è stata corretta dopo l'audit; non fa parte delle raccomandazioni attuali. I titoli e la famiglia tipografica restano quelli approvati. La testata e i titoli ammettono il reflow quando il visitatore ingrandisce il testo, invece di forzarlo in contenitori rigidi.

**The Evidence Before Prescription Rule.** I valori descrivono il codice verificato. Non abbassare la leggibilità dei testi funzionali per recuperare spazio: consentire il reflow e verificare entrambe le lingue.

## Layout

Contenitore centrato, largo `calc(100% - 112px)` fino a un massimo di 1180 px. Sotto i 1000 px usa `calc(100% - 64px)`; sotto i 700 px usa `calc(100% - 40px)`. Il margine effettivo resta almeno 56, 32 o 20 px secondo il breakpoint e cresce quando interviene il limite massimo. I fondi a tutta larghezza contengono un blocco interno con questi margini; non richiedono un secondo rientro duplicato.

La struttura desktop usa rapporti diversi secondo il contenuto: introduzione 1.5:1 con distanza 70 px; approccio 1.4:1 con distanza 95 px; progetti su due colonne uguali con distanza 32 px; timeline su data, contenuto e tipo (210 px / flessibile / 110 px) con distanza 25 px. Non è una griglia uniforme di card. Il ritmo di sezione è 86 px sopra e sotto; su mobile è 58 px, con eccezioni locali già codificate.

A 700 px o meno, introduzione, approccio, progetti e timeline passano a una colonna. La testata va su due righe: marchio e controlli sopra, navigazione distribuita sotto. La testata desktop ha un minimo di 100 px e può andare a capo; su mobile il minimo è 108 px. I controlli stagionali mantengono la geometria base e crescono proporzionalmente al testo ingrandito. Il ritratto resta quadrato, con massimo 370 px desktop e 350 px mobile. I loghi aziendali si adattano con colonne da almeno 130 px.

I breakpoint osservati sono 1050 e 1000 px per la compattezza, 700 px per la riorganizzazione principale e 600/500 px per il dock. Non esiste nel codice una scala di spaziatura matematica unica: i token registrano valori ricorrenti, senza inventare un vincolo a multipli fissi.

## Elevation & Depth

La base è piatta: gerarchia attraverso spazio, testo, fondi tonali e linee sottili. Il tratto non richiede una card di fondo per ogni blocco. La profondità è riservata ai controlli, al ritratto e alle interazioni stagionali, come confermato durante la documentazione.

### Shadow Vocabulary

- **Menu flottante:** `0 16px 45px #28382c20, 0 2px 6px #28382c08`, con sfondo chiaro semitrasparente e blur dello sfondo a 20 px.
- **Dock:** `0 6px 25px #25372d15`, con blur dello sfondo a 15 px; deve restare leggibile anche come superficie chiara quando il blur non è disponibile.
- **Bordo del portale fotografico:** ombra interna di `0 2px 8px #142c3c48`, filo di luce `0 0 1px 1px #ffffff22` e ombra esterna `0 5px 16px #12253520`.
- **Scia del portale:** `0 0 10px #ffffff50, inset 0 0 10px #ffffff20`; un'eco breve del movimento, non un alone permanente sul ritratto.
- **Estate:** luce e ombre direzionali sui soggetti previsti dal codice, in relazione al movimento del sole. Non applicarle alla presentazione neutra.

**The Flat By Default Rule.** Non aggiungere ombre alle schede progetto o alla timeline per uniformarle ai controlli flottanti. La distinzione tra lettura piatta e interazione rialzata è intenzionale.

## Shapes

Il vocabolario distingue contenuto e strumento. Fotografia quadrata con angoli quasi netti (token `portrait`); pulsante primario, lingua e tag con un raggio appena accennato (`subtle`). Le schede progetto sono blocchi aperti senza un contorno arrotondato completo.

I controlli di atmosfera hanno una forma a capsula; il menu e il dock usano angoli più morbidi. Il gruppo stagionale occupa 96 × 44 px sia nello stato unico sia in quello diviso: due controlli da 44 × 44 px, separati da 8 px. Il raccordo SVG rende visibile la divisione e la ricongiunzione. Il cerchio del portale e le piccole icone rotonde appartengono all'interazione, non trasformano il ritratto in un'immagine circolare.

## Components

Carattere concordato: **essenziali e discreti, con dettagli curati**. I frammenti in `.impeccable/design.json` riproducono le forme esistenti, non implementano nuove funzionalità.

### Buttons and links

Il pulsante primario è pieno, in inchiostro verde con testo bianco, rientro 16 × 21 px e spazio tra testo e simbolo di 40 px. L'hover passa a salvia in 200 ms; il focus usa un contorno da 2 px con offset 6 px. Su mobile il rientro è 15 × 18 px. L'azione secondaria è un semplice link testuale: non aggiungere un secondo pulsante pieno per simmetria. I link di progetto usano l'accento e mostrano una sottolineatura al passaggio.

### Navigation and language

Navigazione orizzontale con interlinea 1.5 e distanza 24 px, ridotta a 16 px sotto i 1050 px. A dimensioni mobili la navigazione ha una riga propria. La lingua attiva è evidenziata da una piccola superficie salvia e peso 600; il separatore verticale distingue il gruppo lingua dal gruppo atmosfera.

### Skill tags

Tag di competenze su fondo trasparente, bordo sottile e raggio minimo; rientro 7 × 11 px e distanza 8 px tra tag. Sono etichette, non filtri o pulsanti. Il testo dei tag è a 12 px, come le altre etichette funzionali.

### Project entries and timeline

Le voci progetto associano simbolo approvato, titolo e descrizione breve, con una linea superiore. Non aggiungere una seconda immagine o ripetere il nome in un banner decorativo. La timeline usa linee orizzontali e colonne; il colore attenuato distingue le descrizioni. I frammenti di anteprima non sostituiscono i marchi approvati con icone inventate.

### Atmosphere controls and menu

Stato neutro: un controllo testuale unico. Stato attivo: stagione e azione contestuale, entrambe rappresentate da icone. La divisione/ricongiunzione dura 1050 ms, con raccordo che si assottiglia e un breve rimbalzo; il menu entra in 220 ms. Sotto i 700 px il menu è fissato a 66 px dal bordo superiore e 20 px da destra, con larghezza 240 px e altezza limitata alla finestra. I nomi accessibili e gli stati `aria-expanded`/`aria-pressed` restano parte del comportamento.

### Tool dock

Barra flottante centrata in basso, larghezza legata al contenuto e massimo `calc(100vw - 28px)`. Include istruzioni e uscita; l'azione per pulire la sabbia e quella di ripristino appaiono nel contesto previsto. Sotto i 600 px può andare su più righe. Il dock non è una nuova barra di navigazione permanente.

### Portrait portal and motion

Fotografia professionale sempre davanti, fotografia giocosa visibile soltanto nel portale quando l'atmosfera è attiva. Il raggio obiettivo è `clamp(60px, larghezza × 0.22, 84px)`. Il bordo si deforma leggermente durante il movimento e una breve scia segue il puntatore. Il cambio foto usa 500 ms; il portale usa una molla con rigidità 576 e smorzamento 34, posizione con fattore esponenziale 24 e scia 12.

La maschera circolare rimane fissa: si muovono trasformazioni del contenitore e controtrasformazioni della foto per evitare il ridisegno di un tracciato a ogni fotogramma. Il ciclo del portale si ferma a riposo e nelle schede nascoste. Gli accumuli di neve a riposo hanno un livello canvas separato, aggiornato quando cambia la scena o per il decadimento; i fiocchi in volo restano fluidi. Il movimento ridotto e il comando Interazioni prevalgono sugli effetti. Questo movimento mirato è parte dell'identità confermata, non un invito ad animare ogni testo.

## Do's and Don'ts

### Do:
- **Do** mantenere carta chiara, inchiostro verde e salvia come identità di base, adattando le variabili semantiche per le stagioni.
- **Do** conservare una gerarchia tipografica chiara e spazio attorno ai contenuti, verificando entrambe le lingue a dimensioni reali.
- **Do** usare i marchi di progetto approvati e fotografie nitide con inquadrature coerenti.
- **Do** mantenere separati lingua e atmosfera, vicini i due controlli stagionali e visibili gli stati di focus.
- **Do** rendere effetti, strumenti e rivelazione del ritratto facoltativi, reversibili e compatibili con touch, tastiera e movimento ridotto.

### Don't:
- **Don't** trasformare le sezioni aperte in una griglia generica di card con ombre.
- **Don't** introdurre font, colori di accento o forme estranee solo per decorare una nuova sezione.
- **Don't** rendere effetti o animazioni necessari per leggere la pagina o trovare il contatto.
- **Don't** cambiare le fotografie in modo casuale, mostrare tutta la foto giocosa al passaggio o reintrodurre la deformazione dell'intero ritratto.
- **Don't** scambiare l'estrazione dei valori o un controllo automatico senza errori per una certificazione completa di accessibilità.
