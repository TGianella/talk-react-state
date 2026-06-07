import type { Trip } from '../types'
import styles from './TripCard.module.css'

export interface TripCardProps {
  trip: Trip
}

function formatBudget(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0€'
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
