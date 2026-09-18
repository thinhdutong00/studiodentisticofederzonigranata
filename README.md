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

## Moduli ed email

I moduli usano la funzione Vercel `api/booking.js` e Resend per inviare a `info.federzonigranata@gmail.com`. Configurare `RESEND_API_KEY` e `RESEND_FROM_EMAIL` sul server e ridistribuire il sito prima di attivare l’invio. Istruzioni e verifica in [docs/invio-moduli.md](docs/invio-moduli.md).

`npm test` esegue i test del server senza inviare email reali. In sviluppo, `npm run dev` espone anche l’endpoint e carica le variabili da `.env`.
