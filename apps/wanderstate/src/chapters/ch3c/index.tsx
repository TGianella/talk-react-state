// Ch. 3c — Convex (temps réel)
// useQuery = subscription live, useMutation = écriture transactionnelle
// Pas de cache à gérer, pas de polling, pas de websocket à câbler.
import { ConvexProvider, ConvexReactClient, useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Trip } from '../../types'
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import LayoutFooter from '../../components/LayoutFooter'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'
import TripSummary from '../../components/TripSummary'

const convex = new ConvexReactClient('https://cool-parakeet-28.eu-west-1.convex.cloud')

function Ch3cInner() {
  const rawTrips = useQuery(api.trips.list)
  const createTrip = useMutation(api.trips.create)
  const removeTrip = useMutation(api.trips.remove)

  // Mapping Convex (_id) → type Trip partagé (id)
  const trips: Trip[] = (rawTrips ?? []).map((t: any) => ({
    id: t._id,
    name: t.name,
    destination: t.destination,
    budget: t.budget,
  }))

  const totalBudget = trips.reduce((s, t) => s + t.budget, 0)

  return (
    <Layout>
      <LayoutHeader chapter="Ch. 3c · Convex" />
      <LayoutBody>
        <TripForm
          onAddTrip={(trip) =>
            // trip.id ignoré — Convex génère son propre _id côté serveur
            createTrip({ name: trip.name, destination: trip.destination, budget: trip.budget })
          }
        />
        <TripList
          trips={trips}
          onDeleteTrip={(id) => removeTrip({ id: id as any })}
        />
      </LayoutBody>
      <LayoutFooter>
        <TripSummary tripCount={trips.length} totalBudget={totalBudget} />
      </LayoutFooter>
    </Layout>
  )
}

export function Ch3cApp() {
  return (
    <ConvexProvider client={convex}>
      <Ch3cInner />
    </ConvexProvider>
  )
}
