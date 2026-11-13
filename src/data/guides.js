// Raccolta centralizzata di "Guide e consigli".
// L'indice /guide-e-consigli/, le pagine guida, i collegamenti dai trattamenti e la sitemap
// leggono tutti da questo file: aggiungere una voce qui aggiorna automaticamente il resto.
//
// Regole editoriali:
// - `published: false` tiene una bozza fuori da indice, route e sitemap.
// - `form.treatment` e `form.reasons` devono corrispondere alle etichette di /richiesta/
//   (verificato da tests/guides.test.mjs), altrimenti la preselezione non avviene.
// - Nessun prezzo, gratuità, autore o revisore clinico se non confermati dallo studio.

export const guidesIndexPath = '/guide-e-consigli/';

export const guideCategories = [
  { id: 'ortodonzia-bambini', label: 'Ortodonzia e bambini', description: 'Allineatori, apparecchi e prime visite dei più piccoli.' },
  { id: 'impianti-protesi', label: 'Denti mancanti, impianti e protesi', description: 'Come si sostituisce un dente e cosa cambia tra le soluzioni.' },
  { id: 'gengive-mandibola', label: 'Gengive e mandibola', description: 'Sanguinamento gengivale, parodontite, dolore e rumori della mandibola.' },
  { id: 'chirurgia-orale', label: 'Chirurgia orale', description: 'Denti del giudizio, estrazioni e denti che non erompono.' },
  { id: 'urgenze-prevenzione', label: 'Urgenze e prevenzione', description: 'Cosa fare dopo un trauma e quali segnali non trascurare.' },
  { id: 'scelta-studio', label: 'Scegliere lo studio', description: 'Criteri pratici per valutare uno studio dentistico.' },
];

/** Percorsi selezionabili nel modulo breve dell'indice: sono le etichette dei trattamenti di /richiesta/. */
export const requestTreatmentLabels = [
  'Igiene orale e prevenzione',
  'Sbiancamento dentale',
  'Faccette dentali',
  'Carie e otturazioni',
  'Devitalizzazione',
  'Odontoiatria infantile',
  'Ortodonzia e allineatori',
  'Disturbi della mandibola e ATM',
  'Russamento e apnee notturne',
  'Cura delle gengive',
  'Protesi dentali',
  'Chirurgia orale',
  'Implantologia',
];

const MINISTERO_RACCOMANDAZIONI = {
  label: 'Ministero della Salute, Raccomandazioni cliniche in odontostomatologia (2017)',
  url: 'https://www.salute.gov.it/imgs/C_17_pubblicazioni_2637_allegato.pdf',
};

const updated = '2026-11-13';

/** Guide nuove, pubblicate sotto /guide-e-consigli/<slug>/. */
export const guides = [
  {
    slug: 'costo-allineatori-trasparenti',
    category: 'ortodonzia-bambini',
    published: true,
    updated,
    title: 'Allineatori trasparenti: da cosa dipende il costo',
    seoTitle: 'Costo degli allineatori trasparenti: da cosa dipende',
    description:
      'Quali voci compongono il preventivo di un trattamento con allineatori trasparenti e quali fattori lo fanno variare. Guida dello studio Federzoni Granata, Modena e Reggio Emilia.',
    summary: 'Le voci del preventivo e i fattori che lo fanno variare, prima della visita ortodontica.',
    kicker: 'Ortodonzia',
    lead: 'Il costo di un trattamento con allineatori non è una tariffa fissa: dipende da quanto e come devono muoversi i denti. Qui trovi le voci che lo compongono e le domande utili da fare prima di decidere.',
    keyPoints: [
      'Il preventivo nasce dalla diagnosi, non dal tipo di apparecchio',
      'Complessità e durata sono i fattori che pesano di più',
      'Contenzione e controlli fanno parte del percorso',
    ],
    form: {
      treatment: 'Ortodonzia e allineatori',
      reasonLabel: 'Tipo di percorso',
      reasons: ['Allineatori trasparenti', 'Apparecchio ortodontico tradizionale', 'Valutazione ortodontica per un bambino o ragazzo'],
    },
    sections: [
      {
        title: 'Perché non esiste un prezzo uguale per tutti',
        paragraphs: [
          'Gli allineatori sono una sequenza di mascherine costruite su misura: il loro numero, e quindi la durata del trattamento, dipende dai movimenti necessari. Chiudere un piccolo spazio tra due incisivi e correggere un affollamento con una chiusura dei denti alterata sono lavori molto diversi, anche se lo strumento è lo stesso.',
          'Per questo una cifra letta online, o riferita da un conoscente, dice poco sul tuo caso. Il dato utile arriva dopo la visita ortodontica, quando si sa che cosa va corretto e in quanto tempo è ragionevole farlo.',
        ],
      },
      {
        title: 'Le voci che compongono il preventivo',
        paragraphs: ['Un preventivo chiaro permette di capire che cosa è compreso. In genere le voci sono queste:'],
        list: [
          'Studio del caso: visita, fotografie, impronta digitale e radiografie quando indicate.',
          'Progetto del trattamento e produzione degli allineatori.',
          'Visite di controllo durante il percorso.',
          'Eventuali fasi di rifinitura, con allineatori aggiuntivi se i denti non hanno seguito del tutto il programma.',
          'Contenzione finale, fissa o rimovibile, per mantenere la posizione raggiunta.',
        ],
        note: 'Quando confronti due preventivi, verifica che comprendano le stesse voci: rifiniture e contenzione sono quelle che più spesso fanno la differenza.',
      },
      {
        title: 'Che cosa lo fa salire o scendere',
        table: {
          caption: 'Fattori che incidono sul costo di un trattamento con allineatori',
          headers: ['Fattore', 'Perché incide'],
          rows: [
            ['Complessità dei movimenti', 'Più movimenti significano più allineatori, più controlli e più tempo.'],
            ['Una o due arcate', 'Trattare una sola arcata è possibile solo quando la chiusura dei denti lo consente.'],
            ['Cure preliminari', 'Carie, infiammazione gengivale o igiene da recuperare si affrontano prima di iniziare.'],
            ['Collaborazione', 'Gli allineatori funzionano se vengono indossati per le ore indicate: un uso discontinuo allunga il percorso.'],
            ['Tipo di contenzione', 'La scelta dipende dal caso e dalla stabilità attesa.'],
          ],
        },
      },
      {
        title: 'Allineatori o apparecchio fisso: cambia la spesa?',
        paragraphs: [
          'Non c’è una regola valida per tutti. Gli allineatori sono adatti a molti percorsi ma non a tutti: in alcuni casi l’apparecchio fisso controlla meglio certi movimenti, in altri le due soluzioni sono equivalenti e la scelta dipende da abitudini ed esigenze estetiche.',
          'La domanda utile non è quale costa meno, ma quale strumento permette di raggiungere il risultato previsto nel tuo caso. La differenza economica, quando c’è, va letta insieme a durata, numero di visite e impegno richiesto.',
        ],
      },
      {
        title: 'Come si arriva a una cifra precisa',
        paragraphs: [
          'Nello studio il preventivo viene definito dopo la visita ortodontica e lo studio del caso, e viene spiegato prima di iniziare. Le cifre e le modalità di pagamento ti vengono comunicate dalla segreteria insieme al piano di cura: questa guida non sostituisce quella valutazione.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Posso avere un preventivo senza visita?',
        answer: 'No, e sarebbe poco affidabile. Senza sapere quali movimenti servono non si può stimare né il numero di allineatori né la durata, che sono le voci principali.',
      },
      {
        question: 'La contenzione è sempre necessaria?',
        answer: 'Dopo un trattamento ortodontico i denti tendono a tornare verso la posizione iniziale. Per questo la fase di contenzione fa parte del percorso e va considerata fin dal preventivo.',
      },
      {
        question: 'Gli allineatori sono davvero invisibili?',
        answer: 'Sono generalmente discreti, ma non completamente invisibili. Da vicino si possono notare, soprattutto quando sono presenti piccoli rilievi in composito applicati sui denti per guidare i movimenti.',
      },
      {
        question: 'Quanto dura il trattamento?',
        answer: 'Non esiste una durata standard. Dipende dai movimenti necessari, dalla risposta individuale e dalla costanza con cui vengono indossati gli allineatori.',
      },
    ],
    treatments: [
      { label: 'Allineatori trasparenti', href: '/visita-ortodonzia/allineatori-trasparenti/' },
      { label: 'Apparecchio fisso', href: '/visita-ortodonzia/apparecchio-fisso/' },
      { label: 'Ortodonzia e allineatori', href: '/ortodonzia-allineatori-invisibili/' },
    ],
    treatmentPaths: ['/ortodonzia-allineatori-invisibili/'],
    related: ['prima-visita-ortodontica-bambini'],
    sources: [MINISTERO_RACCOMANDAZIONI],
    cta: { title: 'Per una cifra precisa serve conoscere il tuo caso.', href: '/richiesta/?trattamento=Ortodonzia%20e%20allineatori' },
  },
  {
    slug: 'prima-visita-ortodontica-bambini',
    category: 'ortodonzia-bambini',
    published: true,
    updated,
    title: 'Prima visita dal dentista e dall’ortodontista: a che età',
    seoTitle: 'Bambini: a che età la prima visita dal dentista e dall’ortodontista',
    description:
      'Quando portare un bambino alla prima visita odontoiatrica e a che età ha senso una valutazione ortodontica. Indicazioni basate sulle raccomandazioni del Ministero della Salute.',
    summary: 'Le età indicate dalle raccomandazioni e i segnali per cui non conviene aspettare.',
    kicker: 'Bambini e ragazzi',
    lead: 'La prima visita odontoiatrica è indicata presto, intorno ai 18–24 mesi. La prima valutazione ortodontica ha senso entro i 7 anni. In entrambi i casi visita non significa cura: spesso serve solo a controllare che la crescita proceda bene.',
    keyPoints: [
      'Prima visita odontoiatrica verso i 18–24 mesi',
      'Valutazione ortodontica entro i 7 anni',
      'Visitare presto non vuol dire mettere presto l’apparecchio',
    ],
    form: {
      treatmentLabel: 'Tipo di visita',
      treatmentOptions: ['Odontoiatria infantile', 'Ortodonzia e allineatori'],
    },
    sections: [
      {
        title: 'La prima visita dal dentista',
        paragraphs: [
          'Le raccomandazioni cliniche del Ministero della Salute indicano la prima visita odontoiatrica verso i 18–24 mesi, anche in assenza di problemi. A quell’età il controllo è breve: si osservano denti e gengive, si parla di igiene, alimentazione e abitudini come ciuccio e biberon.',
          'Lo scopo principale è un altro: far conoscere al bambino l’ambiente quando non c’è dolore. Un bambino che arriva per la prima volta dal dentista con un’urgenza vive un’esperienza molto diversa.',
        ],
      },
      {
        title: 'La prima valutazione ortodontica',
        paragraphs: [
          'L’American Association of Orthodontists raccomanda un primo controllo ortodontico non oltre i 7 anni. Intorno a quell’età convivono denti da latte e primi denti permanenti, e si può osservare come stanno crescendo le ossa mascellari e come chiudono i denti.',
          'Nella maggior parte dei casi la valutazione si conclude con un programma di controlli periodici. In alcune situazioni, invece, intervenire durante la crescita permette di guidare lo sviluppo; in altre conviene attendere la dentatura permanente. Decidere quando è parte della diagnosi.',
        ],
      },
      {
        title: 'Segnali per cui ha senso non aspettare',
        paragraphs: ['Indipendentemente dall’età, una valutazione è utile se noti una di queste situazioni:'],
        list: [
          'Denti da latte persi molto presto o molto tardi rispetto ai coetanei.',
          'Difficoltà a masticare o a chiudere le labbra a riposo.',
          'Respirazione prevalente con la bocca.',
          'Suzione del dito o del ciuccio che continua oltre la prima infanzia.',
          'Denti superiori molto sporgenti, oppure denti inferiori che chiudono davanti ai superiori.',
          'Mandibola che devia di lato quando il bambino chiude la bocca.',
        ],
        note: 'Sono osservazioni che un genitore può riferire, non una diagnosi: servono a decidere se anticipare la visita.',
      },
      {
        title: 'Come si svolge la visita',
        paragraphs: [
          'La visita di un bambino procede per gradi: prima il racconto dei genitori, poi l’osservazione, con tempi adattati all’età. Radiografie o impronte si eseguono solo quando servono a rispondere a una domanda clinica precisa.',
          'Al termine ricevi una spiegazione di ciò che è stato osservato e l’indicazione su quando tornare. Se è opportuno un trattamento, tempi, alternative e impegno richiesto vengono chiariti prima di iniziare.',
        ],
      },
    ],
    faqs: [
      {
        question: 'A 7 anni non è troppo presto per l’apparecchio?',
        answer: 'La visita a quell’età serve a valutare la crescita, non a mettere l’apparecchio. Molti bambini vengono semplicemente ricontrollati nel tempo.',
      },
      {
        question: 'I denti da latte vanno curati anche se cadranno?',
        answer: 'Sì. Mantengono lo spazio per i denti permanenti e servono a masticare e parlare. Una carie non curata può causare dolore e infezioni.',
      },
      {
        question: 'Lo studio segue anche i bambini?',
        answer: 'Sì, lo studio si occupa di odontoiatria infantile e di ortodonzia per bambini e adolescenti in entrambe le sedi.',
      },
    ],
    treatments: [
      { label: 'Odontoiatria per bambini', href: '/pedodonzia-odontoiatria-infantile/' },
      { label: 'Ortodonzia per bambini e adolescenti', href: '/visita-ortodonzia/ortodonzia-bambini-adolescenti/' },
    ],
    treatmentPaths: ['/pedodonzia-odontoiatria-infantile/', '/ortodonzia-allineatori-invisibili/'],
    related: ['/carie-denti-da-latte/', 'trauma-dentale-cosa-fare'],
    sources: [
      MINISTERO_RACCOMANDAZIONI,
      { label: 'American Association of Orthodontists, Child orthodontics FAQ', url: 'https://aaoinfo.org/faqs/child-orthodontics/page/4' },
    ],
    cta: { title: 'Una prima visita serve a sapere se e quando intervenire.', href: '/richiesta/' },
  },
  {
    slug: 'preventivo-impianto-dentale',
    category: 'impianti-protesi',
    published: true,
    updated,
    title: 'Impianto dentale: che cosa comprende il preventivo',
    seoTitle: 'Impianto dentale: cosa comprende il preventivo e da cosa dipende il costo',
    description:
      'Le voci di un preventivo per impianto dentale, i fattori che lo modificano e le domande da fare prima di accettarlo. Guida dello studio Federzoni Granata, Modena e Reggio Emilia.',
    summary: 'Che cosa c’è dentro un preventivo implantare e come leggerlo senza sorprese.',
    kicker: 'Implantologia',
    lead: 'Quello che comunemente si chiama “impianto” è fatto di più parti e di più fasi. Un preventivo completo le elenca tutte: sapere quali sono ti permette di confrontare proposte diverse e capire che cosa stai pagando.',
    keyPoints: [
      'Impianto, moncone e corona sono tre componenti distinti',
      'Osso e gengiva disponibili cambiano il percorso',
      'Il prezzo più basso non sempre descrive lo stesso lavoro',
    ],
    form: {
      treatment: 'Implantologia',
      reasonLabel: 'Motivo della richiesta',
      reasons: ['Sostituire un singolo dente', 'Sostituire più denti o un’intera arcata', 'Valutare implantologia computer guidata'],
    },
    sections: [
      {
        title: 'Di che cosa è fatto un “impianto”',
        paragraphs: [
          'L’impianto in senso stretto è la vite inserita nell’osso, che fa da radice artificiale. Su questa si fissa un moncone, e sul moncone la corona, cioè la parte visibile del dente. Quando si parla di “prezzo di un impianto” è bene chiarire se si intende solo la prima parte o il dente finito.',
        ],
      },
      {
        title: 'Le voci del preventivo',
        list: [
          'Visita e diagnosi: esame clinico, radiografie e, quando indicata, TAC Cone Beam per misurare l’osso disponibile.',
          'Eventuali cure preliminari: igiene, terapia gengivale, estrazione del dente compromesso.',
          'Fase chirurgica: inserimento dell’impianto, con o senza guida chirurgica computerizzata.',
          'Eventuali interventi sull’osso o sulla gengiva, se il volume non è sufficiente.',
          'Dente provvisorio durante la guarigione, quando previsto.',
          'Moncone e corona definitiva.',
          'Controlli successivi e mantenimento.',
        ],
        note: 'Se una di queste voci non compare, chiedi se non serve nel tuo caso o se verrà conteggiata a parte.',
      },
      {
        title: 'Che cosa modifica il costo',
        table: {
          caption: 'Fattori che incidono sul preventivo di un impianto dentale',
          headers: ['Fattore', 'Perché incide'],
          rows: [
            ['Numero di denti da sostituire', 'Un dente singolo, un ponte su impianti e un’arcata completa sono progetti diversi.'],
            ['Quantità e qualità dell’osso', 'Se l’osso è scarso possono servire procedure aggiuntive prima o durante l’intervento.'],
            ['Posizione del dente', 'Nelle zone visibili del sorriso la gestione della gengiva e dell’estetica richiede più passaggi.'],
            ['Salute delle gengive', 'Una parodontite non trattata va stabilizzata prima di inserire un impianto.'],
            ['Materiale e tipo di protesi', 'La corona può essere realizzata con materiali e tecniche differenti.'],
          ],
        },
      },
      {
        title: 'Quando l’impianto non è la prima scelta',
        paragraphs: [
          'L’impianto non è indicato in ogni situazione. Fumo, igiene orale insufficiente, malattia parodontale attiva e alcune condizioni generali di salute sono tra i fattori che il clinico valuta prima di proporlo, perché possono comprometterne la durata.',
          'In alcuni casi un ponte tradizionale o una protesi rimovibile rispondono meglio alle esigenze della persona. Le alternative vanno messe sul tavolo prima di scegliere: le trovi confrontate nella guida sui denti mancanti.',
        ],
      },
      {
        title: 'Domande utili prima di accettare',
        list: [
          'Il preventivo comprende il dente finito o solo la parte chirurgica?',
          'Sono previsti interventi sull’osso? Sono già conteggiati?',
          'Avrò un dente provvisorio durante la guarigione?',
          'Quali controlli sono necessari dopo, e con quale frequenza?',
          'Quali alternative ci sono nel mio caso?',
        ],
        after: [
          'Nello studio queste risposte vengono date dopo la diagnosi, insieme al piano di cura. Le cifre ti vengono comunicate in quella sede: questa guida non le sostituisce.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Esistono impianti “senza viti”?',
        answer: 'L’impianto dentale è per definizione un elemento inserito nell’osso. Quando si parla di soluzioni “senza viti” di solito ci si riferisce a protesi rimovibili o a ponti su denti naturali, che sono alternative all’impianto e non un tipo di impianto.',
      },
      {
        question: 'Che cosa cambia con la chirurgia computer guidata?',
        answer: 'L’intervento viene pianificato su immagini tridimensionali e la posizione dell’impianto è trasferita in bocca con una guida. Non è necessaria in tutti i casi: l’indicazione dipende dalla situazione clinica.',
      },
      {
        question: 'Quanto dura un impianto?',
        answer: 'Non si può garantire una durata. Dipende dall’igiene quotidiana, dai controlli, dal fumo e dalla salute delle gengive. Un impianto richiede mantenimento come un dente naturale.',
      },
      {
        question: 'L’intervento è doloroso?',
        answer: 'Si esegue in anestesia locale. Nei giorni successivi sono possibili gonfiore e fastidio, che variano da persona a persona e per i quali ricevi indicazioni precise.',
      },
    ],
    treatments: [
      { label: 'Implantologia tradizionale e computer guidata', href: '/implantologia-tradizionale-computer-guidata/' },
      { label: 'Protesi fissa e mobile', href: '/protesi-fissa-mobile/' },
    ],
    treatmentPaths: ['/implantologia-tradizionale-computer-guidata/'],
    related: ['denti-mancanti-ponte-impianto-protesi', '/dentiera-fissa-cose-e-vantaggi/'],
    sources: [MINISTERO_RACCOMANDAZIONI],
    cta: { title: 'Un preventivo utile parte da una diagnosi completa.', href: '/richiesta/?trattamento=Implantologia' },
  },
  {
    slug: 'denti-mancanti-ponte-impianto-protesi',
    category: 'impianti-protesi',
    published: true,
    updated,
    title: 'Denti mancanti: ponte, impianto o protesi mobile',
    seoTitle: 'Denti mancanti: ponte, impianto o protesi mobile a confronto',
    description:
      'Le soluzioni per sostituire uno o più denti mancanti, con vantaggi e limiti di ciascuna. Confronto tra ponte, impianto e protesi rimovibile dello studio Federzoni Granata.',
    summary: 'Tre soluzioni a confronto, con vantaggi e limiti, per capire quali domande portare in visita.',
    kicker: 'Protesi e implantologia',
    lead: 'Per sostituire un dente mancante esistono tre strade: un ponte sui denti vicini, un impianto, una protesi rimovibile. Nessuna è la migliore in assoluto: ciascuna ha indicazioni e limiti, e la scelta dipende da ciò che c’è in bocca oggi.',
    keyPoints: [
      'Tre soluzioni, con impegno e mantenimento diversi',
      'Contano i denti vicini, l’osso e le gengive',
      'Anche non sostituire è una scelta, con le sue conseguenze',
    ],
    form: {
      treatmentLabel: 'Tipo di percorso',
      treatmentOptions: ['Implantologia', 'Protesi dentali'],
    },
    sections: [
      {
        title: 'Le tre soluzioni a confronto',
        table: {
          caption: 'Confronto tra ponte, impianto e protesi rimovibile',
          headers: ['', 'Ponte su denti naturali', 'Impianto', 'Protesi rimovibile'],
          rows: [
            ['Come funziona', 'I denti accanto allo spazio sostengono il dente mancante.', 'Una radice artificiale nell’osso sostiene la corona.', 'Una protesi che si toglie e si rimette, sostenuta da denti e gengiva.'],
            ['Denti vicini', 'Vanno preparati per ricevere le corone.', 'Non vengono toccati.', 'Di norma non vengono preparati; possono servire ganci o attacchi.'],
            ['Chirurgia', 'Non necessaria.', 'Necessaria.', 'Non necessaria.'],
            ['Tempi', 'In genere più brevi.', 'Più lunghi: serve la guarigione dell’osso.', 'In genere brevi.'],
            ['Igiene', 'Richiede strumenti specifici sotto il ponte.', 'Come un dente, con controlli regolari.', 'La protesi va rimossa e pulita ogni giorno.'],
            ['Quando è spesso considerata', 'Denti vicini già da ricoprire con corone.', 'Denti vicini sani e osso adeguato.', 'Molti denti mancanti, o quando le altre soluzioni non sono indicate.'],
          ],
        },
      },
      {
        title: 'Che cosa orienta la scelta',
        list: [
          'Lo stato dei denti accanto allo spazio: sani, già otturati o da ricoprire.',
          'La quantità di osso nella zona e la salute delle gengive.',
          'Il numero e la posizione dei denti mancanti.',
          'Le condizioni generali di salute e le abitudini, come il fumo.',
          'Il tempo che la persona può dedicare alle cure e al mantenimento.',
          'Le aspettative su estetica e comfort.',
        ],
        after: [
          'Sono elementi che si valutano con visita e radiografie. Per questo due persone con “lo stesso dente mancante” possono ricevere indicazioni diverse.',
        ],
      },
      {
        title: 'E se non sostituisco il dente?',
        paragraphs: [
          'Non sempre è necessario intervenire subito, ma è utile sapere che cosa può succedere nel tempo: i denti vicini possono inclinarsi verso lo spazio, il dente opposto può allungarsi, la masticazione si sposta sull’altro lato. Sono cambiamenti lenti, che possono rendere più complesso un intervento futuro.',
          'Decidere di aspettare è legittimo: conviene farlo conoscendo tempi e controlli da programmare.',
        ],
      },
      {
        title: 'Le protesi mobili “invisibili”',
        paragraphs: [
          'Esistono protesi rimovibili con ganci estetici o in materiali flessibili, pensate per notarsi meno. Hanno vantaggi estetici ma anche limiti di stabilità e di riparabilità. Ne parliamo in modo esteso nell’approfondimento sulle protesi dentarie mobili invisibili.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Qual è la soluzione più economica?',
        answer: 'Il costo iniziale è solo una parte del conto. Durata prevedibile, mantenimento e ciò che accade ai denti vicini incidono nel tempo. Il confronto va fatto sul caso concreto, con un preventivo per ogni opzione possibile.',
      },
      {
        question: 'Si può passare da una protesi mobile a un impianto in seguito?',
        answer: 'Spesso sì, ma dipende dall’osso disponibile al momento. Con il tempo, dove manca un dente l’osso tende a ridursi: va verificato con gli esami.',
      },
      {
        question: 'Esistono impianti “senza viti”?',
        answer: 'No: l’impianto è un elemento inserito nell’osso. Le soluzioni presentate come “senza viti” sono in genere ponti o protesi rimovibili, cioè alternative all’impianto.',
      },
    ],
    treatments: [
      { label: 'Protesi fissa e mobile', href: '/protesi-fissa-mobile/' },
      { label: 'Implantologia tradizionale e computer guidata', href: '/implantologia-tradizionale-computer-guidata/' },
    ],
    treatmentPaths: ['/protesi-fissa-mobile/', '/implantologia-tradizionale-computer-guidata/'],
    related: ['preventivo-impianto-dentale', '/protesi-dentarie-mobili-invisibili-vantaggi-e-svantaggi/', '/dentiera-fissa-cose-e-vantaggi/'],
    sources: [MINISTERO_RACCOMANDAZIONI],
    cta: { title: 'La soluzione giusta dipende da ciò che c’è in bocca oggi.', href: '/richiesta/' },
  },
  {
    slug: 'gengive-che-sanguinano',
    category: 'gengive-mandibola',
    published: true,
    updated,
    title: 'Gengive che sanguinano: quando farle controllare',
    seoTitle: 'Gengive che sanguinano: cause e quando farle controllare',
    description:
      'Perché le gengive sanguinano, che differenza c’è tra gengivite e parodontite e quando è utile una visita parodontale. Guida dello studio Federzoni Granata, Modena e Reggio Emilia.',
    summary: 'Che cosa indica il sanguinamento, come si distingue una gengivite da una parodontite e come si fa la diagnosi.',
    kicker: 'Parodontologia',
    lead: 'Gengive sane non sanguinano quando ci si lava i denti. Il sanguinamento è il primo segnale di un’infiammazione: nella maggior parte dei casi è una gengivite, reversibile. Se persiste, va controllato, perché la parodontite può restare a lungo senza altri sintomi.',
    keyPoints: [
      'Il sanguinamento è un segnale, non un fatto normale',
      'La gengivite è reversibile, la parodontite va curata',
      'La diagnosi si fa con il sondaggio parodontale',
    ],
    form: {
      treatment: 'Cura delle gengive',
      reasonLabel: 'Motivo della richiesta',
      reasons: ['Gengive che sanguinano o sono infiammate', 'Recessione gengivale o denti che si muovono', 'Mantenimento dopo una terapia parodontale'],
    },
    sections: [
      {
        title: 'Perché le gengive sanguinano',
        paragraphs: [
          'La causa più frequente è la placca batterica che si accumula lungo il margine gengivale. La gengiva reagisce infiammandosi: diventa più rossa, più gonfia e sanguina al contatto con spazzolino o filo.',
          'Smettere di spazzolare la zona per non farla sanguinare peggiora la situazione. Altri fattori possono contribuire, tra cui fumo, diabete, alcuni farmaci e cambiamenti ormonali: è utile riferirli durante la visita.',
        ],
      },
      {
        title: 'Gengivite e parodontite non sono la stessa cosa',
        table: {
          caption: 'Differenze tra gengivite e parodontite',
          headers: ['', 'Gengivite', 'Parodontite'],
          rows: [
            ['Che cosa coinvolge', 'Solo la gengiva.', 'Anche l’osso e i tessuti che sostengono il dente.'],
            ['È reversibile?', 'Sì, rimuovendo la placca.', 'Il tessuto perso non si riforma da solo; la malattia si può fermare e controllare.'],
            ['Segnali possibili', 'Sanguinamento, rossore, gonfiore.', 'Gli stessi, più gengive che si ritirano, alito cattivo, denti che si spostano o si muovono.'],
            ['Dolore', 'Di solito assente.', 'Spesso assente fino alle fasi avanzate.'],
          ],
        },
        note: 'Dai soli segni visibili non è possibile distinguere le due condizioni: serve una misurazione.',
      },
      {
        title: 'Come si fa la diagnosi',
        paragraphs: [
          'Lo strumento è il sondaggio parodontale: una sonda millimetrata misura la profondità dello spazio tra dente e gengiva e registra dove c’è sanguinamento. È un esame rapido, che si esegue alla poltrona. Quando serve si aggiungono radiografie per valutare l’osso.',
          'La Società Italiana di Parodontologia e Implantologia raccomanda di rivolgersi al dentista quando le gengive sanguinano, sono arrossate o si ritirano, e di chiedere una valutazione specifica delle gengive durante i controlli.',
        ],
      },
      {
        title: 'Che cosa succede se si aspetta',
        paragraphs: [
          'Una gengivite trascurata può evolvere in parodontite, anche se non accade in tutte le persone. La parodontite avanza lentamente e spesso senza dolore: per questo molte persone la scoprono quando un dente inizia a muoversi.',
          'Intervenire nella fase di gengivite significa di solito igiene professionale e correzione delle abitudini quotidiane. Più avanti il percorso richiede più sedute e controlli più ravvicinati.',
        ],
      },
      {
        title: 'Come si cura',
        paragraphs: [
          'Il trattamento procede per fasi: istruzioni di igiene e controllo dei fattori di rischio, rimozione professionale di placca e tartaro sopra e sotto gengiva, rivalutazione. Solo se necessario si considerano interventi chirurgici. Segue una terapia di mantenimento, con richiami la cui frequenza dipende dal caso.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Se sanguinano devo smettere di usare il filo?',
        answer: 'No. La zona che sanguina è quella dove la placca è rimasta più a lungo. Una pulizia delicata ma completa di solito riduce il sanguinamento in pochi giorni; se continua, è il momento di farsi controllare.',
      },
      {
        question: 'Il collutorio basta?',
        answer: 'Può essere un aiuto temporaneo se consigliato dal dentista, ma non sostituisce la rimozione meccanica della placca né la diagnosi.',
      },
      {
        question: 'La parodontite si può curare?',
        answer: 'Si può fermare e mantenere sotto controllo nel tempo. Il risultato dipende dalla diagnosi precoce, dalla terapia e dalla costanza nel mantenimento.',
      },
      {
        question: 'Il sondaggio fa male?',
        answer: 'Di solito provoca un fastidio lieve. Dove la gengiva è molto infiammata può essere più sensibile: in quel caso si procede con le dovute attenzioni.',
      },
    ],
    treatments: [
      { label: 'Parodontologia e cure gengivali', href: '/parodontologia-cure-gengivali/' },
      { label: 'Igiene orale e prevenzione', href: '/igiene-orale-prevenzione/' },
    ],
    treatmentPaths: ['/parodontologia-cure-gengivali/', '/igiene-orale-prevenzione/'],
    related: ['preventivo-impianto-dentale'],
    sources: [
      { label: 'SIdP, Linee guida EFP S3 per il trattamento della parodontite di stadio I–III (adattamento italiano)', url: 'https://www.sidp.it/media-download/ta2e331.pdf' },
      { label: 'SIdP, gengive.org: informazioni per i pazienti sulle malattie gengivali', url: 'http://www.gengive.org/' },
      MINISTERO_RACCOMANDAZIONI,
    ],
    cta: { title: 'Un controllo delle gengive chiarisce a che punto sei.', href: '/richiesta/?trattamento=Cura%20delle%20gengive' },
  },
  {
    slug: 'dolore-click-mandibola-bruxismo',
    category: 'gengive-mandibola',
    published: true,
    updated,
    title: 'Mandibola che fa rumore o fa male: quando serve una visita gnatologica',
    seoTitle: 'Click e dolore alla mandibola, bruxismo: quando serve una visita gnatologica',
    description:
      'Rumori, dolore o blocchi della mandibola e bruxismo: quali segnali meritano una valutazione gnatologica e come si svolge la visita. Studio Federzoni Granata, Modena e Reggio Emilia.',
    summary: 'Quali disturbi meritano una valutazione, quali no, e che cosa aspettarsi dalla visita gnatologica.',
    kicker: 'Gnatologia',
    lead: 'Un rumore dell’articolazione senza dolore è frequente e di solito non richiede cure. Ha senso una valutazione gnatologica quando compaiono dolore, limitazione nell’aprire la bocca o blocchi. Le cure iniziali sono, nella grande maggioranza dei casi, conservative e reversibili.',
    keyPoints: [
      'Il solo click, senza dolore, in genere non va trattato',
      'Dolore, blocchi e apertura limitata vanno valutati',
      'Si parte da terapie conservative e reversibili',
    ],
    form: {
      treatment: 'Disturbi della mandibola e ATM',
      reasonLabel: 'Motivo della richiesta',
      reasons: ['Dolore, rumori o blocchi della mandibola', 'Bruxismo, serramento o usura dei denti', 'Valutazione del morso e della funzione'],
    },
    sections: [
      {
        title: 'Di che cosa parliamo',
        paragraphs: [
          'I disordini temporo-mandibolari sono un gruppo di condizioni che riguardano l’articolazione davanti all’orecchio, i muscoli della masticazione o entrambi. Possono dare dolore al viso o alla mandibola, rumori articolari, difficoltà ad aprire la bocca e, in alcuni casi, mal di testa.',
          'Secondo il National Institute of Dental and Craniofacial Research molti di questi disturbi durano poco e si risolvono da soli. Nella maggior parte dei casi la causa precisa non è chiara.',
        ],
      },
      {
        title: 'Quando basta osservare e quando farsi vedere',
        table: {
          caption: 'Segnali della mandibola e che cosa fare',
          headers: ['Che cosa noti', 'Che cosa fare'],
          rows: [
            ['Click o scatto senza dolore', 'In genere nessuna terapia. Riferiscilo al prossimo controllo.'],
            ['Dolore a mandibola, tempie o davanti all’orecchio che dura', 'Valutazione gnatologica.'],
            ['Bocca che si apre meno del solito o che si blocca', 'Valutazione in tempi brevi.'],
            ['Denti consumati, risveglio con muscoli stanchi', 'Valutazione per bruxismo o serramento.'],
            ['Dolore dopo un trauma al viso', 'Visita tempestiva.'],
          ],
        },
        note: 'Un dolore al viso può avere anche altre origini. Distinguerle è compito della visita.',
      },
      {
        title: 'Bruxismo: digrignare e serrare',
        paragraphs: [
          'Il bruxismo è un’attività dei muscoli masticatori che porta a serrare o digrignare i denti, nel sonno o da svegli. Molte persone non se ne accorgono: i segnali sono l’usura dei denti, la stanchezza muscolare al risveglio o quanto riferisce chi dorme accanto.',
          'Non si “guarisce” con un dispositivo, ma se ne possono limitare gli effetti. Il bite protegge i denti e può ridurre il carico sui muscoli; di giorno aiuta soprattutto imparare a riconoscere e interrompere il serramento.',
        ],
      },
      {
        title: 'Come si svolge la visita gnatologica',
        list: [
          'Racconto dei sintomi: quando sono iniziati, che cosa li peggiora, abitudini e stress.',
          'Esame dei movimenti della mandibola e dei rumori articolari.',
          'Palpazione dei muscoli e dell’articolazione.',
          'Controllo dei denti e della chiusura.',
          'Esami strumentali solo se servono a chiarire un dubbio specifico.',
        ],
      },
      {
        title: 'Come si interviene',
        paragraphs: [
          'Le indicazioni internazionali sono concordi: iniziare con trattamenti conservativi e reversibili. Informazione, riposo funzionale, alimentazione morbida nei periodi di dolore, esercizi, eventuali farmaci per brevi periodi e, quando indicato, un bite.',
          'Vanno invece evitati come primo passo i trattamenti che modificano in modo permanente denti, chiusura o articolazione. Secondo il National Institute of Dental and Craniofacial Research la ricerca non sostiene l’idea che una chiusura non ideale o un trattamento ortodontico causino questi disturbi.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Il click peggiorerà nel tempo?',
        answer: 'Nella maggior parte delle persone resta stabile per anni senza causare problemi. Va rivalutato se compaiono dolore, blocchi o riduzione dell’apertura.',
      },
      {
        question: 'Il bite si porta per sempre?',
        answer: 'Dipende dal motivo per cui è stato indicato. Tempi e modalità d’uso vengono definiti caso per caso e verificati ai controlli.',
      },
      {
        question: 'Il mal di testa può dipendere dalla mandibola?',
        answer: 'Alcune cefalee sono associate ai disordini temporo-mandibolari, ma le cause del mal di testa sono molte. La visita serve a capire se c’è una relazione; in caso contrario si viene indirizzati allo specialista adatto.',
      },
    ],
    treatments: [
      { label: 'Gnatologia e disturbi dell’articolazione temporo-mandibolare', href: '/gnatologia-articolazione-temporo-mandibolare/' },
    ],
    treatmentPaths: ['/gnatologia-articolazione-temporo-mandibolare/'],
    related: ['gengive-che-sanguinano'],
    sources: [
      { label: 'National Institute of Dental and Craniofacial Research (NIH), TMD – Temporomandibular Disorders', url: 'https://nidcr.nih.gov/health-info/tmd' },
      MINISTERO_RACCOMANDAZIONI,
    ],
    cta: { title: 'Se il disturbo dura, una valutazione aiuta a capire da dove nasce.', href: '/richiesta/?trattamento=Disturbi%20della%20mandibola%20e%20ATM' },
  },
  {
    slug: 'trauma-dentale-cosa-fare',
    category: 'urgenze-prevenzione',
    published: true,
    updated,
    title: 'Dente rotto o caduto per un trauma: cosa fare subito',
    seoTitle: 'Dente rotto o caduto dopo un trauma: cosa fare subito',
    description:
      'Primo soccorso dopo un trauma dentale: come conservare un dente o un frammento, quando non reimpiantare e quando andare al Pronto Soccorso. Dalle linee guida del Ministero della Salute.',
    summary: 'I primi gesti dopo una caduta o un colpo, secondo le linee guida del Ministero della Salute.',
    kicker: 'Urgenze',
    lead: 'Dopo un colpo ai denti contano i primi minuti. Recupera il dente o il frammento, conservalo in un liquido (latte, soluzione fisiologica o saliva) e raggiungi un dentista o un Pronto Soccorso con servizio odontoiatrico. Se ci sono segni di trauma cranico, la priorità è il Pronto Soccorso.',
    keyPoints: [
      'Dente o frammento vanno conservati in un liquido',
      'Un dente da latte caduto non si reimpianta',
      'Con sintomi generali si va prima al Pronto Soccorso',
    ],
    form: {
      treatmentLabel: 'Tipo di percorso',
      treatmentOptions: ['Odontoiatria infantile', 'Carie e otturazioni', 'Altro'],
    },
    sections: [
      {
        title: 'Prima di tutto: è solo un problema di denti?',
        paragraphs: [
          'Le linee guida del Ministero della Salute indicano di rivolgersi subito al Pronto Soccorso se, dopo il trauma, compaiono perdita di coscienza, stato confusionale, amnesia, mal di testa, nausea o vomito, disturbi della vista, convulsioni, difficoltà a parlare o sanguinamento dall’orecchio.',
          'In questi casi il dente passa in secondo piano: portalo con te, conservato in un liquido, e segnalalo al personale sanitario.',
        ],
      },
      {
        title: 'Che cosa fare, caso per caso',
        table: {
          caption: 'Primo soccorso nel trauma dentale',
          headers: ['Che cosa è successo', 'Che cosa fare'],
          rows: [
            ['Dente permanente uscito del tutto', 'Recuperalo e conservalo in latte, soluzione fisiologica o saliva. Vai subito da un dentista o in un Pronto Soccorso con servizio odontoiatrico: il reimpianto ha tanto più successo quanto prima avviene.'],
            ['Dente da latte uscito del tutto', 'Non va reimpiantato. Fai comunque controllare il bambino.'],
            ['Dente scheggiato o rotto', 'Recupera il frammento e conservalo in un liquido: in alcuni casi può essere riattaccato.'],
            ['Dente spostato o che si muove', 'Non forzarlo. Serve una visita in tempi brevi.'],
            ['Colpo senza danni visibili', 'Fai comunque un controllo: alcune conseguenze compaiono a distanza.'],
          ],
        },
        note: 'Le linee guida indicano che un dente permanente ha buone probabilità di essere reimpiantato se resta in ambiente liquido per non più di 2–3 ore.',
      },
      {
        title: 'Che cosa evitare',
        list: [
          'Lasciare asciugare il dente o avvolgerlo in un fazzoletto.',
          'Strofinarlo o disinfettarlo.',
          'Rimandare la visita perché il dolore è passato.',
          'Reimpiantare un dente da latte.',
        ],
      },
      {
        title: 'Dopo il primo soccorso',
        paragraphs: [
          'Un dente reimpiantato viene di norma fissato temporaneamente ai denti vicini per alcune settimane. Seguono controlli programmati, perché il dente e i tessuti intorno vanno osservati nel tempo.',
          'Conserva la documentazione del trauma: può servire per la scuola, per la società sportiva o per l’assicurazione.',
        ],
      },
      {
        title: 'Come contattare lo studio',
        paragraphs: [
          'Lo studio riceve dal lunedì al venerdì, dalle 10:00 alle 19:00, nelle sedi di Modena e Reggio Emilia: in quell’orario chiama direttamente la sede più vicina oppure usa la pagina dedicata alle urgenze. Fuori orario, per un trauma con dente uscito o con sintomi generali, rivolgiti al Pronto Soccorso.',
        ],
      },
    ],
    faqs: [
      {
        question: 'In che cosa conservo il dente se non ho latte?',
        answer: 'Le linee guida indicano latte, soluzione fisiologica o saliva. L’importante è che il dente non resti asciutto.',
      },
      {
        question: 'Il dente è diventato più scuro dopo qualche settimana: è normale?',
        answer: 'Un cambiamento di colore dopo un trauma va fatto vedere: può indicare una sofferenza della polpa del dente.',
      },
      {
        question: 'Si possono prevenire i traumi nello sport?',
        answer: 'Negli sport di contatto un paradenti riduce il rischio. Può essere realizzato su misura: se ne può parlare durante una visita di controllo.',
      },
    ],
    treatments: [
      { label: 'Urgenze dentali', href: '/urgenze/' },
      { label: 'Odontoiatria per bambini', href: '/pedodonzia-odontoiatria-infantile/' },
      { label: 'Conservativa e otturazioni', href: '/conservativa-otturazioni/' },
    ],
    treatmentPaths: ['/pedodonzia-odontoiatria-infantile/', '/conservativa-otturazioni/', '/endodonzia-devitalizzazioni/'],
    related: ['prima-visita-ortodontica-bambini'],
    sources: [
      {
        label: 'Ministero della Salute, Linee guida nazionali per la prevenzione e la gestione clinica dei traumi dentali negli individui in età evolutiva (2018)',
        url: 'https://www.burlo.trieste.it/sites/default/files/Linee_guida_traumi_2018.pdf',
      },
    ],
    cta: { title: 'Dopo un trauma, un controllo serve anche quando il dolore è passato.', href: '/richiesta/' },
  },
];

/** Approfondimenti già presenti sul sito: restano ai loro URL e compaiono nell'indice. */
export const existingArticles = [
  {
    href: '/protesi-dentarie-mobili-invisibili-vantaggi-e-svantaggi/',
    category: 'impianti-protesi',
    title: 'Protesi dentarie mobili invisibili: vantaggi e svantaggi',
    summary: 'Ganci estetici, materiali flessibili e scheletrati: che cosa offrono e quali limiti hanno.',
  },
  {
    href: '/dentiera-fissa-cose-e-vantaggi/',
    category: 'impianti-protesi',
    title: 'Dentiera fissa: cos’è e vantaggi',
    summary: 'Che cosa si intende per protesi fissa su impianti e in quali situazioni viene considerata.',
  },
  {
    href: '/carie-denti-da-latte/',
    category: 'ortodonzia-bambini',
    title: 'Carie dei denti da latte',
    summary: 'Perché si formano, come riconoscerle e perché vanno curate anche se i denti cadranno.',
  },
  {
    href: '/denti-del-giudizio/',
    category: 'chirurgia-orale',
    title: 'Denti del giudizio',
    summary: 'Quando erompono, quali disturbi possono dare e quando vanno tenuti sotto controllo.',
  },
  {
    href: '/estrazione-dente-del-giudizio/',
    category: 'chirurgia-orale',
    title: 'Estrazione del dente del giudizio: quando è indicata e in cosa consiste',
    summary: 'Le situazioni in cui si valuta l’estrazione e come si svolge l’intervento.',
  },
  {
    href: '/dente-anchilosato/',
    category: 'chirurgia-orale',
    title: 'Dente anchilosato',
    summary: 'Che cosa significa quando un dente è fuso con l’osso e come si gestisce.',
  },
  {
    href: '/tumore-sulla-lingua/',
    category: 'urgenze-prevenzione',
    title: 'Tumore sulla lingua',
    summary: 'I segnali della bocca da far controllare e a chi rivolgersi.',
  },
  {
    href: '/studio-dentistico-cosa-osservare-per-scegliere-quello-giusto/',
    category: 'scelta-studio',
    title: 'Studio dentistico: cosa osservare per scegliere quello giusto',
    summary: 'Gli elementi concreti da valutare prima di affidarsi a uno studio.',
  },
];

export const guidePath = (slug) => `${guidesIndexPath}${slug}/`;

export const publishedGuides = guides.filter((guide) => guide.published);

export const publishedGuidePaths = publishedGuides.map((guide) => guidePath(guide.slug));

/** Voci dell'indice: guide nuove + approfondimenti esistenti, con lo stesso formato. */
export const guideIndexEntries = [
  ...publishedGuides.map((guide) => ({
    href: guidePath(guide.slug),
    category: guide.category,
    title: guide.title,
    summary: guide.summary,
  })),
  ...existingArticles,
];

export const guideIndexGroups = guideCategories
  .map((category) => ({
    ...category,
    entries: guideIndexEntries.filter((entry) => entry.category === category.id),
  }))
  .filter((group) => group.entries.length > 0);

const entryByHref = new Map(guideIndexEntries.map((entry) => [entry.href, entry]));

/** Risolve un riferimento (slug di una guida o URL di un approfondimento) in una voce dell'indice. */
export const resolveGuideReference = (reference) =>
  entryByHref.get(reference.startsWith('/') ? reference : guidePath(reference));

export const categoryLabel = (id) => guideCategories.find((category) => category.id === id)?.label || '';

/** Guide collegate a una pagina trattamento. */
export const guidesForTreatment = (treatmentPath) =>
  publishedGuides
    .filter((guide) => guide.treatmentPaths?.includes(treatmentPath))
    .map((guide) => ({ href: guidePath(guide.slug), title: guide.title, summary: guide.summary }));

/** Pagine tecniche o storiche: restano raggiungibili ma fuori da indice di ricerca e sitemap. */
export const nonIndexablePaths = ['/grazie/', '/new-page/'];
