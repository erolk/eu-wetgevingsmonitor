import { describe, it, expect } from "vitest";
import { isOnbruikbaar, weekGrenzen } from "@/lib/agenda";

describe("isOnbruikbaar — procedurele ruis uit de agenda filteren", () => {
  it("filtert hoofdletter-koppen (geen kleine letter)", () => {
    expect(isOnbruikbaar("PLENAIRE VERGADERING")).toBe(true);
    expect(isOnbruikbaar("DEBATES")).toBe(true);
  });
  it("filtert procedurele punten", () => {
    expect(isOnbruikbaar("Stemverklaringen")).toBe(true);
    expect(isOnbruikbaar("Stemmingen")).toBe(true);
    expect(isOnbruikbaar("Hervatting van de zitting en regeling van de werkzaamheden")).toBe(true);
    expect(isOnbruikbaar("Redevoeringen van één minuut (artikel 179 van het Reglement)")).toBe(true);
  });
  it("behoudt echte debat-onderwerpen", () => {
    expect(isOnbruikbaar("Rechten, ondersteuning en bescherming van slachtoffers van strafbare feiten")).toBe(false);
    expect(isOnbruikbaar("Recente voorstellen ter bestrijding van armoede in de EU")).toBe(false);
    expect(isOnbruikbaar("Het meerjarenplan voor de Oostzee en volgende stappen")).toBe(false);
  });
});

describe("weekGrenzen — maandag t/m zondag van de week rond een datum", () => {
  it("donderdag 21 mei 2026 → ma 18 t/m zo 24", () => {
    expect(weekGrenzen(new Date("2026-05-21T12:00:00Z"))).toEqual(["2026-05-18", "2026-05-24"]);
  });
  it("maandag valt op de ondergrens", () => {
    expect(weekGrenzen(new Date("2026-05-18T12:00:00Z"))).toEqual(["2026-05-18", "2026-05-24"]);
  });
  it("zondag valt op de bovengrens", () => {
    expect(weekGrenzen(new Date("2026-05-24T12:00:00Z"))).toEqual(["2026-05-18", "2026-05-24"]);
  });
  it("de week beslaat altijd 7 dagen", () => {
    const [van, tot] = weekGrenzen(new Date("2026-01-01T12:00:00Z"));
    const dagen = (new Date(tot).getTime() - new Date(van).getTime()) / 86400000;
    expect(dagen).toBe(6);
  });
});
