import { describe, it, expect } from "vitest";
import {
  bepaalType,
  themaSlugsVanCodes,
  sjabloonUitleg,
  formatDatum,
  rijNaarVoorstel,
  type Row,
} from "@/lib/eurlex";

describe("bepaalType", () => {
  it("herkent het instrument na 'Voorstel voor een/de ...'", () => {
    expect(bepaalType("Voorstel voor een verordening van het EP")).toBe(
      "Verordening",
    );
    expect(bepaalType("Voorstel voor een richtlijn betreffende X")).toBe(
      "Richtlijn",
    );
    expect(bepaalType("Voorstel voor een besluit van de Raad")).toBe("Besluit");
    expect(bepaalType("Voorstel voor een uitvoeringsbesluit van de Raad")).toBe(
      "Besluit",
    );
  });

  it("herkent 'gewijzigd voorstel'", () => {
    expect(bepaalType("Gewijzigd voorstel voor een verordening")).toBe(
      "Verordening",
    );
  });

  it("herkent aanbeveling en mededeling vooraan", () => {
    expect(bepaalType("Aanbeveling van de Raad over X")).toBe("Aanbeveling");
    expect(bepaalType("Mededeling van de Commissie aan het EP")).toBe(
      "Mededeling",
    );
  });

  it("kijkt naar het instrument vooraan, niet naar genoemde andere handelingen", () => {
    // Dit was de echte bug: de titel noemt een richtlijn, maar het voorstel
    // zelf is een besluit. Het type moet 'Besluit' zijn, niet 'Richtlijn'.
    expect(
      bepaalType(
        "Voorstel voor een besluit tot wijziging van Richtlijn 2003/87/EG",
      ),
    ).toBe("Besluit");
  });

  it("valt terug op 'Voorstel' bij een onbekend instrument", () => {
    expect(bepaalType("Standpunt van de Raad over de begroting")).toBe(
      "Voorstel",
    );
  });
});

describe("themaSlugsVanCodes", () => {
  it("mapt codes naar de juiste beleidsterreinen", () => {
    expect(themaSlugsVanCodes(["AGRI"])).toEqual(["landbouw"]);
  });

  it("dedupliceert wanneer meerdere codes naar hetzelfde terrein wijzen", () => {
    expect(themaSlugsVanCodes(["ENV", "POLL"])).toEqual(["milieu-en-klimaat"]);
  });

  it("behoudt meerdere terreinen in invoervolgorde", () => {
    expect(themaSlugsVanCodes(["AGRI", "PECH"])).toEqual([
      "landbouw",
      "oceanen-en-visserij",
    ]);
  });

  it("negeert onbekende codes", () => {
    expect(themaSlugsVanCodes(["ZZZ_ONBEKEND"])).toEqual([]);
    expect(themaSlugsVanCodes(["AGRI", "ZZZ"])).toEqual(["landbouw"]);
    expect(themaSlugsVanCodes([])).toEqual([]);
  });
});

describe("sjabloonUitleg", () => {
  it("legt per type uit wat het voor Nederland betekent", () => {
    expect(sjabloonUitleg("Verordening", [])).toContain("direct in Nederland");
    expect(sjabloonUitleg("Richtlijn", [])).toContain("omzetten in eigen wetgeving");
  });

  it("voegt onderwerpen toe als die er zijn", () => {
    expect(sjabloonUitleg("Richtlijn", ["energie", "klimaat"])).toContain(
      "Onderwerp: energie, klimaat.",
    );
  });

  it("heeft een generieke terugval", () => {
    expect(sjabloonUitleg("Voorstel", [])).toContain(
      "nog door het wetgevingsproces",
    );
  });
});

describe("formatDatum", () => {
  it("formatteert een ISO-datum naar leesbaar Nederlands", () => {
    const s = formatDatum("2026-05-18");
    expect(s).toContain("2026");
    expect(s).toContain("mei");
  });

  it("geeft rommel ongewijzigd terug", () => {
    expect(formatDatum("geen-datum")).toBe("geen-datum");
  });
});

describe("rijNaarVoorstel (EUR-Lex parser, met fixture)", () => {
  const basisRij: Row = {
    celex: { value: "52026PC0999" },
    date: { value: "2026-03-15" },
    title: { value: "Voorstel voor een verordening over de visserij" },
    codes: { value: "AGRI,ENV" },
    eurovoc: { value: "landbouw|milieu" },
  };

  it("zet een SPARQL-rij om naar de juiste Voorstel-vorm", () => {
    const v = rijNaarVoorstel(basisRij);
    expect(v.celex).toBe("52026PC0999");
    expect(v.datum).toBe("2026-03-15");
    expect(v.type).toBe("Verordening");
    expect(v.themaSlugs).toContain("landbouw");
    expect(v.themaSlugs).toContain("milieu-en-klimaat");
    expect(v.onderwerpen).toEqual(["landbouw", "milieu"]);
    expect(v.url).toContain("CELEX:52026PC0999");
    expect(v.uitlegBron).toBe("sjabloon");
    expect(v.aangenomen).toBe(false);
  });

  it("herkent een aangenomen handeling", () => {
    const v = rijNaarVoorstel({
      ...basisRij,
      aangenomen: { value: "32026R0500" },
      aangenomenDatum: { value: "2026-06-01" },
    });
    expect(v.aangenomen).toBe(true);
    expect(v.aangenomenDatum).toBe("2026-06-01");
    expect(v.aangenomenUrl).toContain("CELEX:32026R0500");
  });
});
