# Presenza organica e "Guide e consigli" — novembre 2026

Lavoro del 13/11/2026 sul ramo `seo-guide-e-consigli`. Fonte dei dati di ricerca: report `ricerca-query-google-federzoni-granata.md` (Search Console 16/09–10/11/2026, termini di ricerca Google Ads). Keyword Planner, completamento automatico e domande correlate non sono stati consultati: nessun volume di mercato è stato usato.

## Stato SEO delle pagine nuove

Etichette: creata → pubblicata → indicizzabile → in sitemap → richiesta di indicizzazione inviata → indicizzazione verificata.

| URL | Stato raggiunto |
| --- | --- |
| `/guide-e-consigli/` | Creata, indicizzabile, in sitemap. Non pubblicata in produzione. |
| `/guide-e-consigli/costo-allineatori-trasparenti/` | Come sopra |
| `/guide-e-consigli/prima-visita-ortodontica-bambini/` | Come sopra |
| `/guide-e-consigli/preventivo-impianto-dentale/` | Come sopra |
| `/guide-e-consigli/denti-mancanti-ponte-impianto-protesi/` | Come sopra |
| `/guide-e-consigli/gengive-che-sanguinano/` | Come sopra |
| `/guide-e-consigli/dolore-click-mandibola-bruxismo/` | Come sopra |
| `/guide-e-consigli/trauma-dentale-cosa-fare/` | Come sopra |

Nessuna richiesta di indicizzazione è stata inviata e nessuna indicizzazione è stata verificata.

## Correzioni al report dopo la lettura del codice

- **Le coppie di URL brevi e lunghe non sono doppioni.** `/ortodonzia/`, `/estetica/`, `/protesi/`, `/parodontologia/`, `/implantologia/`, `/conservativa/`, `/endodonzia/` sono le pagine dei casi clinici (`kind: clinical`). Le pagine lunghe sono i trattamenti (`kind: treatment`). Intenti diversi: nessun accorpamento o redirect.
- **Le pagine non indicizzate non hanno blocchi tecnici nel codice.** Canonical autoreferenziale, nessun `noindex`, `robots.txt` aperto, presenza in sitemap. La causa dello stato "Rilevata, ma attualmente non indicizzata" non è dimostrabile dal codice: il sito è recente e molte pagine avevano pochi collegamenti interni.
- **Invisalign® è citato dalle landing di ortodonzia del progetto**, non dalla pagina trattamento. Le guide parlano di "allineatori trasparenti" senza attribuire marchi.

## Problemi tecnici

Corretti:

- `/grazie/` e `/new-page/` (pagine storiche del sito precedente) erano indicizzabili e in sitemap: ora hanno `noindex, follow` e sono fuori dalla sitemap. Gli URL restano attivi.
- `/recensioni/` era indicizzabile e collegata dalla home ma assente dalla sitemap: aggiunta.
- `/informazioni/` mostrava "Pagina dedicata in preparazione": sostituito con un'introduzione e l'elenco completo delle pagine informative.
- Title e description generici o segnaposto su `/modena/`, `/reggio-emilia/`, `/urgenze/`, `/faq/`, `/casi-clinici/`, `/informazioni/`.
- Nessun dato strutturato sulle pagine sede: aggiunto `Dentist` con indirizzo, telefono e orari già presenti nel progetto.
- `/richiesta/` ignorava il parametro `sede` quando mancava `trattamento`: ora la sede viene conservata.

Da verificare, non modificati:

- `/richiesta/`, `/prenota-prima-visita/`, `/prenota-urgenza/` sono in sitemap. Sono pagine di richiesta: valutare se tenerle indicizzabili.
- Le pagine sede hanno come H1 il solo nome della città ("Modena", "Reggio Emilia"). Un H1 più descrittivo richiede una verifica grafica.
- Canonical selezionata da Google e stato per URL: da controllare con Controllo URL in Search Console dopo la pubblicazione.
- `/landing-ortodonzia/` riceve ancora impressioni ma non è più una route del sito: valutare un redirect verso `/visita-ortodonzia/` (non applicato).

## Trattamenti verificati

I 14 trattamenti dell'elenco hanno ciascuno una pagina attiva. Professionisti documentati nel progetto: Dott.ssa Chiara Federzoni (conservativa, endodonzia, ortodonzia, pedodonzia), Dott. Stefano Granata (protesi, implantologia, chirurgia computer guidata).

Non confermati, quindi non attribuiti allo studio: ortodonzia linguale, impianti zigomatici, convenzioni con fondi specifici o con il servizio pubblico, visite gratuite, prezzi e finanziamenti, disponibilità H24, festiva o nel fine settimana. Orari usati: lunedì–venerdì 10:00–19:00.

## Mappa: ricerche, intento e pagina

| Gruppo di ricerche | Bisogno | Evidenza | Pagina | Decisione |
| --- | --- | --- | --- | --- |
| dentista / studio dentistico + Modena | Scegliere uno studio in città | GSC: 15 query, 1.557 impr., 11 clic | `/modena/` | Ottimizzata: metadati, dati strutturati, collegamenti |
| dentista / studio dentistico + Reggio Emilia | Come sopra | GSC: 10 query, 978 impr., 11 clic | `/reggio-emilia/` | Ottimizzata come sopra |
| migliori dentisti + città | Prova di affidabilità | GSC: 95 + 42 impr. | Articolo sulla scelta dello studio, `/recensioni/` | Inseriti nell'indice e collegati dalle sedi |
| costo apparecchio invisibile | Capire la spesa | Ads storico: 169 clic su tre righe | `/guide-e-consigli/costo-allineatori-trasparenti/` | Guida nuova |
| ortodontista, ortodonzia invisibile + Reggio Emilia | Trovare lo specialista | GSC: 19 query, 708 impr., 0 clic | `/visita-ortodonzia/` e sottopagine | Nessuna pagina nuova: collegamenti dalle guide |
| ortodonzia bambini, apparecchio bambini a che età | Età e momento giusto | GSC: 73 + 6 impr. | `/guide-e-consigli/prima-visita-ortodontica-bambini/` | Guida nuova |
| dentista pediatrico + città | A chi portare il bambino | GSC: 49 + 42 impr., 0 clic | `/pedodonzia-odontoiatria-infantile/` | Collegata dalle guide |
| prezzo impianto dentale completo, listino prezzi impianti | Capire la spesa | Ads storico: 201 clic su cinque righe | `/guide-e-consigli/preventivo-impianto-dentale/` | Guida nuova |
| denti mancanti soluzione, sistemare denti | Confrontare le alternative | Ads storico: 56 + 86 clic | `/guide-e-consigli/denti-mancanti-ponte-impianto-protesi/` | Guida nuova |
| impianti dentali senza viti | Equivoco da chiarire | Ads storico: molti clic, poche conversioni | FAQ nelle due guide su impianti e denti mancanti | Nessuna pagina dedicata |
| protesi mobili invisibili, ganci invisibili, nylon | Alternative e limiti | GSC: pagina con 5.731 impr., 93 clic | Articolo esistente | Mantenuto, inserito nell'indice, collegato |
| gnatologo + città, bruxismo | Disturbo già definito | GSC: 119 impr., pos. 2,4 | `/guide-e-consigli/dolore-click-mandibola-bruxismo/` | Guida nuova |
| parodontite, gengive | Riconoscere il problema | Ads: 46 clic; GSC: 36 impr. | `/guide-e-consigli/gengive-che-sanguinano/` | Guida nuova |
| dentista aperto, urgenze, emergenza | Bisogno immediato | GSC: poche impressioni | `/urgenze/` + `/guide-e-consigli/trauma-dentale-cosa-fare/` | Metadati + guida nuova |
| dentista economico, prezzi bassi | Sostenibilità | GSC: 91 impr. | — | Sospesa: servono dati dello studio |
| convenzionato Unisalute, Metasalute, ASL | Copertura | GSC: 10 impr. | `/convenzioni/` | Non modificata: nessuna convenzione confermata |
| sbiancamento, faccette | Estetica | GSC: 112 impr. (pos. 31) | Pagine trattamento | Non intervenire: già coperte |
| anchilosato, tumore lingua | Informazione generale | GSC: molte impr., nessun servizio | Articoli esistenti | Mantenuti nell'indice |

## Bozze sospese

| Tema | Dati necessari dallo studio |
| --- | --- |
| Costo e contenuto della prima visita | Costo, cosa comprende, eventuali esami inclusi, modalità di pagamento |
| Convenzioni e fondi sanitari | Elenco dei fondi con convenzione diretta o indiretta, per sede |
| Faccette in composito o in ceramica | Conferma delle indicazioni cliniche adottate dallo studio; evidenza di ricerca oggi debole |
| Russamento e apnee: dispositivi | Percorso reale (invio dal medico del sonno, tipo di dispositivo) |
| Pagamenti e finanziamenti | Conferma di rateizzazioni o finanziamenti |

## Fonti cliniche usate nelle guide

- Ministero della Salute, *Raccomandazioni cliniche in odontostomatologia* (2017). Verificato nel testo: prima visita odontoiatrica verso i 18–24 mesi. Le sezioni su implantologia, protesi, gnatologia e ortognatodonzia sono state usate come riferimento generale, senza citare dati puntuali.
- Ministero della Salute, *Linee guida nazionali per la prevenzione e la gestione clinica dei traumi dentali negli individui in età evolutiva* (2018). Verificati: conservazione in latte, soluzione fisiologica o saliva; reimpianto sconsigliato per i denti da latte; 2–3 ore in ambiente liquido; sintomi che richiedono il Pronto Soccorso.
- American Association of Orthodontists: primo controllo ortodontico non oltre i 7 anni.
- National Institute of Dental and Craniofacial Research: disordini temporo-mandibolari, approccio conservativo e reversibile.
- SIdP: sanguinamento gengivale come primo segnale, diagnosi con sondaggio; linee guida EFP S3.

Nessuna guida dichiara un autore o un revisore clinico. **Prima della pubblicazione i testi vanno letti dai professionisti dello studio.**

## Verifiche dopo la pubblicazione

1. Inviare di nuovo la sitemap in Search Console.
2. Controllo URL sulle pagine prioritarie e richiesta di indicizzazione.
3. Verificare sul sito pubblicato il passaggio modulo breve → `/richiesta/` con sede e percorso preselezionati, senza inviare richieste.
4. Controllare resa mobile e menu su dispositivo reale.
