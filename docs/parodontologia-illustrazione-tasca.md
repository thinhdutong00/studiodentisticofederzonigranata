# Parodontologia: nove illustrazioni per tre percorsi

Aggiornamento del 26 ottobre 2026 per `/visita-parodontologia/`.

La nuova sezione «La salute delle gengive, dalla diagnosi alla cura» mantiene separate le tre situazioni e usa sempre la stessa sequenza:

1. Cosa osserviamo.
2. Analisi e cura.
3. Risultato finale.

I tre passaggi sono identificati da icone SVG coordinate, al posto dei numeri: occhio per l’osservazione, cartella clinica con croce per analisi e cura, sorriso con denti stilizzati e un piccolo punto luce per il risultato finale. Le icone sono decorative e accompagnate dall’etichetta testuale.

## Sistema grafico e provenienza

Tutte e nove le immagini sono state rigenerate con lo strumento **imagegen integrato**. Il disegno delle recessioni è stato usato come riferimento iniziale, poi rielaborato come master. Le altre immagini derivano dal nuovo master e dai relativi primi fotogrammi: stessa porzione frontale di quattro denti inferiori, stessa scala, corone avorio, gengive rosa corallo e sfondo azzurro. Contorni locali morbidi, nessuna bordatura scura sulle corone. Lo spaccato delle tasche è limitato al sito interessato.

Non sono fotografie di pazienti o risultati clinici documentati. Gli originali PNG sono conservati in `output/imagegen/parodontologia-percorsi/`. Le immagini precedenti sostituite sono archiviate in `output/imagegen/parodontologia-percorsi/precedenti/`. La directory `output/` è esclusa da Git.

I prompt completi di ogni immagine, i riferimenti e la correzione della posizione della sonda sono in [parodontologia-illustrazioni-percorsi-prompts.json](parodontologia-illustrazioni-percorsi-prompts.json).

## Asset finali

WebP qualità 86, tutti 1536 × 1024, circa 318 KB complessivi.

| Percorso | Passaggio | File in `public/assets/optimized/` | Byte |
| --- | --- | --- | ---: |
| Sanguinamento | Problema | `parodontologia-sanguinamento-problema.webp` | 37514 |
| Sanguinamento | Analisi e cura | `parodontologia-sanguinamento-cura.webp` | 45540 |
| Sanguinamento | Risultato finale | `parodontologia-sanguinamento-risultato.webp` | 29542 |
| Tasche | Problema | `parodontologia-tasche-problema.webp` | 36464 |
| Tasche | Analisi e cura | `parodontologia-tasche-cura.webp` | 46070 |
| Tasche | Risultato finale | `parodontologia-tasche-risultato.webp` | 35242 |
| Recessioni | Problema | `parodontologia-recessioni-problema.webp` | 28484 |
| Recessioni | Analisi e cura | `parodontologia-recessioni-cura.webp` | 31114 |
| Recessioni | Risultato finale | `parodontologia-recessioni-risultato.webp` | 27678 |

## Coerenza dei contenuti

- **Sanguinamento:** esempio di gengivite da placca. La visita distingue infiammazione superficiale e parodontite. Il secondo fotogramma rappresenta la pulizia; il testo spiega la valutazione che la precede. Il risultato illustrato è il controllo dell’infiammazione e del sanguinamento, non la rigenerazione del sostegno.
- **Tasche:** spaccato locale con depositi, sondaggio e possibile riduzione della profondità dopo la terapia. Il secondo fotogramma mostra la misurazione; il testo comprende anche la rimozione dei depositi. L’immagine finale conserva il livello osseo e non promette una ricrescita automatica.
- **Recessioni:** radice esposta, riposizionamento con suture e possibile copertura completa dopo guarigione. L’eliminazione della recessione è riferita ai casi favorevoli; altrove la copertura può essere parziale. Non tutte le recessioni richiedono chirurgia.

Le fisarmoniche sono indipendenti; quella del sanguinamento rimane aperta all’ingresso, mentre tasche e recessioni sono inizialmente chiuse. Il design mantiene i controlli delle pagine dei trattamenti, con tre colonne su desktop, passaggi orizzontali su tablet e sequenza verticale su mobile. Immagini e testi poggiano direttamente sul fondo azzurro della sezione, senza card bianche, bordi o imbottitura intorno ai singoli passaggi. Nessuna modifica alle immagini o ai passaggi dei quiz.

## Fonti cliniche

- [SIdP · Sanguinamento e distinzione tra gengivite e parodontite](https://www.gengive.org/sanguinamento-delle-gengive-quando-spazzolo-i-denti-sentinella-di-infiammazione/)
- [EFP · Valutazione, terapia e mantenimento](https://www.efp.org/for-patients/gum-diseases/gum-disease-treatment/)
- [SIdP · Tasche parodontali e riduzione della profondità](https://www.gengive.org/cosa-sono-le-tasche-parodontali/)
- [SIdP · Recessioni e ricopertura delle radici](https://www.gengive.org/le-gengive-ritirate-ricrescono/)
- [AAP · Chirurgia mucogengivale](https://www.perio.org/for-patients/periodontal-treatments-and-procedures/surgical-procedures/)
