import {
  ClipboardCheck,
  FileText,
  Home,
  Radar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";

const FEATURES: Array<{ icon: LucideIcon; title: string; desc: string }> = [
  {
    icon: FileText,
    title: "Cotation structurée",
    desc: "Chaque demande suit un parcours de devis clair.",
  },
  {
    icon: Radar,
    title: "Suivi opérationnel",
    desc: "Une visibilité réelle sur l'avancement des missions.",
  },
  {
    icon: ClipboardCheck,
    title: "Preuve de livraison",
    desc: "Chaque expédition se conclut par un justificatif.",
  },
  {
    icon: Home,
    title: "Livraison à domicile",
    desc: "Option disponible directement chez le destinataire.",
  },
];

export function FeaturesRow() {
  return (
    <section className="border-y border-line bg-surface py-10">
      <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-light text-accent">
              <feature.icon className="size-6" strokeWidth={1.9} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-navy-950">{feature.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
