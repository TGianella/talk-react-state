import { TripContextProvider, useTripContext } from './TripContext'
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import LayoutFooter from '../../components/LayoutFooter'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'
import TripSummary from '../../components/TripSummary'

// Ch. 1b — useContext + useReducer
// TripSummary reçoit ses données calculées ici — aucun accès au contexte dans les visuels

function Ch1bInner() {
  const { trips, dispatch } = useTripContext()
  const totalBudget = trips.reduce((s, t) => s + t.budget, 0)
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 1b · useContext + useReducer" />
      <LayoutBody>
        <TripForm onAddTrip={(t) => dispatch({ type: 'ADD_TRIP', payload: t })} />
        <TripList
          trips={trips}
          onDeleteTrip={(id) => dispatch({ type: 'REMOVE_TRIP', payload: id })}
        />
      </LayoutBody>
      <LayoutFooter>
        <TripSummary tripCount={trips.length} totalBudget={totalBudget} />
      </LayoutFooter>
    </Layout>
  )
}

export function Ch1bApp() {
  return (
    <TripContextProvider>
      <Ch1bInner />
    </TripContextProvider>
  )
}
