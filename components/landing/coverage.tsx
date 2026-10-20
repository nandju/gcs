import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plane, Ship, Truck } from "lucide-react";
import { Container } from "@/components/layout/container";
import imgMultimodal from "@/public/images/2151989598.jpg";

const MODES = [
  { icon: Truck, label: "Route" },
  { icon: Ship, label: "Mer" },
  { icon: Plane, label: "Air" },
];

export function Coverage() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem]">
          <Image
            src={imgMultimodal}
            alt="Chaîne logistique multimodale : camion, avion et porte-conteneurs"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/30" />
          <div className="relative max-w-xl p-8 text-white sm:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-soft">
              Une chaîne complète
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Du premier échange à la preuve de livraison
            </h2>
            <p className="mt-5 leading-relaxed text-white/75">
              Transport, gestion des colis, livraison à domicile et suivi des
              opérations : GCS relie chaque étape dans un même espace de
              travail.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {MODES.map((mode) => (
                <span
                  key={mode.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur"
                >
                  <mode.icon className="size-4" />
                  {mode.label}
                </span>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Nous contacter
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
