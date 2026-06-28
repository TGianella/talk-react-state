import { useTripStore } from './useTripStore'
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import LayoutFooter from '../../components/LayoutFooter'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'
import TripSummary from '../../components/TripSummary'

// Ch. 4b — Zustand (store global)
// Plus de Provider, plus de Context : le store est importé directement.
// totalBudget reste calculé ici — aucun accès au store dans les visuels.

export function Ch4bApp() {
  const trips = useTripStore((s) => s.trips)
  const addTrip = useTripStore((s) => s.addTrip)
  const removeTrip = useTripStore((s) => s.removeTrip)
  const totalBudget = trips.reduce((sum, t) => sum + t.budget, 0)

  return (
    <Layout>
      <LayoutHeader chapter="Ch. 4b · Zustand" />
      <LayoutBody>
        <TripForm onAddTrip={addTrip} />
        <TripList trips={trips} onDeleteTrip={removeTrip} />
      </LayoutBody>
      <LayoutFooter>
        <TripSummary tripCount={trips.length} totalBudget={totalBudget} />
      </LayoutFooter>
    </Layout>
  )
}
