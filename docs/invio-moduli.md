# Invio delle richieste del sito

Destinatario fisso di tutti i moduli: **info.federzonigranata@gmail.com**.

## Percorso

- Prima visita, urgenza e richiesta trattamento inviano tutte le risposte a `POST /api/booking`.
- I moduli contatti inviano nome, cognome, telefono, email e messaggio.
- Il componente compatto di richiamata invia nome e telefono, con consenso privacy.
- I moduli introduttivi dei trattamenti (incluso sbiancamento) aprono `/richiesta/` con trattamento, sede e motivo preselezionati; l’invio avviene dopo aver raccolto i recapiti. Anche un motivo iniziale che non coincide con le opzioni del questionario viene conservato nell’email.
- Il server controlla i dati e chiama Resend; la conferma appare solo se Resend restituisce un identificativo email. Questo conferma l’accettazione da parte del servizio, non la consegna in casella: la consegna si verifica dal log di Resend e dalla casella destinataria.
- Dopo l’accettazione di Resend, il server invia la stessa richiesta al Web App Apps Script associato al Foglio Google. Il foglio usa `requestId` per evitare duplicati e aggiunge soltanto nuove righe: un nuovo invio non sovrascrive mai gli aggiornamenti della segreteria.
- Un errore del foglio viene registrato nei log Vercel/Apps Script ma non trasforma in errore una richiesta email già accettata. In questo modo il collegamento al foglio non interrompe le email esistenti.
- In caso di errore o timeout il modulo conserva i valori e permette di riprovare. Lo stesso tentativo mantiene una chiave di idempotenza; Resend evita duplicati nelle 24 ore previste dal servizio.

## Configurazione necessaria su Vercel

Nel progetto `studiodentisticofederzonigranata`, impostare per Production (e Preview se serve un collaudo reale):

| Variabile server | Valore |
| --- | --- |
| `RESEND_API_KEY` | Chiave Resend con permesso di invio email, preferibilmente limitata al dominio dello studio |
| `RESEND_FROM_EMAIL` | Mittente su un dominio verificato in Resend, ad esempio `Studio Federzoni Granata <prenotazioni@DOMINIO-VERIFICATO>` |
| `GOOGLE_SHEETS_WEBHOOK_URL` | URL HTTPS del deployment Web App Apps Script associato al foglio |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Segreto lungo e casuale, uguale a `WEBHOOK_SECRET` nelle Proprietà script e mai esposto al browser |
| `GOOGLE_SHEETS_RECORD_TYPE` | `REALE` in Production; `TEST` solo in Preview durante il collaudo |

Il Gmail destinatario non è il mittente autenticato. Non usare `mailto:` nelle variabili. Non inserire chiavi nel codice o in variabili con prefisso `PUBLIC_`.

Verificare il dominio mittente in Resend tramite i record DNS indicati dal servizio. Dopo aver configurato le variabili, eseguire un nuovo deploy. Senza configurazione il server risponde `503` e non mostra una conferma falsa.

Le funzioni Vercel in `api/` sono distribuite insieme al sito Astro statico; il runtime è Node 22. L’endpoint usa un timeout di 12 secondi per Resend, entro il limite di 20 secondi della funzione.

## Verifica

1. `npm test` verifica destinazione, risposte dei cinque tipi di modulo, consenso, validazione, errori del servizio, chiavi di idempotenza e limite ai tentativi. Il provider è simulato: questi test non inviano email reali.
2. `npm run build` verifica la compilazione del sito.
3. Per lo sviluppo, copiare `.env.example` in `.env` e configurare le variabili. `npm run dev` serve anche l’endpoint locale; con credenziali reali il modulo invia email reali allo stesso destinatario.
4. Dopo il deploy configurato, inviare una richiesta chiaramente identificata come prova tecnica, verificare l’evento `delivered` su Resend e la ricezione nella casella (anche spam). Controllare che nome, telefono, risposte e sede siano presenti e che “Rispondi” usi l’email inserita nel modulo, se disponibile.

## Protezioni e limiti

Il destinatario è definito solo sul server: il browser non può cambiarlo. Il server accetta solo POST JSON dalla stessa origine, controlla consenso, formato e lunghezze, usa un campo esca e limita i tentativi per indirizzo IP nella singola istanza. Il limite in memoria non è distribuito tra tutte le istanze Vercel; per bloccare campagne automatizzate impostare anche una regola di rate limiting nel firewall Vercel per `/api/booking`.

Nessun dato dei moduli viene salvato in localStorage o nei log del server. Le query URL dei moduli introduttivi contengono solo le opzioni selezionate di trattamento, motivo e sede, mai recapiti o testo libero. L’email e il Foglio Google contengono i dati forniti, inclusi gli eventuali dettagli sanitari; il foglio è l’archivio operativo destinato alla segreteria. Le date restano preferenze da confermare con la segreteria.

La provenienza marketing viene conservata soltanto per la sessione in `sessionStorage`, senza recapiti o risposte del modulo. Sono memorizzati esclusivamente UTM, tipo di click ID (non il valore), pagina di ingresso e referrer senza query string. La classificazione avviene sul server con regole conservative:

- `Google Ads` solo con `gclid`/`gbraid`/`wbraid` oppure Google con mezzo esplicitamente a pagamento;
- `Google Maps` solo con UTM Maps/Google Business Profile o referrer Maps identificabile;
- `Google organico` solo con mezzo organico esplicito o referrer Google identificabile;
- `Diretto` in assenza di parametri e referrer;
- `Altro` per sorgenti esterne identificabili;
- `Non rilevata` quando i segnali sono mancanti o ambigui.

Il nome campagna viene riportato soltanto da `utm_campaign`; non viene ricostruito né inventato dal click ID.

Riferimenti: [invio email Resend](https://resend.com/docs/api-reference/emails/send-email), [idempotenza Resend](https://resend.com/docs/dashboard/emails/idempotency-keys), [funzioni Node su Vercel](https://vercel.com/docs/functions/runtimes/node-js).

## Collaudo del 18 settembre 2026

- 32 test server superati e build Astro completata (54 pagine).
- Inventario HTML: 11 moduli contatti, 3 questionari e 14 moduli introduttivi dei trattamenti; nessun modulo senza percorso di invio.
- Playwright: completati prima visita, urgenza con opzione “Altro”, sbiancamento → richiesta con sede/motivo/data/orario, contatti da mobile e varianti compatta/completa del componente PillForm.
- Verificati consenso obbligatorio, conservazione dei dati dopo errore, risposta reale `503` in assenza di credenziali, risposta simulata `502`, recupero del pulsante, stessa chiave nei tentativi ripetuti e una sola chiamata in caso di doppio invio.
- Il successo nel browser è stato simulato dopo aver verificato la validazione sul server locale. Nessuna email reale inviata; consegna da collaudare dopo la configurazione.
- Al momento della verifica Vercel esponeva solo `MAINTENANCE_MODE`: mancavano entrambe le variabili Resend. Nessuna nuova versione distribuita; il tentativo di creare una preview è stato bloccato dalla revisione automatica in attesa di autorizzazione esplicita alla pubblicazione.
