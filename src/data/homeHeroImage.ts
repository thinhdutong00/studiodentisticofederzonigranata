const base = '/assets/optimized/studio-dentistico-federzoni-granata-equipe';
// These assets are served with immutable caching.
const photoUrl = (suffix: string) => `${base}${suffix}?v=2`;

export const homeHeroImage = {
  src: photoUrl('.jpg'),
  width: 1920,
  height: 1280,
  alt: 'I dottori Federzoni e Granata accanto alla poltrona odontoiatrica dello studio',
  desktopSrc: photoUrl('-1440.avif'),
  desktopSrcset: [1440, 2400, 3240].map((width) => `${photoUrl(`-${width}.avif`)} ${width}w`).join(', '),
  mobileSrc: photoUrl('-mobile.avif'),
};
