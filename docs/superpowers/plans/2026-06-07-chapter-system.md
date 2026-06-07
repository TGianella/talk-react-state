# Système de chapitres WanderState — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en place un système de feature-flipping par chapitre permettant de switcher entre 7 démos live (useState → XState) via `pnpm chapter:1b`, sans git et sans dupliquer le CSS.

**Architecture:** Un fichier `current-chapter.ts` contient `CURRENT_CHAPTER = '1a'`. Le script `set-chapter.mjs` le réécrit. `main.tsx` importe tous les `App` de chapitre et en rend un selon cette constante. Chaque `chapters/ch*.tsx` est un delta minimal (~15–30 lignes) qui gère providers + state + badge et rend le shell stable `Layout.tsx`.

**Tech Stack:** Vite 5 + React 18 + TypeScript 5 + pnpm monorepo

**Référence spec :** `docs/superpowers/specs/2026-06-07-chapter-system-design.md`

> **Pas de tests** — app de démo pédagogique (voir `apps/wanderstate/AGENTS.md`)

---

## Carte des fichiers

| Action | Fichier |
|---|---|
| Créer | `scripts/set-chapter.mjs` |
| Créer | `apps/wanderstate/src/current-chapter.ts` |
| Modifier | `apps/wanderstate/package.json` |
| Créer | `apps/wanderstate/src/Layout.tsx` |
| Créer | `apps/wanderstate/src/Layout.module.css` |
| Modifier | `apps/wanderstate/src/components/TripForm.tsx` (export interface) |
| Créer | `apps/wanderstate/src/chapters/ch1a.tsx` |
| Créer | `apps/wanderstate/src/chapters/ch1b.tsx` (stub) |
| Créer | `apps/wanderstate/src/chapters/ch2.tsx` (stub) |
| Créer | `apps/wanderstate/src/chapters/ch3a.tsx` (stub) |
| Créer | `apps/wanderstate/src/chapters/ch3c.tsx` (stub) |
| Créer | `apps/wanderstate/src/chapters/ch4b.tsx` (stub) |
| Créer | `apps/wanderstate/src/chapters/ch5a.tsx` (stub) |
| Modifier | `apps/wanderstate/src/main.tsx` |
| Supprimer | `apps/wanderstate/src/App.tsx` |
| Supprimer | `apps/wanderstate/src/App.module.css` |

---

## Task 1 — Script `set-chapter.mjs` + `current-chapter.ts`

**Fichiers :**
- Créer : `scripts/set-chapter.mjs`
- Créer : `apps/wanderstate/src/current-chapter.ts`

- [ ] **Créer `scripts/set-chapter.mjs`** à la racine du monorepo

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
console.log(`✓ Chapitre actif : ${chapter}`)
```

- [ ] **Créer `apps/wanderstate/src/current-chapter.ts`**

```ts
// Ce fichier est écrit par scripts/set-chapter.mjs — ne pas éditer manuellement
export const CURRENT_CHAPTER = '1a' as const
```

- [ ] **Vérifier le script manuellement depuis la racine du monorepo**

```bash
node scripts/set-chapter.mjs 1b
```

Sortie attendue : `✓ Chapitre actif : 1b`
Vérifier que `apps/wanderstate/src/current-chapter.ts` contient maintenant `'1b'`.

- [ ] **Remettre à `1a`**

```bash
node scripts/set-chapter.mjs 1a
```

- [ ] **Commit**

```bash
git add scripts/set-chapter.mjs apps/wanderstate/src/current-chapter.ts
git commit -m "feat(chapter-system): add current-chapter.ts and set-chapter.mjs script"
```

---

## Task 2 — Scripts `package.json`

**Fichiers :**
- Modifier : `apps/wanderstate/package.json`

- [ ] **Ajouter les scripts chapter:* dans `apps/wanderstate/package.json`**

```json
{
  "name": "wanderstate",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "chapter:1a":  "node ../../scripts/set-chapter.mjs 1a",
    "chapter:1b":  "node ../../scripts/set-chapter.mjs 1b",
    "chapter:2":   "node ../../scripts/set-chapter.mjs 2",
    "chapter:3a":  "node ../../scripts/set-chapter.mjs 3a",
    "chapter:3c":  "node ../../scripts/set-chapter.mjs 3c",
    "chapter:4b":  "node ../../scripts/set-chapter.mjs 4b",
    "chapter:5a":  "node ../../scripts/set-chapter.mjs 5a"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "typescript": "~5.6.2",
    "vite": "^5.4.10"
  }
}
```

- [ ] **Vérifier depuis `apps/wanderstate/`**

```bash
pnpm chapter:1b
```

Sortie attendue : `✓ Chapitre actif : 1b`

- [ ] **Remettre à `1a`**

```bash
pnpm chapter:1a
```

- [ ] **Commit**

```bash
git add apps/wanderstate/package.json
git commit -m "feat(chapter-system): add pnpm chapter:* scripts"
```

---

## Task 3 — `Layout.tsx` + `Layout.module.css`

**Fichiers :**
- Créer : `apps/wanderstate/src/Layout.tsx`
- Créer : `apps/wanderstate/src/Layout.module.css`
- Modifier : `apps/wanderstate/src/components/TripForm.tsx` (exporter l'interface)

Le CSS de `Layout.module.css` est identique à `App.module.css` existant (il sera supprimé en Task 6 quand `App.tsx` sera retiré).

- [ ] **Créer `apps/wanderstate/src/Layout.module.css`**

```css
.appWrapper {
  max-width: 1000px;
  margin: 0 auto;
  border: 3px solid var(--color-primary);
  box-shadow: 6px 6px 0 var(--color-primary);
}

.topbar {
  background: var(--color-primary);
  color: var(--color-surface);
  padding: 20px 32px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.topbarLogo {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.topbarBadge {
  background: var(--color-accent);
  color: var(--color-surface);
  font-size: 0.72rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.topbarSub {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-left: auto;
}

.appFrame {
  background: var(--color-surface);
  overflow: hidden;
}
```

- [ ] **Exporter `TripFormProps` depuis `apps/wanderstate/src/components/TripForm.tsx`**

Changer la ligne :
```tsx
interface TripFormProps {
```
en :
```tsx
export interface TripFormProps {
```

- [ ] **Créer `apps/wanderstate/src/Layout.tsx`**

```tsx
import type { ComponentType, ReactNode } from 'react'
import type { Trip } from './types'
import type { TripFormProps } from './components/TripForm'
import TripFormDefault from './components/TripForm'
import TripList from './components/TripList'
import styles from './Layout.module.css'

interface LayoutProps {
  trips: Trip[]
  onAddTrip: (trip: Trip) => void
  badge: string
  subtitle: string
  TripFormOverride?: ComponentType<TripFormProps>
  children?: ReactNode
}

export default function Layout({
  trips,
  onAddTrip,
  badge,
  subtitle,
  TripFormOverride,
  children,
}: LayoutProps) {
  const TripForm = TripFormOverride ?? TripFormDefault

  return (
    <div className={styles.appWrapper}>
      <header className={styles.topbar}>
        <span className={styles.topbarLogo}>WanderState</span>
        <span className={styles.topbarBadge}>{badge}</span>
        <span className={styles.topbarSub}>{subtitle}</span>
      </header>
      <main className={styles.appFrame}>
        <TripForm onAddTrip={onAddTrip} />
        <TripList trips={trips} />
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Vérifier que le build TypeScript passe** (sans changer main.tsx, `App.tsx` est toujours actif)

```bash
pnpm --filter wanderstate build
```

Attendu : build sans erreur.

- [ ] **Commit**

```bash
git add apps/wanderstate/src/Layout.tsx apps/wanderstate/src/Layout.module.css apps/wanderstate/src/components/TripForm.tsx
git commit -m "feat(chapter-system): add Layout.tsx shell and Layout.module.css"
```

---

## Task 4 — `chapters/ch1a.tsx`

**Fichiers :**
- Créer : `apps/wanderstate/src/chapters/ch1a.tsx`

Ce fichier reprend uniquement la logique `useState` qui était dans `App.tsx`.

- [ ] **Créer `apps/wanderstate/src/chapters/ch1a.tsx`**

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

- [ ] **Commit**

```bash
git add apps/wanderstate/src/chapters/ch1a.tsx
git commit -m "feat(chapter-system): add ch1a.tsx (useState)"
```

---

## Task 5 — Stubs ch1b → ch5a

**Fichiers :**
- Créer : `apps/wanderstate/src/chapters/ch1b.tsx`
- Créer : `apps/wanderstate/src/chapters/ch2.tsx`
- Créer : `apps/wanderstate/src/chapters/ch3a.tsx`
- Créer : `apps/wanderstate/src/chapters/ch3c.tsx`
- Créer : `apps/wanderstate/src/chapters/ch4b.tsx`
- Créer : `apps/wanderstate/src/chapters/ch5a.tsx`

Chaque stub est autonome, compile sans dépendances manquantes, et rend un Layout vide avec le badge du chapitre.

- [ ] **Créer `apps/wanderstate/src/chapters/ch1b.tsx`**

```tsx
// Ch. 1b — useContext + useReducer
// Stub — sera implémenté dans une spec dédiée
import Layout from '../Layout'

export function Ch1bApp() {
  return (
    <Layout
      trips={[]}
      onAddTrip={() => {}}
      badge="useContext + useReducer"
      subtitle="Ch. 1b · Contexte partagé — à venir"
    />
  )
}
```

- [ ] **Créer `apps/wanderstate/src/chapters/ch2.tsx`**

```tsx
// Ch. 2 — nuqs (URL state)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../Layout'

export function Ch2App() {
  return (
    <Layout
      trips={[]}
      onAddTrip={() => {}}
      badge="nuqs"
      subtitle="Ch. 2 · State URL — à venir"
    />
  )
}
```

- [ ] **Créer `apps/wanderstate/src/chapters/ch3a.tsx`**

```tsx
// Ch. 3a — TanStack Query
// Stub — sera implémenté dans une spec dédiée
import Layout from '../Layout'

export function Ch3aApp() {
  return (
    <Layout
      trips={[]}
      onAddTrip={() => {}}
      badge="TanStack Query"
      subtitle="Ch. 3a · State réseau — à venir"
    />
  )
}
```

- [ ] **Créer `apps/wanderstate/src/chapters/ch3c.tsx`**

```tsx
// Ch. 3c — Convex (temps réel)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../Layout'

export function Ch3cApp() {
  return (
    <Layout
      trips={[]}
      onAddTrip={() => {}}
      badge="Convex"
      subtitle="Ch. 3c · Temps réel — à venir"
    />
  )
}
```

- [ ] **Créer `apps/wanderstate/src/chapters/ch4b.tsx`**

```tsx
// Ch. 4b — Zustand
// Stub — sera implémenté dans une spec dédiée
import Layout from '../Layout'

export function Ch4bApp() {
  return (
    <Layout
      trips={[]}
      onAddTrip={() => {}}
      badge="Zustand"
      subtitle="Ch. 4b · Store global — à venir"
    />
  )
}
```

- [ ] **Créer `apps/wanderstate/src/chapters/ch5a.tsx`**

```tsx
// Ch. 5a — XState (wizard multi-étapes)
// Stub — sera implémenté dans une spec dédiée
import Layout from '../Layout'

export function Ch5aApp() {
  return (
    <Layout
      trips={[]}
      onAddTrip={() => {}}
      badge="XState"
      subtitle="Ch. 5a · Machine d'états — à venir"
    />
  )
}
```

- [ ] **Commit**

```bash
git add apps/wanderstate/src/chapters/
git commit -m "feat(chapter-system): add stubs for ch1b through ch5a"
```

---

## Task 6 — `main.tsx` chapter-aware + suppression de `App.tsx`

**Fichiers :**
- Modifier : `apps/wanderstate/src/main.tsx`
- Supprimer : `apps/wanderstate/src/App.tsx`
- Supprimer : `apps/wanderstate/src/App.module.css`

- [ ] **Remplacer `apps/wanderstate/src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CURRENT_CHAPTER } from './current-chapter'
import { Ch1aApp }  from './chapters/ch1a'
import { Ch1bApp }  from './chapters/ch1b'
import { Ch2App }   from './chapters/ch2'
import { Ch3aApp }  from './chapters/ch3a'
import { Ch3cApp }  from './chapters/ch3c'
import { Ch4bApp }  from './chapters/ch4b'
import { Ch5aApp }  from './chapters/ch5a'
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

const CurrentApp = apps[CURRENT_CHAPTER]

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CurrentApp />
  </StrictMode>,
)
```

- [ ] **Supprimer `App.tsx` et `App.module.css`**

Sur Windows (PowerShell) :
```powershell
Remove-Item apps/wanderstate/src/App.tsx
Remove-Item apps/wanderstate/src/App.module.css
```

Sur macOS/Linux :
```bash
rm apps/wanderstate/src/App.tsx apps/wanderstate/src/App.module.css
```

- [ ] **Vérifier que le build passe**

```bash
pnpm --filter wanderstate build
```

Attendu : build sans erreur TypeScript, aucune référence à `App.tsx` ou `App.module.css`.

- [ ] **Démarrer le dev server et vérifier ch1a dans le navigateur**

```bash
pnpm --filter wanderstate dev
```

Ouvrir `http://localhost:5173`. Attendu :
- Topbar affiche badge `useState` et subtitle `Ch. 1a · State local`
- Formulaire fonctionnel (créer un voyage → apparaît dans la liste)

- [ ] **Vérifier le switch vers un stub**

Dans un second terminal :
```bash
pnpm --filter wanderstate chapter:1b
```

Attendu : Vite reload automatique, badge change en `useContext + useReducer`, liste vide (stub).

- [ ] **Revenir à ch1a et vérifier que l'app est toujours fonctionnelle**

```bash
pnpm --filter wanderstate chapter:1a
```

- [ ] **Commit final**

```bash
git add apps/wanderstate/src/main.tsx
git rm apps/wanderstate/src/App.tsx apps/wanderstate/src/App.module.css
git commit -m "feat(chapter-system): wire main.tsx to chapter registry, remove App.tsx"
```
