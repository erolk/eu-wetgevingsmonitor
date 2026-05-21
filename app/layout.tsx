import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { MobileMenu } from "./components/MobileMenu";
import { EUVlag } from "./components/EUVlag";
import { NLVlag } from "./components/NLVlag";
import { SITE_NAAM, SITE_URL, NL_MONITOR_URL } from "@/lib/site";

const BESCHRIJVING =
  "Volg welke wetten de Europese Unie maakt, per beleidsterrein, met per voorstel de status en wat het voor Nederland betekent.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAAM} — wat besluit Brussel, en wat merk jij ervan?`,
    template: `%s — ${SITE_NAAM}`,
  },
  description: BESCHRIJVING,
  applicationName: SITE_NAAM,
  alternates: { canonical: "/" },
  keywords: [
    "EU-wetgeving",
    "Europese Unie",
    "beleidsterreinen",
    "EUR-Lex",
    "wetsvoorstellen",
    "Brussel",
    "Nederland",
  ],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: SITE_NAAM,
    title: `${SITE_NAAM} — wat besluit Brussel, en wat merk jij ervan?`,
    description: BESCHRIJVING,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAAM,
    description: BESCHRIJVING,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // De site is altijd licht (geen dark-mode toggle), dus één lichte
  // theme-color zodat de mobiele adresbalk niet donker wordt op een
  // telefoon die in dark-mode staat.
  themeColor: "#f7f8fa",
  // Zet Android Chrome's 'Auto dark theme' uit (genereert
  // <meta name="color-scheme" content="light">). Samen met
  // color-scheme: only light in CSS voorkomt dit dat de telefoon de
  // pagina automatisch donker maakt.
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b-[0.5px] border-accent bg-surface/80 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group min-w-0"
            >
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
              <Link href="/zoeken" className="hover:text-ink hidden sm:inline">
                Zoeken
              </Link>
              <Link
                href="/hoe-het-werkt"
                className="hover:text-ink hidden lg:inline"
              >
                Hoe werkt het?
              </Link>
              <Link href="/over" className="hover:text-ink hidden lg:inline">
                Over
              </Link>
              <Link
                href="/contact"
                className="hover:text-ink hidden sm:inline"
              >
                Contact
              </Link>
              <a
                href={NL_MONITOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Naar de Nederlandse Wetgevingsmonitor"
                className="group hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 hover:border-accent hover:text-ink transition-colors"
              >
                <NLVlag className="h-3 w-[18px] rounded-[2px] ring-1 ring-black/10 transition-transform group-hover:-translate-y-0.5" />
                <span>NL-monitor</span>
              </a>
              <MobileMenu />
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
          {children}
        </main>
        <footer className="border-t border-line mt-12 sm:mt-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8 text-xs text-mute">
            <p className="max-w-prose">
              Brongegevens: open data van de Europese Unie (EUR-Lex,
              Europees Parlement). Deze website is geen officiële website van
              de Europese Unie of de Rijksoverheid.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
