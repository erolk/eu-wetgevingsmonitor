// Compacte weergave van de fase waarin een EU-voorstel zit. De vijf stappen
// volgen het proces uit /hoe-het-werkt. Voorstellen die we via EUR-Lex
// binnenhalen zijn net ingediend en staan dus standaard op fase 0; live
// fasevolging (via de Legislative Observatory, OEIL) komt later.

export const FASEN = [
  "Voorstel",
  "Europees Parlement",
  "Raad",
  "Trilogen",
  "Aangenomen",
] as const;

export function Procesbalk({
  actiefIndex = 0,
}: {
  /** Index in FASEN van de huidige fase. */
  actiefIndex?: number;
}) {
  return (
    <ol
      className="flex items-center gap-1"
      aria-label={`Fase: ${FASEN[actiefIndex] ?? FASEN[0]} (${actiefIndex + 1} van ${FASEN.length})`}
    >
      {FASEN.map((fase, i) => {
        const gedaan = i < actiefIndex;
        const actief = i === actiefIndex;
        return (
          <li key={fase} className="flex items-center gap-1 min-w-0">
            <span
              title={fase}
              className={[
                "inline-block h-1.5 rounded-full transition-colors",
                actief ? "w-6" : "w-4 sm:w-5",
                gedaan
                  ? "bg-accent"
                  : actief
                    ? "bg-highlight ring-1 ring-accent/40"
                    : "bg-line",
              ].join(" ")}
            />
            <span
              className={[
                "text-[10px] leading-none whitespace-nowrap",
                actief ? "text-ink font-medium" : "text-mute",
                // toon alleen de actieve label op klein scherm; alle op groot
                actief ? "inline" : "hidden lg:inline",
              ].join(" ")}
            >
              {fase}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
