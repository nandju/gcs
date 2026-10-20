import type { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          Politique de confidentialité
        </h1>
        <p className="mt-6 leading-relaxed text-ink-soft">
          Contenu à compléter : traitement des données personnelles, finalités,
          durées de conservation, droits des utilisateurs et contact dédié
          seront détaillés ici avant la mise en production.
        </p>
      </Container>
    </section>
  );
}
