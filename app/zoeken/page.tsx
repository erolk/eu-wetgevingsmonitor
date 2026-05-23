import type { Metadata } from "next";
import { getVoorstellen } from "@/lib/eurlex";
import { zoekVoorstellen } from "@/lib/zoek";
import { Voorstelkaart } from "@/app/components/Voorstelkaart";

export const metadata: Metadata = {
  title: "Zoeken",
  description:
    "Doorzoek alle EU-voorstellen op titel, onderwerp, beleidsterrein en de uitleg in gewone taal.",
  alternates: { canonical: "/zoeken" },
};

type Params = { searchParams: Promise<{ q?: string }> };

export default async function ZoekenPage({ searchParams }: Params) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const { voorstellen, fout } = await getVoorstellen();
  const resultaten = zoekVoorstellen(voorstellen, query);

  return (
    <div className="space-y-8">
      <header className="space-y-3 max-w-2xl">
        <h1 className="font-serif text-2xl sm:text-3xl tracking-tight leading-tight">
          Zoek in alle EU-voorstellen
        </h1>
        <p className="text-mute leading-relaxed">
          Doorzoekt alle beleidsterreinen tegelijk — op titel, onderwerp, het
          type en de uitleg in gewone taal. Tip: probeer bijvoorbeeld{" "}
          <span className="text-ink">klimaat</span>,{" "}
          <span className="text-ink">Oekraïne</span>,{" "}
          <span className="text-ink">visserij</span> of{" "}
          <span className="text-ink">belasting</span>.
        </p>
      </header>

      <form action="/zoeken" method="get" role="search" className="max-w-xl">
        <label htmlFor="q" className="sr-only">
          Zoekterm
        </label>
        <div className="flex gap-2">
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            autoFocus
            placeholder="Bv. klimaat, Oekraïne, visserij, belasting…"
            className="flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-mute/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            className="rounded-md bg-accent text-white px-4 py-2 text-sm hover:bg-accentDark transition shrink-0"
          >
            Zoeken
          </button>
        </div>
      </form>

      {fout ? (
        <div className="rounded-md border border-line bg-surface p-6 text-sm text-mute leading-relaxed">
          De koppeling met EUR-Lex is op dit moment niet bereikbaar. Probeer het
          later nog eens.
        </div>
      ) : query === "" ? (
        <p className="text-sm text-mute">
          Typ hierboven een zoekterm om te beginnen.
        </p>
      ) : resultaten.length === 0 ? (
        <p className="text-sm text-mute">
          Geen voorstellen gevonden voor{" "}
          <span className="text-ink font-medium">“{query}”</span>. Probeer een
          ander of korter woord.
        </p>
      ) : (
        <section className="space-y-4">
          <p className="text-sm text-mute">
            {resultaten.length} resultaat{resultaten.length === 1 ? "" : "en"}{" "}
            voor <span className="text-ink font-medium">“{query}”</span>
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {resultaten.map((v) => (
              <Voorstelkaart key={v.celex} voorstel={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
