export const siteConfig = {
  name: "GCS",
  tagline: "Vos expéditions, de bout en bout.",
  description:
    "GCS simplifie la gestion de vos expéditions, de la demande de devis au suivi des livraisons, avec une meilleure visibilité sur chaque étape.",
  nav: [
    { label: "Accueil", href: "/" },
    { label: "Nos services", href: "/services" },
    { label: "Comment ça marche", href: "/#processus" },
    { label: "À propos", href: "/a-propos" },
    { label: "Contact", href: "/contact" },
  ],
  quoteHref: "/devis",
  contact: {
    // TODO(client) : renseigner les coordonnées officielles avant mise en production.
    email: "",
    phone: "",
    address: "",
  },
  // TODO(client) : ajouter les profils sociaux officiels (LinkedIn, etc.).
  socials: [] as Array<{ label: string; href: string }>,
};
