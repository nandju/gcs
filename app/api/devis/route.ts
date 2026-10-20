import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { quoteRequestSchema, fieldErrors } from "@/lib/validation/quote";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { buildQuoteEmail } from "@/services/email/templates";
import { emailConfigured, sendNotification } from "@/services/email/resend";

const RATE = { limit: 5, windowMs: 10 * 60_000 }; // 5 demandes / 10 min / IP

function reference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `GCS-${date}-${rand}`;
}

export async function POST(request: NextRequest) {
  if (!rateLimit(`devis:${clientKey(request)}`, RATE)) {
    return NextResponse.json(
      { ok: false, message: "Trop de demandes envoyées. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: "Certains champs sont invalides. Vérifiez votre saisie.",
        errors: fieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  // Honeypot rempli → on répond comme un succès sans rien envoyer.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, reference: reference() });
  }

  if (!emailConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "L'envoi des demandes n'est pas encore activé. Réessayez plus tard ou contactez GCS directement.",
      },
      { status: 503 },
    );
  }

  const meta = { reference: reference(), submittedAt: new Date() };
  const email = buildQuoteEmail(parsed.data, meta);
  const result = await sendNotification({
    ...email,
    replyTo: parsed.data.sender.email,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "L'envoi de votre demande a échoué. Veuillez réessayer dans un instant.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, reference: meta.reference });
}
