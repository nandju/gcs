import { CAMPAIGNS, PACKAGING_TYPES, REPRESENTATIVES } from "@/config/quotes";
import type { ContactInput } from "@/lib/validation/contact";
import type { QuoteRequestInput } from "@/lib/validation/quote";

/** Échappe les données utilisateur injectées dans le HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function label(options: Array<{ value: string; label: string }>, value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

const styles = {
  body: "margin:0;padding:24px 12px;background:#f5f7fa;font-family:'Segoe UI',Arial,sans-serif;color:#14263a;",
  card: "max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e3e9f0;",
  header: "background:#0a1e30;padding:24px 28px;",
  section: "padding:20px 28px 4px;",
  h2: "margin:0 0 12px;font-size:15px;color:#e8552d;text-transform:uppercase;letter-spacing:1px;",
  table: "width:100%;border-collapse:collapse;font-size:14px;",
  th: "text-align:left;padding:6px 8px 6px 0;color:#5c6f80;font-weight:600;vertical-align:top;white-space:nowrap;",
  td: "padding:6px 0;color:#14263a;",
  parcelTh: "text-align:left;padding:8px;background:#f5f7fa;color:#5c6f80;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;",
  parcelTd: "padding:8px;border-top:1px solid #e3e9f0;font-size:14px;",
  footer: "padding:18px 28px 26px;color:#5c6f80;font-size:12px;",
};

function row(labelText: string, value: string): string {
  return `<tr><th style="${styles.th}">${labelText}</th><td style="${styles.td}">${escapeHtml(value)}</td></tr>`;
}

export interface QuoteEmailMeta {
  reference: string;
  submittedAt: Date;
}

export function buildQuoteEmail(
  quote: QuoteRequestInput,
  meta: QuoteEmailMeta,
): { subject: string; html: string; text: string } {
  const { sender, recipient, parcels } = quote;
  const dateStr = meta.submittedAt.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const parcelRows = parcels
    .map(
      (p, i) => `<tr>
        <td style="${styles.parcelTd}">${i + 1}</td>
        <td style="${styles.parcelTd}"><strong>${escapeHtml(p.number)}</strong></td>
        <td style="${styles.parcelTd}">${escapeHtml(p.description)}</td>
        <td style="${styles.parcelTd}">${escapeHtml(label(PACKAGING_TYPES, p.packaging))}</td>
        <td style="${styles.parcelTd}">${p.estimatedValue != null ? escapeHtml(p.estimatedValue.toLocaleString("fr-FR")) : "—"}</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${styles.body}">
  <div style="${styles.card}">
    <div style="${styles.header}">
      <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;">GCS</p>
      <p style="margin:6px 0 0;font-size:15px;color:#f6a88f;font-weight:600;">Nouvelle demande de devis</p>
      <p style="margin:6px 0 0;font-size:12px;color:#9fb3c4;">Référence ${escapeHtml(meta.reference)} · ${escapeHtml(dateStr)}</p>
    </div>

    <div style="${styles.section}">
      <h2 style="${styles.h2}">Campagne</h2>
      <table style="${styles.table}">
        ${row("Campagne", label(CAMPAIGNS, sender.campaign))}
        ${row("Représentant", label(REPRESENTATIVES, sender.representative))}
      </table>
    </div>

    <div style="${styles.section}">
      <h2 style="${styles.h2}">Expéditeur</h2>
      <table style="${styles.table}">
        ${row("Nom", `${sender.firstName} ${sender.lastName}`)}
        ${row("Téléphone", sender.phone)}
        ${row("E-mail", sender.email)}
        ${row("Adresse", `${sender.address}, ${sender.postalCode} ${sender.city}`)}
      </table>
    </div>

    <div style="${styles.section}">
      <h2 style="${styles.h2}">Destinataire</h2>
      <table style="${styles.table}">
        ${row("Nom", `${recipient.firstName} ${recipient.lastName}`)}
        ${row("Téléphone", recipient.phone)}
        ${recipient.alternatePhone ? row("Autre téléphone", recipient.alternatePhone) : ""}
        ${row("Ville", recipient.city)}
        ${row("Livraison à domicile", recipient.homeDelivery ? "Oui" : "Non")}
        ${recipient.homeDelivery && recipient.deliveryAddress ? row("Adresse de livraison", recipient.deliveryAddress) : ""}
      </table>
    </div>

    <div style="${styles.section}">
      <h2 style="${styles.h2}">Colis (${parcels.length})</h2>
      <table style="${styles.table}">
        <tr>
          <th style="${styles.parcelTh}">#</th>
          <th style="${styles.parcelTh}">Numéro</th>
          <th style="${styles.parcelTh}">Description</th>
          <th style="${styles.parcelTh}">Emballage</th>
          <th style="${styles.parcelTh}">Valeur est.</th>
        </tr>
        ${parcelRows}
      </table>
    </div>

    <div style="${styles.footer}">
      Demande envoyée depuis le formulaire de devis du site GCS.
      Répondez directement à cet e-mail pour contacter l'expéditeur.
    </div>
  </div>
</body></html>`;

  const text = [
    `Nouvelle demande de devis — GCS`,
    `Référence : ${meta.reference}`,
    `Date : ${dateStr}`,
    ``,
    `CAMPAGNE`,
    `Campagne : ${label(CAMPAIGNS, sender.campaign)}`,
    `Représentant : ${label(REPRESENTATIVES, sender.representative)}`,
    ``,
    `EXPÉDITEUR`,
    `Nom : ${sender.firstName} ${sender.lastName}`,
    `Téléphone : ${sender.phone}`,
    `E-mail : ${sender.email}`,
    `Adresse : ${sender.address}, ${sender.postalCode} ${sender.city}`,
    ``,
    `DESTINATAIRE`,
    `Nom : ${recipient.firstName} ${recipient.lastName}`,
    `Téléphone : ${recipient.phone}`,
    ...(recipient.alternatePhone ? [`Autre téléphone : ${recipient.alternatePhone}`] : []),
    `Ville : ${recipient.city}`,
    `Livraison à domicile : ${recipient.homeDelivery ? "Oui" : "Non"}`,
    ...(recipient.homeDelivery && recipient.deliveryAddress
      ? [`Adresse de livraison : ${recipient.deliveryAddress}`]
      : []),
    ``,
    `COLIS (${parcels.length})`,
    ...parcels.map(
      (p, i) =>
        `${i + 1}. ${p.number} — ${p.description} — ${label(PACKAGING_TYPES, p.packaging)}${p.estimatedValue != null ? ` — valeur est. ${p.estimatedValue.toLocaleString("fr-FR")}` : ""}`,
    ),
  ].join("\n");

  return { subject: "Nouvelle demande de devis — GCS", html, text };
}

export function buildContactEmail(input: ContactInput): {
  subject: string;
  html: string;
  text: string;
} {
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="${styles.body}">
  <div style="${styles.card}">
    <div style="${styles.header}">
      <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;">GCS</p>
      <p style="margin:6px 0 0;font-size:15px;color:#f6a88f;font-weight:600;">Nouveau message de contact</p>
    </div>
    <div style="${styles.section}">
      <table style="${styles.table}">
        ${row("Nom", input.name)}
        ${row("E-mail", input.email)}
        ${row("Sujet", input.subject)}
      </table>
      <p style="font-size:14px;line-height:1.6;color:#14263a;white-space:pre-wrap;">${escapeHtml(input.message)}</p>
    </div>
    <div style="${styles.footer}">
      Message envoyé depuis la page contact du site GCS.
      Répondez directement à cet e-mail pour contacter le visiteur.
    </div>
  </div>
</body></html>`;

  const text = [
    `Nouveau message de contact — GCS`,
    `Nom : ${input.name}`,
    `E-mail : ${input.email}`,
    `Sujet : ${input.subject}`,
    ``,
    input.message,
  ].join("\n");

  return { subject: `[Contact GCS] ${input.subject}`, html, text };
}
