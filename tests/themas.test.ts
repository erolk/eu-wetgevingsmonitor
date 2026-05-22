import { describe, it, expect } from "vitest";
import { THEMAS, getThema } from "@/lib/themas";

describe("THEMAS — de 32 EUR-Lex-beleidsterreinen", () => {
  it("bevat 32 terreinen", () => {
    expect(THEMAS).toHaveLength(32);
  });
  it("heeft unieke slugs", () => {
    const slugs = THEMAS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("elk terrein heeft de verplichte velden ingevuld", () => {
    for (const t of THEMAS) {
      expect(t.slug).toMatch(/^[a-z0-9-]+$/);
      expect(t.naam.length).toBeGreaterThan(0);
      expect(t.korteNaam.length).toBeGreaterThan(0);
      expect(t.beschrijving.length).toBeGreaterThan(0);
    }
  });
});

describe("getThema", () => {
  it("vindt een bestaand terrein", () => {
    expect(getThema("vervoer")?.naam).toBe("Vervoer");
  });
  it("geeft undefined voor een onbekend terrein", () => {
    expect(getThema("bestaat-niet")).toBeUndefined();
  });
});
