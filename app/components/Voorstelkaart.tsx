import { formatDatum, type ActType, type Voorstel } from "@/lib/eurlex";
import { Procesbalk } from "./Procesbalk";

// Kleur per handeling-type, gelijk aan de uitleg op /hoe-het-werkt:
// verordening = geldt direct (blauw), richtlijn = NL moet omzetten (geel),
// besluit/overig = neutraal.
const TYPE_KLEUR: Record<ActType, string> = {
  Verordening: "bg-accent text-white",
  Richtlijn: "bg-highlight text-ink",
  Besluit: "bg-ink text-paper",
  Aanbeveling: "border border-line text-mute",
  Voorstel: "border border-line text-mute",
};

export function Voorstelkaart({ voorstel }: { voorstel: Voorstel }) {
  const v = voorstel;
  return (
    <article className="rounded-lg border border-line bg-surface p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_KLEUR[v.type]}`}
        >
          {v.type}
        </span>
        <time
          dateTime={v.datum}
          className="text-xs text-mute tabular-nums shrink-0"
        >
          {formatDatum(v.datum)}
        </time>
      </div>

      <h3 className="font-serif text-base leading-snug">
        <a
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          {v.titel}
        </a>
      </h3>

      {v.onderwerpen.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {v.onderwerpen.map((o) => (
            <span
              key={o}
              className="rounded-full bg-accent/5 text-accent text-[11px] px-2 py-0.5"
            >
              {o}
            </span>
          ))}
        </div>
      )}

      <Procesbalk actiefIndex={0} />

      <div className="flex items-center justify-between gap-3 pt-1 text-xs">
        <span className="font-mono text-mute">{v.celex}</span>
        <a
          href={v.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline hover:no-underline"
        >
          Lees op EUR-Lex →
        </a>
      </div>
    </article>
  );
}
