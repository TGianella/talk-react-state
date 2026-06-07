import { useState } from 'react'
import Layout from '../Layout'
import type { Trip } from '../types'

export function Ch1aApp() {
  const [trips, setTrips] = useState<Trip[]>([])

  return (
    <Layout
      trips={trips}
      onAddTrip={(trip) => setTrips((prev) => [...prev, trip])}
      badge="useState"
      subtitle="Ch. 1a · State local"
    />
  )
}
