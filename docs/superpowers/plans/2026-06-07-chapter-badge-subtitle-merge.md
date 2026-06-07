# Chapter badge + subtitle merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer les props `badge` et `subtitle` de `Layout` par un seul prop `chapter` qui combine les deux informations.

**Architecture:** Changement de signature de `Layout` + mise à jour de tous les consommateurs. Pas de test (projet sans test — voir AGENTS.md). Build TypeScript comme vérification finale.

**Tech Stack:** React 18, TypeScript 5, Vite 5, CSS Modules

---

## Fichiers touchés

| Fichier | Action |
|---|---|
| `apps/wanderstate/src/Layout.tsx` | Modifier — remplacer `badge` + `subtitle` par `chapter` |
| `apps/wanderstate/src/Layout.module.css` | Modifier — supprimer la classe `.topbarSub` |
| `apps/wanderstate/src/chapters/ch1a.tsx` | Modifier — remplacer les props |
| `apps/wanderstate/src/chapters/ch1b.tsx` | Modifier — remplacer les props |
| `apps/wanderstate/src/chapters/ch2.tsx` | Modifier — remplacer les props |
| `apps/wanderstate/src/chapters/ch3a.tsx` | Modifier — remplacer les props |
| `apps/wanderstate/src/chapters/ch3c.tsx` | Modifier — remplacer les props |
| `apps/wanderstate/src/chapters/ch4b.tsx` | Modifier — remplacer les props |
| `apps/wanderstate/src/chapters/ch5a.tsx` | Modifier — remplacer les props |

---

### Task 1 : Mettre à jour `Layout.tsx` et `Layout.module.css`

**Files:**
- Modify: `apps/wanderstate/src/Layout.tsx`
- Modify: `apps/wanderstate/src/Layout.module.css`

- [ ] **Step 1 : Mettre à jour l'interface et le JSX dans `Layout.tsx`**

Remplacer le contenu de `apps/wanderstate/src/Layout.tsx` par :

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
  chapter: string
  TripFormOverride?: ComponentType<TripFormProps>
  children?: ReactNode
}

export default function Layout({
  trips,
  onAddTrip,
  chapter,
  TripFormOverride,
  children,
}: LayoutProps) {
  const TripForm = TripFormOverride ?? TripFormDefault

  return (
    <div className={styles.appWrapper}>
      <header className={styles.topbar}>
        <span className={styles.topbarLogo}>WanderState</span>
        <span className={styles.topbarBadge}>{chapter}</span>
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

- [ ] **Step 2 : Supprimer `.topbarSub` dans `Layout.module.css`**

Supprimer les lignes suivantes de `apps/wanderstate/src/Layout.module.css` :

```css
.topbarSub {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-left: auto;
}
```

Le fichier doit passer de 43 à 38 lignes.

- [ ] **Step 3 : Commit**

```bash
git add apps/wanderstate/src/Layout.tsx apps/wanderstate/src/Layout.module.css
git commit -m "refactor(layout): remplacer badge+subtitle par un seul prop chapter"
```

---

### Task 2 : Mettre à jour les 7 fichiers chapitres

**Files:**
- Modify: `apps/wanderstate/src/chapters/ch1a.tsx`
- Modify: `apps/wanderstate/src/chapters/ch1b.tsx`
- Modify: `apps/wanderstate/src/chapters/ch2.tsx`
- Modify: `apps/wanderstate/src/chapters/ch3a.tsx`
- Modify: `apps/wanderstate/src/chapters/ch3c.tsx`
- Modify: `apps/wanderstate/src/chapters/ch4b.tsx`
- Modify: `apps/wanderstate/src/chapters/ch5a.tsx`

- [ ] **Step 1 : Mettre à jour `ch1a.tsx`**

Dans `apps/wanderstate/src/chapters/ch1a.tsx`, remplacer :
```tsx
      badge="useState"
      subtitle="Ch. 1a · State local"
```
par :
```tsx
      chapter="Ch. 1a · useState"
```

- [ ] **Step 2 : Mettre à jour `ch1b.tsx`**

Dans `apps/wanderstate/src/chapters/ch1b.tsx`, remplacer :
```tsx
      badge="useContext + useReducer"
      subtitle="Ch. 1b · Contexte partagé — à venir"
```
par :
```tsx
      chapter="Ch. 1b · useContext + useReducer"
```

- [ ] **Step 3 : Mettre à jour `ch2.tsx`**

Dans `apps/wanderstate/src/chapters/ch2.tsx`, remplacer :
```tsx
      badge="nuqs"
      subtitle="Ch. 2 · State URL — à venir"
```
par :
```tsx
      chapter="Ch. 2 · nuqs"
```

- [ ] **Step 4 : Mettre à jour `ch3a.tsx`**

Dans `apps/wanderstate/src/chapters/ch3a.tsx`, remplacer :
```tsx
      badge="TanStack Query"
      subtitle="Ch. 3a · State réseau — à venir"
```
par :
```tsx
      chapter="Ch. 3a · TanStack Query"
```

- [ ] **Step 5 : Mettre à jour `ch3c.tsx`**

Dans `apps/wanderstate/src/chapters/ch3c.tsx`, remplacer :
```tsx
      badge="Convex"
      subtitle="Ch. 3c · Temps réel — à venir"
```
par :
```tsx
      chapter="Ch. 3c · Convex"
```

- [ ] **Step 6 : Mettre à jour `ch4b.tsx`**

Dans `apps/wanderstate/src/chapters/ch4b.tsx`, remplacer :
```tsx
      badge="Zustand"
      subtitle="Ch. 4b · Store global — à venir"
```
par :
```tsx
      chapter="Ch. 4b · Zustand"
```

- [ ] **Step 7 : Mettre à jour `ch5a.tsx`**

Dans `apps/wanderstate/src/chapters/ch5a.tsx`, remplacer :
```tsx
      badge="XState"
      subtitle="Ch. 5a · Machine d'états — à venir"
```
par :
```tsx
      chapter="Ch. 5a · XState"
```

- [ ] **Step 8 : Commit**

```bash
git add apps/wanderstate/src/chapters/
git commit -m "refactor(chapters): remplacer badge+subtitle par chapter dans tous les chapitres"
```

---

### Task 3 : Vérifier le build TypeScript

**Files:** aucun fichier modifié dans cette tâche

- [ ] **Step 1 : Lancer le build**

```bash
pnpm --filter wanderstate build
```

Sortie attendue : aucune erreur TypeScript, build terminé avec succès.

- [ ] **Step 2 : Corriger les erreurs éventuelles**

Si des erreurs TypeScript apparaissent (références résiduelles à `badge` ou `subtitle`), les corriger dans les fichiers concernés et relancer le build.
