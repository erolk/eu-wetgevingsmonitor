// Centrale site-instellingen. De productie-URL is bij het bouwen nog niet
// zeker (Vercel), dus overschrijfbaar via NEXT_PUBLIC_SITE_URL.

const STANDAARD_URL = "https://eu-wetgevingsmonitor.vercel.app";

// Maakt van een (mogelijk slordig ingevoerde) env-waarde altijd een geldige
// URL. Zonder dit zou bv. "eu-wetgevingsmonitor.vercel.app" (zonder https://)
// of een typefout de build laten crashen op `new URL(SITE_URL)`.
function veiligeSiteUrl(raw: string | undefined): string {
  let u = (raw ?? "").trim();
  if (!u) return STANDAARD_URL;
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    return new URL(u).toString().replace(/\/$/, "");
  } catch {
    return STANDAARD_URL;
  }
}

export const SITE_URL = veiligeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const SITE_NAAM = "EU-wetgevingsmonitor";

/** De Nederlandse zustersite (Wetgevingsmonitor). */
export const NL_MONITOR_URL = "https://wetgevingsmonitor.vercel.app";

// Ontvanger van het contactformulier (via FormSubmit, geen eigen backend nodig).
// LET OP: bij het eerste bericht stuurt FormSubmit een eenmalige
// activatiemail naar dit adres — die moet je bevestigen. Voor productie kun je
// dit vervangen door FormSubmit's hashed alias (formsubmit.co/<hash>) zodat het
// e-mailadres niet zichtbaar is in de paginabron. Overschrijfbaar via env.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "viaazadev@gmail.com";
