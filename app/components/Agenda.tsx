"use client";

import { useState } from "react";
import type { AgendaResultaat } from "@/lib/agenda";

const ZICHTBAAR = 4; // aantal punten dat standaard zichtbaar is

function fmt(datum: string, opties: Intl.DateTimeFormatOptions): string {
  const d = new Date(`${datum}T12:00:00Z`);
  if (isNaN(d.getTime())) return datum;
  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    ...opties,
  }).format(d);
}

function weekLabel(van: string, tot: string): string {
  const zelfdeMaand = van.slice(0, 7) === tot.slice(0, 7);
  const vanStr = fmt(van, zelfdeMaand ? { day: "numeric" } : { day: "numeric", month: "short" });
  return `${vanStr}–${fmt(tot, { day: "numeric", month: "short" })}`;
}

// ISO-weeknummer van de maandag-datum (yyyy-mm-dd).
function weekNummer(maandag: string): number {
  const d = new Date(`${maandag}T12:00:00Z`);
  const dag = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dag + 3); // donderdag van deze week
  const eersteDonderdag = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  return (
    1 +
    Math.round(
      (d.getTime() - eersteDonderdag.getTime()) / (7 * 24 * 3600 * 1000),
    )
  );
}

export function Agenda({ data }: { data: AgendaResultaat }) {
  const [open, setOpen] = useState(false);
  const { punten, heeftZitting, weekVan, weekTot, volgendeZitting, fout } = data;
  const zichtbaar = open ? punten : punten.slice(0, ZICHTBAAR);

  return (
    <section className="rounded-md border border-line bg-surface overflow-hidden">
      <div className="flex items-baseline justify-between gap-3 px-4 pt-3 pb-2">
        <h2 className="font-medium text-sm text-ink">
          Deze week op de EP-agenda
          <span className="text-mute font-normal"> — week {weekNummer(weekVan)}</span>
        </h2>
        <span className="text-xs text-mute shrink-0 tabular-nums">
          {weekLabel(weekVan, weekTot)}
        </span>
      </div>

      {fout ? (
        <p className="px-4 pb-3 text-sm text-mute leading-relaxed">
          De EP-agenda is op dit moment niet op te halen.
        </p>
      ) : !heeftZitting ? (
        <p className="px-4 pb-3 text-sm text-mute leading-relaxed">
          Deze week geen plenaire vergadering van het Europees Parlement.
          {volgendeZitting
            ? ` Eerstvolgende zitting: ${fmt(volgendeZitting, { day: "numeric", month: "long" })}.`
            : ""}
        </p>
      ) : punten.length === 0 ? (
        <p className="px-4 pb-3 text-sm text-mute leading-relaxed">
          De agenda voor deze week wordt nog gepubliceerd.
        </p>
      ) : (
        <ul className="border-t border-line divide-y divide-line/60 text-xs">
          {zichtbaar.map((p, i) => (
            <li key={i}>
              <div className="grid grid-cols-[3.25rem_1fr] gap-x-3 items-baseline px-4 py-1 hover:bg-paper transition">
                <span className="font-mono text-xs text-mute shrink-0 tabular-nums">
                  {fmt(p.datum, { weekday: "short", day: "numeric" })}
                </span>
                <span className="truncate text-ink/90" title={p.titel}>
                  {p.titel}
                </span>
              </div>
            </li>
          ))}
          {punten.length > ZICHTBAAR && (
            <li className="py-2 flex justify-center border-t border-line">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="text-sm text-mute hover:text-ink underline underline-offset-2 transition"
              >
                {open
                  ? "Toon minder ↑"
                  : `Toon overige ${punten.length - ZICHTBAAR} agendapunten ↓`}
              </button>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
