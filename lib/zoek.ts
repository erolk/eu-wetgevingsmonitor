import { getThema } from "@/lib/themas";
import type { Voorstel } from "@/lib/eurlex";

const COMBINEERTEKEN = new RegExp("[\\u0300-\\u036f]", "g");

/** Lowercase + accenten verwijderen, zodat zoeken accent-ongevoelig is. */
export function normaliseer(s: string): string {
  return s.normalize("NFD").replace(COMBINEERTEKEN, "").toLowerCase();
}

/** De doorzoekbare tekst van één voorstel: titel, onderwerpen, uitleg, CELEX,
 *  type en de namen van de beleidsterreinen waar het onder valt. */
export function zoektekst(v: Voorstel): string {
  const themas = v.themaSlugs.map((s) => getThema(s)?.naam ?? "").join(" ");
  return [v.titel, v.onderwerpen.join(" "), v.uitleg, v.celex, v.type, themas].join(
    " ",
  );
}

/** Filtert voorstellen op een zoekterm: accent-ongevoelig, en ALLE losse
 *  woorden moeten ergens in het voorstel voorkomen (AND). Lege term → []. */
export function zoekVoorstellen(
  voorstellen: Voorstel[],
  query: string,
): Voorstel[] {
  const woorden = normaliseer(query.trim()).split(/\s+/).filter(Boolean);
  if (woorden.length === 0) return [];
  return voorstellen.filter((v) => {
    const tekst = normaliseer(zoektekst(v));
    return woorden.every((w) => tekst.includes(w));
  });
}
