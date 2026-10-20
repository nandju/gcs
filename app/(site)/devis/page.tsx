import type { Metadata } from "next";
import { QuoteForm } from "@/components/quotes/quote-form";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Demander un devis",
  description:
    "Décrivez votre expédition en trois étapes : campagne et expéditeur, destinataire, colis. L'équipe GCS vous répond avec une cotation.",
};

export default function QuotePage() {
  return (
    <>
      <PageHeader
        eyebrow="Demande de devis"
        title="Décrivez votre expédition"
        description="Trois étapes suffisent : la campagne et l'expéditeur, le destinataire, puis les colis. Votre demande est transmise directement à l'équipe GCS."
      />
      <section className="bg-surface py-14 sm:py-20">
        <Container>
          <QuoteForm />
        </Container>
      </section>
    </>
  );
}
