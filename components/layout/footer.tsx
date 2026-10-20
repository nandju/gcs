import Link from "next/link";
import { Suspense } from "react";
import { Container as ContainerIcon, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "./container";
import { CopyrightYear } from "./copyright-year";

const SERVICE_LINKS = [
  { label: "Transport & expédition", href: "/services#transport" },
  { label: "Gestion des colis", href: "/services#colis" },
  { label: "Livraison à domicile", href: "/services#livraison" },
  { label: "Suivi des opérations", href: "/services#suivi" },
  { label: "Demandes de devis", href: "/devis" },
];

export function Footer() {
  const { contact, socials } = siteConfig;
  const hasContact = Boolean(contact.email || contact.phone || contact.address);

  return (
    <footer className="bg-navy-950 text-white" id="contact-info">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight">
            <span className="grid size-9 place-items-center rounded-lg bg-accent">
              <ContainerIcon className="size-5" strokeWidth={2.2} />
            </span>
            <span className="text-xl">GCS</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {siteConfig.tagline} Plateforme de gestion et de suivi des
            opérations de transport et de logistique.
          </p>
          {socials.length > 0 && (
            <ul className="mt-5 flex gap-3">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Liens du site">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2.5">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Services
          </h3>
          <ul className="mt-4 space-y-2.5">
            {SERVICE_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
            Contact
          </h3>
          {hasContact ? (
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {contact.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="size-4 shrink-0 text-accent-soft" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="transition-colors hover:text-white"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-accent-soft" />
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-white"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent-soft" />
                  <span>{contact.address}</span>
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-white/50">
              Coordonnées à renseigner dans{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                config/site.ts
              </code>
              .
            </p>
          )}
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            ©{" "}
            <Suspense fallback={2026}>
              <CopyrightYear />
            </Suspense>{" "}
            GCS — Tous droits réservés.
          </p>
          <div className="flex gap-5">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-white"
            >
              Mentions légales
            </Link>
            <Link
              href="/confidentialite"
              className="transition-colors hover:text-white"
            >
              Politique de confidentialité
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
