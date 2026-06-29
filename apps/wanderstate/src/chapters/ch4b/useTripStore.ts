import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Trip } from '../../types'

interface TripStore {
  trips: Trip[]
  addTrip: (trip: Trip) => void
  removeTrip: (id: string) => void
}

export const useTripStore = create<TripStore>()(
  persist(
    (set) => ({
      trips: [],
      addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
      removeTrip: (id) =>
        set((state) => ({ trips: state.trips.filter((t) => t.id !== id) })),
    }),
    { name: 'wanderstate-trips' }, // persist en localStorage en 1 ligne
  ),
)
