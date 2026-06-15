import { useState } from 'react'
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'
import type { Trip } from '../../types'

export function Ch1aApp() {
  const [trips, setTrips] = useState<Trip[]>([])
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 1a · useState" />
      <LayoutBody>
        <TripForm onAddTrip={(t) => setTrips((p) => [...p, t])} />
        <TripList trips={trips} />
      </LayoutBody>
    </Layout>
  )
}
