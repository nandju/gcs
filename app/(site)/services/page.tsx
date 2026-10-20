import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SERVICES } from "@/components/landing/services";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Transport et expédition, gestion des colis, livraison à domicile, suivi des opérations et demandes de devis : les services GCS.",
};

const DETAILS: Record<string, string[]> = {
  transport: [
    "Organisation des expéditions de bout en bout",
    "Choix du mode de transport adapté au besoin",
    "Pilotage centralisé de chaque opération",
  ],
  colis: [
    "Enregistrement : description, emballage, valeur",
    "Statut de chaque colis suivi dans le temps",
    "Recherche et filtrage dans la liste des colis",
  ],
  livraison: [
    "Option de livraison directe chez le destinataire",
    "Adresse de livraison dédiée lorsque requise",
    "Confirmation de la remise au destinataire",
  ],
  suivi: [
    "Chaîne Prospect → Cotation → Mission → Preuve → Facture → Paiement → Marge",
    "Visibilité sur l'avancement de chaque mission",
    "Traçabilité des étapes et des justificatifs",
  ],
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nos services"
        title="Une offre structurée autour de vos expéditions"
        description="De la prise en charge de la demande à la livraison, chaque service s'inscrit dans un processus unique et traçable."
      />

      <section className="bg-white py-16 sm:py-24">
        <Container className="space-y-16">
          {SERVICES.map((service, i) => (
            <article
              key={service.id}
              id={service.id}
              className={cn(
                "grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div className="overflow-hidden rounded-[1.75rem] shadow-xl shadow-navy-950/10">
                <Image
                  src={service.image}
                  alt={service.alt}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <div>
                <span className="text-sm font-bold tracking-widest text-accent">
                  {service.index}
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
                  {service.title}
                </h2>
                <p className="mt-4 leading-relaxed text-ink-soft">
                  {service.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {DETAILS[service.id].map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm text-ink"
                    >
                      <CheckCircle2
                        className="mt-0.5 size-4.5 shrink-0 text-accent"
                        strokeWidth={2.4}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={siteConfig.quoteHref}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  Demander un devis
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </Container>
      </section>
    </>
  );
}
