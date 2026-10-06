# Backup del sito originale — 15 settembre 2026

Fonte autorizzata dall'utente: https://studiodentisticofederzonigranata.it/

Il sito originale online è WordPress. Il progetto Astro in questa repository è una versione distinta in lavorazione.

## Dove trovare il materiale salvato

- ZIP: `output/backup-federzoni-granata-2026-09-15.zip`
- SHA-256 dello ZIP: `output/backup-federzoni-granata-2026-09-15.zip.sha256`
- Cartella estratta: `output/backup-federzoni-granata-2026-09-15/`
- Istruzioni: `LEGGIMI-RIPRISTINO.md` nella cartella estratta.
- Indice consultabile, con immagini: `INDICE-BACKUP.html`.
- Testi completi: `testi/`; indice strutturato: `inventario/pagine.json`.
- Immagini e documenti: `sito/wp-content/uploads/`; catalogo della libreria: `inventario/media-wordpress.json`.
- Provenienza e checksum originali: `inventario/risorse.json` e `inventario/risorse.csv`.
- Risposte pubbliche WordPress: `wordpress-pubblico/`.
- Risposte originali HTML/CSS/JS e sitemap: `originali/`.

La cartella `output/` è esclusa da Git. Lo ZIP va conservato anche fuori da questo computer: i riferimenti in questa memoria non costituiscono un secondo backup dei file.

## Copertura

- 16 pagine e 8 articoli WordPress pubblicati.
- 54 pagine HTML effettive, inclusi archivi per tag, autori, date e categorie.
- 355 elementi nel catalogo media: **354 file multimediali acquisiti su 354**, più un vecchio elemento oEmbed denominato “Quote Sample”.
- Originali, varianti delle immagini, loghi, font, CSS, JavaScript, anteprime YouTube e documenti raggiungibili dalle fonti pubbliche.

`quote-sample/` ha un ciclo di redirect HTTP 301 già presente nel sito. Due immagini tecniche del tema (`owl.video.play.png` e `background.png`) restituiscono HTML della homepage al posto di immagini; non sono pagine di contenuto e sono registrate come risposte anomale. I dettagli sono nell'inventario degli errori.

## Come riusare il backup

Per recuperare testi e immagini originali, consultare prima l'inventario e i file di questa acquisizione. Verificare la data se occorrono contenuti aggiornati dopo il 15 settembre 2026.

Per un ripristino statico, pubblicare il contenuto di `sito/` nella radice di un hosting web. Per l'anteprima locale usare `AVVIA-ANTEPRIMA.py`. La copia mantiene navigazione e gallerie; i moduli sono disattivati con contatti diretti in evidenza. Mappe, social e video YouTube restano servizi esterni. Gli originali sono conservati separatamente dagli adattamenti statici.

Per ripristinare WordPress con editor, plugin, configurazioni e moduli servono anche archivio dell'hosting e database SQL. Questi non sono ricavabili dal solo sito pubblico e non sono inclusi.

## Verifiche

Le 54 pagine sono state aperte nel browser con tutte le richieste esterne bloccate: nessuna immagine con sorgente risulta mancante e nessuna risposta HTTP locale è in errore. Il player YouTube emette un avviso di riproduzione automatica bloccata dal browser senza interazione. Le prove, le schermate e il controllo dei collegamenti sono nelle cartelle `verifica/` e `inventario/` del backup.

Gli script riproducibili sono `scripts/backup-live-site.mjs`, `scripts/verify-site-backup.mjs` e `scripts/package-site-backup.py`.
