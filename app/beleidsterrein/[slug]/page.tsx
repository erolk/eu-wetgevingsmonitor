import Link from "next/link";
import { notFound } from "next/navigation";
import { getThema, THEMAS } from "@/lib/themas";

export function generateStaticParams() {
  return THEMAS.map((t) => ({ slug: t.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export default async function BeleidsterreinPage({ params }: Params) {
  const { slug } = await params;
  const thema = getThema(slug);
  if (!thema) notFound();

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

      <section className="rounded-md border border-line bg-surface p-6 space-y-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-highlight" />
          <h2 className="font-serif text-lg">Wetgeving komt hier binnenkort</h2>
        </div>
        <p className="text-sm text-mute leading-relaxed max-w-2xl">
          Zodra de koppeling met EUR-Lex en de Legislative Observatory klaar is,
          zie je hier de lopende en afgeronde EU-voorstellen op dit terrein, met
          hun fase in het proces en wat ze voor Nederland betekenen.
        </p>
        <p>
          <Link
            href="/hoe-het-werkt"
            className="text-sm text-accent underline hover:no-underline"
          >
            Lees alvast hoe EU-wetgeving werkt →
          </Link>
        </p>
      </section>
    </div>
  );
}
