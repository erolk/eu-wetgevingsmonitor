import Link from "next/link";
import { MobileMenu } from "@/app/components/MobileMenu";
import { EUVlag } from "@/app/components/EUVlag";
import { NLVlag } from "@/app/components/NLVlag";
import { NL_MONITOR_URL } from "@/lib/site";

// Layout voor de eigenlijke EU-wetgevingsmonitor (alle pagina's behalve de
// losstaande /test-demo). Bevat de site-header en -footer.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b-[0.5px] border-accent bg-surface/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <EUVlag className="h-4 w-6 sm:h-[18px] sm:w-[27px] shrink-0 rounded-[2.5px] shadow-sm ring-1 ring-black/10 transition-transform group-hover:-translate-y-0.5" />
            <span className="font-serif text-base sm:text-xl tracking-tight truncate">
              <span className="text-accent font-semibold">EU</span>
              <span className="text-ink">wetgevings</span>
              <span className="text-accent">monitor</span>
            </span>
          </Link>
          <nav className="text-xs sm:text-sm text-mute flex items-center gap-3 sm:gap-4 shrink-0">
            <Link href="/" className="hover:text-ink hidden sm:inline">
              Beleidsterreinen
            </Link>
            <Link href="/hoe-het-werkt" className="hover:text-ink hidden lg:inline">
              Hoe werkt het?
            </Link>
            <Link href="/over" className="hover:text-ink hidden lg:inline">
              Over
            </Link>
            <Link href="/contact" className="hover:text-ink hidden sm:inline">
              Contact
            </Link>
            <Link href="/test" className="hover:text-ink hidden sm:inline">
              Test
            </Link>
            <Link
              href="/zoeken"
              aria-label="Zoek in alle EU-voorstellen"
              title="Zoeken"
              className="hover:text-ink inline-flex items-center justify-center p-0.5"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="20" y1="20" x2="16.65" y2="16.65" />
              </svg>
            </Link>
            <a
              href={NL_MONITOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Naar de Nederlandse Wetgevingsmonitor"
              className="group hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 hover:border-accent hover:text-ink transition-colors"
            >
              <NLVlag className="h-3 w-[18px] rounded-[2px] ring-1 ring-black/10 transition-transform group-hover:-translate-y-0.5" />
              <span>NL-wetgevingsmonitor</span>
            </a>
            <MobileMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">{children}</main>

      <footer className="border-t border-line mt-12 sm:mt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8 text-xs text-mute">
          <p className="max-w-prose">
            Brongegevens: open data van de Europese Unie (EUR-Lex, Europees
            Parlement). Deze website is geen officiële website van de Europese
            Unie of de Rijksoverheid.
          </p>
        </div>
      </footer>
    </>
  );
}
