const base = '/assets/optimized/studio-dentistico-federzoni-granata-equipe';

export const homeHeroImage = {
  src: `${base}.jpg`,
  width: 1920,
  height: 1280,
  alt: 'I dottori Federzoni e Granata accanto alla poltrona odontoiatrica dello studio',
  desktopSrc: `${base}-1440.avif`,
  desktopSrcset: [1440, 2400, 3240].map((width) => `${base}-${width}.avif ${width}w`).join(', '),
  mobileSrc: `${base}-mobile.avif`,
};
