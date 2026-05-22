import { describe, it, expect } from "vitest";
import { rijNaarVoorstel, type Row } from "@/lib/eurlex";

// Parser-test met een vaste fixture (geen live SPARQL-call): controleert dat
// één EUR-Lex-rij naar de juiste Voorstel-vorm wordt omgezet.
describe("rijNaarVoorstel — EUR-Lex SPARQL-rij → Voorstel", () => {
  const basisRij: Row = {
    celex: { value: "52026PC0999" },
    date: { value: "2026-03-15" },
    title: { value: "Voorstel voor een verordening over de visserij" },
    codes: { value: "AGRI,ENV" },
    eurovoc: { value: "landbouw|milieu" },
  };

  it("zet een rij om naar de juiste velden en vorm", () => {
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

  it("herkent een aangenomen handeling met datum en link", () => {
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
