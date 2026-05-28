// RSS-feed van de "wet van de week". Eén item per request — namelijk de
// uitgelichte wet van de huidige ISO-week. RSS-readers (Feedly, NetNewsWire,
// etc.) pikken het nieuwe item op zodra de week verspringt; de onderliggende
// EUR-Lex-cache ververst zichzelf dagelijks via dezelfde tags als de site.

import { bouwRssFeed, type RssItem } from "@/lib/rss";
import { getUitgelichteWet, isoWeek } from "@/lib/uitgelicht";
import { SITE_NAAM, SITE_URL } from "@/lib/site";

// ISR-cache: feed wordt hoogstens 1x per dag opnieuw gebouwd.
export const revalidate = 86400;

/** Maandag (00:00 lokaal) van de ISO-week waarin `d` valt. */
function maandagVanWeek(d: Date): Date {
  const t = new Date(d);
  const dag = (t.getDay() + 6) % 7; // ma=0 … zo=6
  t.setDate(t.getDate() - dag);
  t.setHours(0, 0, 0, 0);
  return t;
}

export async function GET(): Promise<Response> {
  const nu = new Date();
  const item = await getUitgelichteWet(nu);

  const feedUrl = `${SITE_URL}/feed/wet-van-de-week.xml`;
  const items: RssItem[] = [];
  let laatstGewijzigd = nu.toUTCString();

  if (item) {
    const week = isoWeek(nu);
    const weekKey = `${nu.getFullYear()}-W${week}`;
    const maandag = maandagVanWeek(nu);
    laatstGewijzigd = maandag.toUTCString();
    items.push({
      titel: `${item.categorie.label} · ${item.voorstel.titel}`,
      link: item.voorstel.url,
      guid: `urn:euwetgevingsmonitor:wvdw:${weekKey}:${item.voorstel.celex}`,
      pubDate: maandag.toUTCString(),
      categorie: item.categorie.label,
      beschrijving: item.voorstel.uitleg,
    });
  }

  const xml = bouwRssFeed({
    titel: `${SITE_NAAM} — wet van de week`,
    link: SITE_URL,
    beschrijving:
      "Elke week één EU-wet die Nederland het meest direct raakt — portemonnee, leefomgeving, bevolking of samenleving.",
    feedUrl,
    taal: "nl-nl",
    laatstGewijzigd,
    items,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
