import Link from "next/link";

export const metadata = {
  title: "Hoe werkt EU-wetgeving? — EU-wetgevingsmonitor",
  description:
    "Van Commissievoorstel tot Europese wet — en wanneer Nederland het nog moet omzetten in eigen wetgeving.",
};

const STAPPEN = [
  {
    n: 1,
    titel: "Voorstel door de Europese Commissie",
    waar: "Europese Commissie",
    uitleg:
      "De Commissie (het 'dagelijks bestuur' van de EU) heeft als enige het recht om nieuwe wetten voor te stellen. Vaak na een openbare consultatie waarin burgers, bedrijven en organisaties mogen reageren.",
  },
  {
    n: 2,
    titel: "Standpunt Europees Parlement",
    waar: "Europees Parlement",
    uitleg:
      "Het rechtstreeks gekozen Europees Parlement (Nederland kiest 31 van de 720 leden) bestudeert het voorstel in een commissie en stemt over wijzigingen.",
  },
  {
    n: 3,
    titel: "Standpunt Raad van de EU",
    waar: "Raad van Ministers",
    uitleg:
      "De ministers van alle 27 lidstaten bepalen samen hun standpunt. Dit is de 'Raad van de EU' — niet te verwarren met de Europese Raad (de regeringsleiders).",
  },
  {
    n: 4,
    titel: "Onderhandelingen (trilogen)",
    waar: "Parlement + Raad + Commissie",
    uitleg:
      "Parlement en Raad onderhandelen, met de Commissie als bemiddelaar, over één gezamenlijke tekst. De meeste wetten worden hier definitief vormgegeven.",
  },
  {
    n: 5,
    titel: "Aanname",
    waar: "Parlement + Raad",
    uitleg:
      "Parlement én Raad moeten allebei akkoord gaan met dezelfde tekst. Pas dan is de wet aangenomen.",
  },
  {
    n: 6,
    titel: "Publicatie in het Publicatieblad",
    waar: "Publicatieblad van de EU",
    uitleg:
      "De aangenomen wet wordt gepubliceerd in het Publicatieblad van de EU (Official Journal). Vanaf hier loopt de klok voor inwerkingtreding.",
  },
  {
    n: 7,
    titel: "Inwerkingtreding — en mogelijk omzetting in Nederland",
    waar: "EU + Nederland",
    uitleg:
      "Hier hangt alles af van het type wet. Een verordening geldt meteen; een richtlijn moet Nederland eerst nog vertalen naar eigen wetgeving. Zie hieronder.",
  },
];

const SOORTEN = [
  {
    naam: "Verordening",
    kleur: "bg-accent text-white",
    geldt: "Direct in alle 27 lidstaten",
    nl: "Geen Nederlandse wet nodig — geldt rechtstreeks, ook in Nederland.",
    voorbeeld: "AVG (privacy), Digital Services Act.",
  },
  {
    naam: "Richtlijn",
    kleur: "bg-highlight text-ink",
    geldt: "Doel is bindend, vorm vrij",
    nl: "Nederland moet binnen een deadline (vaak 2 jaar) eigen wetgeving maken of aanpassen. Dán komt de Tweede en Eerste Kamer in beeld.",
    voorbeeld: "Richtlijn werk-privébalans → Wet betaald ouderschapsverlof.",
  },
  {
    naam: "Besluit",
    kleur: "bg-ink text-paper",
    geldt: "Alleen voor wie het betreft",
    nl: "Bindend voor de genoemde landen, bedrijven of personen. Vaak geen brede omzetting nodig.",
    voorbeeld: "Sancties tegen een land of bedrijf.",
  },
];

export default function HoeHetWerkt() {
  return (
    <article className="space-y-12">
      <header className="space-y-4 max-w-2xl">
        <Link
          href="/"
          className="text-sm text-mute hover:text-ink inline-flex items-center gap-1"
        >
          ← terug
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl tracking-tight leading-tight">
          Hoe werkt EU-wetgeving?
        </h1>
        <p className="text-mute leading-relaxed">
          De EU heeft geen kabinet of ministeries zoals Nederland. Drie
          instellingen maken samen de wetten — en afhankelijk van het type wet
          merk je dat direct, of pas nadat Nederland het zelf heeft omgezet.
        </p>
      </header>

      {/* De drie instellingen */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl">Wie maakt de wetten?</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-line bg-surface p-4">
            <div className="font-serif text-lg">Europese Commissie</div>
            <p className="text-sm text-mute mt-1 leading-relaxed">
              Stelt wetten voor (alleenrecht). 27 Eurocommissarissen, elk met
              een portefeuille — vergelijkbaar met ministers.
            </p>
          </div>
          <div className="rounded-md border border-line bg-surface p-4">
            <div className="font-serif text-lg">Europees Parlement</div>
            <p className="text-sm text-mute mt-1 leading-relaxed">
              720 rechtstreeks gekozen leden. Mede-wetgever. Nederland kiest er
              31, elke vijf jaar.
            </p>
          </div>
          <div className="rounded-md border border-line bg-surface p-4">
            <div className="font-serif text-lg">Raad van de EU</div>
            <p className="text-sm text-mute mt-1 leading-relaxed">
              De ministers van alle 27 lidstaten. Andere mede-wetgever. Hier zit
              de Nederlandse regering aan tafel.
            </p>
          </div>
        </div>
      </section>

      {/* Het proces */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl">Het proces, stap voor stap</h2>
        <ol className="space-y-6">
          {STAPPEN.map((s) => (
            <li key={s.n} className="flex items-start gap-4">
              <div className="h-9 w-9 rounded-full bg-accent text-white flex items-center justify-center font-serif text-base shrink-0">
                {s.n}
              </div>
              <div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-serif text-xl">{s.titel}</h3>
                  <span className="text-xs uppercase tracking-wider text-mute">
                    {s.waar}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink/80">
                  {s.uitleg}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Drie soorten + NL-doorwerking */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl">
          Wanneer merk ik er in Nederland iets van?
        </h2>
        <p className="text-sm text-mute leading-relaxed max-w-2xl">
          Dat hangt af van het soort wet. Dit is het belangrijkste om te
          begrijpen — het bepaalt of een EU-besluit meteen geldt of pas via een
          Nederlandse wet.
        </p>
        <div className="space-y-3">
          {SOORTEN.map((s) => (
            <div
              key={s.naam}
              className="rounded-md border border-line bg-surface p-4 grid gap-2 sm:grid-cols-[8rem_1fr] sm:items-start"
            >
              <div>
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${s.kleur}`}
                >
                  {s.naam}
                </span>
                <div className="text-xs text-mute mt-1.5">{s.geldt}</div>
              </div>
              <div className="text-sm leading-relaxed">
                <p>{s.nl}</p>
                <p className="text-mute text-xs mt-1">
                  Voorbeeld: {s.voorbeeld}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed">
          <strong className="text-ink">De brug naar Nederland:</strong> een
          EU-richtlijn leidt vrijwel altijd tot een Nederlandse
          implementatiewet, die de Tweede en Eerste Kamer behandelen. Die
          Nederlandse wetten kun je volgen op de{" "}
          <span className="font-medium">Wetgevingsmonitor</span> — deze
          EU-monitor laat zien wáár het begint.
        </div>
      </section>

      {/* Inwerkingtreding */}
      <section className="rounded-md border border-line bg-surface p-6 space-y-3">
        <h2 className="font-serif text-xl">
          Wanneer treedt een EU-wet in werking?
        </h2>
        <p className="text-sm leading-relaxed">
          Een verordening treedt meestal 20 dagen na publicatie in het
          Publicatieblad in werking en geldt dan direct in heel de EU. Bij een
          richtlijn staat in de tekst een omzettingstermijn (vaak twee jaar):
          binnen die periode moet Nederland eigen wetgeving klaar hebben. Haalt
          een land die deadline niet, dan kan de Europese Commissie een
          procedure starten bij het Hof van Justitie.
        </p>
      </section>

      <section className="text-sm text-mute">
        Bron en achtergrond:{" "}
        <a
          href="https://european-union.europa.eu/institutions-law-budget/law/how-eu-law-made_nl"
          className="underline hover:text-ink"
        >
          europa.eu — Hoe EU-wetgeving tot stand komt
        </a>
        .
      </section>
    </article>
  );
}
