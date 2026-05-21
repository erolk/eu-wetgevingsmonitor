// De beleidsterreinen volgen de officiële indeling van EUR-Lex —
// "Samenvattingen van de EU-wetgeving" — die de EU-wetgeving in 32 beleidsvelden
// groepeert. Bron: https://eur-lex.europa.eu/browse/summaries.html

export type Thema = {
  slug: string;
  naam: string;
  korteNaam: string;
  beschrijving: string;
};

export const THEMAS: Thema[] = [
  {
    slug: "landbouw",
    naam: "Landbouw",
    korteNaam: "Landbouw",
    beschrijving:
      "Gemeenschappelijk landbouwbeleid (GLB), plattelandsontwikkeling, teeltmateriaal en bosbouw.",
  },
  {
    slug: "audiovisueel-en-media",
    naam: "Audiovisueel & Media",
    korteNaam: "Audiovisueel",
    beschrijving:
      "Film, omroep, mediadiensten en auteursrechten in de digitale wereld.",
  },
  {
    slug: "begroting",
    naam: "Begroting",
    korteNaam: "Begroting",
    beschrijving:
      "De EU-begroting, het meerjarig financieel kader en financiële bepalingen.",
  },
  {
    slug: "mededinging",
    naam: "Mededinging",
    korteNaam: "Mededinging",
    beschrijving:
      "Concurrentieregels, staatssteun, kartels en fusiecontrole.",
  },
  {
    slug: "consumenten",
    naam: "Consumenten",
    korteNaam: "Consumenten",
    beschrijving:
      "Consumentenbescherming, productveiligheid (speelgoed, cosmetica) en consumentenrechten.",
  },
  {
    slug: "cultuur",
    naam: "Cultuur",
    korteNaam: "Cultuur",
    beschrijving:
      "Cultureel erfgoed, culturele samenwerking en de creatieve sector.",
  },
  {
    slug: "douane",
    naam: "Douane",
    korteNaam: "Douane",
    beschrijving:
      "Douane-unie, gemeenschappelijk douanetarief en tariefcontingenten.",
  },
  {
    slug: "ontwikkelingssamenwerking",
    naam: "Ontwikkelingssamenwerking",
    korteNaam: "Ontwikkeling",
    beschrijving:
      "Hulp en samenwerking met ontwikkelingslanden en het Europees Ontwikkelingsfonds.",
  },
  {
    slug: "digitale-eengemaakte-markt",
    naam: "Digitale Eengemaakte Markt",
    korteNaam: "Digitaal",
    beschrijving:
      "Telecom, internet, data, cyberbeveiliging en digitale diensten.",
  },
  {
    slug: "economische-en-monetaire-zaken",
    naam: "Economische & Monetaire Zaken",
    korteNaam: "Economie & EMU",
    beschrijving:
      "Eurozone, begrotingsregels, economisch bestuur, kapitaalmarkt en betalingsbalans.",
  },
  {
    slug: "onderwijs-jeugd-en-sport",
    naam: "Onderwijs, Jeugd & Sport",
    korteNaam: "Onderwijs & Jeugd",
    beschrijving:
      "Onderwijs, beroepsopleiding, jongerenprogramma's en sport.",
  },
  {
    slug: "werk-en-sociale-zaken",
    naam: "Werk & Sociale Zaken",
    korteNaam: "Werk & Sociaal",
    beschrijving:
      "Werkgelegenheid, arbeidsrechten, sociale bescherming en veiligheid op het werk.",
  },
  {
    slug: "energie",
    naam: "Energie",
    korteNaam: "Energie",
    beschrijving:
      "Energiemarkt, leveringszekerheid, kernenergie en energie-efficiëntie.",
  },
  {
    slug: "uitbreiding",
    naam: "Uitbreiding van de EU",
    korteNaam: "Uitbreiding",
    beschrijving:
      "Toetreding van kandidaat-lidstaten en het nabuurschapsbeleid.",
  },
  {
    slug: "ondernemerschap",
    naam: "Ondernemerschap & Industrie",
    korteNaam: "Ondernemen & Industrie",
    beschrijving:
      "Industriebeleid, het mkb en strategische sectoren zoals de staalindustrie.",
  },
  {
    slug: "milieu-en-klimaat",
    naam: "Milieu & Klimaat",
    korteNaam: "Milieu & Klimaat",
    beschrijving:
      "Klimaatbeleid, natuur, afval, vervuiling en chemische stoffen.",
  },
  {
    slug: "externe-betrekkingen",
    naam: "Externe Betrekkingen",
    korteNaam: "Externe Betrekkingen",
    beschrijving:
      "Internationale overeenkomsten, samenwerking met derde landen en steun aan Oekraïne.",
  },
  {
    slug: "handel",
    naam: "Buitenlandse Handel",
    korteNaam: "Handel",
    beschrijving:
      "Handelsverdragen, handelspolitiek, investeringen en de Wereldhandelsorganisatie.",
  },
  {
    slug: "voedselveiligheid",
    naam: "Voedselveiligheid",
    korteNaam: "Voedselveiligheid",
    beschrijving:
      "Voedsel- en diervoederveiligheid, veterinaire en fytosanitaire regels en ggo's.",
  },
  {
    slug: "buitenlands-en-veiligheidsbeleid",
    naam: "Buitenlands & Veiligheidsbeleid",
    korteNaam: "Buitenland & Veiligheid",
    beschrijving:
      "Gemeenschappelijk buitenlands en veiligheidsbeleid, sancties en defensie.",
  },
  {
    slug: "fraude-en-corruptie",
    naam: "Fraude & Corruptie",
    korteNaam: "Fraude",
    beschrijving:
      "Bescherming van de financiële belangen van de EU en fraudebestrijding.",
  },
  {
    slug: "humanitaire-hulp",
    naam: "Humanitaire Hulp & Civiele Bescherming",
    korteNaam: "Humanitaire Hulp",
    beschrijving:
      "Noodhulp bij rampen en crises, binnen en buiten de EU.",
  },
  {
    slug: "mensenrechten",
    naam: "Mensenrechten",
    korteNaam: "Mensenrechten",
    beschrijving:
      "Bevordering en bescherming van mensenrechten en democratie.",
  },
  {
    slug: "institutionele-zaken",
    naam: "Institutionele Zaken",
    korteNaam: "Institutioneel",
    beschrijving:
      "Werking van de EU-instellingen, procedures en wetgevingstechniek.",
  },
  {
    slug: "interne-markt",
    naam: "Interne Markt",
    korteNaam: "Interne Markt",
    beschrijving:
      "Vrij verkeer van goederen, diensten, personen en kapitaal; harmonisatie en intellectuele eigendom.",
  },
  {
    slug: "justitie-vrijheid-veiligheid",
    naam: "Justitie, Vrijheid & Veiligheid",
    korteNaam: "Justitie",
    beschrijving:
      "Justitiële samenwerking, grondrechten, gegevensbescherming, migratie en asiel.",
  },
  {
    slug: "oceanen-en-visserij",
    naam: "Oceanen & Visserij",
    korteNaam: "Visserij",
    beschrijving:
      "Gemeenschappelijk visserijbeleid, vangstquota en bescherming van het zeemilieu.",
  },
  {
    slug: "volksgezondheid",
    naam: "Volksgezondheid",
    korteNaam: "Gezondheid",
    beschrijving:
      "Geneesmiddelen, medische hulpmiddelen en grensoverschrijdende zorg.",
  },
  {
    slug: "regionaal-beleid",
    naam: "Regionaal Beleid",
    korteNaam: "Regionaal",
    beschrijving:
      "Cohesiebeleid en economische, sociale en territoriale samenhang.",
  },
  {
    slug: "onderzoek-en-innovatie",
    naam: "Onderzoek & Innovatie",
    korteNaam: "Onderzoek",
    beschrijving:
      "Onderzoeksprogramma's, technologie, innovatie en ruimtevaart.",
  },
  {
    slug: "belastingen",
    naam: "Belastingen",
    korteNaam: "Belastingen",
    beschrijving:
      "Btw, accijnzen en de aanpak van belastingontwijking.",
  },
  {
    slug: "vervoer",
    naam: "Vervoer",
    korteNaam: "Vervoer",
    beschrijving:
      "Luchtvaart, spoor, scheepvaart, wegvervoer en trans-Europese netwerken.",
  },
];

export function getThema(slug: string): Thema | undefined {
  return THEMAS.find((t) => t.slug === slug);
}
