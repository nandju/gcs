/**
 * Options du formulaire de devis.
 *
 * ⚠ Données de DÉMONSTRATION : les campagnes et représentants ci-dessous
 * sont des exemples à remplacer par les valeurs métier réelles de GCS
 * (ou par une source de données) avant la mise en production.
 */

export interface QuoteOption {
  value: string;
  label: string;
}

export const CAMPAIGNS: QuoteOption[] = [
  { value: "campagne-demo-1", label: "Campagne de démonstration 1" },
  { value: "campagne-demo-2", label: "Campagne de démonstration 2" },
];

export const REPRESENTATIVES: QuoteOption[] = [
  { value: "representant-demo-1", label: "Représentant de démonstration 1" },
  { value: "representant-demo-2", label: "Représentant de démonstration 2" },
];

export const PACKAGING_TYPES: QuoteOption[] = [
  { value: "carton", label: "Carton" },
  { value: "valise", label: "Valise" },
  { value: "sac", label: "Sac" },
  { value: "palette", label: "Palette" },
  { value: "autre", label: "Autre" },
];

/** Nombre maximal de colis par demande (configurable). */
export const MAX_PARCELS = 30;
