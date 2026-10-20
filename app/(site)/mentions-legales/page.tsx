import type { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function LegalPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          Mentions légales
        </h1>
        <p className="mt-6 leading-relaxed text-ink-soft">
          Contenu à compléter : éditeur du site, hébergeur, propriété
          intellectuelle et coordonnées officielles de GCS seront renseignés
          ici avant la mise en production.
        </p>
      </Container>
    </section>
  );
}
