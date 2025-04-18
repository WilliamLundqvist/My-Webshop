/**
 * Funktioner för säker formatering av data
 */

/**
 * Tar bort HTML-taggar från en sträng för säker rendering
 * @param htmlString Sträng som kan innehålla HTML
 * @returns Säker sträng utan HTML-taggar
 */
export function stripHtml(htmlString: string): string {
  if (!htmlString) return '';
  return htmlString.replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Decodar HTML entities som &nbsp;, &euro; etc.
 * @param html Sträng som kan innehålla HTML entities
 * @returns Decodad sträng
 */
export function decodeHtmlEntities(html: string): string {
  if (!html) return '';

  // Server-safe implementation that works both in browser and server
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&euro;/g, '€')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}

/**
 * Formaterar pris-HTML på ett säkert sätt
 * @param priceHtml HTML-formaterat pris från API
 * @returns Formaterat pris utan osäker HTML
 */
export function formatPrice(priceHtml: string): string {
  if (!priceHtml) return '';

  // Steg 1: Ta bort HTML-taggar
  const strippedHtml = stripHtml(priceHtml);

  // Steg 2: Decoda HTML entities
  return decodeHtmlEntities(strippedHtml);
}

/**
 * Skapar ett säkert produktnamn
 * @param name Produktnamn
 * @param color Eventuell färg
 * @param size Eventuell storlek
 * @returns Formaterat produktnamn med egenskaper
 */
export function formatProductName(
  name: string,
  color?: string | null,
  size?: string | null
): string {
  let result = name || '';

  if (color) {
    result += ` - ${color}`;
  }

  if (size) {
    result += ` / ${size}`;
  }

  return result;
}

// Lägg till i lib/utils.ts om funktionen inte redan finns
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
