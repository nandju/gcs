import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const RATE = { limit: 5, windowMs: 10 * 60_000 };

/**
 * Formulaire de contact : l'envoi est volontairement désactivé pour le
 * moment — un seul modèle EmailJS est configuré, réservé aux demandes de
 * devis. Pour activer le contact, créer un second modèle dans EmailJS puis
 * rebrancher `sendViaEmailJs` ici (voir docs/emailjs/template-contact.html).
 */
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

  return NextResponse.json(
    {
      ok: false,
      message:
        "L'envoi de messages n'est pas encore activé. Utilisez le formulaire de devis ou réessayez plus tard.",
    },
    { status: 503 },
  );
}
