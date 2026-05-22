// Live koppeling met EUR-Lex via het SPARQL-endpoint van de Cellar
// (Publications Office of the EU). We halen recente *wetgevingsvoorstellen*
// op — CELEX-sector 5, descriptor "PC" (Proposal) — met hun Nederlandstalige
// titel, datum, EUR-Lex onderwerp-codes en EUROVOC-trefwoorden.
//
// De EU classificeert elke handeling met "subject-matter"-codes (een vaste
// woordenlijst: FISC, ENV, TRAN, …). Die mappen we naar onze beleidsterreinen
// (lib/themas.ts), zodat een voorstel onder één of meer terreinen verschijnt.
//
// Bron: https://publications.europa.eu/webapi/rdf/sparql — open data (CC-BY).

import { THEMAS } from "@/lib/themas";
import { BURGERUITLEG } from "@/lib/burgeruitleg";

const SPARQL_ENDPOINT = "https://publications.europa.eu/webapi/rdf/sparql";

/** Hoeveel maanden terug we voorstellen tonen. */
const MAANDEN_TERUG = 9;

/** Max. aantal voorstellen dat we per ophaalactie binnenhalen. */
const LIMIET = 300;

/** Cache-duur in seconden (Next.js ISR) — één keer per dag verversen. */
const REVALIDATE_SECONDEN = 60 * 60 * 24;

export type ActType =
  | "Verordening"
  | "Richtlijn"
  | "Besluit"
  | "Aanbeveling"
  | "Mededeling"
  | "Voorstel";

export type Voorstel = {
  /** CELEX-nummer, bv. "52026PC0239". */
  celex: string;
  titel: string;
  /** ISO-datum (yyyy-mm-dd) van het document. */
  datum: string;
  type: ActType;
  /** Diepe link naar de Nederlandstalige tekst op EUR-Lex. */
  url: string;
  /** Slugs van beleidsterreinen waar dit voorstel onder valt. */
  themaSlugs: string[];
  /** Enkele EUROVOC-trefwoorden ter duiding. */
  onderwerpen: string[];
  /** Korte uitleg in gewone taal: wat betekent dit voor de NL-burger? */
  uitleg: string;
  /** Bron van de uitleg: vooraf gegenereerd ("ai") of automatisch sjabloon. */
  uitlegBron: "ai" | "sjabloon";
  /** Is het voorstel inmiddels aangenomen (er bestaat een definitieve handeling)? */
  aangenomen: boolean;
  /** Datum (yyyy-mm-dd) waarop de definitieve handeling werd vastgesteld. */
  aangenomenDatum?: string;
  /** Link naar de aangenomen handeling op EUR-Lex. */
  aangenomenUrl?: string;
};

// EUR-Lex "subject-matter"-code → beleidsterrein-slug (de 32 EUR-Lex-thema's).
// Gebaseerd op de codes die feitelijk op recente voorstellen voorkomen. Elke
// code valt onder precies één terrein; een voorstel erft de terreinen van al
// zijn codes (en kan dus onder meerdere terreinen verschijnen).
const CODE_NAAR_THEMA: Record<string, string> = {
  // Landbouw
  AGRI: "landbouw", // landbouw en visserij
  SILV: "landbouw", // bosbouw
  SEME: "landbouw", // zaai- en plantgoed
  IPRM: "landbouw", // teeltmateriaal

  // Begroting
  FIN: "begroting", // financiële bepalingen
  FINC: "begroting", // financiële bepalingen EGKS
  BUDG: "begroting", // begroting

  // Consumenten
  PROT: "consumenten", // consumentenbescherming
  ICOT: "consumenten", // cosmetica, speelgoed

  // Douane
  TDC: "douane", // gemeenschappelijk douanetarief
  TDCS: "douane", // douanerechten: schorsingen
  TDCN: "douane", // douanerechten: nationale contingenten
  TDCC: "douane", // douanerechten: communautaire contingenten
  UD: "douane", // douane-unie

  // Ontwikkelingssamenwerking
  ACP: "ontwikkelingssamenwerking", // ACS-staten
  FED: "ontwikkelingssamenwerking", // Europees Ontwikkelingsfonds
  CDEV: "ontwikkelingssamenwerking", // ontwikkelingssamenwerking
  PTOM: "ontwikkelingssamenwerking", // landen en gebieden overzee

  // Digitale eengemaakte markt
  TELE: "digitale-eengemaakte-markt", // telecommunicatie
  INFQ: "digitale-eengemaakte-markt", // informatica

  // Economische & monetaire zaken
  PECO: "economische-en-monetaire-zaken", // economische politiek
  UEM: "economische-en-monetaire-zaken", // economische en monetaire unie
  LCC: "economische-en-monetaire-zaken", // vrij verkeer van kapitaal
  BPAI: "economische-en-monetaire-zaken", // betalingsbalans

  // Onderwijs, jeugd & sport
  EFPJ: "onderwijs-jeugd-en-sport", // onderwijs, beroepsopleiding en jeugd

  // Werk & sociale zaken
  EMPL: "werk-en-sociale-zaken", // werkgelegenheid
  SOCI: "werk-en-sociale-zaken", // sociale bepalingen
  SECU: "werk-en-sociale-zaken", // veiligheid van werknemers/bevolking

  // Energie
  ENER: "energie", // energie
  NUCL: "energie", // kernenergie
  IEEE: "energie", // milieu, energie-efficiëntie

  // Ondernemerschap & industrie
  PIND: "ondernemerschap", // industriebeleid
  INDU: "ondernemerschap", // industrie
  PME: "ondernemerschap", // kleine en middelgrote ondernemingen
  SIDE: "ondernemerschap", // staalindustrie
  ACIE: "ondernemerschap", // staal

  // Milieu & klimaat
  ENV: "milieu-en-klimaat", // milieu
  POLL: "milieu-en-klimaat", // vervuiling
  DECH: "milieu-en-klimaat", // afval
  IWAS: "milieu-en-klimaat", // afvalstoffen
  ICHR: "milieu-en-klimaat", // chemische stoffen

  // Externe betrekkingen
  EXT: "externe-betrekkingen", // externe betrekkingen
  ACIN: "externe-betrekkingen", // internationale overeenkomsten
  AELE: "externe-betrekkingen", // Europese Vrijhandelsassociatie
  COOP: "externe-betrekkingen", // samenwerking
  ASSO: "externe-betrekkingen", // associatie-overeenkomst
  ACCE: "externe-betrekkingen", // toetreding tot overeenkomst
  ASTU: "externe-betrekkingen", // bijstand aan Oekraïne
  MSWU: "externe-betrekkingen", // EU-maatregelen solidariteit Oekraïne
  COPT: "externe-betrekkingen", // samenwerking met derde landen

  // Buitenlandse handel
  PCOM: "handel", // handelspolitiek
  INV: "handel", // investeringen
  GATT: "handel", // GATT
  OMC: "handel", // Wereldhandelsorganisatie
  CAFE: "handel", // koffie (grondstoffenovereenkomst)
  CAC: "handel", // cacao (grondstoffenovereenkomst)

  // Voedselveiligheid
  PHYT: "voedselveiligheid", // fytosanitaire wetgeving
  "D-AL": "voedselveiligheid", // levensmiddelen
  "AL-A": "voedselveiligheid", // veevoeder
  IOVC: "voedselveiligheid", // officiële/veterinaire controles
  IPBI: "voedselveiligheid", // pesticiden, biociden
  VETE: "voedselveiligheid", // veterinaire wetgeving
  IGMO: "voedselveiligheid", // ggo's

  // Buitenlands & veiligheidsbeleid
  PESC: "buitenlands-en-veiligheidsbeleid", // GBVB

  // Mensenrechten
  DDLH: "mensenrechten", // rechten van de mens

  // Institutionele zaken
  INST: "institutionele-zaken", // bepalingen betreffende de instellingen
  INFO: "institutionele-zaken", // inlichtingen en verificaties
  IOTR: "institutionele-zaken", // overig
  IAFO: "institutionele-zaken", // bijlage-bepalingen Unierecht

  // Interne markt
  MARI: "interne-markt", // interne markt - beginselen
  ETEC: "interne-markt", // technische belemmeringen
  LES: "interne-markt", // vrijheid van vestiging
  LCP: "interne-markt", // vrij verkeer van personen
  PROP: "interne-markt", // intellectuele/industriële eigendom
  HARM: "interne-markt", // harmonisatie van wetgeving
  RAPL: "interne-markt", // aanpassing van de wetgeving
  IMVT: "interne-markt", // motorvoertuigen (typegoedkeuring)

  // Justitie, vrijheid & veiligheid
  DISC: "justitie-vrijheid-veiligheid", // non-discriminatie
  PDON: "justitie-vrijheid-veiligheid", // bescherming van gegevens
  "J-AI": "justitie-vrijheid-veiligheid", // justitie en binnenlandse zaken
  ELSJ: "justitie-vrijheid-veiligheid", // ruimte vrijheid, veiligheid en recht
  COJP: "justitie-vrijheid-veiligheid", // justitiële samenwerking strafzaken
  COJC: "justitie-vrijheid-veiligheid", // justitiële samenwerking burgerzaken
  IMMI: "justitie-vrijheid-veiligheid", // migratie- en asielbeleid

  // Oceanen & visserij
  PECH: "oceanen-en-visserij", // visserijbeleid

  // Volksgezondheid
  SANT: "volksgezondheid", // volksgezondheid
  IMEP: "volksgezondheid", // geneesmiddelen
  IMED: "volksgezondheid", // medische hulpmiddelen

  // Regionaal beleid
  COES: "regionaal-beleid", // economische/sociale/territoriale samenhang
  PREG: "regionaal-beleid", // regionaal beleid

  // Onderzoek & innovatie
  RDT: "onderzoek-en-innovatie", // onderzoek en technologische ontwikkeling
  TECN: "onderzoek-en-innovatie", // technologie
  ESPA: "onderzoek-en-innovatie", // ruimte

  // Belastingen
  FISC: "belastingen", // belastingen
  TVA: "belastingen", // btw
  IVAT: "belastingen", // btw

  // Vervoer
  TRAN: "vervoer", // vervoer
  RTR: "vervoer", // trans-Europese netwerken
  IAPA: "vervoer", // compensatie/bijstand luchtreizigers
};

const GELDIGE_SLUGS = new Set(THEMAS.map((t) => t.slug));

/** Beleidsterrein-slugs voor een set subject-matter-codes (gededupliceerd,
 *  alleen geldige slugs). Een voorstel erft de terreinen van al zijn codes. */
export function themaSlugsVanCodes(codes: string[]): string[] {
  return Array.from(
    new Set(
      codes
        .map((c) => CODE_NAAR_THEMA[c])
        .filter((slug): slug is string => !!slug && GELDIGE_SLUGS.has(slug)),
    ),
  );
}

/** Datum (yyyy-mm-dd) van vandaag minus N maanden — stabiel binnen één dag,
 *  zodat de SPARQL-URL en daarmee de Next.js fetch-cache niet per call wisselt. */
function ondergrensDatum(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - MAANDEN_TERUG);
  return d.toISOString().slice(0, 10);
}

function bouwQuery(sinds: string): string {
  return `PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?celex ?date ?title
  (GROUP_CONCAT(DISTINCT ?code; separator=",") AS ?codes)
  (GROUP_CONCAT(DISTINCT ?evLabel; separator="|") AS ?eurovoc)
  (SAMPLE(?ac) AS ?aangenomen)
  (MIN(?ad) AS ?aangenomenDatum)
WHERE {
  ?work cdm:resource_legal_id_celex ?celex .
  ?work cdm:work_date_document ?date .
  ?exp cdm:expression_belongs_to_work ?work .
  ?exp cdm:expression_title ?title .
  ?exp cdm:expression_uses_language <http://publications.europa.eu/resource/authority/language/NLD> .
  FILTER(REGEX(STR(?celex), "^52[0-9]{3}PC"))
  FILTER(?date >= "${sinds}"^^xsd:date)
  OPTIONAL { ?work cdm:resource_legal_is_about_subject-matter ?sm .
             BIND(REPLACE(STR(?sm), ".*/", "") AS ?code) }
  OPTIONAL { ?work cdm:work_is_about_concept_eurovoc ?ev .
             ?ev skos:prefLabel ?evLabel . FILTER(LANG(?evLabel)="nl") }
  OPTIONAL { ?adopt cdm:resource_legal_adopts_resource_legal ?work .
             ?adopt cdm:resource_legal_id_celex ?ac .
             FILTER(STRSTARTS(STR(?ac), "3") && !CONTAINS(STR(?ac), "R("))
             OPTIONAL { ?adopt cdm:work_date_document ?ad . } }
}
GROUP BY ?celex ?date ?title
ORDER BY DESC(?date)
LIMIT ${LIMIET}`;
}

// Bepaal het type op basis van het instrument vóóraan in de titel. Niet via
// "bevat het woord X", want titels verwijzen vaak naar ándere handelingen
// (bv. een uitvoeringsbesluit dat een richtlijn of verordening wijzigt).
export function bepaalType(titel: string): ActType {
  const up = titel.trim().toUpperCase();
  if (up.startsWith("AANBEVELING")) return "Aanbeveling";
  if (up.startsWith("MEDEDELING")) return "Mededeling";
  const m = up.replace(/^(GEWIJZIGD\s+)?VOORSTEL\s+VOOR\s+(EEN|DE)\s+/, "");
  if (/^(UITVOERINGS|GEDELEGEERDE\s+)?VERORDENING/.test(m)) return "Verordening";
  if (m.startsWith("RICHTLIJN")) return "Richtlijn";
  if (/^UITVOERINGSBESLUIT|^BESLUIT/.test(m)) return "Besluit";
  if (m.startsWith("AANBEVELING")) return "Aanbeveling";
  return "Voorstel";
}

// Automatische terugval-uitleg op basis van het type en de onderwerpen, voor
// voorstellen die (nog) geen vooraf gegenereerde samenvatting hebben.
export function sjabloonUitleg(type: ActType, onderwerpen: string[]): string {
  const ond = onderwerpen.length
    ? ` Onderwerp: ${onderwerpen.slice(0, 3).join(", ").toLowerCase()}.`
    : "";
  switch (type) {
    case "Verordening":
      return `Een verordening: zodra die is aangenomen, geldt hij direct in Nederland — de Tweede en Eerste Kamer stemmen er niet meer over.${ond}`;
    case "Richtlijn":
      return `Een richtlijn: Nederland moet dit binnen een termijn omzetten in eigen wetgeving, die dan in de Tweede en Eerste Kamer wordt behandeld.${ond}`;
    case "Besluit":
      return `Een besluit: bindend voor de partijen die het direct aangaat, meestal zonder brede omzetting in Nederland.${ond}`;
    case "Aanbeveling":
      return `Een aanbeveling: niet bindend, maar geeft aan welke richting de EU adviseert.${ond}`;
    case "Mededeling":
      return `Een mededeling van de Commissie: geen wet, maar een toelichting of standpunt binnen het wetgevingsproces.${ond}`;
    default:
      return `Een EU-voorstel dat nog door het wetgevingsproces moet.${ond}`;
  }
}

type Binding = { value: string };
export type Row = {
  celex: Binding;
  date: Binding;
  title: Binding;
  codes?: Binding;
  eurovoc?: Binding;
  aangenomen?: Binding;
  aangenomenDatum?: Binding;
};

export function rijNaarVoorstel(r: Row): Voorstel {
  const codes = (r.codes?.value ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const themaSlugs = themaSlugsVanCodes(codes);

  const onderwerpen = Array.from(
    new Set(
      (r.eurovoc?.value ?? "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ).slice(0, 5);

  const celex = r.celex.value;
  const type = bepaalType(r.title.value);
  const aiUitleg = BURGERUITLEG[celex];

  const aangenomenCelex = r.aangenomen?.value?.trim();
  const aangenomen = !!aangenomenCelex;

  return {
    celex,
    titel: r.title.value.trim(),
    datum: r.date.value.slice(0, 10),
    type,
    url: `https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:${celex}`,
    themaSlugs,
    onderwerpen,
    uitleg: aiUitleg ?? sjabloonUitleg(type, onderwerpen),
    uitlegBron: aiUitleg ? "ai" : "sjabloon",
    aangenomen,
    aangenomenDatum: r.aangenomenDatum?.value?.slice(0, 10),
    aangenomenUrl: aangenomen
      ? `https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:${aangenomenCelex}`
      : undefined,
  };
}

export type VoorstellenResultaat = {
  voorstellen: Voorstel[];
  /** True als de live koppeling faalde (timeout, netwerk, parsefout). */
  fout: boolean;
};

/**
 * Haalt recente EU-wetgevingsvoorstellen op uit EUR-Lex. Resultaat wordt
 * dagelijks door Next.js gecachet. Bij een fout geven we een lege lijst terug
 * met `fout: true`, zodat de UI netjes kan terugvallen i.p.v. te crashen.
 */
export async function getVoorstellen(): Promise<VoorstellenResultaat> {
  const query = bouwQuery(ondergrensDatum());
  const url =
    `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}` +
    `&format=${encodeURIComponent("application/sparql-results+json")}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/sparql-results+json" },
      next: { revalidate: REVALIDATE_SECONDEN, tags: ["voorstellen"] },
    });
    if (!res.ok) return { voorstellen: [], fout: true };

    const data = (await res.json()) as { results?: { bindings?: Row[] } };
    const rows = data.results?.bindings ?? [];
    return { voorstellen: rows.map(rijNaarVoorstel), fout: false };
  } catch {
    return { voorstellen: [], fout: true };
  } finally {
    clearTimeout(timeout);
  }
}

/** Voorstellen voor één beleidsterrein, nieuwste eerst. */
export async function getVoorstellenVoorThema(
  slug: string,
): Promise<VoorstellenResultaat> {
  const { voorstellen, fout } = await getVoorstellen();
  return {
    voorstellen: voorstellen.filter((v) => v.themaSlugs.includes(slug)),
    fout,
  };
}

/** Aantal voorstellen per beleidsterrein-slug (voor de homepage-tegels). */
export async function getAantallenPerThema(): Promise<{
  aantallen: Record<string, number>;
  totaal: number;
  fout: boolean;
}> {
  const { voorstellen, fout } = await getVoorstellen();
  const aantallen: Record<string, number> = {};
  for (const v of voorstellen) {
    for (const slug of v.themaSlugs) {
      aantallen[slug] = (aantallen[slug] ?? 0) + 1;
    }
  }
  return { aantallen, totaal: voorstellen.length, fout };
}

/** Datum in leesbaar Nederlands, bv. "18 mei 2026". */
export function formatDatum(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
