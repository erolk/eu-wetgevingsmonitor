export const metadata = {
  title: "Over — EU-wetgevingsmonitor",
};

export default function Over() {
  return (
    <article className="prose prose-sm max-w-2xl space-y-4">
      <h1 className="font-serif text-2xl sm:text-3xl">Over deze site</h1>

      <p>
        De EU-wetgevingsmonitor maakt zichtbaar welke wetgeving de Europese
        Unie maakt, per beleidsterrein, en hoe die doorwerkt in Nederland. Veel
        Nederlanders weten weinig over wat er in Brussel wordt besloten,
        terwijl een aanzienlijk deel van onze regels daar begint.
      </p>

      <p>
        De site is onafhankelijk, niet-commercieel en heeft geen banden met de
        Europese Unie, de Rijksoverheid of een politieke partij. Doel: het
        Europese wetgevingsproces begrijpelijk en volgbaar maken voor gewone
        burgers.
      </p>

      <h2 className="font-serif text-xl mt-8">Geplande bronnen</h2>
      <ul className="list-disc pl-6 space-y-1 text-sm">
        <li>
          <strong>EUR-Lex</strong> — eur-lex.europa.eu. Alle EU-wetgeving en
          voorstellen, met een REST- en SPARQL-API. Licentie: CC-BY.
        </li>
        <li>
          <strong>Legislative Observatory (OEIL)</strong> —
          oeil.secure.europarl.europa.eu. Volgt de voortgang per wetgevings­
          procedure.
        </li>
        <li>
          <strong>Europees Parlement Open Data</strong> —
          data.europarl.europa.eu. Stemmingen, leden en agenda.
        </li>
      </ul>

      <h2 className="font-serif text-xl mt-8">Status</h2>
      <p className="text-sm">
        Dit is een eerste versie: het ontwerp, de uitleg over het proces en de
        indeling per beleidsterrein staan. De live koppeling met EU-data wordt
        nog gebouwd.
      </p>

      <h2 className="font-serif text-xl mt-8">Disclaimer</h2>
      <p className="text-sm text-mute">
        Brongegevens zijn open en betrouwbaar, maar er kan vertraging of een
        weergavefout in zitten. Voor besluitvorming altijd de officiële bron
        raadplegen. Deze website is geen officiële website van de Europese Unie
        of de Rijksoverheid.
      </p>
    </article>
  );
}
