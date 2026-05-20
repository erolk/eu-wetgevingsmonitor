import Link from "next/link";
import { notFound } from "next/navigation";
import { getThema, THEMAS } from "@/lib/themas";
import { getVoorstellenVoorThema } from "@/lib/eurlex";
import { Voorstelkaart } from "@/app/components/Voorstelkaart";
import { FASEN } from "@/app/components/Procesbalk";

export function generateStaticParams() {
  return THEMAS.map((t) => ({ slug: t.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export default async function BeleidsterreinPage({ params }: Params) {
  const { slug } = await params;
  const thema = getThema(slug);
  if (!thema) notFound();

  const { voorstellen, fout } = await getVoorstellenVoorThema(slug);

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="text-sm text-mute hover:text-ink inline-flex items-center gap-1"
      >
        ← alle beleidsterreinen
      </Link>

      <header>
        <div className="text-xs text-mute uppercase tracking-wider mb-1">
          Beleidsterrein · DG {thema.dg}
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl tracking-tight leading-tight">
          {thema.naam}
        </h1>
        <p className="mt-3 max-w-2xl text-mute leading-relaxed">
          {thema.beschrijving}
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-xl">Lopende EU-voorstellen</h2>
          {!fout && voorstellen.length > 0 && (
            <span className="text-xs text-mute shrink-0">
              {voorstellen.length} voorstel{voorstellen.length === 1 ? "" : "len"}
            </span>
          )}
        </div>

        {fout ? (
          <div className="rounded-md border border-line bg-surface p-6 text-sm text-mute leading-relaxed">
            De live koppeling met EUR-Lex is op dit moment niet bereikbaar.
            Probeer het later nog eens — de gegevens worden dagelijks ververst.
          </div>
        ) : voorstellen.length === 0 ? (
          <div className="rounded-md border border-line bg-surface p-6 text-sm text-mute leading-relaxed">
            Geen voorstellen op dit terrein in de afgelopen maanden. Zodra de
            Europese Commissie iets nieuws indient, verschijnt het hier.
          </div>
        ) : (
          <>
            <p className="text-sm text-mute leading-relaxed max-w-2xl">
              Recente voorstellen van de Europese Commissie op dit terrein,
              nieuwste eerst. De balk toont het wetgevingsproces (
              {FASEN.join(" → ")}); nieuwe voorstellen staan aan het begin.
              Klik door naar EUR-Lex voor de volledige tekst.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {voorstellen.map((v) => (
                <Voorstelkaart key={v.celex} voorstel={v} />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="rounded-md border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed">
        <strong className="text-ink">Wat betekent dit voor Nederland?</strong>{" "}
        Een <span className="font-medium">verordening</span> geldt direct, ook
        hier. Een <span className="font-medium">richtlijn</span> moet Nederland
        nog omzetten in eigen wetgeving — dan komt de zaak in de Tweede en
        Eerste Kamer.{" "}
        <Link href="/hoe-het-werkt" className="text-accent underline hover:no-underline">
          Lees hoe EU-wetgeving werkt →
        </Link>
      </section>
    </div>
  );
}
