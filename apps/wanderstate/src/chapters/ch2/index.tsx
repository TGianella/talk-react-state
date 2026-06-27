import { useState } from 'react'
import { useQueryState, parseAsString, parseAsStringLiteral } from 'nuqs'
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import LayoutFooter from '../../components/LayoutFooter'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'
import TripSummary from '../../components/TripSummary'
import TripModal from '../../components/TripModal'
import type { Trip } from '../../types'

export function Ch2App() {
  const [trips, setTrips] = useState<Trip[]>([])

  // Ressource navigable → <a href> via createSerializer
  const [tripId, setTripId] = useQueryState('trip', parseAsString)

  // État UI → setter programmatique
  const [view, setView] = useQueryState(
    'view',
    parseAsStringLiteral(['grid', 'list'] as const).withDefault('grid')
  )

  const selectedTrip = trips.find((t) => t.id === tripId) ?? null
  const totalBudget = trips.reduce((s, t) => s + t.budget, 0)

  return (
    <Layout>
      <LayoutHeader chapter="Ch. 2 · nuqs" />
      <LayoutBody>
        <TripForm onAddTrip={(t) => setTrips((p) => [...p, t])} />
        <TripList
          trips={trips}
          view={view}
          onViewChange={setView}
          onSelectTrip={(trip) => setTripId(trip.id)}
          onDeleteTrip={(id) => setTrips((p) => p.filter((t) => t.id !== id))}
        />
      </LayoutBody>
      <LayoutFooter>
        <TripSummary tripCount={trips.length} totalBudget={totalBudget} />
      </LayoutFooter>
      <TripModal trip={selectedTrip} onClose={() => setTripId(null)} />
    </Layout>
  )
}
