export const consultationObjectives = [
  'Vorrei gli allineatori trasparenti',
  'Mi interessa un apparecchio fisso',
  'Cerco un percorso per mio figlio o mia figlia',
  'Vorrei un consiglio sul trattamento',
] as const;

export { quizConsultationAges as consultationAges } from './quizConsultation.js';

export const consultationSolutions = [
  {
    id: 'allineatori', title: 'Allineatori trasparenti',
    description: 'Il tuo sorriso, con discrezione. Un percorso con mascherine rimovibili, da valutare insieme.',
    detail: 'Gli allineatori trasparenti, come Invisalign®, spostano progressivamente i denti attraverso una sequenza di mascherine personalizzate. Si rimuovono durante i pasti e l’igiene orale e richiedono costanza nell’utilizzo. La visita serve a capire se sono indicati per il tuo caso.',
    image: 'ortodonzia-allineatori-dispositivo-1200.webp', alt: 'Dispositivo ortodontico con allineatori trasparenti',
    objective: consultationObjectives[0],
  },
  {
    id: 'apparecchio', title: 'Apparecchio fisso',
    description: 'Movimenti guidati. Una soluzione da considerare in base alla tua situazione clinica.',
    detail: 'L’apparecchio fisso permette di guidare gli spostamenti dei denti attraverso attacchi e archi ortodontici. Può essere indicato in diverse situazioni, anche complesse. Durante la valutazione parliamo di obiettivi, igiene e controlli necessari per affrontare il percorso.',
    image: 'ortodonzia-apparecchio-fisso-720.webp', alt: 'Apparecchio ortodontico fisso',
    objective: consultationObjectives[1],
  },
  {
    id: 'bambini', title: 'Bambini e ragazzi',
    description: 'Accompagniamo la crescita. Valutiamo denti e sviluppo delle arcate al momento giusto.',
    detail: 'Nei bambini e negli adolescenti valutiamo la permuta dentale, il morso e lo sviluppo delle arcate. La visita aiuta a capire se è opportuno intervenire o se è preferibile osservare la crescita con controlli periodici. Il genitore partecipa alle scelte del percorso.',
    image: 'ortodonzia-bambini-adolescenti-sorriso-720.webp', alt: 'Sorriso di una giovane paziente',
    objective: consultationObjectives[2],
  },
  {
    id: 'adulti', title: 'Ortodonzia per adulti',
    description: 'Uno spazio per te. Valutiamo come migliorare allineamento e morso, anche da adulti.',
    detail: 'Un trattamento ortodontico può essere valutato anche in età adulta. Prima di iniziare verifichiamo la salute di denti, gengive e strutture di sostegno. Ti aiutiamo a scegliere un percorso compatibile con le esigenze cliniche e con la tua quotidianità.',
    image: 'ortodonzia-sorriso-studio-1440.webp', alt: 'Paziente adulta durante una visita nello studio',
    objective: consultationObjectives[3],
  },
  {
    id: 'piano', title: 'Un piano su misura',
    description: 'Prima capiamo, poi scegliamo. Diagnosi, alternative, tempi e costi spiegati con chiarezza.',
    detail: 'Partiamo dall’ascolto e dalla valutazione clinica. Gli eventuali esami e approfondimenti vengono indicati in base alla situazione. Prima di iniziare ricevi le informazioni sulle opzioni di trattamento e un preventivo personalizzato, così puoi decidere consapevolmente.',
    image: 'ortodonzia-visita-1440.webp', alt: 'Valutazione odontoiatrica in studio',
    objective: consultationObjectives[3],
  },
  {
    id: 'controlli', title: 'Seguiti, passo dopo passo',
    description: 'Dal primo controllo alla contenzione. Un riferimento durante tutto il tuo percorso.',
    detail: 'I controlli periodici permettono di seguire l’andamento del trattamento e di darti indicazioni sull’uso dei dispositivi e sull’igiene. Al termine parliamo della contenzione, una fase essenziale per aiutare a mantenere l’allineamento raggiunto.',
    image: 'ortodonzia-sorriso-specchio-1440.webp', alt: 'Paziente che osserva il proprio sorriso allo specchio',
    objective: consultationObjectives[3],
  },
];
