// Ch. 3a — wrappers HTTP vers le backend maison.
// Aucune logique de cache ici : c'est le rôle de TanStack Query.
// Chaque fonction throw si la réponse n'est pas ok → remonte en `isError`.
import type { Trip } from '../../types'

const API_URL = 'http://localhost:8787'

export async function fetchTrips(): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/api/trips`)
  if (!res.ok) throw new Error('Échec du chargement des voyages')
  return res.json()
}

export async function createTrip(input: Omit<Trip, 'id'>): Promise<Trip> {
  const res = await fetch(`${API_URL}/api/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    // On remonte le message d'erreur renvoyé par le serveur (sinon message générique)
    const data = await res.json().catch(() => null)
    throw new Error(data?.error ?? 'Échec de la création du voyage')
  }
  return res.json()
}

export async function deleteTrip(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/trips/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Échec de la suppression du voyage')
}
