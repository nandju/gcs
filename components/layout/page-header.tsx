import { Container } from "./container";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #ffffff 0 1px, transparent 1px 28px)",
        }}
      />
      <Container className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-soft">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-white/70">
          {description}
        </p>
      </Container>
    </section>
  );
}
