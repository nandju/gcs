import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Compass, Link2, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/landing/reveal";
import { siteConfig } from "@/config/site";
import imgTeam from "@/public/images/71414.jpg";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "GCS : une plateforme de gestion et de suivi des opérations de transport, d'expédition et de livraison.",
};

const PILLARS = [
  {
    icon: Compass,
    title: "Clarté",
    desc: "Chaque demande, mission et livraison suit un parcours lisible, sans zone d'ombre.",
  },
  {
    icon: Link2,
    title: "Continuité",
    desc: "Prospect, cotation, mission, preuve, facture, paiement, marge : une seule chaîne.",
  },
  {
    icon: ShieldCheck,
    title: "Fiabilité",
    desc: "Des justificatifs et un historique qui font foi à chaque étape.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos de GCS"
        title="Une approche de la logistique de bout en bout"
        description="GCS est une plateforme dédiée à la gestion et au suivi des opérations de transport, d'expédition, de livraison et de services logistiques."
      />

      <section className="bg-white py-16 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-[1.75rem] shadow-xl shadow-navy-950/10">
            <Image
              src={imgTeam}
              alt="Équipe logistique préparant et contrôlant des colis en entrepôt"
              className="aspect-[16/11] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Notre mission
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950">
              Rendre chaque expédition lisible, du premier contact au règlement
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              La gestion d’expéditions mélange souvent des échanges éparpillés :
              messages, appels, devis, preuves de livraison, factures. GCS
              rassemble ces étapes dans un même processus, pour que chaque
              opération reste compréhensible et traçable.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              La plateforme associe un espace de travail (messagerie intégrée,
              demandes de devis structurées) et une chaîne métier claire qui
              relie la demande initiale au résultat financier de l’opération.
            </p>
          </div>
        </Container>

        <Container className="mt-20">
          <div className="grid gap-5 sm:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-line bg-surface p-7">
                  <span className="grid size-12 place-items-center rounded-xl bg-accent-light text-accent">
                    <pillar.icon className="size-6" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy-950">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {pillar.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>

        <Container className="mt-20">
          <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-navy-950 p-8 text-center text-white sm:p-12 lg:flex-row lg:text-left">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Une expédition à organiser ?
              </h2>
              <p className="mt-2 max-w-lg text-white/70">
                Décrivez votre besoin : la demande de devis prend quelques
                minutes.
              </p>
            </div>
            <Link
              href={siteConfig.quoteHref}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Demander un devis
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
