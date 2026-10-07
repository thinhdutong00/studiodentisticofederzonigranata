# Studio Dentistico Federzoni Granata

Sito Astro 6 pronto per deploy statico su Vercel.

## Comandi

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Deploy

Vercel rileva automaticamente Astro dal `package.json`.

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Moduli, email e CRM

I moduli usano la funzione Vercel `api/booking.js`: ogni richiesta viene inviata tramite Resend a `info.federzonigranata@gmail.com` e registrata nel CRM Google Sheets tramite una web app Apps Script. La scheda operativa mostra `Google Ads` o `SEO`, l’annuncio/ID creativo per il traffico a pagamento e il link della pagina di ingresso per quello organico; i segnali tecnici e l’ID usato per la deduplicazione restano nel flusso interno e nel log nascosto. La conferma viene mostrata soltanto quando entrambi i servizi accettano l’operazione.

Configurare `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_WEBHOOK_SECRET` e `GOOGLE_SHEETS_RECORD_TYPE=REALE` in Production, quindi ridistribuire il sito prima di attivare l’invio. Istruzioni e verifica in [docs/invio-moduli.md](docs/invio-moduli.md).

`npm test` esegue i test del server senza inviare email reali. In sviluppo, `npm run dev` espone anche l’endpoint e carica le variabili da `.env`.
