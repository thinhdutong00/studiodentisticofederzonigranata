// Raccolta centralizzata di "Guide e consigli".
// L'indice /guide-e-consigli/, le pagine guida e la sitemap leggono tutti da questo file: aggiungere una voce qui aggiorna automaticamente il resto.
//
// Regole editoriali:
// - `published: false` tiene una bozza fuori da indice, route e sitemap.
// - `form.treatment` e `form.reasons` devono corrispondere alle etichette di /richiesta/
//   (verificato da tests/guides.test.mjs), altrimenti la preselezione non avviene.
// - Nessun prezzo, gratuità, autore o revisore clinico se non confermati dallo studio.

export const guidesIndexPath = '/guide-e-consigli/';

export const guideCategories = [
  { id: 'prima-della-visita', label: 'Prima della visita', description: 'Da dove cominciare, come leggere un preventivo e come scegliere lo studio.' },
  { id: 'ortodonzia-bambini', label: 'Ortodonzia e bambini', description: 'Allineatori, apparecchi e prime visite dei più piccoli.' },
  { id: 'impianti-protesi', label: 'Denti mancanti, impianti e protesi', description: 'Come si sostituisce un dente e cosa cambia tra le soluzioni.' },
  { id: 'gengive-igiene', label: 'Gengive e igiene', description: 'Pulizia professionale, sanguinamento e gengive che si ritirano.' },
  { id: 'mandibola-sonno', label: 'Mandibola, bruxismo e russamento', description: 'Dolore e rumori della mandibola, bite e dispositivi per il sonno.' },
  { id: 'estetica-sorriso', label: 'Estetica del sorriso', description: 'Forma e colore dei denti: materiali e limiti.' },
  { id: 'chirurgia-orale', label: 'Curare o estrarre un dente', description: 'Devitalizzazione, denti del giudizio, estrazioni e denti che non erompono.' },
  { id: 'urgenze-prevenzione', label: 'Urgenze e prevenzione', description: 'Cosa fare dopo un trauma e quali segnali non trascurare.' },
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
      'Contano la complessità dei movimenti e la durata prevista',
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
        note: 'Quando confronti due preventivi, verifica che comprendano le stesse voci: chiedi in particolare come vengono conteggiati rifiniture e contenzione.',
      },
      {
        title: 'Che cosa lo fa salire o scendere',
        table: {
          caption: 'Fattori che incidono sul costo di un trattamento con allineatori',
          headers: ['Fattore', 'Perché incide'],
          rows: [
            ['Complessità dei movimenti', 'Movimenti più complessi possono richiedere ulteriori allineatori o controlli.'],
            ['Una o due arcate', 'Trattare una sola arcata è possibile solo quando la chiusura dei denti lo consente.'],
            ['Cure preliminari', 'Carie, infiammazione gengivale o igiene da recuperare si affrontano prima di iniziare.'],
            ['Collaborazione', 'Gli allineatori funzionano se vengono indossati per le ore indicate: un uso discontinuo può rallentare i movimenti previsti.'],
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
          'Nello studio il preventivo viene definito dopo la visita ortodontica e lo studio del caso, e viene spiegato prima di iniziare. Puoi chiedere quali voci e controlli comprende il piano proposto.',
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
    related: ['prima-visita-ortodontica-bambini'],
    sources: [
      MINISTERO_RACCOMANDAZIONI,
      { label: 'FDA, Allineatori trasparenti: trattamento, controlli e limiti (in inglese)', url: 'https://www.fda.gov/medical-devices/dental-devices/clear-dental-aligners' },
    ],
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
    lead: 'Già intorno al primo compleanno puoi portare il bambino dal dentista per un controllo dei primi denti e per chiedere come pulirli. Il controllo ortodontico riguarda invece lo sviluppo dei denti e delle ossa mascellari: è consigliato entro i 7 anni, prima se emergono difficoltà.',
    keyPoints: [
      'Primo controllo dei denti già intorno a un anno',
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
          'La Società Italiana di Odontoiatria Infantile consiglia una prima visita già a un anno. Le raccomandazioni ministeriali del 2017 indicavano i 18–24 mesi in assenza di problemi. Se hai dubbi sui primi denti, puoi parlarne prima con il dentista. Durante il controllo si osservano denti e gengive, si parla di igiene, alimentazione e abitudini come ciuccio e biberon.',
          'La visita permette anche al bambino di conoscere l’ambiente in un momento tranquillo e ai genitori di porre domande.',
        ],
      },
      {
        title: 'La prima valutazione ortodontica',
        paragraphs: [
          'L’American Association of Orthodontists raccomanda un primo controllo ortodontico non oltre i 7 anni. Intorno a quell’età convivono denti da latte e primi denti permanenti, e si può osservare come stanno crescendo le ossa mascellari e come chiudono i denti.',
          'La valutazione può concludersi con un programma di controlli periodici. In alcune situazioni, invece, intervenire durante la crescita permette di guidare lo sviluppo; in altre conviene attendere la dentatura permanente. Decidere quando è parte della diagnosi.',
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
        answer: 'Sì, lo studio si occupa di odontoiatria infantile e di ortodonzia per bambini e adolescenti. Puoi indicare la sede preferita nella richiesta.',
      },
    ],
    treatments: [
      { label: 'Odontoiatria per bambini', href: '/pedodonzia-odontoiatria-infantile/' },
      { label: 'Ortodonzia per bambini e adolescenti', href: '/visita-ortodonzia/ortodonzia-bambini-adolescenti/' },
    ],
    related: ['/carie-denti-da-latte/', 'trauma-dentale-cosa-fare'],
    sources: [
      MINISTERO_RACCOMANDAZIONI,
      { label: 'Società Italiana di Odontoiatria Infantile, prima visita e cura dei primi denti', url: 'https://www.sioi.it/consigli-utili/' },
      { label: 'American Association of Orthodontists, primo controllo ortodontico (in inglese)', url: 'https://aaoinfo.org/whats-trending/is-there-a-benefit-to-early-treatment/' },
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
      'Chiedi quali parti e fasi sono comprese nella sostituzione del dente',
      'Osso e gengiva disponibili cambiano il percorso',
      'Due preventivi si confrontano voce per voce',
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
          'Nella sostituzione di un singolo dente, l’impianto inserito nell’osso agisce da radice artificiale. Nella configurazione più comune, un elemento di collegamento chiamato moncone sostiene la corona, la parte visibile. Quando si parla di “prezzo di un impianto” è bene chiarire se si intende solo la prima parte o il dente finito.',
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
            ['Posizione del dente', 'Nelle zone visibili del sorriso la gestione della gengiva e dell’estetica può richiedere passaggi aggiuntivi.'],
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
        answer: 'L’espressione è ambigua. Chiedi quale parte del trattamento viene descritta: un conto è l’impianto nell’osso, un altro è il modo in cui la protesi viene fissata. Un ponte su denti naturali può invece sostituire un dente senza inserire un impianto.',
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
        answer: 'Di solito si esegue in anestesia locale. Nei giorni successivi sono possibili gonfiore e fastidio, che variano da persona a persona e per i quali ricevi indicazioni precise.',
      },
    ],
    treatments: [
      { label: 'Implantologia tradizionale e computer guidata', href: '/implantologia-tradizionale-computer-guidata/' },
      { label: 'Protesi fissa e mobile', href: '/protesi-fissa-mobile/' },
    ],
    related: ['denti-mancanti-ponte-impianto-protesi', '/dentiera-fissa-cose-e-vantaggi/'],
    sources: [
      MINISTERO_RACCOMANDAZIONI,
      { label: 'FDA, Impianti dentali: componenti, indicazioni e rischi (in inglese)', url: 'https://www.fda.gov/medical-devices/dental-devices/dental-implants-what-you-should-know' },
    ],
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
            ['Denti vicini', 'Di solito vengono preparati nei ponti tradizionali con corone.', 'In genere non devono sostenere la corona su impianto.', 'Di norma non vengono preparati; possono servire ganci o attacchi.'],
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
          'Non sempre è necessario intervenire subito, ma è utile sapere che cosa può succedere nel tempo: i denti vicini possono inclinarsi verso lo spazio, il dente opposto può allungarsi, può cambiare il modo di masticare. Sono cambiamenti lenti, che possono rendere più complesso un intervento futuro.',
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
        answer: 'Chiedi che cosa indica l’espressione. Un conto è il sostegno inserito nell’osso, un altro è il modo in cui si fissa la protesi. Per sostituire il dente senza un impianto si possono valutare un ponte su denti naturali o una protesi rimovibile.',
      },
    ],
    treatments: [
      { label: 'Protesi fissa e mobile', href: '/protesi-fissa-mobile/' },
      { label: 'Implantologia tradizionale e computer guidata', href: '/implantologia-tradizionale-computer-guidata/' },
    ],
    related: ['preventivo-impianto-dentale', '/protesi-dentarie-mobili-invisibili-vantaggi-e-svantaggi/', '/dentiera-fissa-cose-e-vantaggi/'],
    sources: [
      MINISTERO_RACCOMANDAZIONI,
      { label: 'American Dental Association, Opzioni per i denti mancanti (in inglese)', url: 'https://www.mouthhealthy.org/all-topics-a-z/missing-teeth' },
    ],
    cta: { title: 'La soluzione giusta dipende da ciò che c’è in bocca oggi.', href: '/richiesta/' },
  },
  {
    slug: 'gengive-che-sanguinano',
    category: 'gengive-igiene',
    published: true,
    updated,
    title: 'Gengive che sanguinano: quando farle controllare',
    seoTitle: 'Gengive che sanguinano: cause e quando farle controllare',
    description:
      'Perché le gengive sanguinano, che differenza c’è tra gengivite e parodontite e quando è utile una visita parodontale. Guida dello studio Federzoni Granata, Modena e Reggio Emilia.',
    summary: 'Che cosa indica il sanguinamento, come si distingue una gengivite da una parodontite e come si fa la diagnosi.',
    kicker: 'Parodontologia',
    lead: 'Se le gengive sanguinano spesso quando usi spazzolino o filo, parlane con il dentista. Una causa frequente è la gengivite da placca. Per capire se sono coinvolti anche i tessuti che sostengono i denti occorre esaminare le gengive.',
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
          'Una gengivite trascurata può evolvere in parodontite, anche se non accade in tutte le persone. La parodontite può progredire con ritmi diversi e dare pochi disturbi. Anche in assenza di dolore, sanguinamento ricorrente o mobilità meritano un controllo.',
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
        answer: 'Continua a pulire delicatamente la zona. Se il sanguinamento si ripete, chiedi al dentista di controllare la gengiva e mostrarti quale strumento interdentale usare e con quale tecnica.',
      },
      {
        question: 'Il collutorio basta?',
        answer: 'Può essere un aiuto temporaneo se consigliato dal dentista, ma non sostituisce la rimozione meccanica della placca né la diagnosi.',
      },
      {
        question: 'La parodontite si può curare?',
        answer: 'Il trattamento mira a limitare la progressione della malattia. Il risultato si verifica nel tempo con la rivalutazione e i controlli di mantenimento.',
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
    related: ['preventivo-impianto-dentale'],
    sources: [
      { label: 'European Federation of Periodontology, Linea guida S3 per il trattamento della parodontite di stadio I–III (in inglese)', url: 'https://doi.org/10.1111/jcpe.13290' },
      { label: 'National Institute of Dental and Craniofacial Research, Malattie gengivali (in inglese)', url: 'https://www.nidcr.nih.gov/health-info/gum-disease' },
      MINISTERO_RACCOMANDAZIONI,
    ],
    cta: { title: 'Un controllo delle gengive chiarisce a che punto sei.', href: '/richiesta/?trattamento=Cura%20delle%20gengive' },
  },
  {
    slug: 'dolore-click-mandibola-bruxismo',
    category: 'mandibola-sonno',
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
          'Non si “guarisce” con un dispositivo, ma se ne possono limitare gli effetti. Un bite può proteggere i denti dall’usura. Il beneficio sul dolore mandibolare è meno certo. Durante il giorno può aiutare riconoscere i momenti in cui si tengono i denti serrati.',
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
        answer: 'Il solo rumore non permette di prevedere come cambierà. Un click senza dolore né limitazione del movimento di solito non richiede terapia. Va rivalutato se compaiono dolore, blocchi o riduzione dell’apertura.',
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
    related: ['gengive-che-sanguinano'],
    sources: [
      { label: 'National Institute of Dental and Craniofacial Research (NIH), TMD – Temporomandibular Disorders', url: 'https://www.nidcr.nih.gov/health-info/tmd' },
      { label: 'National Institute of Dental and Craniofacial Research, Bruxismo (in inglese)', url: 'https://www.nidcr.nih.gov/health-info/bruxism' },
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
    lead: 'Se un dente permanente è uscito per intero, cerca assistenza odontoiatrica immediata. Prendilo dalla corona, la parte bianca che spunta dalla gengiva. Se non puoi riposizionarlo subito in sicurezza, immergilo nel latte o nella soluzione fisiologica. Un dente da latte non va mai rimesso al suo posto. Se la persona perde conoscenza, ha convulsioni o respira male, chiama il 112.',
    keyPoints: [
      'Dente permanente uscito: assistenza immediata',
      'Un dente da latte caduto non si reimpianta',
      'Dopo un colpo alla testa i sintomi neurologici hanno la precedenza',
    ],
    form: {
      treatmentLabel: 'Tipo di percorso',
      notice: 'Per un trauma recente chiama subito il dentista. Usa il modulo solo per una visita programmata.',
      treatmentOptions: ['Odontoiatria infantile', 'Carie e otturazioni'],
    },
    sections: [
      {
        title: 'Prima di tutto: è solo un problema di denti?',
        paragraphs: [
          'Se dopo un colpo alla testa la persona non riprende conoscenza, fatica a restare sveglia, ha convulsioni, difficoltà a parlare o vedere, o perde sangue dall’orecchio, chiama il 112. Anche confusione, perdita di memoria, vomito o un mal di testa che peggiora richiedono una valutazione medica urgente.',
          'Dai precedenza al soccorso della persona. Se il dente è già stato recuperato, portalo in un contenitore con latte o soluzione fisiologica e segnalalo al personale sanitario.',
        ],
      },
      {
        title: 'Che cosa fare, caso per caso',
        table: {
          caption: 'Primo soccorso nel trauma dentale',
          headers: ['Che cosa è successo', 'Che cosa fare'],
          rows: [
            ['Dente permanente uscito del tutto', 'Se sei certo che sia permanente, afferralo dalla corona. Se è sporco, sciacqualo delicatamente nel latte o nella fisiologica. Se la persona è vigile e collabora e il dente rientra facilmente nella sede, riposizionalo senza forzare e fai mordere delicatamente una garza pulita. Altrimenti immergilo subito nel latte o nella fisiologica. In entrambi i casi cerca subito assistenza odontoiatrica.'],
            ['Dente da latte uscito del tutto', 'Non reinserirlo. Fai controllare il bambino. Se non sai se il dente è da latte o permanente, non tentare il reimpianto: mettilo nel latte e rivolgiti subito a un dentista.'],
            ['Dente scheggiato o rotto', 'Recupera il frammento, conservalo nel latte o nella fisiologica e contatta il dentista. In alcuni casi può essere riattaccato.'],
            ['Dente spostato o che si muove', 'Non forzarlo. Se è spostato o il morso è cambiato, contatta subito il dentista per una valutazione urgente.'],
            ['Colpo senza danni visibili', 'Fai comunque un controllo: alcune conseguenze compaiono a distanza.'],
          ],
        },
        note: 'Non aspettare per vedere come va. Conservare il dente umido serve per il trasporto. Anche se è rimasto asciutto, portalo con te e riferisci quanto tempo è trascorso.',
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
          'Se è uscito un dente permanente, chiama subito un dentista o un servizio di urgenza odontoiatrica, anche fuori orario. Non aspettare una risposta al modulo online. In caso di lesioni importanti al viso, difficoltà respiratoria o perdita di coscienza, chiama il 112.',
        ],
      },
    ],
    faqs: [
      {
        question: 'In che cosa conservo il dente se non ho latte?',
        answer: 'Se non puoi rimettere al suo posto il dente permanente, usa soluzione fisiologica oppure la saliva della persona raccolta in un contenitore pulito. Non tenere il dente nella bocca di un bambino: potrebbe inghiottirlo o inalarlo.',
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
    related: ['prima-visita-ortodontica-bambini'],
    sources: [
      {
        label: 'Ministero della Salute, Linee guida nazionali per la prevenzione e la gestione clinica dei traumi dentali negli individui in età evolutiva (2018)',
        url: 'https://www.salute.gov.it/new/it/pubblicazione/linee-guida-nazionali-la-prevenzione-e-la-gestione-clinica-dei-traumi-dentali-negli/',
      },
      { label: 'Scottish Dental Clinical Effectiveness Programme, Primo soccorso per traumi dentali (in inglese)', url: 'https://www.acutedentalproblems.sdcep.org.uk/guidance/management-of-oral-conditions/less-common-oral-conditions/injuries-to-the-mouth-face-and-jaws/' },
      { label: 'NHS, Trauma alla testa: segnali per chiedere assistenza (in inglese)', url: 'https://www.nhs.uk/conditions/head-injury-and-concussion/' },
      { label: 'Regione Emilia-Romagna, Numero unico di emergenza 112', url: 'https://salute.regione.emilia-romagna.it/assistenza-ospedaliera/emergenza' },
    ],
    cta: { title: 'Dopo un trauma, un controllo serve anche quando il dolore è passato.', href: '/richiesta/' },
  },
  {
    slug: 'sistemare-i-denti-da-dove-iniziare',
    category: 'prima-della-visita',
    published: true,
    updated,
    title: 'Vorrei sistemare i denti: da dove si comincia',
    seoTitle: 'Sistemare i denti: da dove si comincia e in che ordine',
    description:
      'Più problemi insieme e non sai da dove partire? L’ordine con cui si costruisce un piano di cura e che cosa aspettarsi dalla prima visita. Studio Federzoni Granata, Modena e Reggio Emilia.',
    summary: 'L’ordine con cui si affrontano più problemi insieme e che cosa decide la prima visita.',
    kicker: 'Prima della visita',
    lead: 'Quando i problemi sono più di uno, il punto di partenza non è il trattamento che si vede di più ma quello che rende stabili tutti gli altri. Di solito si procede così: prima ciò che fa male o è infetto, poi gengive e carie, poi denti mancanti, allineamento ed estetica.',
    keyPoints: [
      'Si parte da dolore e infezioni, poi dalle fondamenta',
      'Prima degli interventi estetici si valuta la salute di denti e gengive',
      'Un piano di cura si può affrontare per tappe',
    ],
    form: {
      treatmentLabel: 'Che cosa vorresti valutare',
      treatmentOptions: ['Igiene orale e prevenzione', 'Carie e otturazioni', 'Cura delle gengive', 'Protesi dentali', 'Implantologia', 'Ortodonzia e allineatori', 'Faccette dentali'],
    },
    sections: [
      {
        title: 'Perché serve un ordine',
        paragraphs: [
          'Molte persone rimandano la visita perché i problemi si sono accumulati: un dente che manca, altri consumati o storti, gengive che sanguinano. Davanti a un elenco così è normale non sapere che cosa chiedere.',
          'In bocca però le cure si sostengono a vicenda. Una faccetta su un dente con la gengiva infiammata, o un impianto accanto a una parodontite non trattata, hanno meno probabilità di durare. Per questo il piano di cura segue una sequenza.',
        ],
      },
      {
        title: 'L’ordine con cui di solito si procede',
        table: {
          caption: 'Sequenza tipica di un piano di cura',
          headers: ['Fase', 'Che cosa comprende', 'Perché viene in questo punto'],
          rows: [
            ['1. Urgenze', 'Dolore, infezioni, denti fratturati.', 'Il primo obiettivo è valutare il dolore e trattarne la causa.'],
            ['2. Fondamenta', 'Igiene professionale, cura delle gengive, carie.', 'Carie e infiammazione possono influire sulla scelta delle cure successive.'],
            ['3. Denti da recuperare o sostituire', 'Devitalizzazioni, ricostruzioni, corone, ponti, impianti, protesi.', 'Servono a recuperare denti e funzione masticatoria.'],
            ['4. Posizione dei denti', 'Ortodonzia, quando indicata.', 'Può cambiare lo spazio disponibile per protesi ed estetica.'],
            ['5. Estetica', 'Sbiancamento, faccette.', 'Si rifinisce quando forma e posizione sono definite.'],
          ],
        },
        note: 'È uno schema generale: l’ordine reale dipende dalla situazione e viene definito dopo la diagnosi.',
      },
      {
        title: 'Che cosa succede alla prima visita',
        paragraphs: [
          'La prima visita serve a raccogliere le informazioni: che cosa ti preoccupa, esame di denti e gengive, radiografie quando indicate. Non si decide tutto subito e non si inizia una cura senza averla spiegata.',
          'Da qui nasce un piano con priorità, alternative e tempi. Puoi leggere come è organizzata nella pagina dedicata alla prima visita.',
        ],
      },
      {
        title: 'Si può fare a tappe?',
        paragraphs: [
          'Sì, nella maggior parte dei casi. Un piano di cura distingue ciò che non conviene rimandare da ciò che può attendere. Il dentista può spiegare quali fasi si possono distanziare e quali rischi comporterebbe un rinvio.',
          'Vale anche il contrario: alcune fasi hanno senso solo insieme. Per esempio, sostituire un dente senza trattare la causa per cui è stato perso espone a ripetere il problema.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Non vado dal dentista da anni: da dove ricomincio?',
        answer: 'Da una visita di controllo. Serve proprio a fare il punto della situazione, qualunque sia. Sapere che cosa c’è permette di decidere con calma che cosa fare e quando.',
      },
      {
        question: 'Posso fare solo la parte estetica?',
        answer: 'Dipende da ciò che emerge alla visita. Se denti e gengive sono sani, sì. Se ci sono carie o infiammazione, intervenire prima su quelle protegge anche il risultato estetico.',
      },
      {
        question: 'Quanto tempo richiede un piano completo?',
        answer: 'Non c’è una durata tipica: va da poche sedute a percorsi di diversi mesi quando sono coinvolte ortodonzia o implantologia. I tempi vengono indicati insieme al piano.',
      },
    ],
    treatments: [
      { label: 'Come si svolge la prima visita', href: '/prima-visita/' },
      { label: 'Tutti i trattamenti dello studio', href: '/trattamenti/' },
      { label: 'Igiene orale e prevenzione', href: '/igiene-orale-prevenzione/' },
    ],
    related: ['preventivo-dentista-come-leggerlo', 'denti-mancanti-ponte-impianto-protesi', 'gengive-che-sanguinano'],
    sources: [
      MINISTERO_RACCOMANDAZIONI,
      {
        label: 'Ministero della Salute, Linee guida nazionali per la promozione della salute orale e la prevenzione delle patologie orali in età adulta',
        url: 'https://www.salute.gov.it/imgs/C_17_pubblicazioni_2441_allegato.pdf',
      },
    ],
    cta: { title: 'Il primo passo è sapere che cosa c’è.', href: '/richiesta/' },
  },
  {
    slug: 'preventivo-dentista-come-leggerlo',
    category: 'prima-della-visita',
    published: true,
    updated,
    title: 'Preventivo del dentista: come leggerlo e confrontarlo',
    seoTitle: 'Preventivo del dentista: come leggerlo e confrontarlo',
    description:
      'Che cosa deve contenere un preventivo odontoiatrico, perché due studi propongono cifre diverse e quali domande fare prima di accettare. Guida dello studio Federzoni Granata.',
    summary: 'Che cosa deve contenere, perché le cifre cambiano da uno studio all’altro e quali domande fare.',
    kicker: 'Prima della visita',
    lead: 'Un preventivo si capisce solo insieme al piano di cura che descrive. Due cifre diverse spesso corrispondono a due lavori diversi: per confrontarle bisogna guardare che cosa è compreso, con quali materiali e con quali controlli.',
    keyPoints: [
      'Il compenso va comunicato prima, in forma scritta o digitale',
      'Si confrontano i piani di cura, non solo i totali',
      'Chiedere le alternative fa parte della scelta',
    ],
    form: {
      treatmentLabel: 'Che cosa vorresti valutare',
      treatmentOptions: ['Implantologia', 'Protesi dentali', 'Ortodonzia e allineatori', 'Cura delle gengive', 'Carie e otturazioni', 'Faccette dentali'],
    },
    sections: [
      {
        title: 'Che cosa deve contenere',
        paragraphs: [
          'In Italia i professionisti iscritti a un ordine sono tenuti a comunicare al cliente un preventivo di massima in forma scritta o digitale, indicando le voci di costo delle singole prestazioni. Vale anche per le cure odontoiatriche.',
          'Un preventivo utile riporta:',
        ],
        list: [
          'La diagnosi o il problema a cui le cure rispondono.',
          'L’elenco delle prestazioni, dente per dente quando serve.',
          'Che cosa è compreso: esami, provvisori, controlli.',
          'I materiali e il tipo di manufatto, per protesi e restauri.',
          'I tempi previsti e le fasi.',
          'Le modalità di pagamento.',
        ],
      },
      {
        title: 'Perché due preventivi sono diversi',
        table: {
          caption: 'Motivi per cui due preventivi odontoiatrici possono differire',
          headers: ['Che cosa cambia', 'Che cosa verificare'],
          rows: [
            ['La diagnosi', 'I due studi hanno riscontrato gli stessi problemi? Chiedi su quali esami si basano.'],
            ['Il piano di cura', 'Stesso obiettivo, strade diverse: per esempio ponte o impianto.'],
            ['Le voci comprese', 'Esami, provvisori, eventuali interventi aggiuntivi e controlli sono inclusi?'],
            ['I materiali', 'Per corone, protesi e faccette esistono materiali con caratteristiche diverse.'],
            ['Il mantenimento', 'Sono previsti richiami e controlli dopo la cura?'],
          ],
        },
        note: 'Il totale più basso non descrive necessariamente lo stesso lavoro. Vale anche al contrario: una cifra più alta non è di per sé garanzia di qualità.',
      },
      {
        title: 'Le domande da fare',
        list: [
          'Che cosa succede se non faccio questa cura, o se la rimando?',
          'Quali alternative ci sono e che cosa cambia tra loro?',
          'Quali cure sono prioritarie e quali possono attendere?',
          'Il preventivo può cambiare? In quali casi?',
          'Chi eseguirà le cure e chi mi seguirà nei controlli?',
        ],
        after: [
          'Puoi annotare le risposte e chiedere di chiarire eventuali differenze tra le proposte prima di decidere.',
        ],
      },
      {
        title: 'Quando il preventivo cambia',
        paragraphs: [
          'Può accadere che durante le cure emerga qualcosa che gli esami iniziali non mostravano, per esempio una carie più estesa del previsto sotto una vecchia otturazione. In questi casi la variazione va spiegata e concordata prima di procedere.',
        ],
      },
      {
        title: 'Come funziona nello studio',
        paragraphs: [
          'Nello studio Federzoni Granata il piano di cura viene spiegato prima di iniziare, con priorità, alternative e tempi. Chiedi di chiarire le voci del preventivo e le modalità di pagamento prima di decidere.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Posso chiedere un preventivo senza fare la visita?',
        answer: 'Una cifra data senza visita è una stima generica. Per un preventivo affidabile servono l’esame clinico e, quando indicate, le radiografie.',
      },
      {
        question: 'La prima visita ha un costo?',
        answer: 'Le condizioni della prima visita ti vengono indicate dalla segreteria quando invii la richiesta o chiami lo studio.',
      },
      {
        question: 'Ho un fondo sanitario: che cosa devo fare?',
        answer: 'Comunica il nome del fondo al momento della richiesta. Lo studio può fornire la documentazione amministrativa utile per presentare la pratica al tuo ente; regole e rimborsi dipendono dal singolo piano sanitario.',
      },
    ],
    treatments: [
      { label: 'Come si svolge la prima visita', href: '/prima-visita/' },
      { label: 'Convenzioni e fondi sanitari', href: '/convenzioni/' },
      { label: 'Tutti i trattamenti dello studio', href: '/trattamenti/' },
    ],
    related: ['preventivo-impianto-dentale', 'costo-allineatori-trasparenti', 'sistemare-i-denti-da-dove-iniziare'],
    sources: [
      {
        label: 'Legge 4 agosto 2017, n. 124, art. 1, comma 150: preventivo di massima in forma scritta o digitale (Gazzetta Ufficiale)',
        url: 'https://www.gazzettaufficiale.it/eli/gu/2017/08/14/189/sg/pdf#page=26',
      },
      MINISTERO_RACCOMANDAZIONI,
    ],
    cta: { title: 'Un preventivo chiaro parte da una diagnosi chiara.', href: '/richiesta/' },
  },
  {
    slug: 'pulizia-denti-o-pulizia-profonda',
    category: 'gengive-igiene',
    published: true,
    updated,
    title: 'Pulizia dei denti e pulizia profonda delle gengive: le differenze',
    seoTitle: 'Pulizia dei denti o pulizia profonda delle gengive: differenze',
    description:
      'Che cosa comprende una seduta di igiene professionale, quando serve una pulizia sotto gengiva e ogni quanto farla. Guida dello studio Federzoni Granata, Modena e Reggio Emilia.',
    summary: 'Igiene professionale e terapia parodontale non sono la stessa seduta: che cosa cambia e quando serve l’una o l’altra.',
    kicker: 'Igiene e prevenzione',
    lead: 'La seduta di igiene rimuove depositi che è difficile eliminare a casa. Quando c’è una parodontite, può servire anche una pulizia delle superfici delle radici sotto il margine gengivale. Il dentista valuta denti, gengive e profondità delle tasche prima di indicare il trattamento.',
    keyPoints: [
      'L’igiene professionale è prevenzione',
      'La pulizia profonda è una terapia per la parodontite',
      'La frequenza dei richiami è personale',
    ],
    form: {
      treatment: 'Igiene orale e prevenzione',
      reasonLabel: 'Motivo della richiesta',
      reasons: ['Seduta di igiene orale professionale', 'Controllo preventivo di denti e gengive', 'Prevenzione e igiene per un bambino'],
    },
    sections: [
      {
        title: 'Che cosa comprende l’igiene professionale',
        paragraphs: [
          'Durante la seduta si rimuovono placca, tartaro e pigmentazioni dalle superfici dei denti, comprese le zone che spazzolino e filo non raggiungono bene. La seduta può comprendere la lucidatura e indicazioni pratiche per la pulizia quotidiana.',
          'È anche un’occasione di controllo: chi esegue la seduta osserva gengive e denti e segnala ciò che merita un approfondimento.',
        ],
      },
      {
        title: 'Che cos’è la pulizia profonda',
        paragraphs: [
          'Quando l’infiammazione ha creato tasche tra dente e gengiva, placca e tartaro si depositano anche sulla radice, dove l’igiene normale non arriva. In questo caso si esegue una strumentazione sotto gengiva: è una fase della terapia della parodontite, non una pulizia “più forte”.',
          'Può richiedere una o più sedute, anche con anestesia locale. Segue una rivalutazione per verificare come hanno risposto le gengive.',
        ],
      },
      {
        title: 'Le differenze in sintesi',
        table: {
          caption: 'Igiene professionale e strumentazione sotto gengiva a confronto',
          headers: ['', 'Igiene professionale', 'Pulizia profonda'],
          rows: [
            ['A che cosa serve', 'Prevenire carie e infiammazione gengivale.', 'Trattare la parodontite.'],
            ['Dove agisce', 'Sopra la gengiva e lungo il margine.', 'Sotto la gengiva, sulla superficie della radice.'],
            ['Per chi', 'Per chi ne ha indicazione, in base ai depositi e al rischio individuale.', 'Per chi ha tasche parodontali.'],
            ['Sedute', 'In genere una.', 'In genere più di una, con rivalutazione.'],
            ['Anestesia', 'Di norma non necessaria.', 'Può essere utilizzata.'],
          ],
        },
      },
      {
        title: 'Ogni quanto fare la pulizia',
        paragraphs: [
          'La frequenza dipende dalle condizioni delle gengive, dall’accumulo di placca e tartaro e dai fattori di rischio individuali. Un controllo e una seduta di igiene rispondono a esigenze diverse.',
          'Dopo il trattamento di una parodontite, le linee guida europee indicano richiami di mantenimento da 3 a 12 mesi, da adattare ai risultati della cura e al rischio individuale. Questo intervallo riguarda chi ha seguito una terapia parodontale.',
        ],
      },
      {
        title: 'Dopo la seduta',
        paragraphs: [
          'Per alcuni giorni i denti possono essere più sensibili al freddo e le gengive leggermente indolenzite, soprattutto dopo una pulizia profonda. Se le gengive erano gonfie, sgonfiandosi possono lasciare più visibile la base del dente: è l’effetto della riduzione dell’infiammazione.',
        ],
      },
    ],
    faqs: [
      {
        question: 'La pulizia rovina lo smalto?',
        answer: 'Lo scopo della seduta è rimuovere i depositi con strumenti adatti alle superfici da trattare. Può comparire sensibilità temporanea, soprattutto sulle radici esposte. Se il fastidio persiste, riferiscilo al dentista.',
      },
      {
        question: 'Perché le gengive sanguinano durante la pulizia?',
        answer: 'Sanguinano dove sono infiammate. È un’informazione utile: indica le zone in cui la pulizia quotidiana va migliorata o in cui serve un controllo più approfondito.',
      },
      {
        question: 'Posso chiedere direttamente una pulizia profonda?',
        answer: 'Puoi chiedere se è indicata nel tuo caso. Profondità delle tasche, infiammazione e condizioni dei tessuti di sostegno aiutano il dentista a decidere dove intervenire.',
      },
      {
        question: 'La pulizia sbianca i denti?',
        answer: 'Rimuove le pigmentazioni superficiali, quindi i denti possono apparire più chiari. Il colore naturale del dente non cambia: per quello esiste lo sbiancamento.',
      },
    ],
    treatments: [
      { label: 'Igiene orale e prevenzione', href: '/igiene-orale-prevenzione/' },
      { label: 'Parodontologia e cure gengivali', href: '/parodontologia-cure-gengivali/' },
      { label: 'Sbiancamento dentale', href: '/sbiancamento/' },
    ],
    related: ['gengive-che-sanguinano', 'sistemare-i-denti-da-dove-iniziare'],
    sources: [
      { label: 'European Federation of Periodontology, Linea guida S3 per il trattamento della parodontite di stadio I–III (in inglese)', url: 'https://doi.org/10.1111/jcpe.13290' },
      { label: 'European Federation of Periodontology, Richiami dopo la terapia parodontale (in inglese)', url: 'https://www.efp.org/fileadmin/uploads/efp/Photos/Continuing_Education/GUIDELINE_STEP04_071022-2.pdf' },
      MINISTERO_RACCOMANDAZIONI,
    ],
    cta: { title: 'Una seduta di igiene è anche un controllo delle gengive.', href: '/richiesta/?trattamento=Igiene%20orale%20e%20prevenzione' },
  },
  {
    slug: 'faccette-composito-o-ceramica',
    category: 'estetica-sorriso',
    published: true,
    updated,
    title: 'Faccette in composito o in ceramica: che cosa cambia',
    seoTitle: 'Faccette in composito o in ceramica: differenze e limiti',
    description:
      'Differenze tra faccette in composito e in ceramica: come si realizzano, manutenzione, limiti e casi in cui conviene un’altra soluzione. Guida dello studio Federzoni Granata.',
    summary: 'Come si realizzano, che manutenzione richiedono e quando una faccetta non è la soluzione adatta.',
    kicker: 'Estetica del sorriso',
    lead: 'Le faccette in composito si modellano direttamente sul dente, di solito in una seduta. Quelle in ceramica vengono realizzate in laboratorio e applicate in un secondo momento. La scelta dipende da che cosa si vuole correggere, da quanto smalto è presente e da come chiudono i denti.',
    keyPoints: [
      'Composito: tecnica diretta, modificabile e riparabile',
      'Ceramica: lavorazione in laboratorio, colore più stabile',
      'Non sempre una faccetta è la soluzione indicata',
    ],
    form: {
      treatment: 'Faccette dentali',
      reasonLabel: 'Tipo di percorso',
      reasons: ['Faccette in composito', 'Faccette in ceramica'],
    },
    sections: [
      {
        title: 'Che cosa correggono',
        paragraphs: [
          'Una faccetta è un sottile rivestimento della superficie visibile del dente. Si usa per modificare forma, proporzioni e colore: denti scheggiati o consumati, spazi tra i denti, discromie che non rispondono allo sbiancamento.',
          'Non sposta i denti e non cura carie o gengive: questi aspetti vanno valutati e, se serve, trattati prima.',
        ],
      },
      {
        title: 'Composito e ceramica a confronto',
        table: {
          caption: 'Confronto tra faccette in composito e faccette in ceramica',
          headers: ['', 'Composito', 'Ceramica'],
          rows: [
            ['Come si realizza', 'Modellata direttamente sul dente.', 'Costruita in laboratorio su impronta e poi applicata.'],
            ['Sedute', 'In genere una.', 'In genere più di una, con una fase di prova.'],
            ['Preparazione del dente', 'Spesso minima o assente; dipende dal caso.', 'Dipende dal caso: può essere minima o richiedere una riduzione dello smalto.'],
            ['Colore nel tempo', 'Può pigmentarsi e perdere lucentezza; si può rilucidare.', 'Più stabile.'],
            ['Se si scheggia', 'In genere riparabile in studio.', 'Spesso va sostituita.'],
            ['Modifiche successive', 'Si può ritoccare.', 'I ritocchi sono limitati. Per cambiare forma o colore può essere necessario sostituirla.'],
          ],
        },
        note: 'Sono caratteristiche generali dei due materiali. Quale sia indicato nel tuo caso si stabilisce dopo l’esame dei denti.',
      },
      {
        title: 'Quando una faccetta non è la scelta adatta',
        list: [
          'Se il problema è solo il colore: lo sbiancamento può bastare.',
          'Se i denti sono molto disallineati: l’ortodonzia evita di preparare denti sani per compensare la posizione.',
          'Se è presente bruxismo: va riconosciuto e gestito, perché aumenta il rischio di fratture.',
          'Se lo smalto è scarso o il dente ha grandi ricostruzioni: può essere indicata una soluzione diversa.',
          'Se ci sono carie o infiammazione gengivale: si curano prima.',
        ],
      },
      {
        title: 'Come si arriva alla decisione',
        paragraphs: [
          'Il percorso parte dall’analisi del sorriso: fotografie, forma e colore dei denti, gengive, masticazione. Quando è utile, il risultato viene simulato prima di intervenire, così si può valutare l’effetto e correggere il progetto.',
          'Solo a questo punto si sceglie il materiale. In alcuni casi le due soluzioni convivono nello stesso sorriso.',
        ],
      },
      {
        title: 'Manutenzione',
        paragraphs: [
          'Le faccette richiedono la stessa igiene dei denti naturali e controlli periodici. Vanno evitate abitudini come mordere oggetti duri o le unghie. La durata non può essere garantita: dipende dal materiale, dalla masticazione e dalla cura quotidiana.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Le faccette rovinano i denti?',
        answer: 'Dipende da quanto dente è necessario preparare, e questo varia da caso a caso. Lo smalto rimosso non ricresce. Chiedi quanto sarebbe necessario asportarne e quali alternative permetterebbero di conservarlo.',
      },
      {
        question: 'Il risultato sembrerà finto?',
        answer: 'Il progetto parte dal viso e dal colore dei denti vicini. L’obiettivo è un risultato coerente con la persona, non denti tutti uguali.',
      },
      {
        question: 'Si possono sbiancare le faccette?',
        answer: 'No. I materiali da restauro non cambiano colore con lo sbiancamento. Se desideri denti più chiari, lo sbiancamento si programma prima.',
      },
      {
        question: 'Quale costa meno?',
        answer: 'Il costo dipende dal numero di denti, dal materiale e dalle fasi necessarie. Conviene confrontare le due soluzioni anche per manutenzione e interventi futuri: le cifre vengono indicate dopo la valutazione.',
      },
    ],
    treatments: [
      { label: 'Faccette in composito', href: '/estetica-diretta-faccette-composito/' },
      { label: 'Faccette in ceramica', href: '/estetica-indiretta-faccette-porcellana/' },
      { label: 'Sbiancamento dentale', href: '/sbiancamento/' },
    ],
    related: ['costo-allineatori-trasparenti', 'sistemare-i-denti-da-dove-iniziare'],
    sources: [
      MINISTERO_RACCOMANDAZIONI,
      { label: 'American Dental Association, Faccette in ceramica e in composito (in inglese)', url: 'https://www.mouthhealthy.org/all-topics-a-z/veneers' },
    ],
    cta: { title: 'Il materiale si sceglie dopo aver guardato il sorriso.', href: '/richiesta/?trattamento=Faccette%20dentali' },
  },
  {
    slug: 'devitalizzare-o-togliere-il-dente',
    category: 'chirurgia-orale',
    published: true,
    updated,
    title: 'Devitalizzare o togliere il dente: come si decide',
    seoTitle: 'Devitalizzare o togliere un dente: come si decide',
    description:
      'Quando un dente si può salvare con la devitalizzazione e quando si valuta l’estrazione, che cosa aspettarsi dalla cura e perché un dente devitalizzato può fare male. Studio Federzoni Granata.',
    summary: 'Quando un dente si può salvare, che cosa comporta la cura e perché un dente già devitalizzato può dare fastidio.',
    kicker: 'Endodonzia',
    lead: 'Quando la polpa è compromessa, una cura canalare può permettere di conservare il dente. Prima di scegliere tra cura ed estrazione, il dentista valuta la polpa, le radici, il sostegno osseo e se resta abbastanza struttura per ricostruirlo. L’intensità del dolore da sola non risponde a queste domande.',
    keyPoints: [
      'Conservare il dente è la prima strada da valutare',
      'Conta quanto dente sano rimane, non quanto fa male',
      'Dopo la cura il dente va ricostruito e controllato',
    ],
    form: {
      treatment: 'Devitalizzazione',
      reasonLabel: 'Motivo della richiesta',
      reasons: ['Dolore o sensibilità persistente', 'Devitalizzazione già consigliata', 'Controllo di un dente già devitalizzato'],
    },
    sections: [
      {
        title: 'Che cos’è la devitalizzazione',
        paragraphs: [
          'All’interno del dente c’è la polpa, un tessuto con nervi e vasi. Quando una carie profonda, una frattura o un trauma la infiammano o la infettano in modo irreversibile, la cura canalare la rimuove, pulisce e sigilla i canali delle radici. Dopo la cura, una ricostruzione adeguata aiuta a recuperare la funzione del dente.',
          'La cura si esegue in anestesia locale. Nei giorni successivi il dente può essere indolenzito alla masticazione: è un fastidio che di solito si riduce da solo e per il quale ricevi indicazioni.',
        ],
      },
      {
        title: 'Quando si cerca di salvare il dente e quando no',
        table: {
          caption: 'Elementi che orientano tra cura canalare ed estrazione',
          headers: ['Che cosa si valuta', 'A favore della cura', 'A favore dell’estrazione'],
          rows: [
            ['Struttura rimasta', 'Sufficiente per una ricostruzione stabile.', 'Dente molto distrutto o fratturato sotto la gengiva.'],
            ['Radici', 'Integre e trattabili.', 'Frattura verticale che rende il dente non recuperabile.'],
            ['Sostegno', 'Osso e gengive in buone condizioni.', 'Perdita di sostegno avanzata.'],
            ['Ruolo del dente', 'Utile alla masticazione o al sostegno di altri restauri.', 'Dente che non potrà essere utilizzato.'],
          ],
        },
        note: 'Sono criteri generali. Nel singolo caso pesano insieme e vanno verificati con visita e radiografie.',
      },
      {
        title: 'Che cosa succede dopo',
        paragraphs: [
          'Un dente devitalizzato ha spesso perso molta sostanza per la carie e per l’accesso ai canali. Per questo la cura non finisce con la chiusura dei canali: serve una ricostruzione adeguata, che in alcuni casi ricopre il dente per proteggerlo.',
          'Se invece il dente viene estratto, è utile decidere subito se e come sostituirlo. Le alternative sono descritte nella guida sui denti mancanti.',
        ],
      },
      {
        title: 'Un dente già devitalizzato che fa male',
        paragraphs: [
          'Può accadere, anche a distanza di anni. Le cause possibili sono diverse: un’infezione che si è ripresentata, una ricostruzione che non sigilla più, una frattura, oppure un problema della gengiva o del dente vicino.',
          'Se il dolore ritorna o compare gonfiore, contatta il dentista. Visita e radiografia aiutano a capire se è possibile un nuovo trattamento. Se il gonfiore rende difficile respirare o deglutire, chiama il 112.',
        ],
      },
    ],
    faqs: [
      {
        question: 'La devitalizzazione fa male?',
        answer: 'Viene eseguita in anestesia locale. Dopo la seduta è possibile un indolenzimento per alcuni giorni, variabile da persona a persona.',
      },
      {
        question: 'Quante sedute servono?',
        answer: 'Dipende dal dente, dal numero di canali e dalla presenza di infezione. Il numero di sedute ti viene indicato dopo la valutazione.',
      },
      {
        question: 'Se non fa più male posso evitare la cura?',
        answer: 'La scomparsa del dolore non significa guarigione: può indicare che la polpa non è più vitale, mentre l’infezione prosegue. Va verificato con il dentista.',
      },
      {
        question: 'Un dente devitalizzato può scurirsi?',
        answer: 'Può succedere. Se il cambiamento di colore è un problema estetico, esistono soluzioni da valutare caso per caso.',
      },
    ],
    treatments: [
      { label: 'Endodonzia e devitalizzazioni', href: '/endodonzia-devitalizzazioni/' },
      { label: 'Conservativa e otturazioni', href: '/conservativa-otturazioni/' },
      { label: 'Chirurgia orale', href: '/chirurgia-stomatologica/' },
    ],
    related: ['denti-mancanti-ponte-impianto-protesi', 'trauma-dentale-cosa-fare'],
    sources: [
      MINISTERO_RACCOMANDAZIONI,
      { label: 'American Association of Endodontists, Dopo la cura canalare (in inglese)', url: 'https://www.aae.org/patients/your-office-visit/post-treatment-care/' },
      { label: 'NHS, Ascesso dentale e segnali di urgenza (in inglese)', url: 'https://www.nhs.uk/conditions/dental-abscess/' },
    ],
    cta: { title: 'Prima di decidere serve sapere quanto dente si può conservare.', href: '/richiesta/?trattamento=Devitalizzazione' },
  },
  {
    slug: 'gengive-ritirate-cause-cosa-fare',
    category: 'gengive-igiene',
    published: true,
    updated,
    title: 'Gengive ritirate: cause e che cosa si può fare',
    seoTitle: 'Gengive ritirate: cause e cosa si può fare',
    description:
      'Perché le gengive si ritirano, se possono ricrescere e quando serve una visita parodontale. Guida dello studio Federzoni Granata, Modena e Reggio Emilia.',
    summary: 'Perché succede, se la gengiva può tornare com’era e che cosa si può fare se la recessione avanza.',
    kicker: 'Parodontologia',
    lead: 'Quando il margine della gengiva si ritira, una parte della radice può restare scoperta. Spazzolamento energico, malattia parodontale e caratteristiche dei tessuti possono contribuire, anche insieme. Alla visita si valuta la causa e si misura la recessione per seguirla nel tempo.',
    keyPoints: [
      'La recessione non regredisce spontaneamente',
      'Più fattori possono contribuire alla recessione',
      'La scelta della cura dipende dalla causa',
    ],
    form: {
      treatment: 'Cura delle gengive',
      reasonLabel: 'Motivo della richiesta',
      reasons: ['Recessione gengivale o denti che si muovono', 'Gengive che sanguinano o sono infiammate', 'Mantenimento dopo una terapia parodontale'],
    },
    sections: [
      {
        title: 'Come si riconosce',
        paragraphs: [
          'Il dente sembra più lungo, vicino alla gengiva compare una zona più gialla e può aumentare la sensibilità al freddo. A volte si nota uno scalino al passaggio dell’unghia. Può riguardare un solo dente o più denti.',
        ],
      },
      {
        title: 'Perché le gengive si ritirano',
        table: {
          caption: 'Cause più frequenti di recessione gengivale',
          headers: ['Causa', 'Come si presenta di solito'],
          rows: [
            ['Spazzolamento traumatico', 'Gengiva sana e non infiammata, recessione sul lato esterno dei denti, spesso con setole dure o movimenti orizzontali energici.'],
            ['Parodontite', 'Infiammazione, sanguinamento, perdita di osso; la recessione interessa spesso anche gli spazi tra i denti.'],
            ['Gengiva sottile o denti fuori dall’arcata', 'Predispone alla recessione, soprattutto se si aggiungono altri fattori.'],
            ['Piercing, protesi o restauri che irritano il margine', 'Recessione localizzata vicino alla causa.'],
          ],
        },
        note: 'Più fattori possono sommarsi. Per questo l’origine si stabilisce con l’esame delle gengive.',
      },
      {
        title: 'Possono ricrescere?',
        paragraphs: [
          'No, il tessuto perso non si riforma da solo e nessun dentifricio o collutorio lo fa ricrescere. Correggere i fattori che la favoriscono può aiutare a limitare la progressione.',
          'In alcune situazioni esistono interventi di chirurgia gengivale che possono ricoprire in tutto o in parte la radice esposta. Non sono indicati in tutti i casi: la possibilità si valuta durante la visita parodontale.',
        ],
      },
      {
        title: 'Che cosa si fa',
        list: [
          'Si misura la recessione e si controlla se è presente una parodontite.',
          'Si corregge la tecnica di spazzolamento, con setole e strumenti adatti.',
          'Si tratta l’infiammazione, quando c’è.',
          'Si gestisce la sensibilità con prodotti o trattamenti specifici.',
          'Si tiene sotto controllo nel tempo, confrontando le misure.',
        ],
      },
      {
        title: 'Quando farsi vedere',
        paragraphs: [
          'Conviene una valutazione quando la recessione aumenta, quando compaiono sanguinamento o sensibilità, oppure quando un dente sembra spostarsi. Misurare oggi permette di sapere, al controllo successivo, se la situazione è stabile.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Devo spazzolare meno?',
        answer: 'No: va cambiato il modo, non la frequenza. Una tecnica delicata e uno spazzolino adatto puliscono senza traumatizzare la gengiva.',
      },
      {
        question: 'La sensibilità passerà?',
        answer: 'Spesso si riduce con prodotti desensibilizzanti e correggendo le abitudini. Se persiste, esistono trattamenti da eseguire in studio.',
      },
      {
        question: 'Rischio di perdere il dente?',
        answer: 'La sola parte di radice visibile non permette di stabilirlo. Con la visita si controllano il sostegno del dente e l’eventuale presenza di parodontite, che può richiedere una cura specifica.',
      },
    ],
    treatments: [
      { label: 'Parodontologia e cure gengivali', href: '/parodontologia-cure-gengivali/' },
      { label: 'Igiene orale e prevenzione', href: '/igiene-orale-prevenzione/' },
    ],
    related: ['gengive-che-sanguinano', 'pulizia-denti-o-pulizia-profonda'],
    sources: [
      { label: 'European Federation of Periodontology, Linea guida S3 per il trattamento della parodontite di stadio I–III (in inglese)', url: 'https://doi.org/10.1111/jcpe.13290' },
      { label: 'Cambridge University Hospitals, Recessione gengivale e indicazioni all’innesto (in inglese)', url: 'https://www.cuh.nhs.uk/patient-information/gum-grafting-procedure/' },
      MINISTERO_RACCOMANDAZIONI,
    ],
    cta: { title: 'Una visita permette di misurare la recessione e chiarirne le possibili cause.', href: '/richiesta/?trattamento=Cura%20delle%20gengive' },
  },
  {
    slug: 'bite-a-cosa-serve',
    category: 'mandibola-sonno',
    published: true,
    updated,
    title: 'Bite: a che cosa serve e quando è indicato',
    seoTitle: 'Bite per i denti: a cosa serve e quando è indicato',
    description:
      'A che cosa serve il bite, che differenza c’è tra quello su misura e quelli pronti all’uso e che cosa non può fare. Guida dello studio Federzoni Granata, Modena e Reggio Emilia.',
    summary: 'Che cosa fa un bite, che cosa non fa e perché quello su misura va controllato nel tempo.',
    kicker: 'Gnatologia',
    lead: 'Il bite è una placca rimovibile che si porta sui denti, di solito di notte. Può proteggere i denti dall’usura da bruxismo. Il beneficio sul dolore mandibolare è meno certo. Non elimina la causa del serramento e va usato su indicazione, perché un dispositivo non adatto può peggiorare i disturbi.',
    keyPoints: [
      'Protegge i denti, non “cura” il bruxismo',
      'Su misura significa regolato e controllato',
      'Se aumenta il dolore va sospeso e fatto vedere',
    ],
    form: {
      treatment: 'Disturbi della mandibola e ATM',
      reasonLabel: 'Motivo della richiesta',
      reasons: ['Bruxismo, serramento o usura dei denti', 'Dolore, rumori o blocchi della mandibola', 'Valutazione del morso e della funzione'],
    },
    sections: [
      {
        title: 'A che cosa serve',
        list: [
          'Proteggere smalto e restauri quando si digrigna o si serra.',
          'Tenere separate le superfici dei denti mentre si stringe o si digrigna.',
          'Fare parte di un trattamento conservativo e reversibile dei disturbi della mandibola.',
        ],
        after: [
          'Non tutte le persone che serrano i denti hanno bisogno di un bite, e non tutti i dolori della mandibola migliorano con un bite. L’indicazione nasce dalla visita.',
        ],
      },
      {
        title: 'Su misura o pronto all’uso',
        table: {
          caption: 'Differenze tra bite su misura e dispositivi pronti all’uso',
          headers: ['', 'Su misura', 'Pronto all’uso'],
          rows: [
            ['Come si ottiene', 'Realizzato sull’impronta dei denti.', 'Acquistato già fatto, talvolta adattabile a caldo.'],
            ['Contatti tra i denti', 'Regolati alla consegna e ai controlli.', 'Non regolabili con precisione.'],
            ['Stabilità', 'La stabilità viene verificata alla consegna.', 'Può muoversi o risultare ingombrante.'],
            ['Controllo nel tempo', 'Si programma con il dentista.', 'L’acquisto non include un controllo clinico.'],
          ],
        },
        note: 'Un dispositivo che non appoggia in modo equilibrato può aumentare il fastidio o, se usato a lungo, modificare il modo in cui i denti chiudono.',
      },
      {
        title: 'Come si arriva al bite',
        paragraphs: [
          'La visita valuta denti, muscoli, articolazione e chiusura. Se il bite è indicato, si rileva l’impronta e il dispositivo viene consegnato dopo averne controllato l’appoggio. Seguono visite di verifica, per controllare l’usura, i contatti e gli eventuali disturbi.',
        ],
      },
      {
        title: 'Che cosa aspettarsi',
        paragraphs: [
          'I primi giorni è normale percepire un ingombro e una salivazione maggiore. Se invece il dispositivo provoca o aumenta il dolore, va sospeso e bisogna rivolgersi a chi lo ha prescritto.',
          'Se noti usura, crepe o cambiamenti nel modo in cui il bite si appoggia ai denti, portalo al controllo. Quanto a lungo portarlo dipende dal motivo per cui è stato indicato.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Il bite fa smettere di digrignare?',
        answer: 'Non necessariamente. Lo scopo principale è proteggere i denti. Sul serramento diurno aiuta soprattutto imparare a riconoscerlo e a rilassare la mandibola.',
      },
      {
        question: 'Si porta sopra o sotto?',
        answer: 'Dipende dal caso e dalla dentatura. La scelta dell’arcata fa parte del progetto del dispositivo.',
      },
      {
        question: 'Posso usare il bite sportivo per dormire?',
        answer: 'No: il paradenti sportivo protegge dai colpi, ha uno spessore e una funzione diversi e non è pensato per l’uso notturno.',
      },
    ],
    treatments: [
      { label: 'Gnatologia e disturbi dell’articolazione temporo-mandibolare', href: '/gnatologia-articolazione-temporo-mandibolare/' },
    ],
    related: ['dolore-click-mandibola-bruxismo', 'apparecchio-per-non-russare'],
    sources: [
      { label: 'National Institute of Dental and Craniofacial Research (NIH), TMD – Temporomandibular Disorders', url: 'https://www.nidcr.nih.gov/health-info/tmd' },
      { label: 'National Institute of Dental and Craniofacial Research, Bruxismo (in inglese)', url: 'https://www.nidcr.nih.gov/health-info/bruxism' },
      MINISTERO_RACCOMANDAZIONI,
    ],
    cta: { title: 'Un bite è utile quando risponde a un’indicazione precisa.', href: '/richiesta/?trattamento=Disturbi%20della%20mandibola%20e%20ATM' },
  },
  {
    slug: 'apparecchio-per-non-russare',
    category: 'mandibola-sonno',
    published: true,
    updated,
    title: 'Apparecchio per non russare: quando può aiutare',
    seoTitle: 'Apparecchio dentale per non russare: quando può aiutare',
    description:
      'Come funziona il dispositivo orale per russamento e apnee notturne, per chi può essere indicato e perché serve prima una valutazione medica del sonno. Studio Federzoni Granata.',
    summary: 'Come funziona il dispositivo orale, per chi può essere indicato e che ruolo ha il medico del sonno.',
    kicker: 'Russamento e apnee notturne',
    lead: 'Negli adulti, un dispositivo di avanzamento mandibolare tiene la mandibola leggermente in avanti durante il sonno per favorire il passaggio dell’aria. Può essere indicato per il russamento e, su indicazione medica, per alcune forme di apnea ostruttiva. Prima va chiarito se dietro il russamento ci sono apnee: è una diagnosi che spetta al medico.',
    keyPoints: [
      'Si porta solo di notte ed è rimovibile',
      'Le apnee vanno diagnosticate dal medico del sonno',
      'Serve una bocca in salute e controlli nel tempo',
    ],
    form: {
      treatment: 'Russamento e apnee notturne',
      reasonLabel: 'Motivo della richiesta',
      reasons: ['Russamento abituale da valutare', 'Apnea notturna già diagnosticata', 'Valutazione per un dispositivo intraorale'],
    },
    sections: [
      {
        title: 'Russamento e apnee non sono la stessa cosa',
        paragraphs: [
          'Il russamento è il rumore prodotto dai tessuti della gola che vibrano. Nella sindrome delle apnee ostruttive il passaggio dell’aria si interrompe o si riduce più volte durante la notte. Chi ne soffre può avere sonnolenza di giorno, risvegli con sensazione di soffocamento, mal di testa al mattino.',
          'Dal solo rumore non si distinguono le due condizioni. Se chi dorme accanto nota pause del respiro, o se di giorno c’è sonnolenza, il primo passo è parlarne con il proprio medico per una valutazione del sonno.',
        ],
      },
      {
        title: 'Come funziona il dispositivo',
        paragraphs: [
          'In genere è formato da due placche su misura, una per arcata, collegate in modo da mantenere la mandibola in posizione avanzata. L’avanzamento viene adattato gradualmente.',
          'Il Ministero della Salute ha pubblicato linee guida nazionali sulla gestione odontoiatrica della sindrome delle apnee ostruttive nel sonno.',
        ],
      },
      {
        title: 'Per chi può essere indicato',
        table: {
          caption: 'Situazioni e percorso consigliato',
          headers: ['Situazione', 'Percorso'],
          rows: [
            ['Russamento senza apnee, già valutato dal medico', 'Valutazione odontoiatrica per il dispositivo.'],
            ['Apnea ostruttiva diagnosticata', 'Il dispositivo si considera su indicazione del medico del sonno, in base alla gravità e alle alternative.'],
            ['Russamento mai valutato, con pause del respiro o sonnolenza', 'Prima la valutazione medica.'],
          ],
        },
      },
      {
        title: 'Che cosa valuta il dentista',
        list: [
          'Numero e condizioni dei denti, che devono sostenere il dispositivo.',
          'Salute delle gengive.',
          'Articolazione della mandibola e muscoli.',
          'Ampiezza dei movimenti di avanzamento.',
        ],
        after: [
          'Non tutte le bocche sono adatte: denti insufficienti, parodontite non trattata o disturbi dell’articolazione possono richiedere prima altre cure o controindicare il dispositivo.',
        ],
      },
      {
        title: 'Effetti e controlli',
        paragraphs: [
          'Nei primi tempi sono possibili aumento della salivazione, indolenzimento dei denti o dei muscoli al risveglio e una sensazione temporanea di chiusura diversa. Con l’uso prolungato possono comparire piccoli cambiamenti nella posizione dei denti: per questo sono previsti controlli periodici.',
          'Il medico del sonno verifica l’efficacia sulle apnee con un esame del sonno di controllo. Un russamento meno udibile non basta a stabilire che le apnee siano risolte.',
        ],
      },
    ],
    faqs: [
      {
        question: 'I dispositivi pronti all’uso sono equivalenti?',
        answer: 'Non sono costruiti sulla tua bocca e non vengono regolati né controllati. Soprattutto, usarli senza una valutazione può ritardare la diagnosi di apnee.',
      },
      {
        question: 'Sostituisce la CPAP?',
        answer: 'Negli adulti con apnee diagnosticate che non tollerano la CPAP o desiderano valutare un’alternativa, il medico del sonno può considerare un dispositivo su misura. Se stai usando la CPAP, parlane con il medico prima di cambiare terapia.',
      },
      {
        question: 'Lo studio fa la diagnosi delle apnee?',
        answer: 'No. La diagnosi è medica. Lo studio valuta se la bocca è adatta al dispositivo e ne segue l’adattamento, a partire dalla valutazione del medico.',
      },
    ],
    treatments: [
      { label: 'Dispositivi per russamento e apnee notturne', href: '/dispositivi-russamento-apnee-notturne/' },
      { label: 'Gnatologia e disturbi dell’articolazione temporo-mandibolare', href: '/gnatologia-articolazione-temporo-mandibolare/' },
    ],
    related: ['bite-a-cosa-serve', 'dolore-click-mandibola-bruxismo'],
    sources: [
      {
        label: 'Ministero della Salute, Linee guida per il trattamento odontoiatrico delle apnee ostruttive nel sonno negli adulti (2014)',
        url: 'https://www.salute.gov.it/new/sites/default/files/imported/C_17_pubblicazioni_2307_allegato.pdf',
      },
      { label: 'AASM e AADSM, Linea guida sui dispositivi orali per russamento e apnee negli adulti (in inglese)', url: 'https://doi.org/10.5664/jcsm.4858' },
    ],
    cta: { title: 'Capire se il dispositivo è adatto richiede una valutazione della bocca.', href: '/richiesta/?trattamento=Russamento%20e%20apnee%20notturne' },
  },
  {
    slug: 'ascesso-dentale-quando-chiedere-aiuto',
    category: 'urgenze-prevenzione',
    published: true,
    updated,
    title: 'Sospetto ascesso dentale: a chi rivolgersi',
    seoTitle: 'Ascesso dentale e gonfiore: quando chiedere aiuto',
    description: 'Come descrivere dolore e gonfiore, quando contattare urgentemente il dentista e quali segnali richiedono soccorso immediato.',
    summary: 'I segnali per distinguere una chiamata urgente al dentista da un’emergenza sanitaria.',
    kicker: 'Urgenze dentali',
    lead: 'Se sospetti un ascesso, chiama subito un dentista per una valutazione urgente. Se fai fatica a respirare, deglutire o parlare, chiama il 112 senza aspettare una risposta al modulo online.',
    keyPoints: [
      'Riferisci subito se il gonfiore aumenta o se compare febbre',
      'Un gonfiore esteso in bocca o che coinvolge l’occhio richiede soccorso immediato',
      'Per curare l’infezione occorre individuarne la causa',
    ],
    form: {
      notice: 'Per un sospetto ascesso chiama subito un dentista. Se fai fatica a respirare o deglutire, chiama il 112.',
      treatmentLabel: 'Percorso per una visita programmata',
      treatmentOptions: ['Carie e otturazioni', 'Cura delle gengive'],
    },
    sections: [
      {
        title: 'Gonfiore vicino a un dente: che cosa osservare',
        paragraphs: [
          'Un ascesso è una raccolta di pus dovuta a un’infezione. Può interessare la zona di un dente o la gengiva. Fra i possibili segnali ci sono dolore, gonfiore, cattivo sapore in bocca e febbre. Sintomi simili possono avere anche altre cause.',
          'Quando chiami, indica dove è iniziato il gonfiore, da quanto tempo c’è e se interessa anche la guancia. Spiega se riesci ad aprire la bocca, a deglutire e a respirare normalmente. Queste informazioni aiutano chi ti risponde a indirizzarti al servizio adatto.',
        ],
      },
      {
        title: 'Quando serve il pronto soccorso',
        paragraphs: [
          'Chiama il 112 se hai difficoltà a respirare, deglutire o parlare. Serve una valutazione immediata anche in presenza di gonfiore importante in bocca, difficoltà marcata ad aprirla, occhio gonfio o dolente oppure disturbi improvvisi della vista.',
          'In assenza di questi segnali, un sospetto ascesso richiede comunque cure odontoiatriche urgenti. Se il tuo dentista è chiuso, cerca un servizio odontoiatrico d’urgenza. Una richiesta online lascia un recapito e comporta un’attesa.',
        ],
      },
      {
        title: 'Che cosa può fare il dentista',
        paragraphs: [
          'Il dentista cerca l’origine dell’infezione nel dente o nei tessuti circostanti. Secondo i riscontri può essere necessario far defluire il pus, trattare i canali del dente o valutare l’estrazione. Un eventuale antibiotico viene prescritto quando indicato e non sostituisce il trattamento della causa.',
        ],
      },
    ],
    faqs: [
      { question: 'Se il dolore si attenua, posso saltare la visita?', answer: 'Se sospetti un ascesso, mantieni il contatto urgente con il dentista. Il solo andamento del dolore non permette di stabilire se l’infezione si è risolta.' },
      { question: 'Un gonfiore indica sempre un ascesso?', answer: 'Il gonfiore è un segno, non una diagnosi. La visita serve a distinguerne l’origine e a individuare la cura appropriata.' },
      { question: 'È sufficiente usare il modulo di richiesta?', answer: 'Per un sospetto ascesso è preferibile chiamare subito un servizio odontoiatrico. In caso di difficoltà respiratoria o a deglutire chiama il 112. Usa il modulo per organizzare visite programmate.' },
    ],
    treatments: [
      { label: 'Urgenze dentali', href: '/urgenze/' },
      { label: 'Endodonzia e devitalizzazioni', href: '/endodonzia-devitalizzazioni/' },
    ],
    related: ['devitalizzare-o-togliere-il-dente', 'trauma-dentale-cosa-fare'],
    sources: [
      { label: 'NHS, Dental abscess', url: 'https://www.nhs.uk/conditions/dental-abscess/' },
      { label: 'Regione Emilia-Romagna, emergenze e Numero Unico 112', url: 'https://salute.regione.emilia-romagna.it/assistenza-ospedaliera/emergenza' },
    ],
    cta: { title: 'Vuoi organizzare il controllo successivo?', href: '/richiesta/?trattamento=Altro' },
  },
  {
    slug: 'denti-sensibili-al-freddo',
    category: 'urgenze-prevenzione',
    published: true,
    updated,
    title: 'Denti sensibili al freddo: quando fare un controllo',
    seoTitle: 'Denti sensibili al freddo: che cosa riferire al dentista',
    description: 'Una fitta con acqua fredda può avere cause diverse. Quali dettagli annotare e che cosa cambia se il dolore continua dopo lo stimolo.',
    summary: 'Una fitta breve o un dolore che rimane: quali particolari aiutano a orientare la visita.',
    kicker: 'Sensibilità dentale',
    lead: 'Quando bevi acqua fredda, la fitta sparisce appena smetti o continua? Riguarda un solo dente? Questi dettagli aiutano il dentista a capire che cosa controllare.',
    keyPoints: ['Osserva dove senti la fitta e quanto dura', 'Segnala dolore spontaneo o durante la masticazione', 'Ricorda eventuali cure recenti nella zona'],
    form: { treatmentLabel: 'Motivo della visita', treatmentOptions: ['Carie e otturazioni', 'Cura delle gengive'] },
    sections: [
      {
        title: 'Perché il freddo può dare fastidio',
        paragraphs: [
          'Quando la gengiva si ritira o il dente si usura, alcune zone possono diventare più sensibili. Anche una carie o un’incrinatura possono provocare una fitta al freddo. La sensazione, da sola, non basta per scegliere una cura.',
          'Se il fastidio ricompare o si concentra su uno stesso dente, chiedi una valutazione. Segnala con particolare attenzione il dolore che resta dopo aver smesso di bere, compare da solo o si fa sentire mentre mastichi.',
        ],
      },
      {
        title: 'I dettagli da ricordare prima della visita',
        list: [
          'Indica il lato e, se lo riconosci, il dente interessato.',
          'Spiega se succede solo con il freddo, anche con il caldo o quando chiudi i denti.',
          'Ricorda quando è iniziato, se la durata sta cambiando e se hai ricevuto un’otturazione o un altro trattamento in quella zona.',
        ],
      },
      {
        title: 'Come si chiarisce la causa',
        paragraphs: [
          'Il dentista esamina denti, otturazioni e gengive. Se serve, confronta la risposta del dente interessato con quella dei vicini. Può così distinguere una superficie esposta da un problema che richiede un trattamento diverso.',
          'Quando si tratta di sensibilità della dentina, l’igienista o il dentista può mostrare una tecnica di spazzolamento adatta e consigliare un dentifricio specifico. Se il fastidio persiste, riferiscilo anche se hai già provato a cambiare prodotto.',
        ],
      },
    ],
    faqs: [
      { question: 'Se sento freddo significa che ho una carie?', answer: 'È una delle possibili cause. Anche una radice esposta o un’incrinatura possono dare sintomi simili. La visita permette di valutare il singolo dente.' },
      { question: 'La sensibilità richiede una devitalizzazione?', answer: 'La decisione dipende dallo stato della polpa e del dente. Per stabilirlo il dentista considera insieme il racconto dei sintomi, l’esame e gli eventuali test.' },
      { question: 'Devo riprodurre la fitta prima della visita?', answer: 'È sufficiente descrivere che cosa accade normalmente quando bevi, mangi o mastichi. Puoi raccontare anche un episodio terminato prima del controllo.' },
    ],
    treatments: [
      { label: 'Conservativa e otturazioni', href: '/conservativa-otturazioni/' },
      { label: 'Igiene orale e prevenzione', href: '/igiene-orale-prevenzione/' },
    ],
    related: ['gengive-ritirate-cause-cosa-fare', 'devitalizzare-o-togliere-il-dente'],
    sources: [
      { label: 'Società Italiana di Endodonzia, Quaderno clinico di endodonzia', url: 'https://www.endodonzia.it/wp-content/uploads/2024/07/BACHECA_QuadernoClinicoDiEndodonzia.pdf' },
      { label: 'Associazione Igienisti Dentali Italiani, Ipersensibilità dentinale', url: 'https://www.aiditalia.it/wp-content/uploads/2021/10/AIDIVademecum_IPERSENSIBILITA%E2%95%A0%C3%87-DENTALE-1.pdf' },
      { label: 'American Dental Association, Sensitive Teeth', url: 'https://www.mouthhealthy.org/all-topics-a-z/sensitive-teeth/' },
    ],
    cta: { title: 'Hai una sensibilità che si ripresenta?', href: '/richiesta/?trattamento=Altro' },
  },
  {
    slug: 'alitosi-persistente-quando-dal-dentista',
    category: 'gengive-igiene',
    published: true,
    updated,
    title: 'Alitosi persistente: quando parlarne con il dentista',
    seoTitle: 'Alitosi persistente: cause orali e visita dentistica',
    description: 'Come distinguere un episodio occasionale da un disturbo che ritorna, quali segnali riferire e quando è utile anche il parere del medico.',
    summary: 'Se l’alito cattivo ritorna, la visita può chiarire se contribuiscono denti, gengive, lingua o protesi.',
    kicker: 'Alitosi e salute orale',
    lead: 'Un cambiamento dell’alito dopo un pasto è comune. Se il disturbo continua per settimane nonostante l’igiene quotidiana, puoi parlarne con il dentista. Anche bocca asciutta e altri problemi di salute possono contribuire.',
    keyPoints: ['Descrivi quando compare e da quanto tempo lo noti', 'Riferisci sanguinamento, dolore o difficoltà con una protesi', 'Il percorso successivo dipende dalla causa individuata'],
    form: { treatmentLabel: 'Tipo di controllo', treatmentOptions: ['Igiene orale e prevenzione', 'Cura delle gengive'] },
    sections: [
      {
        title: 'Quando il disturbo ritorna',
        paragraphs: [
          'Cibi dall’odore intenso, fumo e digiuno possono modificare temporaneamente l’alito. Se succede spesso, osserva se avverti anche secchezza della bocca o se le gengive sono gonfie o sanguinano. Dolore ai denti o una protesi che dà fastidio sono altri motivi per contattare il dentista.',
        ],
      },
      {
        title: 'Che cosa guarda il dentista',
        paragraphs: [
          'La valutazione parte dalle tue abitudini e dai cambiamenti che hai notato. Comprende l’esame di lingua, denti, gengive e, se la usi, della protesi. Un accumulo di placca, una carie o un problema gengivale richiedono attenzioni diverse.',
          'Se l’esame della bocca non spiega il disturbo, il dentista può suggerire di parlarne con il medico. Il solo odore non permette di stabilire se l’origine è digestiva o di altro tipo.',
        ],
      },
      {
        title: 'L’igiene tra una visita e l’altra',
        list: [
          'Pulisci delicatamente denti e gengive con un dentifricio al fluoro.',
          'Dedica attenzione anche alla lingua e agli spazi tra i denti, scegliendo gli strumenti con il dentista o l’igienista.',
          'Se porti una protesi rimovibile, segui le indicazioni per pulirla e segnala le zone difficili da raggiungere.',
        ],
      },
    ],
    faqs: [
      { question: 'È sufficiente un collutorio?', answer: 'Può modificare temporaneamente l’alito. Se il problema ritorna, è utile capire se contribuiscono una carie, le gengive o la secchezza della bocca.' },
      { question: 'Devo aspettare qualche settimana anche se mi fa male un dente?', answer: 'Con dolore ai denti, gengive gonfie o sanguinanti oppure problemi con una protesi, contatta il dentista anche prima.' },
      { question: 'Serve sempre una pulizia professionale?', answer: 'Dipende da ciò che emerge dal controllo. A volte serve rivedere l’igiene quotidiana, in altri casi trattare un problema dentale o gengivale oppure coinvolgere il medico.' },
    ],
    treatments: [
      { label: 'Igiene orale e prevenzione', href: '/igiene-orale-prevenzione/' },
      { label: 'Parodontologia e cure gengivali', href: '/parodontologia-cure-gengivali/' },
    ],
    related: ['gengive-che-sanguinano', 'pulizia-denti-o-pulizia-profonda'],
    sources: [
      { label: 'Ministero della Salute, Raccomandazioni cliniche in odontostomatologia, sezione Alitosi', url: 'https://www.salute.gov.it/new/sites/default/files/imported/C_17_pubblicazioni_2637_allegato.pdf' },
      { label: 'NHS, Bad breath', url: 'https://www.nhs.uk/symptoms/bad-breath/' },
    ],
    cta: { title: 'Vuoi far valutare un disturbo che persiste?', href: '/richiesta/?trattamento=Altro' },
  },
  {
    slug: 'gengiva-che-sanguina-attorno-a-un-impianto',
    category: 'impianti-protesi',
    published: true,
    updated,
    title: 'Gengiva che sanguina attorno a un impianto: che cosa controllare',
    seoTitle: 'Sanguinamento attorno a un impianto: segnali e controlli',
    description: 'Quando far controllare un impianto dentale già in funzione, che differenza c’è fra mucosite e perimplantite e come organizzare la pulizia quotidiana.',
    summary: 'Sanguinamento, gonfiore o una protesi che si muove: quali cambiamenti riferire dopo la guarigione.',
    kicker: 'Salute degli impianti',
    lead: 'Se attorno a un impianto già guarito la gengiva inizia a sanguinare quando la pulisci, informa il dentista. Vale anche se non hai dolore. Il controllo serve a distinguere un’infiammazione superficiale da un problema più profondo.',
    keyPoints: ['Nota se il sangue compare sempre nella stessa zona', 'Segnala gonfiore o movimenti della protesi', 'Fatti mostrare come pulire lo spazio intorno all’impianto'],
    form: { treatmentLabel: 'Motivo del controllo', treatmentOptions: ['Cura delle gengive', 'Protesi dentali', 'Implantologia'] },
    sections: [
      {
        title: 'Quando anticipare il controllo',
        paragraphs: [
          'Contatta il dentista se noti sanguinamento ricorrente durante la pulizia, gonfiore, cattivo sapore o un cambiamento nella stabilità di un ponte o di una corona. Indica da quando lo avverti e in quale punto. Se l’intervento è recente, segui le istruzioni postoperatorie ricevute e chiama chi ti ha operato per un sanguinamento inatteso.',
        ],
      },
      {
        title: 'Mucosite e perimplantite: che cosa cambia',
        paragraphs: [
          'Nella mucosite si infiammano i tessuti molli intorno all’impianto. Quando l’infiammazione si accompagna anche a perdita dell’osso che lo sostiene, si parla di perimplantite. Il sangue sullo spazzolino, da solo, non distingue le due situazioni.',
          'Il dentista controlla con strumenti dedicati il sanguinamento e la profondità degli spazi intorno all’impianto. Quando occorre, confronta le radiografie con quelle precedenti per valutare l’osso.',
        ],
      },
      {
        title: 'Come preparare il mantenimento',
        paragraphs: [
          'Fatti mostrare in bocca dove appoggiare lo spazzolino e come raggiungere la base della protesi. Uno scovolino adatto allo spazio disponibile può rendere più semplice la pulizia tra gli elementi. Spiega se una zona resta inaccessibile anche dopo la dimostrazione.',
          'La frequenza dei richiami dipende dalle condizioni dei tessuti e dai fattori di rischio personali, fra cui una storia di parodontite. Una nuova perdita di sangue o una protesi che sembra mobile meritano un contatto prima del richiamo già fissato.',
        ],
      },
    ],
    faqs: [
      { question: 'È perimplantite ogni volta che vedo sangue?', answer: 'Il sanguinamento può comparire anche con un’infiammazione limitata alla gengiva. Per stabilire se è coinvolto l’osso serve una valutazione odontoiatrica.' },
      { question: 'Posso aspettare finché il dolore aumenta?', answer: 'I disturbi intorno all’impianto possono dare poco o nessun dolore. Se il sanguinamento si ripete o la protesi si muove, chiedi un controllo.' },
      { question: 'Serve uno scovolino particolare?', answer: 'Le dimensioni e l’accesso cambiano secondo la protesi e gli spazi. Porta al controllo lo strumento che usi per verificare insieme come raggiungere la zona.' },
    ],
    treatments: [
      { label: 'Implantologia', href: '/implantologia-tradizionale-computer-guidata/' },
      { label: 'Parodontologia e cure gengivali', href: '/parodontologia-cure-gengivali/' },
      { label: 'Igiene orale e prevenzione', href: '/igiene-orale-prevenzione/' },
    ],
    related: ['gengive-che-sanguinano', 'pulizia-denti-o-pulizia-profonda'],
    sources: [
      { label: 'European Federation of Periodontology, domande dei pazienti sugli impianti', url: 'https://www.efp.org/for-patients/dental-implants/faqs/' },
      { label: 'European Federation of Periodontology, prevenzione delle malattie peri-implantari', url: 'https://www.efp.org/fileadmin/uploads/efp/Documents/Other_publications/Clinical_guidelines/peri-implantitis-guideline-01-prevention.pdf' },
      { label: 'Associazione Igienisti Dentali Italiani, igiene degli impianti', url: 'https://www.aiditalia.it/wp-content/uploads/2020/10/AIDI_VADEMECUM_GENERICO-TRENTINO-002-1.pdf' },
    ],
    cta: { title: 'Hai notato un cambiamento attorno all’impianto?', href: '/richiesta/?trattamento=Altro' },
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
    category: 'prima-della-visita',
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
