// Backend maison — Ch. 3a (TanStack Query)
// API REST minimale sur les voyages. State serveur = source de vérité.
// Lancé avec tsx : `pnpm --filter wanderstate server`
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

interface Trip {
  id: string
  name: string
  destination: string
  budget: number
}

// ── "Base de données" en mémoire ─────────────────────────────
// Persiste tant que le serveur tourne — survit aux reloads du client,
// se réinitialise au redémarrage. Suffisant pour la démo.
let trips: Trip[] = [
  { id: crypto.randomUUID(), name: 'Escapade lavande', destination: 'Gordes', budget: 1200 },
  { id: crypto.randomUUID(), name: 'Week-end vignoble', destination: 'Eguisheim', budget: 800 },
  { id: crypto.randomUUID(), name: 'Pèlerinage roman', destination: 'Vézelay', budget: 1500 },
]

// Latence artificielle : rend les états isPending / isError visibles en démo.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const app = new Hono()
app.use('/*', cors({ origin: 'http://localhost:5173' }))

app.get('/api/trips', async (c) => {
  await sleep(500)
  return c.json(trips)
})

app.post('/api/trips', async (c) => {
  await sleep(500)
  const body = await c.req.json<Omit<Trip, 'id'>>()
  // Déclencheur de démo : une destination vers l'Atlantide échoue toujours.
  // Permet de montrer le rollback du rendu optimiste côté client.
  if (body.destination.trim().toLowerCase() === 'atlantide') {
    return c.json({ error: "L'Atlantide est introuvable — cette destination n'existe pas." }, 422)
  }
  const trip: Trip = { id: crypto.randomUUID(), ...body }
  trips.push(trip)
  return c.json(trip, 201)
})

app.delete('/api/trips/:id', async (c) => {
  await sleep(500)
  const { id } = c.req.param()
  const exists = trips.some((t) => t.id === id)
  if (!exists) return c.json({ error: 'Voyage introuvable' }, 404)
  trips = trips.filter((t) => t.id !== id)
  return c.json({ ok: true })
})

const port = 8787
serve({ fetch: app.fetch, port })
console.log(`🛰️  WanderState API → http://localhost:${port}`)
