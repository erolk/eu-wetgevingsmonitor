// De EU kent geen "ministeries". Het uitvoerend orgaan is de Europese
// Commissie, opgedeeld in Directoraten-Generaal (DG's) — vergelijkbaar met
// ministeries. Elke Eurocommissaris heeft een portefeuille die met één of
// meer DG's correspondeert. We groeperen wetgeving op beleidsterrein, met de
// DG-code(s) erbij ter herkenning.
//
// Bron: ec.europa.eu (Departments and executive agencies).

export type Thema = {
  slug: string;
  naam: string;
  korteNaam: string;
  /** DG-code(s), bv. "CLIMA" of "GROW / COMP". */
  dg: string;
  beschrijving: string;
};

export const THEMAS: Thema[] = [
  {
    slug: "economie-en-werk",
    naam: "Economie & Werkgelegenheid",
    korteNaam: "Economie & Werk",
    dg: "ECFIN / EMPL",
    beschrijving:
      "Eurozone, begrotingsregels, banen, sociale rechten en minimumloon-afspraken.",
  },
  {
    slug: "interne-markt",
    naam: "Interne Markt & Bedrijven",
    korteNaam: "Interne Markt",
    dg: "GROW / COMP",
    beschrijving:
      "Vrij verkeer van goederen en diensten, mededinging, staatssteun en consumentenbescherming.",
  },
  {
    slug: "digitaal",
    naam: "Digitaal & Technologie",
    korteNaam: "Digitaal",
    dg: "CNECT",
    beschrijving:
      "AI-wet, platformregels (DSA/DMA), data, cybersecurity en online privacy.",
  },
  {
    slug: "klimaat-en-energie",
    naam: "Klimaat & Energie",
    korteNaam: "Klimaat & Energie",
    dg: "CLIMA / ENER",
    beschrijving:
      "Green Deal, CO₂-doelen, emissiehandel, energiemarkt en verduurzaming.",
  },
  {
    slug: "milieu-en-natuur",
    naam: "Milieu & Natuur",
    korteNaam: "Milieu & Natuur",
    dg: "ENV",
    beschrijving:
      "Natuurherstel, afval, water- en luchtkwaliteit, chemische stoffen (REACH).",
  },
  {
    slug: "landbouw-en-voedsel",
    naam: "Landbouw, Visserij & Voedsel",
    korteNaam: "Landbouw & Voedsel",
    dg: "AGRI / SANTE",
    beschrijving:
      "Gemeenschappelijk landbouwbeleid (GLB), voedselveiligheid, dierenwelzijn en visquota.",
  },
  {
    slug: "migratie-en-asiel",
    naam: "Migratie & Asiel",
    korteNaam: "Migratie & Asiel",
    dg: "HOME",
    beschrijving:
      "Asiel- en Migratiepact, Schengen-grenzen, Frontex en terugkeerbeleid.",
  },
  {
    slug: "justitie-en-grondrechten",
    naam: "Justitie & Grondrechten",
    korteNaam: "Justitie",
    dg: "JUST",
    beschrijving:
      "Rechtsstaat, gegevensbescherming (AVG), consumentenrecht en gelijke behandeling.",
  },
  {
    slug: "handel-en-internationaal",
    naam: "Handel & Internationaal",
    korteNaam: "Handel",
    dg: "TRADE",
    beschrijving:
      "Handelsverdragen, douane-unie, sancties en exportcontrole.",
  },
  {
    slug: "financiele-sector",
    naam: "Financiële Sector & Belastingen",
    korteNaam: "Financiële Sector",
    dg: "FISMA / TAXUD",
    beschrijving:
      "Banken, kapitaalmarkt, btw-regels en aanpak van belastingontwijking.",
  },
  {
    slug: "vervoer-en-mobiliteit",
    naam: "Vervoer & Mobiliteit",
    korteNaam: "Vervoer",
    dg: "MOVE",
    beschrijving:
      "Luchtvaart, spoor, scheepvaart, wegvervoer en transport-emissies.",
  },
  {
    slug: "volksgezondheid",
    naam: "Volksgezondheid",
    korteNaam: "Gezondheid",
    dg: "SANTE",
    beschrijving:
      "Geneesmiddelen, Europese gezondheidsunie en grensoverschrijdende zorg.",
  },
];

export function getThema(slug: string): Thema | undefined {
  return THEMAS.find((t) => t.slug === slug);
}
