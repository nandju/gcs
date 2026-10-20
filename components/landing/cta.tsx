import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/container";

export function Cta() {
  const contactHref = siteConfig.contact.email
    ? `mailto:${siteConfig.contact.email}`
    : "/contact";

  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #ffffff 0 1px, transparent 1px 28px)",
        }}
      />
      <Container className="relative flex flex-col items-center text-center text-white">
        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Prêt à lancer votre prochaine expédition ?
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-white/70">
          Décrivez votre besoin en quelques étapes : l’équipe GCS étudie votre
          demande et revient vers vous avec une cotation.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={siteConfig.quoteHref}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-colors hover:bg-accent-dark"
          >
            Demander un devis
            <ArrowRight className="size-4" />
          </Link>
          <a
            href={contactHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
          >
            <Mail className="size-4" />
            Nous contacter
          </a>
        </div>
      </Container>
    </section>
  );
}
