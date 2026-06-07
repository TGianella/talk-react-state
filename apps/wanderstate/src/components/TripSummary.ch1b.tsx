import { useTripContext } from '../context/TripContext'
import styles from './TripSummary.ch1b.module.css'

function formatBudget(n: number): string {
  return n.toLocaleString('fr-FR') + '\u00a0€'
}

// Ce composant n'a aucune prop — il lit directement le contexte.
// Point pédagogique : aucune prop trips ne traverse Layout pour arriver ici.
export default function TripSummaryCh1b() {
  const { trips } = useTripContext()
  const total = trips.reduce((sum, t) => sum + t.budget, 0)

  return (
    <div className={styles.summary}>
      <span className={styles.value}>{trips.length}</span>
      <span>
        {trips.length === 1 ? 'voyage' : 'voyages'}
      </span>
      <span className={styles.sep}>•</span>
      <span>Budget total</span>
      <span className={styles.value}>{formatBudget(total)}</span>
    </div>
  )
}
