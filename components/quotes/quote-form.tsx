"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  Container as ContainerIcon,
  Loader2,
  Package,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import {
  CAMPAIGNS,
  MAX_PARCELS,
  PACKAGING_TYPES,
  REPRESENTATIVES,
} from "@/config/quotes";
import {
  fieldErrors,
  parcelSchema,
  recipientStepSchema,
  senderStepSchema,
} from "@/lib/validation/quote";
import { cn } from "@/lib/utils";
import { Field, SelectInput, TextInput } from "./fields";
import { SuccessDialog } from "./success-dialog";

/* ---------- État local du formulaire ---------- */

interface SenderValues {
  campaign: string;
  representative: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
}

interface RecipientValues {
  firstName: string;
  lastName: string;
  phone: string;
  alternatePhone: string;
  city: string;
  homeDelivery: boolean;
  deliveryAddress: string;
}

interface ParcelValues {
  key: string;
  number: string;
  description: string;
  packaging: string;
  estimatedValue: string;
}

const EMPTY_SENDER: SenderValues = {
  campaign: "",
  representative: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
  city: "",
};

const EMPTY_RECIPIENT: RecipientValues = {
  firstName: "",
  lastName: "",
  phone: "",
  alternatePhone: "",
  city: "",
  homeDelivery: false,
  deliveryAddress: "",
};

function newParcel(): ParcelValues {
  return {
    key: crypto.randomUUID(),
    number: "",
    description: "",
    packaging: "",
    estimatedValue: "",
  };
}

function parcelPayload(p: ParcelValues) {
  const value = p.estimatedValue.trim().replace(",", ".");
  return {
    number: p.number,
    description: p.description,
    packaging: p.packaging,
    estimatedValue: value === "" ? undefined : Number(value),
  };
}

const STEPS = ["Campagne & expéditeur", "Destinataire", "Colis", "Récapitulatif"];

type Submission =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; reference: string };

function optionLabel(options: Array<{ value: string; label: string }>, value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

/* ---------- Composant principal ---------- */

export function QuoteForm() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sender, setSender] = useState<SenderValues>(EMPTY_SENDER);
  const [recipient, setRecipient] = useState<RecipientValues>(EMPTY_RECIPIENT);
  const [parcels, setParcels] = useState<ParcelValues[]>([newParcel()]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [parcelsError, setParcelsError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<Submission>({ status: "idle" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  function setSenderField<K extends keyof SenderValues>(key: K, value: SenderValues[K]) {
    setSender((s) => ({ ...s, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: "" } : e));
  }

  function setRecipientField<K extends keyof RecipientValues>(
    key: K,
    value: RecipientValues[K],
  ) {
    setRecipient((r) => ({ ...r, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: "" } : e));
  }

  function setParcelField(index: number, key: keyof ParcelValues, value: string) {
    setParcels((list) =>
      list.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    );
    const errorKey = `${index}.${key}`;
    setErrors((e) => (e[errorKey] ? { ...e, [errorKey]: "" } : e));
    setParcelsError(null);
  }

  function validateStep(target: number): boolean {
    if (target === 0) {
      const result = senderStepSchema.safeParse(sender);
      if (!result.success) {
        setErrors(fieldErrors(result.error));
        return false;
      }
    }
    if (target === 1) {
      const result = recipientStepSchema.safeParse({
        ...recipient,
        deliveryAddress: recipient.deliveryAddress || undefined,
      });
      if (!result.success) {
        setErrors(fieldErrors(result.error));
        return false;
      }
    }
    if (target === 2) {
      if (parcels.length === 0) {
        setParcelsError("Ajoutez au moins un colis à votre demande.");
        return false;
      }
      const all: Record<string, string> = {};
      parcels.forEach((p, i) => {
        const result = parcelSchema.safeParse(parcelPayload(p));
        if (!result.success) {
          for (const [key, message] of Object.entries(fieldErrors(result.error))) {
            all[`${i}.${key}`] = message;
          }
        }
      });
      if (Object.keys(all).length > 0) {
        setErrors(all);
        return false;
      }
    }
    setErrors({});
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function goBack() {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  async function submit() {
    if (submission.status === "submitting") return;
    setSubmission({ status: "submitting" });
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender,
          recipient: {
            ...recipient,
            alternatePhone: recipient.alternatePhone || undefined,
            deliveryAddress: recipient.deliveryAddress || undefined,
          },
          parcels: parcels.map(parcelPayload),
          website: honeypot || undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        reference?: string;
        message?: string;
      } | null;
      if (res.ok && data?.ok && data.reference) {
        setSubmission({ status: "success", reference: data.reference });
        setDialogOpen(true);
      } else {
        setSubmission({
          status: "error",
          message:
            data?.message ??
            "L'envoi de votre demande a échoué. Veuillez réessayer.",
        });
      }
    } catch {
      setSubmission({
        status: "error",
        message: "Connexion impossible. Vérifiez votre réseau et réessayez.",
      });
    }
  }

  if (submission.status === "success") {
    return (
      <>
        <SuccessDialog
          open={dialogOpen}
          reference={submission.reference}
          onClose={() => setDialogOpen(false)}
        />
        <div className="mx-auto max-w-xl rounded-2xl border border-line bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex w-fit items-center gap-2.5 font-extrabold tracking-tight text-navy-950">
          <span className="grid size-10 place-items-center rounded-lg bg-accent text-white">
            <ContainerIcon className="size-5" strokeWidth={2.2} />
          </span>
          <span className="text-xl">GCS</span>
        </span>
        <span className="mx-auto mt-6 grid size-16 place-items-center rounded-full bg-accent-light text-accent">
          <CircleCheck className="size-8" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-navy-950">
          Demande envoyée
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Votre demande de devis a bien été transmise à l’équipe GCS, qui
          reviendra vers vous dans les meilleurs délais.
        </p>
        <p className="mt-4 inline-block rounded-full bg-surface px-4 py-2 text-sm font-semibold text-navy-950">
          Référence : {submission.reference}
        </p>
        </div>
      </>
    );
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * -40 }),
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Indicateur de progression */}
      <ol className="flex items-center gap-2 sm:gap-3" aria-label="Étapes de la demande">
        {STEPS.map((title, i) => (
          <li key={title} className="flex flex-1 items-center gap-2 last:flex-none sm:gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border text-sm font-bold transition-colors",
                  i < step
                    ? "border-accent bg-accent text-white"
                    : i === step
                      ? "border-navy-950 bg-navy-950 text-white"
                      : "border-line bg-white text-ink-soft",
                )}
                aria-current={i === step ? "step" : undefined}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-semibold md:block",
                  i === step ? "text-navy-950" : "text-ink-soft",
                )}
              >
                {title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn("h-px flex-1", i < step ? "bg-accent" : "bg-line")}
              />
            )}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm font-semibold text-navy-950 md:hidden">
        Étape {step + 1} sur {STEPS.length} — {STEPS[step]}
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 sm:p-8"
          >
            {step === 0 && (
              <SenderStepPanel sender={sender} errors={errors} onChange={setSenderField} />
            )}
            {step === 1 && (
              <RecipientStepPanel
                recipient={recipient}
                errors={errors}
                onChange={setRecipientField}
              />
            )}
            {step === 2 && (
              <ParcelsStepPanel
                parcels={parcels}
                errors={errors}
                listError={parcelsError}
                onChange={setParcelField}
                onAdd={() => {
                  setParcelsError(null);
                  setParcels((list) =>
                    list.length < MAX_PARCELS ? [...list, newParcel()] : list,
                  );
                }}
                onRemove={(index) =>
                  setParcels((list) => list.filter((_, i) => i !== index))
                }
              />
            )}
            {step === 3 && (
              <RecapPanel sender={sender} recipient={recipient} parcels={parcels} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Honeypot anti-spam : invisible pour les visiteurs. */}
        <div className="absolute -left-[9999px] top-auto" aria-hidden>
          <label htmlFor="devis-website">Ne pas remplir</label>
          <input
            id="devis-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {submission.status === "error" && (
          <div
            role="alert"
            className="mx-6 mb-2 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 sm:mx-8"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {submission.message}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || submission.status === "submitting"}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
            Précédent
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 rounded-full bg-navy-950 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Continuer
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submission.status === "submitting"}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {submission.status === "submitting" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Envoyer ma demande de devis
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Étape 1 : campagne & expéditeur ---------- */

function SenderStepPanel({
  sender,
  errors,
  onChange,
}: {
  sender: SenderValues;
  errors: Record<string, string>;
  onChange: <K extends keyof SenderValues>(key: K, value: SenderValues[K]) => void;
}) {
  return (
    <fieldset>
      <legend className="text-lg font-bold text-navy-950">
        Campagne & expéditeur
      </legend>
      <p className="mt-1 text-sm text-ink-soft">
        Informations de la campagne d’expédition et de l’expéditeur.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field id="q-campaign" label="Campagne d'expédition" error={errors.campaign}>
          <SelectInput
            id="q-campaign"
            value={sender.campaign}
            error={Boolean(errors.campaign)}
            options={CAMPAIGNS}
            placeholder="Sélectionner une campagne"
            onChange={(e) => onChange("campaign", e.target.value)}
          />
        </Field>
        <Field id="q-representative" label="Représentant" error={errors.representative}>
          <SelectInput
            id="q-representative"
            value={sender.representative}
            error={Boolean(errors.representative)}
            options={REPRESENTATIVES}
            placeholder="Sélectionner un représentant"
            onChange={(e) => onChange("representative", e.target.value)}
          />
        </Field>
        <Field id="q-s-firstname" label="Prénom" error={errors.firstName}>
          <TextInput
            id="q-s-firstname"
            autoComplete="given-name"
            value={sender.firstName}
            error={Boolean(errors.firstName)}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
        </Field>
        <Field id="q-s-lastname" label="Nom" error={errors.lastName}>
          <TextInput
            id="q-s-lastname"
            autoComplete="family-name"
            value={sender.lastName}
            error={Boolean(errors.lastName)}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </Field>
        <Field id="q-s-phone" label="Numéro de téléphone" error={errors.phone}>
          <TextInput
            id="q-s-phone"
            type="tel"
            autoComplete="tel"
            value={sender.phone}
            error={Boolean(errors.phone)}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </Field>
        <Field id="q-s-email" label="Adresse e-mail" error={errors.email}>
          <TextInput
            id="q-s-email"
            type="email"
            autoComplete="email"
            value={sender.email}
            error={Boolean(errors.email)}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="q-s-address" label="Adresse" error={errors.address}>
            <TextInput
              id="q-s-address"
              autoComplete="street-address"
              value={sender.address}
              error={Boolean(errors.address)}
              onChange={(e) => onChange("address", e.target.value)}
            />
          </Field>
        </div>
        <Field id="q-s-postal" label="Code postal" error={errors.postalCode}>
          <TextInput
            id="q-s-postal"
            autoComplete="postal-code"
            value={sender.postalCode}
            error={Boolean(errors.postalCode)}
            onChange={(e) => onChange("postalCode", e.target.value)}
          />
        </Field>
        <Field id="q-s-city" label="Ville" error={errors.city}>
          <TextInput
            id="q-s-city"
            autoComplete="address-level2"
            value={sender.city}
            error={Boolean(errors.city)}
            onChange={(e) => onChange("city", e.target.value)}
          />
        </Field>
      </div>
    </fieldset>
  );
}

/* ---------- Étape 2 : destinataire ---------- */

function RecipientStepPanel({
  recipient,
  errors,
  onChange,
}: {
  recipient: RecipientValues;
  errors: Record<string, string>;
  onChange: <K extends keyof RecipientValues>(key: K, value: RecipientValues[K]) => void;
}) {
  return (
    <fieldset>
      <legend className="text-lg font-bold text-navy-950">Destinataire</legend>
      <p className="mt-1 text-sm text-ink-soft">
        Coordonnées de la personne qui recevra l’expédition.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field id="q-r-firstname" label="Prénom" error={errors.firstName}>
          <TextInput
            id="q-r-firstname"
            value={recipient.firstName}
            error={Boolean(errors.firstName)}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
        </Field>
        <Field id="q-r-lastname" label="Nom" error={errors.lastName}>
          <TextInput
            id="q-r-lastname"
            value={recipient.lastName}
            error={Boolean(errors.lastName)}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </Field>
        <Field id="q-r-phone" label="Téléphone principal" error={errors.phone}>
          <TextInput
            id="q-r-phone"
            type="tel"
            value={recipient.phone}
            error={Boolean(errors.phone)}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </Field>
        <Field
          id="q-r-altphone"
          label="Autre numéro de téléphone"
          optional
          error={errors.alternatePhone}
        >
          <TextInput
            id="q-r-altphone"
            type="tel"
            value={recipient.alternatePhone}
            error={Boolean(errors.alternatePhone)}
            onChange={(e) => onChange("alternatePhone", e.target.value)}
          />
        </Field>
        <Field id="q-r-city" label="Ville" error={errors.city}>
          <TextInput
            id="q-r-city"
            value={recipient.city}
            error={Boolean(errors.city)}
            onChange={(e) => onChange("city", e.target.value)}
          />
        </Field>
      </div>

      <label
        htmlFor="q-r-homedelivery"
        className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-colors has-checked:border-accent has-checked:bg-accent-light"
      >
        <input
          id="q-r-homedelivery"
          type="checkbox"
          checked={recipient.homeDelivery}
          onChange={(e) => onChange("homeDelivery", e.target.checked)}
          className="mt-0.5 size-4.5 accent-accent"
        />
        <span>
          <span className="block text-sm font-semibold text-navy-950">
            Je désire faire livrer mon expédition à domicile
          </span>
          <span className="mt-0.5 block text-xs text-ink-soft">
            Le colis sera remis directement à l’adresse du destinataire.
          </span>
        </span>
      </label>

      {recipient.homeDelivery && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div className="pt-4">
            <Field
              id="q-r-deliveryaddress"
              label="Adresse de livraison"
              error={errors.deliveryAddress}
            >
              <TextInput
                id="q-r-deliveryaddress"
                value={recipient.deliveryAddress}
                error={Boolean(errors.deliveryAddress)}
                onChange={(e) => onChange("deliveryAddress", e.target.value)}
              />
            </Field>
          </div>
        </motion.div>
      )}
    </fieldset>
  );
}

/* ---------- Étape 3 : colis ---------- */

function ParcelsStepPanel({
  parcels,
  errors,
  listError,
  onChange,
  onAdd,
  onRemove,
}: {
  parcels: ParcelValues[];
  errors: Record<string, string>;
  listError: string | null;
  onChange: (index: number, key: keyof ParcelValues, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <fieldset>
      <legend className="text-lg font-bold text-navy-950">Colis</legend>
      <p className="mt-1 text-sm text-ink-soft">
        Décrivez chaque colis de votre expédition. La date de création est
        enregistrée automatiquement à l’envoi de la demande.
      </p>

      {listError && (
        <p className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
          <CircleAlert className="size-4 shrink-0" />
          {listError}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {parcels.map((parcel, i) => (
          <div key={parcel.key} className="rounded-xl border border-line bg-surface p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-navy-950">
                <Package className="size-4 text-accent" />
                Colis {i + 1}
              </span>
              {parcels.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="size-3.5" />
                  Retirer
                </button>
              )}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field id={`q-p-${parcel.key}-number`} label="Numéro" error={errors[`${i}.number`]}>
                <TextInput
                  id={`q-p-${parcel.key}-number`}
                  value={parcel.number}
                  error={Boolean(errors[`${i}.number`])}
                  onChange={(e) => onChange(i, "number", e.target.value)}
                />
              </Field>
              <Field
                id={`q-p-${parcel.key}-packaging`}
                label="Type d'emballage"
                error={errors[`${i}.packaging`]}
              >
                <SelectInput
                  id={`q-p-${parcel.key}-packaging`}
                  value={parcel.packaging}
                  error={Boolean(errors[`${i}.packaging`])}
                  options={PACKAGING_TYPES}
                  placeholder="Sélectionner un emballage"
                  onChange={(e) => onChange(i, "packaging", e.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  id={`q-p-${parcel.key}-description`}
                  label="Description"
                  error={errors[`${i}.description`]}
                >
                  <TextInput
                    id={`q-p-${parcel.key}-description`}
                    value={parcel.description}
                    error={Boolean(errors[`${i}.description`])}
                    onChange={(e) => onChange(i, "description", e.target.value)}
                  />
                </Field>
              </div>
              <Field
                id={`q-p-${parcel.key}-value`}
                label="Valeur estimée"
                optional
                error={errors[`${i}.estimatedValue`]}
              >
                <TextInput
                  id={`q-p-${parcel.key}-value`}
                  inputMode="decimal"
                  placeholder="Ex. 250"
                  value={parcel.estimatedValue}
                  error={Boolean(errors[`${i}.estimatedValue`])}
                  onChange={(e) => onChange(i, "estimatedValue", e.target.value)}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={parcels.length >= MAX_PARCELS}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-accent/50 px-5 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent-light disabled:opacity-40"
      >
        <Plus className="size-4" />
        Ajouter un colis
      </button>
      {parcels.length >= MAX_PARCELS && (
        <p className="mt-2 text-xs text-ink-soft">
          Nombre maximal de colis atteint ({MAX_PARCELS}).
        </p>
      )}
    </fieldset>
  );
}

/* ---------- Étape 4 : récapitulatif ---------- */

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="shrink-0 text-ink-soft">{label}</dt>
      <dd className="text-right font-medium text-navy-950">{value}</dd>
    </div>
  );
}

function RecapPanel({
  sender,
  recipient,
  parcels,
}: {
  sender: SenderValues;
  recipient: RecipientValues;
  parcels: ParcelValues[];
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-navy-950">Récapitulatif</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Vérifiez les informations avant d’envoyer votre demande.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <section className="rounded-xl border border-line p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
            Campagne & expéditeur
          </h3>
          <dl className="mt-3 divide-y divide-line/70">
            <RecapRow label="Campagne" value={optionLabel(CAMPAIGNS, sender.campaign)} />
            <RecapRow
              label="Représentant"
              value={optionLabel(REPRESENTATIVES, sender.representative)}
            />
            <RecapRow label="Nom" value={`${sender.firstName} ${sender.lastName}`} />
            <RecapRow label="Téléphone" value={sender.phone} />
            <RecapRow label="E-mail" value={sender.email} />
            <RecapRow
              label="Adresse"
              value={`${sender.address}, ${sender.postalCode} ${sender.city}`}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-line p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
            Destinataire
          </h3>
          <dl className="mt-3 divide-y divide-line/70">
            <RecapRow label="Nom" value={`${recipient.firstName} ${recipient.lastName}`} />
            <RecapRow label="Téléphone" value={recipient.phone} />
            {recipient.alternatePhone && (
              <RecapRow label="Autre téléphone" value={recipient.alternatePhone} />
            )}
            <RecapRow label="Ville" value={recipient.city} />
            <RecapRow
              label="Livraison à domicile"
              value={recipient.homeDelivery ? "Oui" : "Non"}
            />
            {recipient.homeDelivery && recipient.deliveryAddress && (
              <RecapRow label="Adresse de livraison" value={recipient.deliveryAddress} />
            )}
          </dl>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-line p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
          Colis ({parcels.length})
        </h3>
        <ul className="mt-3 divide-y divide-line/70">
          {parcels.map((p, i) => (
            <li key={p.key} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5 text-sm">
              <span className="font-bold text-navy-950">{i + 1}.</span>
              <span className="font-semibold text-navy-950">{p.number}</span>
              <span className="text-ink-soft">{p.description}</span>
              <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-ink">
                {optionLabel(PACKAGING_TYPES, p.packaging)}
              </span>
              {p.estimatedValue.trim() && (
                <span className="text-xs text-ink-soft">
                  Valeur est. {p.estimatedValue.trim()}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
