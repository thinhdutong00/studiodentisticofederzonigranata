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

## Indice e guide preparati

Il catalogo elenca le URL predisposte per l’indice e per la sitemap. Il deploy sul dominio e i risultati di Search Console vanno verificati separatamente.

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
| `/guide-e-consigli/devitalizzare-o-togliere-il-dente/` | Devitalizzare o togliere un dente, dente devitalizzato che fa male |
| `/guide-e-consigli/gengive-ritirate-cause-cosa-fare/` | Gengive ritirate: cause, ricrescono |
| `/guide-e-consigli/bite-a-cosa-serve/` | Bite: a cosa serve, bruxismo, farmacia o dentista |
| `/guide-e-consigli/apparecchio-per-non-russare/` | Apparecchio per non russare, russamento e apnee |
| `/guide-e-consigli/ascesso-dentale-quando-chiedere-aiuto/` | Come comportarsi in caso di sospetto ascesso |
| `/guide-e-consigli/denti-sensibili-al-freddo/` | Quando far controllare una fitta con il freddo |
| `/guide-e-consigli/alitosi-persistente-quando-dal-dentista/` | A chi rivolgersi per l’alitosi che ritorna |
| `/guide-e-consigli/gengiva-che-sanguina-attorno-a-un-impianto/` | Come riconoscere un cambiamento attorno a un impianto già guarito |

## Mappa delle opportunità (seconda analisi)

Fonti: Search Console, proprietà di dominio, 16/09–10/11/2026, tutti i paesi (665 query lette il 13/11/2026). Google Ads, termini di ricerca: storico dell'account fino al 13/11/2026 (prime 100 righe per conversioni e per impressioni) e ultimi 30 giorni, 14/10–12/11/2026. Le "conversioni" Ads comprendono moduli, chiamate, indicazioni stradali e visualizzazioni: non sono richieste di visita. In questa fase storica mancava il collegamento al browser. Le successive analisi di suggerimenti italiani e Keyword Planner sono documentate più avanti.

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
| devitalizzazione, endodonzia | GSC: 6 impr. | Endodonzia | Pagina trattamento | Non dimostrata | — | Rinviato in questa fase per domanda non dimostrata dal campione |
| russamento, apnee | Domanda non dimostrata da questi dati | Dispositivi antirussamento | Pagina trattamento | Non dimostrata | — | Rinviato in questa fase per domanda non dimostrata dal campione |
| denti del giudizio, dente anchilosato, tumore lingua | GSC | Chirurgia orale | Approfondimenti esistenti | — | — | Già coperto |

## Argomenti prima sospesi

- **Prima visita:** le informazioni generali sono già in `/prima-visita/`. Manca solo il costo, che è un dato dello studio: non blocca altre guide, ma una guida dedicata sarebbe una replica.
- **Convenzioni:** manca l'elenco dei fondi con cui lo studio ha accordi. Senza, una guida attirerebbe una richiesta che non si può soddisfare. Il supporto documentale è citato nella guida sul preventivo.
- **Faccette:** nessun dato dello studio era indispensabile. Guida realizzata con informazioni generali.
- **Russamento:** il primo campione non permetteva di quantificare la domanda. La verifica successiva con Keyword Planner è riportata sotto.
- **Costi:** non servono i prezzi dello studio per spiegare un preventivo. Guida realizzata.

## Controlli della prima anteprima

Eseguiti: confronto dei file con `949eb11`; test automatici (`npm test`); build dell'anteprima su Vercel.

In quella sessione erano rimasti da eseguire: build locale (pacchetti non installabili), controllo visivo delle pagine renderizzate, confronto dell'HTML generato delle pagine preesistenti, verifica in Search Console.

## Terza analisi: suggerimenti di ricerca Google (13/11/2026)

Fonte: completamento automatico di Google, lingua italiana, Italia, letto il 13/11/2026 per 18 termini di partenza. I suggerimenti mostrano come le persone formulano le ricerche: non sono volumi e non dimostrano domanda locale. In questa fase Keyword Planner non era ancora stato consultato.

| Termine | Suggerimenti osservati | Trattamento offerto | Decisione |
| --- | --- | --- | --- |
| devitalizzazione, dente devitalizzato | fa male, quanto dura, quante sedute, conseguenze, fa male dopo anni, rotto si può ricostruire, "devitalizzare o togliere un dente" | Endodonzia | Nuova guida |
| russamento, apnee, apparecchio per non russare | russamento e apnee notturne, apparecchio denti per non russare, apnee cosa fare, sono pericolose | Dispositivi per russamento e apnee | Nuova guida |
| bite denti | a cosa serve, bruxismo, farmacia, costo dentista, per mandibola | Gnatologia | Nuova guida |
| gengive ritirate | cause, ricrescono, cura, rimedi | Parodontologia | Nuova guida |
| otturazione, dente scheggiato | costo, fa male, cosa fare, ricostruzione | Conservativa | Già coperto da pagina trattamento e guida sui traumi |
| apparecchio denti adulti | costo, prima e dopo, quanto tempo, invisibile | Ortodonzia | Già coperto da pagine esistenti e guida sul costo |
| ascesso dentale, mal di denti | come si cura, antibiotico, cosa prendere | Urgenze | Non realizzata: le ricerche chiedono indicazioni su farmaci, che una guida dello studio non deve dare |
| sensibilità denti, alitosi | cause, rimedi, dopo pulizia | Igiene, parodontologia | Non realizzate: da valutare con dati di volume |
| dentista modena, dentista reggio emilia | economico, prezzi, aperto sabato, aperti adesso, vie e nomi di altri studi | — | Costi: guida sul preventivo. Sabato: lo studio è chiuso, nessun contenuto |

Per la devitalizzazione erano emerse sei impressioni in Search Console. Per il russamento il primo campione non dimostrava domanda. Le formulazioni emerse dal completamento automatico hanno orientato la stesura senza quantificare le ricerche locali.

## Ricerca locale e decisioni finali del 13 novembre 2026

Lettura del catalogo, delle pagine attuali delle prestazioni, degli otto approfondimenti precedenti, delle quindici guide presenti sul ramo e delle opzioni reali di `/richiesta/`. I dati storici già estratti da Search Console e Google Ads sono quelli descritti nella seconda analisi. La geografia dell’estrazione dei termini Ads non era documentata e non viene assimilata alle due città.

**Keyword Planner.** Consultato dall’interfaccia Google Ads dello studio con «Individua nuove parole chiave», rete Google, lingua italiana, località di tipo *città* Modena e Reggio Emilia, dati aggregati da novembre 2025 a ottobre 2026. Il connettore Supermetrics per Google Ads e Keyword Planner risultava privo di autenticazione, mentre la sessione Chrome autorizzata ha permesso la ricerca diretta. La colonna «Media ricerche mensili» fornisce stime arrotondate per termini e varianti vicine. Non sommare le righe, dividerle per città o interpretarle come pazienti, contatti o tassi di conversione. Sono state lette tutte le nove parole fornite e le prime idee correlate, senza estrarre l’intero elenco delle 2.532 idee. I dati di concorrenza pubblicitaria non misurano la difficoltà SEO. [Strumento di pianificazione delle parole chiave](https://ads.google.com/aw/keywordplanner/home)

**Ricerca web.** Consultati risultati in italiano su sensibilità dentale, alitosi, impianti, ascesso, devitalizzazione e russamento, anche con richiami a Modena e Reggio Emilia. Le pagine pubblicate dalla SIE e dall’AIDI e i capitoli del Ministero confermano l’esistenza di quesiti e percorsi documentabili. Le pagine dello studio confermano le prestazioni. La presenza di una pagina nei risultati non misura il numero di ricerche nelle singole città. Il completamento automatico italiano è quello già rilevato nella terza analisi. Non sono stati estratti dati separati dal box «Le persone hanno chiesto anche». [SIE, domande sulla cura canalare](https://www.endodonzia.it/cose-un-trattamento-endodontico-o-cura-canalare-o-devitalizzazione-del-dente-in-cosa-consiste/) · [Endodonzia dello studio](https://studiodentisticofederzonigranata.it/endodonzia-devitalizzazioni/) · [Dispositivi per russamento e apnee dello studio](https://studiodentisticofederzonigranata.it/dispositivi-russamento-apnee-notturne/)

Le stime seguenti hanno tutte periodo, rete, lingua e geografia indicati sopra. La colonna sul potenziale esprime un giudizio editoriale sulla decisione della persona, senza previsione numerica. Le quattro aggiunte rispondono a esigenze che il catalogo trattava marginalmente. Per le altre, la stessa domanda può trovare risposta presso una pagina già preparata.

| Domanda e stima mensile osservata | Prestazione e copertura del sito | Decisione, potenziale qualitativo e percorso |
| --- | --- | --- |
| «ascesso dentale» 110; idea correlata «ascesso gengivale» 50 | Urgenze, endodonzia, cura delle gengive. `/urgenze/` spiega il ricontatto dello studio; la guida sui traumi riguarda un evento diverso. | **Aggiunta** `/guide-e-consigli/ascesso-dentale-quando-chiedere-aiuto/`. È distinta la scelta immediata fra telefonare al dentista e chiamare il 112. Potenziale di contatto urgente, senza incentivare la compilazione del modulo nelle emergenze. Nessun consiglio su quale farmaco assumere. |
| «denti sensibili al freddo» 10 | Conservativa, igiene, gengive. La conservativa tratta anche la sensibilità dopo un restauro; la guida sulle recessioni parte da una gengiva già ritirata. | **Aggiunta** `/guide-e-consigli/denti-sensibili-al-freddo/`. Il lettore parte da una fitta senza conoscere la causa; descrivere sede, stimolo e durata prepara un controllo. Potenziale di valutazione individuale, sostenuto da un segnale locale contenuto. |
| «alitosi» 10; idee «alitosi cause» 20, «alito cattivo cause» 20, «alitosi rimedi» 10 | Igiene, parodontologia, conservativa. Il sito cita l’alitosi fra i segni gengivali ma non orienta fra cause orali e altre possibili cause. | **Aggiunta** `/guide-e-consigli/alitosi-persistente-quando-dal-dentista/`. Il dubbio distinto è a chi rivolgersi dopo i tentativi di igiene. Potenziale di controllo ordinario, senza promettere una prestazione specialistica per l’alitosi. |
| «perimplantite» 10 | Implantologia, igiene, parodontologia. La pagina impianti e le guide su preventivi e denti mancanti riguardano soprattutto la fase precedente all’intervento. | **Aggiunta** `/guide-e-consigli/gengiva-che-sanguina-attorno-a-un-impianto/`. Si rivolge a chi porta già una protesi su impianto e osserva un cambiamento. Potenziale circoscritto a una visita di controllo e mantenimento; nessuna promessa di recupero dell’impianto. |
| «devitalizzazione» 10; suggerimento italiano «devitalizzare o togliere un dente» | Endodonzia e chirurgia orale confermate. Il trattamento spiega la procedura, mentre la guida confronta recuperabilità del dente e alternative. | **Conservata** `/guide-e-consigli/devitalizzare-o-togliere-il-dente/`. Il quesito può precedere una decisione di cura. Nessuna seconda guida per le varianti su dolore o sedute. |
| «apparecchio per non russare» 10; suggerimenti «russamento e apnee notturne», «apnee cosa fare» | Dispositivi per russamento e apnee, con percorso medico per la diagnosi dell’apnea. La guida chiarisce quando ha senso il contributo del dentista. | **Conservata** `/guide-e-consigli/apparecchio-per-non-russare/`. Potenziale per una valutazione odontoiatrica appropriata alla situazione, senza assumere che tutte le persone che russano necessitino di un dispositivo. |
| «bite denti» 70; idea «bite notturno» 10 | Gnatologia. Alla guida su dolore e click alla mandibola si affianca la guida sulla scelta del dispositivo. | **Conservata** `/guide-e-consigli/bite-a-cosa-serve/`. Le varianti sul bite notturno portano allo stesso percorso; potenziale di visita quando la scelta richiede una valutazione. |
| «gengive ritirate» 10; idee «gengive che si ritirano» 10, «le gengive ritirate possono tornare normali» 10 | Parodontologia. Recessione e sanguinamento sono quesiti distinti. | **Conservata** `/guide-e-consigli/gengive-ritirate-cause-cosa-fare/`. Una sola pagina per causa, evoluzione e valutazione. Potenziale di controllo se il margine gengivale cambia. |
| «apparecchio di contenzione» 10 | Fase già spiegata in `/ortodonzia-allineatori-invisibili/`, nei percorsi ortodontici e nella guida sul preventivo degli allineatori. | **Nessuna nuova URL**. Il quesito generale sul mantenimento ha risposta. Il campione non identifica un bisogno operativo specifico scoperto; potenziale incrementale non dimostrato. |

**Copertura del catalogo restante.** Pedodonzia ha già l’approfondimento su carie dei denti da latte e la guida sulla prima visita. Sbiancamento ha una pagina dedicata alle indicazioni e ai limiti. Faccette in composito e in porcellana sono confrontate in una guida unica. Protesi fissa e mobile, sostituzione di denti e preventivi sono già trattati. In chirurgia orale sono presenti articoli su ottavi, estrazione e anchilosi. La conservativa tratta otturazioni e restauri; gli eventi traumatici hanno una guida distinta. Per questi gruppi, fonti, evidenze storiche e motivi di esclusione sono nelle due mappe precedenti. Le due città condividono le guide e la scelta della sede nel modulo. I termini legati ad apertura nel fine settimana, convenzioni specifiche e dispositivi non confermati rimangono esclusi.

**Verifica delle affermazioni delle quattro aggiunte.** Per il sospetto ascesso sono state verificate le indicazioni del NHS per l’assistenza odontoiatrica urgente e i segni di emergenza, insieme al percorso 112 della Regione. La sensibilità è stata verificata con il quaderno clinico SIE, la scheda AIDI e la scheda per pazienti dell’American Dental Association. Per l’alitosi sono stati verificati il capitolo specifico delle raccomandazioni ministeriali e la scheda NHS. Per i tessuti intorno agli impianti sono state consultate le FAQ per pazienti e le indicazioni EFP sulla prevenzione, con la scheda AIDI per l’igiene. [NHS, ascesso](https://www.nhs.uk/conditions/dental-abscess/) · [Regione Emilia-Romagna, emergenze](https://salute.regione.emilia-romagna.it/assistenza-ospedaliera/emergenza) · [SIE, quaderno clinico](https://www.endodonzia.it/wp-content/uploads/2024/07/BACHECA_QuadernoClinicoDiEndodonzia.pdf) · [AIDI, sensibilità](https://www.aiditalia.it/wp-content/uploads/2021/10/AIDIVademecum_IPERSENSIBILITA%E2%95%A0%C3%87-DENTALE-1.pdf) · [American Dental Association, denti sensibili](https://www.mouthhealthy.org/all-topics-a-z/sensitive-teeth/) · [Ministero della Salute](https://www.salute.gov.it/new/sites/default/files/imported/C_17_pubblicazioni_2637_allegato.pdf) · [NHS, alitosi](https://www.nhs.uk/symptoms/bad-breath/) · [EFP, impianti](https://www.efp.org/for-patients/dental-implants/faqs/) · [EFP, prevenzione](https://www.efp.org/fileadmin/uploads/efp/Documents/Other_publications/Clinical_guidelines/peri-implantitis-guideline-01-prevention.pdf) · [AIDI, igiene degli impianti](https://www.aiditalia.it/wp-content/uploads/2020/10/AIDI_VADEMECUM_GENERICO-TRENTINO-002-1.pdf)

## Verifica documentale dei testi delle 15 guide presenti nel ramo di Claude

Il 13 novembre 2026 sono stati riletti titoli, descrizioni, introduzioni, punti chiave, testi, tabelle, FAQ, rimandi e CTA delle 15 guide presenti al commit `9ed9bba`. I riferimenti clinici pertinenti sono stati collegati direttamente nelle guide. La verifica riguarda i testi ed è documentale. Nessun professionista dello studio è indicato come autore o revisore.

| Guide | Verifica e correzioni | Fonti consultate |
| --- | --- | --- |
| Allineatori | Mantenute le voci da chiarire nel preventivo, senza importi. Resi condizionali gli effetti della complessità e dell’aderenza sulla durata. | [FDA, Clear Dental Aligners](https://www.fda.gov/medical-devices/dental-devices/clear-dental-aligners) |
| Bambini | Distinti primo controllo dei denti, consigliato dalla SIOI già a un anno, intervallo 18–24 mesi indicato nelle raccomandazioni ministeriali del 2017 e valutazione ortodontica entro i 7 anni, prima in presenza di problemi. | [SIOI](https://www.sioi.it/consigli-utili/), [Ministero della Salute, raccomandazioni 2017, p. 21](https://www.salute.gov.it/imgs/C_17_pubblicazioni_2637_allegato.pdf), [AAO](https://aaoinfo.org/whats-trending/is-there-a-benefit-to-early-treatment/) |
| Preventivo implantare e denti mancanti | Precisata la distinzione tra corpo implantare e fissaggio della protesi. Rimosse generalizzazioni su intervento, denti adiacenti, masticazione e numero di passaggi. | [FDA](https://www.fda.gov/medical-devices/dental-devices/dental-implants-what-you-should-know), [American Dental Association](https://www.mouthhealthy.org/all-topics-a-z/missing-teeth), [Ministero della Salute](https://www.salute.gov.it/imgs/C_17_pubblicazioni_2637_allegato.pdf) |
| Sanguinamento, igiene e pulizia profonda, recessione gengivale | Rimosse la regola semestrale per tutti, la previsione di risoluzione del sanguinamento in pochi giorni e le promesse di arresto della recessione. I 3–12 mesi indicati dall’EFP sono riferiti espressamente al mantenimento dopo terapia attiva della parodontite e al rischio individuale. La copertura chirurgica della radice può essere parziale. | [NIDCR](https://www.nidcr.nih.gov/health-info/gum-disease), [European Federation of Periodontology, linea guida S3](https://doi.org/10.1111/jcpe.13290), [EFP, mantenimento](https://www.efp.org/fileadmin/uploads/efp/Photos/Continuing_Education/GUIDELINE_STEP04_071022-2.pdf), [Cambridge University Hospitals](https://www.cuh.nhs.uk/patient-information/gum-grafting-procedure/) |
| Dolore e click della mandibola, bite | Distinti protezione dall’usura da bruxismo ed evidenza limitata per il dolore nei disturbi temporomandibolari. Tolta la previsione di stabilità pluriennale del click. Restano i segnali per consultare il dentista e l’indicazione di sospendere un dispositivo che provoca o aumenta il dolore. | [NIDCR, TMD](https://www.nidcr.nih.gov/health-info/tmd), [NIDCR, bruxismo](https://www.nidcr.nih.gov/health-info/bruxism) |
| Traumi dentali | Eliminato il riferimento a 2–3 ore che poteva indurre ad aspettare. Distinti dente permanente, dente da latte e caso dubbio. Precisati presa dalla corona, possibilità di reimpianto immediato solo in sicurezza, trasporto in un contenitore, assistenza odontoiatrica immediata e 112 per i segni di emergenza generale. | [Ministero della Salute](https://www.salute.gov.it/new/it/pubblicazione/linee-guida-nazionali-la-prevenzione-e-la-gestione-clinica-dei-traumi-dentali-negli/), [SDCEP](https://www.acutedentalproblems.sdcep.org.uk/guidance/management-of-oral-conditions/less-common-oral-conditions/injuries-to-the-mouth-face-and-jaws/), [Royal College of Surgeons of Edinburgh](https://www.rcsed.ac.uk/policy-guidelines/patient-safety-committee/world-patient-safety-day-2025/playing-it-safe-with-dental-trauma-in-children), [Regione Emilia-Romagna](https://salute.regione.emilia-romagna.it/assistenza-ospedaliera/emergenza) |
| Piano di cura e preventivo odontoiatrico | Presentata la sequenza delle cure come schema orientativo, rimossi gli effetti garantiti delle cure o dell’attesa. Sostituita la sintesi giornalistica sul preventivo con la norma in Gazzetta Ufficiale, p. 26 del PDF. | [Ministero della Salute, salute orale in età adulta](https://www.salute.gov.it/imgs/C_17_pubblicazioni_2441_allegato.pdf), [Gazzetta Ufficiale, legge 124/2017, art. 1, comma 150](https://www.gazzettaufficiale.it/eli/gu/2017/08/14/189/sg/pdf#page=26) |
| Faccette | Verificati entrambi i materiali con una fonte primaria per i pazienti. Precisate l’irreversibilità dello smalto rimosso e la possibilità limitata di ritoccare la ceramica. | [American Dental Association](https://www.mouthhealthy.org/all-topics-a-z/veneers) |
| Devitalizzazione | Distinti condizioni della polpa, restaurabilità del dente e tipo di frattura. Per gonfiore o dolore ricomparso si indirizza al dentista. Per gonfiore che rende difficile respirare o deglutire si indica il 112. | [AAE, dopo la cura](https://www.aae.org/patients/your-office-visit/post-treatment-care/), [AAE, fratture](https://www.aae.org/patients/dental-symptoms/cracked-teeth/), [NHS](https://www.nhs.uk/conditions/dental-abscess/), [Regione Emilia-Romagna](https://salute.regione.emilia-romagna.it/assistenza-ospedaliera/emergenza) |
| Russamento e apnee | Specificato che la guida riguarda gli adulti. Distinti russamento e apnee, diagnosi del medico e adattamento odontoiatrico. Chiariti il controllo oggettivo dell’efficacia e il ruolo della CPAP. Sostituita la presentazione giornalistica con le linee guida originali. | [Ministero della Salute, OSAS nell’adulto](https://www.salute.gov.it/new/sites/default/files/imported/C_17_pubblicazioni_2307_allegato.pdf), [AASM/AADSM](https://doi.org/10.5664/jcsm.4858) |

## Controllo editoriale e riferimenti normativi

- L’art. 1, comma 525, della legge 145/2018, nella formulazione dell’art. 6 del DL 69/2023 convertito dalla legge 103/2023, tutela la scelta consapevole e l’appropriatezza. Esclude il richiamo commerciale suggestivo, incluse offerte, sconti e promozioni capaci di indurre cure inappropriate. Il progetto applica anche la propria regola editoriale di esclusione di qualsiasi importo. [Gazzetta Ufficiale, testo coordinato, art. 6](https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.codiceRedazionale=23A04567&art.dataPubblicazioneGazzetta=2023-08-10&art.flagTipoArticolo=0&art.idArticolo=6&art.idGruppo=0&art.idSottoArticolo=1&art.idSottoArticolo1=10&art.progressivo=0&art.versione=1)
- L’art. 56 del Codice di deontologia richiede informazioni veritiere, pertinenti, corrette e comprensibili. I confronti pubblicitari di prestazioni devono poggiare su indicatori clinici scientificamente condivisi e misurabili. Vanno evitate attese ingiustificate. [FNOMCeO, art. 56](https://portale.fnomceo.it/wp-content/uploads/2023/08/Art.56_definitivo_acc.pdf)
- L’emendamento Marattin 13.013 al DDL C.3120 discusso nel comunicato del 13 novembre è una proposta. Il comunicato FNOMCeO/CAO sollecita un parere contrario. Non è una modifica normativa vigente. [Comunicato FNOMCeO/CAO del 13 novembre 2026](https://portale.fnomceo.it/pubblicita-sanitaria-fnomceo-e-cao-nazionale-le-scelte-di-cura-non-siano-condizionate-da-offerte-e-promozioni/)
- Per il preventivo, l’art. 9, c. 4, DL 1/2012, come modificato dall’art. 1, c. 150, legge 124/2017, prevede comunicazione preventiva del compenso in forma scritta o digitale con le voci di costo. [Gazzetta Ufficiale, n. 189 del 14 agosto 2017, note al comma 150](https://www.gazzettaufficiale.it/eli/gu/2017/08/14/189/sg/pdf)

Le 19 guide e l’indice sono stati controllati su testi visibili, hero, moduli, CTA, metadati e dati strutturati. Le 63 FAQ strutturate corrispondono alle domande e risposte visibili. Le pagine su costi e preventivi mantengono gli URL e spiegano le voci del percorso senza importi, fasce di prezzo, offerte o sconti. Le informazioni cliniche hanno fonti identificabili. Lo studio figura come editore.

## Verifiche prima della pubblicazione

Build di riferimento e build delle guide eseguite con Node 22. Tutti i 316 test superati. Confrontati i 67 documenti HTML generati prima dell’intervento: 53 differiscono soltanto per la nuova voce del menu e la conseguente posizione di FAQ, 14 sono identici. I 506 altri file preesistenti verificati sono identici. La sitemap conserva le 56 voci nello stesso ordine e aggiunge 20 URL.

Le prove Chromium su desktop e mobile hanno coperto menu, navigazione per categoria, ricerca, ripristino dei risultati, FAQ e passaggio di ogni modulo al questionario originale. Verificati trattamento, sede e motivo, compresa la scelta generica. Nessun modulo inviato alla segreteria.
