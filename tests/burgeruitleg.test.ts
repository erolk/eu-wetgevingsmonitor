import { describe, it, expect } from "vitest";
import { BURGERUITLEG } from "@/lib/burgeruitleg";

describe("BURGERUITLEG — vooraf geschreven samenvattingen", () => {
  const entries = Object.entries(BURGERUITLEG);

  it("bevat een ruime set samenvattingen", () => {
    expect(entries.length).toBeGreaterThanOrEqual(290);
  });
  it("elke sleutel is een CELEX van een voorstel (5xxxxPC…)", () => {
    for (const key of Object.keys(BURGERUITLEG)) {
      expect(key).toMatch(/^5\d{4}PC/);
    }
  });
  it("elke uitleg is een niet-lege tekst van fatsoenlijke lengte", () => {
    for (const [key, tekst] of entries) {
      expect(typeof tekst, key).toBe("string");
      expect(tekst.trim().length, key).toBeGreaterThan(20);
    }
  });
});
