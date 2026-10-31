/**
 * Envoi des formulaires via l'API REST officielle EmailJS, exclusivement
 * côté serveur.
 *
 * - La clé privée (GCS_EMAILJS_PRIVATE_KEY) n'est jamais exposée au
 *   navigateur : aucun identifiant en NEXT_PUBLIC_*.
 * - Le destinataire réel (kilyrodrigue@gmail.com) est configuré dans le
 *   modèle EmailJS lui-même : aucun paramètre envoyé par le visiteur ne
 *   peut le remplacer.
 * - Un seul envoi par soumission, vers la boîte GCS uniquement : aucun
 *   accusé de réception n'est envoyé au visiteur.
 * - Prérequis dashboard EmailJS : activer « Use Private Key »
 *   (Account → Security) pour que les appels API serveur soient acceptés.
 */

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

interface EmailJsEnv {
  serviceId: string;
  publicKey: string;
  privateKey: string;
}

function readEnv(): EmailJsEnv | null {
  const serviceId = process.env.GCS_EMAILJS_SERVICE_ID?.trim();
  const publicKey = process.env.GCS_EMAILJS_PUBLIC_KEY?.trim();
  const privateKey = process.env.GCS_EMAILJS_PRIVATE_KEY?.trim();
  if (!serviceId || !publicKey || !privateKey) return null;
  return { serviceId, publicKey, privateKey };
}

export function quoteTemplateId(): string | null {
  return process.env.GCS_EMAILJS_TEMPLATE_ID?.trim() || null;
}

export function emailJsConfigured(templateId: string | null): boolean {
  return Boolean(readEnv() && templateId);
}

export interface SendResult {
  ok: boolean;
  /** Code HTTP EmailJS (journalisation/diagnostic uniquement). */
  status?: number;
}

export async function sendViaEmailJs(
  templateId: string,
  templateParams: Record<string, string>,
): Promise<SendResult> {
  const env = readEnv();
  if (!env) {
    console.error("[emailjs] Variables d'environnement manquantes.");
    return { ok: false };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: env.serviceId,
        template_id: templateId,
        user_id: env.publicKey,
        accessToken: env.privateKey,
        template_params: templateParams,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      // Le corps d'erreur EmailJS est un texte court (identifiants invalides,
      // quota atteint, service indisponible…) : on le journalise sans données
      // personnelles ni clés.
      const detail = (await res.text().catch(() => "")).slice(0, 200);
      console.error(`[emailjs] Refus HTTP ${res.status} :`, detail);
      return { ok: false, status: res.status };
    }
    // 200 = demande d'envoi acceptée par EmailJS (pas une preuve de
    // livraison en boîte de réception).
    return { ok: true, status: res.status };
  } catch (error) {
    console.error(
      "[emailjs] Erreur réseau :",
      error instanceof Error ? error.message : "inconnue",
    );
    return { ok: false };
  }
}
