export const orthodonticResultsPath = '/risultati-ortodonzia/';

// Foto e abbinamenti Prima/Dopo della pagina originale /ortodonzia/.
// Conserviamo la documentazione senza attribuire età, tempi o terapie non indicati.
export const orthodonticResults = [
  {
    id: 'caso-1', title: 'Caso 1',
    before: { smile: '/assets/original/2021/03/282.jpg', detail: '/assets/original/2020/11/280.jpg' },
    after: { smile: '/assets/original/2021/03/283.jpg', detail: '/assets/original/2020/11/281.jpg' },
  },
  {
    id: 'caso-2', title: 'Caso 2',
    before: { smile: '/assets/original/2021/03/287.jpg', detail: '/assets/original/2020/11/285.jpg' },
    after: { smile: '/assets/original/2021/03/288.jpg', detail: '/assets/original/2020/11/286.jpg' },
  },
  {
    id: 'caso-3', title: 'Caso 3',
    before: { smile: '/assets/original/2021/03/300.jpg', detail: '/assets/original/2020/11/298.jpg' },
    after: { smile: '/assets/original/2021/03/301.jpg', detail: '/assets/original/2020/11/299.jpg' },
  },
] as const;
