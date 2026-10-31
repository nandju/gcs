# GCS — Plateforme logistique

Site vitrine + formulaire de devis multiétape fonctionnel. Les demandes de
devis sont envoyées par e-mail via EmailJS (un seul modèle, un seul envoi
vers kilyrodrigue@gmail.com, aucun accusé de réception au visiteur). Le
formulaire de contact est désactivé pour le moment (réponse 503).

## Commandes

- `pnpm dev` — serveur de dev (http://localhost:3000)
- `pnpm build` — build de production (vérifie aussi les types)
- `pnpm lint` — ESLint

## Stack

Next.js 16 (App Router, Turbopack, Cache Components) · React 19 · TypeScript
strict · Tailwind CSS 4 (tokens dans `app/globals.css` via `@theme`) ·
police Outfit · lucide-react · framer-motion · zod · pnpm.

## Structure

- `app/(site)/` — pages publiques (`/`, `/services`, `/a-propos`, `/contact`,
  `/devis`, mentions légales)
- `app/api/devis/route.ts` — réception + validation + envoi EmailJS des devis
- `app/api/contact/route.ts` — contact désactivé (503) tant qu'aucun second
  modèle EmailJS n'existe (cf. `docs/emailjs/README.md`)
- `components/` — `layout`, `landing`, `quotes` (formulaire multiétape),
  `contact`
- `config/site.ts` — nom, navigation, coordonnées
- `config/quotes.ts` — campagnes / représentants / emballages (données de
  DÉMONSTRATION à remplacer) + `MAX_PARCELS`
- `lib/validation/` — schémas Zod partagés client/serveur (`quote`, `contact`)
- `lib/rate-limit.ts` — limitation de fréquence en mémoire
- `services/email/` — `emailjs.ts` (API REST serveur, clé privée) +
  `templates.ts` (template_params EmailJS, dont `parcels_text`)
- `docs/emailjs/` — guide de configuration du dashboard + gabarits HTML
  des modèles devis et contact
- `public/images/` — photos logistiques locales de la landing

## Formulaire de devis (`/devis`)

4 écrans : Campagne & expéditeur → Destinataire → Colis → Récapitulatif.
- Validation Zod par étape côté client, revalidation complète côté serveur.
- Adresse de livraison obligatoire uniquement si « livraison à domicile ».
- Colis : ajout/retrait dynamiques (min 1, max `MAX_PARCELS`), date de
  création gérée automatiquement au moment de l'envoi.
- Honeypot `website` + rate-limit (5 req / 10 min / IP).
- Envoi : POST serveur vers `https://api.emailjs.com/api/v1.0/email/send`
  (service_id + template_id + user_id + accessToken). La clé privée reste
  côté serveur ; le destinataire réel est fixé dans le modèle EmailJS
  (jamais remplaçable par une saisie visiteur) ; Reply-To = e-mail du
  demandeur via `{{sender_email}}`.
- Confirmation affichée seulement si EmailJS accepte la demande d'envoi
  (HTTP 200 ≠ preuve de livraison) — référence `GCS-AAAAMMJJ-XXXXXX`.

## Configuration (voir `.env.example` et `docs/emailjs/README.md`)

`GCS_EMAILJS_SERVICE_ID`, `GCS_EMAILJS_TEMPLATE_ID`,
`GCS_EMAILJS_PUBLIC_KEY`, `GCS_EMAILJS_PRIVATE_KEY`. Sans ces variables, la
route devis répond 503. Dashboard : activer « Allow EmailJS API for
non-browser applications » (Account → Security), destinataire
`kilyrodrigue@gmail.com` en dur dans le modèle.

## Points d'attention

- `config/quotes.ts` contient des options de démonstration clairement
  identifiées — à remplacer par les vraies campagnes/représentants.
- Coordonnées : `config/site.ts` (vides = affichage « à configurer »).
- `new Date()` en render interdit au prerender (Cache Components) :
  `<Suspense>` + composant client (`copyright-year.tsx`).
- Aucun secret dans `NEXT_PUBLIC_*`.
- Ne pas fabriquer de prix, taxes ou calculs de devis non spécifiés.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
