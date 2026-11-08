import { site } from './site';

export const publishedPages = [...site.pages, ...site.navigationPages, ...site.treatmentPages]
  .filter((page) => page.path !== '/landing-ortodonzia/');
