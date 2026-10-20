"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Container as ContainerIcon,
  Menu,
  X,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "./container";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold tracking-tight text-navy-950"
          aria-label="GCS — Accueil"
        >
          <span className="grid size-10 place-items-center rounded-lg bg-accent text-white">
            <ContainerIcon className="size-5.5" strokeWidth={2.2} />
          </span>
          <span className="text-2xl">GCS</span>
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Navigation principale"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-navy-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={siteConfig.quoteHref}
            className="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 transition-colors hover:bg-accent-dark sm:inline-flex"
          >
            Demander un devis
            <ArrowRight className="size-4" />
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-md text-navy-950 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav
          className="border-t border-line bg-white lg:hidden"
          aria-label="Navigation mobile"
        >
          <Container className="flex flex-col py-4">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={siteConfig.quoteHref}
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white"
            >
              Demander un devis
              <ArrowRight className="size-4" />
            </Link>
          </Container>
        </nav>
      )}
    </header>
  );
}
