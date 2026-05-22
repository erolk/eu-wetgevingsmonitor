import { describe, it, expect } from "vitest";
import { normaliseer, zoekVoorstellen } from "@/lib/zoek";
import type { Voorstel } from "@/lib/eurlex";

function voorstel(over: Partial<Voorstel>): Voorstel {
  return {
    celex: "52026PC0001",
    titel: "Test",
    datum: "2026-01-01",
    type: "Voorstel",
    url: "https://example.test",
    themaSlugs: [],
    onderwerpen: [],
    uitleg: "",
    uitlegBron: "sjabloon",
    aangenomen: false,
    ...over,
  };
}

describe("normaliseer", () => {
  it("verwijdert accenten en maakt lowercase", () => {
    expect(normaliseer("Oekraïne")).toBe("oekraine");
    expect(normaliseer("CO₂-uitstoot")).toBe("co₂-uitstoot");
    expect(normaliseer("Évora")).toBe("evora");
  });
});

describe("zoekVoorstellen", () => {
  const data = [
    voorstel({ celex: "A", titel: "Verordening over visserij in de Noordzee" }),
    voorstel({ celex: "B", titel: "Richtlijn over luchtkwaliteit en milieu" }),
    voorstel({ celex: "C", titel: "Steun aan Oekraïne", onderwerpen: ["humanitaire hulp"] }),
  ];

  it("geeft niets terug bij een lege zoekterm", () => {
    expect(zoekVoorstellen(data, "")).toEqual([]);
    expect(zoekVoorstellen(data, "   ")).toEqual([]);
  });

  it("matcht accent-ongevoelig", () => {
    // 'oekraine' zonder trema moet 'Oekraïne' vinden.
    const r = zoekVoorstellen(data, "oekraine");
    expect(r.map((v) => v.celex)).toEqual(["C"]);
  });

  it("vereist dat ALLE woorden voorkomen (AND)", () => {
    expect(zoekVoorstellen(data, "visserij noordzee").map((v) => v.celex)).toEqual([
      "A",
    ]);
    // 'visserij milieu' komt in geen enkel voorstel samen voor.
    expect(zoekVoorstellen(data, "visserij milieu")).toEqual([]);
  });

  it("zoekt ook in onderwerpen", () => {
    expect(zoekVoorstellen(data, "humanitaire").map((v) => v.celex)).toEqual([
      "C",
    ]);
  });
});
