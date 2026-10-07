export type TreatmentMarketingSection = {
  title: string;
  paragraphs: string[];
};

export type TreatmentMarketingFaq = {
  question: string;
  answer: string;
};

export type TreatmentClinicalCase =
  | 'Estetica'
  | 'Protesi'
  | 'Parodontologia'
  | 'Implantologia'
  | 'Ortodonzia'
  | 'Conservativa'
  | 'Endodonzia';

export type TreatmentPathwayIconName =
  | 'assessment'
  | 'restoration'
  | 'monitoring'
  | 'child'
  | 'prevention'
  | 'growth'
  | 'alignment'
  | 'design'
  | 'precision'
  | 'inflammation'
  | 'surgery'
  | 'healing'
  | 'implant'
  | 'function'
  | 'sleep'
  | 'device'
  | 'whitening'
  | 'goal'
  | 'history'
  | 'progress';

export type TreatmentMarketingConfig = {
  seoTitle: string;
  description: string;
  requestLabel: string;
  clinicalCase?: TreatmentClinicalCase;
  heroTitle: string;
  kicker: string;
  lead: string;
  trustItems: string[];
  formOptions: string[];
  sections: TreatmentMarketingSection[];
  faqs: TreatmentMarketingFaq[];
  pathwayTitle: string;
  pathwayLead: string;
  pathwayCards: Array<{ icon: TreatmentPathwayIconName; title: string; text: string }>;
  finalKicker: string;
  finalTitle: string;
  ogImage: string;
};

export const treatmentMarketingPaths = [
  '/conservativa-otturazioni/',
  '/endodonzia-devitalizzazioni/',
  '/pedodonzia-odontoiatria-infantile/',
  '/ortodonzia-allineatori-invisibili/',
  '/estetica-diretta-faccette-composito/',
  '/parodontologia-cure-gengivali/',
  '/protesi-fissa-mobile/',
  '/estetica-indiretta-faccette-porcellana/',
  '/chirurgia-stomatologica/',
  '/implantologia-tradizionale-computer-guidata/',
  '/gnatologia-articolazione-temporo-mandibolare/',
  '/dispositivi-russamento-apnee-notturne/',
] as const;

export type TreatmentMarketingPath = (typeof treatmentMarketingPaths)[number];

export const treatmentMarketingPages = {
  '/conservativa-otturazioni/': {
    seoTitle: 'Conservativa e otturazioni',
    description:
      'Otturazioni e restauri conservativi a Modena e Reggio Emilia per riparare denti danneggiati preservando il tessuto sano residuo.',
    requestLabel: 'Conservativa (otturazioni)',
    clinicalCase: 'Conservativa',
    heroTitle: 'Conservativa e otturazioni',
    kicker: 'Odontoiatria conservativa',
    lead:
      'Un approccio mirato per riparare il dente danneggiato e preservare quanto più tessuto sano possibile. Ogni restauro viene pianificato sul singolo caso.',
    trustItems: [
      'Valutazione clinica e radiografica quando indicata',
      'Approccio conservativo ai tessuti dentali',
      'Restauri modellati sul singolo dente',
    ],
    formOptions: ['Carie o otturazione', 'Dente scheggiato o usurato', 'Controllo di un vecchio restauro'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'L’odontoiatria conservativa tratta le parti del dente compromesse da carie, piccole fratture o usura. L’obiettivo è rimuovere il tessuto non recuperabile e ricostruire forma e funzione con un restauro adesivo, preservando la struttura sana residua.',
          'I materiali compositi permettono di armonizzare il restauro con il colore del dente, ma la scelta dipende sempre dalla situazione clinica. Quando il danno è esteso, un’otturazione diretta potrebbe non essere sufficiente e possono essere valutate soluzioni diverse.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Può essere indicata in presenza di una carie, di un’otturazione deteriorata, di una piccola frattura o di una perdita localizzata di tessuto dentale. Sensibilità, cibo che si incastra o fastidio alla masticazione meritano un controllo, ma da soli non identificano la causa.',
          'La visita, ed eventualmente gli esami radiografici ritenuti necessari, servono a stabilire profondità e recuperabilità del dente. Se sono coinvolti la polpa, le radici o una parte estesa della corona, il piano viene adattato al singolo caso.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'Dopo la diagnosi, il dente viene isolato e, quando necessario, trattato con anestesia locale. Si rimuove il tessuto compromesso, si applicano i materiali adesivi e si modella il composito per ricostruire anatomia, contatti e morso; infine il restauro viene rifinito e lucidato.',
          'Prima dell’appuntamento è utile comunicare condizioni di salute, allergie e farmaci assunti, senza sospendere terapie di propria iniziativa. Salvo indicazioni differenti, si può mangiare normalmente e arrivare con una buona igiene orale.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Finché dura l’anestesia è prudente non masticare e fare attenzione a labbra e guance. Una sensibilità transitoria può comparire dopo il trattamento; se il dolore è intenso, aumenta o il morso sembra alto, è opportuno contattare lo studio.',
          'Un’otturazione è sottoposta nel tempo a carichi, usura e cambiamenti della bocca. Igiene quotidiana e controlli permettono di verificare margini e stabilità e di intervenire se compaiono infiltrazioni, fratture o altri problemi.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Fare un’otturazione fa male?',
        answer:
          'L’anestesia locale, quando necessaria, aiuta a rendere confortevole la procedura. Nei giorni successivi può esserci una sensibilità temporanea; intensità e durata dipendono dalla profondità del restauro e dalla risposta individuale.',
      },
      {
        question: 'Quanto dura un’otturazione?',
        answer:
          'Non esiste una durata uguale per tutti. Dimensione e posizione del restauro, carico masticatorio, igiene, alimentazione e abitudini come il serramento influenzano il comportamento nel tempo.',
      },
      {
        question: 'Una vecchia otturazione va sempre sostituita?',
        answer:
          'No. Età o colore non sono, da soli, motivi sufficienti: la sostituzione viene valutata se ci sono difetti, carie, fratture, perdita di tenuta o esigenze cliniche documentate.',
      },
      {
        question: 'Conviene sostituire le otturazioni in amalgama?',
        answer:
          'Non in modo automatico. Rimuovere un restauro comporta anche un intervento sul dente; benefici, condizioni del materiale e struttura residua vanno esaminati prima di decidere.',
      },
    ],
    pathwayTitle: 'Conservare prima di sostituire',
    pathwayLead:
      'La scelta del restauro nasce dalla quantità di dente sano, dalla profondità del danno e dai carichi della masticazione.',
    pathwayCards: [
      {
        icon: 'assessment',
        title: 'Comprendiamo il problema',
        text: 'Visita, test clinici e immagini quando indicate aiutano a definire posizione, profondità e causa del danno.',
      },
      {
        icon: 'restoration',
        title: 'Ricostruiamo con precisione',
        text: 'Materiali, forma e tecnica vengono scelti per il singolo dente e per il suo ruolo nella masticazione.',
      },
      {
        icon: 'monitoring',
        title: 'Controlliamo nel tempo',
        text: 'Igiene e richiami periodici aiutano a monitorare il restauro e il tessuto dentale residuo.',
      },
    ],
    finalKicker: 'Hai un dente da controllare?',
    finalTitle: 'Valutiamo come riparare e conservare il tuo dente.',
    ogImage: '/assets/menu/casi-clinici-conservativa.png',
  },
  '/endodonzia-devitalizzazioni/': {
    seoTitle: 'Endodonzia e devitalizzazioni',
    description:
      'Trattamenti endodontici e devitalizzazioni a Modena e Reggio Emilia per curare l’interno del dente e valutarne il mantenimento.',
    requestLabel: 'Endodonzia (devitalizzazioni)',
    clinicalCase: 'Endodonzia',
    heroTitle: 'Endodonzia e devitalizzazioni',
    kicker: 'Cura dell’interno del dente',
    lead:
      'Il trattamento endodontico interviene quando la polpa dentale è infiammata o non più vitale. L’obiettivo è disinfettare i canali e mantenere il dente, quando possibile.',
    trustItems: [
      'Diagnosi pulpare e radiografica',
      'Disinfezione e sigillatura dei canali',
      'Ricostruzione e controlli pianificati',
    ],
    formOptions: ['Dolore o sensibilità persistente', 'Devitalizzazione consigliata', 'Controllo di un dente già trattato'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'La devitalizzazione, o trattamento canalare, rimuove dai canali radicolari la polpa compromessa, deterge e disinfetta gli spazi interni e li sigilla. Può permettere di conservare un dente colpito da carie profonda, trauma o altre alterazioni della polpa.',
          'Il trattamento riduce la carica batterica interna, ma il risultato dipende da anatomia, estensione dell’infezione, condizioni del dente e risposta individuale. Prima di procedere vengono chiariti possibilità, limiti ed eventuali alternative.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Può essere necessario in caso di dolore spontaneo o persistente, sensibilità prolungata al caldo o al freddo, fastidio alla masticazione, gonfiore o lesioni visibili agli esami. In alcuni casi il problema può essere presente anche senza sintomi evidenti.',
          'La diagnosi non si basa su un solo segnale: comprende anamnesi, test clinici e immagini radiografiche quando indicate. Fratture profonde, scarso supporto o una struttura non ricostruibile possono limitare la possibilità di mantenere il dente.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'Con anestesia locale e isolamento del dente si crea un accesso ai canali, che vengono individuati, sagomati, irrigati e sigillati. Il percorso può richiedere una o più sedute in base al quadro clinico; tra gli appuntamenti può essere applicata una chiusura provvisoria.',
          'È utile segnalare farmaci, allergie, patologie e sintomi recenti, senza modificare terapie prescritte autonomamente. Salvo diverse indicazioni, è preferibile presentarsi dopo avere mangiato e con una normale igiene orale.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Una dolenzia alla pressione o alla masticazione può comparire nei giorni successivi e tende generalmente a ridursi. Gonfiore, dolore crescente, febbre o perdita della chiusura provvisoria richiedono invece un contatto tempestivo con lo studio.',
          'Il dente deve essere ricostruito e protetto in modo adeguato alla quantità di tessuto rimasta e ai carichi che riceve. Controlli clinici e radiografici, quando indicati, servono a valutarne la guarigione e la stabilità nel tempo.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Che cosa significa devitalizzare un dente?',
        answer:
          'Significa rimuovere la polpa compromessa dall’interno delle radici, detergere i canali e sigillarli. Il dente resta in bocca e può continuare a svolgere la sua funzione, dopo una ricostruzione adeguata.',
      },
      {
        question: 'La devitalizzazione è dolorosa?',
        answer:
          'L’anestesia locale ha lo scopo di controllare il dolore durante la procedura. In presenza di forte infiammazione la gestione può essere più complessa; un fastidio post-trattamento è possibile e viene seguito con indicazioni personalizzate.',
      },
      {
        question: 'Si conclude sempre in un solo appuntamento?',
        answer:
          'Non necessariamente. Numero e durata delle sedute dipendono dall’anatomia dei canali, dalla presenza di infezione, da eventuali trattamenti precedenti e dalla risposta del dente.',
      },
      {
        question: 'Dopo serve sempre una corona?',
        answer:
          'No, la scelta dipende dal dente, dalla quantità di struttura residua e dal carico masticatorio. In alcuni casi è sufficiente una ricostruzione adesiva; in altri è indicata una protezione più estesa.',
      },
    ],
    pathwayTitle: 'Diagnosi, cura e protezione',
    pathwayLead:
      'Il trattamento dei canali è solo una parte del percorso: diagnosi e ricostruzione finale contribuiscono alla possibilità di mantenere il dente.',
    pathwayCards: [
      {
        icon: 'assessment',
        title: 'Formuliamo la diagnosi',
        text: 'Sintomi, test clinici e radiografie quando necessarie aiutano a comprendere lo stato della polpa e dei tessuti intorno alla radice.',
      },
      {
        icon: 'restoration',
        title: 'Trattiamo i canali',
        text: 'Detersione, disinfezione e sigillatura vengono adattate all’anatomia e alle condizioni del dente.',
      },
      {
        icon: 'monitoring',
        title: 'Ricostruiamo e monitoriamo',
        text: 'La protezione della corona e i controlli completano il percorso e permettono di seguirne l’evoluzione.',
      },
    ],
    finalKicker: 'Dolore o dente compromesso?',
    finalTitle: 'Valutiamo se la devitalizzazione può conservare il tuo dente.',
    ogImage: '/assets/menu/casi-clinici-endodonzia.png',
  },
  '/pedodonzia-odontoiatria-infantile/': {
    seoTitle: 'Pedodonzia e odontoiatria infantile',
    description:
      'Odontoiatria per bambini e ragazzi a Modena e Reggio Emilia: prevenzione, controlli e cure con un approccio graduale e adatto all’età.',
    requestLabel: 'Pedodonzia (odontoiatria infantile)',
    heroTitle: 'Odontoiatria per bambini',
    kicker: 'Crescere con un sorriso sano',
    lead:
      'Prevenzione e cure pensate per accompagnare la crescita del sorriso con gradualità, tenendo conto dell’età, della collaborazione e delle esigenze della famiglia.',
    trustItems: [
      'Approccio graduale e linguaggio adatto all’età',
      'Prevenzione calibrata sul rischio individuale',
      'Famiglia coinvolta nel percorso',
    ],
    formOptions: ['Prima visita del bambino', 'Controllo o prevenzione', 'Dolore, carie o trauma'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'La pedodonzia si occupa della salute orale durante l’infanzia e l’adolescenza, dai denti da latte a quelli permanenti. Comprende controlli, educazione all’igiene, prevenzione della carie e trattamento dei problemi che possono comparire durante la crescita.',
          'Le visite precoci aiutano il bambino a familiarizzare con l’ambiente e permettono alla famiglia di ricevere indicazioni su spazzolamento, alimentazione, fluoro e abitudini orali. Sigillature o altri interventi preventivi vengono proposti solo quando indicati dal rischio individuale.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'È utile iniziare i controlli con l’eruzione dei primi denti, senza aspettare la comparsa di dolore. Le visite sono importanti anche per bambini che non hanno sintomi, perché alcune alterazioni iniziali possono non essere facilmente visibili a casa.',
          'Carie, traumi, difficoltà di igiene, sensibilità, abitudini come suzione prolungata o dubbi sulla crescita meritano una valutazione. Tempi e priorità vengono adattati alla maturità del bambino, alla situazione clinica e al suo livello di collaborazione.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'La prima fase è spesso dedicata a conoscersi: si raccolgono informazioni, si osservano denti e gengive e si introducono strumenti e gesti con parole comprensibili. Radiografie e trattamenti vengono eseguiti soltanto quando utili e compatibili con necessità cliniche e collaborazione.',
          'A casa è meglio presentare la visita in modo semplice e positivo, evitando racconti di esperienze dolorose o promesse assolute. Il genitore può anticipare che il dentista conterà e controllerà i denti; sarà poi il team a spiegare ogni passaggio.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Se è stata eseguita un’anestesia, il bambino va sorvegliato finché l’effetto non termina per evitare che morda labbra, guance o lingua. Eventuali indicazioni su alimentazione, igiene o fastidio vengono adattate alla procedura effettuata.',
          'La prevenzione continua a casa con spazzolamento assistito in base all’età, dentifricio appropriato e abitudini alimentari equilibrate. La frequenza dei controlli non è uguale per tutti: dipende dal rischio di carie, dalla crescita e dalle cure già eseguite.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Quando è utile la prima visita?',
        answer:
          'È consigliabile iniziare con l’eruzione dei primi denti e comunque prima che compaiano problemi. Un incontro tranquillo favorisce familiarità e consente di impostare precocemente la prevenzione.',
      },
      {
        question: 'Perché curare i denti da latte se poi cadono?',
        answer:
          'I denti da latte aiutano masticazione, fonazione e mantenimento degli spazi per i permanenti. Dolore o infezione possono interferire con benessere e crescita; ogni cura viene valutata anche rispetto al momento previsto della permuta.',
      },
      {
        question: 'Le radiografie sono sempre necessarie?',
        answer:
          'No. Vengono prescritte solo quando l’esame clinico non basta e l’informazione può cambiare la cura, utilizzando protocolli adeguati al bambino.',
      },
      {
        question: 'Cosa succede se mio figlio ha paura?',
        answer:
          'Si procede per piccoli passi, rispettando per quanto possibile i suoi tempi e usando tecniche di comunicazione adatte. Urgenza, tipo di trattamento e collaborazione guidano la scelta del percorso più sicuro.',
      },
    ],
    pathwayTitle: 'Fiducia, prevenzione e crescita',
    pathwayLead:
      'Un percorso sereno nasce da incontri adatti all’età e da indicazioni concrete che coinvolgono bambino e famiglia.',
    pathwayCards: [
      {
        icon: 'child',
        title: 'Ci conosciamo',
        text: 'Un primo incontro sereno permette di ascoltare la famiglia e far prendere confidenza al bambino con persone e ambiente.',
      },
      {
        icon: 'prevention',
        title: 'Preveniamo e curiamo',
        text: 'Indicazioni e trattamenti vengono scelti in base a età, rischio individuale e necessità cliniche.',
      },
      {
        icon: 'growth',
        title: 'Accompagniamo la crescita',
        text: 'Controlli personalizzati aiutano a seguire igiene, permuta dei denti e sviluppo del sorriso.',
      },
    ],
    finalKicker: 'Una visita pensata per i più piccoli',
    finalTitle: 'Un percorso di cura pensato per il sorriso dei più piccoli.',
    ogImage: '/assets/original/2026/04/BEA08719-3-scaled.jpg',
  },
  '/ortodonzia-allineatori-invisibili/': {
    seoTitle: 'Ortodonzia e allineatori invisibili',
    description:
      'Ortodonzia e allineatori trasparenti per adulti e bambini a Modena e Reggio Emilia, con diagnosi e piano personalizzato.',
    requestLabel: 'Ortodonzia e Allineatori invisibili (adulti e bimbi)',
    clinicalCase: 'Ortodonzia',
    heroTitle: 'Ortodonzia e allineatori',
    kicker: 'Ortodonzia su misura',
    lead:
      'Un percorso per guidare l’allineamento dei denti e migliorare, quando possibile, l’equilibrio del morso. La tecnica viene scelta in base alla diagnosi.',
    trustItems: [
      'Studio completo di denti, morso e tessuti',
      'Soluzione scelta sul singolo caso',
      'Controlli e contenzione programmati',
    ],
    formOptions: ['Valutazione ortodontica', 'Allineatori trasparenti', 'Controllo per bambino o ragazzo'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'L’ortodonzia sposta gradualmente i denti per correggere affollamenti, spazi e alcune alterazioni del morso. Una posizione più favorevole può facilitare igiene e funzione, oltre a modificare l’armonia del sorriso nei limiti consentiti dall’anatomia individuale.',
          'Il trattamento non riguarda solo denti dritti: salute gengivale, supporto osseo, crescita, articolazioni e stabilità vanno considerate insieme. Apparecchi fissi, dispositivi rimovibili e allineatori hanno possibilità e limiti differenti.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Una valutazione può essere utile in presenza di denti affollati o distanziati, morso incrociato, profondo o aperto, sporgenze e recidive di precedenti trattamenti. Bambini, adolescenti e adulti possono avere indicazioni diverse e tempi biologici differenti.',
          'Gli allineatori trasparenti sono adatti a molti percorsi, ma non a tutti, e richiedono costanza nell’utilizzo. Complessità dei movimenti, salute di denti e gengive e capacità di seguire le istruzioni guidano la scelta più appropriata.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'Il percorso parte da visita, fotografie, scansioni o impronte e radiografie quando indicate. Sulla base dello studio viene definito un piano; durante la terapia possono essere necessari attacchi, elastici, rimodellamenti interprossimali o altri ausili, sempre illustrati prima dell’impiego.',
          'Carie e infiammazioni gengivali devono essere controllate e l’igiene deve essere adeguata prima di iniziare. È importante comprendere fin dall’inizio impegno richiesto, controlli, uso dei dispositivi e possibili adattamenti del piano durante il percorso.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Una sensazione di pressione o indolenzimento è comune dopo l’applicazione o l’attivazione dell’apparecchio e tende in genere a ridursi. Igiene accurata e indicazioni alimentari o d’uso aiutano a limitare carie, infiammazione e rotture dei dispositivi.',
          'Terminati i movimenti, la contenzione rimovibile o fissa aiuta a mantenere la nuova posizione. I denti possono spostarsi nel tempo: costanza nell’uso e controlli sono parte integrante del trattamento, senza poter eliminare del tutto il rischio di recidiva.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Gli allineatori sono davvero invisibili?',
        answer:
          'Sono trasparenti e generalmente discreti, ma non completamente invisibili. Attacchi applicati ai denti, elastici e naturale riflesso del materiale possono essere visibili da vicino.',
      },
      {
        question: 'Gli allineatori funzionano per tutti?',
        answer:
          'No. Possono gestire molti movimenti, ma diagnosi, complessità, salute dei tessuti e collaborazione determinano se siano adatti o se un’altra tecnica sia più prevedibile.',
      },
      {
        question: 'L’ortodonzia fa male?',
        answer:
          'Gli spostamenti possono causare pressione o indolenzimento temporanei, soprattutto dopo un’attivazione o il cambio di mascherina. Dolore intenso, lesioni o componenti rotte vanno segnalati allo studio.',
      },
      {
        question: 'Quanto dura il trattamento?',
        answer:
          'Non esiste una durata standard. Dipende da obiettivi, complessità, risposta biologica, crescita, regolarità dei controlli e aderenza alle istruzioni; il piano può essere aggiornato lungo il percorso.',
      },
    ],
    pathwayTitle: 'Dalla diagnosi alla stabilità',
    pathwayLead:
      'Allineamento, funzione e mantenimento vengono considerati insieme, scegliendo strumenti e tempi sul singolo caso.',
    pathwayCards: [
      {
        icon: 'assessment',
        title: 'Studiamo il sorriso',
        text: 'Denti, morso, tessuti e obiettivi vengono analizzati insieme con la documentazione necessaria.',
      },
      {
        icon: 'alignment',
        title: 'Guidiamo i movimenti',
        text: 'Tecnica, controlli e dispositivi vengono calibrati sul piano e sulla risposta individuale.',
      },
      {
        icon: 'prevention',
        title: 'Proteggiamo la stabilità',
        text: 'La contenzione e i richiami aiutano a conservare il risultato e intercettare eventuali cambiamenti.',
      },
    ],
    finalKicker: 'Apparecchio o allineatori?',
    finalTitle: 'Esploriamo le possibilità ortodontiche per il tuo sorriso.',
    ogImage: '/assets/menu/casi-clinici-ortodonzia.png',
  },
  '/estetica-diretta-faccette-composito/': {
    seoTitle: 'Faccette in composito ed estetica diretta',
    description:
      'Faccette in composito ed estetica diretta a Modena e Reggio Emilia per modificare forma e dettagli del sorriso con un piano personalizzato.',
    requestLabel: 'Estetica diretta (faccette in composito)',
    clinicalCase: 'Conservativa',
    heroTitle: 'Faccette in composito',
    kicker: 'Estetica conservativa del sorriso',
    lead:
      'Il composito permette di modificare direttamente forma, proporzioni e piccoli dettagli del sorriso con una tecnica adesiva. Il progetto parte da una valutazione completa.',
    trustItems: [
      'Analisi di forma, colore e morso',
      'Minima invasività quando possibile',
      'Materiale riparabile e controllabile nel tempo',
    ],
    formOptions: ['Modificare forma o proporzioni', 'Dente scheggiato o usurato', 'Confrontare composito e ceramica'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'Le ricostruzioni estetiche dirette e le faccette in composito possono correggere piccoli difetti di forma, bordi usurati o fratturati, spazi localizzati e alcune discromie. Il materiale viene applicato e modellato direttamente sul dente per integrarsi con il sorriso.',
          'Rispetto a soluzioni indirette, il composito consente spesso un intervento più conservativo e facilmente riparabile. Ha però limiti di resistenza, brillantezza e stabilità cromatica: indicazione e aspettative vanno condivise prima del trattamento.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Può essere una possibilità per chi desidera modifiche circoscritte e presenta denti e gengive in condizioni compatibili con il trattamento adesivo. Entità del difetto, colore di partenza, quantità di smalto e rapporti del morso influenzano il risultato ottenibile.',
          'Carie attive, infiammazione gengivale, usura importante, serramento o richieste di trasformazioni estese possono richiedere cure preliminari o alternative. In alcuni casi sbiancamento, ortodonzia o restauri ceramici sono opzioni da confrontare.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'Fotografie, analisi estetica e scelta del colore aiutano a definire il progetto; quando utile, una simulazione consente di discuterne forma e proporzioni. Il dente viene preparato solo quanto necessario, isolato e stratificato con compositi di tonalità differenti, quindi rifinito e lucidato.',
          'Prima di iniziare è importante stabilizzare salute orale e igiene. Se è previsto uno sbiancamento, la sequenza va pianificata perché il composito non cambia colore come lo smalto; eventuali abitudini di serramento vengono considerate per proteggere il restauro.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Nei primi giorni possono servire piccoli adattamenti alla nuova forma o al contatto tra i denti. Se il morso appare diverso, un bordo dà fastidio o compare sensibilità persistente, è utile richiedere un controllo senza tentare modifiche a casa.',
          'Il composito può pigmentarsi, perdere lucidità, usurarsi o scheggiarsi. Igiene, controlli e manutenzione professionale aiutano a conservarne l’integrazione; riparazioni o rifacimenti possono diventare necessari in base all’uso e alle caratteristiche individuali.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Le faccette in composito richiedono di limare i denti?',
        answer:
          'Non sempre nello stesso modo. Alcuni casi consentono un approccio prevalentemente additivo, altri richiedono una preparazione limitata per creare spazio o migliorare l’adesione; la quantità viene decisa sul singolo dente.',
      },
      {
        question: 'Il composito cambia colore?',
        answer:
          'Può assorbire pigmenti e perdere brillantezza nel tempo, soprattutto in relazione ad alimentazione, fumo e caratteristiche del materiale. Lucidature e manutenzione possono migliorare la superficie, ma non evitano ogni cambiamento.',
      },
      {
        question: 'Qual è la differenza rispetto alle faccette in ceramica?',
        answer:
          'Il composito viene modellato direttamente, è in genere più semplice da riparare e può richiedere un approccio più conservativo. La ceramica offre proprietà ottiche e stabilità differenti, ma comporta un percorso e indicazioni diverse.',
      },
      {
        question: 'Il trattamento è reversibile?',
        answer:
          'Non va considerato automaticamente reversibile. Anche con preparazione minima, adesione, rifinitura e manutenzione modificano la superficie del dente; prima di procedere vengono chiariti impegno futuro e alternative.',
      },
    ],
    pathwayTitle: 'Dal progetto al dettaglio',
    pathwayLead:
      'Forma, colore, tessuti e morso vengono letti insieme per capire se il composito è la soluzione più adatta e sostenibile.',
    pathwayCards: [
      {
        icon: 'design',
        title: 'Progettiamo insieme',
        text: 'Ascoltiamo l’obiettivo e analizziamo proporzioni, colore, gengive e morso per definire ciò che è realistico.',
      },
      {
        icon: 'precision',
        title: 'Modelliamo il dettaglio',
        text: 'Il composito viene stratificato direttamente e rifinito per integrarsi con forma e luce del sorriso.',
      },
      {
        icon: 'monitoring',
        title: 'Manteniamo il risultato',
        text: 'Controlli, lucidature e possibili riparazioni accompagnano il restauro nel tempo.',
      },
    ],
    finalKicker: 'Hai in mente un cambiamento?',
    finalTitle: 'Valutiamo le faccette in composito per il tuo sorriso.',
    ogImage: '/assets/menu/casi-clinici-estetica.jpg',
  },
  '/parodontologia-cure-gengivali/': {
    seoTitle: 'Parodontologia e cure gengivali',
    description:
      'Diagnosi e trattamenti parodontali a Modena e Reggio Emilia per controllare l’infiammazione e proteggere gengive e sostegno dei denti.',
    requestLabel: 'Parodontologia (cure gengivali)',
    clinicalCase: 'Parodontologia',
    heroTitle: 'Salute delle gengive',
    kicker: 'Gengive e tessuti di supporto',
    lead:
      'Un percorso per riconoscere e controllare le malattie che interessano gengive e sostegno dei denti, calibrato sul quadro clinico e sui fattori di rischio individuali.',
    trustItems: [
      'Sondaggio e diagnosi parodontale',
      'Terapia guidata da quadro clinico e rischio',
      'Mantenimento personalizzato nel tempo',
    ],
    formOptions: ['Gengive che sanguinano', 'Recessioni o sensibilità', 'Controllo parodontale'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'La parodontologia previene, diagnostica e tratta gengivite e parodontite, condizioni legate all’accumulo di biofilm e alla risposta infiammatoria dell’organismo. L’obiettivo è controllare l’infiammazione e preservare, quando possibile, i tessuti che sostengono i denti.',
          'Nella parodontite il supporto osseo già perso non torna automaticamente alla condizione iniziale. La terapia può stabilizzare la malattia e, in situazioni selezionate, includere procedure chirurgiche o rigenerative, senza poter garantire lo stesso esito per ogni dente.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Sanguinamento, gengive gonfie o ritirate, alito persistente, mobilità o spostamento dei denti sono segnali da valutare. La malattia può però progredire anche con pochi sintomi, perciò un controllo è utile soprattutto in presenza di familiarità o precedenti problemi gengivali.',
          'Fumo, diabete non controllato, igiene insufficiente e alcune condizioni generali possono aumentare rischio o complessità. La diagnosi richiede misurazioni parodontali e, quando indicate, radiografie: il solo aspetto delle gengive non basta a definire il quadro.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'Dopo anamnesi, sondaggio e valutazione radiografica quando necessaria, il percorso inizia in genere con istruzioni di igiene e rimozione professionale di placca e tartaro sopra e sotto gengiva. La risposta viene rivalutata prima di decidere se servano ulteriori procedure.',
          'È importante comunicare fumo, diabete, farmaci, terapie anticoagulanti e altre condizioni mediche, senza interrompere prescrizioni autonomamente. La collaborazione quotidiana nell’igiene e il controllo dei fattori di rischio sono parte essenziale del trattamento.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Sensibilità, lieve sanguinamento o indolenzimento possono comparire temporaneamente dopo la terapia non chirurgica o chirurgica. Le indicazioni su pulizia, alimentazione e farmaci dipendono dalla procedura; dolore crescente, gonfiore importante o febbre vanno segnalati.',
          'La parodontite richiede mantenimento: anche dopo una buona risposta può riattivarsi. Richiami professionali con frequenza personalizzata e igiene domiciliare accurata permettono di monitorare tasche, sanguinamento, placca e stabilità dei denti.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Gengive che sanguinano sono normali?',
        answer:
          'No. Il sanguinamento frequente è spesso un segno di infiammazione e merita una valutazione; evitare di pulire la zona può favorire l’accumulo di placca invece di risolvere la causa.',
      },
      {
        question: 'Qual è la differenza tra gengivite e parodontite?',
        answer:
          'La gengivite interessa i tessuti superficiali e può regredire controllando l’infiammazione. La parodontite comporta perdita del supporto intorno ai denti e richiede diagnosi, terapia e mantenimento continuativo.',
      },
      {
        question: 'L’osso perso può ricrescere?',
        answer:
          'Non spontaneamente e non in ogni situazione. Alcuni difetti selezionati possono essere candidati a procedure rigenerative, ma anatomia, controllo dell’infezione, salute generale e abitudini condizionano indicazione ed esito.',
      },
      {
        question: 'La parodontite si può curare definitivamente?',
        answer:
          'Può essere trattata e mantenuta stabile, ma resta una condizione suscettibile a riattivarsi. Il controllo a lungo termine dipende da igiene, richiami e gestione dei fattori di rischio.',
      },
    ],
    pathwayTitle: 'Diagnosi, terapia, mantenimento',
    pathwayLead:
      'La stabilità delle gengive dipende dal trattamento professionale e dalla continuità del controllo quotidiano e periodico.',
    pathwayCards: [
      {
        icon: 'assessment',
        title: 'Misuriamo il quadro',
        text: 'Anamnesi, sondaggio e immagini quando indicate definiscono estensione, gravità e fattori di rischio.',
      },
      {
        icon: 'inflammation',
        title: 'Controlliamo l’infiammazione',
        text: 'Igiene guidata e terapia professionale mirano a ridurre biofilm e infiammazione nei siti interessati.',
      },
      {
        icon: 'monitoring',
        title: 'Manteniamo la stabilità',
        text: 'Rivalutazioni e richiami personalizzati aiutano a intercettare precocemente eventuali riattivazioni.',
      },
    ],
    finalKicker: 'Gengive che chiedono attenzione?',
    finalTitle: 'La salute del sorriso comincia dalle gengive.',
    ogImage: '/assets/menu/casi-clinici-parodontologia.png',
  },
  '/protesi-fissa-mobile/': {
    seoTitle: 'Protesi fissa e mobile',
    description:
      'Protesi fisse e mobili a Modena e Reggio Emilia per ricostruire denti compromessi o sostituire denti mancanti con un progetto personalizzato.',
    requestLabel: 'Protesi fissa e mobile',
    clinicalCase: 'Protesi',
    heroTitle: 'Protesi fissa e mobile',
    kicker: 'Riabilitazione orale',
    lead:
      'Soluzioni fisse o rimovibili progettate per sostituire denti mancanti o ricostruire denti compromessi, con attenzione a masticazione, comfort ed estetica.',
    trustItems: [
      'Progetto costruito sulla situazione clinica',
      'Funzione ed estetica valutate insieme',
      'Controlli e manutenzione nel tempo',
    ],
    formOptions: ['Dente molto compromesso', 'Uno o più denti mancanti', 'Controllo di una vecchia protesi'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'Le protesi dentali permettono di ricostruire uno o più denti danneggiati o di sostituire quelli mancanti. L’obiettivo è ristabilire una masticazione più equilibrata, proteggere le strutture residue e integrare il risultato nel sorriso.',
          'Corone e ponti sono soluzioni fisse sostenute da denti naturali o impianti; le protesi mobili possono essere rimosse per l’igiene. Non esiste una scelta migliore in assoluto: stabilità dei supporti, estensione del problema e priorità personali orientano il progetto.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Un percorso protesico può essere valutato in presenza di denti molto compromessi, elementi mancanti, vecchie riabilitazioni non più adeguate o protesi mobili che hanno perso stabilità e comfort. Anche fonazione, estetica e facilità di pulizia fanno parte della valutazione.',
          'Prima di procedere controlliamo denti residui, gengive, osso, occlusione e capacità di mantenere una buona igiene. Quando un dente può essere conservato in modo ragionevole, questa possibilità viene considerata prima della sua sostituzione.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'Il percorso inizia con visita, esami radiografici quando indicati e rilevazione di impronte o scansioni digitali. Studiamo gli spazi, il modo in cui i denti entrano in contatto e il rapporto tra la futura protesi, il sorriso e i tessuti di supporto.',
          'La riabilitazione può prevedere prove, provvisori e più fasi cliniche prima della consegna definitiva. È importante comunicare condizioni di salute, farmaci assunti e difficoltà incontrate con eventuali protesi precedenti.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Nei primi giorni può essere necessario abituarsi a nuovi volumi, contatti o modalità di masticazione, soprattutto con una protesi rimovibile. Piccole aree di pressione o difficoltà persistenti vanno segnalate allo studio, senza tentare modifiche autonome.',
          'La manutenzione comprende igiene accurata dei denti e della protesi, pulizia degli spazi sotto ponti e corone e controlli programmati. Gengive, denti di supporto e componenti protesiche possono cambiare nel tempo e devono essere rivalutati.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Qual è la differenza tra protesi fissa e mobile?',
        answer:
          'La protesi fissa viene cementata o avvitata e non viene rimossa dal paziente; quella mobile viene tolta per la pulizia e secondo le indicazioni ricevute. La scelta dipende dai supporti disponibili e dal progetto complessivo.',
      },
      {
        question: 'La protesi avrà un aspetto naturale?',
        answer:
          'Colore, forma, proporzioni e rapporto con la gengiva vengono studiati per integrare il lavoro con il volto e con i denti vicini. Il risultato possibile dipende anche dalla situazione di partenza e dai materiali indicati.',
      },
      {
        question: 'Quanto tempo serve per abituarsi?',
        answer:
          'L’adattamento varia in base all’estensione e al tipo di protesi. Controlli e piccoli aggiustamenti possono essere utili se persistono punti di pressione, difficoltà nel parlare o contatti poco confortevoli.',
      },
      {
        question: 'Quanto dura una protesi?',
        answer:
          'Non esiste una durata uguale per tutti. Igiene, bruxismo, condizioni dei denti di supporto, cambiamenti dei tessuti e regolarità dei controlli influenzano il mantenimento nel tempo.',
      },
    ],
    pathwayTitle: 'Supporti, progetto, mantenimento',
    pathwayLead:
      'La soluzione nasce dall’equilibrio tra ciò che può sostenerla, la funzione richiesta e la possibilità di mantenerla pulita nel tempo.',
    pathwayCards: [
      {
        icon: 'assessment',
        title: 'Valutiamo i supporti',
        text: 'Denti, gengive, osso, occlusione e vecchie riabilitazioni vengono esaminati prima di scegliere la soluzione.',
      },
      {
        icon: 'design',
        title: 'Progettiamo forma e funzione',
        text: 'Impronte o scansioni, prove e provvisori aiutano a verificare estetica, masticazione e facilità di pulizia.',
      },
      {
        icon: 'monitoring',
        title: 'Manteniamo il risultato',
        text: 'Consegna, istruzioni personalizzate e controlli periodici accompagnano la protesi nel tempo.',
      },
    ],
    finalKicker: 'Denti mancanti o compromessi?',
    finalTitle: 'Progettiamo una soluzione protesica per il tuo sorriso.',
    ogImage: '/assets/menu/casi-clinici-protesi.png',
  },
  '/estetica-indiretta-faccette-porcellana/': {
    seoTitle: 'Faccette in ceramica ed estetica indiretta',
    description:
      'Faccette in ceramica a Modena e Reggio Emilia per armonizzare forma, proporzioni e colore del sorriso dopo una valutazione completa.',
    requestLabel: 'Estetica Indiretta (faccette in porcellana)',
    clinicalCase: 'Estetica',
    heroTitle: 'Faccette in ceramica',
    kicker: 'Estetica del sorriso',
    lead:
      'Le faccette in ceramica permettono di armonizzare forma, proporzioni e colore attraverso un progetto personalizzato. Prima valutiamo smalto, gengive, occlusione e alternative.',
    trustItems: [
      'Progetto estetico condiviso prima del trattamento',
      'Conservazione del tessuto quando possibile',
      'Forma e colore studiati sul volto',
    ],
    formOptions: ['Valutazione estetica del sorriso', 'Denti usurati o discromici', 'Confrontare composito e ceramica'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'Le faccette sono sottili restauri realizzati in laboratorio e applicati sulla superficie visibile dei denti anteriori. Possono modificare forma, proporzioni, colore, piccoli spazi o alcuni segni di usura, quando vi sono condizioni adeguate.',
          'La ceramica non è la risposta automatica a ogni richiesta estetica. Sbiancamento, restauri diretti in composito o ortodonzia possono essere più adatti quando permettono di raggiungere l’obiettivo con un intervento meno esteso.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Il trattamento può essere valutato per denti con alterazioni di forma o colore, ricostruzioni visibili, piccoli spazi o usure che interessano il sorriso. Una quantità adeguata di smalto favorisce un’adesione più affidabile e un approccio conservativo.',
          'Carie, infiammazione gengivale, usura attiva, bruxismo non gestito o problemi di chiusura richiedono attenzione prima di iniziare. In alcuni casi è opportuno stabilizzare la bocca o scegliere un percorso diverso.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'La pianificazione comprende visita, fotografie, scansioni o impronte e analisi del sorriso. Quando utile, una simulazione o un mock-up consente di osservare forme e proporzioni prima di intervenire sui denti.',
          'La preparazione può essere molto contenuta, ma dipende dalla posizione, dal colore e dalla quantità di tessuto disponibile. Dopo le prove, le faccette vengono adesivamente cementate seguendo il progetto concordato.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Nei primi giorni possono comparire una sensibilità lieve o una diversa percezione dei contatti, da riferire se non si riducono. Le gengive devono poter essere pulite senza ostacoli e il morso viene controllato anche dopo la consegna.',
          'Le faccette si mantengono con igiene quotidiana, sedute professionali e controlli periodici. È bene evitare di usare i denti come strumenti o mordere oggetti molto duri; quando indicato, un dispositivo notturno può aiutare a proteggere il lavoro.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Per applicare le faccette bisogna sempre limare i denti?',
        answer:
          'Non sempre nella stessa misura. Posizione, colore, volume e smalto disponibile determinano se sia possibile una preparazione minima o se la ceramica non rappresenti la scelta più conservativa.',
      },
      {
        question: 'Il sorriso rischia di sembrare artificiale?',
        answer:
          'Il progetto considera volto, gengive, traslucenza, colore e caratteristiche dei denti vicini. L’obiettivo non è uniformare tutti i sorrisi, ma trovare proporzioni coerenti con la persona.',
      },
      {
        question: 'Le faccette sono indicate se digrigno i denti?',
        answer:
          'Il bruxismo e i segni di sovraccarico devono essere valutati prima. Possono influenzare il progetto, richiedere un trattamento preliminare o rendere opportuna una protezione notturna.',
      },
      {
        question: 'Quanto durano le faccette in ceramica?',
        answer:
          'La durata dipende da adesione, igiene, quantità di smalto, occlusione, abitudini e controlli. Anche una faccetta ben mantenuta può richiedere nel tempo riparazione o sostituzione.',
      },
    ],
    pathwayTitle: 'Dal desiderio al progetto',
    pathwayLead:
      'L’estetica viene costruita su salute orale, funzione e caratteristiche del volto, confrontando anche le alternative più conservative.',
    pathwayCards: [
      {
        icon: 'goal',
        title: 'Ascoltiamo l’obiettivo',
        text: 'Valutiamo ciò che desideri cambiare insieme a salute orale, funzione e caratteristiche del sorriso.',
      },
      {
        icon: 'design',
        title: 'Condividiamo il progetto',
        text: 'Fotografie, scansioni e simulazioni aiutano a definire forma, proporzioni e alternativa più appropriata.',
      },
      {
        icon: 'prevention',
        title: 'Proteggiamo il lavoro',
        text: 'Dopo l’applicazione controlliamo occlusione, igiene e condizioni dei tessuti con richiami personalizzati.',
      },
    ],
    finalKicker: 'Vuoi cambiare forma o colore?',
    finalTitle: 'Valutiamo le faccette in porcellana per il tuo sorriso.',
    ogImage: '/assets/menu/casi-clinici-estetica.jpg',
  },
  '/chirurgia-stomatologica/': {
    seoTitle: 'Chirurgia stomatologica e orale',
    description:
      'Chirurgia orale a Modena e Reggio Emilia: estrazioni e procedure del cavo orale pianificate dopo una valutazione clinica e radiologica.',
    requestLabel: 'Chirurgia Stomatologica',
    heroTitle: 'Chirurgia orale',
    kicker: 'Chirurgia stomatologica',
    lead:
      'Interventi del cavo orale pianificati dopo una valutazione clinica e radiologica mirata. Indicazioni, alternative e decorso vengono spiegati prima di procedere.',
    trustItems: [
      'Valutazione clinica e radiologica mirata',
      'Benefici, limiti e alternative condivisi',
      'Indicazioni post-operatorie e controllo',
    ],
    formOptions: ['Dente del giudizio', 'Estrazione o residuo radicolare', 'Valutazione chirurgica'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'La chirurgia stomatologica comprende procedure necessarie quando una terapia conservativa non è indicata o non è sufficiente. Può riguardare estrazioni semplici o complesse, denti inclusi, residui radicolari, chirurgia endodontica e alcune lesioni dei tessuti orali.',
          'L’intervento non è il punto di partenza, ma una possibilità all’interno del piano di cura. Prima si chiariscono il problema, ciò che può essere conservato e gli eventuali esami o approfondimenti necessari, compresa l’analisi istologica quando indicata.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Una procedura chirurgica può essere proposta quando un dente non è recuperabile, causa episodi ricorrenti o ostacola un altro trattamento, oppure quando un’area dei tessuti richiede rimozione o approfondimento. La sola presenza di un dente del giudizio non implica automaticamente l’estrazione.',
          'Salute generale, allergie, fumo e farmaci possono modificare pianificazione e decorso. Anticoagulanti, antiaggreganti e altre terapie non devono essere sospesi autonomamente: lo studio valuta se sia necessario coordinarsi con il medico curante.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'Dopo anamnesi, visita e immagini appropriate definiamo estensione, anestesia, possibili rischi e gestione post-operatoria. Nei casi più complessi può essere indicato procedere per fasi o coinvolgere una struttura o uno specialista dedicato.',
          'Prima dell’appuntamento vengono fornite istruzioni specifiche in base alla procedura. È importante portare l’elenco aggiornato dei farmaci, riferire condizioni mediche e seguire soltanto le indicazioni ricevute su alimentazione, accompagnamento e terapie.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Gonfiore, indolenzimento, lieve sanguinamento o temporanea difficoltà ad aprire la bocca possono comparire dopo alcuni interventi. Farmaci, igiene, alimentazione e attività fisica vanno gestiti secondo le istruzioni personalizzate, evitando fumo e manovre che disturbino la ferita.',
          'Sanguinamento che non si controlla, gonfiore in aumento, febbre, dolore che peggiora o difficoltà a respirare o deglutire richiedono un contatto tempestivo con lo studio o un servizio di urgenza. Il controllo serve a verificare la guarigione.',
        ],
      },
    ],
    faqs: [
      {
        question: 'I denti del giudizio devono essere sempre tolti?',
        answer:
          'No. Vengono valutati posizione, possibilità di pulizia, rapporto con i denti vicini, episodi infiammatori e strutture anatomiche. Se non esiste un’indicazione, può essere preferibile il monitoraggio.',
      },
      {
        question: 'L’intervento fa male?',
        answer:
          'La procedura viene normalmente eseguita con anestesia adeguata. Il decorso varia per complessità e risposta individuale; prima vengono spiegate le modalità previste per gestire i fastidi successivi.',
      },
      {
        question: 'Devo sospendere anticoagulanti o altri farmaci?',
        answer:
          'Non autonomamente. Tutte le terapie devono essere comunicate allo studio, che valuterà il rischio e, quando necessario, si coordinerà con il medico prescrittore.',
      },
      {
        question: 'Quando devo ricontattare lo studio?',
        answer:
          'In caso di sintomi che peggiorano, sanguinamento persistente, febbre, alterazioni della sensibilità o difficoltà respiratoria o nella deglutizione. Al termine vengono consegnate indicazioni specifiche.',
      },
    ],
    pathwayTitle: 'Prima, durante e dopo',
    pathwayLead:
      'Una procedura chirurgica ben pianificata parte dall’indicazione corretta, prosegue con scelte condivise e comprende il controllo della guarigione.',
    pathwayCards: [
      {
        icon: 'assessment',
        title: 'Definiamo l’indicazione',
        text: 'Visita, anamnesi e immagini aiutano a chiarire necessità, alternative e priorità dell’intervento.',
      },
      {
        icon: 'surgery',
        title: 'Pianifichiamo la procedura',
        text: 'Tecnica, anestesia, farmaci e indicazioni vengono adattati alla situazione clinica e generale.',
      },
      {
        icon: 'healing',
        title: 'Seguiamo la guarigione',
        text: 'Istruzioni chiare e controllo post-operatorio permettono di osservare il decorso e intervenire se necessario.',
      },
    ],
    finalKicker: 'Hai ricevuto un’indicazione chirurgica?',
    finalTitle: 'Pianifichiamo con attenzione il tuo percorso chirurgico.',
    ogImage: '/assets/original/2021/02/HOME.jpg',
  },
  '/implantologia-tradizionale-computer-guidata/': {
    seoTitle: 'Implantologia tradizionale e computer guidata',
    description:
      'Implantologia tradizionale e computer guidata a Modena e Reggio Emilia per sostituire denti mancanti con un progetto protesico personalizzato.',
    requestLabel: 'Implantologia tradizionale e computer guidata',
    clinicalCase: 'Implantologia',
    heroTitle: 'Implantologia guidata',
    kicker: 'Denti mancanti e riabilitazione',
    lead:
      'Gli impianti possono sostenere corone, ponti o protesi quando uno o più denti sono assenti. Tecnica tradizionale e guidata vengono scelte dopo avere progettato il risultato finale.',
    trustItems: [
      'Protesi finale pianificata prima della chirurgia',
      'Tecnica tradizionale o guidata scelta sul caso',
      'Programma di mantenimento personalizzato',
    ],
    formOptions: ['Sostituire un dente', 'Più denti o intera arcata', 'Valutazione di un impianto esistente'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'Un impianto dentale è un supporto inserito nell’osso sul quale può essere collegato un dente singolo, un ponte o una protesi più estesa. Consente di sostituire elementi mancanti senza utilizzare necessariamente i denti vicini come pilastri.',
          'La chirurgia computer guidata utilizza immagini tridimensionali, scansioni e una guida realizzata sul progetto digitale per trasferire in bocca posizione e inclinazione pianificate. Non elimina fattori biologici, rischi chirurgici o necessità di esperienza clinica e non è indispensabile in ogni caso.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'L’implantologia può essere valutata per la perdita di uno, più denti o di un’intera arcata, anche quando una protesi mobile non offre il comfort desiderato. Il piano considera anche ponti, protesi rimovibili o mantenimento dello spazio quando più appropriati.',
          'Denti e gengive devono essere controllati e deve essere possibile mantenere una buona igiene. Quantità di osso, fumo, storia parodontale, condizioni generali e farmaci possono influenzare indicazione, tempi e modalità del trattamento.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'La pianificazione parte dalla futura protesi e comprende visita, esami radiografici e, quando indicato, imaging tridimensionale e scansioni digitali. Valutiamo spazi, osso, gengiva, occlusione e strutture anatomiche prima di scegliere tecnica e posizione implantare.',
          'Nella procedura guidata una mascherina chirurgica può aiutare a riprodurre il progetto digitale; nella tecnica tradizionale il posizionamento viene gestito direttamente durante l’intervento. La possibilità di un provvisorio immediato dipende dalle condizioni ottenute e dal progetto.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'Il decorso può comprendere gonfiore e fastidio di entità variabile, da gestire seguendo le indicazioni ricevute. Guarigione dei tessuti, integrazione dell’impianto e costruzione della protesi possono richiedere fasi distinte e controlli intermedi.',
          'Impianti e protesi non sono esenti da infiammazione o usura. Igiene domiciliare, pulizia professionale, controllo dei tessuti e gestione dei carichi masticatori sono parte integrante del trattamento nel tempo.',
        ],
      },
    ],
    faqs: [
      {
        question: 'La chirurgia computer guidata è sempre migliore?',
        answer:
          'No. Può essere utile quando il progetto digitale e le condizioni anatomiche ne giustificano l’impiego, ma presenta requisiti e limiti specifici. La scelta viene fatta sul singolo caso.',
      },
      {
        question: 'L’inserimento di un impianto fa male?',
        answer:
          'L’intervento viene eseguito con anestesia adeguata. Fastidio e gonfiore successivi variano con estensione della procedura, condizioni dei tessuti e risposta individuale.',
      },
      {
        question: 'È sempre possibile avere denti fissi subito?',
        answer:
          'No. Il carico immediato richiede condizioni precise, tra cui stabilità implantare sufficiente e progetto protesico compatibile. Quando non è indicato, si pianifica una soluzione provvisoria differente.',
      },
      {
        question: 'Cosa succede se c’è poco osso?',
        answer:
          'La valutazione tridimensionale, quando necessaria, aiuta a definire quantità e posizione dell’osso. In alcuni casi si considerano tecniche rigenerative o un progetto alternativo; non ogni situazione richiede la stessa soluzione.',
      },
    ],
    pathwayTitle: 'La protesi guida il percorso',
    pathwayLead:
      'L’impianto è un supporto: il progetto parte dal dente o dalla riabilitazione che dovrà sostenere e dalle condizioni biologiche disponibili.',
    pathwayCards: [
      {
        icon: 'implant',
        title: 'Partiamo dalla protesi',
        text: 'Definiamo quale dente o riabilitazione deve essere sostenuta e quali condizioni devono essere rispettate.',
      },
      {
        icon: 'surgery',
        title: 'Pianifichiamo la chirurgia',
        text: 'Dati clinici e immagini orientano numero, posizione degli impianti e scelta tra tecnica tradizionale e guidata.',
      },
      {
        icon: 'monitoring',
        title: 'Completiamo e manteniamo',
        text: 'Guarigione, protesi definitiva e richiami periodici fanno parte di un unico percorso.',
      },
    ],
    finalKicker: 'Stai valutando un impianto?',
    finalTitle: 'Valutiamo una soluzione implantare per il tuo caso.',
    ogImage: '/assets/menu/casi-clinici-implantologia.png',
  },
  '/gnatologia-articolazione-temporo-mandibolare/': {
    seoTitle: 'Gnatologia e disturbi dell’articolazione temporo-mandibolare',
    description:
      'Valutazione gnatologica a Modena e Reggio Emilia per dolore mandibolare, muscoli masticatori e disturbi dell’articolazione temporo-mandibolare.',
    requestLabel: 'Gnatologia (disturbi articolazione temporo-mandibolare)',
    heroTitle: 'Gnatologia e disturbi ATM',
    kicker: 'Funzione, muscoli e articolazioni',
    lead:
      'Una valutazione dedicata a mandibola, muscoli masticatori e articolazioni quando dolore, rigidità o difficoltà nei movimenti interferiscono con la quotidianità.',
    trustItems: [
      'Valutazione funzionale completa',
      'Approccio iniziale conservativo e reversibile',
      'Collaborazione multidisciplinare quando utile',
    ],
    formOptions: ['Dolore o rigidità mandibolare', 'Click, blocchi o apertura limitata', 'Controllo bite o bruxismo'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'La gnatologia studia il funzionamento della mandibola, dei muscoli masticatori, delle articolazioni temporo-mandibolari e dei contatti dentali. Aiuta a inquadrare dolore, affaticamento, limitazioni nei movimenti o segni di sovraccarico senza attribuirli automaticamente a una sola causa.',
          'Dolore al volto, mal di testa e rumori articolari possono avere origini diverse e non dipendono sempre dai denti o dall’occlusione. La valutazione serve a riconoscere gli elementi di pertinenza odontoiatrica e a orientare, se necessario, verso altri professionisti.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Può essere utile in presenza di dolore alla mandibola o ai muscoli, blocchi, apertura limitata, affaticamento durante la masticazione, rumori associati a dolore o usura dentale compatibile con sovraccarico. Anche chi usa già un bite ma continua ad avere disturbi può beneficiare di una rivalutazione.',
          'Scatti e rumori non dolorosi sono frequenti e, da soli, non richiedono necessariamente trattamento. Sintomi improvvisi, persistenti o accompagnati da altri disturbi devono essere valutati senza presupporre che l’articolazione ne sia l’unica origine.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'La visita comprende storia dei sintomi, abitudini, qualità del sonno, movimenti mandibolari, palpazione dei muscoli e delle articolazioni e osservazione dei denti. Radiografie, risonanza o altri esami vengono richiesti solo quando possono cambiare l’inquadramento o il piano.',
          'Il primo approccio può includere informazione, modifica di alcune abitudini, esercizi, fisioterapia o un dispositivo intraorale personalizzato quando indicato. Si privilegiano soluzioni reversibili, evitando modifiche permanenti a denti e occlusione come risposta automatica.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'L’andamento viene controllato osservando dolore, funzione, apertura e tolleranza alle attività quotidiane. Un eventuale dispositivo deve essere verificato e regolato; se aumenta il dolore o modifica in modo sgradito la chiusura, va sospeso e rivalutato.',
          'I disturbi possono variare nel tempo e richiedere aggiustamenti del percorso. Quando intervengono sonno, postura, cefalea, dolore persistente o aspetti comportamentali, il confronto con medico, fisioterapista o altri professionisti può essere parte della gestione.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Se l’articolazione fa “click” devo curarla?',
        answer:
          'Non necessariamente. Un rumore senza dolore o limitazione è comune e spesso non richiede trattamento; è opportuno valutarlo se compare dolore, blocco o riduzione dei movimenti.',
      },
      {
        question: 'Il bite risolve tutti i disturbi dell’ATM?',
        answer:
          'No. Un dispositivo può essere utile in situazioni selezionate, ma non è una cura universale e non dovrebbe modificare permanentemente il morso. Va inserito in un piano basato sulla valutazione clinica.',
      },
      {
        question: 'Il bite fa smettere di digrignare i denti?',
        answer:
          'Può proteggere denti e restauri dai carichi e aiutare in alcuni percorsi, ma non garantisce l’eliminazione del bruxismo. Sonno, stress, farmaci e altre condizioni possono influenzare il fenomeno.',
      },
      {
        question: 'Il mal di testa può dipendere dalla mandibola?',
        answer:
          'Cefalea e disturbi temporo-mandibolari possono coesistere, ma un mal di testa non va attribuito automaticamente all’occlusione o all’ATM. Se necessario viene consigliata anche una valutazione medica.',
      },
    ],
    pathwayTitle: 'Osservare prima di intervenire',
    pathwayLead:
      'Storia dei sintomi, funzione e risposta nel tempo guidano un percorso inizialmente conservativo e adattabile.',
    pathwayCards: [
      {
        icon: 'history',
        title: 'Ricostruiamo la storia',
        text: 'Sintomi, abitudini, sonno e attività che aggravano il disturbo aiutano a definire il quadro.',
      },
      {
        icon: 'function',
        title: 'Valutiamo la funzione',
        text: 'Osserviamo movimenti, muscoli, articolazioni, denti e occlusione, richiedendo esami solo se utili.',
      },
      {
        icon: 'progress',
        title: 'Procediamo per gradi',
        text: 'Strategie conservative, eventuale dispositivo e controlli vengono adattati alla risposta individuale.',
      },
    ],
    finalKicker: 'Dolore, rigidità o affaticamento?',
    finalTitle: 'Valutiamo dolore e funzione della tua mandibola.',
    ogImage: '/assets/original/2021/03/IL-DIGITALE-scaled.jpg',
  },
  '/dispositivi-russamento-apnee-notturne/': {
    seoTitle: 'Dispositivi per russamento e apnee notturne',
    description:
      'Dispositivi intraorali personalizzati per russamento e alcuni casi di apnea ostruttiva, inseriti in un percorso coordinato con il medico del sonno.',
    requestLabel: 'Dispositivi contro il russamento e le apnee notturne',
    heroTitle: 'Russamento e apnee notturne',
    kicker: 'Odontoiatria del sonno',
    lead:
      'Dispositivi intraorali su misura che possono contribuire alla gestione del russamento e, su indicazione medica, di alcuni casi di apnea ostruttiva.',
    trustItems: [
      'Diagnosi del sonno prima del dispositivo',
      'Dispositivo personalizzato e regolabile',
      'Controllo odontoiatrico e verifica specialistica',
    ],
    formOptions: ['Russamento già valutato dal medico', 'Apnea ostruttiva diagnosticata', 'Controllo di un dispositivo esistente'],
    sections: [
      {
        title: 'A cosa serve',
        paragraphs: [
          'I dispositivi di avanzamento mandibolare mantengono la mandibola in una posizione controllata durante il sonno e possono favorire il passaggio dell’aria nelle vie aeree superiori. Sono utilizzati per il russamento primario e, quando prescritti nel percorso medico, per alcuni adulti con apnea ostruttiva.',
          'Se efficace e correttamente regolato, il dispositivo può contribuire a gestire il problema respiratorio durante l’uso, ma non equivale a una guarigione e non è indicato per ogni disturbo del sonno. Non tratta le apnee centrali e non sostituisce la valutazione del medico del sonno o la CPAP quando questa resta la terapia indicata.',
        ],
      },
      {
        title: 'Per chi è indicato',
        paragraphs: [
          'Può essere valutato negli adulti con russamento primario confermato dal medico del sonno e, in alcuni casi di apnea ostruttiva, quando lo specialista lo ritiene appropriato, per esempio se la CPAP non è tollerata o viene concordata un’alternativa.',
          'Russare non permette di distinguere autonomamente un semplice rumore da un’apnea. Prima della realizzazione è necessario un inquadramento medico supportato dagli esami del sonno ritenuti appropriati; denti, gengive e articolazioni devono inoltre consentire l’uso del dispositivo.',
        ],
      },
      {
        title: 'Come si svolge e come prepararsi',
        paragraphs: [
          'Il percorso parte dalla diagnosi del medico del sonno e dalla condivisione del relativo referto. La visita odontoiatrica controlla salute orale, stabilità dei denti, movimenti mandibolari e articolazioni, quindi impronte o scansioni consentono di realizzare un dispositivo su misura.',
          'L’avanzamento viene regolato progressivamente per ricercare un equilibrio tra tollerabilità ed efficacia. Il miglioramento del rumore riferito non basta a dimostrare il controllo dell’apnea: la risposta deve essere verificata dal percorso specialistico, spesso con un nuovo esame del sonno.',
        ],
      },
      {
        title: 'Dopo il trattamento',
        paragraphs: [
          'All’inizio possono comparire maggiore salivazione, secchezza, tensione muscolare, fastidio ai denti o alle articolazioni e una temporanea diversa percezione del morso. I controlli permettono di adattare il dispositivo e intercettare eventuali cambiamenti dentali o occlusali.',
          'Pulizia quotidiana, uso secondo prescrizione e verifiche odontoiatriche e mediche sono indispensabili. Sonnolenza persistente, peggioramento dei sintomi o difficoltà nell’uso vanno riferiti al team curante senza sospendere o sostituire autonomamente altre terapie.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Se russo significa che ho un’apnea notturna?',
        answer:
          'Non necessariamente, ma il russamento è uno dei possibili segnali dell’apnea ostruttiva. La distinzione richiede una valutazione medica e, quando indicato, uno studio del sonno.',
      },
      {
        question: 'Il dispositivo può sostituire la CPAP?',
        answer:
          'Solo se il medico del sonno considera appropriata questa alternativa. La CPAP rimane più efficace in molti pazienti e non deve essere sospesa senza una decisione condivisa con lo specialista.',
      },
      {
        question: 'Un dispositivo acquistato online è equivalente?',
        answer:
          'I dispositivi su misura e regolabili consentono di considerare denti, articolazioni e avanzamento mandibolare e di controllare gli effetti nel tempo. Le soluzioni non personalizzate non offrono lo stesso percorso di valutazione e monitoraggio.',
      },
      {
        question: 'Come si verifica che il dispositivo funzioni?',
        answer:
          'Russamento percepito e sensazione soggettiva non sono sufficienti per valutare un’apnea. L’efficacia viene confermata dal medico del sonno attraverso follow-up ed esame ritenuto adeguato.',
      },
    ],
    pathwayTitle: 'Un percorso coordinato',
    pathwayLead:
      'Diagnosi medica, valutazione odontoiatrica e verifica dell’efficacia hanno ruoli distinti e complementari.',
    pathwayCards: [
      {
        icon: 'sleep',
        title: 'Partiamo dalla diagnosi',
        text: 'Il referto del sonno chiarisce natura del problema e ruolo possibile del dispositivo intraorale.',
      },
      {
        icon: 'device',
        title: 'Personalizziamo il dispositivo',
        text: 'Valutazione odontoiatrica, scansioni e regolazione progressiva adattano il trattamento alla bocca.',
      },
      {
        icon: 'monitoring',
        title: 'Verifichiamo la risposta',
        text: 'Controlli dentali e rivalutazione specialistica verificano tollerabilità, effetti ed efficacia respiratoria.',
      },
    ],
    finalKicker: 'Hai già una diagnosi del sonno?',
    finalTitle: 'Affrontiamo russamento e apnee con un percorso coordinato.',
    ogImage: '/assets/original/2021/03/IL-DIGITALE-scaled.jpg',
  },
} satisfies Record<TreatmentMarketingPath, TreatmentMarketingConfig>;
