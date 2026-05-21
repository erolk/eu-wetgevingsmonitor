"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NLVlag } from "./NLVlag";
import { NL_MONITOR_URL } from "@/lib/site";

const LINKS = [
  { href: "/", label: "Beleidsterreinen" },
  { href: "/zoeken", label: "Zoeken" },
  { href: "/hoe-het-werkt", label: "Hoe werkt het?" },
  { href: "/over", label: "Over" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center p-1.5 -mr-1 rounded text-mute hover:text-ink hover:bg-paper transition"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-md border border-line bg-surface shadow-lg py-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-ink hover:bg-paper transition"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={NL_MONITOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-paper transition border-t border-line mt-1"
          >
            <NLVlag className="h-3 w-[18px] rounded-[2px] ring-1 ring-black/10" />
            Naar NL-monitor
          </a>
        </div>
      )}
    </div>
  );
}
