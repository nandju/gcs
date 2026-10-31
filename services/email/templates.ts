import { CAMPAIGNS, PACKAGING_TYPES, REPRESENTATIVES } from "@/config/quotes";
import type { ContactInput } from "@/lib/validation/contact";
import type { QuoteRequestInput } from "@/lib/validation/quote";

/**
 * Construction des `template_params` EmailJS.
 * Les noms de variables correspondent exactement à ceux du modèle EmailJS
 * (double accolades {{variable}}, échappées par EmailJS — aucun HTML
 * dynamique non échappé n'est généré à partir des saisies visiteurs).
 */

const NOT_PROVIDED = "Non renseigné";

function label(options: Array<{ value: string; label: string }>, value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function frDate(date: Date): string {
  return date.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
}

export interface QuoteEmailMeta {
  reference: string;
  submittedAt: Date;
}

/** Résumé textuel structuré de tous les colis (variable `parcels_text`). */
function parcelsText(parcels: QuoteRequestInput["parcels"]): string {
  return parcels
    .map((p, i) =>
      [
        `Colis ${i + 1}`,
        `  Numéro : ${p.number}`,
        `  Description : ${p.description}`,
        `  Emballage : ${label(PACKAGING_TYPES, p.packaging)}`,
        `  Valeur estimée : ${
          p.estimatedValue != null ? p.estimatedValue.toLocaleString("fr-FR") : NOT_PROVIDED
        }`,
        `  Statut : Nouvelle demande`,
      ].join("\n"),
    )
    .join("\n\n");
}

export function quoteTemplateParams(
  quote: QuoteRequestInput,
  meta: QuoteEmailMeta,
): Record<string, string> {
  const { sender, recipient, parcels } = quote;
  return {
    quote_reference: meta.reference,
    submission_date: frDate(meta.submittedAt),

    sender_full_name: `${sender.firstName} ${sender.lastName}`,
    sender_phone: sender.phone,
    sender_email: sender.email,
    sender_address: sender.address,
    sender_postal_code: sender.postalCode,
    sender_city: sender.city,
    campaign: label(CAMPAIGNS, sender.campaign),
    representative: label(REPRESENTATIVES, sender.representative),

    recipient_full_name: `${recipient.firstName} ${recipient.lastName}`,
    recipient_phone: recipient.phone,
    recipient_other_phone: recipient.alternatePhone ?? NOT_PROVIDED,
    recipient_city: recipient.city,
    home_delivery: recipient.homeDelivery ? "Oui" : "Non",
    delivery_address: recipient.homeDelivery
      ? (recipient.deliveryAddress ?? NOT_PROVIDED)
      : "Sans objet (pas de livraison à domicile)",

    parcel_count: String(parcels.length),
    parcels_text: parcelsText(parcels),
  };
}

export function contactTemplateParams(input: ContactInput): Record<string, string> {
  return {
    submission_date: frDate(new Date()),
    contact_name: input.name,
    contact_email: input.email,
    contact_subject: input.subject,
    contact_message: input.message,
  };
}
