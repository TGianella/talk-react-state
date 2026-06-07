import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Trip } from '../types'

// ── Actions ──────────────────────────────────────────────────
type Action =
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'REMOVE_TRIP'; payload: string } // payload = trip.id

// ── Reducer ──────────────────────────────────────────────────
interface TripState {
  trips: Trip[]
}

function tripsReducer(state: TripState, action: Action): TripState {
  switch (action.type) {
    case 'ADD_TRIP':
      return { trips: [...state.trips, action.payload] }
    case 'REMOVE_TRIP':
      return { trips: state.trips.filter((t) => t.id !== action.payload) }
    default:
      return state
  }
}

// ── Context ──────────────────────────────────────────────────
interface TripContextValue {
  trips: Trip[]
  dispatch: Dispatch<Action>
}

const TripContext = createContext<TripContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────
export function TripContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripsReducer, { trips: [] })
  return (
    <TripContext.Provider value={{ trips: state.trips, dispatch }}>
      {children}
    </TripContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────
export function useTripContext(): TripContextValue {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTripContext doit être utilisé dans TripContextProvider')
  return ctx
}
