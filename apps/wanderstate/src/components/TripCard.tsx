import { formatBudget } from '../utils/format'
import styles from './TripCard.module.css'
import type { Trip } from '../types'

export interface TripCardProps {
  trip: Trip
  onDelete?: (id: string) => void
  onSelect?: (trip: Trip) => void
  view?: 'grid' | 'list'
}

export default function TripCard({ trip, onDelete, onSelect, view = 'grid' }: TripCardProps) {
  const isList = view === 'list'

  const info = (
    <>
      <div className={styles.tripCardName}>{trip.name}</div>
      <div className={styles.tripCardDestination}>{trip.destination}</div>
      <div className={`${styles.tripCardBudget} ${isList ? styles.tripCardBudgetList : ''}`}>
        {formatBudget(trip.budget)}
      </div>
    </>
  )

  return (
    <div className={`${styles.wrapper} ${isList ? styles.wrapperList : ''}`}>
      {onSelect ? (
        <button
          type="button"
          className={`${styles.tripCard} ${isList ? styles.tripCardList : ''}`}
          onClick={() => onSelect(trip)}
        >
          {info}
        </button>
      ) : (
        <div className={`${styles.tripCard} ${isList ? styles.tripCardList : ''}`}>
          {info}
        </div>
      )}
      {onDelete ? (
        <button
          type="button"
          className={`${styles.deleteBtn} ${isList ? styles.deleteBtnList : ''}`}
          aria-label={`Supprimer ${trip.name}`}
          onClick={() => onDelete(trip.id)}
        >
          Supprimer
        </button>
      ) : null}
    </div>
  )
}
