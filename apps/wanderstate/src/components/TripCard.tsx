import { formatBudget } from '../utils/format'
import styles from './TripCard.module.css'
import type { Trip } from '../types'

export interface TripCardProps {
  trip: Trip
  onDelete?: (id: string) => void
}

export default function TripCard({ trip, onDelete }: TripCardProps) {
  return (
    <div>
      <div className={styles.tripCard}>
        <div className={styles.tripCardName}>{trip.name}</div>
        <div className={styles.tripCardDestination}>{trip.destination}</div>
        <div className={styles.tripCardBudget}>{formatBudget(trip.budget)}</div>
      </div>
      {onDelete ? (
        <button
          type="button"
          className={styles.deleteBtn}
          aria-label={`Supprimer ${trip.name}`}
          onClick={() => onDelete(trip.id)}
        >
          Supprimer
        </button>
      ) : null}
    </div>
  )
}
