# Overzicht — EU-wetgevingsmonitor

Korte samenvatting van wat er in de site zit en welke onderdelen automatisch
werken. Laatst bijgewerkt: 20 mei 2026.

---

## 1. Features (wat de bezoeker ziet)

| Feature | Wat het doet | Bestand(en) |
|---|---|---|
| **Live EU-voorstellen per beleidsterrein** | Per terrein een lijst van recente EU-voorstellen (titel, type, datum, link naar EUR-Lex). | `app/beleidsterrein/[slug]/page.tsx`, `app/components/Voorstelkaart.tsx` |
| **Burger-uitleg per voorstel** | Blokje "Wat betekent dit voor Nederland?" met een korte uitleg in gewone taal bij elk voorstel. | `lib/burgeruitleg.ts`, `Voorstelkaart.tsx` |
| **Procesbalk + status** | Visuele balk met de 5 fasen; per voorstel staat er "Aangenomen op {datum}" (+ link naar de wet) of "in behandeling". | `app/components/Procesbalk.tsx`, `Voorstelkaart.tsx` |
| **Type-badge** | Kleurcode per type: Verordening (blauw), Richtlijn (geel), Besluit (donker), Mededeling/Aanbeveling (neutraal). | `Voorstelkaart.tsx` |
| **EUROVOC-onderwerpen** | Kleine chips met de belangrijkste trefwoorden per voorstel. | `Voorstelkaart.tsx` |
| **Homepage met tellingen** | Aantal lopende voorstellen per beleidsterrein + totaal, live. | `app/page.tsx` |
| **Uitleg over het proces** | Statische uitlegpagina over hoe EU-wetgeving werkt. | `app/hoe-het-werkt/page.tsx` |
| **Mobiel menu** | Hamburgermenu op kleine schermen. | `app/components/MobileMenu.tsx`, `app/layout.tsx` |
| **Zoekfunctie** | `/zoeken` doorzoekt alle voorstellen op titel, onderwerp, type en uitleg (accent-ongevoelig, alle woorden moeten matchen). | `app/zoeken/page.tsx` |
| **Contactpagina** | `/contact` met formulier (naam, e-mail, bericht) via FormSubmit + honeypot tegen spam. | `app/contact/page.tsx`, `app/components/ContactFormulier.tsx` |
| **Abonneerknop per terrein** | Knop "Abonneer op dit beleidsterrein" met e-mailveld; aanmelding gaat via FormSubmit naar de beheerder. | `app/components/Abonneer.tsx` |
| **EU-vlag + NL-monitor-switch** | EU-vlag bij het logo; in het menu een NL-vlag-knop die naar de Nederlandse Wetgevingsmonitor linkt. | `EUVlag.tsx`, `NLVlag.tsx`, `layout.tsx` |

---

## Beveiliging & vindbaarheid (SEO)

- **Security headers** in `next.config.mjs`: Content-Security-Policy, HSTS,
  X-Frame-Options (DENY), X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy, Cross-Origin-Opener-Policy; `X-Powered-By` verborgen.
  In dev iets soepeler (HMR), in productie strak.
- **Veilige input**: zoek- en formulier-input wordt niet in queries geïnjecteerd;
  formulieren hebben een honeypot tegen spam; externe links gebruiken
  `rel="noopener noreferrer"`.
- **SEO/indexering**: `app/robots.ts` (robots.txt), `app/sitemap.ts`
  (sitemap.xml met alle terreinen), per-pagina titels/beschrijvingen +
  Open Graph, en canonical-URL's. Zo kan Google de site volledig indexeren.

Zie **`DEPLOY.md`** voor het live zetten (env-vars, cron, FormSubmit-activatie).

---

## 2. Automatiseringen (wat vanzelf gebeurt)

1. **Dagelijks live ophalen uit EUR-Lex.** De voorstellen komen via een
   SPARQL-query rechtstreeks uit de officiële EU-database (EUR-Lex Cellar). De
   data wordt 1× per dag automatisch ververst (Next.js ISR, `revalidate: 1 dag`).
   Nieuwe voorstellen verschijnen dus vanzelf, zonder dat er iets handmatig hoeft.
   → `lib/eurlex.ts`

2. **Automatische indeling in beleidsterreinen.** De site gebruikt de officiële
   EUR-Lex-indeling van **32 beleidsvelden** ("Samenvattingen van de EU-wetgeving").
   Elk voorstel wordt op basis van de EUR-Lex "subject-matter"-codes (FISC, ENV,
   TRAN, …) automatisch onder het juiste terrein geplaatst; één voorstel kan onder
   meerdere terreinen vallen. Sommige terreinen hebben (tijdelijk) geen lopende
   voorstellen.
   → `lib/themas.ts` (de 32 terreinen) + `lib/eurlex.ts` (tabel `CODE_NAAR_THEMA`)

3. **Automatische type-herkenning.** Het type (verordening / richtlijn / besluit /
   mededeling / aanbeveling) wordt automatisch uit de titel bepaald.
   → `lib/eurlex.ts` (`bepaalType`)

4. **Automatische tellingen.** De aantallen per terrein op de homepage worden
   automatisch berekend uit de opgehaalde voorstellen.
   → `lib/eurlex.ts` (`getAantallenPerThema`)

4b. **Automatische aangenomen-status.** Per voorstel wordt dagelijks bij EUR-Lex
   gecheckt of er al een definitieve handeling is aangenomen (relatie
   `resource_legal_adopts_resource_legal`). Zo ja → "Aangenomen" + datum + link;
   zo nee → "in behandeling". De exacte tussenfase (EP/Raad/trilogen) wordt
   (nog) niet live gevolgd en dus ook niet getoond.
   → `lib/eurlex.ts`

5. **Sjabloon-uitleg als terugval.** Voorstellen die nog geen vooraf geschreven
   uitleg hebben, krijgen automatisch een standaard-uitleg op basis van het type
   en de onderwerpen — zodat er nooit een leeg vak staat.
   → `lib/eurlex.ts` (`sjabloonUitleg`)

6. **Foutbestendigheid.** Als EUR-Lex even onbereikbaar is, valt de site netjes
   terug op een melding in plaats van te crashen (time-out + foutafhandeling).
   → `lib/eurlex.ts` (`getVoorstellen`, `fout`-vlag)

---

## 3. Niet-automatisch (handmatig bijwerken)

- **De burger-uitleg per voorstel** (`lib/burgeruitleg.ts`) is vooraf opgesteld:
  303 samenvattingen, per CELEX-nummer. Dit is bewust geen live AI-aanroep
  (geen API-sleutel/kosten nodig). Nieuwe voorstellen krijgen de sjabloon-uitleg
  tot de cache wordt bijgewerkt.
  **Bijwerken:** nieuwe titels samenvatten en toevoegen vóór de `// <APPEND>`-
  markering in `lib/burgeruitleg.ts`.

---

## 4. Wijzigingen deze sessie (in het kort)

**Nieuw:**
- `lib/eurlex.ts` — live datalaag (EUR-Lex SPARQL, indeling, types, caching).
- `lib/burgeruitleg.ts` — 303 burger-samenvattingen per CELEX.
- `app/components/Procesbalk.tsx` — procesbalk.
- `app/components/Voorstelkaart.tsx` — voorstelkaart met uitleg, badge, chips, procesbalk.

**Aangepast:**
- `app/beleidsterrein/[slug]/page.tsx` — toont nu live voorstellen i.p.v. placeholder.
- `app/page.tsx` — homepage met live tellingen per terrein.
- `app/over/page.tsx` — statustekst bijgewerkt.
- `app/layout.tsx` — header-onderrand gelijkgetrokken met de Wetgevingsmonitor (`border-b-[0.5px]`); mobiel menu.
- `README.md` — roadmap bijgewerkt.

---

## 5. Roadmap-status

- [x] Live data via EUR-Lex (voorstellen per terrein)
- [x] Procesbalk per voorstel (visueel)
- [x] Burger-uitleg per voorstel ("Wat betekent dit voor jou?")
- [ ] Legislative Observatory (OEIL) — live fase per voorstel
- [ ] Koppeling EU-richtlijn → Nederlandse implementatiewet
- [ ] NL/EN taalschakelaar
- [ ] Stemmingen Europees Parlement per fractie
- [ ] Deploy op Vercel

---

## 6. Lokaal draaien

```bash
npm run dev       # ontwikkelserver op http://localhost:3000
npm run build     # productie-build (controleert ook types)
```
