import TripCardCh1a from './TripCard.ch1a'
import type { TripCardProps } from './TripCard.ch1a'
import { useTripContext } from '../context/TripContext'
import styles from './TripCard.ch1b.module.css'

export default function TripCardCh1b({ trip }: TripCardProps) {
  const { dispatch } = useTripContext()
  return (
    <div className={styles.wrapper}>
      <TripCardCh1a trip={trip} />
      <button
        type="button"
        className={styles.deleteBtn}
        aria-label={`Supprimer ${trip.name}`}
        onClick={() => dispatch({ type: 'REMOVE_TRIP', payload: trip.id })}
      >
        Supprimer
      </button>
    </div>
  )
}
