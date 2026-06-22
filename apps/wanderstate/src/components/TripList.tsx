import type { Trip } from '../types'
import TripCard from './TripCard'
import ViewToggle from './ViewToggle'
import styles from './TripList.module.css'

interface TripListProps {
  trips: Trip[]
  onDeleteTrip?: (id: string) => void
  onSelectTrip?: (trip: Trip) => void
  view?: 'grid' | 'list'
  onViewChange?: (view: 'grid' | 'list') => void
}

export default function TripList({ trips, onDeleteTrip, onSelectTrip, view = 'grid', onViewChange }: TripListProps) {
  return (
    <section className={styles.listSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          Mes voyages
          <span className={styles.tripsCount}>{trips.length}</span>
        </h2>
        {onViewChange ? (
          <ViewToggle view={view} onViewChange={onViewChange} />
        ) : null}
      </div>

      {trips.length === 0 ? (
        <div className={styles.emptyState}>
          <strong>Aucun voyage pour l'instant</strong>
          Crée ton premier voyage ci-dessus.
        </div>
      ) : (
        <div className={`${styles.cardsGrid} ${view === 'list' ? styles.cardsGridList : ''}`}>
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              view={view}
              onDelete={onDeleteTrip}
              onSelect={onSelectTrip}
            />
          ))}
        </div>
      )}
    </section>
  )
}
