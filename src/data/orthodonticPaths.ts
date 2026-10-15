export interface OrthodonticPath {
  slug: string;
  href: string;
  name: string;
  group: 'age' | 'solution';
  summary: string;
  linkLabel: string;
  image: string;
  imageSet: string;
  imageAlt: string;
  cardImage?: string;
  cardImageSet?: string;
  cardImageAlt?: string;
  productImage?: boolean;
  seoTitle: string;
  description: string;
  heroTitle: string;
  lead: string;
  ctaLabel: string;
  assessmentTitle: string;
  assessmentIntro: string;
  considerations: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  source: { title: string; href: string };
}

export const orthodonticPaths: OrthodonticPath[] = [
  {
    slug: 'ortodonzia-adulti', href: '/visita-ortodonzia/ortodonzia-adulti/', name: 'Ortodonzia adulti', group: 'age',
    summary: 'Allineamento, estetica e funzionalità del sorriso.', linkLabel: 'Scopri il percorso',
    image: '/assets/optimized/ortodonzia-visita-1440.webp',
    imageSet: '/assets/optimized/ortodonzia-visita-720.webp 720w, /assets/optimized/ortodonzia-visita-1440.webp 1440w',
    imageAlt: 'Valutazione del sorriso di un paziente adulto',
    cardImage: '/assets/optimized/ortodonzia-sorriso-specchio-1440.webp',
    cardImageSet: '/assets/optimized/ortodonzia-sorriso-specchio-720.webp 720w, /assets/optimized/ortodonzia-sorriso-specchio-1440.webp 1440w',
    cardImageAlt: 'Paziente che osserva il proprio sorriso allo specchio durante una visita in studio',
    seoTitle: 'Ortodonzia adulti a Modena e Reggio Emilia',
    description: 'Valutazione ortodontica per adulti a Modena e Reggio Emilia. Allineamento, morso e salute della bocca in un percorso personalizzato.',
    heroTitle: 'Ortodonzia adulti. Un percorso per il tuo sorriso.',
    lead: 'Denti affollati, spazi o un precedente trattamento da rivalutare: partiamo dalla tua situazione e dalle tue esigenze per capire quali possibilità sono indicate.',
    ctaLabel: 'Richiedi una visita ortodontica',
    assessmentTitle: 'Le tue esigenze, il punto di partenza.',
    assessmentIntro: 'La valutazione considera il sorriso nel suo insieme. Allineamento, morso e salute di denti e gengive orientano il piano da condividere con te.',
    considerations: [
      { title: 'Allineamento e morso', text: 'Valutiamo la posizione dei denti e il rapporto tra le arcate, insieme ai cambiamenti che vorresti approfondire.' },
      { title: 'Salute della bocca', text: 'Le condizioni di denti e gengive vengono considerate prima di scegliere un dispositivo.' },
      { title: 'Impegno quotidiano', text: 'Confrontiamo le alternative con le tue abitudini, i controlli necessari e le indicazioni da seguire.' },
    ],
    steps: [
      { title: 'Conosciamo la tua situazione', text: 'Raccogliamo le tue esigenze e valutiamo anche eventuali trattamenti ortodontici precedenti.' },
      { title: 'Confrontiamo le possibilità', text: 'Dopo lo studio del caso, condividiamo le soluzioni indicate e ciò che richiederebbero nella tua quotidianità.' },
      { title: 'Definiamo il percorso', text: 'Obiettivi, tempi indicativi, costi, controlli e mantenimento vengono discussi prima di iniziare.' },
    ],
    faqs: [
      { question: 'Si può iniziare un trattamento da adulti?', answer: 'Sì, l’ortodonzia può essere valutata anche in età adulta. La visita serve a comprendere le condizioni della bocca e le possibilità del singolo caso.' },
      { question: 'Posso scegliere tra allineatori e apparecchio fisso?', answer: 'Puoi esprimere la tua preferenza. La scelta viene poi confrontata con i movimenti necessari, la salute della bocca e l’impegno richiesto.' },
      { question: 'La prima visita definisce già tutti i dettagli?', answer: 'È il punto di partenza. Possono essere necessari ulteriori accertamenti prima di condividere un piano completo e un preventivo.' },
    ],
    source: { title: 'British Orthodontic Society: ortodonzia adulti', href: 'https://bos.org.uk/patients/treatments/orthodontics-for-adults/' },
  },
  {
    slug: 'ortodonzia-bambini-adolescenti', href: '/visita-ortodonzia/ortodonzia-bambini-adolescenti/', name: 'Bambini e adolescenti', group: 'age',
    summary: 'Valutazione dello sviluppo dentale e dell’occlusione.', linkLabel: 'Scopri il percorso',
    image: '/assets/optimized/ortodonzia-bambini-1200.webp',
    imageSet: '/assets/optimized/ortodonzia-bambini-720.webp 720w, /assets/optimized/ortodonzia-bambini-1200.webp 1200w',
    imageAlt: 'Controllo del sorriso di una bambina in studio',
    cardImage: '/assets/optimized/ortodonzia-bambini-adolescenti-sorriso-1440.webp',
    cardImageSet: '/assets/optimized/ortodonzia-bambini-adolescenti-sorriso-720.webp 720w, /assets/optimized/ortodonzia-bambini-adolescenti-sorriso-1440.webp 1440w',
    cardImageAlt: 'Due ragazzi sorridenti nello studio dentistico',
    seoTitle: 'Ortodonzia bambini e adolescenti a Modena e Reggio Emilia',
    description: 'Valutazione ortodontica per bambini e adolescenti a Modena e Reggio Emilia. Un percorso condiviso con la famiglia, in base allo sviluppo e al caso.',
    heroTitle: 'Bambini e adolescenti. Accompagnare il sorriso che cresce.',
    lead: 'Una valutazione aiuta a conoscere la posizione dei denti e il rapporto tra le arcate. Con la famiglia, definiamo se intervenire o programmare controlli nel tempo.',
    ctaLabel: 'Richiedi una visita per tuo figlio',
    assessmentTitle: 'Una valutazione, insieme alla famiglia.',
    assessmentIntro: 'Ogni bambino e ragazzo ha esigenze diverse. Il confronto con il genitore o il tutore permette di comprendere la situazione e organizzare i passi successivi.',
    considerations: [
      { title: 'Denti e sviluppo', text: 'Osserviamo la dentizione e la disposizione dei denti nel contesto della crescita.' },
      { title: 'Rapporto tra le arcate', text: 'Valutiamo come si incontrano i denti e quali aspetti dell’occlusione approfondire.' },
      { title: 'Collaborazione e abitudini', text: 'Condividiamo con il ragazzo e la famiglia le indicazioni e l’impegno dell’eventuale percorso.' },
    ],
    steps: [
      { title: 'Ascoltiamo la famiglia', text: 'Raccogliamo le esigenze e spieghiamo al bambino o al ragazzo come si svolge la valutazione.' },
      { title: 'Valutiamo il caso', text: 'La visita e gli eventuali accertamenti aiutano a capire se serva un trattamento o un controllo successivo.' },
      { title: 'Concordiamo i prossimi passi', text: 'Condividiamo con il genitore o il tutore le opzioni, i tempi indicativi e gli appuntamenti necessari.' },
    ],
    faqs: [
      { question: 'Una visita significa dover mettere l’apparecchio?', answer: 'No. La valutazione serve a conoscere la situazione: può portare a proporre un trattamento oppure a programmare controlli.' },
      { question: 'Quale apparecchio è più adatto a mio figlio?', answer: 'La risposta dipende dal caso e dalla fase di sviluppo. La scelta viene spiegata alla famiglia dopo gli accertamenti necessari.' },
      { question: 'Quali recapiti devo lasciare nel questionario?', answer: 'Indica l’età del paziente. Se è minorenne, inserisci nome e cognome, email e telefono del genitore o del tutore che la segreteria può contattare.' },
    ],
    source: { title: 'British Orthodontic Society: bambini e adolescenti', href: 'https://bos.org.uk/patients/treatments/orthodontics-for-children-teens/' },
  },
  {
    slug: 'allineatori-trasparenti', href: '/visita-ortodonzia/allineatori-trasparenti/', name: 'Allineatori trasparenti', group: 'solution',
    summary: 'Dispositivi rimovibili e discreti, quando indicati.', linkLabel: 'Scopri il trattamento',
    image: '/assets/optimized/ortodonzia-allineatori-blu-brand-1200.webp',
    imageSet: '/assets/optimized/ortodonzia-allineatori-blu-brand-720.webp 720w, /assets/optimized/ortodonzia-allineatori-blu-brand-1200.webp 1200w',
    imageAlt: 'Allineatore dentale trasparente rimovibile', productImage: true,
    seoTitle: 'Allineatori trasparenti a Modena e Reggio Emilia',
    description: 'Allineatori trasparenti a Modena e Reggio Emilia. Una visita ortodontica per valutarne l’indicazione e conoscere il percorso e l’impegno richiesto.',
    heroTitle: 'Allineatori trasparenti. Una possibilità da valutare insieme.',
    lead: 'Mascherine su misura, rimovibili e discrete. La visita ortodontica permette di capire se questa soluzione è indicata per i movimenti necessari nel tuo caso.',
    ctaLabel: 'Valuta il percorso con allineatori',
    assessmentTitle: 'La discrezione parte da un piano preciso.',
    assessmentIntro: 'Gli allineatori sono una delle alternative disponibili. La scelta nasce dallo studio del caso e dal confronto tra obiettivi clinici e abitudini quotidiane.',
    considerations: [
      { title: 'Dispositivi su misura', text: 'Una sequenza di mascherine trasparenti viene pianificata per guidare i movimenti dei denti.' },
      { title: 'Uso costante', text: 'Essendo rimovibili, richiedono di seguire le indicazioni concordate su utilizzo e cambi.' },
      { title: 'Controlli in studio', text: 'Le visite permettono di valutare l’avanzamento e, quando necessario, aggiornare il percorso.' },
    ],
    steps: [
      { title: 'Valutiamo l’indicazione', text: 'Studiamo denti, morso e condizioni della bocca prima di proporre gli allineatori.' },
      { title: 'Spieghiamo il piano', text: 'Condividiamo i movimenti previsti, le attenzioni quotidiane e gli eventuali ausili necessari.' },
      { title: 'Seguiamo il percorso', text: 'Controlli e mantenimento fanno parte del piano e vengono organizzati insieme allo studio.' },
    ],
    faqs: [
      { question: 'Gli allineatori sono completamente invisibili?', answer: 'Sono trasparenti e discreti, ma possono essere visibili da vicino. Eventuali attacchi sui denti o elastici vengono spiegati durante la pianificazione.' },
      { question: 'Sono indicati per tutti?', answer: 'No. I movimenti necessari, la salute della bocca e la possibilità di seguire le indicazioni guidano la scelta tra allineatori e altre tecniche.' },
      { question: 'Come vengono stabiliti tempi e costi?', answer: 'Dopo la visita e gli accertamenti viene condiviso un piano per il tuo caso, con tempi indicativi, controlli previsti e preventivo.' },
    ],
    source: { title: 'British Orthodontic Society: dispositivi ortodontici', href: 'https://bos.org.uk/patients/treatments/orthodontics-for-adults/treatment-brace-types/' },
  },
  {
    slug: 'apparecchio-fisso', href: '/visita-ortodonzia/apparecchio-fisso/', name: 'Apparecchio fisso', group: 'solution',
    summary: 'Soluzioni consolidate per diverse esigenze ortodontiche.', linkLabel: 'Scopri il trattamento',
    image: '/assets/optimized/ortodonzia-apparecchio-fisso-1200.webp',
    imageSet: '/assets/optimized/ortodonzia-apparecchio-fisso-720.webp 720w, /assets/optimized/ortodonzia-apparecchio-fisso-1200.webp 1200w',
    imageAlt: 'Apparecchio ortodontico fisso con attacchi metallici',
    seoTitle: 'Apparecchio fisso a Modena e Reggio Emilia',
    description: 'Apparecchio ortodontico fisso a Modena e Reggio Emilia. Diagnosi, pianificazione e controlli per un percorso scelto in base al caso.',
    heroTitle: 'Apparecchio fisso. Un percorso guidato, controllo dopo controllo.',
    lead: 'Attacchi e filo ortodontico rimangono sui denti durante il trattamento. La scelta di questa tecnica dipende dalla diagnosi e dai movimenti da pianificare.',
    ctaLabel: 'Richiedi una valutazione ortodontica',
    assessmentTitle: 'Una tecnica da scegliere sul tuo caso.',
    assessmentIntro: 'Prima di iniziare, approfondiamo le caratteristiche della bocca e condividiamo ciò che il trattamento richiede: controlli, igiene e attenzione quotidiana.',
    considerations: [
      { title: 'Un dispositivo fisso', text: 'Gli attacchi collegati dal filo vengono applicati ai denti e regolati durante il percorso.' },
      { title: 'Igiene e attenzioni', text: 'Lo studio spiega come pulire denti e apparecchio e quali accorgimenti seguire nella quotidianità.' },
      { title: 'Mantenimento del risultato', text: 'Al termine dei movimenti, vengono concordate la contenzione e le visite successive.' },
    ],
    steps: [
      { title: 'Studiamo la situazione', text: 'Valutiamo denti e morso con gli accertamenti necessari per definire il piano.' },
      { title: 'Condividiamo il trattamento', text: 'Prima dell’applicazione, spieghiamo obiettivi, tempi indicativi, costi e attenzioni richieste.' },
      { title: 'Programmiamo i controlli', text: 'Le regolazioni e le verifiche in studio accompagnano il percorso fino al mantenimento.' },
    ],
    faqs: [
      { question: 'Posso togliere l’apparecchio fisso?', answer: 'No, gli attacchi rimangono applicati ai denti durante il trattamento. Applicazione, regolazioni e rimozione vengono gestite in studio.' },
      { question: 'Cosa cambia nella quotidianità?', answer: 'Servono indicazioni specifiche per l’igiene e attenzione agli alimenti che possono danneggiare il dispositivo. Lo studio le spiega prima di iniziare.' },
      { question: 'Dopo la rimozione servono ancora controlli?', answer: 'Sì. Contenzione e controlli successivi fanno parte del mantenimento e vengono definiti in base al caso.' },
    ],
    source: { title: 'NHS: apparecchi ortodontici', href: 'https://www.nhs.uk/tests-and-treatments/braces/' },
  },
];

export const orthodonticAgeMenu = [
  { label: 'Allineatori per adulti', href: '/visita-ortodonzia/ortodonzia-adulti/' },
  { label: 'Allineatori per adolescenti', href: '/visita-ortodonzia/ortodonzia-bambini-adolescenti/' },
  { label: 'Allineatori per bambini', href: '/visita-ortodonzia/ortodonzia-bambini-adolescenti/' },
];
