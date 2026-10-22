export interface OrthodonticReview {
  author: string;
  initials: string;
  avatar?: string;
  rating: number;
  treatment: string;
  office: 'Modena' | 'Reggio Emilia';
  excerpt: string;
  sourceUrl: string;
}

// Short, verbatim excerpts checked against the public Google Business profiles
// on 16 October 2026. Only include reviews that explicitly name orthodontic care.
export const orthodonticReviews: OrthodonticReview[] = [
  {
    author: 'Elena Saenko',
    initials: 'ES',
    rating: 5,
    treatment: 'Invisalign',
    office: 'Modena',
    excerpt: '… la mia esperienza sia in odontoiatria che ortodonzia (trattamento Invisalign) è stata molto positiva.',
    sourceUrl: 'https://www.google.com/maps/place/Studio+dentistico+Federzoni-Granata+Modena/@44.6359354,10.9139333,17z/data=!4m8!3m7!1s0x477fef7a9dda7dc9:0x8536638d2bf8e3b4!8m2!3d44.6359354!4d10.9139333!9m1!1b1!16s%2Fg%2F1tfjjzyp',
  },
  {
    author: 'Mariachiara Merciadri',
    initials: 'MM',
    rating: 5,
    treatment: 'Allineatori',
    office: 'Reggio Emilia',
    excerpt: 'Lavoro impeccabile: professionalità, disponibilità, gentilezza e denti praticamente perfetti.',
    sourceUrl: 'https://www.google.com/maps/place/Studio+dentistico+Federzoni-Granata+Reggio+Emilia/@44.6975445,10.6290509,17z/data=!4m8!3m7!1s0x47801d48aa100ca3:0x6b4d87856ac138b4!8m2!3d44.6975445!4d10.6290509!9m1!1b1!16s%2Fg%2F11rsslj97m',
  },
  {
    author: 'Emilio Spanghero',
    initials: 'ES',
    avatar: '/assets/reviews/emilio-spanghero.png',
    rating: 5,
    treatment: 'Percorso ortodontico',
    office: 'Reggio Emilia',
    excerpt: '… grazie a un trattamento ortodontico studiato su misura ho finalmente raggiunto il risultato desiderato.',
    sourceUrl: 'https://www.google.com/maps/place/Studio+dentistico+Federzoni-Granata+Reggio+Emilia/@44.6975445,10.6290509,17z/data=!4m8!3m7!1s0x47801d48aa100ca3:0x6b4d87856ac138b4!8m2!3d44.6975445!4d10.6290509!9m1!1b1!16s%2Fg%2F11rsslj97m',
  },
];
