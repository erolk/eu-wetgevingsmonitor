import Link from "next/link";
import { formatDatum } from "@/lib/eurlex";
import { getThema } from "@/lib/themas";
import type { UitgelichtItem } from "@/lib/uitgelicht";

/**
 * "Uitgelichte wet van de week" — één voorstel dat de Nederlandse burger het
 * meest direct raakt, prominent op de homepage. Rendert niets als er (nog)
 * geen geschikte wet is.
 */
export function UitgelichteWet({ item }: { item: UitgelichtItem | null }) {
  if (!item) return null;
  const { voorstel: v, categorie } = item;
  const thema = v.themaSlugs[0] ? getThema(v.themaSlugs[0]) : undefined;
  const themaUrl = thema ? `/beleidsterrein/${thema.slug}` : "/";

  return (
    <section
      aria-label={`Uitgelichte wet: ${categorie.label}`}
      className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-tile"
    >
      {/* Accentrand links, in EU-blauw. */}
      <span className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden />
      <div className="p-5 sm:p-7">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent">
          <span className="inline-block h-2 w-2 rounded-full bg-highlight" />
          <span>Uitgelicht</span>
          <span className="text-mute/50">·</span>
          <span className="text-mute normal-case tracking-normal">
            {categorie.label}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-mute">{categorie.subtitel}</p>

        <h2 className="mt-3 font-serif text-xl sm:text-2xl leading-snug text-ink">
          <a
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            {v.titel}
          </a>
        </h2>

        <div className="mt-4 rounded-md bg-accent/5 border border-accent/10 p-3 sm:p-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-accent mb-1">
            Wat betekent dit voor Nederland?
          </div>
          <p className="text-sm sm:text-[15px] leading-relaxed text-ink/85">
            {v.uitleg}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          {v.aangenomen ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-accent">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Aangenomen
              {v.aangenomenDatum ? ` op ${formatDatum(v.aangenomenDatum)}` : ""}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-line" />
              <span className="font-medium text-ink/70">In behandeling</span>
            </span>
          )}
          <span className="text-mute/50">·</span>
          <span className="text-mute">Voorstel van {formatDatum(v.datum)}</span>
          {thema && (
            <>
              <span className="text-mute/50">·</span>
              <Link
                href={themaUrl}
                className="text-mute hover:text-ink underline-offset-2 hover:underline"
              >
                {thema.naam}
              </Link>
            </>
          )}
        </div>

        <div className="mt-5">
          <Link
            href={themaUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accentDark transition-colors"
          >
            Lees wat deze wet betekent
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
