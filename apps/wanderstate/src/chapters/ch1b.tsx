import { TripContextProvider, useTripContext } from '../context/TripContext'
import Layout from '../Layout'
import TripSummaryCh1b from '../components/TripSummary.ch1b'

// Ch. 1b — useContext + useReducer
// TripForm    : inchangé (reçoit toujours onAddTrip en prop)
// TripCard    : TripCard.ch1b via barrel (dispatch sans prop drilling)
// TripSummary : lit le contexte directement, zéro prop traversant Layout

function Ch1bInner() {
  const { trips, dispatch } = useTripContext()
  return (
    <Layout
      trips={trips}
      onAddTrip={(trip) => dispatch({ type: 'ADD_TRIP', payload: trip })}
      chapter="Ch. 1b · useContext + useReducer"
    >
      <TripSummaryCh1b />
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
