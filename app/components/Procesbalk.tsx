// Compacte weergave van waar een EU-voorstel staat. Op basis van EUR-Lex
// tonen we betrouwbaar twee statussen: "aangenomen" (er bestaat een definitieve
// handeling) of "in behandeling". De exacte tussenfase (EP → Raad → trilogen)
// volgen we nog niet live, dus die claimen we ook niet — bij "in behandeling"
// markeren we alleen dat het voorstel is ingediend.

export const FASEN = [
  "Voorstel",
  "Europees Parlement",
  "Raad",
  "Trilogen",
  "Aangenomen",
] as const;

export function Procesbalk({ aangenomen }: { aangenomen: boolean }) {
  const eind = FASEN.length - 1;
  return (
    <ol
      className="flex items-center gap-1"
      aria-label={aangenomen ? "Status: aangenomen" : "Status: in behandeling"}
    >
      {FASEN.map((fase, i) => {
        // Aangenomen → hele balk gevuld, eindpunt gemarkeerd.
        // In behandeling → alleen 'Voorstel' is zeker bereikt; rest onbekend.
        const gevuld = aangenomen ? true : i === 0;
        const markeer = aangenomen && i === eind;
        return (
          <li key={fase} className="flex items-center gap-1 min-w-0">
            <span
              title={fase}
              className={[
                "inline-block h-1.5 rounded-full transition-colors",
                markeer ? "w-6" : "w-4 sm:w-5",
                markeer
                  ? "bg-highlight ring-1 ring-accent/40"
                  : gevuld
                    ? "bg-accent"
                    : "bg-line",
              ].join(" ")}
            />
            <span className="text-[10px] leading-none whitespace-nowrap text-mute hidden lg:inline">
              {fase}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
