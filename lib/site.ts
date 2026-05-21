// Centrale site-instellingen. De productie-URL is bij het bouwen nog niet
// zeker (Vercel), dus overschrijfbaar via NEXT_PUBLIC_SITE_URL.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://eu-wetgevingsmonitor.vercel.app"
).replace(/\/$/, "");

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
