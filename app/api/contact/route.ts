import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { buildContactEmail } from "@/services/email/templates";
import { emailConfigured, sendNotification } from "@/services/email/resend";

const RATE = { limit: 5, windowMs: 10 * 60_000 };

export async function POST(request: NextRequest) {
  if (!rateLimit(`contact:${clientKey(request)}`, RATE)) {
    return NextResponse.json(
      { ok: false, message: "Trop de messages envoyés. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Certains champs sont invalides. Vérifiez votre saisie." },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  if (!emailConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "L'envoi de messages n'est pas encore activé. Réessayez plus tard.",
      },
      { status: 503 },
    );
  }

  const email = buildContactEmail(parsed.data);
  const result = await sendNotification({
    ...email,
    replyTo: parsed.data.email,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "L'envoi de votre message a échoué. Veuillez réessayer." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
