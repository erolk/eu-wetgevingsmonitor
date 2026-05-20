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

De EU heeft geen ministeries. Het uitvoerend orgaan is de **Europese
Commissie**, opgedeeld in **Directoraten-Generaal (DG's)**. We groeperen
wetgeving op beleidsterrein, met de DG-code erbij (`lib/themas.ts`).

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
- [x] Procesbalk per voorstel (Voorstel → EP → Raad → trilogen → aangenomen) —
  visueel; de actieve fase staat nu vast op "Voorstel" tot OEIL gekoppeld is.
- [ ] **Legislative Observatory (OEIL)** koppelen voor live procedure-fasen
  (zet de procesbalk per voorstel op de juiste fase)
- [ ] Burger-uitleg per voorstel (AI, net als de Wetgevingsmonitor)
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
