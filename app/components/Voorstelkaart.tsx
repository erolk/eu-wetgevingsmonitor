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
  Mededeling: "border border-line text-mute",
  Voorstel: "border border-line text-mute",
};

export function Voorstelkaart({ voorstel }: { voorstel: Voorstel }) {
  const v = voorstel;
  // Officiële EUR-Lex "ALL"-weergave: toont de procedure, status en verbanden.
  // (De EU Law Tracker bleek mooier, maar is niet betrouwbaar via CELEX te
  // deeplinken — zijn app gebruikt een interne referentie die wij niet hebben.)
  const procedureUrl = `https://eur-lex.europa.eu/legal-content/NL/ALL/?uri=CELEX:${v.celex}`;
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

      <div className="rounded-md bg-accent/5 border border-accent/10 p-3">
        <div className="text-[10px] font-medium uppercase tracking-wider text-accent mb-1">
          Wat betekent dit voor Nederland?
        </div>
        <p className="text-sm leading-relaxed text-ink/85">{v.uitleg}</p>
      </div>

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

      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between gap-2 text-[11px]">
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
              <span className="text-mute/80">
                · exacte fase niet live beschikbaar
              </span>
            </span>
          )}
          {v.aangenomen && v.aangenomenUrl && (
            <a
              href={v.aangenomenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline shrink-0"
            >
              bekijk de wet →
            </a>
          )}
        </div>
        <Procesbalk aangenomen={v.aangenomen} />
      </div>

      <div className="flex items-center justify-between gap-3 pt-1 text-xs">
        <span className="font-mono text-mute shrink-0">{v.celex}</span>
        <span className="flex items-center gap-3 shrink-0">
          <a
            href={procedureUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Procedure en status op EUR-Lex"
            className="text-accent underline hover:no-underline"
          >
            Procedure ↗
          </a>
          <a
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline hover:no-underline"
          >
            EUR-Lex ↗
          </a>
        </span>
      </div>
    </article>
  );
}
