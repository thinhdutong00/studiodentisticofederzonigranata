export const landingRoutes = {
  ortodonzia: { standard: '/visita-ortodonzia/', direct: '/visita-ortodonzia-diretta/' },
  parodontologia: { standard: '/visita-parodontologia/', direct: '/visita-parodontologia-diretta/' },
};

export function getLandingRoute(pathname) {
  if (typeof pathname !== 'string') return;
  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  for (const [treatment, routes] of Object.entries(landingRoutes)) {
    if (path === routes.standard) return { treatment, variant: 'standard' };
    if (path === routes.direct) return { treatment, variant: 'direct' };
  }
}
