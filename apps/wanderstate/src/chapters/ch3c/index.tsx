// Ch. 3c — Convex (temps réel)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'

export function Ch3cApp() {
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 3c · Convex" />
      <LayoutBody>
        <TripForm onAddTrip={() => {}} />
        <TripList trips={[]} />
      </LayoutBody>
    </Layout>
  )
}
