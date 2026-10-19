/**
 * Contenuti della landing /visita-parodontologia/.
 *
 * Le foto prima/dopo provengono dalla sezione «Chirurgia mucogengivale»
 * del sito originale, acquisito il 15 settembre 2026 (src/data/site.ts).
 * Non sono immagini di risultati della sola terapia non chirurgica.
 * I testi sanitari sono stati verificati sulle fonti primarie riportate in fondo.
 */

export const periodontalHero = {
  eyebrow: 'Parodontologia · Modena e Reggio Emilia',
  title: 'Prenditi cura delle gengive. Proteggi il futuro del tuo sorriso.',
  description:
    'Gengive che sanguinano, recessioni o denti che si muovono? Parti da una visita parodontale per capire le cause e conoscere il percorso più adatto a te, dalla terapia al mantenimento.',
  ctaLabel: 'Prenota una visita parodontale',
};

export const periodontalProcessSteps = [
  {
    title: 'Conosciamo la salute delle tue gengive',
    text: 'Ascoltiamo le tue esigenze e valutiamo gengive e sostegno dei denti con un esame clinico e il sondaggio parodontale.',
    icon: 'scan',
  },
  {
    title: 'Il tuo percorso prende forma',
    text: 'Definiamo la terapia indicata, ti guidiamo nell’igiene quotidiana e rivalutiamo la risposta prima di decidere eventuali ulteriori cure.',
    icon: 'route',
  },
  {
    title: 'Proteggiamo i progressi nel tempo',
    text: 'Con richiami personalizzati monitoriamo la stabilità raggiunta e ti aiutiamo a prenderti cura delle gengive ogni giorno.',
    icon: 'smile',
  },
] as const;

export const periodontalTopics = [
  {
    id: 'sanguinamento',
    label: 'Gengive che sanguinano',
    title: 'Ascolta i segnali delle tue gengive',
    kicker: 'Sanguinamento e infiammazione',
    paragraphs: [
      'Noti sangue quando lavi i denti o gengive gonfie? Sono segnali da approfondire, anche se non provi dolore. La visita serve a capire la causa e a distinguere una gengivite da una parodontite.',
      'Il percorso parte dal controllo della placca e da indicazioni pratiche per la tua igiene. Quando necessario, la terapia comprende anche la pulizia professionale sotto gengiva.',
    ],
    items: [
      'Sangue durante lo spazzolamento o la pulizia tra i denti',
      'Gengive gonfie, arrossate o sensibili',
      'Alito persistente o sapore sgradevole',
      'Infiammazione che si ripresenta',
    ],
    image: '/assets/optimized/parodontologia-controllo-gengive.webp',
    alt: 'Controllo delle gengive con strumenti odontoiatrici',
    ctaLabel: 'Prenota una visita',
  },
  {
    id: 'recessioni',
    label: 'Gengive ritirate',
    title: 'Prenditi cura delle radici esposte',
    kicker: 'Recessioni e sensibilità',
    paragraphs: [
      'Un dente ti sembra più lungo o senti fastidio con bevande fredde? Il ritiro della gengiva può esporre una parte della radice. Le cause possono essere diverse e non indicano sempre parodontite.',
      'Valutiamo la gengiva, le abitudini di spazzolamento e la situazione del dente. In base al caso, ti illustriamo come controllare la sensibilità e se un trattamento mucogengivale può essere indicato.',
    ],
    items: [
      'Radici più visibili o denti che appaiono più lunghi',
      'Sensibilità al freddo o durante la pulizia',
      'Gengiva sottile o difficile da pulire',
      'Cambiamenti del margine gengivale nel tempo',
    ],
    image: '/assets/optimized/parodontologia-landing-recessioni-1-prima.webp',
    alt: 'Recessioni gengivali documentate nello studio prima del trattamento',
    ctaLabel: 'Prenota una visita',
  },
  {
    id: 'supporto-denti',
    label: 'Stabilità dei denti',
    title: 'Diamo attenzione al sostegno dei tuoi denti',
    kicker: 'Parodontite e mantenimento',
    paragraphs: [
      'Un dente si muove o ha cambiato posizione? Una valutazione permette di capire quanto supporto conserva e quali possibilità di cura sono indicate. La mobilità non significa automaticamente doverlo estrarre.',
      'L’obiettivo è controllare l’infiammazione e preservare i denti quando possibile. Diagnosi, risposta alla terapia e collaborazione quotidiana guidano le decisioni e il programma di mantenimento.',
    ],
    items: [
      'Mobilità o spostamenti che hai notato nei denti',
      'Spazi comparsi o aumentati nel tempo',
      'Una precedente diagnosi di parodontite',
      'Necessità di riprendere controlli e mantenimento',
    ],
    image: '/assets/optimized/parodontologia-equipe-clinica.webp',
    alt: 'Équipe dello studio durante un trattamento odontoiatrico',
    ctaLabel: 'Prenota una visita',
  },
] as const;

// Le prime tre domande accompagnano la scelta della visita, la terapia e il mantenimento.
export const periodontalFaqs = [
  {
    question: 'Cosa succede durante la prima visita parodontale?',
    answer:
      'Ascoltiamo ciò che hai notato, raccogliamo la tua storia clinica ed esaminiamo gengive e sostegno dei denti. Il sondaggio parodontale e, quando indicate, le radiografie aiutano a definire il quadro. Ti spieghiamo poi le possibilità di cura e gli eventuali approfondimenti necessari.',
  },
  {
    question: 'Come si cura la parodontite?',
    answer:
      'Il percorso comprende igiene quotidiana guidata, controllo dei fattori di rischio e rimozione professionale di placca e tartaro, anche sotto gengiva. Dopo la prima fase rivalutiamo la risposta: solo se necessario possono essere proposte ulteriori terapie, comprese procedure chirurgiche.',
  },
  {
    question: 'Dopo la terapia servono ancora i controlli?',
    answer:
      'Sì. La parodontite può riattivarsi anche dopo una buona risposta al trattamento. Il mantenimento comprende controlli, igiene professionale e indicazioni per la cura a casa. La frequenza dei richiami viene personalizzata in base alla situazione e ai fattori di rischio.',
  },
  {
    question: 'Le gengive che sanguinano indicano sempre parodontite?',
    answer:
      'Non necessariamente. Il sanguinamento può dipendere da una gengivite o da altre condizioni, ma merita una valutazione se si ripete. Il solo aspetto delle gengive non basta per formulare una diagnosi: occorre esaminare anche i tessuti che sostengono i denti.',
  },
  {
    question: 'Un dente che si muove deve essere estratto?',
    answer:
      'Non sempre. Valutiamo il supporto residuo, la funzione, il controllo dell’infiammazione e la risposta alla terapia. Questi elementi aiutano a capire se il dente può essere mantenuto e quale percorso sia ragionevole per la tua situazione.',
  },
  {
    question: 'Le gengive ritirate possono essere trattate?',
    answer:
      'Le possibilità dipendono dalla causa, dalla quantità di tessuto disponibile e dalla situazione del dente. Possiamo correggere le abitudini che favoriscono il problema, gestire la sensibilità e, nei casi indicati, valutare una chirurgia mucogengivale. Non tutte le recessioni possono essere ricoperte allo stesso modo.',
  },
  {
    question: 'La terapia parodontale è dolorosa?',
    answer:
      'La sensibilità varia da persona a persona e dal tipo di trattamento. Quando necessario utilizziamo l’anestesia locale. Dopo la terapia possono comparire fastidi o sensibilità temporanei: ti spieghiamo cosa aspettarti e come gestire la fase successiva.',
  },
  {
    question: 'Quanto costa un percorso di cura delle gengive?',
    answer:
      'Il costo dipende dalla diagnosi, dalle aree da trattare e dalle prestazioni indicate. Dopo la valutazione e gli eventuali accertamenti riceverai un piano di cura con un preventivo personalizzato, così da conoscere le fasi previste e i relativi costi.',
  },
] as const;

export const periodontalProfessional = {
  name: 'Dott. Stefano Granata',
  role: 'Odontoiatra · Protesi, implantologia e chirurgia computer guidata',
  eyebrow: 'Il professionista al tuo fianco',
  title: 'La salute del tuo sorriso merita esperienza.',
  summary:
    'Un approccio che mette in relazione denti, gengive e funzione. Il Dott. Stefano Granata si occupa di protesi, implantologia e chirurgia computer guidata, con attività clinica, didattica e scientifica.',
  image: '/assets/optimized/parodontologia-landing-stefano-granata.webp',
  alt: 'Dottor Stefano Granata',
  biography: [
    'Odontoiatra con attività in protesi, implantologia e chirurgia computer guidata presso lo Studio Dentistico Federzoni Granata.',
    'Ha svolto attività di docenza a contratto presso le Università di Padova e di Modena e Reggio Emilia. L’attività didattica in ambito protesico è documentata anche dalle fonti degli atenei.',
    'Specialista in Protesi riconosciuto dall’EPA, European Prosthodontic Association. Socio attivo AIOP, Accademia Italiana di Odontoiatria Protesica, e IAO, Italian Academy of Osseointegration.',
    'DDS Certified Speaker, Digital Dental Society; socio attivo onorario DI&RA, Digital Implant and Restorative Academy; socio attivo CAI Academy, Computer Aided Implantology.',
    'Relatore in corsi e congressi nazionali e internazionali su protesi digitale, chirurgia computer guidata e chirurgia rigenerativa su impianti. Autore di pubblicazioni scientifiche.',
  ],
  ctaLabel: 'Prenota una visita con il dottore',
} as const;

export const periodontalClinicalCases = [
  {
    id: 'recessioni-1',
    title: 'Trattamento delle recessioni gengivali',
    before: '/assets/optimized/parodontologia-landing-recessioni-1-prima.webp',
    after: '/assets/optimized/parodontologia-landing-recessioni-1-dopo.webp',
    beforeAlt: 'Recessioni gengivali prima del trattamento mucogengivale',
    afterAlt: 'Situazione gengivale dopo il trattamento mucogengivale',
    sourceBefore: '/assets/original/2020/11/838.jpg',
    sourceAfter: '/assets/original/2020/11/837.jpg',
    sourceDescription: 'Chirurgia mucogengivale, caso 1: lembo bilaminare.',
    width: 600,
    height: 352,
  },
  {
    id: 'recessioni-2',
    title: 'Cura dei tessuti gengivali',
    before: '/assets/optimized/parodontologia-landing-recessioni-2-prima.webp',
    after: '/assets/optimized/parodontologia-landing-recessioni-2-dopo.webp',
    beforeAlt: 'Situazione gengivale prima del trattamento, vista frontale',
    afterAlt: 'Situazione gengivale dopo il trattamento, vista frontale',
    sourceBefore: '/assets/original/2020/11/846.jpg',
    sourceAfter: '/assets/original/2020/11/845.jpg',
    sourceDescription: 'Chirurgia mucogengivale, caso 3; tecnica non specificata nel sito originale.',
    width: 600,
    height: 300,
  },
  {
    id: 'recessioni-3',
    title: 'Trattamento delle recessioni localizzate',
    before: '/assets/optimized/parodontologia-landing-recessioni-3-prima.webp',
    after: '/assets/optimized/parodontologia-landing-recessioni-3-dopo.webp',
    beforeAlt: 'Recessione gengivale localizzata prima del trattamento',
    afterAlt: 'Situazione gengivale dopo il trattamento con lembo ruotato',
    sourceBefore: '/assets/original/2020/11/849.jpg',
    sourceAfter: '/assets/original/2020/11/848.jpg',
    sourceDescription: 'Chirurgia mucogengivale, caso 4: lembo ruotato.',
    width: 600,
    height: 352,
  },
] as const;

export const periodontalCasesNote =
  'Immagini di trattamenti mucogengivali eseguiti nello studio. Indicazioni e risultati variano in base alla situazione clinica.';

export const periodontalLandingAssets = {
  hero: {
    src: '/assets/optimized/parodontologia-equipe-clinica.webp',
    alt: 'Équipe dello Studio Federzoni Granata durante un trattamento odontoiatrico',
    width: 1080,
    height: 1350,
  },
  studio: {
    src: '/assets/original/2026/10/MatteoDomenicali_MG_6819.jpg',
    alt: 'Paziente nello Studio Federzoni Granata osserva il proprio sorriso allo specchio',
  },
  gumCheck: {
    src: '/assets/optimized/parodontologia-controllo-gengive.webp',
    alt: 'Controllo odontoiatrico delle gengive',
    width: 1200,
    height: 900,
  },
} as const;

/** Tracciabilità redazionale; non è necessario mostrarla nel flusso della landing. */
export const periodontalContentSources = [
  { title: 'EFP · Trattamento delle malattie gengivali', url: 'https://www.efp.org/for-patients/gum-diseases/gum-disease-treatment/' },
  { title: 'EFP · Segnali e sintomi', url: 'https://www.efp.org/for-patients/gum-diseases/check-your-symptoms/' },
  { title: 'EFP · Malattie gengivali', url: 'https://www.efp.org/for-patients/gum-diseases/gum-diseases-explained/' },
  { title: 'SIdP · Cura della parodontite', url: 'https://www.gengive.org/parodontite-cura/' },
  { title: 'SIdP · Recessioni gengivali', url: 'https://www.gengive.org/recessione-gengivale-cause-e-terapia/' },
  { title: 'SIdP · Sanguinamento delle gengive', url: 'https://www.gengive.org/sanguinamento-delle-gengive-quando-spazzolo-i-denti-sentinella-di-infiammazione/' },
  { title: 'SIdP/EFP · Linee guida cliniche', url: 'https://www.sidp.it/la-societa/linee-guida-sidp/' },
  { title: 'Studio · Casi originali e foto prima/dopo', url: 'https://studiodentisticofederzonigranata.it/parodontologia/' },
  { title: 'Studio · Biografia originale', url: 'https://studiodentisticofederzonigranata.it/chi-siamo/' },
  { title: 'Università di Padova · Pubblicazioni di Stefano Granata', url: 'https://research.unipd.it/cris/rp/rp203219' },
] as const;
