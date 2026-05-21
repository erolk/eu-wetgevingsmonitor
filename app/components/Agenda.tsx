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
  const totStr = fmt(tot, { day: "numeric", month: "short" });
  return `${vanStr}–${totStr}`;
}

export function Agenda({ data }: { data: AgendaResultaat }) {
  const [open, setOpen] = useState(false);
  const { punten, heeftZitting, weekVan, weekTot, volgendeZitting, fout } = data;

  const zichtbaar = open ? punten : punten.slice(0, ZICHTBAAR);

  return (
    <section className="rounded-md border border-line bg-surface p-5 sm:p-6 space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="inline-flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent shrink-0"
            aria-hidden
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h2 className="font-serif text-lg">Op de agenda deze week</h2>
        </div>
        <span className="text-xs text-mute shrink-0 tabular-nums">
          {weekLabel(weekVan, weekTot)}
        </span>
      </div>

      {fout ? (
        <p className="text-sm text-mute leading-relaxed">
          De agenda van het Europees Parlement is op dit moment niet op te halen.
          Probeer het later nog eens.
        </p>
      ) : !heeftZitting ? (
        <p className="text-sm text-mute leading-relaxed">
          Deze week is er geen plenaire vergadering van het Europees Parlement.
          {volgendeZitting
            ? ` De eerstvolgende zitting is op ${fmt(volgendeZitting, { day: "numeric", month: "long" })}.`
            : ""}
        </p>
      ) : punten.length === 0 ? (
        <p className="text-sm text-mute leading-relaxed">
          De agenda voor deze week wordt nog gepubliceerd.
        </p>
      ) : (
        <>
          <p className="text-sm text-mute leading-relaxed">
            Het Europees Parlement bespreekt deze week deze onderwerpen in de
            plenaire vergadering:
          </p>
          <ul className="divide-y divide-line">
            {zichtbaar.map((p, i) => (
              <li key={i} className="flex items-baseline gap-3 py-2">
                <span className="text-[11px] text-accent font-medium tabular-nums shrink-0 w-14">
                  {fmt(p.datum, { weekday: "short", day: "numeric" })}
                </span>
                <span className="text-sm text-ink/85 leading-snug">
                  {p.titel}
                </span>
              </li>
            ))}
          </ul>
          {punten.length > ZICHTBAAR && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="text-sm text-accent hover:underline"
            >
              {open
                ? "Toon minder ↑"
                : `Toon alle ${punten.length} agendapunten ↓`}
            </button>
          )}
          <p className="text-[11px] text-mute pt-1">
            Bron: Europees Parlement — plenaire agenda.
          </p>
        </>
      )}
    </section>
  );
}
