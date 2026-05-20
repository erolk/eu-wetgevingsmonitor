import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { MobileMenu } from "./components/MobileMenu";

export const metadata: Metadata = {
  title: "EU-wetgevingsmonitor — wat besluit Brussel, en wat merk jij ervan?",
  description:
    "Volg welke wetten de Europese Unie maakt, per beleidsterrein, en hoe die doorwerken in Nederland.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // De site is altijd licht (geen dark-mode toggle), dus één lichte
  // theme-color zodat de mobiele adresbalk niet donker wordt op een
  // telefoon die in dark-mode staat.
  themeColor: "#f7f8fa",
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
              <span className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-highlight shrink-0 ring-1 ring-accent/30" />
              <span className="font-serif text-base sm:text-xl tracking-tight truncate">
                <span className="text-accent font-semibold">EU</span>
                <span className="text-ink">wetgevings</span>
                <span className="text-accent">monitor</span>
              </span>
            </Link>
            <nav className="text-xs sm:text-sm text-mute flex items-center gap-3 sm:gap-5 shrink-0">
              <Link href="/" className="hover:text-ink hidden sm:inline">
                Beleidsterreinen
              </Link>
              <Link
                href="/hoe-het-werkt"
                className="hover:text-ink hidden sm:inline"
              >
                Hoe werkt het?
              </Link>
              <Link href="/over" className="hover:text-ink hidden sm:inline">
                Over
              </Link>
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
