import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Verse EU-data ophalen op verzoek. Bedoeld om periodiek aangeroepen te worden
// door Vercel Cron (zie vercel.json), zodat de voorstellen ook zonder bezoekers
// dagelijks verversen. Beveiligd met CRON_SECRET: Vercel Cron stuurt
// automatisch "Authorization: Bearer <CRON_SECRET>" mee als die env-var bestaat.
//
// Handmatig testen kan ook met ?secret=<CRON_SECRET>.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  // Als er geen secret is ingesteld, weigeren we (anders kan iedereen het
  // aanroepen). Bij deploy zet je CRON_SECRET in de Vercel-omgeving.
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET niet ingesteld" },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization");
  const urlSecret = new URL(request.url).searchParams.get("secret");
  const geautoriseerd = auth === `Bearer ${secret}` || urlSecret === secret;

  if (!geautoriseerd) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag("voorstellen");
  return NextResponse.json({ ok: true, revalidated: "voorstellen", at: Date.now() });
}
