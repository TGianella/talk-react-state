# Refacto architecture — séparation visuel / logique · Design Spec

Date : 2026-06-07

---

## Problème

L'implémentation de ch1b a introduit un système de barrel files + feature flags
(`TripCard.tsx` sélectionnant `TripCard.ch1a` ou `TripCard.ch1b` selon
`CURRENT_CHAPTER`) qui devient complexe dès les premières déclinaisons. Le
contexte React était consommé directement dans des composants visuels
(`TripCardCh1b`, `TripSummaryCh1b`), couplant la couche visuelle à la logique
d'état.

---

## Principe directeur

**Séparation stricte visuel / logique :**

- Les composants visuels (`components/`) sont de purs composants de présentation :
  props pour les données, callbacks pour les actions, styles CSS colocalisés.
  Aucun accès à un contexte ou un store.
- L'activation d'une feature visuelle optionnelle se fait par la **présence d'un
  callback** : `onDeleteTrip` défini → bouton supprimer visible.
- Les fichiers de chapitre (`chapters/`) contiennent uniquement la logique qui
  change : gestion d'état, providers, calculs dérivés. Rien de visuel.
- Un **dossier par chapitre** : `chapters/ch1a/`, `chapters/ch1b/`, etc.
- `Layout` devient un assembleur de **slots nommés** (LayoutHeader, LayoutBody,
  LayoutFooter). Chaque chapitre compose ce qu'il veut dans chaque slot.

---

## Structure cible

```
apps/wanderstate/src/

  # Couche visuelle — jamais modifiée entre chapitres
  components/
    Layout.tsx              ← wrapper global (appWrapper CSS)
    Layout.module.css
    LayoutHeader.tsx        ← topbar : logo WanderState + badge chapter
    LayoutHeader.module.css
    LayoutBody.tsx          ← zone centrale (children)
    LayoutBody.module.css
    LayoutFooter.tsx        ← zone optionnelle bas de page (children)
    LayoutFooter.module.css
    TripForm.tsx            ← inchangé
    TripForm.module.css
    TripList.tsx            ← + onDeleteTrip?: (id: string) => void
    TripList.module.css
    TripCard.tsx            ← + onDelete?: (id: string) => void
    TripCard.module.css
    TripSummary.tsx         ← NEW : tripCount + totalBudget (pur visuel)
    TripSummary.module.css

  # Couche logique — un dossier par chapitre
  chapters/
    ch1a/
      index.tsx             ← ~12 lignes, useState
    ch1b/
      index.tsx             ← ~25 lignes, useContext + useReducer
      TripContext.ts        ← reducer + provider + hook

  # Fichiers support partagés
  utils/
    format.ts               ← formatBudget

  # Infrastructure
  current-chapter.ts
  main.tsx
  index.css
  types.ts
  vite-env.d.ts
```

---

## Composants visuels en détail

### `Layout.tsx`

Wrapper global uniquement. Accepte `children`.

```tsx
interface LayoutProps {
  children: ReactNode
}
```

### `LayoutHeader.tsx`

Topbar avec logo + badge chapitre.

```tsx
interface LayoutHeaderProps {
  chapter: string
}
```

### `LayoutBody.tsx`

Zone principale. Accepte `children`.

```tsx
interface LayoutBodyProps {
  children: ReactNode
}
```

### `LayoutFooter.tsx`

Zone optionnelle bas de page. Accepte `children`.

```tsx
interface LayoutFooterProps {
  children: ReactNode
}
```

### `TripCard.tsx`

Carte d'un voyage. `onDelete` optionnel : présent → bouton "Supprimer" visible.

```tsx
interface TripCardProps {
  trip: Trip
  onDelete?: (id: string) => void
}
```

### `TripList.tsx`

Liste de voyages. `onDeleteTrip` optionnel, transmis à chaque `TripCard`.

```tsx
interface TripListProps {
  trips: Trip[]
  onDeleteTrip?: (id: string) => void
}
```

### `TripSummary.tsx`

Encart résumé. Reçoit les valeurs calculées — aucun accès au contexte.

```tsx
interface TripSummaryProps {
  tripCount: number
  totalBudget: number
}
```

---

## Chapitres en détail

### `chapters/ch1a/index.tsx`

```tsx
import { useState } from 'react'
import Layout from '../../components/Layout'
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

### `chapters/ch1b/TripContext.ts`

Identique à l'actuel `context/TripContext.tsx` — reducer, provider, hook.

### `chapters/ch1b/index.tsx`

```tsx
import { TripContextProvider, useTripContext } from './TripContext'
import Layout from '../../components/Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import LayoutFooter from '../../components/LayoutFooter'
import TripForm from '../../components/TripForm'
import TripList from '../../components/TripList'
import TripSummary from '../../components/TripSummary'

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

---

## Migrations et suppressions

### Fichiers supprimés

| Fichier | Raison |
|---|---|
| `components/TripCard.ch1a.tsx` | Remplacé par `TripCard.tsx` unifié |
| `components/TripCard.ch1b.tsx` | Logique delete → props sur TripCard |
| `components/TripCard.ch1b.module.css` | Styles delete → dans TripCard.module.css |
| `components/TripSummary.ch1b.tsx` | Remplacé par `TripSummary.tsx` (props) |
| `components/TripSummary.ch1b.module.css` | Remplacé par `TripSummary.module.css` |
| `context/TripContext.tsx` | Déplacé dans `chapters/ch1b/TripContext.ts` |

### Fichiers déplacés / renommés

| Avant | Après |
|---|---|
| `context/TripContext.tsx` | `chapters/ch1b/TripContext.ts` |
| `chapters/ch1a.tsx` | `chapters/ch1a/index.tsx` |
| `chapters/ch1b.tsx` | `chapters/ch1b/index.tsx` |
| `chapters/ch2.tsx` | `chapters/ch2/index.tsx` |
| `chapters/ch3a.tsx` | `chapters/ch3a/index.tsx` |
| `chapters/ch3c.tsx` | `chapters/ch3c/index.tsx` |
| `chapters/ch4b.tsx` | `chapters/ch4b/index.tsx` |
| `chapters/ch5a.tsx` | `chapters/ch5a/index.tsx` |

### Fichiers modifiés

| Fichier | Delta |
|---|---|
| `components/TripCard.tsx` | Revient à une implémentation unique + `onDelete?` optionnel |
| `components/TripList.tsx` | + `onDeleteTrip?` passé à TripCard |
| `Layout.tsx` | Devient le wrapper global (`children` uniquement) |
| `main.tsx` | Imports mis à jour vers `chapters/chXx/index` |

### Fichiers inchangés

- `TripForm.tsx`, `TripForm.module.css`
- `TripCard.module.css` (enrichi du style delete)
- `utils/format.ts`
- `types.ts`, `current-chapter.ts`, `index.css`
- `scripts/set-chapter.mjs`

---

## CSS du bouton Supprimer (dans `TripCard.module.css`)

Le style delete rejoint le CSS de TripCard, séparé en classes dédiées.
Contraintes AGENTS.md : variables CSS uniquement, pas de `border-radius` +
`box-shadow` combinés, hover anime uniquement la taille de l'ombre,
`focus-visible` géré.

---

## Non-scope

- Modifier les stubs ch2 → ch5a (juste déplacer dans un dossier, contenu inchangé)
- Animation de suppression
- Confirmation avant suppression
