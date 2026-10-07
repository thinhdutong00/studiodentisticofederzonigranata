# Invio delle richieste del sito e CRM

Destinatario fisso di tutti i moduli: **info.federzonigranata@gmail.com**.
Archivio operativo: foglio privato **Federzoni Granata Thin leads**, scheda `Richieste dal sito`.

## Percorso

- Prima visita, urgenza e richiesta trattamento inviano tutte le risposte a `POST /api/booking`.
- I moduli contatti inviano nome, cognome, telefono, email e messaggio.
- Il componente compatto di richiamata invia nome e telefono, con consenso privacy.
- I moduli introduttivi dei trattamenti (incluso sbiancamento) aprono `/richiesta/` con trattamento, sede e motivo preselezionati; l’invio avviene dopo aver raccolto i recapiti. Anche un motivo iniziale che non coincide con le opzioni del questionario viene conservato nell’email.
- Il server controlla i dati e chiama in parallelo Resend e la web app Google Apps Script del CRM. La conferma appare solo se Resend restituisce un identificativo email e il CRM conferma la registrazione della stessa richiesta.
- In caso di errore o timeout il modulo conserva i valori e permette di riprovare. Lo stesso tentativo mantiene lo stesso `requestId`: Resend riutilizza la chiave di idempotenza e Apps Script non inserisce una seconda riga con lo stesso ID.
- Il foglio riceve solo dati già validati dal server. Le nuove richieste reali entrano con `Contattato = No`, `Esito = Da chiamare` e `Tipo record = REALE`; questi valori non possono essere impostati dal browser.
- Provenienza, campagna, gruppo annunci, annuncio, parola chiave e pagine di ingresso/invio vengono conservati in campi separati, senza salvare il valore dei click ID pubblicitari.

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

Le funzioni Vercel in `api/` sono distribuite insieme al sito Astro statico; il runtime è Node 22. L’endpoint usa timeout separati di 12 secondi per Resend e 8 secondi per il CRM, eseguiti in parallelo entro il limite di 20 secondi della funzione.

## Configurazione del CRM Google Sheets

1. Creare il foglio nell’account `info.federzonigranata@gmail.com` e condividere il file soltanto con gli utenti autorizzati. Non abilitare “chiunque abbia il link”.
2. Copiare `integrations/google-apps-script/booking-crm.gs` in un progetto Apps Script associato al foglio. Il manifest di riferimento è nella stessa cartella.
3. Nelle proprietà dello script impostare:
   - `SPREADSHEET_ID`: ID del foglio Google;
   - `WEBHOOK_SECRET`: segreto casuale uguale alla variabile Vercel.
   Lo script accetta anche i precedenti nomi `BOOKING_SPREADSHEET_ID` e `BOOKING_WEBHOOK_SECRET` per compatibilità.
4. Distribuire lo script come applicazione web, eseguita come account dello studio. Il server deve poter chiamare l’URL `/exec`; l’endpoint è protetto dal segreto nel corpo HTTPS.
5. Salvare l’URL della distribuzione in `GOOGLE_SHEETS_WEBHOOK_URL` e creare un nuovo deploy Vercel.

La scheda operativa deve chiamarsi `Richieste dal sito`; il log tecnico deve chiamarsi `_Log integrazione`. Entrambe devono mantenere le intestazioni nell’ordine previsto dallo script. Apps Script rifiuta lo schema se un’intestazione viene rinominata o spostata. La ricerca dell’`ID richiesta` avviene sotto lock per impedire duplicati concorrenti. Formati e convalide operative vengono copiati sulle nuove righe e i valori che iniziano come formule vengono salvati come testo.

La scheda operativa usa 29 colonne, raggruppate così:

- anagrafica e richiesta: data, nome e cognome, telefono, email, città/sede e servizio;
- attribuzione: provenienza lead, campagna, gruppo annunci, annuncio, parola chiave, pagina di ingresso e pagina di invio;
- gestione: preferenze, messaggio, esito, contattato, tentativi, data ultimo contatto, comunicazioni, richiamo, appuntamento, preventivo e trattamento;
- colonne tecniche: note, tipo record e ID richiesta.

## Collegamento con Google Ads e SEO

Il sito riconosce automaticamente un clic Google Ads dalla presenza di `gclid`, `gbraid` o `wbraid`. Per compilare anche campagna, gruppo annunci, annuncio e parola chiave, configurare nell'account Google Ads dello Studio il seguente suffisso URL finale:

```text
utm_source=google&utm_medium=cpc&campaignid={campaignid}&adgroupid={adgroupid}&creative={creative}&keyword={keyword}
```

I parametri ValueTrack vengono risolti da Google al momento del clic. Il foglio registra gli ID forniti da Google Ads e non il valore del click ID. Se una campagna usa già `utm_campaign`, quel valore viene mostrato insieme all'ID campagna quando sono diversi.

Per la SEO non serve modificare gli URL: un accesso proveniente da un risultato Google viene classificato `Google organico` tramite il referrer del browser. Quando il browser non comunica il referrer, il sistema usa `Non rilevata` invece di inventare l'origine.

## Verifica

1. `npm test` verifica destinazione, risposte dei cinque tipi di modulo, consenso, mapping CRM, schema Apps Script, errori parziali, deduplicazione, neutralizzazione delle formule, chiavi di idempotenza e limite ai tentativi. I provider sono simulati: questi test non inviano email reali e non scrivono nel foglio.
2. `npm run build` verifica la compilazione del sito.
3. Per lo sviluppo, copiare `.env.example` in `.env` e configurare le variabili. `npm run dev` serve anche l’endpoint locale; con credenziali reali il modulo invia email reali allo stesso destinatario.
4. Dopo il deploy configurato, inviare una richiesta chiaramente identificata come prova tecnica. Verificare l’evento `delivered` su Resend, la ricezione nella casella e una sola riga nel foglio. In Preview la riga deve avere `Tipo record = TEST`; in Production deve avere `Tipo record = REALE`. Ripetere lo stesso `requestId` e controllare che non venga creata una seconda riga.

## Protezioni e limiti

Il destinatario è definito solo sul server: il browser non può cambiarlo. Il server accetta solo POST JSON dalla stessa origine, controlla consenso, formato e lunghezze, usa un campo esca e limita i tentativi per indirizzo IP nella singola istanza. Il limite in memoria non è distribuito tra tutte le istanze Vercel; per bloccare campagne automatizzate impostare anche una regola di rate limiting nel firewall Vercel per `/api/booking`.

Nessun dato dei moduli viene salvato in localStorage o nei log del server. Le query URL dei moduli introduttivi contengono solo le opzioni selezionate di trattamento, motivo e sede, mai recapiti o testo libero. Email e CRM contengono i dati forniti, inclusi gli eventuali dettagli sanitari. Il foglio deve restare privato e accessibile solo al personale autorizzato. Non è prevista una cancellazione automatica: tempi di conservazione e revisione periodica restano sotto la responsabilità dello Studio. Le date restano preferenze da confermare con la segreteria.

La provenienza marketing viene conservata soltanto per la sessione in `sessionStorage`, senza recapiti o risposte del modulo. Sono memorizzati esclusivamente UTM, identificativi ValueTrack di campagna/gruppo/annuncio, parola chiave, tipo di click ID (non il valore), pagina di ingresso e referrer senza query string. La classificazione avviene sul server con regole conservative:

- `Google Ads` solo con `gclid`/`gbraid`/`wbraid` oppure Google con mezzo esplicitamente a pagamento;
- `Google Maps` solo con UTM Maps/Google Business Profile o referrer Maps identificabile;
- `Google organico` solo con mezzo organico esplicito o referrer Google identificabile;
- `Diretto` in assenza di parametri e referrer;
- `Altro` per sorgenti esterne identificabili;
- `Non rilevata` quando i segnali sono mancanti o ambigui.

Il nome campagna viene riportato soltanto da `utm_campaign`; l'ID campagna viene riportato da `campaignid`, `gad_campaignid` o `utm_id`. Nessun dato viene ricostruito o inventato dal click ID.

La formulazione dell’informativa privacy relativa ai fornitori tecnologici, ai dati sanitari e ai trasferimenti deve essere verificata dallo Studio prima della messa in produzione.

Riferimenti: [invio email Resend](https://resend.com/docs/api-reference/emails/send-email), [idempotenza Resend](https://resend.com/docs/dashboard/emails/idempotency-keys), [funzioni Node su Vercel](https://vercel.com/docs/functions/runtimes/node-js).

## Collaudo del 18 settembre 2026

- 32 test server superati e build Astro completata (54 pagine).
- Inventario HTML: 11 moduli contatti, 3 questionari e 14 moduli introduttivi dei trattamenti; nessun modulo senza percorso di invio.
- Playwright: completati prima visita, urgenza con opzione “Altro”, sbiancamento → richiesta con sede/motivo/data/orario, contatti da mobile e varianti compatta/completa del componente PillForm.
- Verificati consenso obbligatorio, conservazione dei dati dopo errore, risposta reale `503` in assenza di credenziali, risposta simulata `502`, recupero del pulsante, stessa chiave nei tentativi ripetuti e una sola chiamata in caso di doppio invio.
- Il successo nel browser è stato simulato dopo aver verificato la validazione sul server locale. Nessuna email reale inviata; consegna da collaudare dopo la configurazione.
- Al momento della verifica Vercel esponeva solo `MAINTENANCE_MODE`: mancavano entrambe le variabili Resend. Nessuna nuova versione distribuita; il tentativo di creare una preview è stato bloccato dalla revisione automatica in attesa di autorizzazione esplicita alla pubblicazione.
