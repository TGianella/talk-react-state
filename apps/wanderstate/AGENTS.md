# AGENTS.md — wanderstate

Instructions pour les agents qui travaillent sur cette app.

## Contexte

App de démo pédagogique pour une conférence sur React state management.
**Pas de tests.** Quick and dirty demo, lisibilité avant tout.

## Stack

- Vite 8 + React 19 + TypeScript 6
- pnpm monorepo — workspace root : `../../`
- Commandes utiles :
  - `pnpm --filter wanderstate dev` — dev server (port 5173)
  - `pnpm --filter wanderstate build` — `tsc -b && vite build`

## CSS

### CSS Modules
Chaque composant a son propre `*.module.css` colocalisé. Pas de styles
dans `index.css` hormis `:root`, le reset et `body`.

- Classes en **camelCase** dans le CSS et le JSX (`styles.formSection`)
- Import : `import styles from './MonComposant.module.css'`

### Variables CSS
Toutes les couleurs passent par les variables de `index.css` — zéro
valeur hexadécimale en dur hors du bloc `:root`.

Pour les couleurs avec transparence, utiliser la syntaxe relative CSS :
```css
/* ✅ */
rgb(from var(--color-accent) r g b / 40%)

/* ❌ */
rgba(255, 77, 26, 0.4)
```

### Ombres portées néo-brutalistes
- Ombre plate : `box-shadow: Xpx Xpx 0 var(--color-primary)`
- **Ne pas combiner** `transform: translate` avec une ombre sur hover/active —
  le transform déplace aussi l'outline de focus. Animer uniquement la taille
  de l'ombre.
- **Pas de `border-radius`** sur les éléments qui ont une ombre plate — Firefox/Windows
  crée des artefacts blancs aux coins arrondis avec ce pattern. Coins francs uniquement.

## Architecture

### Composants visuels (`components/`)

Les composants visuels sont de **purs composants de présentation** :

- Reçoivent les **données en props** — aucun accès à un contexte, store ou hook métier
- Reçoivent les **actions en callbacks** — `onAddTrip`, `onDeleteTrip`, etc.
- Contiennent **tout leur CSS** dans leur `*.module.css` colocalisé
- N'importent **jamais** depuis `chapters/`

**Activation d'une feature optionnelle :** présence du callback = feature visible.
```tsx
<TripList trips={trips} />                        // pas de suppression
<TripList trips={trips} onDeleteTrip={handler} /> // bouton supprimer actif
```

**Slots Layout :** `Layout` est un wrapper structurel qui accepte des enfants.
`LayoutHeader`, `LayoutBody`, `LayoutFooter` sont des slots nommés composés
directement dans chaque chapitre.

```tsx
<Layout>
  <LayoutHeader chapter="Ch. 1b · useContext + useReducer" />
  <LayoutBody>
    <TripForm ... />
    <TripList ... />
  </LayoutBody>
  <LayoutFooter>
    <TripSummary ... />
  </LayoutFooter>
</Layout>
```

### Composants logiques (`chapters/`)

Les chapitres contiennent **uniquement la logique qui change** entre démos :
providers, hooks d'état, calculs dérivés, dispatch.

- **Un dossier par chapitre** : `chapters/ch1a/`, `chapters/ch1b/`, etc.
- `index.tsx` — point d'entrée, compose les visuels avec la logique
- Fichiers support colocalisés : `TripContext.tsx`, reducer, store, machine...
- N'importent **aucun CSS** directement

```
chapters/
  ch1a/
    index.tsx          ← ~15 lignes, useState
  ch1b/
    index.tsx          ← ~30 lignes, useContext + useReducer
    TripContext.tsx     ← reducer + provider + hook
```

Les calculs dérivés (ex: `totalBudget`) sont effectués dans le chapitre et
passés en props aux composants visuels — jamais calculés dans les visuels.

### Switching de chapitre

`current-chapter.ts` est réécrit par `scripts/set-chapter.mjs` à chaque
`pnpm chapter:Xx`. `main.tsx` résout automatiquement `./chapters/chXx` vers
`./chapters/chXx/index.tsx`.

```bash
pnpm --filter wanderstate chapter:1b   # active ch1b
pnpm --filter wanderstate chapter:1a   # revient à ch1a (défaut)
```

`current-chapter.ts` est commité avec `'1a'` comme valeur par défaut.

## JSX

### Rendu conditionnel
Toujours utiliser un ternaire, jamais `&&` avec une valeur potentiellement
falsy non-booléenne (risque d'afficher `0`) :
```tsx
/* ✅ */
{value ? value : '\u00a0'}

/* ❌ */
{value && <span>{value}</span>}
```