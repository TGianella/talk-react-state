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