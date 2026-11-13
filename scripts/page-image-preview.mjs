// A collection or a text-only page can contain photos in related links or widgets.
// Use those for the page preview only if the page explicitly selected that photo.
const secondaryImages = '[data-cases-carousel], .review-card, dialog, form, .guide-links';

function attribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function updatePageImagePreview(html, pageUrl, images, $) {
  const og = $('head meta[property="og:image"][data-select-page-photo]');
  if (!og.length || !images.length) return html;

  const preferred = og.attr('data-select-page-photo');
  const preferredUrl = preferred ? new URL(preferred, pageUrl).href : null;
  const image = images.find(({ url }) => url.href === preferredUrl)
    ?? images.find(({ element }) => !$(element).closest(secondaryImages).length);
  if (!image) return html;

  const values = {
    'og:image': image.url.href,
    'og:image:alt': image.alt,
    'twitter:image': image.url.href,
    'twitter:image:alt': image.alt,
  };

  // Only replace the known tags emitted by BaseLayout. Dimensions and MIME type
  // describe its default logo and must not be carried over to the photograph.
  return html.replace(/<head\b[^>]*>[\s\S]*?<\/head>/i, (head) =>
    head.replace(/<meta (property|name)="((?:og|twitter):image(?::(?:alt|width|height|type))?)"[^>]*>/g,
      (_, attributeName, key) => values[key]
        ? `<meta ${attributeName}="${key}" content="${attribute(values[key])}">`
        : ''));
}
