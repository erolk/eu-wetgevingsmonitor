import Link from "next/link";
import { THEMAS } from "@/lib/themas";
import { getAantallenPerThema } from "@/lib/eurlex";

export default async function Home() {
  const { aantallen, totaal, fout } = await getAantallenPerThema();

  return (
    <div className="space-y-14">
      <section>
        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight leading-tight max-w-3xl">
          Wat besluit Brussel — en wat merk jij ervan?
        </h1>
        <p className="mt-4 max-w-2xl text-mute leading-relaxed">
          Veel Nederlanders weten nauwelijks wat er in de Europese Unie wordt
          besloten, terwijl een groot deel van onze regels daar begint. Deze
          site maakt per beleidsterrein zichtbaar welke EU-wetgeving in de maak
          is, waar die in het proces zit, en hoe die doorwerkt in Nederland.
        </p>
        {!fout && totaal > 0 && (
          <p className="mt-3 text-sm text-ink">
            <span className="font-medium">{totaal}</span> lopende voorstellen
            van de Europese Commissie, live uit EUR-Lex.
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/hoe-het-werkt"
            className="inline-flex items-center gap-2 rounded-md bg-accent text-white px-4 py-2 text-sm hover:bg-accentDark transition"
          >
            Hoe werkt EU-wetgeving? →
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h2 className="font-serif text-2xl">Kies een beleidsterrein</h2>
          <span className="text-xs text-mute">{THEMAS.length} terreinen</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...THEMAS]
            .sort((a, b) => a.naam.localeCompare(b.naam, "nl"))
            .map((t) => {
              const n = aantallen[t.slug] ?? 0;
              return (
                <Link
                  key={t.slug}
                  href={`/beleidsterrein/${t.slug}`}
                  className="thema-tile block rounded-lg px-4 py-4 shadow-tile"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-serif text-base sm:text-lg leading-tight text-ink">
                      {t.naam}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-accent pt-1.5 shrink-0">
                      {t.dg}
                    </div>
                  </div>
                  <div className="text-xs text-mute mt-2 leading-relaxed">
                    {t.beschrijving}
                  </div>
                  {!fout && (
                    <div className="mt-3 text-xs text-mute">
                      {n > 0 ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-highlight" />
                          {n === 1 ? "1 lopend voorstel" : `${n} lopende voorstellen`}
                        </span>
                      ) : (
                        <span className="text-mute/70">
                          geen lopende voorstellen
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
        </div>
      </section>

      <section className="rounded-md border border-line bg-surface p-5 sm:p-6 space-y-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-highlight" />
          <h2 className="font-serif text-lg">Wat komt er nog aan</h2>
        </div>
        <p className="text-sm text-mute leading-relaxed max-w-2xl">
          De voorstellen komen nu live uit EUR-Lex. Daar bouwen we op verder:
          de exacte fase per voorstel (via de Legislative Observatory van het
          Europees Parlement), een uitleg in gewone taal — net als de
          Nederlandse Wetgevingsmonitor — en de koppeling van een EU-richtlijn
          naar de Nederlandse implementatiewet.
        </p>
      </section>

      <section className="text-sm text-mute">
        Brongegevens: open data van de Europese Unie (CC-BY). Deze website is
        geen officiële website van de Europese Unie of de Rijksoverheid.
      </section>
    </div>
  );
}
