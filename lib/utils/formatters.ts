/**
 * Funktioner för säker formatering av data
 */

/**
 * Tar bort HTML-taggar från en sträng för säker rendering
 * @param htmlString Sträng som kan innehålla HTML
 * @returns Säker sträng utan HTML-taggar
 */
export function stripHtml(htmlString: string): string {
  if (!htmlString) return "";
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
}

/**
 * Decodar HTML entities som &nbsp;, &euro; etc.
 * @param html Sträng som kan innehålla HTML entities
 * @returns Decodad sträng
 */
export function decodeHtmlEntities(html: string): string {
  if (!html) return "";

  // Skapa en temporär div-element för att använda webbläsarens inbyggda parser
  const txt = document.createElement("textarea");
  txt.innerHTML = html;

  // textContent ger den decodade versionen
  return txt.value;
}

/**
 * Formaterar pris-HTML på ett säkert sätt
 * @param priceHtml HTML-formaterat pris från API
 * @returns Formaterat pris utan osäker HTML
 */
export function formatPrice(priceHtml: string): string {
  if (!priceHtml) return "";

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
  let result = name || "";

  if (color) {
    result += ` - ${color}`;
  }

  if (size) {
    result += ` / ${size}`;
  }

  return result;
}
