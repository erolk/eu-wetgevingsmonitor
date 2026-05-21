# Deployen (Vercel)

Stappen om de EU-wetgevingsmonitor live te zetten op Vercel.

## 1. Project koppelen
- Push de repo naar GitHub en importeer 'm in Vercel (framework: Next.js — wordt
  automatisch herkend). Geen extra build-instellingen nodig.

## 2. Omgevingsvariabelen (Vercel → Settings → Environment Variables)

| Variabele | Nodig? | Waarde |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | aanbevolen | De definitieve URL, bijv. `https://eu-wetgevingsmonitor.vercel.app` (voor canonical-links, sitemap, Open Graph). |
| `CRON_SECRET` | nodig voor auto-verversen | Een lange willekeurige string. Vercel stuurt die mee bij de cron-aanroep; zonder deze var weigert `/api/revalidate`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | optioneel | Ontvanger van contact/abonneer-berichten. Standaard staat dit op een adres in `lib/site.ts`. |

## 3. Dagelijks verversen (al ingebouwd)
- De voorstellen verversen sowieso elke 24u via ISR (`revalidate` in
  `lib/eurlex.ts`).
- Daarbovenop draait een **Vercel Cron** (`vercel.json`) die elke dag om 06:00
  `/api/revalidate` aanroept en de data forceert te verversen — óók zonder
  bezoekers. Werkt zodra `CRON_SECRET` is ingesteld.
- Handmatig verversen: `GET /api/revalidate?secret=<CRON_SECRET>`.

## 4. Contact- en abonneerformulier activeren (FormSubmit)
- Beide formulieren sturen via **FormSubmit** (geen eigen backend).
- Bij het **eerste** verzonden bericht stuurt FormSubmit een eenmalige
  **activatiemail** naar `CONTACT_EMAIL`. Bevestig die één keer; daarna komen
  berichten binnen.
- Optioneel veiliger: maak op formsubmit.co een **hashed alias** aan en zet die
  in plaats van het e-mailadres, zodat het adres niet in de paginabron staat.

## 5. Beveiliging
- Security headers (CSP, HSTS, X-Frame-Options, enz.) staan in
  `next.config.mjs` en gelden automatisch op Vercel (HTTPS).
- `npm audit` meldt 2 *moderate* issues in een build-afhankelijkheid (postcss via
  Next). Dit speelt alleen tijdens het bouwen, niet voor bezoekers. Op te lossen
  door Next later te upgraden; geen `--force` nodig die de boel kan breken.

## Nog te bouwen voor een volwaardig abonnement
De abonneerknop legt nu aanmeldingen vast (de beheerder krijgt ze per mail).
Een volledige stroom — dubbele opt-in + automatische e-mail zodra er een nieuw
voorstel op een terrein verschijnt — vereist een database + e-maildienst (bijv.
Vercel Postgres/KV + Resend) gekoppeld aan de bestaande dagelijkse cron.
