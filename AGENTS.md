# Project Memory

## Nostro font

Quando l'utente dice "nostro font", "il nostro font" o chiede di usare la tipografia appresa, significa usare il riferimento tipografico rilevato dal sito Centro di medicina.

Fonte del rilievo: https://centrodimedicina.com/servizi/laboratorio-analisi/

File da consultare:

- `docs/typography-reference-centro-di-medicina.md`
- `src/styles/typography-tokens.css`

Regole principali:

- Font principale: `Inter, sans-serif`.
- Word spacing: `0px`.
- Letter spacing desktop: `-0.2px`, salvo micro-comandi con `normal`.
- Letter spacing mobile: `-0.16px`, salvo micro-comandi con `normal`.
- Hero title: grande, leggero, uppercase, line-height stretto.
- Hero description: peso `500`, line-height circa `1.25-1.3`.
- Titoli sezione/card: peso `500`.
- Testi descrittivi/card: peso `400`.
- CTA: `16px`, peso `500`, uppercase, line-height `16px`.

Usare questi valori come sistema tipografico preferito nelle nuove sezioni e nelle revisioni visuali del sito.

## Colori brand

Quando l'utente chiede di modificare o aggiungere sezioni, componenti, CTA o stati UI, usare questa palette come riferimento cromatico ufficiale del brand.

File da consultare:

- `docs/brand-colors.md`
- `src/components/BaseLayout.astro`

Palette principale:

- Primary dark: `#10283D`
- Brand blue: `#5E9ACC`
- CTA blue: `#256D95`
- CTA hover: `#1E5A7C`
- Text dark: `#1D1D1D`
- Muted text: `#5F6F7C`
- Background: `#F7FAFC`
- Soft blue bg: `#EEF6FB`
- Surface white: `#FFFFFF`
- Border: `#D9E7F2`
- Success: `#2E7D5B`
- Warning: `#B7791F`
- Error: `#C94A4A`

Regole principali:

- Usare `Primary dark` per footer, hero scure e fondi istituzionali.
- Usare `Brand blue` per accenti, link e dettagli visuali.
- Usare `CTA blue` per bottoni principali e `CTA hover` negli hover/focus.
- Usare `Text dark` e `Muted text` per la gerarchia tipografica.
- Usare `Background`, `Soft blue bg`, `Surface white` e `Border` per superfici, sezioni leggere e contorni.
- Usare `Success`, `Warning` ed `Error` solo per stati semantici o feedback.
