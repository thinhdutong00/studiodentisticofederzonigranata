# Brand Colors

Data aggiornamento: 25 giugno 2026.

Questa palette e' il riferimento cromatico ufficiale del sito Studio Dentistico Federzoni Granata. Usarla per nuove sezioni, revisioni visuali, CTA, stati UI e componenti.

| Token | Hex | Uso |
| --- | --- | --- |
| Primary dark | `#10283D` | Footer, hero scure, fondi istituzionali, testo su superfici chiare quando serve massima autorevolezza. |
| Brand blue | `#5E9ACC` | Accenti, link, dettagli grafici, icone e highlight non primari. |
| CTA blue | `#256D95` | Bottoni principali, call to action e azioni importanti. |
| CTA hover | `#1E5A7C` | Stato hover/focus/active dei bottoni principali. |
| Text dark | `#1D1D1D` | Testo principale. |
| Muted text | `#5F6F7C` | Testo secondario, descrizioni e metadati. |
| Background | `#F7FAFC` | Sfondo pagina e sezioni chiare. |
| Soft blue bg | `#EEF6FB` | Bande leggere, hover soft, superfici informative. |
| Surface white | `#FFFFFF` | Card, header, modali e superfici in primo piano. |
| Border | `#D9E7F2` | Bordi, separatori, contorni leggeri. |
| Success | `#2E7D5B` | Stati positivi o conferme. |
| Warning | `#B7791F` | Avvisi o stati di attenzione. |
| Error | `#C94A4A` | Errori, validazione negativa o stati critici. |

## Mapping CSS

Nel layout globale i token brand sono definiti in `src/components/BaseLayout.astro` con nomi semantici (`--brand-primary-dark`, `--brand-blue`, `--brand-cta`, ecc.) e con alias legacy (`--blue-dark`, `--blue`, `--signal`, ecc.) per mantenere compatibilita' con gli stili esistenti.
