# Refacto architecture visuel / logique · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Séparer strictement la couche visuelle (composants purs avec props) de la couche logique (chapitres légers avec état), en remplaçant le système barrel/feature-flag par des slots Layout nommés et des callbacks optionnels.

**Architecture:** Composants visuels purement props-driven dans `components/`. Chapitres dans des dossiers (`chapters/ch1a/`, `chapters/ch1b/`). `Layout` devient un assembleur de slots `LayoutHeader` + `LayoutBody` + `LayoutFooter`. L'activation des features visuelles optionnelles se fait par la présence d'un callback (`onDelete?` = bouton visible).

**Tech Stack:** React 19, TypeScript 6, Vite 8, CSS Modules

**Repo :** `C:\Users\Yoann\Sites\talk-react-state` — monorepo pnpm, app dans `apps/wanderstate/src/`

**Pas de tests** (AGENTS.md : "Quick and dirty demo"). Vérification via build TypeScript.

**Build :** `pnpm --filter wanderstate build`

---

## Fichiers — vue d'ensemble

| Fichier | Action |
|---|---|
| `components/LayoutHeader.tsx` + `.module.css` | Créer |
| `components/LayoutBody.tsx` + `.module.css` | Créer |
| `components/LayoutFooter.tsx` + `.module.css` | Créer |
| `components/TripSummary.tsx` + `.module.css` | Créer |
| `components/TripCard.tsx` | Réécrire (barrel → composant unifié + onDelete?) |
| `components/TripCard.module.css` | Modifier (ajouter styles delete) |
| `components/TripList.tsx` | Modifier (+ onDeleteTrip?) |
| `components/TripCard.ch1a.tsx` | Supprimer |
| `components/TripCard.ch1b.tsx` | Supprimer |
| `components/TripCard.ch1b.module.css` | Supprimer |
| `components/TripSummary.ch1b.tsx` | Supprimer |
| `components/TripSummary.ch1b.module.css` | Supprimer |
| `Layout.tsx` | Réécrire (wrapper children uniquement) |
| `Layout.module.css` | Modifier (garder .appWrapper seulement) |
| `context/TripContext.tsx` | Supprimer (déplacé dans chapters/ch1b/) |
| `chapters/ch1a/index.tsx` | Créer |
| `chapters/ch1b/index.tsx` | Créer |
| `chapters/ch1b/TripContext.ts` | Créer (= context/TripContext.tsx déplacé) |
| `chapters/ch2/index.tsx` | Créer (stub migré) |
| `chapters/ch3a/index.tsx` | Créer (stub migré) |
| `chapters/ch3c/index.tsx` | Créer (stub migré) |
| `chapters/ch4b/index.tsx` | Créer (stub migré) |
| `chapters/ch5a/index.tsx` | Créer (stub migré) |
| `chapters/ch1a.tsx` → `ch5a.tsx` | Supprimer (remplacés par les dossiers) |
| `main.tsx` | Inchangé (résolution automatique vers index.tsx) |

---

### Task 1 : Composants Layout slots

**Files:**
- Create: `apps/wanderstate/src/components/LayoutHeader.tsx`
- Create: `apps/wanderstate/src/components/LayoutHeader.module.css`
- Create: `apps/wanderstate/src/components/LayoutBody.tsx`
- Create: `apps/wanderstate/src/components/LayoutBody.module.css`
- Create: `apps/wanderstate/src/components/LayoutFooter.tsx`
- Create: `apps/wanderstate/src/components/LayoutFooter.module.css`

- [ ] **Step 1 : Créer `LayoutHeader.tsx`**

```tsx
import styles from './LayoutHeader.module.css'

interface LayoutHeaderProps {
  chapter: string
}

export default function LayoutHeader({ chapter }: LayoutHeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>WanderState</span>
      <span className={styles.badge}>{chapter}</span>
    </header>
  )
}
```

- [ ] **Step 2 : Créer `LayoutHeader.module.css`**

```css
.header {
  background: var(--color-primary);
  color: var(--color-surface);
  padding: 20px 32px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.badge {
  background: var(--color-accent);
  color: var(--color-surface);
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

- [ ] **Step 3 : Créer `LayoutBody.tsx`**

```tsx
import type { ReactNode } from 'react'
import styles from './LayoutBody.module.css'

interface LayoutBodyProps {
  children: ReactNode
}

export default function LayoutBody({ children }: LayoutBodyProps) {
  return <main className={styles.body}>{children}</main>
}
```

- [ ] **Step 4 : Créer `LayoutBody.module.css`**

```css
.body {
  background: var(--color-surface);
  overflow: hidden;
}
```

- [ ] **Step 5 : Créer `LayoutFooter.tsx`**

```tsx
import type { ReactNode } from 'react'

interface LayoutFooterProps {
  children: ReactNode
}

export default function LayoutFooter({ children }: LayoutFooterProps) {
  return <footer>{children}</footer>
}
```

- [ ] **Step 6 : Créer `LayoutFooter.module.css`**

Fichier vide pour cohérence (LayoutFooter laisse le style à ses enfants) :

```css
/* LayoutFooter ne définit pas de styles — ses enfants gèrent leur propre CSS */
```

- [ ] **Step 7 : Vérifier le build**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur. (Les nouveaux composants ne sont pas encore utilisés — pas de breaking change.)

- [ ] **Step 8 : Commit**

```bash
git add apps/wanderstate/src/components/LayoutHeader.tsx apps/wanderstate/src/components/LayoutHeader.module.css apps/wanderstate/src/components/LayoutBody.tsx apps/wanderstate/src/components/LayoutBody.module.css apps/wanderstate/src/components/LayoutFooter.tsx apps/wanderstate/src/components/LayoutFooter.module.css
git commit -m "feat(layout): ajouter LayoutHeader, LayoutBody, LayoutFooter"
```

---

### Task 2 : TripSummary visuel

**Files:**
- Create: `apps/wanderstate/src/components/TripSummary.tsx`
- Create: `apps/wanderstate/src/components/TripSummary.module.css`

- [ ] **Step 1 : Créer `TripSummary.module.css`**

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

- [ ] **Step 2 : Créer `TripSummary.tsx`**

```tsx
import { formatBudget } from '../utils/format'
import styles from './TripSummary.module.css'

interface TripSummaryProps {
  tripCount: number
  totalBudget: number
}

export default function TripSummary({ tripCount, totalBudget }: TripSummaryProps) {
  return (
    <div className={styles.summary}>
      <span className={styles.value}>{tripCount}</span>
      <span>{tripCount === 1 ? 'voyage' : 'voyages'}</span>
      <span className={styles.sep}>•</span>
      <span>Budget total</span>
      <span className={styles.value}>{formatBudget(totalBudget)}</span>
    </div>
  )
}
```

- [ ] **Step 3 : Vérifier le build**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur.

- [ ] **Step 4 : Commit**

```bash
git add apps/wanderstate/src/components/TripSummary.tsx apps/wanderstate/src/components/TripSummary.module.css
git commit -m "feat: ajouter TripSummary composant visuel (tripCount + totalBudget)"
```

---

### Task 3 : TripCard unifié avec `onDelete` optionnel

**Files:**
- Modify: `apps/wanderstate/src/components/TripCard.tsx` (réécriture complète)
- Modify: `apps/wanderstate/src/components/TripCard.module.css` (+ styles delete)
- Delete: `apps/wanderstate/src/components/TripCard.ch1a.tsx`
- Delete: `apps/wanderstate/src/components/TripCard.ch1b.tsx`
- Delete: `apps/wanderstate/src/components/TripCard.ch1b.module.css`

- [ ] **Step 1 : Réécrire `TripCard.tsx`**

Remplacer le contenu complet de `apps/wanderstate/src/components/TripCard.tsx` par :

```tsx
import { formatBudget } from '../utils/format'
import styles from './TripCard.module.css'
import type { Trip } from '../types'

export interface TripCardProps {
  trip: Trip
  onDelete?: (id: string) => void
}

export default function TripCard({ trip, onDelete }: TripCardProps) {
  return (
    <div>
      <div className={styles.tripCard}>
        <div className={styles.tripCardName}>{trip.name}</div>
        <div className={styles.tripCardDestination}>{trip.destination}</div>
        <div className={styles.tripCardBudget}>{formatBudget(trip.budget)}</div>
      </div>
      {onDelete ? (
        <button
          type="button"
          className={styles.deleteBtn}
          aria-label={`Supprimer ${trip.name}`}
          onClick={() => onDelete(trip.id)}
        >
          Supprimer
        </button>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2 : Ajouter les styles delete dans `TripCard.module.css`**

Ajouter à la fin du fichier existant `apps/wanderstate/src/components/TripCard.module.css` :

```css
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
  box-shadow: none;
}

.deleteBtn:focus-visible {
  outline: none;
  box-shadow: 4px 4px 0 var(--color-accent);
}
```

- [ ] **Step 3 : Supprimer les fichiers obsolètes**

```bash
git rm apps/wanderstate/src/components/TripCard.ch1a.tsx
git rm apps/wanderstate/src/components/TripCard.ch1b.tsx
git rm apps/wanderstate/src/components/TripCard.ch1b.module.css
```

- [ ] **Step 4 : Vérifier le build**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur. TripList importe encore `./TripCard` — fonctionne car l'export default est maintenu.

- [ ] **Step 5 : Commit**

```bash
git add apps/wanderstate/src/components/TripCard.tsx apps/wanderstate/src/components/TripCard.module.css
git commit -m "refactor(TripCard): composant unifié avec onDelete optionnel, suppression barrel"
```

---

### Task 4 : TripList avec `onDeleteTrip` optionnel

**Files:**
- Modify: `apps/wanderstate/src/components/TripList.tsx`

- [ ] **Step 1 : Mettre à jour `TripList.tsx`**

Remplacer le contenu de `apps/wanderstate/src/components/TripList.tsx` par :

```tsx
import type { Trip } from '../types'
import TripCard from './TripCard'
import styles from './TripList.module.css'

interface TripListProps {
  trips: Trip[]
  onDeleteTrip?: (id: string) => void
}

export default function TripList({ trips, onDeleteTrip }: TripListProps) {
  return (
    <section className={styles.listSection}>
      <h2 className={styles.sectionTitle}>
        Mes voyages
        <span className={styles.tripsCount}>{trips.length}</span>
      </h2>

      {trips.length === 0 ? (
        <div className={styles.emptyState}>
          <strong>Aucun voyage pour l'instant</strong>
          Crée ton premier voyage ci-dessus.
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={onDeleteTrip}
            />
          ))}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 2 : Vérifier le build**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur.

- [ ] **Step 3 : Commit**

```bash
git add apps/wanderstate/src/components/TripList.tsx
git commit -m "feat(TripList): ajouter onDeleteTrip optionnel"
```

---

### Task 5 : Migration des chapitres + refacto Layout + nettoyage

C'est la tâche d'intégration. Elle crée toutes les nouvelles structures, met à jour Layout.tsx, et supprime tous les anciens fichiers en une seule opération atomique pour conserver un build valide.

**Files:**
- Create: `apps/wanderstate/src/chapters/ch1a/index.tsx`
- Create: `apps/wanderstate/src/chapters/ch1b/index.tsx`
- Create: `apps/wanderstate/src/chapters/ch1b/TripContext.ts`
- Create: `apps/wanderstate/src/chapters/ch2/index.tsx`
- Create: `apps/wanderstate/src/chapters/ch3a/index.tsx`
- Create: `apps/wanderstate/src/chapters/ch3c/index.tsx`
- Create: `apps/wanderstate/src/chapters/ch4b/index.tsx`
- Create: `apps/wanderstate/src/chapters/ch5a/index.tsx`
- Modify: `apps/wanderstate/src/Layout.tsx`
- Modify: `apps/wanderstate/src/Layout.module.css`
- Delete: `apps/wanderstate/src/chapters/ch1a.tsx`
- Delete: `apps/wanderstate/src/chapters/ch1b.tsx`
- Delete: `apps/wanderstate/src/chapters/ch2.tsx`
- Delete: `apps/wanderstate/src/chapters/ch3a.tsx`
- Delete: `apps/wanderstate/src/chapters/ch3c.tsx`
- Delete: `apps/wanderstate/src/chapters/ch4b.tsx`
- Delete: `apps/wanderstate/src/chapters/ch5a.tsx`
- Delete: `apps/wanderstate/src/context/TripContext.tsx`
- Delete: `apps/wanderstate/src/components/TripSummary.ch1b.tsx`
- Delete: `apps/wanderstate/src/components/TripSummary.ch1b.module.css`

- [ ] **Step 1 : Créer `chapters/ch1a/index.tsx`**

```tsx
import { useState } from 'react'
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'
import type { Trip } from '../../types'

export function Ch1aApp() {
  const [trips, setTrips] = useState<Trip[]>([])
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 1a · useState" />
      <LayoutBody>
        <TripForm onAddTrip={(t) => setTrips((p) => [...p, t])} />
        <TripList trips={trips} />
      </LayoutBody>
    </Layout>
  )
}
```

- [ ] **Step 2 : Créer `chapters/ch1b/TripContext.ts`**

```ts
import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import type { Trip } from '../../types'

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
```

- [ ] **Step 3 : Créer `chapters/ch1b/index.tsx`**

```tsx
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
```

- [ ] **Step 4 : Créer les stubs migrés (ch2 → ch5a)**

Créer `apps/wanderstate/src/chapters/ch2/index.tsx` :

```tsx
// Ch. 2 — nuqs (URL state)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'

export function Ch2App() {
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 2 · nuqs" />
      <LayoutBody>
        <TripForm onAddTrip={() => {}} />
        <TripList trips={[]} />
      </LayoutBody>
    </Layout>
  )
}
```

Créer `apps/wanderstate/src/chapters/ch3a/index.tsx` :

```tsx
// Ch. 3a — TanStack Query (state réseau)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'

export function Ch3aApp() {
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 3a · TanStack Query" />
      <LayoutBody>
        <TripForm onAddTrip={() => {}} />
        <TripList trips={[]} />
      </LayoutBody>
    </Layout>
  )
}
```

Créer `apps/wanderstate/src/chapters/ch3c/index.tsx` :

```tsx
// Ch. 3c — Convex (temps réel)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'

export function Ch3cApp() {
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 3c · Convex" />
      <LayoutBody>
        <TripForm onAddTrip={() => {}} />
        <TripList trips={[]} />
      </LayoutBody>
    </Layout>
  )
}
```

Créer `apps/wanderstate/src/chapters/ch4b/index.tsx` :

```tsx
// Ch. 4b — Zustand (store global)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'

export function Ch4bApp() {
  return (
    <Layout>
      <LayoutHeader chapter="Ch. 4b · Zustand" />
      <LayoutBody>
        <TripForm onAddTrip={() => {}} />
        <TripList trips={[]} />
      </LayoutBody>
    </Layout>
  )
}
```

Créer `apps/wanderstate/src/chapters/ch5a/index.tsx` :

```tsx
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
```

- [ ] **Step 5 : Réécrire `Layout.tsx`**

Remplacer le contenu complet de `apps/wanderstate/src/Layout.tsx` par :

```tsx
import type { ReactNode } from 'react'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return <div className={styles.appWrapper}>{children}</div>
}
```

- [ ] **Step 6 : Simplifier `Layout.module.css`**

Remplacer le contenu de `apps/wanderstate/src/Layout.module.css` par :

```css
.appWrapper {
  max-width: 1000px;
  margin: 0 auto;
  border: 3px solid var(--color-primary);
  box-shadow: 6px 6px 0 var(--color-primary);
}
```

- [ ] **Step 7 : Supprimer les anciens fichiers**

```bash
git rm apps/wanderstate/src/chapters/ch1a.tsx
git rm apps/wanderstate/src/chapters/ch1b.tsx
git rm apps/wanderstate/src/chapters/ch2.tsx
git rm apps/wanderstate/src/chapters/ch3a.tsx
git rm apps/wanderstate/src/chapters/ch3c.tsx
git rm apps/wanderstate/src/chapters/ch4b.tsx
git rm apps/wanderstate/src/chapters/ch5a.tsx
git rm apps/wanderstate/src/context/TripContext.tsx
git rm apps/wanderstate/src/components/TripSummary.ch1b.tsx
git rm apps/wanderstate/src/components/TripSummary.ch1b.module.css
```

- [ ] **Step 8 : Vérifier le build sur ch1a**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur. `main.tsx` résout `./chapters/ch1a` vers `./chapters/ch1a/index.tsx` automatiquement.

- [ ] **Step 9 : Vérifier le build sur ch1b**

```bash
pnpm --filter wanderstate chapter:1b && pnpm --filter wanderstate build
```

Sortie attendue : `✓ built in ...ms` sans erreur.

- [ ] **Step 10 : Remettre ch1a par défaut et commiter**

```bash
pnpm --filter wanderstate chapter:1a
git add apps/wanderstate/src/
git commit -m "refactor: migration chapitres en dossiers, Layout slots, visuel/logique séparés"
```
