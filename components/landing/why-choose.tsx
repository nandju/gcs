import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "./reveal";
import imgPortrait from "@/public/images/129640.jpg";
import imgTeam from "@/public/images/71414.jpg";

const STRENGTHS = [
  {
    title: "Visibilité complète",
    desc: "Chaque étape de l'opération est visible et documentée.",
  },
  {
    title: "Interlocuteur unique",
    desc: "Un seul point de contact, de la cotation à la livraison.",
  },
  {
    title: "Traçabilité métier",
    desc: "Devis, mission, preuve, facture : une même chaîne.",
  },
  {
    title: "Réponses concrètes",
    desc: "Des demandes traitées, sans processus opaque.",
  },
];

export function WhyChoose() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Collage d'images */}
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[1.75rem] shadow-xl shadow-navy-950/15">
            <Image
              src={imgPortrait}
              alt="Responsable logistique consultant une tablette dans un entrepôt"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute -right-4 -bottom-8 hidden w-56 overflow-hidden rounded-2xl border-4 border-white shadow-xl sm:block lg:-right-8 lg:w-64">
            <Image
              src={imgTeam}
              alt="Équipe GCS préparant des colis en entrepôt"
              className="aspect-[3/2] w-full object-cover"
            />
          </div>
          <div className="absolute -top-5 -left-4 rounded-2xl bg-navy-950 px-5 py-4 text-white shadow-xl lg:-left-8">
            <p className="text-xs font-semibold tracking-wider text-white/60 uppercase">
              Notre approche
            </p>
            <p className="mt-1 text-sm font-bold">De bout en bout</p>
          </div>
        </Reveal>

        {/* Contenu */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
            Pourquoi GCS
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-navy-950 sm:text-[2.6rem] sm:leading-[1.1]">
            Une plateforme pensée pour la gestion d’expéditions
          </h2>
          <p className="mt-5 leading-relaxed text-ink-soft">
            GCS centralise le suivi des opérations de transport et de
            logistique : demandes de devis, organisation des missions, preuves
            de livraison et facturation suivent une même chaîne de traitement,
            pour garder une trace claire de chaque expédition.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {STRENGTHS.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-line bg-surface p-4"
              >
                <CheckCircle2 className="size-5 text-accent" strokeWidth={2.2} />
                <h3 className="mt-2.5 text-sm font-bold text-navy-950">
                  {item.title}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>

          <Link
            href="/a-propos"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-navy-950 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Découvrir GCS
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
