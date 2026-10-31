"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Alert Dialog de confirmation d'envoi — interface frontend uniquement :
 * aucun e-mail supplémentaire n'est déclenché (un seul envoi EmailJS vers
 * la boîte GCS a déjà eu lieu côté serveur).
 */
export function SuccessDialog({
  open,
  reference,
  onClose,
}: {
  open: boolean;
  reference: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Focus à l'ouverture + fermeture au clavier (Échap) + piège de focus
  // minimal (un seul élément interactif).
  useEffect(() => {
    if (!open) return;
    buttonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        e.preventDefault();
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/55 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="quote-success-title"
            aria-describedby="quote-success-desc"
            className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl sm:p-9"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.92, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.95, y: reduce ? 0 : 8 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-50">
              <span className="grid size-11 place-items-center rounded-full bg-green-100 text-green-600">
                <Check className="size-6" strokeWidth={2.8} />
              </span>
            </span>

            <h2
              id="quote-success-title"
              className="mt-5 text-2xl font-extrabold tracking-tight text-navy-950"
            >
              Demande envoyée avec succès !
            </h2>
            <p
              id="quote-success-desc"
              className="mt-3 leading-relaxed text-ink-soft"
            >
              Votre demande de devis a bien été transmise à notre équipe. Nous
              vous remercions pour votre confiance.
            </p>

            <p className="mt-5 inline-block rounded-full bg-surface px-4 py-2 text-sm font-semibold text-navy-950">
              Référence : {reference}
            </p>

            <button
              ref={buttonRef}
              type="button"
              onClick={onClose}
              className="mt-7 w-full rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition-colors hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-950"
            >
              Compris
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
