# WanderState

App de démo pour la conférence "Deep Dive — gestion de state React".

## Commandes

```bash
pnpm --filter wanderstate dev      # dev server (port 5173)
pnpm --filter wanderstate build    # tsc -b && vite build
```

## Changer de chapitre

```bash
pnpm --filter wanderstate chapter:1a   # useState (défaut)
pnpm --filter wanderstate chapter:1b   # useContext + useReducer
pnpm --filter wanderstate chapter:2    # nuqs (URL state)
pnpm --filter wanderstate chapter:3a   # TanStack Query
pnpm --filter wanderstate chapter:3c   # Convex (temps réel)
pnpm --filter wanderstate chapter:4b   # Zustand
pnpm --filter wanderstate chapter:5a   # XState
```

## Chapitre 3c — Convex (temps réel)

Dans deux terminaux séparés :

```bash
# Terminal 1 — depuis apps/wanderstate/
npx convex dev

# Terminal 2 — depuis la racine du workspace
pnpm --filter wanderstate chapter:3c
pnpm --filter wanderstate dev
```

Ouvrir `http://localhost:5173` sur deux ordis (ou deux onglets). Créer ou supprimer un voyage sur l'un → l'autre se met à jour automatiquement en < 100ms.
