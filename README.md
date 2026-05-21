# EU-wetgevingsmonitor

Inzicht voor burgers in welke wetgeving de Europese Unie maakt, per
beleidsterrein, en hoe die doorwerkt in Nederland.

Zustersite van de Nederlandse **Wetgevingsmonitor**: waar die de Tweede/Eerste
Kamer volgt, laat deze site zien wáár veel regels beginnen — in Brussel.

## Tech

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind**
- Zelfde stack als de Wetgevingsmonitor, zodat patronen herbruikbaar zijn
- Kleuren: EU-blauw (`#003399`) als primair, EU-geel (`#FFCC00`) als accent

## Lokaal draaien

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Routes (huidige stand)

| Route | Wat |
|---|---|
| `/` | Homepage: intro + grid van beleidsterreinen, met live aantal voorstellen per terrein |
| `/beleidsterrein/[slug]` | Per beleidsterrein: live EU-voorstellen uit EUR-Lex, met procesbalk en link naar de volledige tekst |
| `/hoe-het-werkt` | Het EU-wetgevingsproces + doorwerking naar Nederland |
| `/over` | Achtergrond, bronnen en disclaimer |

## Beleidsterreinen i.p.v. ministeries

De EU heeft geen ministeries. We delen de wetgeving in volgens de **officiële
EUR-Lex-indeling "Samenvattingen van de EU-wetgeving"**: **32 beleidsvelden**
(zie `lib/themas.ts`, bron: <https://eur-lex.europa.eu/browse/summaries.html>).
Voorstellen worden aan terreinen gekoppeld via de EUR-Lex `subject-matter`-codes
(`lib/eurlex.ts`).

## Het wetgevingsproces (kort)

1. **Commissie** stelt voor (alleenrecht van initiatief)
2. **Europees Parlement** + **Raad van de EU** behandelen elk
3. **Trilogen**: Parlement + Raad + Commissie onderhandelen één tekst
4. Beide nemen aan → **publicatie** in het Publicatieblad
5. **Verordening** geldt direct; **richtlijn** moet Nederland nog omzetten in
   eigen wetgeving (→ verschijnt dan op de Wetgevingsmonitor)

## Roadmap

- [x] **Live data via EUR-Lex** (SPARQL) — recente voorstellen per terrein, met
  NL-titel, type (verordening/richtlijn/besluit), EUROVOC-trefwoorden en CELEX.
  Categorisatie via EUR-Lex `subject-matter`-codes (zie `lib/eurlex.ts`). Dagelijks
  gecachet (ISR).
- [x] Procesbalk per voorstel (Voorstel → EP → Raad → trilogen → aangenomen).
- [x] **Aangenomen-status via EUR-Lex** — per voorstel betrouwbaar bepaald
  (relatie `resource_legal_adopts_resource_legal`): "Aangenomen" + datum + link
  naar de definitieve handeling, of "in behandeling". Dagelijks ververst. De
  exacte tussenfase (EP/Raad/trilogen) claimen we bewust niet zolang die niet
  live wordt gevolgd.
- [x] Burger-uitleg per voorstel ("Wat betekent dit voor jou?") — korte
  samenvatting in gewone taal op elke voorstelkaart. Vooraf gegenereerd en
  opgeslagen in `lib/burgeruitleg.ts` (per CELEX); nieuwe voorstellen vallen
  terug op een sjabloon-uitleg o.b.v. wettype + onderwerpen tot ze worden
  bijgewerkt.
- [ ] **Legislative Observatory (OEIL)** koppelen voor live procedure-fasen
  (zet de procesbalk per voorstel op de juiste fase)
- [ ] Koppeling EU-richtlijn → Nederlandse implementatiewet
- [ ] NL/EN taalschakelaar
- [ ] Stemmingen Europees Parlement per fractie
- [ ] Deploy op Vercel

## Databronnen (gepland)

| Bron | Gebruik |
|---|---|
| [EUR-Lex](https://eur-lex.europa.eu) | Wetgeving + voorstellen (REST/SPARQL, CC-BY) |
| [Legislative Observatory](https://oeil.secure.europarl.europa.eu) | Voortgang per procedure |
| [EP Open Data](https://data.europarl.europa.eu) | Stemmingen, leden, agenda |

## Disclaimer

Geen officiële uiting van de Europese Unie of de Rijksoverheid. Brondata is
open. Voor juridische zekerheid: raadpleeg het Publicatieblad van de EU.
