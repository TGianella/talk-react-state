import { useState } from 'react'
import type { Trip } from './types'
import TripForm from './components/TripForm'
import TripList from './components/TripList'
import styles from './App.module.css'

export default function App() {
  const [trips, setTrips] = useState<Trip[]>([])

  function handleAddTrip(trip: Trip) {
    setTrips((prev) => [...prev, trip])
  }

  return (
    <div className={styles.appWrapper}>
      <header className={styles.topbar}>
        <span className={styles.topbarLogo}>WanderState</span>
        <span className={styles.topbarBadge}>useState</span>
        <span className={styles.topbarSub}>Chapitre 1a · State local</span>
      </header>
      <main className={styles.appFrame}>
        <TripForm onAddTrip={handleAddTrip} />
        <TripList trips={trips} />
      </main>
    </div>
  )
}
