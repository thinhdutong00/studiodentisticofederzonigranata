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

## Modalità manutenzione

La pagina globale di manutenzione è controllata esclusivamente dalla variabile d'ambiente privata `MAINTENANCE_MODE`, valutata durante la build:

- `MAINTENANCE_MODE=true`: mostra la pagina “Sito in manutenzione” su tutte le rotte HTML, inclusa la pagina 404;
- variabile assente, `MAINTENANCE_MODE=false` o qualsiasi altro valore: mostra il sito completo.

Il confronto è intenzionalmente esatto e sensibile alle maiuscole: soltanto il valore testuale `true` attiva la manutenzione.

Per mantenere il sito completo in locale e nelle Vercel Preview, configurare `MAINTENANCE_MODE=true` nelle impostazioni del progetto Vercel soltanto per l'ambiente **Production**. La modifica della variabile richiede un nuovo deploy perché il sito è generato staticamente.

Verifica locale facoltativa della pagina di manutenzione:

```sh
MAINTENANCE_MODE=true npm run build
npm run preview
```
