# WanderState — Système de chapitres · Design Spec

**Conférence :** State Management React — Deep Dive (3h)
**Date :** 2026-06-07

---

## Problème

La conférence comporte 7 démonstrations live. Chaque démo montre l'app WanderState dans un état différent (useState → useContext → nuqs → TanStack Query → Convex → Zustand → XState). Objectifs :

- Passer d'un chapitre à l'autre **sans manipuler git**
- Montrer le **code + l'app** en même temps sur vidéoprojecteur
- Les parties stables (CSS, composants UI) ne sont **jamais dupliquées**
- Chaque fichier de chapitre ne contient que le **delta** — uniquement ce qui change

---

## Principe directeur

**Séparation UI / logique :**

- Les composants UI (JSX + CSS) sont des shells stables qui reçoivent des props — ils ne bougent pas entre chapitres
- Les fichiers de chapitre (`chapters/ch*.tsx`) contiennent uniquement la logique qui change : providers, hooks de state, badge de topbar
- `main.tsx` charge directement le bon composant App selon `CURRENT_CHAPTER`
- Aucun fichier registry intermédiaire — trop d'indirection pour trop peu de valeur

---

## Chapitres démo

| ID | Technologie | Delta principal |
|---|---|---|
| `1a` | `useState` | state local dans App |
| `1b` | `useContext + useReducer` | TripContextProvider + dispatch |
| `2` | `nuqs` | NuqsAdapter + URL params |
| `3a` | `TanStack Query` | QueryClientProvider + useQuery/useMutation |
| `3c` | `Convex` | ConvexProvider + hooks temps réel |
| `4b` | `Zustand` | useTripStore, plus de provider |
| `5a` | `XState` | TripFormWizard (override UI form) + machine |

Chapitres théorie seule (3b Apollo, 4a Redux, 5b Jotai+MobX) — pas de delta app.

---

## Architecture

### Structure de fichiers

```
apps/wanderstate/src/

  # Infrastructure de chapitre
  current-chapter.ts          ← export const CURRENT_CHAPTER = '1a'
  main.tsx                    ← importe tous les App, condition inline

  chapters/
    ch1a.tsx                  ← ~15 lignes
    ch1b.tsx                  ← ~25 lignes
    ch2.tsx                   ← ~25 lignes
    ch3a.tsx                  ← ~30 lignes
    ch3c.tsx                  ← ~20 lignes
    ch4b.tsx                  ← ~20 lignes
    ch5a.tsx                  ← ~30 lignes

  # UI stables — ne bougent jamais entre chapitres
  Layout.tsx                  ← topbar + frame + <TripForm> + <TripList> + slot children
  Layout.module.css
  components/
    TripForm.tsx              ← fields locaux (name, destination, budget), reçoit onAddTrip
    TripForm.module.css       ← partagé par TripForm.tsx et TripFormWizard.tsx
    TripFormWizard.tsx        ← ch5a uniquement, wizard XState multi-étapes
    TripList.tsx
    TripList.module.css
    TripCard.tsx
    TripCard.module.css

  # Fichiers support référencés depuis les chapitres
  context/
    TripContext.tsx            ← ch1b+
  store/
    tripStore.ts               ← ch4b (Zustand)
  machines/
    tripMachine.ts             ← ch5a (XState)

  # Globaux — jamais feature-flippés
  index.css                   ← variables CSS + reset
  types.ts                    ← interfaces Trip, TripStep
  vite-env.d.ts

scripts/
  set-chapter.mjs             ← écrit current-chapter.ts
```

---

## Flux de switching

```
pnpm chapter:1b
  → scripts/set-chapter.mjs écrit :
      export const CURRENT_CHAPTER = '1b'
    → Vite détecte le changement → reload
      → main.tsx charge Ch1bApp
```

`current-chapter.ts` est commité avec `'1a'` comme valeur par défaut.

---

## Fichiers clés

### `current-chapter.ts`

```ts
// Ce fichier est écrit par scripts/set-chapter.mjs
// Valeur par défaut : '1a'
export const CURRENT_CHAPTER = '1a' as const
```

### `main.tsx`

```tsx
import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { CURRENT_CHAPTER } from './current-chapter'
import { Ch1aApp } from './chapters/ch1a'
import { Ch1bApp } from './chapters/ch1b'
import { Ch2App }  from './chapters/ch2'
import { Ch3aApp } from './chapters/ch3a'
import { Ch3cApp } from './chapters/ch3c'
import { Ch4bApp } from './chapters/ch4b'
import { Ch5aApp } from './chapters/ch5a'
import './index.css'

const apps = {
  '1a': Ch1aApp,
  '1b': Ch1bApp,
  '2':  Ch2App,
  '3a': Ch3aApp,
  '3c': Ch3cApp,
  '4b': Ch4bApp,
  '5a': Ch5aApp,
} as const

createRoot(document.getElementById('root')!).render(
  <StrictMode>{createElement(apps[CURRENT_CHAPTER])}</StrictMode>
)
```

### `chapters/ch1a.tsx` (~15 lignes)

```tsx
import { useState } from 'react'
import Layout from '../Layout'
import type { Trip } from '../types'

export function Ch1aApp() {
  const [trips, setTrips] = useState<Trip[]>([])

  return (
    <Layout
      trips={trips}
      onAddTrip={(trip) => setTrips((prev) => [...prev, trip])}
      badge="useState"
      subtitle="Ch. 1a · State local"
    />
  )
}
```

### `chapters/ch1b.tsx` (~25 lignes)

```tsx
import { TripContextProvider, useTripContext } from '../context/TripContext'
import Layout from '../Layout'

// Commentaire de chapitre :
// Ch. 1b — useContext + useReducer
// TripForm : inchangé (reçoit toujours onAddTrip en prop)
// Provider : TripContextProvider

function Ch1bInner() {
  const { trips, dispatch } = useTripContext()
  return (
    <Layout
      trips={trips}
      onAddTrip={(trip) => dispatch({ type: 'ADD_TRIP', payload: trip })}
      badge="useContext + useReducer"
      subtitle="Ch. 1b · Contexte partagé"
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

### `Layout.tsx` (stable)

```tsx
interface LayoutProps {
  trips: Trip[]
  onAddTrip: (trip: Trip) => void
  badge: string
  subtitle: string
  TripFormOverride?: ComponentType<TripFormProps>  // ch5a uniquement
  children?: ReactNode                              // features ajoutées par chapitre
}
```

`TripFormOverride` permet à ch5a de substituer `TripFormWizard` sans modifier `Layout.tsx`.
`children` permet aux chapitres qui ajoutent des composants (ex. `TripDetail` en ch1b) de les injecter.

---

## Règles CSS

| Fichier | Règle |
|---|---|
| `index.css` | Variables + reset — **jamais** dupliqué ni feature-flippé |
| `*.module.css` | Colocalisé avec son composant UI stable — **jamais** dupliqué |
| `chapters/ch*.tsx` | N'importe **aucun** CSS directement |
| Couleurs | Toujours via variables CSS — zéro hex en dur hors `:root` |

---

## Scripts `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "chapter:1a":  "node ../../scripts/set-chapter.mjs 1a",
    "chapter:1b":  "node ../../scripts/set-chapter.mjs 1b",
    "chapter:2":   "node ../../scripts/set-chapter.mjs 2",
    "chapter:3a":  "node ../../scripts/set-chapter.mjs 3a",
    "chapter:3c":  "node ../../scripts/set-chapter.mjs 3c",
    "chapter:4b":  "node ../../scripts/set-chapter.mjs 4b",
    "chapter:5a":  "node ../../scripts/set-chapter.mjs 5a"
  }
}
```

### `scripts/set-chapter.mjs`

```js
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const chapter = process.argv[2]

if (!chapter) {
  console.error('Usage: node set-chapter.mjs <chapter-id>')
  process.exit(1)
}

const valid = ['1a', '1b', '2', '3a', '3c', '4b', '5a']
if (!valid.includes(chapter)) {
  console.error(`Chapitre invalide. Valeurs acceptées : ${valid.join(', ')}`)
  process.exit(1)
}

const content = `// Ce fichier est écrit par scripts/set-chapter.mjs — ne pas éditer manuellement
export const CURRENT_CHAPTER = '${chapter}' as const
`

const dest = resolve(__dirname, '../apps/wanderstate/src/current-chapter.ts')
writeFileSync(dest, content, 'utf-8')
console.log(`Chapitre actif : ${chapter}`)
```

---

## Ce qui est hors scope

- Transition animée entre chapitres
- Indicateur visuel du chapitre actif dans l'app (le badge dans la topbar suffit)
- Lazy loading des App par chapitre (bundle size non critique pour une démo)
- Migration des chapitres 3a/3c/4b/5a (dépendent de leurs propres specs à venir)
