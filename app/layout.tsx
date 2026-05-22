import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SITE_NAAM, SITE_URL } from "@/lib/site";

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
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
