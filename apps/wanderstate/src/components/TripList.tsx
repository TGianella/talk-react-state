import type { Trip } from '../types'
import TripCard from './TripCard'
import styles from './TripList.module.css'

interface TripListProps {
  trips: Trip[]
}

export default function TripList({ trips }: TripListProps) {
  return (
    <section className={styles.listSection}>
      <h2 className={styles.sectionTitle}>
        Mes voyages
        <span className={styles.tripsCount}>{trips.length}</span>
      </h2>

      {trips.length === 0 ? (
        <div className={styles.emptyState}>
          <strong>Aucun voyage pour l'instant</strong>
          Crée ton premier voyage ci-dessus.
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </section>
  )
}
