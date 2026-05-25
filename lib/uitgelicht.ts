// "Uitgelichte wet van de week" — net als op de Nederlandse Wetgevingsmonitor.
// We lichten wekelijks één EU-voorstel uit dat de Nederlandse burger het meest
// direct raakt: de portemonnee, de leefomgeving, de samenstelling van de
// bevolking of de samenleving breder.
//
// Selectieregels (in volgorde):
//  1. Alleen voorstellen mét een vooraf geschreven, gecontroleerde uitleg komen
//     in aanmerking — een uitgelichte wet mag nóóit het generieke sjabloon
//     tonen. (Zie de premortem: uitgelichte content moet kloppen.)
//  2. Elk voorstel krijgt een impact-score via trefwoorden + beleidsterrein,
//     en de best passende "impact-lens" (Portemonnee / Leefomgeving / …).
//  3. We roteren wekelijks (ISO-weeknummer) door de top van de ranglijst, zodat
//     elke week een ander voorstel bovenaan staat. De keuze is stabiel binnen
//     één week en ververst mee met de dagelijkse EUR-Lex-synchronisatie.
//  4. Een handmatige keuze per week (HANDMATIG_UITGELICHT) heeft altijd voorrang.

import { getVoorstellen, type Voorstel, type ActType } from "@/lib/eurlex";

/** Publieke vorm van een impact-lens (zonder de interne scoringsvelden). */
export type ImpactCategorie = {
  key: string;
  /** Korte label, getoond als "Uitgelicht · {label}". */
  label: string;
  /** Subtitel onder de label, bv. "Wat dit voor uw portemonnee kan betekenen". */
  subtitel: string;
};

type CategorieDef = ImpactCategorie & {
  /** Beleidsterrein-slugs die sterk onder deze impact-lens vallen. */
  themas: string[];
  /** Trefwoorden (lowercase) in titel/onderwerpen die op deze lens wijzen. */
  woorden: string[];
  /** Basisgewicht: hoe direct voelbaar dit terrein is voor de burger. */
  gewicht: number;
};

// Volgorde = voorkeursvolgorde bij gelijke score (eerste wint).
const CATEGORIEEN: CategorieDef[] = [
  {
    key: "portemonnee",
    label: "Portemonnee",
    subtitel: "Wat dit voor uw portemonnee kan betekenen",
    themas: [
      "belastingen",
      "energie",
      "consumenten",
      "economische-en-monetaire-zaken",
    ],
    woorden: [
      "btw", "accijns", "belasting", "heffing", "prijs", "prijzen", "tarief",
      "energie", "gas", "elektriciteit", "stroom", "brandstof", "kosten",
      "factuur", "toeslag", "pensioen", "hypotheek", "spaar", "bank", "krediet",
      "loon", "koopkracht", "subsidie", "betaling", "consument",
    ],
    gewicht: 5,
  },
  {
    key: "leefomgeving",
    label: "Leefomgeving",
    subtitel: "Wat dit voor uw leefomgeving kan betekenen",
    themas: [
      "milieu-en-klimaat",
      "vervoer",
      "oceanen-en-visserij",
      "landbouw",
    ],
    woorden: [
      "klimaat", "lucht", "luchtkwaliteit", "geluid", "natuur", "water",
      "afval", "uitstoot", "emissie", "vervuiling", "stikstof", "biodiversiteit",
      "verpakking", "plastic", "chemische", "pesticide", "drinkwater", "bodem",
      "circulair", "vervoer", "luchtvaart", "scheepvaart",
    ],
    gewicht: 5,
  },
  {
    key: "bevolking",
    label: "Bevolking",
    subtitel: "Wat dit voor de samenstelling van de bevolking kan betekenen",
    themas: ["justitie-vrijheid-veiligheid"],
    woorden: [
      "migratie", "asiel", "grens", "visum", "verblijf", "gezinshereniging",
      "nationaliteit", "vluchteling", "arbeidsmigratie", "vrij verkeer",
      "schengen", "terugkeer", "migrant",
    ],
    gewicht: 5,
  },
  {
    key: "samenleving",
    label: "Samenleving",
    subtitel: "Wat dit voor de samenleving kan betekenen",
    themas: [
      "werk-en-sociale-zaken",
      "volksgezondheid",
      "mensenrechten",
      "digitale-eengemaakte-markt",
    ],
    woorden: [
      "werk", "arbeid", "baan", "sociale", "gezondheid", "zorg", "geneesmiddel",
      "medicijn", "privacy", "gegevens", "online", "platform",
      "kunstmatige intelligentie", "discriminatie", "kind", "jongere",
      "onderwijs", "veiligheid",
    ],
    gewicht: 4,
  },
];

function toPublic(c: CategorieDef): ImpactCategorie {
  return { key: c.key, label: c.label, subtitel: c.subtitel };
}

// Alleen échte wetgevende instrumenten komen in aanmerking voor "wet van de
// week". Niet: Mededelingen/Aanbevelingen (niet-bindend) en het type-"Voorstel"
// terugvaltype, dat in de praktijk de procedurele co-decisiestukken vangt
// (ADVIES / MEDEDELING "overeenkomstig artikel 294") — dat zijn geen wetten.
const WET_TYPES: ReadonlySet<ActType> = new Set<ActType>([
  "Verordening",
  "Richtlijn",
  "Besluit",
]);

// Procedurele co-decisiestukken (opinies/mededelingen "overeenkomstig artikel
// 294") zijn nooit de wet zelf — expliciet uitsluiten, ongeacht het type.
const PROCEDUREEL_RE = /overeenkomstig artikel 294/i;

// Brede instrumenten (verordening/richtlijn) raken de burger directer dan een
// smal besluit; dit gewicht telt bovenop de impact-score bij het rangschikken.
function typeGewicht(t: ActType): number {
  switch (t) {
    case "Verordening":
    case "Richtlijn":
      return 3;
    default:
      return 1; // Besluit
  }
}

function scoreVoorCategorie(v: Voorstel, c: CategorieDef): number {
  const tekst = `${v.titel} ${v.onderwerpen.join(" ")}`.toLowerCase();
  let score = 0;
  if (v.themaSlugs.some((s) => c.themas.includes(s))) score += c.gewicht;
  for (const w of c.woorden) {
    if (tekst.includes(w)) score += 1;
  }
  return score;
}

/** Best passende impact-lens voor een voorstel, met de bijbehorende score. */
export function bepaalImpact(v: Voorstel): {
  categorie: ImpactCategorie;
  score: number;
} {
  let best = CATEGORIEEN[0];
  let bestScore = -1;
  for (const c of CATEGORIEEN) {
    const s = scoreVoorCategorie(v, c);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }
  return { categorie: toPublic(best), score: bestScore };
}

/**
 * ISO-8601 weeknummer (1–53) op basis van de lokale datumdelen. De week loopt
 * van maandag t/m zondag; week 1 bevat de eerste donderdag van het jaar.
 */
export function isoWeek(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dag = (t.getUTCDay() + 6) % 7; // ma=0 … zo=6
  t.setUTCDate(t.getUTCDate() - dag + 3); // donderdag van deze week
  const donderdag = t.getTime();
  t.setUTCMonth(0, 1); // 1 januari
  if (t.getUTCDay() !== 4) {
    t.setUTCMonth(0, 1 + ((4 - t.getUTCDay() + 7) % 7)); // eerste donderdag
  }
  return 1 + Math.round((donderdag - t.getTime()) / (7 * 24 * 3600 * 1000));
}

// Handmatige keuze per week — vult of overschrijft de automatische selectie.
// Sleutel: "{jaar}-W{weeknummer}", waarde: CELEX van het te tonen voorstel.
// Het voorstel moet wél in de live EUR-Lex-feed (laatste 9 maanden) zitten.
// Voeg nieuwe regels toe vlak vóór de // <APPEND>-markering.
const HANDMATIG_UITGELICHT: Record<string, string> = {
  // "2026-W22": "52026PC0239",
  // <APPEND>
};

export type UitgelichtItem = {
  voorstel: Voorstel;
  categorie: ImpactCategorie;
};

/**
 * Kiest de uitgelichte wet van de huidige week. Geeft `null` als er geen
 * geschikt voorstel is (dan toont de homepage simpelweg geen blok) of als de
 * EUR-Lex-koppeling faalde.
 */
export async function getUitgelichteWet(
  nu: Date = new Date(),
): Promise<UitgelichtItem | null> {
  const { voorstellen, fout } = await getVoorstellen();
  if (fout || voorstellen.length === 0) return null;

  // Alleen voorstellen met een gecontroleerde uitleg én een wetgevend instrument.
  const kandidaten = voorstellen.filter(
    (v) =>
      v.uitlegBron === "ai" &&
      WET_TYPES.has(v.type) &&
      !PROCEDUREEL_RE.test(v.titel),
  );
  if (kandidaten.length === 0) return null;

  const week = isoWeek(nu);
  const weekSleutel = `${nu.getFullYear()}-W${week}`;

  // 1. Handmatige keuze heeft voorrang (mits het voorstel nog in de feed zit).
  const handmatig = HANDMATIG_UITGELICHT[weekSleutel];
  if (handmatig) {
    const v = voorstellen.find((x) => x.celex === handmatig);
    if (v) return { voorstel: v, categorie: bepaalImpact(v).categorie };
  }

  // 2. Rangschik op (impact + type-gewicht), dan recentste, dan CELEX (stabiel).
  const gescoord = kandidaten
    .map((v) => {
      const { categorie, score } = bepaalImpact(v);
      return { v, categorie, score, totaal: score + typeGewicht(v.type) };
    })
    .sort(
      (a, b) =>
        b.totaal - a.totaal ||
        b.v.datum.localeCompare(a.v.datum) ||
        a.v.celex.localeCompare(b.v.celex),
    );

  // "Relevant" = inhoudelijk burger-impact (categoriescore > 0), los van het type.
  const relevant = gescoord.filter((x) => x.score > 0);
  const pool = (relevant.length > 0 ? relevant : gescoord).slice(0, 16);
  if (pool.length === 0) return null;

  // 3. Roteer wekelijks door de top.
  const keuze = pool[week % pool.length];
  return { voorstel: keuze.v, categorie: keuze.categorie };
}
