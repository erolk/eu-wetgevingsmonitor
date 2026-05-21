"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

// Abonneerknop per beleidsterrein. Legt de aanmelding vast via FormSubmit (de
// beheerder krijgt de aanmelding binnen). Een volledige e-mailmelding-stroom
// (dubbele opt-in + automatische updates) vereist een backend; die komt bij de
// Vercel-deploy. De tekst belooft daarom niet méér dan we nu waarmaken.

export function Abonneer({ themaNaam }: { themaNaam: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "bezig" | "ok" | "fout">("idle");

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    if (honey) return;
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
            email,
            beleidsterrein: themaNaam,
            _subject: `Abonnement-aanmelding: ${themaNaam}`,
            _captcha: "false",
          }),
        },
      );
      if (!res.ok) throw new Error();
      setStatus("ok");
    } catch {
      setStatus("fout");
    }
  }

  if (status === "ok") {
    return (
      <p className="text-sm text-accent">
        Bedankt! Je aanmelding voor <strong>{themaNaam}</strong> is doorgegeven.
        Zodra de e-mailmeldingen live staan, krijg je bericht.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-accent text-accent px-3 py-1.5 text-sm hover:bg-accent hover:text-white transition"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        Abonneer op dit beleidsterrein
      </button>
    );
  }

  return (
    <form onSubmit={verstuur} className="flex flex-wrap items-start gap-2 max-w-md">
      <div className="hidden" aria-hidden>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
        />
      </div>
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="naam@voorbeeld.nl"
        className="flex-1 min-w-[12rem] rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink placeholder:text-mute/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <button
        type="submit"
        disabled={status === "bezig"}
        className="rounded-md bg-accent text-white px-3 py-1.5 text-sm hover:bg-accentDark transition disabled:opacity-50"
      >
        {status === "bezig" ? "…" : "Aanmelden"}
      </button>
      {status === "fout" && (
        <p className="w-full text-xs text-red-600">
          Aanmelden lukte niet. Probeer het later nog eens.
        </p>
      )}
    </form>
  );
}
