import { formatBudget } from '../utils/format'
import styles from './TripSummary.module.css'

interface TripSummaryProps {
  tripCount: number
  totalBudget: number
}

export default function TripSummary({ tripCount, totalBudget }: TripSummaryProps) {
  return (
    <div className={styles.summary}>
      <span className={styles.value}>{tripCount}</span>
      <span>{tripCount === 1 ? 'voyage' : 'voyages'}</span>
      <span className={styles.sep}>•</span>
      <span>Budget total</span>
      <span className={styles.value}>{formatBudget(totalBudget)}</span>
    </div>
  )
}
