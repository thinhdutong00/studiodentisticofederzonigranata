# Google Ads: contatto ortodonzia confermato

## Collegamento

- Account: Studio dentistico Federzoni Granata, `815-752-7644`.
- Campagna esistente: `Ortondonzia`, ID `21451873883`, da mantenere **in pausa** fino a un'esplicita richiesta di avvio.
- Landing dell'annuncio: `https://studiodentisticofederzonigranata.it/visita-ortodonzia/`.
- Azione manuale nuova: `mago system | Ortodonzia | Contatto confermato`, ID `7874176994`.
- Tag condiviso: `AW-988575526`; destinazione dedicata: `AW-988575526/gUQ-COLP2aodEKbusdcD`.
- Obiettivo personalizzato della sola campagna: `mago system | Ortodonzia | Modulo inviato`, contenente esclusivamente questa azione.
- L'azione è secondaria nell'account e utilizzata per le offerte tramite l'obiettivo personalizzato. Le altre campagne non la ereditano dagli obiettivi standard.
- Conteggio Una; finestra clic 30 giorni, visualizzazione engaged 3 giorni, view-through 1 giorno; attribuzione basata sui dati; nessun valore monetario.
- Conversioni avanzate disattivate per questa azione. Nessun dato compilato nei moduli viene inviato a Google.

## Evento dopo conferma

Il tracciamento richiede il consenso Google Ads e HTTPS sul dominio di produzione. Dopo un invio riuscito di `landing-consultation` oppure `orthodontic-quiz` da `/visita-ortodonzia/`, il codice accetta solo la risposta API con `ok: true` e lo stesso `requestId`. Il server conferma la richiesta dopo l'accettazione sia del servizio email sia del CRM.

La sessione conserva esclusivamente `{ requestId, createdAt }` nella chiave dedicata `fg-confirmed-orthodontic-lead-v1`. Entro 30 minuti, `/thank-you-page/` consuma il riferimento e invia un solo evento con la destinazione ortodontica e `transaction_id` uguale al riferimento casuale. Ricaricare la pagina non ripete l'evento. La chiave e l'etichetta della parodontologia restano distinte e compatibili con i riferimenti precedenti.

Nessun evento per apertura del modulo, questionario incompleto, chiamate, errore del server, accesso diretto alla thank-you page, servizio diverso, assenza/rifiuto del consenso o anteprime Vercel. La mancata misurazione non impedisce l'invio del modulo.

## Provenienza nel CRM

Suffisso URL finale impostato sulla sola campagna:

```text
utm_source=google&utm_medium=cpc&utm_campaign=mago_system_ortodonzia&campaignid={campaignid}&adgroupid={adgroupid}&creative={creative}&utm_term={keyword}
```

Il sito conserva i segnali di provenienza separatamente dall'evento Ads e li invia al CRM. Il codice del foglio operativo classifica ogni origine diversa da Google Ads come «Risultato organico»: questa etichetta comprende anche accessi diretti e provenienze non rilevate. Il test con parametri UTM verifica la classificazione nel CRM, non crea un vero clic pubblicitario.

## Collaudo

- Eseguire i test automatici e la build con Node 22. Verificare entrambe le modalità del modulo ortodontico, esclusione incrociata dei trattamenti, consenso, scadenza e deduplicazione.
- Dopo il deploy di produzione, usare Tag Assistant: prima del consenso/rifiutando non viene caricato il tag Google; accettando compare il tag condiviso.
- Inviare un modulo con dati interamente fittizi e nome `TEST TECNICO - NON RICONTATTARE`, usando un URL UTM della campagna. Non inserire recapiti personali o dati clinici reali e non fare clic su annunci a pagamento.
- Verificare conferma e redirect, un unico evento per `gUQ-COLP2aodEKbusdcD`, `transaction_id` valorizzato e `user_data` vuoto. Controllare nel foglio la provenienza Google Ads del record tecnico.
- Ricaricare la thank-you page e aprirla direttamente: nessuna nuova conversione.
- Il test tecnico non certifica l'attribuzione a un vero clic pubblicitario né il numero di persone uniche. Il conteggio Ads dipende anche dal consenso, dalle interazioni attribuibili e dai limiti del browser.

La campagna resta in pausa durante tutti i controlli. Questo intervento riguarda il tracciamento e non costituisce una certificazione della conformità privacy complessiva del sito.
