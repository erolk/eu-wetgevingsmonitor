// De vlag van Nederland (rood-wit-blauw), als klein icoon voor de
// "wissel naar de Nederlandse Wetgevingsmonitor"-knop in het menu.

const ROOD = "#AE1C28";
const WIT = "#FFFFFF";
const BLAUW = "#21468B";

export function NLVlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={className}
      role="img"
      aria-label="Vlag van Nederland"
    >
      <rect width="30" height="20" rx="2.5" fill={WIT} />
      <rect width="30" height="6.67" y="0" fill={ROOD} />
      <rect width="30" height="6.67" y="13.33" fill={BLAUW} />
    </svg>
  );
}
