import { describe, it, expect } from "vitest";
import { normaliseer, zoekVoorstellen } from "@/lib/zoek";
import type { Voorstel } from "@/lib/eurlex";

function mk(over: Partial<Voorstel>): Voorstel {
  return {
    celex: "52026PC0001",
    titel: "Titel",
    datum: "2026-05-01",
    type: "Verordening",
    url: "https://eur-lex.europa.eu",
    themaSlugs: [],
    onderwerpen: [],
    uitleg: "",
    uitlegBron: "sjabloon",
    aangenomen: false,
    ...over,
  };
}

const lijst: Voorstel[] = [
  mk({ celex: "52026PC0010", titel: "Steun aan Oekraïne", onderwerpen: ["Oekraïne"] }),
  mk({ celex: "52026PC0020", titel: "CO2-normen voor het klimaat", onderwerpen: ["klimaat"] }),
  mk({ celex: "52026PC0030", titel: "Klimaatsteun voor Oekraïne", onderwerpen: ["klimaat", "Oekraïne"] }),
];

describe("normaliseer", () => {
  it("verwijdert accenten en maakt kleine letters", () => {
    expect(normaliseer("Oekraïne")).toBe("oekraine");
    expect(normaliseer("CO2-NORMEN")).toBe("co2-normen");
  });
});

describe("zoekVoorstellen", () => {
  it("vindt op woord in de titel", () => {
    const r = zoekVoorstellen(lijst, "klimaat");
    expect(r.map((v) => v.celex)).toEqual(["52026PC0020", "52026PC0030"]);
  });
  it("is accent-ongevoelig (oekraine vindt Oekraïne)", () => {
    const r = zoekVoorstellen(lijst, "oekraine");
    expect(r.map((v) => v.celex)).toEqual(["52026PC0010", "52026PC0030"]);
  });
  it("alle woorden moeten matchen (AND)", () => {
    const r = zoekVoorstellen(lijst, "klimaat oekraine");
    expect(r.map((v) => v.celex)).toEqual(["52026PC0030"]);
  });
  it("vindt op CELEX-nummer", () => {
    expect(zoekVoorstellen(lijst, "52026PC0020").map((v) => v.celex)).toEqual(["52026PC0020"]);
  });
  it("lege zoekterm geeft niets", () => {
    expect(zoekVoorstellen(lijst, "")).toEqual([]);
    expect(zoekVoorstellen(lijst, "   ")).toEqual([]);
  });
  it("geen match geeft lege lijst", () => {
    expect(zoekVoorstellen(lijst, "ietsdatnietbestaat")).toEqual([]);
  });
});
