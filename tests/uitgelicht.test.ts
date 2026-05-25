import { describe, it, expect } from "vitest";
import { bepaalImpact, isoWeek } from "@/lib/uitgelicht";
import type { Voorstel } from "@/lib/eurlex";

function mk(p: Partial<Voorstel>): Voorstel {
  return {
    celex: "52026PC0001",
    titel: "",
    datum: "2026-05-01",
    type: "Verordening",
    url: "https://eur-lex.europa.eu/",
    themaSlugs: [],
    onderwerpen: [],
    uitleg: "",
    uitlegBron: "ai",
    aangenomen: false,
    ...p,
  };
}

describe("bepaalImpact — kiest de impact-lens die de burger het meest raakt", () => {
  it("herkent de portemonnee aan belasting-terrein en trefwoorden", () => {
    const r = bepaalImpact(
      mk({ titel: "Voorstel voor een richtlijn over de btw-tarieven", themaSlugs: ["belastingen"] }),
    );
    expect(r.categorie.key).toBe("portemonnee");
    expect(r.score).toBeGreaterThan(0);
  });

  it("herkent de leefomgeving aan milieu-terrein en trefwoorden", () => {
    const r = bepaalImpact(
      mk({
        titel: "Voorstel voor een richtlijn over luchtkwaliteit en uitstoot",
        themaSlugs: ["milieu-en-klimaat"],
      }),
    );
    expect(r.categorie.key).toBe("leefomgeving");
  });

  it("herkent de bevolkingssamenstelling aan migratie/asiel", () => {
    const r = bepaalImpact(
      mk({
        titel: "Voorstel voor een verordening over asiel en migratie",
        themaSlugs: ["justitie-vrijheid-veiligheid"],
      }),
    );
    expect(r.categorie.key).toBe("bevolking");
  });

  it("geeft score 0 voor een puur procedureel voorstel zonder impact-signalen", () => {
    const r = bepaalImpact(
      mk({ titel: "Besluit over het EU-standpunt in een comité", themaSlugs: ["institutionele-zaken"] }),
    );
    expect(r.score).toBe(0);
  });
});

describe("isoWeek — ISO-8601 weeknummer", () => {
  it("4 januari valt altijd in week 1", () => {
    expect(isoWeek(new Date(2026, 0, 4))).toBe(1);
    expect(isoWeek(new Date(2021, 0, 4))).toBe(1);
  });

  it("1 januari 2021 (vrijdag) hoort nog bij week 53 van 2020", () => {
    expect(isoWeek(new Date(2021, 0, 1))).toBe(53);
  });

  it("geeft een geldig weeknummer in het bereik 1–53", () => {
    const w = isoWeek(new Date(2026, 4, 25));
    expect(w).toBeGreaterThanOrEqual(1);
    expect(w).toBeLessThanOrEqual(53);
  });
});
