import { describe, it, expect } from "vitest";
import { veiligeSiteUrl } from "@/lib/site";

const STANDAARD = "https://eu-wetgevingsmonitor.vercel.app";

describe("veiligeSiteUrl", () => {
  it("valt terug op de standaard-URL bij leeg of undefined", () => {
    expect(veiligeSiteUrl(undefined)).toBe(STANDAARD);
    expect(veiligeSiteUrl("")).toBe(STANDAARD);
    expect(veiligeSiteUrl("   ")).toBe(STANDAARD);
  });

  it("plakt https:// voor een waarde zonder schema", () => {
    expect(veiligeSiteUrl("mijn-site.nl")).toBe("https://mijn-site.nl");
  });

  it("behoudt een geldige https/http-URL", () => {
    expect(veiligeSiteUrl("https://voorbeeld.nl")).toBe("https://voorbeeld.nl");
    expect(veiligeSiteUrl("http://voorbeeld.nl")).toBe("http://voorbeeld.nl");
  });

  it("verwijdert een trailing slash", () => {
    expect(veiligeSiteUrl("https://voorbeeld.nl/")).toBe("https://voorbeeld.nl");
  });

  it("crasht niet op rommel maar valt terug op de standaard", () => {
    // 'http://' heeft geen host → new URL() gooit → terugval. Dit type
    // invoer liet eerder de build crashen op new URL(SITE_URL).
    expect(veiligeSiteUrl("http://")).toBe(STANDAARD);
  });
});
