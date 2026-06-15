// Ch. 5a — XState (machine d'états)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'

export function Ch5aApp() {
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 5a · XState" />
      <LayoutBody>
        <TripForm onAddTrip={() => {}} />
        <TripList trips={[]} />
      </LayoutBody>
    </Layout>
  )
}
