import {
  Calculator,
  ClipboardCheck,
  CreditCard,
  Route,
  Receipt,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "./reveal";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: UserPlus,
    title: "Prospect",
    description: "Prise de contact et qualification du besoin d'expédition.",
  },
  {
    icon: Calculator,
    title: "Cotation",
    description: "Établissement du devis à partir des informations de la demande.",
  },
  {
    icon: Route,
    title: "Mission",
    description: "Organisation et exécution de l'opération de transport.",
  },
  {
    icon: ClipboardCheck,
    title: "Preuve",
    description: "Confirmation et justificatif de la livraison effectuée.",
  },
  {
    icon: Receipt,
    title: "Facture",
    description: "Émission de la facture correspondant à la mission réalisée.",
  },
  {
    icon: CreditCard,
    title: "Paiement",
    description: "Encaissement et suivi du règlement de la facture.",
  },
  {
    icon: TrendingUp,
    title: "Marge",
    description: "Calcul de la rentabilité de chaque opération.",
  },
];

export function Process() {
  return (
    <section id="processus" className="bg-navy-950 py-20 text-white sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-soft">
            Comment ça marche
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
            De la demande à la marge, chaque étape est tracée
          </h2>
          <p className="mt-5 leading-relaxed text-white/65">
            GCS organise vos opérations selon une chaîne de traitement unique.
            Vous savez toujours où en est une expédition et quelle est la
            prochaine étape.
          </p>
        </div>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-7 lg:gap-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <li className="relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent text-white">
                    <step.icon className="size-5" strokeWidth={1.9} />
                  </span>
                  <span className="text-xs font-bold tracking-widest text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">
                    {step.description}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -right-[9px] z-10 hidden size-3 -translate-y-1/2 rotate-45 border-t border-r border-white/10 bg-navy-950 lg:block"
                  />
                )}
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
