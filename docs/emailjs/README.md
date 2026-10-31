# Configuration EmailJS — GCS

Un **seul modèle EmailJS** est utilisé : celui des demandes de devis. Chaque
soumission valide déclenche **un seul envoi** vers `kilyrodrigue@gmail.com` —
**aucun accusé de réception n'est envoyé au visiteur** (la confirmation est
uniquement visuelle, sur le site). Le formulaire de contact est désactivé
pour le moment : sa route répond 503 tant qu'aucun modèle contact n'existe
(gabarit prêt dans `template-contact.html` si on l'active un jour).

## Étapes dans le dashboard (https://dashboard.emailjs.com)

1. **Email Services** → « Add New Service » → Gmail → connecter le compte
   `kilyrodrigue@gmail.com` → copier le **Service ID**.
2. **Email Templates** → « Create New Template » :
   - **To Email** : `kilyrodrigue@gmail.com` (en dur — jamais une variable)
   - **From Name** : `GCS — Demandes de devis`
   - **Reply To** : `{{sender_email}}`
   - **Subject** : `Nouvelle demande de devis GCS — {{quote_reference}}`
   - **Content** : passer en mode « Edit Content → Code Editor » et coller
     le contenu de `template-devis.html`.
   - Copier le **Template ID**.
3. **Account → General** : copier **Public Key** et **Private Key**.
4. **Account → Security** : activer **« Allow EmailJS API for non-browser
   applications »** (section « Use Private Key ») — obligatoire, sinon les
   appels API serveur sont refusés avec un 403 « API access from
   non-browser environments is currently disabled ».
5. Renseigner `.env.local` à partir de `.env.example` (4 variables :
   `GCS_EMAILJS_SERVICE_ID`, `GCS_EMAILJS_TEMPLATE_ID`,
   `GCS_EMAILJS_PUBLIC_KEY`, `GCS_EMAILJS_PRIVATE_KEY`), puis redémarrer
   `pnpm dev`.

## Variables du modèle devis

`quote_reference`, `submission_date`, `sender_full_name`, `sender_phone`,
`sender_email`, `sender_address`, `sender_postal_code`, `sender_city`,
`campaign`, `representative`, `recipient_full_name`, `recipient_phone`,
`recipient_other_phone`, `recipient_city`, `home_delivery`,
`delivery_address`, `parcel_count`, `parcels_text`.

Toutes les valeurs sont injectées en texte (doubles accolades, échappées par
EmailJS). `parcels_text` est un résumé multiligne : le modèle l'affiche dans
un bloc `white-space: pre-line`.

## Réactiver le formulaire de contact (un jour)

Créer un second modèle EmailJS (To Email `kilyrodrigue@gmail.com`, Reply To
`{{contact_email}}`, Subject `[Contact GCS] {{contact_subject}}`, contenu =
`template-contact.html`), exposer son Template ID (ex.
`GCS_EMAILJS_CONTACT_TEMPLATE_ID`) et rebrancher `sendViaEmailJs` dans
`app/api/contact/route.ts`. Variables attendues par le gabarit :
`submission_date`, `contact_name`, `contact_email`, `contact_subject`,
`contact_message`.
