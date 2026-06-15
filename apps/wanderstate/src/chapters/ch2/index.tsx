// Ch. 2 — nuqs (URL state)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'

export function Ch2App() {
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 2 · nuqs" />
      <LayoutBody>
        <TripForm onAddTrip={() => {}} />
        <TripList trips={[]} />
      </LayoutBody>
    </Layout>
  )
}
