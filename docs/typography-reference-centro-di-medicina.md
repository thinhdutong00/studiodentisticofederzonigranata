# Riferimento tipografico - Centro di medicina

Fonte rilevata: https://centrodimedicina.com/servizi/laboratorio-analisi/

Data rilievo: 25 giugno 2026.

Metodo: Playwright, valori computati dal browser su viewport desktop 1440x1000 e mobile 390x844.

## Regole generali

- Font principale: `Inter, sans-serif`.
- Font secondario osservato in elementi marginali: `Helvetica, Arial, sans-serif`.
- Pesi usati: `400`, `500`, `600`, `700`, `800`.
- Distanza fra le parole: `0px` su tutti gli elementi rilevati.
- Distanza fra le lettere desktop: quasi sempre `-0.2px`.
- Distanza fra le lettere mobile: quasi sempre `-0.16px`.
- Eccezioni: alcuni micro-comandi come hamburger e "Leggi di più" usano `letter-spacing: normal`.
- Titoli hero e alcuni titoli di sezione usano `text-transform: uppercase`.

## Scala Desktop

| Utilizzo | Esempio | Size | Weight | Line-height | Letter | Word | Transform |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Nav link | Cerca una prestazione | 16px | 500 | 16px | -0.2px | 0px | none |
| Menu label | Menu | 16px | 500 | 19.2px | normal | 0px | none |
| Hero title | LABORATORIO ANALISI | 129.6px | 400 | 116.64px | -0.2px | 0px | uppercase |
| Hero title inner | LABORATORIO ANALISI | 113.503px | 400 | 102.153px | -0.2px | 0px | uppercase |
| Hero description | Intro hero | 28px | 500 | 36.4px | -0.2px | 0px | none |
| Hero bar label | LABORATORIO ANALISI | 18px | 500 | 18px | -0.2px | 0px | uppercase |
| Primary CTA | RICHIEDI INFORMAZIONI | 16px | 500 | 16px | -0.2px | 0px | uppercase |
| Large body quote | Testo editoriale grande | 48px | 500 | 57.6px | -0.2px | 0px | none |
| Section title | Perché scegliere... | 24px | 500 | 30px | -0.2px | 0px | none |
| Feature number | 1. | 128px | 400 | 128px | -0.2px | 0px | none |
| Feature title | GAMMA COMPLETA DI ESAMI | 36px | 500 | 36px | -0.2px | 0px | uppercase |
| Small action | Leggi di più | 14px | 700 | 14px | normal | 0px | none |
| Carousel pre-title | CHECK UP BENESSERE | 60px | 400 | 60px | -0.2px | 0px | uppercase |
| Card title | Check-up Benessere Base | 32px | 500 | 41.6px | -0.2px | 0px | none |
| Card description | Testo card | 16px | 400 | 19.2px | -0.2px | 0px | none |
| Prefooter title | Newsletter / network | 28px | 500 | 36.4px | -0.2px | 0px | none |
| Footer heading | Seguici sui nostri social | 24px | 500 | 30px | -0.2px | 0px | none |
| Footer copy | Dati societari | 14px | 400 | 21px | -0.2px | 0px | none |

## Scala Mobile

| Utilizzo | Esempio | Size | Weight | Line-height | Letter | Word | Transform |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Menu label | Menu | 14px | 500 | 16.8px | normal | 0px | none |
| Hero title | LABORATORIO ANALISI | 35.1px | 400 | 35.1px | -0.16px | 0px | uppercase |
| Hero description | Intro hero | 20px | 500 | 25px | -0.16px | 0px | none |
| Primary CTA | RICHIEDI INFORMAZIONI | 16px | 500 | 16px | -0.16px | 0px | uppercase |
| Large body quote | Testo editoriale grande | 24px | 500 | 28.8px | -0.16px | 0px | none |
| Section title | Perché scegliere... | 20px | 500 | 25px | -0.16px | 0px | none |
| Feature number | 1. | 128px | 400 | 128px | -0.16px | 0px | none |
| Feature title | GAMMA COMPLETA DI ESAMI | 28px | 500 | 28px | -0.16px | 0px | uppercase |
| Small action | Leggi di più | 14px | 700 | 14px | normal | 0px | none |
| Carousel pre-title | CHECK UP BENESSERE | 30px | 400 | 30px | -0.16px | 0px | uppercase |
| Card title | Check-up Benessere Base | 20px | 500 | 25px | -0.16px | 0px | none |
| Card description | Testo card | 14px | 400 | 16.8px | -0.16px | 0px | none |
| Prefooter title | Newsletter / network | 28px | 500 | 36.4px | -0.16px | 0px | none |
| Footer heading | Seguici sui nostri social | 20px | 500 | 25px | -0.16px | 0px | none |
| Footer copy | Dati societari | 12px | 400 | 18px | -0.16px | 0px | none |

## Tokenizzazione consigliata

La scala e' memorizzata anche in `src/styles/typography-tokens.css`.

Per il nostro sito useremo questi valori come sistema chiuso:

- Hero title: grande, leggero, uppercase, line-height stretto.
- Hero description: peso medio, colore di accento, line-height 1.25-1.3.
- Titoli sezione: peso medio, tracking leggermente negativo.
- Testo editoriale importante: grande e autorevole, peso 500.
- Card: titolo 500, descrizione 400, line-height compatto.
- CTA: uppercase, 16px, peso 500, line-height pari alla dimensione.
