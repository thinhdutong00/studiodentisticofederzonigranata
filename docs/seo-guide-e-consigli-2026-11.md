# "Guide e consigli" — stato del lavoro, novembre 2026

Ramo `seo-guide-e-consigli`. Riferimento per le pagine preesistenti: commit `949eb11` (`main`, in produzione dal 12/11/2026).

## Regola di ambito

Le pagine che esistevano in `949eb11` non vengono modificate, né direttamente né tramite componenti, CSS, layout, dati o configurazioni condivise. Le sole aggiunte condivise sono:

1. La voce "Guide e consigli" nel gruppo Informazioni del menu, dopo "Video" e prima di "FAQ" (`src/components/Header.astro`, una riga).
2. Le URL nuove in sitemap (`src/pages/sitemap.xml.ts`, tre righe). Le URL preesistenti restano come prima.

Tutto il resto vive in file nuovi: `src/data/guides.js`, `src/components/GuidePage.astro`, `src/components/GuideRequestForm.astro`, `src/pages/guide-e-consigli/`, `tests/guides.test.mjs`.

Verifica: `git diff 949eb11 --stat -- src public api server integrations` deve elencare, tra i file preesistenti, soltanto `Header.astro` e `sitemap.xml.ts`.

## Modifiche annullate rispetto al primo intervento

- `/modena/`, `/reggio-emilia/`: title, description, dati strutturati `Dentist`, sezione "Prima di prenotare".
- Pagine trattamento: blocco "Per approfondire prima della visita".
- Approfondimenti esistenti: blocco "Altri approfondimenti" con collegamenti e richiamo a `/richiesta/`.
- `/informazioni/`: testo e elenco di collegamenti.
- `/urgenze/`, `/faq/`, `/casi-clinici/`, `/informazioni/`: title e description.
- `/richiesta/`: conservazione della sede senza trattamento.
- `/grazie/`, `/new-page/`: `noindex` ed esclusione dalla sitemap.
- `/recensioni/`: aggiunta alla sitemap.

## Problemi preesistenti segnalati, non corretti

- `/grazie/` e `/new-page/` sono indicizzabili e in sitemap.
- `/recensioni/` è indicizzabile ma assente dalla sitemap.
- `/informazioni/` contiene il testo "Pagina dedicata in preparazione".
- `/modena/`, `/reggio-emilia/`, `/urgenze/`, `/faq/`, `/casi-clinici/` hanno title e description generici; le pagine sede non hanno dati strutturati e hanno come H1 il solo nome della città.
- `/richiesta/` ignora `sede` e `motivo` quando `trattamento` manca o non è riconosciuto.
- Le pagine trattamento e gli approfondimenti esistenti non collegano le guide.
- `/dentiera-fissa-cose-e-vantaggi/` e altri approfondimenti risultavano non indicizzati al 13/11/2026.

## Modulo breve e `/richiesta/`

`/richiesta/` legge tre parametri: `trattamento` (confrontato con etichette e alias), `motivo` (applicato solo se coincide con un'opzione del trattamento) e `sede`. `motivo` e `sede` vengono applicati solo se il trattamento è riconosciuto.

Le guide si adattano a questo comportamento:

- Guide con trattamento univoco: `trattamento` fisso, `sede` e `motivo` a scelta. I valori di `motivo` sono le opzioni reali del questionario.
- Guide generiche o di confronto e indice: `trattamento` a scelta, con "Da valutare insieme" che invia il valore `Altro`, previsto dal questionario. Così la sede non va persa.

Il modulo breve non invia richieste: porta a `/richiesta/`, dove avviene l'invio.

## Guide pubblicabili

Stato SEO di tutte: creata, indicizzabile, in sitemap. Non pubblicata in produzione, nessuna richiesta di indicizzazione inviata, nessuna indicizzazione verificata.

| URL | Domanda intercettata |
| --- | --- |
| `/guide-e-consigli/` | Indice |
| `/guide-e-consigli/costo-allineatori-trasparenti/` | Quanto costa l'apparecchio invisibile |
| `/guide-e-consigli/prima-visita-ortodontica-bambini/` | A che età la prima visita |
| `/guide-e-consigli/preventivo-impianto-dentale/` | Quanto costa un impianto completo |
| `/guide-e-consigli/denti-mancanti-ponte-impianto-protesi/` | Come sostituire un dente mancante |
| `/guide-e-consigli/gengive-che-sanguinano/` | Gengive che sanguinano, parodontite |
| `/guide-e-consigli/dolore-click-mandibola-bruxismo/` | Gnatologo, click, bruxismo |
| `/guide-e-consigli/trauma-dentale-cosa-fare/` | Dente rotto o caduto |
| `/guide-e-consigli/sistemare-i-denti-da-dove-iniziare/` | Sistemare i denti, più problemi insieme |
| `/guide-e-consigli/preventivo-dentista-come-leggerlo/` | Dentista economico, prezzi, confronto preventivi |
| `/guide-e-consigli/pulizia-denti-o-pulizia-profonda/` | Pulizia denti, pulizia parodontale |
| `/guide-e-consigli/faccette-composito-o-ceramica/` | Faccette, composite bonding |

## Mappa delle opportunità (seconda analisi)

Fonti: Search Console, proprietà di dominio, 16/09–10/11/2026, tutti i paesi (665 query lette il 13/11/2026). Google Ads, termini di ricerca: storico dell'account fino al 13/11/2026 (prime 100 righe per conversioni e per impressioni) e ultimi 30 giorni, 14/10–12/11/2026. Le "conversioni" Ads comprendono moduli, chiamate, indicazioni stradali e visualizzazioni: non sono richieste di visita. Keyword Planner, suggerimenti e domande correlate: non consultati, il collegamento al browser non era disponibile. Nessun volume di mercato è stato usato.

| Domanda | Evidenza | Trattamento | Copertura attuale | Opportunità residua | Potenziale | Decisione |
| --- | --- | --- | --- | --- | --- | --- |
| sistemare denti, mettere i denti | Ads storico: 86 clic, 683 impr., 9 conv.; "mettere i denti" 3 clic | Tutto il catalogo | Nessuna pagina di orientamento | Chi ha più problemi non sa da dove partire | Alto (valutazione): intenzione di cura già presente | Nuova guida |
| dentista economico, prezzi bassi, curarsi i denti a poco prezzo | GSC: 91 impr. su 6 query; Ads storico: "impianti dentali economici" 54 clic | Tutto il catalogo | Solo le due guide su allineatori e impianti | Come leggere e confrontare un preventivo | Medio-alto: il costo è il dubbio più frequente | Nuova guida |
| pulizia denti + città, pulizia parodontale costo, scaling | GSC: 36 impr. su 8 query; Ads 30 gg: 27 impr.; storico: 12 clic | Igiene, parodontologia | La pagina igiene risponde a "ogni quanto" | Differenza tra igiene e pulizia sotto gengiva | Medio: porta di ingresso frequente | Nuova guida |
| faccette dentali, composite bonding, faccette + città | Ads storico: 850 impr., 44 clic, 0 conv.; variante locale 4 clic; GSC: circa 14 impr. | Faccette in composito e in ceramica | Due pagine separate, entrambe con l'opzione "Confrontare composito e ceramica" | Il confronto diretto | Medio: evidenza limitata | Nuova guida |
| sbiancamento + città, sbiancamento denti prezzo | GSC: 176 impr.; Ads storico: 841 impr., 38 clic | Sbiancamento | `/sbiancamento/` copre indicazioni, durata, sensibilità | Nessuna sostanziale | — | Già coperto |
| impianto di denti fissi, all on six, carico immediato | Ads storico: 46 + 15 clic; GSC: 6 impr. | Implantologia | `/dentiera-fissa-cose-e-vantaggi/` e FAQ del trattamento | Sarebbe una replica | — | Già coperto. Limite: l'articolo non risultava indicizzato |
| protesi a clip, senza palato, a bottone, overdenture | GSC: circa 200 impr. a posizioni basse; Ads storico: 37 clic | Protesi | Articolo protesi mobili invisibili | Soluzione su impianti non descritta nel sito | — | Escluso: prestazione non confermata |
| apparecchio palato bambini, apparecchio mobile bambini | GSC: 25 impr. | Ortodonzia bambini | Pagina ortodonzia bambini, guida sulla prima visita | Dispositivo non nominato dal sito | — | Escluso: non confermato |
| carie, come si cura la carie | GSC: 35 impr. a posizione 20 circa | Conservativa | `/conservativa-otturazioni/` | Minima | Basso | Già coperto |
| convenzionato Unisalute, Metasalute, ASL | GSC: 10 impr.; Ads storico: 138 clic su "convenzionato asl" | — | `/convenzioni/` | La ricerca vuole studi convenzionati | Basso: lo studio dichiara solo supporto documentale | Escluso |
| prima visita, visita dentistica | GSC: poche impressioni | — | `/prima-visita/` | Solo il costo, dato dello studio | — | Già coperto |
| devitalizzazione, endodonzia | GSC: 6 impr. | Endodonzia | Pagina trattamento | Non dimostrata | — | Escluso per assenza di evidenza |
| russamento, apnee | Nessuna evidenza | Dispositivi antirussamento | Pagina trattamento | Non dimostrata | — | Escluso per assenza di evidenza |
| denti del giudizio, dente anchilosato, tumore lingua | GSC | Chirurgia orale | Approfondimenti esistenti | — | — | Già coperto |

## Argomenti prima sospesi

- **Prima visita:** le informazioni generali sono già in `/prima-visita/`. Manca solo il costo, che è un dato dello studio: non blocca altre guide, ma una guida dedicata sarebbe una replica.
- **Convenzioni:** manca l'elenco dei fondi con cui lo studio ha accordi. Senza, una guida attirerebbe una richiesta che non si può soddisfare. Il supporto documentale è citato nella guida sul preventivo.
- **Faccette:** nessun dato dello studio era indispensabile. Guida realizzata con informazioni generali.
- **Russamento:** le informazioni cliniche generali sono verificabili; manca l'evidenza di domanda. Da rivalutare con Keyword Planner.
- **Costi:** non servono i prezzi dello studio per spiegare un preventivo. Guida realizzata.

## Fonti cliniche e normative

- Ministero della Salute, *Raccomandazioni cliniche in odontostomatologia* (2017): prima visita verso i 18–24 mesi (verificato nel testo); riferimento generale per le altre aree.
- Ministero della Salute, *Linee guida traumi dentali in età evolutiva* (2018): primo soccorso (verificato nel testo).
- American Association of Orthodontists: controllo ortodontico entro i 7 anni.
- NIDCR: disordini temporo-mandibolari.
- SIdP: sanguinamento gengivale, igiene professionale almeno due volte l'anno, linee guida EFP S3.
- Legge 124/2017, art. 1, comma 150: preventivo di massima in forma scritta o digitale.

Per le faccette non è stata trovata una fonte istituzionale rivolta ai pazienti: la guida riporta caratteristiche generali dei materiali. **Tutte le guide richiedono una lettura clinica prima della pubblicazione; nessuna dichiara autore o revisore.**

## Controlli

Eseguiti: confronto dei file con `949eb11`; test automatici (`npm test`); build dell'anteprima su Vercel.

Non disponibili in questa sessione: build locale (pacchetti non installabili), controllo visivo delle pagine renderizzate, confronto dell'HTML generato delle pagine preesistenti, verifica in Search Console.
