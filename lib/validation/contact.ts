import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Ce champ est requis.").max(100),
  email: z.string().trim().min(1, "Ce champ est requis.").max(120).email("Adresse e-mail invalide."),
  subject: z.string().trim().min(1, "Ce champ est requis.").max(150),
  message: z.string().trim().min(1, "Ce champ est requis.").max(5000),
  /** Honeypot anti-spam : accepté par le schéma, traité par la route. */
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
