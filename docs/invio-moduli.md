# Invio delle richieste del sito e CRM

Destinatario fisso delle notifiche interne di tutti i moduli: **info.federzonigranata@gmail.com**.
Archivio operativo: foglio privato **Federzoni Granata Thin leads**, scheda `Richieste dal sito`.

## Percorso

- Prima visita, urgenza e richiesta trattamento inviano tutte le risposte a `POST /api/booking`.
- I moduli contatti inviano nome, cognome, telefono, email e messaggio.
- Il componente compatto di richiamata invia nome e telefono, con consenso privacy.
- La landing `/visita-ortodonzia/` include un quiz con 9 domande e una schermata informativa. Nome e cognome vengono raccolti in un unico campo. Invia età, allineamento, morso, sede, tempi desiderati, aspettative e recapiti con il tipo `orthodontic-quiz`; l’obiettivo selezionato nella sezione introduttiva viene conservato. Il server valida le opzioni, identifica il servizio come `Ortodonzia e allineatori` e include tutte le risposte in `Comunicazioni` nel CRM esistente. I recapiti di un paziente minorenne sono quelli del genitore o del tutore. Il quiz è informativo e non determina l’idoneità clinica.
- I moduli introduttivi dei trattamenti (incluso sbiancamento) aprono `/richiesta/` con trattamento, sede e motivo preselezionati; l’invio avviene dopo aver raccolto i recapiti. Anche un motivo iniziale che non coincide con le opzioni del questionario viene conservato nell’email.
- Le landing `/visita-ortodonzia/ortodonzia-adulti/`, `/visita-ortodonzia/ortodonzia-bambini-adolescenti/`, `/visita-ortodonzia/allineatori-trasparenti/` e `/visita-ortodonzia/apparecchio-fisso/` riutilizzano lo stesso quiz ortodontico. La macro area viene inclusa nel messaggio, quindi compare sia nell’email sia in `Comunicazioni` nel CRM; la pagina del modulo resta nel campo `source`. La provenienza della sessione viene acquisita prima della navigazione tra le card e le landing dedicate.
- Il server controlla i dati e chiama in parallelo Resend e la web app Google Apps Script del CRM. La conferma appare solo se Resend restituisce un identificativo email e il CRM conferma la registrazione della stessa richiesta.
- Dopo entrambe le conferme, il server invia anche una ricevuta all'indirizzo email indicato dal paziente, con lo stesso mittente verificato e le risposte indirizzate alla segreteria. La ricevuta conferma soltanto la ricezione della richiesta: non conferma un appuntamento e non contiene risposte cliniche, dettagli sanitari, testo libero o dati di provenienza pubblicitaria. I moduli di richiamata che non raccolgono l'email non inviano questa ricevuta.
- In caso di errore o timeout il modulo conserva i valori e permette di riprovare. Lo stesso tentativo mantiene lo stesso `requestId`: Resend riutilizza la chiave di idempotenza e Apps Script non inserisce una seconda riga con lo stesso ID.
- Il foglio riceve solo dati già validati dal server. Le nuove richieste entrano con `Contattato = No` e `Accettato = No`; questi valori non possono essere impostati dal browser.
- La scheda visibile conserva soltanto i campi operativi richiesti. Una tredicesima colonna tecnica nascosta conserva l’ID univoco nella stessa scrittura del lead, così un errore del log non può creare duplicati. Il valore dei click ID pubblicitari non viene salvato.

## Configurazione necessaria su Vercel

Nel progetto `studiodentisticofederzonigranata`, impostare per Production (e Preview se serve un collaudo reale):

| Variabile server | Valore |
| --- | --- |
| `RESEND_API_KEY` | Chiave Resend con permesso di invio email, preferibilmente limitata al dominio dello studio |
| `RESEND_FROM_EMAIL` | Mittente su un dominio verificato in Resend, ad esempio `Studio Federzoni Granata <prenotazioni@DOMINIO-VERIFICATO>` |
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL `/exec` della distribuzione web di Apps Script |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Segreto casuale di almeno 32 caratteri, uguale a `WEBHOOK_SECRET` nelle proprietà dello script |
| `GOOGLE_SHEETS_RECORD_TYPE` | `REALE` in Production; `TEST` soltanto nelle Preview isolate |

Il Gmail destinatario non è il mittente autenticato. Non usare `mailto:` nelle variabili. Non inserire chiavi nel codice o in variabili con prefisso `PUBLIC_`.

Verificare il dominio mittente in Resend tramite i record DNS indicati dal servizio. Dopo aver configurato le variabili, eseguire un nuovo deploy. Senza configurazione il server risponde `503` e non mostra una conferma falsa.

Le funzioni Vercel in `api/` sono distribuite insieme al sito Astro statico; il runtime è Node 22. L’endpoint usa timeout separati di 12 secondi per l'email interna e 45 secondi per il CRM, eseguiti in parallelo. Dopo il loro successo attende l'invio della ricevuta al paziente per un massimo di altri 8 secondi, restando entro il limite di 60 secondi della funzione. Il browser attende fino a 65 secondi, così può ricevere anche l’esito di una funzione arrivata vicino al proprio limite. Il margine del CRM copre anche l’avvio a freddo e il redirect della web app Apps Script.

La ricevuta al paziente usa una chiave di idempotenza distinta dalla notifica interna, derivata dal contenuto che include l'ID richiesta: i tentativi identici non generano una nuova email nella finestra di 24 ore di Resend. Un errore della sola ricevuta non annulla una richiesta già registrata e non mostra un falso errore di invio al paziente; viene registrato un messaggio tecnico senza recapiti o contenuto dell'email. Non è presente una coda per riprogrammare automaticamente le ricevute fallite: un nuovo tentativo della stessa richiesta riprova anche la ricevuta, mantenendo l'idempotenza. L'accettazione da parte di Resend non certifica l'arrivo in posta in entrata.

## Configurazione del CRM Google Sheets

1. Creare il foglio nell’account `info.federzonigranata@gmail.com` e condividere il file soltanto con gli utenti autorizzati. Non abilitare “chiunque abbia il link”.
2. Copiare `integrations/google-apps-script/booking-crm.gs` in un progetto Apps Script associato al foglio. Il manifest di riferimento è nella stessa cartella.
3. Nelle proprietà dello script impostare:
   - `SPREADSHEET_ID`: ID del foglio Google;
   - `WEBHOOK_SECRET`: segreto casuale uguale alla variabile Vercel.
   Lo script accetta anche i precedenti nomi `BOOKING_SPREADSHEET_ID` e `BOOKING_WEBHOOK_SECRET` per compatibilità.
4. Distribuire lo script come applicazione web, eseguita come account dello studio. Il server deve poter chiamare l’URL `/exec`; l’endpoint è protetto dal segreto nel corpo HTTPS.
5. Salvare l’URL della distribuzione in `GOOGLE_SHEETS_WEBHOOK_URL` e creare un nuovo deploy Vercel.

La scheda operativa deve chiamarsi `Richieste dal sito`; il log tecnico nascosto deve chiamarsi `_Log integrazione`. Entrambe devono mantenere le intestazioni nell’ordine previsto dallo script. Apps Script rifiuta lo schema se un’intestazione viene rinominata o spostata. La ricerca dell’`ID richiesta` avviene nella colonna tecnica nascosta della stessa riga, sotto lock, per impedire duplicati concorrenti anche quando il log non è scrivibile. Formati e convalide operative vengono copiati sulle nuove righe e i valori che iniziano come formule vengono salvati come testo.

La scheda operativa mostra esattamente 12 colonne, nell’ordine:

`Data`, `Nome e cognome`, `Telefono`, `Email`, `Città`, `Provenienza`, `Annuncio`, `Contattato`, `Data e ora di contatto`, `Comunicazioni`, `Preventivo`, `Accettato`.

Lo script crea e mantiene nascosta la colonna tecnica M, `ID richiesta`. Non va rinominata, spostata o mostrata al personale: serve esclusivamente per l’idempotenza del webhook.

`Provenienza` usa temporaneamente una classificazione binaria: mostra `Google Ads` quando è presente un segnale pubblicitario riconosciuto e `Risultato organico` in tutti gli altri casi. Di conseguenza, fino all'installazione del tracking Google Ads, `Risultato organico` comprende anche accessi diretti, referral e provenienze non rilevate. `Annuncio` mostra il nome passato con un parametro dedicato oppure l’ID creativo Google Ads; per gli altri lead mostra il link completo della pagina di ingresso. Servizio, preferenze e messaggio del modulo confluiscono in `Comunicazioni`.

## Collegamento con Google Ads e SEO

Il sito riconosce automaticamente un clic Google Ads dalla presenza di `gclid`, `gbraid` o `wbraid`. Per compilare anche campagna, gruppo annunci, annuncio e parola chiave, configurare nell'account Google Ads dello Studio il seguente suffisso URL finale:

```text
utm_source=google&utm_medium=cpc&campaignid={campaignid}&adgroupid={adgroupid}&creative={creative}&keyword={keyword}
```

I parametri ValueTrack vengono risolti da Google al momento del clic. Google espone automaticamente l’ID del creativo, non il nome editoriale dell’annuncio: in assenza di un nome passato esplicitamente il foglio mostra `Google Ads · ID …`. Il valore del click ID non viene salvato.

Per la SEO non serve modificare gli URL: un accesso proveniente da un risultato Google viene riconosciuto tramite il referrer del browser e il foglio riporta la pagina di ingresso. Per la classificazione binaria temporanea, anche le provenienze diverse da Google Ads vengono mostrate come `Risultato organico`.

## Verifica

1. `npm test` verifica destinazione, risposte dei tipi di modulo, consenso, mapping CRM, schema Apps Script, errori parziali, deduplicazione, neutralizzazione delle formule, chiavi di idempotenza e limite ai tentativi. Verifica anche l'ordine di invio della ricevuta al paziente, l'assenza di dati clinici nel suo testo, il mancato invio senza email o senza conferma dei provider principali e gli errori non bloccanti della sola ricevuta. I provider sono simulati: questi test non inviano email reali e non scrivono nel foglio.
2. `npm run build` verifica la compilazione del sito.
3. Per lo sviluppo, copiare `.env.example` in `.env` e configurare le variabili. `npm run dev` serve anche l’endpoint locale; con credenziali reali il modulo invia email reali allo stesso destinatario.
4. Dopo il deploy configurato, inviare una richiesta chiaramente identificata come prova tecnica. Verificare l’evento `delivered` su Resend, la ricezione nella casella e una sola riga nel foglio. In Preview `Comunicazioni` deve iniziare con `TEST – non contattare`; in Production questa dicitura non deve comparire. Ripetere lo stesso `requestId` e controllare nel log tecnico nascosto che non venga creata una seconda riga.

## Protezioni e limiti

Il destinatario della notifica interna è definito solo sul server: il browser non può cambiarlo. La ricevuta al paziente usa soltanto l'unico indirizzo email validato nel modulo; intestazioni, oggetto e testo operativo sono definiti dal server. Il server accetta solo POST JSON dalla stessa origine, controlla consenso, formato e lunghezze, usa un campo esca e limita i tentativi per indirizzo IP nella singola istanza. Il limite in memoria non è distribuito tra tutte le istanze Vercel; per bloccare campagne automatizzate impostare anche una regola di rate limiting nel firewall Vercel per `/api/booking`.

Nessun dato dei moduli viene salvato in localStorage o nei log del server. Le query URL dei moduli introduttivi contengono solo le opzioni selezionate di trattamento, motivo e sede, mai recapiti o testo libero. Email e CRM contengono i dati forniti, inclusi gli eventuali dettagli sanitari. Il foglio deve restare privato e accessibile solo al personale autorizzato. Non è prevista una cancellazione automatica: tempi di conservazione e revisione periodica restano sotto la responsabilità dello Studio. Le date restano preferenze da confermare con la segreteria.

La provenienza marketing viene conservata soltanto per la sessione in `sessionStorage`, senza recapiti o risposte del modulo. Sono memorizzati esclusivamente UTM, identificativi ValueTrack di campagna/gruppo/annuncio, parola chiave, tipo di click ID (non il valore), pagina di ingresso e referrer senza query string. La classificazione avviene sul server con regole conservative:

- `Google Ads` solo con `gclid`/`gbraid`/`wbraid` oppure Google con mezzo esplicitamente a pagamento;
- `Google Maps` solo con UTM Maps/Google Business Profile o referrer Maps identificabile;
- `Google organico` solo con mezzo organico esplicito o referrer Google identificabile;
- `Diretto` in assenza di parametri e referrer;
- `Altro` per sorgenti esterne identificabili;
- `Non rilevata` quando i segnali sono mancanti o ambigui.

La scheda operativa comprime temporaneamente queste categorie in due valori: `Google Ads` resta invariato; ogni altra classificazione viene mostrata come `Risultato organico`.

Il nome campagna viene riportato soltanto da `utm_campaign`; l'ID campagna viene riportato da `campaignid`, `gad_campaignid` o `utm_id`. Nessun dato viene ricostruito o inventato dal click ID.

La formulazione dell’informativa privacy relativa ai fornitori tecnologici, ai dati sanitari e ai trasferimenti deve essere verificata dallo Studio prima della messa in produzione.

Riferimenti: [invio email Resend](https://resend.com/docs/api-reference/emails/send-email), [idempotenza Resend](https://resend.com/docs/dashboard/emails/idempotency-keys), [funzioni Node su Vercel](https://vercel.com/docs/functions/runtimes/node-js).

## Prenotazione multistep delle landing ortodonzia e parodontologia

Le landing `/visita-ortodonzia/` e `/visita-parodontologia/` usano `LandingBookingCta` in apertura e chiusura e una sola istanza di `LandingBookingDialog`. Anche le CTA di prenotazione nell’header, nelle sezioni e nella barra fissa aprono lo stesso modulo. I quiz e la landing `/visita-trattamento-ortondonzia/` mantengono i loro percorsi.

Il nuovo tipo API `landing-consultation` raccoglie sei passaggi: motivo della visita, fascia di età del paziente, studio, giorni della settimana preferiti (anche multipli), fascia oraria e recapiti con riepilogo modificabile. L’email è facoltativa; nome, telefono e consenso privacy sono obbligatori. Per i minorenni vengono richiesti i recapiti del genitore o del tutore. Giorni e orari sono preferenze da confermare con la segreteria.

Il server valida le scelte con la configurazione condivisa `src/data/landingBooking.js` e determina il servizio dalla pagina di provenienza. `availability` alimenta `Giorni preferiti`, `preferredTimes` alimenta `Orari preferiti`; motivo, fascia di età e note confluiscono in `Comunicazioni`. Restano attivi attribuzione automatica, controllo dei provider, idempotenza e reindirizzamento a `/thank-you-page/` solo dopo conferma dell’invio. Le risposte restano solo nella memoria della pagina e si conservano chiudendo e riaprendo il modulo.

`tests/landing-booking.test.mjs` verifica entrambe le landing con provider simulati, inclusi risposte valide, rifiuto delle opzioni non ammesse, mapping CRM, email facoltativa e assenza di conferma se un provider fallisce.

## Collaudo del 18 settembre 2026

- 32 test server superati e build Astro completata (54 pagine).
- Inventario HTML: 11 moduli contatti, 3 questionari e 14 moduli introduttivi dei trattamenti; nessun modulo senza percorso di invio.
- Playwright: completati prima visita, urgenza con opzione “Altro”, sbiancamento → richiesta con sede/motivo/data/orario, contatti da mobile e varianti compatta/completa del componente PillForm.
- Verificati consenso obbligatorio, conservazione dei dati dopo errore, risposta reale `503` in assenza di credenziali, risposta simulata `502`, recupero del pulsante, stessa chiave nei tentativi ripetuti e una sola chiamata in caso di doppio invio.
- Il successo nel browser è stato simulato dopo aver verificato la validazione sul server locale. Nessuna email reale inviata; consegna da collaudare dopo la configurazione.
- Al momento della verifica Vercel esponeva solo `MAINTENANCE_MODE`: mancavano entrambe le variabili Resend. Nessuna nuova versione distribuita; il tentativo di creare una preview è stato bloccato dalla revisione automatica in attesa di autorizzazione esplicita alla pubblicazione.
