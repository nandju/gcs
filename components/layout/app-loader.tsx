"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container as ContainerIcon } from "lucide-react";

/**
 * Écran de chargement initial : affiché une fois au montage de l'application
 * (~1,1 s), puis fondu vers le contenu. Les transitions de route utilisent
 * loading.tsx — ce loader ne bloque pas la navigation.
 */
export function AppLoader() {
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), reduce ? 0 : 1100);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-navy-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          aria-hidden
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid size-16 place-items-center rounded-2xl bg-accent text-white"
            >
              <ContainerIcon className="size-8" strokeWidth={2.2} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-4 text-2xl font-extrabold tracking-tight text-white"
            >
              GCS
            </motion.p>
            <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
