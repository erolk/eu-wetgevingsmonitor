import { describe, it, expect } from "vitest";
import {
  bepaalType,
  sjabloonUitleg,
  themaSlugsVanCodes,
  formatDatum,
} from "@/lib/eurlex";
import { THEMAS } from "@/lib/themas";

describe("bepaalType — type bepalen op het instrument vóóraan in de titel", () => {
  it("herkent een verordening", () => {
    expect(
      bepaalType("Voorstel voor een VERORDENING VAN HET EUROPEES PARLEMENT EN DE RAAD over X"),
    ).toBe("Verordening");
  });
  it("herkent een richtlijn", () => {
    expect(bepaalType("Voorstel voor een RICHTLIJN VAN HET EUROPEES PARLEMENT EN DE RAAD")).toBe(
      "Richtlijn",
    );
  });
  it("herkent een mededeling", () => {
    expect(
      bepaalType("MEDEDELING VAN DE COMMISSIE AAN HET EUROPEES PARLEMENT overeenkomstig artikel 294"),
    ).toBe("Mededeling");
  });
  it("herkent een aanbeveling", () => {
    expect(bepaalType("Aanbeveling voor een BESLUIT VAN DE RAAD houdende machtiging")).toBe(
      "Aanbeveling",
    );
  });
  it("herkent 'Gewijzigd voorstel voor een VERORDENING'", () => {
    expect(bepaalType("Gewijzigd voorstel voor een VERORDENING VAN DE RAAD")).toBe("Verordening");
  });
  // Regressietest: een uitvoeringsbesluit dat een RICHTLIJN/VERORDENING noemt
  // moet 'Besluit' zijn, niet het verderop genoemde instrument.
  it("uitvoeringsbesluit dat een richtlijn noemt → Besluit", () => {
    expect(
      bepaalType(
        "Voorstel voor een UITVOERINGSBESLUIT VAN DE RAAD waarbij Zweden overeenkomstig artikel 19 van Richtlijn 2003/96/EG wordt gemachtigd",
      ),
    ).toBe("Besluit");
  });
  it("uitvoeringsbesluit tot intrekking van een verordening → Besluit", () => {
    expect(
      bepaalType(
        "Voorstel voor een UITVOERINGSBESLUIT VAN DE RAAD tot intrekking van Uitvoeringsbesluit (EU) 2024/1341 ... van Verordening (EG) nr. 810/2009",
      ),
    ).toBe("Besluit");
  });
});

describe("themaSlugsVanCodes — subject-matter-codes → beleidsterreinen", () => {
  const geldig = new Set(THEMAS.map((t) => t.slug));

  it("mapt een enkele code", () => {
    expect(themaSlugsVanCodes(["FISC"])).toEqual(["belastingen"]);
    expect(themaSlugsVanCodes(["TRAN"])).toEqual(["vervoer"]);
  });
  it("dedupliceert codes die naar hetzelfde terrein wijzen", () => {
    expect(themaSlugsVanCodes(["ENV", "POLL", "DECH"])).toEqual(["milieu-en-klimaat"]);
  });
  it("kan onder meerdere terreinen vallen", () => {
    const slugs = themaSlugsVanCodes(["EXT", "FISC"]);
    expect(slugs).toContain("externe-betrekkingen");
    expect(slugs).toContain("belastingen");
  });
  it("negeert onbekende codes", () => {
    expect(themaSlugsVanCodes(["ZZZ", "ONBEKEND"])).toEqual([]);
  });
  it("geeft alleen bestaande beleidsterrein-slugs terug", () => {
    for (const slug of themaSlugsVanCodes(["FISC", "ENV", "TRAN", "EXT", "SANT"])) {
      expect(geldig.has(slug)).toBe(true);
    }
  });
});

describe("sjabloonUitleg — terugval-uitleg per type", () => {
  it("verordening: geldt direct", () => {
    expect(sjabloonUitleg("Verordening", []).toLowerCase()).toContain("direct");
  });
  it("richtlijn: Nederland moet omzetten", () => {
    expect(sjabloonUitleg("Richtlijn", []).toLowerCase()).toContain("omzetten");
  });
  it("voegt onderwerpen toe als die er zijn", () => {
    expect(sjabloonUitleg("Besluit", ["visserij", "Oostzee"])).toContain("Onderwerp:");
  });
});

describe("formatDatum", () => {
  it("formatteert ISO-datum naar Nederlands", () => {
    expect(formatDatum("2026-05-18")).toBe("18 mei 2026");
  });
});
