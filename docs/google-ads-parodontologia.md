# Google Ads: contatto parodontologia confermato

## Collegamento

- Account Ads: Studio dentistico Federzoni Granata, `815-752-7644`.
- Tag: `AW-988575526`.
- Nuova azione manuale: `mago system | Parodontologia | Contatto confermato`, ID `7873980888`.
- Destinazione evento: `AW-988575526/I2pSCNjTzaodEKbusdcD`.
- Obiettivo personalizzato della sola campagna: `mago system | Parodontologia | Modulo inviato`.
- Una conversione per clic; finestra clickthrough 30 giorni; nessun valore monetario.
- Azione secondaria nell’account, inclusa nell’obiettivo personalizzato della campagna. Le campagne che usano gli obiettivi standard non devono ereditare la nuova azione.
- La precedente azione automatica di questa configurazione (ID `7873501595`), basata sulla sola URL `thank-you-page`, è stata rimossa. Non riattivarla insieme al metodo manuale.
- Il 26 ottobre 2026 la campagna è stata pubblicata e subito messa in pausa su richiesta dell’utente (ID `24405452578`). Non riattivarla durante il collaudo.

## Quando scatta

1. Consenso esplicito alla misurazione Google Ads nel nuovo banner (`fg-cookie-preference-v2`). Il precedente consenso non era specifico per la misurazione: non viene riutilizzato.
2. Invio del modulo `landing-consultation` oppure `periodontal-quiz` da `/visita-parodontologia/`.
3. `/api/booking` conferma sia email interna sia CRM e restituisce `ok: true` e lo stesso `requestId` del tentativo. Il tracciamento non cambia la logica di invio o quella del CRM.
4. Il browser conserva solo il riferimento casuale e l’orario in sessionStorage; la conferma apre `/thank-you-page/`.
5. Il tag Google, caricato dopo il consenso, invia l’evento `conversion` alla nuova etichetta. Il riferimento viene consumato prima dell’evento e passato come `transaction_id` per la deduplicazione di eventuali retry.

Nessuna conversione per clic sul pulsante, modulo incompleto, risposta API fallita/non confermata, chiamate, contatti di altri trattamenti, accesso diretto alla thank-you page o suo ricaricamento. Il riferimento scade dopo 30 minuti. Blocchi dello storage o del tag possono impedire la misurazione ma non impediscono l’invio del modulo.

Il tag è limitato ai due hostname di produzione e HTTPS: localhost e anteprime Vercel non inviano misurazioni all’account reale. Consenso base v2: tag bloccato prima dell’accettazione, personalizzazione annunci e analytics sempre negati. Nessun campo del modulo nel dataLayer, nessun dato di contatto per conversioni avanzate (`user_data` vuoto). Non abilitare raccolta automatica dei dati forniti dagli utenti per questa integrazione.

## Verifica prima dell’avvio

- `npm test`: server, CRM simulato, conferma del modulo, consenso, filtraggio del servizio e deduplicazione. Nessuna email reale nei test automatici.
- `npm run build`: entrambe le landing e la thank-you page compilano con il banner condiviso.
- Dopo il deploy: collegare Tag Assistant alla landing. Senza consenso e con rifiuto non deve esserci un tag caricato. Accettando deve comparire `AW-988575526` una volta.
- Aprire direttamente la thank-you page: nessun evento per la nuova etichetta.
- Inviare dal modulo parodontale un test chiaramente identificato come tecnico: controllare conferma email/CRM, redirect e un solo evento con etichetta `I2pSCNjTzaodEKbusdcD` e `transaction_id` valorizzato. Il test è un record operativo: non confonderlo con un paziente.
- Ricaricare la thank-you page: nessun secondo evento. Controllare che i parametri evento non contengano campi del modulo.
- Lo stato Ads e i report possono aggiornarsi successivamente; il test tecnico non dimostra da solo l’attribuzione a un clic pubblicitario reale. Non generare clic di prova sugli annunci.

Le conversioni Ads misurano richieste attribuite ai clic, non persone uniche verificate. Rifiuti del consenso, ad blocker e limiti di attribuzione possono causare differenze rispetto ai contatti effettivamente ricevuti nel CRM.

## Riferimenti tecnici

- [Google: consenso](https://developers.google.com/tag-platform/security/guides/consent)
- [Google: conversioni con il tag](https://support.google.com/google-ads/answer/7548399)
- [Google: deduplicazione](https://support.google.com/google-ads/answer/6386790)
- [Google: disabilitare raccolta dati forniti dall’utente](https://support.google.com/google-ads/answer/13262500)
