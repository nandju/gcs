import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { StaticImageData } from "next/image";
import { Container } from "@/components/layout/container";
import { Reveal } from "./reveal";
import imgTransport from "@/public/images/1380.jpg";
import imgColis from "@/public/images/77653.jpg";
import imgLivraison from "@/public/images/1242.jpg";
import imgSuivi from "@/public/images/14238.jpg";

export interface ServiceCard {
  id: string;
  image: StaticImageData;
  alt: string;
  index: string;
  title: string;
  description: string;
}

export const SERVICES: ServiceCard[] = [
  {
    id: "transport",
    image: imgTransport,
    alt: "Porte-conteneurs amarré au port avec ses grues",
    index: "01",
    title: "Transport & expédition",
    description:
      "Organisation de vos envois et expéditions avec un pilotage centralisé de chaque opération.",
  },
  {
    id: "colis",
    image: imgColis,
    alt: "Opérateurs contrôlant des colis sur des rayonnages",
    index: "02",
    title: "Gestion des colis",
    description:
      "Enregistrement détaillé de chaque colis : description, emballage, valeur et statut.",
  },
  {
    id: "livraison",
    image: imgLivraison,
    alt: "Livreuse déposant des colis à domicile",
    index: "03",
    title: "Livraison à domicile",
    description:
      "Option de livraison directement chez le destinataire, avec adresse dédiée.",
  },
  {
    id: "suivi",
    image: imgSuivi,
    alt: "Responsable vérifiant un stock dans un entrepôt",
    index: "04",
    title: "Suivi des opérations",
    description:
      "Chaque expédition est tracée dans une chaîne unique, du prospect à la marge.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-white py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Nos services
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight text-navy-950 sm:text-[2.6rem] sm:leading-[1.1]">
              Des solutions adaptées à vos besoins d’expédition
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-navy-950/15 px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:border-navy-950/40"
          >
            Tous nos services
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.08}>
              <Link
                href={`/services#${service.id}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-xl hover:shadow-navy-950/10"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-bold tracking-widest text-white backdrop-blur">
                    {service.index}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-navy-950">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {service.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    En savoir plus
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
