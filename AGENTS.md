# GCS — Plateforme logistique

Site vitrine + formulaire de devis multiétape fonctionnel. Les demandes de
devis et les messages de contact sont envoyés par e-mail via Resend.

## Commandes

- `pnpm dev` — serveur de dev (http://localhost:3000)
- `pnpm build` — build de production (vérifie aussi les types)
- `pnpm lint` — ESLint

## Stack

Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript
strict · Tailwind CSS 4 (tokens dans `app/globals.css` via `@theme`) ·
police Outfit · lucide-react · framer-motion · zod · resend · pnpm.

## Structure

- `app/(site)/` — pages publiques (`/`, `/services`, `/a-propos`, `/contact`,
  `/devis`, mentions légales)
- `app/api/devis/route.ts` — réception + validation + envoi Resend des devis
- `app/api/contact/route.ts` — idem pour les messages de contact
- `components/` — `layout`, `landing`, `quotes` (formulaire multiétape),
  `contact`
- `config/site.ts` — nom, navigation, coordonnées
- `config/quotes.ts` — campagnes / représentants / emballages (données de
  DÉMONSTRATION à remplacer) + `MAX_PARCELS`
- `lib/validation/` — schémas Zod partagés client/serveur (`quote`, `contact`)
- `lib/rate-limit.ts` — limitation de fréquence en mémoire
- `services/email/` — `resend.ts` (envoi) + `templates.ts` (HTML/texte échappés)
- `public/images/` — photos logistiques locales de la landing

## Formulaire de devis (`/devis`)

4 écrans : Campagne & expéditeur → Destinataire → Colis → Récapitulatif.
- Validation Zod par étape côté client, revalidation complète côté serveur.
- Adresse de livraison obligatoire uniquement si « livraison à domicile ».
- Colis : ajout/retrait dynamiques (min 1, max `MAX_PARCELS`), date de
  création gérée automatiquement au moment de l'envoi.
- Honeypot `website` + rate-limit (5 req / 10 min / IP).
- E-mail : From = `GCS_QUOTES_FROM_EMAIL`, To = `GCS_QUOTES_TO_EMAIL`,
  Reply-To = e-mail du demandeur. Jamais le demandeur en From.
- Confirmation affichée seulement après acceptation par Resend (référence
  `GCS-AAAAMMJJ-XXXXXX`).

## Configuration (voir `.env.example`)

`RESEND_API_KEY`, `GCS_QUOTES_TO_EMAIL`, `GCS_QUOTES_FROM_EMAIL`.
Sans ces variables, les routes `/api/devis` et `/api/contact` répondent 503
avec un message explicite ; le reste du site fonctionne normalement.
Une adresse From personnalisée exige un domaine vérifié chez Resend
(`onboarding@resend.dev` disponible pour les tests).

## Points d'attention

- `config/quotes.ts` contient des options de démonstration clairement
  identifiées — à remplacer par les vraies campagnes/représentants.
- Coordonnées : `config/site.ts` (vides = affichage « à configurer »).
- `new Date()` en render interdit au prerender (Cache Components) :
  `<Suspense>` + composant client (`copyright-year.tsx`).
- Aucun secret dans `NEXT_PUBLIC_*`.
- Ne pas fabriquer de prix, taxes ou calculs de devis non spécifiés.
