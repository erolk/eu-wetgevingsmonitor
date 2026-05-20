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
};

// EUR-Lex "subject-matter"-code → beleidsterrein-slug. Gebaseerd op de codes
// die feitelijk op recente voorstellen voorkomen. Een code valt onder precies
// één terrein; een voorstel erft de terreinen van al zijn codes.
const CODE_NAAR_THEMA: Record<string, string> = {
  // Economie & Werk
  PECO: "economie-en-werk", // economische politiek
  UEM: "economie-en-werk", // economische en monetaire unie
  EMPL: "economie-en-werk", // werkgelegenheid
  SOCI: "economie-en-werk", // sociale bepalingen
  COES: "economie-en-werk", // economische/sociale/territoriale samenhang
  PREG: "economie-en-werk", // regionaal beleid
  BUDG: "economie-en-werk", // begroting
  FIN: "economie-en-werk", // financiële bepalingen (EU-begroting)

  // Interne Markt & Bedrijven
  MARI: "interne-markt", // interne markt - beginselen
  LES: "interne-markt", // vrijheid van vestiging
  LCP: "interne-markt", // vrij verkeer van personen
  ETEC: "interne-markt", // technische belemmeringen
  PROT: "interne-markt", // consumentenbescherming
  PIND: "interne-markt", // industriebeleid
  PROP: "interne-markt", // intellectuele/industriële eigendom
  RAPL: "interne-markt", // aanpassing van de wetgeving

  // Digitaal & Technologie
  TELE: "digitaal", // telecommunicatie
  TECN: "digitaal", // technologie
  RDT: "digitaal", // onderzoek en technologische ontwikkeling

  // Klimaat & Energie
  ENER: "klimaat-en-energie", // energie
  NUCL: "klimaat-en-energie", // kernenergie

  // Milieu & Natuur
  ENV: "milieu-en-natuur", // milieu
  POLL: "milieu-en-natuur", // vervuiling
  DECH: "milieu-en-natuur", // afval
  ICHR: "milieu-en-natuur", // chemische stoffen

  // Landbouw, Visserij & Voedsel
  AGRI: "landbouw-en-voedsel", // landbouw en visserij
  PECH: "landbouw-en-voedsel", // visserijbeleid
  "D-AL": "landbouw-en-voedsel", // levensmiddelen
  "AL-A": "landbouw-en-voedsel", // veevoeder
  PHYT: "landbouw-en-voedsel", // fytosanitaire wetgeving

  // Migratie & Asiel
  IMMI: "migratie-en-asiel", // migratie- en asielbeleid

  // Justitie & Grondrechten
  "J-AI": "justitie-en-grondrechten", // justitie en binnenlandse zaken
  ELSJ: "justitie-en-grondrechten", // ruimte van vrijheid, veiligheid en recht
  COJP: "justitie-en-grondrechten", // justitiële samenwerking in strafzaken
  PDON: "justitie-en-grondrechten", // bescherming van gegevens
  DISC: "justitie-en-grondrechten", // non-discriminatie

  // Handel & Internationaal
  EXT: "handel-en-internationaal", // externe betrekkingen
  PESC: "handel-en-internationaal", // gemeenschappelijk buitenlands beleid
  PCOM: "handel-en-internationaal", // handelspolitiek
  AELE: "handel-en-internationaal", // Europese Vrijhandelsassociatie
  ACIN: "handel-en-internationaal", // internationale overeenkomsten
  ASSO: "handel-en-internationaal", // associatie-overeenkomst
  ACCE: "handel-en-internationaal", // toetreding tot overeenkomst
  COOP: "handel-en-internationaal", // samenwerking
  ACP: "handel-en-internationaal", // ACS-staten
  INV: "handel-en-internationaal", // investeringen
  ASTU: "handel-en-internationaal", // bijstand aan Oekraïne

  // Financiële Sector & Belastingen
  FISC: "financiele-sector", // belastingen
  TVA: "financiele-sector", // btw
  IVAT: "financiele-sector", // btw
  LCC: "financiele-sector", // vrij verkeer van kapitaal
  TDC: "financiele-sector", // gemeenschappelijk douanetarief
  TDCN: "financiele-sector", // douanerechten: nationale contingenten
  TDCS: "financiele-sector", // douanerechten: schorsingen

  // Vervoer & Mobiliteit
  TRAN: "vervoer-en-mobiliteit", // vervoer
  RTR: "vervoer-en-mobiliteit", // trans-Europese netwerken

  // Volksgezondheid
  SANT: "volksgezondheid", // volksgezondheid
};

const GELDIGE_SLUGS = new Set(THEMAS.map((t) => t.slug));

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
}
GROUP BY ?celex ?date ?title
ORDER BY DESC(?date)
LIMIT ${LIMIET}`;
}

function bepaalType(titel: string): ActType {
  const t = titel.toUpperCase();
  if (t.includes("VERORDENING")) return "Verordening";
  if (t.includes("RICHTLIJN")) return "Richtlijn";
  if (t.includes("AANBEVELING")) return "Aanbeveling";
  if (t.includes("BESLUIT")) return "Besluit";
  return "Voorstel";
}

type Binding = { value: string };
type Row = {
  celex: Binding;
  date: Binding;
  title: Binding;
  codes?: Binding;
  eurovoc?: Binding;
};

function rijNaarVoorstel(r: Row): Voorstel {
  const codes = (r.codes?.value ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  const themaSlugs = Array.from(
    new Set(
      codes
        .map((c) => CODE_NAAR_THEMA[c])
        .filter((slug): slug is string => !!slug && GELDIGE_SLUGS.has(slug)),
    ),
  );

  const onderwerpen = Array.from(
    new Set(
      (r.eurovoc?.value ?? "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ).slice(0, 5);

  const celex = r.celex.value;
  return {
    celex,
    titel: r.title.value.trim(),
    datum: r.date.value.slice(0, 10),
    type: bepaalType(r.title.value),
    url: `https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:${celex}`,
    themaSlugs,
    onderwerpen,
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
      next: { revalidate: REVALIDATE_SECONDEN },
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
