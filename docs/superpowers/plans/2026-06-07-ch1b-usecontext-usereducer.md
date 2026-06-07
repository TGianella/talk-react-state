# Ch. 1b — useContext + useReducer · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter le chapitre 1b (useContext + useReducer) avec suppression de voyages via TripCard.ch1b et un encart TripSummary consommant le contexte sans prop drilling.

**Architecture:** Un `TripContext` centralise l'état via `useReducer`. `TripCard.tsx` devient un barrel qui sélectionne `TripCard.ch1a` ou `TripCard.ch1b` selon `CURRENT_CHAPTER`. `TripSummary.ch1b` consomme le contexte directement et est injecté via `children` de Layout. `TripList` et `Layout` ne changent pas.

**Tech Stack:** React 19, TypeScript 6, Vite 8, CSS Modules

**Repo :** `C:\Users\Yoann\Sites\talk-react-state` — monorepo pnpm, app dans `apps/wanderstate/src/`

**Pas de tests** (AGENTS.md : "Quick and dirty demo"). Vérification via build TypeScript.

**Build :** `pnpm --filter wanderstate build`

---

## Structure des fichiers

| Fichier | Action |
|---|---|
| `apps/wanderstate/src/context/TripContext.tsx` | Créer |
| `apps/wanderstate/src/components/TripCard.ch1a.tsx` | Créer (= TripCard.tsx renommé) |
| `apps/wanderstate/src/components/TripCard.tsx` | Modifier → barrel |
| `apps/wanderstate/src/components/TripCard.ch1b.tsx` | Créer |
| `apps/wanderstate/src/components/TripCard.ch1b.module.css` | Créer |
| `apps/wanderstate/src/components/TripSummary.ch1b.tsx` | Créer |
| `apps/wanderstate/src/components/TripSummary.ch1b.module.css` | Créer |
| `apps/wanderstate/src/chapters/ch1b.tsx` | Modifier → implémentation complète |
| `apps/wanderstate/src/components/TripCard.module.css` | Inchangé |
| `apps/wanderstate/src/components/TripList.tsx` | Inchangé |
| `apps/wanderstate/src/Layout.tsx` | Inchangé |

---

### Task 1 : `context/TripContext.tsx`

**Files:**
- Create: `apps/wanderstate/src/context/TripContext.tsx`

- [ ] **Step 1 : Créer le dossier `context/` et le fichier**

Créer `apps/wanderstate/src/context/TripContext.tsx` avec ce contenu exact :

```tsx
import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
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
  dispatch: React.Dispatch<Action>
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
```

- [ ] **Step 2 : Vérifier que le build passe**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur TypeScript.

- [ ] **Step 3 : Commit**

```bash
git add apps/wanderstate/src/context/TripContext.tsx
git commit -m "feat(ch1b): ajouter TripContext (reducer + provider + hook)"
```

---

### Task 2 : Refactorer TripCard — renommer + créer le barrel

**Files:**
- Create: `apps/wanderstate/src/components/TripCard.ch1a.tsx`
- Modify: `apps/wanderstate/src/components/TripCard.tsx` → barrel

- [ ] **Step 1 : Créer `TripCard.ch1a.tsx`**

Créer `apps/wanderstate/src/components/TripCard.ch1a.tsx` avec ce contenu (actuel `TripCard.tsx` avec `TripCardProps` exportée et fonction renommée) :

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

- [ ] **Step 2 : Remplacer `TripCard.tsx` par le barrel**

Remplacer le contenu de `apps/wanderstate/src/components/TripCard.tsx` par :

```tsx
import { CURRENT_CHAPTER } from '../current-chapter'
import TripCardCh1a from './TripCard.ch1a'
import TripCardCh1b from './TripCard.ch1b'

export type { TripCardProps } from './TripCard.ch1a'

const TripCard = CURRENT_CHAPTER === '1b' ? TripCardCh1b : TripCardCh1a
export default TripCard
```

**Note :** Ce barrel importe `TripCard.ch1b` qui n'existe pas encore — le build échouera jusqu'à la Task 3. C'est attendu.

- [ ] **Step 3 : Commit**

```bash
git add apps/wanderstate/src/components/TripCard.ch1a.tsx apps/wanderstate/src/components/TripCard.tsx
git commit -m "refactor(tripcard): renommer en TripCard.ch1a + barrel TripCard.tsx"
```

---

### Task 3 : `TripCard.ch1b.tsx` + CSS

**Files:**
- Create: `apps/wanderstate/src/components/TripCard.ch1b.module.css`
- Create: `apps/wanderstate/src/components/TripCard.ch1b.tsx`

- [ ] **Step 1 : Créer `TripCard.ch1b.module.css`**

Créer `apps/wanderstate/src/components/TripCard.ch1b.module.css` :

```css
.wrapper {
  display: flex;
  flex-direction: column;
}

.deleteBtn {
  width: 100%;
  margin-top: 8px;
  padding: 8px 0;
  background: var(--color-surface);
  color: var(--color-accent);
  border: 2px solid var(--color-accent);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--color-accent);
}

.deleteBtn:hover {
  box-shadow: 4px 4px 0 var(--color-accent);
}

.deleteBtn:active {
  box-shadow: 0 0 0 var(--color-accent);
}
```

- [ ] **Step 2 : Créer `TripCard.ch1b.tsx`**

Créer `apps/wanderstate/src/components/TripCard.ch1b.tsx` :

```tsx
import TripCardCh1a from './TripCard.ch1a'
import type { TripCardProps } from './TripCard.ch1a'
import { useTripContext } from '../context/TripContext'
import styles from './TripCard.ch1b.module.css'

export default function TripCardCh1b({ trip }: TripCardProps) {
  const { dispatch } = useTripContext()
  return (
    <div className={styles.wrapper}>
      <TripCardCh1a trip={trip} />
      <button
        className={styles.deleteBtn}
        onClick={() => dispatch({ type: 'REMOVE_TRIP', payload: trip.id })}
      >
        Supprimer
      </button>
    </div>
  )
}
```

- [ ] **Step 3 : Vérifier le build**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur TypeScript. Le barrel est maintenant complet.

- [ ] **Step 4 : Commit**

```bash
git add apps/wanderstate/src/components/TripCard.ch1b.tsx apps/wanderstate/src/components/TripCard.ch1b.module.css
git commit -m "feat(ch1b): ajouter TripCard.ch1b avec bouton supprimer"
```

---

### Task 4 : `TripSummary.ch1b.tsx` + CSS

**Files:**
- Create: `apps/wanderstate/src/components/TripSummary.ch1b.module.css`
- Create: `apps/wanderstate/src/components/TripSummary.ch1b.tsx`

- [ ] **Step 1 : Créer `TripSummary.ch1b.module.css`**

Créer `apps/wanderstate/src/components/TripSummary.ch1b.module.css` :

```css
.summary {
  padding: 16px 32px;
  border-top: 3px solid var(--color-primary);
  background: var(--color-surface-accent);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

.value {
  color: var(--color-accent);
}

.sep {
  color: var(--color-border-muted);
}
```

- [ ] **Step 2 : Créer `TripSummary.ch1b.tsx`**

Créer `apps/wanderstate/src/components/TripSummary.ch1b.tsx` :

```tsx
import { useTripContext } from '../context/TripContext'
import styles from './TripSummary.ch1b.module.css'

function formatBudget(n: number): string {
  return n.toLocaleString('fr-FR') + '\u00a0€'
}

// Ce composant n'a aucune prop — il lit directement le contexte.
// Point pédagogique : aucune prop trips ne traverse Layout pour arriver ici.
export default function TripSummaryCh1b() {
  const { trips } = useTripContext()
  const total = trips.reduce((sum, t) => sum + t.budget, 0)

  return (
    <div className={styles.summary}>
      <span className={styles.value}>{trips.length}</span>
      <span>
        {trips.length === 1 ? 'voyage' : 'voyages'}
      </span>
      <span className={styles.sep}>•</span>
      <span>Budget total</span>
      <span className={styles.value}>{formatBudget(total)}</span>
    </div>
  )
}
```

- [ ] **Step 3 : Vérifier le build**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur TypeScript.

- [ ] **Step 4 : Commit**

```bash
git add apps/wanderstate/src/components/TripSummary.ch1b.tsx apps/wanderstate/src/components/TripSummary.ch1b.module.css
git commit -m "feat(ch1b): ajouter TripSummary.ch1b (context sans prop drilling)"
```

---

### Task 5 : `ch1b.tsx` — implémentation complète

**Files:**
- Modify: `apps/wanderstate/src/chapters/ch1b.tsx`

- [ ] **Step 1 : Remplacer le stub**

Remplacer le contenu de `apps/wanderstate/src/chapters/ch1b.tsx` par :

```tsx
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
```

- [ ] **Step 2 : Switcher sur ch1b**

```bash
pnpm --filter wanderstate chapter:1b
```

Sortie attendue : `Chapitre actif : 1b`

- [ ] **Step 3 : Vérifier le build sur ch1b**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur TypeScript.

- [ ] **Step 4 : Vérifier le build sur ch1a (régression)**

```bash
pnpm --filter wanderstate chapter:1a && pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur TypeScript. Le barrel exporte `TripCardCh1a` pour ch1a, aucun crash de contexte.

- [ ] **Step 5 : Remettre ch1a comme défaut et commit**

```bash
pnpm --filter wanderstate chapter:1a
git add apps/wanderstate/src/chapters/ch1b.tsx apps/wanderstate/src/current-chapter.ts
git commit -m "feat(ch1b): implementation complete useContext+useReducer"
```
