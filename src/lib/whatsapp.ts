/** +56 9 6355 0717 — sin espacios ni signos para wa.me */
export const NUMERO_WHATSAPP = "56963550717";

export function enlaceWhatsApp(texto: string): string {
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${texto}`;
}
