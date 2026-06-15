/**
 * Formate un nombre en montant €  (ex: 4 200 €)
 * Utilisé par TripCard et TripSummary.
 */
export function formatBudget(n: number): string {
  return n.toLocaleString('fr-FR') + '\u00a0€'
}
