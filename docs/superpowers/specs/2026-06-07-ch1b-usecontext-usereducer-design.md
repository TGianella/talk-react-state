# Ch. 1b — useContext + useReducer · Design Spec

Date : 2026-06-07

---

## Objectif pédagogique

Ch. 1b prolonge ch. 1a en montrant deux choses simultanément :

1. **Pattern** : remplacer `useState` local par `useContext + useReducer` pour un état partagé
2. **Gain fonctionnel visible** : ajout de la suppression de voyages, rendu naturel par `useReducer` (une action de plus dans le reducer)

L'audience voit que `TripCardDeletable` accède au `dispatch` sans qu'il soit passé en prop — c'est l'argument central de `useContext`.

---

## Architecture

### Principe : barrel file comme feature flag

`TripList` importe toujours `TripCard` depuis `./TripCard`. Ce fichier devient un barrel qui exporte l'implémentation correcte selon `CURRENT_CHAPTER` :

- `CURRENT_CHAPTER === '1a'` → exporte `TripCardBase` (pas de suppression)
- Tout autre chapitre → exporte `TripCardDeletable` (avec suppression)

`TripList`, `Layout`, `TripForm` ne changent pas du tout.

### Arborescence

```
context/
  TripContext.tsx             ← NOUVEAU

components/
  TripCard.tsx                ← MODIFIÉ : devient barrel (feature flag)
  TripCard.ch1a.tsx           ← NOUVEAU : actuel TripCard.tsx renommé
  TripCard.ch1b.tsx           ← NOUVEAU : wrappe TripCard.ch1a + bouton supprimer
  TripCard.module.css         ← inchangé

chapters/
  ch1b.tsx                    ← MODIFIÉ : stub → implémentation complète
```

---

## Fichiers en détail

### `context/TripContext.tsx`

```tsx
import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { Trip } from '../types'

type Action =
  | { type: 'ADD_TRIP'; payload: Trip }
  | { type: 'REMOVE_TRIP'; payload: string }  // payload = trip.id

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

interface TripContextValue {
  trips: Trip[]
  dispatch: React.Dispatch<Action>
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripsReducer, { trips: [] })
  return (
    <TripContext.Provider value={{ trips: state.trips, dispatch }}>
      {children}
    </TripContext.Provider>
  )
}

export function useTripContext(): TripContextValue {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTripContext doit être utilisé dans TripContextProvider')
  return ctx
}
```

---

### `components/TripCard.ch1a.tsx`

Actuel `TripCard.tsx` renommé. Contenu identique — seul le nom de fichier change. Exporte `TripCardProps`.

```tsx
import type { Trip } from '../types'
import styles from './TripCard.module.css'

export interface TripCardProps {
  trip: Trip
}

function formatBudget(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0€'
}

export default function TripCardCh1a({ trip }: TripCardProps) {
  return (
    <div className={styles.tripCard}>
      <div className={styles.tripCardName}>{trip.name}</div>
      <div className={styles.tripCardDestination}>{trip.destination}</div>
      <div className={styles.tripCardBudget}>{formatBudget(trip.budget)}</div>
    </div>
  )
}
```

---

### `components/TripCard.ch1b.tsx`

Wrappe `TripCard.ch1a` et ajoute un bouton supprimer. Consomme `useTripContext()` directement — pas de prop `onDelete`.

```tsx
import TripCardCh1a from './TripCard.ch1a'
import type { TripCardProps } from './TripCard.ch1a'
import { useTripContext } from '../context/TripContext'

export default function TripCardCh1b({ trip }: TripCardProps) {
  const { dispatch } = useTripContext()
  return (
    <div>
      <TripCardCh1a trip={trip} />
      <button onClick={() => dispatch({ type: 'REMOVE_TRIP', payload: trip.id })}>
        Supprimer
      </button>
    </div>
  )
}
```

Le style du bouton "Supprimer" suit les conventions CSS modules du projet (néo-brutaliste, variables CSS, pas de border-radius sur éléments avec box-shadow).

---

### `components/TripCard.tsx` (barrel)

```tsx
import { CURRENT_CHAPTER } from '../current-chapter'
import TripCardCh1a from './TripCard.ch1a'
import TripCardCh1b from './TripCard.ch1b'

export type { TripCardProps } from './TripCard.ch1a'

const TripCard = CURRENT_CHAPTER === '1a' ? TripCardCh1a : TripCardCh1b
export default TripCard
```

`TripList` importe toujours `TripCard` depuis `./TripCard` — aucun changement dans `TripList`.

---

### `chapters/ch1b.tsx`

```tsx
import { TripContextProvider, useTripContext } from '../context/TripContext'
import Layout from '../Layout'

// Ch. 1b — useContext + useReducer
// TripForm : inchangé (reçoit toujours onAddTrip en prop)
// TripCard : TripCardDeletable via barrel (dispatch sans prop drilling)

function Ch1bInner() {
  const { trips, dispatch } = useTripContext()
  return (
    <Layout
      trips={trips}
      onAddTrip={(trip) => dispatch({ type: 'ADD_TRIP', payload: trip })}
      chapter="Ch. 1b · useContext + useReducer"
    />
  )
}

export function Ch1bApp() {
  return (
    <TripContextProvider>
      <Ch1bInner />
    </TripContextProvider>
  )
}
```

---

## Ce qui ne change pas

| Fichier | Statut |
|---|---|
| `Layout.tsx` | Inchangé |
| `TripList.tsx` | Inchangé |
| `TripForm.tsx` | Inchangé |
| `TripCard.module.css` | Inchangé |
| `main.tsx` | Inchangé |

---

## CSS du bouton Supprimer

Nouveau fichier `TripCard.ch1b.module.css` colocalisé. Contraintes (cf. AGENTS.md) :

- Couleurs via variables CSS uniquement (`var(--color-*)`)
- Ombre plate néo-brutaliste : `box-shadow: Xpx Xpx 0 var(--color-primary)`
- Pas de `border-radius` sur éléments avec ombre plate
- Pas de `transform: translate` combiné avec ombre sur hover/active

---

## Non-scope

- Modification de trip (introduite dans un chapitre ultérieur si besoin)
- Confirmation avant suppression
- Animation de suppression
