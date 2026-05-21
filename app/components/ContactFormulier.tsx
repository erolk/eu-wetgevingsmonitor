"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

const MAX = 5000;

export function ContactFormulier() {
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [bericht, setBericht] = useState("");
  const [akkoord, setAkkoord] = useState(false);
  const [honey, setHoney] = useState(""); // honeypot tegen spam
  const [status, setStatus] = useState<"idle" | "bezig" | "ok" | "fout">("idle");

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (honey) return; // bot vulde het verborgen veld in
    setStatus("bezig");
    try {
      const res = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            naam,
            email,
            bericht,
            _subject: "Nieuw bericht via EU-wetgevingsmonitor",
            _template: "table",
            _captcha: "false",
          }),
        },
      );
      if (!res.ok) throw new Error("verzenden mislukt");
      setStatus("ok");
    } catch {
      setStatus("fout");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-md border border-accent/30 bg-accent/5 p-5 max-w-xl">
        <p className="font-serif text-lg text-ink">Bedankt voor je bericht!</p>
        <p className="text-sm text-mute mt-1 leading-relaxed">
          Het is verstuurd naar de beheerder. We gebruiken je gegevens alleen om
          te kunnen reageren.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={verstuur}
      className="space-y-4 rounded-md border border-line bg-surface p-5 max-w-xl"
    >
      {/* Honeypot: voor mensen verborgen, bots vullen 'm vaak wel in. */}
      <div className="hidden" aria-hidden>
        <label>
          Website (laat leeg)
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honey}
            onChange={(e) => setHoney(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label htmlFor="naam" className="block text-sm text-ink mb-1">
          Naam
        </label>
        <input
          id="naam"
          required
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          placeholder="Jouw naam"
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-mute/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-ink mb-1">
          E-mailadres
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="naam@voorbeeld.nl"
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-mute/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="bericht" className="block text-sm text-ink mb-1">
          Opmerking / vraag
        </label>
        <textarea
          id="bericht"
          required
          rows={5}
          maxLength={MAX}
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          placeholder="Vraag, opmerking, verbetering of typfout? Laat het weten."
          className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-mute/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-y"
        />
        <div className="text-right text-[11px] text-mute mt-1 tabular-nums">
          {bericht.length}/{MAX}
        </div>
      </div>

      <label className="flex items-start gap-2 text-xs text-mute leading-relaxed">
        <input
          type="checkbox"
          required
          checked={akkoord}
          onChange={(e) => setAkkoord(e.target.checked)}
          className="mt-0.5 accent-[rgb(var(--accent))]"
        />
        <span>
          Mijn naam en e-mailadres worden alleen gebruikt om antwoord te kunnen
          geven en niet verder gedeeld.
        </span>
      </label>

      {status === "fout" && (
        <p className="text-sm text-red-600">
          Versturen lukte niet. Probeer het later nog eens of mail rechtstreeks.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "bezig" || !akkoord}
        className="inline-flex items-center gap-2 rounded-md bg-accent text-white px-4 py-2 text-sm hover:bg-accentDark transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "bezig" ? "Versturen…" : "Verstuur bericht"}
      </button>
    </form>
  );
}
