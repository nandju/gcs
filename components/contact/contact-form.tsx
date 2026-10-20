"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, Loader2, Send } from "lucide-react";
import { contactSchema } from "@/lib/validation/contact";
import { Field, TextInput, inputClass } from "@/components/quotes/fields";
import { cn } from "@/lib/utils";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status.state === "submitting") return;

    const parsed = contactSchema.safeParse({ name, email, subject, message });
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!(key in map)) map[key] = issue.message;
      }
      setErrors(map);
      return;
    }
    setErrors({});
    setStatus({ state: "submitting" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website: honeypot || undefined }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
      } | null;
      if (res.ok && data?.ok) {
        setStatus({ state: "success" });
      } else {
        setStatus({
          state: "error",
          message: data?.message ?? "L'envoi de votre message a échoué. Veuillez réessayer.",
        });
      }
    } catch {
      setStatus({
        state: "error",
        message: "Connexion impossible. Vérifiez votre réseau et réessayez.",
      });
    }
  }

  if (status.state === "success") {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent-light text-accent">
          <CircleCheck className="size-7" />
        </span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-navy-950">
          Message envoyé
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Votre message a bien été transmis à l’équipe GCS, qui vous répondra à
          l’adresse indiquée.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="contact-name" label="Nom complet" error={errors.name}>
          <TextInput
            id="contact-name"
            autoComplete="name"
            value={name}
            error={Boolean(errors.name)}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
          />
        </Field>
        <Field id="contact-email" label="E-mail" error={errors.email}>
          <TextInput
            id="contact-email"
            type="email"
            autoComplete="email"
            value={email}
            error={Boolean(errors.email)}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
          />
        </Field>
      </div>
      <Field id="contact-subject" label="Sujet" error={errors.subject}>
        <TextInput
          id="contact-subject"
          value={subject}
          error={Boolean(errors.subject)}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Objet de votre demande"
        />
      </Field>
      <Field id="contact-message" label="Message" error={errors.message}>
        <textarea
          id="contact-message"
          rows={6}
          value={message}
          aria-invalid={Boolean(errors.message) || undefined}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Décrivez votre besoin…"
          className={cn(
            inputClass,
            "resize-y",
            errors.message && "border-red-400 focus:border-red-500",
          )}
        />
      </Field>

      {/* Honeypot anti-spam : invisible pour les visiteurs. */}
      <div className="absolute -left-[9999px] top-auto" aria-hidden>
        <label htmlFor="contact-website">Ne pas remplir</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {status.state === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.state === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition-colors hover:bg-accent-dark disabled:opacity-60 sm:w-auto"
      >
        {status.state === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}
