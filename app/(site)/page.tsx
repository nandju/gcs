import { Coverage } from "@/components/landing/coverage";
import { Cta } from "@/components/landing/cta";
import { FeaturesRow } from "@/components/landing/features-row";
import { Hero } from "@/components/landing/hero";
import { Process } from "@/components/landing/process";
import { Services } from "@/components/landing/services";
import { WhyChoose } from "@/components/landing/why-choose";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesRow />
      <Services />
      <Process />
      <WhyChoose />
      <Coverage />
      <Cta />
    </>
  );
}
