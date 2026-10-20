import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez GCS pour vos besoins de transport et de logistique.",
};

export default function ContactPage() {
  const { contact } = siteConfig;
  const hasContact = Boolean(contact.email || contact.phone || contact.address);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Parlons de votre expédition"
        description="Une question, un besoin de transport, une demande particulière : écrivez-nous ou demandez directement un devis."
      />

      <section className="bg-white py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-navy-950">
              Envoyez-nous un message
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>

            <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
              <h3 className="font-bold text-navy-950">
                Besoin d’une cotation ?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Le parcours de demande de devis collecte les informations
                nécessaires à l’étude de votre expédition, étape par étape.
              </p>
              <Link
                href={siteConfig.quoteHref}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent"
              >
                Accéder au formulaire de devis
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded-2xl bg-navy-950 p-7 text-white">
            <h2 className="font-bold">Coordonnées</h2>
            {hasContact ? (
              <ul className="mt-5 space-y-4 text-sm text-white/75">
                {contact.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="size-4 shrink-0 text-accent-soft" />
                    <a href={`mailto:${contact.email}`} className="hover:text-white">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 shrink-0 text-accent-soft" />
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="hover:text-white"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-accent-soft" />
                    {contact.address}
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-white/60">
                Coordonnées officielles à renseigner dans{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                  config/site.ts
                </code>
                .
              </p>
            )}
            <div className="mt-7 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white/80">
                Demande de devis
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Pour une expédition, le parcours de devis est le moyen le plus
                rapide d’obtenir une réponse.
              </p>
              <Link
                href={siteConfig.quoteHref}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:border-white/50"
              >
                Demander un devis
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
