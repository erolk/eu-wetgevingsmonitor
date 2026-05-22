import type { Metadata } from "next";
import type { CSSProperties } from "react";

// Demo/oefenpagina: een nabouw van site_test.png ("Toxic Chemicals"). Dit is
// een fictieve merk-/CSS-oefening, géén onderdeel van de EU-wetgevingsmonitor.
// Niet indexeren.
export const metadata: Metadata = {
  title: { absolute: "Toxic Chemicals — demo" },
  description: "Front-end nabouw-demo. Fictief merk, geen echte producten.",
  robots: { index: false, follow: false },
};

const GEEL = "#DDF402";
const INDIGO = "#0C003B";
const PAARS = "#5B5377";

const PRODUCTEN = [
  {
    kleur: "#0090F0",
    titel: "Multi Purpose Micellar Cleaner",
    desc: "Alcohol disinfectant spray and hydrating cleanser. Designed for face and body, safe on all surfaces.",
    ingredienten: "ETHANOL · ECTOIN · PHAs · MINERALS · NIACINAMIDE · ANTIMICROBIALS",
    prijs: "€10/500ml",
  },
  {
    kleur: "#00F000",
    titel: "Active Oxygen Glow Treatment",
    desc: "PFAs-based bubble mask, effectively targets most skin concerns through the power of oxygen & peptides.",
    ingredienten: "PERFLUOROALKALI · RETINOL · PEPTIDES · KOJIC ACID · SALICYLIC ACID · VITAMINS",
    prijs: "€20/100ml",
  },
  {
    kleur: "#F000B0",
    titel: "Antioxidant Matte Varnish",
    desc: "2-in-1 sleeping mask and mattifying primer. Oxidation, sebum, and sweat-proof: Just apply sunscreen and go.",
    ingredienten: "SILICONES · PETROLATUM · VITAMIN C · CERAMIDES · HUMECTANTS",
    prijs: "€15/125ml",
  },
];

const FOOTER = {
  Shop: [
    "Multi Purpose Micellar Cleaner",
    "Active Oxygen Glow Treatment",
    "Antioxidant Matte Varnish",
    "Shop all",
  ],
  Company: [
    "About us",
    "FAQ",
    "Factmongering",
    "Sustainability",
    "Philosophy & commitments",
    "Trial reports & tecnical datasheets",
  ],
  Meta: ["Artist statement", "Sources & credits", "Investment", "Disclaimer"],
};

/** Donkere knop met gele tekst die bij hover een gele rand krijgt. */
function Knop({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-2xl bg-[#312657] px-6 py-2.5 font-serif text-[15px] text-[#DDF402] border border-transparent hover:border-[#DDF402] transition-colors"
    >
      {children}
    </button>
  );
}

/** Het biohazard-symbool (trefoil) in geel, voor in het logo. */
function Biohazard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden role="img">
      <g fill="none" stroke={GEEL} strokeWidth="7">
        <circle cx="50" cy="30" r="17" />
        <circle cx="31" cy="64" r="17" />
        <circle cx="69" cy="64" r="17" />
      </g>
      <circle cx="50" cy="52" r="9" fill={INDIGO} stroke={GEEL} strokeWidth="5" />
    </svg>
  );
}

/** Oneindige horizontale marquee (track gedupliceerd → naadloze lus). */
function Marquee({
  children,
  speed = "30s",
  className = "",
  trackClassName = "",
}: {
  children: React.ReactNode;
  speed?: string;
  className?: string;
  trackClassName?: string;
}) {
  return (
    <div className={`tc-marquee ${className}`}>
      <div
        className={`tc-marquee__track ${trackClassName}`}
        style={{ "--tc-speed": speed } as CSSProperties}
      >
        <div className="flex items-center shrink-0">{children}</div>
        <div className="flex items-center shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

function herhaal(node: React.ReactNode, n: number) {
  return Array.from({ length: n }, (_, i) => <span key={i}>{node}</span>);
}

export default function ToxicChemicalsDemo() {
  return (
    <div className="font-serif text-[#ECEAF6]" style={{ backgroundColor: PAARS }}>
      {/* ── Shipping-ticker (geel, donkere tekst, schuift naar links) ── */}
      <Marquee speed="24s" className="bg-[#DDF402] py-1.5">
        {herhaal(
          <span className="px-6 text-[13px] font-bold tracking-wide text-[#0C003B]">
            FREE INTERNATIONAL SHIPPING ON ORDERS €30+
          </span>,
          8,
        )}
      </Marquee>

      {/* ── Header ── */}
      <header style={{ backgroundColor: PAARS }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center font-sans text-2xl sm:text-3xl font-black tracking-tight text-[#DDF402]">
            <span>TOXI</span>
            <Biohazard className="mx-0.5 h-7 w-7 sm:h-8 sm:w-8" />
            <span>HEMICALS</span>
          </div>
          <nav className="hidden items-center gap-6 font-sans text-sm font-bold tracking-wide text-[#DDF402] sm:flex">
            <button type="button" className="hover:underline">DISCOVER</button>
            <button type="button" className="hover:underline">RESEARCH ⌄</button>
            <button type="button" className="hover:underline">CONSUME ⌄</button>
            <span aria-hidden className="text-xl">🛒</span>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ backgroundColor: PAARS }} className="px-5 pb-16 pt-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-sans text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight text-[#DDF402]">
            DEBUT COLLECTION
            <br />
            OUT NOW
          </h1>
          <div className="mt-10 max-w-xl text-[#DDF402]">
            <p className="text-2xl sm:text-3xl font-bold">The Toxic Essentials:</p>
            <p className="text-2xl sm:text-3xl italic leading-snug">
              Legacy ingredients,
              <br />
              back where they belong
            </p>
          </div>
          <div className="mt-8">
            <Knop>Learn more</Knop>
          </div>
        </div>
      </section>

      {/* ── Producten ── */}
      <section style={{ backgroundColor: INDIGO }} className="px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          {PRODUCTEN.map((p) => (
            <article
              key={p.titel}
              className="flex flex-col border-[3px]"
              style={{ borderColor: p.kleur }}
            >
              <div className="min-h-[230px] flex-1" style={{ backgroundColor: PAARS }} />
              <div className="space-y-2 p-4">
                <h3
                  className="text-2xl font-bold leading-tight"
                  style={{ color: p.kleur }}
                >
                  {p.titel}
                </h3>
                <p className="text-[15px] leading-snug text-[#ECEAF6]">{p.desc}</p>
                <p
                  className="text-[10px] font-semibold tracking-wider"
                  style={{ color: p.kleur }}
                >
                  {p.ingredienten}
                </p>
                <p className="pt-1 text-[15px]" style={{ color: p.kleur }}>
                  {p.prijs}{" "}
                  <button
                    type="button"
                    className="ml-1 rounded border border-transparent px-1 underline hover:border-[#DDF402] hover:no-underline"
                  >
                    Add to cart
                  </button>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── ALL ARTIFICIAL (links uitgelijnd) ── */}
      <section style={{ backgroundColor: PAARS }} className="px-5 py-16 text-[#DDF402]">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl sm:text-5xl font-bold">ALL ARTIFICIAL</h2>
          <p className="mt-5 max-w-md text-lg leading-snug font-medium">
            We ensure safety and quality by using pure, standardised, man-made
            ingredients. Our products contain nothing directly sourced from any
            living organism; animal, plant, or otherwise.
          </p>
          <div className="mt-6">
            <Knop>Learn more</Knop>
          </div>
        </div>
      </section>

      {/* ── ALL ABOUT SCIENCE (rechts uitgelijnd) ── */}
      <section style={{ backgroundColor: PAARS }} className="px-5 py-16 text-[#DDF402]">
        <div className="mx-auto flex max-w-6xl flex-col items-end text-right">
          <h2 className="text-4xl sm:text-5xl font-bold">ALL ABOUT SCIENCE</h2>
          <p className="mt-5 max-w-md text-lg leading-snug font-medium">
            All of our products are advised, tested, and approved by a team of
            independent dermatologists. In our pro-science approach to skincare,
            we only use ingredients backed by clinical data, not hype or vibes.
          </p>
          <div className="mt-6">
            <Knop>Learn more</Knop>
          </div>
        </div>
      </section>

      {/* ── HALL OF HATERS (hazard-strepen, blauwe tekst) ── */}
      <Marquee speed="16s" trackClassName="tc-hazard py-2">
        {herhaal(
          <span className="px-6 font-sans text-3xl font-black tracking-tight text-[#0090F0]">
            HALL OF HATERS
          </span>,
          8,
        )}
      </Marquee>

      {/* ── Gallery-placeholder ── */}
      <section style={{ backgroundColor: PAARS }} className="px-5 py-16">
        <p className="mx-auto max-w-6xl text-center text-[#C9C5DC]">
          [scrolling gallery of hate videos (user generated content)]
        </p>
      </section>

      {/* ── Come and find us ── */}
      <section style={{ backgroundColor: INDIGO }} className="px-5 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
          <h2 className="font-sans text-3xl sm:text-4xl font-black tracking-tight text-[#DDF402]">
            COME AND FIND US:
          </h2>
          <div className="flex items-center gap-5">
            {["𝕏", "◎", "♪"].map((s, i) => (
              <span
                key={i}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#DDF402] text-xl text-[#DDF402] transition-colors hover:bg-[#DDF402] hover:text-[#0C003B]"
                aria-hidden
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subscribe ── */}
      <section style={{ backgroundColor: PAARS }} className="px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-sans text-5xl sm:text-6xl font-black tracking-tight text-[#DDF402]">
            SUBSCRIBE.
          </h2>
          <p className="mt-2 text-xl text-[#DDF402]">Just in general. 10% off.</p>
          <div className="mt-8 max-w-md">
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full border-0 border-b-2 border-[#DDF402] bg-transparent pb-2 text-lg text-[#0090F0] placeholder:text-[#0090F0] focus:outline-none"
            />
            <div className="mt-5">
              <Knop>Confirm</Knop>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: "#074190" }} className="px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
          <div>
            <h3 className="text-2xl font-bold text-[#DDF402]">Shop</h3>
            <ul className="mt-3 space-y-2 text-[15px] text-[#E8EAF6]">
              {FOOTER.Shop.map((l) => (
                <li key={l}>
                  <button type="button" className="hover:underline">{l}</button>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-xs text-[15px] font-bold leading-snug text-[#DDF402]">
              This brand is an art project, not an operational company. It&apos;s
              impossible to buy any product from this website.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#DDF402]">Company</h3>
            <ul className="mt-3 space-y-2 text-[15px] text-[#E8EAF6]">
              {FOOTER.Company.map((l) => (
                <li key={l}>
                  <button type="button" className="hover:underline">{l}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#DDF402]">Meta</h3>
            <ul className="mt-3 space-y-2 text-[15px] text-[#E8EAF6]">
              {FOOTER.Meta.map((l) => (
                <li key={l}>
                  <button type="button" className="hover:underline">{l}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
