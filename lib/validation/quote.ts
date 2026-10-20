import { z } from "zod";
import { CAMPAIGNS, MAX_PARCELS, PACKAGING_TYPES, REPRESENTATIVES } from "@/config/quotes";

const REQUIRED = "Ce champ est requis.";

const name = z.string().trim().min(1, REQUIRED).max(80, "80 caractères maximum.");
const phone = z
  .string()
  .trim()
  .min(6, "Numéro de téléphone invalide.")
  .max(25, "Numéro de téléphone invalide.")
  .regex(/^[+0-9 ().-]+$/, "Numéro de téléphone invalide.");

function oneOf(values: Array<{ value: string }>, message: string) {
  return z
    .string()
    .refine((v) => values.some((o) => o.value === v), { message });
}

export const senderStepSchema = z.object({
  campaign: oneOf(CAMPAIGNS, "Sélectionnez une campagne d'expédition."),
  representative: oneOf(REPRESENTATIVES, "Sélectionnez un représentant."),
  firstName: name,
  lastName: name,
  phone,
  email: z.string().trim().min(1, REQUIRED).max(120).email("Adresse e-mail invalide."),
  address: z.string().trim().min(1, REQUIRED).max(200, "200 caractères maximum."),
  postalCode: z.string().trim().min(1, REQUIRED).max(12, "Code postal invalide."),
  city: name,
});

export const recipientStepSchema = z
  .object({
    firstName: name,
    lastName: name,
    phone,
    alternatePhone: z
      .union([z.literal(""), phone])
      .optional()
      .transform((v) => (v ? v : undefined)),
    city: name,
    homeDelivery: z.boolean(),
    deliveryAddress: z.string().trim().max(200, "200 caractères maximum.").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.homeDelivery && !data.deliveryAddress?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["deliveryAddress"],
        message: "L'adresse de livraison est requise pour une livraison à domicile.",
      });
    }
  });

export const parcelSchema = z.object({
  number: z.string().trim().min(1, REQUIRED).max(40, "40 caractères maximum."),
  description: z.string().trim().min(1, REQUIRED).max(300, "300 caractères maximum."),
  packaging: oneOf(PACKAGING_TYPES, "Sélectionnez un type d'emballage."),
  estimatedValue: z
    .number({ message: "Valeur invalide." })
    .nonnegative("La valeur ne peut pas être négative.")
    .max(10_000_000, "Valeur trop élevée.")
    .optional(),
});

export const quoteRequestSchema = z.object({
  sender: senderStepSchema,
  recipient: recipientStepSchema,
  parcels: z
    .array(parcelSchema)
    .min(1, "Ajoutez au moins un colis à votre demande.")
    .max(MAX_PARCELS, `${MAX_PARCELS} colis maximum par demande.`),
  /** Honeypot anti-spam : accepté par le schéma, traité par la route. */
  website: z.string().max(200).optional(),
});

export type SenderStep = z.infer<typeof senderStepSchema>;
export type RecipientStep = z.infer<typeof recipientStepSchema>;
export type ParcelInput = z.infer<typeof parcelSchema>;
export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

/** Transforme les erreurs Zod en map champ → message (premier message). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
