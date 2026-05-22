// Haalt de plenaire agenda van het Europees Parlement voor de huidige week op,
// via de EP Open Data API (data.europarl.europa.eu). Het EP vergadert plenair
// ~maandelijks, dus sommige weken is er geen zitting; dan tonen we de
// eerstvolgende. Dagelijks gecachet (ISR) en met nette terugval als de EP-API
// onbereikbaar is (die is af en toe traag/onbeschikbaar).

const EP_API = "https://data.europarl.europa.eu/api/v2";
const REVALIDATE = 60 * 60 * 24; // dagelijks
const TIMEOUT_MS = 15000;

// Procedurele agendapunten (geen inhoudelijke "besproken zaak").
const PROCEDUREEL = [
  "stemverklaringen",
  "stemming",
  "hervatting van de zitting",
  "redevoeringen van één minuut",
  "regeling van de werkzaamheden",
  "sluiting van de vergadering",
  "opening van de vergadering",
  "goedkeuring van de notulen",
  "ingekomen stukken",
  "verzoekschriften",
  "samenstelling van het parlement",
  "samenstelling van de commissies",
  "ondertekening van",
  "rooster van de volgende",
  "agenda van de volgende",
  "mededelingen van de voorzitter",
  "kredietoverschrijvingen",
];

// True voor ruis: hoofdletter-koppen (geen kleine letter, bv. "PLENAIRE
// VERGADERING") en procedurele punten.
export function isOnbruikbaar(titel: string): boolean {
  if (!/[a-zà-ÿ]/.test(titel)) return true;
  const t = titel.toLowerCase();
  return PROCEDUREEL.some((p) => t.includes(p));
}

export type AgendaPunt = { datum: string; titel: string };

export type AgendaResultaat = {
  punten: AgendaPunt[];
  heeftZitting: boolean;
  weekVan: string; // yyyy-mm-dd (maandag)
  weekTot: string; // yyyy-mm-dd (zondag)
  volgendeZitting: string | null;
  fout: boolean;
};

type Meeting = { id?: string; activity_date?: string };
type ForeseenActivity = { activity_label?: Record<string, string> };

async function fetchEP<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${EP_API}${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/ld+json" },
      next: { revalidate: REVALIDATE, tags: ["agenda"] },
    });
    if (!res.ok) throw new Error(`EP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Maandag en zondag (yyyy-mm-dd) van de week rond datum d. */
export function weekGrenzen(d: Date): [string, string] {
  const dag = (d.getUTCDay() + 6) % 7; // 0 = maandag
  const ma = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dag),
  );
  const zo = new Date(
    Date.UTC(ma.getUTCFullYear(), ma.getUTCMonth(), ma.getUTCDate() + 6),
  );
  return [ymd(ma), ymd(zo)];
}

export async function getAgendaDezeWeek(): Promise<AgendaResultaat> {
  const nu = new Date();
  const vandaag = ymd(nu);
  const [weekVan, weekTot] = weekGrenzen(nu);
  const jaar = nu.getUTCFullYear();
  const basis: AgendaResultaat = {
    punten: [],
    heeftZitting: false,
    weekVan,
    weekTot,
    volgendeZitting: null,
    fout: false,
  };

  try {
    // 1. Alle plenaire zittingen dit jaar (2 pagina's = max 100, ruim genoeg).
    const paginas = await Promise.all([
      fetchEP<{ data?: Meeting[] }>(`/meetings?year=${jaar}&limit=50&offset=0`),
      fetchEP<{ data?: Meeting[] }>(`/meetings?year=${jaar}&limit=50&offset=50`),
    ]);
    const zittingen = paginas
      .flatMap((p) => p.data ?? [])
      .map((m) => ({
        datum: (m.activity_date ?? "").slice(0, 10),
        sid: (m.id ?? "").split("/").pop() ?? "",
      }))
      .filter((z) => z.datum && z.sid);

    // 2. Zittingen deze week.
    const dezeWeek = zittingen.filter(
      (z) => z.datum >= weekVan && z.datum <= weekTot,
    );

    if (dezeWeek.length === 0) {
      const volgende = zittingen
        .map((z) => z.datum)
        .filter((d) => d > vandaag)
        .sort()[0];
      return { ...basis, volgendeZitting: volgende ?? null };
    }

    // 3. Agenda per zitting deze week (parallel).
    const agendas = await Promise.all(
      dezeWeek.map((z) =>
        fetchEP<{ data?: ForeseenActivity[] }>(
          `/meetings/${z.sid}/foreseen-activities?limit=50`,
        )
          .then((r) => ({ datum: z.datum, items: r.data ?? [] }))
          .catch(() => ({ datum: z.datum, items: [] as ForeseenActivity[] })),
      ),
    );

    const gezien = new Set<string>();
    const punten: AgendaPunt[] = [];
    for (const { datum, items } of agendas) {
      for (const a of items) {
        const lab = a.activity_label ?? {};
        const titel = (lab.nl ?? lab.en ?? lab.fr ?? Object.values(lab)[0] ?? "")
          .toString()
          .trim();
        if (!titel || isOnbruikbaar(titel)) continue;
        const key = titel.toLowerCase();
        if (gezien.has(key)) continue;
        gezien.add(key);
        punten.push({ datum, titel });
      }
    }
    punten.sort((a, b) => a.datum.localeCompare(b.datum));

    return { ...basis, heeftZitting: true, punten: punten.slice(0, 50) };
  } catch {
    return { ...basis, fout: true };
  }
}
