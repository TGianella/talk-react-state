import type { Trip } from '../types'
import styles from './TripCard.module.css'
import { formatBudget } from '../utils/format'

export interface TripCardProps {
  trip: Trip
}

export default function TripCardCh1a({ trip }: TripCardProps) {
  return (
    <div className={styles.tripCard}>
      <div className={styles.tripCardName}>{trip.name}</div>
      <div className={styles.tripCardDestination}>{trip.destination}</div>
      <div className={styles.tripCardBudget}>{formatBudget(trip.budget)}</div>
    </div>
  )
}
