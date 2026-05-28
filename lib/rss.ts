// Pure RSS 2.0-helpers. Bewust framework-loos en synchroon, zodat ze ook
// makkelijk in tests gevoerd kunnen worden zonder netwerk of Next.js-context.

/** Ontsnap de vijf XML-metakarakters. `&` eerst — anders dubbel-escapen. */
export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export type RssItem = {
  titel: string;
  link: string;
  /** Stabiele, unieke identifier (geen permalink-URL nodig). */
  guid: string;
  /** RFC 822-datum, bv. via `new Date().toUTCString()`. */
  pubDate: string;
  beschrijving: string;
  categorie?: string;
};

export type RssKanaal = {
  titel: string;
  link: string;
  beschrijving: string;
  /** Eigen URL van het feed-document (voor atom:link rel="self"). */
  feedUrl: string;
  /** Bv. "nl-nl". */
  taal: string;
  /** RFC 822-datum. */
  laatstGewijzigd: string;
  items: RssItem[];
};

export function bouwRssFeed(k: RssKanaal): string {
  const items = k.items
    .map(
      (i) => `    <item>
      <title>${escapeXml(i.titel)}</title>
      <link>${escapeXml(i.link)}</link>
      <guid isPermaLink="false">${escapeXml(i.guid)}</guid>
      <pubDate>${escapeXml(i.pubDate)}</pubDate>${
        i.categorie ? `\n      <category>${escapeXml(i.categorie)}</category>` : ""
      }
      <description>${escapeXml(i.beschrijving)}</description>
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(k.titel)}</title>
    <link>${escapeXml(k.link)}</link>
    <description>${escapeXml(k.beschrijving)}</description>
    <language>${escapeXml(k.taal)}</language>
    <lastBuildDate>${escapeXml(k.laatstGewijzigd)}</lastBuildDate>
    <atom:link href="${escapeXml(k.feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
