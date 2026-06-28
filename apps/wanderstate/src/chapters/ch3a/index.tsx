// Ch. 3a — TanStack Query (state réseau)
// Le server state a son propre cycle de vie : fetch, cache, invalidation.
// TanStack Query le gère — pas un seul useState pour le loading ou l'erreur.
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { Trip } from '../../types'
import { fetchTrips, createTrip, deleteTrip } from './api'
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import LayoutFooter from '../../components/LayoutFooter'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'
import TripSummary from '../../components/TripSummary'
import StatusBanner from '../../components/StatusBanner'

const queryClient = new QueryClient()

function Ch3aInner() {
  const queryClient = useQueryClient()

  // Lecture : la liste des voyages. staleTime = pas de refetch si données récentes.
  // isPending = premier chargement (aucune donnée) ; isFetching = toute requête en vol,
  // y compris les refetch d'arrière-plan déclenchés par invalidateQueries.
  const { data: trips = [], isPending, isError, isFetching } = useQuery({
    queryKey: ['trips'],
    queryFn: fetchTrips,
    staleTime: 10_000,
  })

  // Écritures optimistes : on met à jour le cache AVANT la réponse serveur.
  // onMutate applique le changement + renvoie un snapshot ; onError le restaure
  // en cas d'échec ; onSettled invalide pour resynchroniser avec la vérité serveur.
  const addTrip = useMutation({
    mutationFn: createTrip,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['trips'] })
      const previous = queryClient.getQueryData<Trip[]>(['trips'])
      const optimistic: Trip = { id: `temp-${crypto.randomUUID()}`, ...input }
      queryClient.setQueryData<Trip[]>(['trips'], (old = []) => [...old, optimistic])
      return { previous }
    },
    onError: (_err, _input, ctx) => {
      queryClient.setQueryData(['trips'], ctx?.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  })
  const removeTrip = useMutation({
    mutationFn: deleteTrip,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['trips'] })
      const previous = queryClient.getQueryData<Trip[]>(['trips'])
      queryClient.setQueryData<Trip[]>(['trips'], (old = []) => old.filter((t) => t.id !== id))
      return { previous }
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(['trips'], ctx?.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  })

  const totalBudget = trips.reduce((s, t) => s + t.budget, 0)

  // Activité réseau en cours, liste déjà affichée : création, suppression ou refetch.
  const isSyncing = isFetching || addTrip.isPending || removeTrip.isPending

  return (
    <Layout>
      <LayoutHeader chapter="Ch. 3a · TanStack Query" />
      <LayoutBody>
        <TripForm
          isSubmitting={addTrip.isPending}
          onAddTrip={(trip) =>
            // trip.id ignoré — le serveur génère son propre id
            addTrip.mutate({ name: trip.name, destination: trip.destination, budget: trip.budget })
          }
        />
        {addTrip.isError ? (
          <StatusBanner tone="error" onClose={() => addTrip.reset()}>
            Échec de la création : {addTrip.error.message} — l'ajout optimiste a été annulé.
          </StatusBanner>
        ) : null}
        {!isPending && isSyncing ? (
          <StatusBanner tone="loading" compact>
            Synchronisation avec le serveur…
          </StatusBanner>
        ) : null}
        {isPending ? (
          <StatusBanner tone="loading">Chargement des voyages…</StatusBanner>
        ) : isError ? (
          <StatusBanner tone="error">Impossible de charger les voyages — le serveur répond-il ?</StatusBanner>
        ) : (
          <TripList trips={trips} onDeleteTrip={(id) => removeTrip.mutate(id)} />
        )}
      </LayoutBody>
      <LayoutFooter>
        <TripSummary tripCount={trips.length} totalBudget={totalBudget} />
      </LayoutFooter>
    </Layout>
  )
}

export function Ch3aApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <Ch3aInner />
      {/* Devtools : inspecter le cache, les états et les refetch en direct */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
