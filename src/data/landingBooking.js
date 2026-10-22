export const landingBookingAges = ['Fino a 17 anni', '18–25 anni', '26–35 anni', '36–50 anni', '51–65 anni', 'Oltre 65 anni'];
export const landingBookingDays = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Non ho preferenze'];
export const landingBookingTimes = [
  { value: 'Mattina', description: 'Preferisco una visita al mattino.', icon: 'sun' },
  { value: 'Pomeriggio', description: 'Preferisco una visita al pomeriggio.', icon: 'clock' },
  { value: 'Non ho preferenze', description: 'Concordiamo insieme l’orario.', icon: 'calendar' },
];

export const landingBookingTreatments = {
  ortodonzia: {
    path: '/visita-ortodonzia/',
    label: 'Ortodonzia',
    treatment: 'Ortodonzia e allineatori',
    requestTreatment: 'Ortodonzia e Allineatori invisibili (adulti e bimbi)',
    visit: 'visita ortodontica',
    question: 'Cosa vorresti valutare per il tuo sorriso?',
    description: 'Scegli da dove iniziare. Valuteremo insieme il percorso più adatto durante la visita.',
    options: [
      { value: 'Allineatori trasparenti', label: 'Allineatori trasparenti', description: 'Vorrei valutare una soluzione come Invisalign®.', icon: 'aligner' },
      { value: 'Apparecchio ortodontico tradizionale', label: 'Apparecchio fisso', description: 'Vorrei informazioni su un percorso con apparecchio.', icon: 'braces' },
      { value: 'Valutazione ortodontica per un bambino o ragazzo', label: 'Bambini e ragazzi', description: 'Vorrei richiedere una visita per mio figlio o mia figlia.', icon: 'person' },
      { value: 'Voglio prima confrontarmi con un vostro specialista', label: 'Un consiglio dallo specialista', description: 'Vorrei capire quali possibilità valutare.', icon: 'talk' },
    ],
  },
  parodontologia: {
    path: '/visita-parodontologia/',
    label: 'Parodontologia',
    treatment: 'Parodontologia',
    requestTreatment: 'Parodontologia (cure gengivali)',
    visit: 'visita parodontale',
    question: 'Da cosa vorresti iniziare per le tue gengive?',
    description: 'Indica il motivo della richiesta. Sarà il punto di partenza del confronto con lo specialista.',
    options: [
      { value: 'Gengive che sanguinano o sono infiammate', label: 'Sanguinamento o infiammazione', description: 'Ho notato sangue o fastidio alle gengive.', icon: 'gum' },
      { value: 'Recessione gengivale o denti che si muovono', label: 'Recessioni o denti mobili', description: 'Le gengive si ritirano o i denti sono meno stabili.', icon: 'tooth' },
      { value: 'Mantenimento dopo una terapia parodontale', label: 'Controllo e mantenimento', description: 'Vorrei proseguire le cure o fare un controllo.', icon: 'calendar' },
      { value: 'Voglio prima confrontarmi con un vostro specialista', label: 'Un consiglio dallo specialista', description: 'Vorrei capire come prendermi cura delle gengive.', icon: 'talk' },
    ],
  },
};

export function getLandingBookingConfig(source) {
  return Object.values(landingBookingTreatments).find(config => config.path === `${String(source).replace(/\/$/, '')}/`);
}

export function validLandingBookingDays(value) {
  const days = String(value).split(',').map(day => day.trim()).filter(Boolean);
  return days.length > 0 && days.length <= 5 && new Set(days).size === days.length
    && days.every(day => landingBookingDays.includes(day))
    && (!days.includes('Non ho preferenze') || days.length === 1);
}
