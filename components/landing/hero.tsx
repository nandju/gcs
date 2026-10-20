import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Plus, Radar } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/container";
import heroShip from "@/public/images/735.jpg";

const TRUST_ITEMS = [
  "Suivi de chaque étape",
  "Devis structuré en 3 étapes",
  "Livraison à domicile",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <Container className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-24">
        {/* Colonne texte */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-light px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            Plateforme logistique
          </span>
          <h1 className="mt-6 max-w-xl text-[2.6rem] leading-[1.06] font-extrabold tracking-tight text-navy-950 sm:text-6xl">
            Vos expéditions,{" "}
            <span className="text-accent">de bout en bout.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
            {siteConfig.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={siteConfig.quoteHref}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-colors hover:bg-accent-dark"
            >
              Demander un devis
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-navy-950/15 px-7 py-3.5 text-sm font-semibold text-navy-950 transition-colors hover:border-navy-950/40"
            >
              Découvrir nos services
            </Link>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-ink"
              >
                <CheckCircle2 className="size-4 text-accent" strokeWidth={2.4} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne visuelle */}
        <div className="relative">
          <div
            aria-hidden
            className="absolute -top-6 -right-6 hidden size-24 text-accent/40 lg:block"
          >
            <Plus className="size-8" strokeWidth={2.5} />
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] shadow-2xl shadow-navy-950/20">
            <Image
              src={heroShip}
              alt="Porte-conteneurs chargé, vu du ciel en pleine mer"
              className="aspect-[4/3] w-full object-cover"
              priority
            />
          </div>

          {/* Carte flottante : suivi */}
          <div className="absolute -left-4 top-8 hidden rounded-2xl border border-line bg-white/95 p-4 shadow-xl shadow-navy-950/15 backdrop-blur sm:block lg:-left-10">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent text-white">
                <Radar className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-navy-950">
                  Suivi opérationnel
                </p>
                <p className="text-xs text-ink-soft">Chaque étape est tracée</p>
              </div>
            </div>
          </div>

          {/* Carte flottante : devis */}
          <div className="absolute -bottom-6 right-4 rounded-2xl bg-accent p-4 text-white shadow-xl shadow-accent/30 sm:right-8">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-white/15">
                <FileText className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold">Devis en 3 étapes</p>
                <p className="text-xs text-white/80">
                  Expéditeur · Destinataire · Colis
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
