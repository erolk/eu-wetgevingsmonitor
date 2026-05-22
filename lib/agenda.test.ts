import { describe, it, expect } from "vitest";
import { isOnbruikbaar, weekGrenzen } from "@/lib/agenda";

describe("isOnbruikbaar (agenda-ruis filteren)", () => {
  it("markeert hoofdletter-koppen (zonder kleine letter) als ruis", () => {
    expect(isOnbruikbaar("PLENAIRE VERGADERING")).toBe(true);
  });

  it("markeert procedurele punten als ruis", () => {
    expect(isOnbruikbaar("Stemmingen")).toBe(true);
    expect(isOnbruikbaar("Regeling van de werkzaamheden")).toBe(true);
    expect(isOnbruikbaar("Opening van de vergadering")).toBe(true);
  });

  it("laat echte, inhoudelijke debatten door", () => {
    expect(
      isOnbruikbaar("Debat over de toekomst van het visserijbeleid"),
    ).toBe(false);
    expect(isOnbruikbaar("Bescherming van journalisten in de EU")).toBe(false);
  });
});

describe("weekGrenzen (maandag/zondag rond een datum)", () => {
  it("berekent de week vanaf een woensdag", () => {
    // 2024-01-03 is een woensdag → week loopt ma 1 jan t/m zo 7 jan.
    expect(weekGrenzen(new Date("2024-01-03T12:00:00Z"))).toEqual([
      "2024-01-01",
      "2024-01-07",
    ]);
  });

  it("werkt op de maandag zelf", () => {
    expect(weekGrenzen(new Date("2024-01-01T00:00:00Z"))).toEqual([
      "2024-01-01",
      "2024-01-07",
    ]);
  });

  it("werkt op de zondag zelf (telt bij dezelfde week)", () => {
    expect(weekGrenzen(new Date("2024-01-07T00:00:00Z"))).toEqual([
      "2024-01-01",
      "2024-01-07",
    ]);
  });
});
