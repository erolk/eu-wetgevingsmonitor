import type { Metadata } from "next";
import { ContactFormulier } from "@/app/components/ContactFormulier";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Een vraag, opmerking, verbetering of typfout? Stuur een bericht aan de beheerder van de EU-wetgevingsmonitor.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <header className="space-y-3">
        <h1 className="font-serif text-2xl sm:text-3xl tracking-tight leading-tight">
          Contact
        </h1>
        <p className="text-mute leading-relaxed">
          Een vraag, opmerking, een idee voor een verbetering of een typfout
          gevonden? Stuur het hieronder. Berichten komen rechtstreeks bij de
          beheerder terecht — geen mailinglijst, geen automatisch antwoord.
        </p>
      </header>

      <ContactFormulier />

      <p className="text-xs text-mute leading-relaxed">
        We gebruiken je gegevens alleen om te kunnen reageren. Berichten worden
        niet doorgestuurd of gepubliceerd. Deze website is geen officiële
        website van de Europese Unie of de Rijksoverheid.
      </p>
    </div>
  );
}
