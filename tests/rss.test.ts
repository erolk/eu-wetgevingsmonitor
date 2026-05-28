import { describe, it, expect } from "vitest";
import { bouwRssFeed, escapeXml } from "@/lib/rss";

describe("escapeXml — XML-metakarakters ontsnappen", () => {
  it("ontsnapt alle vijf metakarakters", () => {
    expect(escapeXml(`a&b<c>d"e'f`)).toBe(
      `a&amp;b&lt;c&gt;d&quot;e&apos;f`,
    );
  });

  it("ontsnapt & eerst om dubbel-escapen te voorkomen", () => {
    expect(escapeXml("&lt;")).toBe("&amp;lt;");
  });

  it("lege string blijft leeg", () => {
    expect(escapeXml("")).toBe("");
  });
});

describe("bouwRssFeed — geldig RSS 2.0-document", () => {
  const basis = {
    titel: "T",
    link: "https://example.com/",
    beschrijving: "B",
    feedUrl: "https://example.com/feed.xml",
    taal: "nl-nl",
    laatstGewijzigd: "Mon, 25 May 2026 00:00:00 GMT",
  };

  it("bouwt een geldig feed met één item, en ontsnapt karakters", () => {
    const xml = bouwRssFeed({
      ...basis,
      items: [
        {
          titel: "Item & title",
          link: "https://example.com/i",
          guid: "urn:x:1",
          pubDate: "Mon, 25 May 2026 00:00:00 GMT",
          beschrijving: "Body <p>",
          categorie: "Leefomgeving",
        },
      ],
    });
    expect(xml).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(xml).toContain(`<rss version="2.0"`);
    expect(xml).toContain("<title>T</title>");
    expect(xml).toContain("<title>Item &amp; title</title>");
    expect(xml).toContain("<description>Body &lt;p&gt;</description>");
    expect(xml).toContain(`<guid isPermaLink="false">urn:x:1</guid>`);
    expect(xml).toContain("<category>Leefomgeving</category>");
    expect(xml).toContain(
      `<atom:link href="https://example.com/feed.xml" rel="self" type="application/rss+xml" />`,
    );
  });

  it("bouwt een geldig leeg feed zonder items", () => {
    const xml = bouwRssFeed({ ...basis, items: [] });
    expect(xml).toContain("<channel>");
    expect(xml).toContain("</channel>");
    expect(xml).not.toContain("<item>");
  });

  it("laat <category> weg als die niet is opgegeven", () => {
    const xml = bouwRssFeed({
      ...basis,
      items: [
        {
          titel: "x",
          link: "https://example.com/x",
          guid: "g",
          pubDate: basis.laatstGewijzigd,
          beschrijving: "y",
        },
      ],
    });
    expect(xml).not.toContain("<category>");
  });
});
