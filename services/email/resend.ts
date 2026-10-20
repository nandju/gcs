import { Resend } from "resend";

/**
 * Service d'envoi d'e-mails sortants (notifications de devis et de contact)
 * via Resend. Utilisé uniquement côté serveur — la clé API ne doit jamais
 * atteindre le client.
 */

export function emailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.GCS_QUOTES_TO_EMAIL &&
      process.env.GCS_QUOTES_FROM_EMAIL,
  );
}

export interface OutgoingEmail {
  subject: string;
  html: string;
  text: string;
  /** Adresse du demandeur : utilisée en Reply-To, jamais en From. */
  replyTo?: string;
}

export interface SendResult {
  ok: boolean;
  /** Identifiant Resend du message accepté. */
  id?: string;
}

export async function sendNotification(email: OutgoingEmail): Promise<SendResult> {
  if (!emailConfigured()) {
    console.error("[email] Variables RESEND_API_KEY / GCS_QUOTES_*_EMAIL manquantes.");
    return { ok: false };
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.GCS_QUOTES_FROM_EMAIL as string,
    to: process.env.GCS_QUOTES_TO_EMAIL as string,
    subject: email.subject,
    html: email.html,
    text: email.text,
    ...(email.replyTo ? { replyTo: email.replyTo } : {}),
  });
  if (error) {
    // Journalisation serveur sans exposer le détail au visiteur.
    console.error("[email] Échec Resend :", error.name, error.message);
    return { ok: false };
  }
  return { ok: true, id: data?.id };
}
