# WanderPlan — Design Spec

**Conférence :** State Management React — Deep Dive (3h)  
**Date :** 2026-05-16  
**Stack :** Vite + React + TypeScript  
**Audience :** Mixte (intermédiaires à confirmés)

---

## Concept

WanderPlan est une app de planification de voyages. Elle sert de fil conducteur à une conférence de 3h sur le state management React. Chaque chapitre introduit une technologie en ajoutant une feature concrète ou en refactorant le code existant.

L'app reste délibérément simple côté UI pour que l'attention reste sur le state management, pas sur le design.

---

## Chapitres

### Chapitre 1 — State local

#### 1a — `useState` · DÉMO

**Feature : Formulaire de création de voyage + dropdown de destination**

Point de départ de l'app. Tout le state est local aux composants.

- Formulaire contrôlé : nom du voyage, destination, dates (départ/retour), budget
- Validation simple : dates cohérentes, budget > 0
- Liste des voyages créés (affichage en cards basiques)
- Dropdown de sélection de destination : `isOpen` (booléen) + `selected` (valeur) — deux `useState` distincts, exemple minimal d'UI state

**Message :** `useState` suffit pour de l'état local et éphémère — un champ de formulaire, un toggle, une sélection.

#### 1b — `useContext + useReducer` · DÉMO

**Feature : Ajout d'étapes dans un voyage**

Le prop drilling du chapitre 1a devient douloureux dès qu'on veut accéder au state du voyage depuis plusieurs composants.

- Refacto : extraction dans un `TripContext` + `useReducer`
- Actions : `ADD_TRIP`, `ADD_STEP`, `REMOVE_STEP`
- Nouvelle feature : on peut ouvrir un voyage et y ajouter des étapes (vol, hôtel, activité)

**Message :** Quand plusieurs composants partagent le même état → Context. Quand la logique de mise à jour devient complexe → Reducer.

---

### Chapitre 2 — State URL

#### 2 — `nuqs` · DÉMO

**Feature : Modal détail d'un voyage via l'URL**

Transition naturelle vers la couche réseau : l'URL est aussi du state.

- Modal de détail d'un voyage géré via le paramètre `?trip=<id>`
- Toggle liste / cards géré via `?view=grid`
- Lien partageable qui rouvre directement le bon voyage avec la bonne vue
- Le back/forward du navigateur fonctionne naturellement

**Message :** L'URL est une source de vérité gratuite, persistante et partageable.

---

### Chapitre 3 — State réseau

#### 3a — `TanStack Query` · DÉMO

**Feature : Persistance des voyages via un backend maison**

Première interaction avec une API REST maison. Contraste fort avec un `useEffect + useState` artisanal. Démontre le cycle complet : fetch → mutation → invalidation de cache.

- Backend simple (ex. Hono ou Express) exposant des endpoints REST sur les voyages et les étapes
- `useQuery` pour charger la liste des voyages au montage et le détail d'un voyage
- `useMutation` pour créer, modifier et supprimer un voyage — suivi d'un `invalidateQueries` pour resynchroniser la liste
- États de chargement et d'erreur gérés sans une ligne de `useState` supplémentaire
- `staleTime` configuré : pas de refetch inutile si les données sont récentes

**Concepts TanStack Query couverts :** `useQuery`, `useMutation`, `invalidateQueries`, `staleTime`, états `isPending` / `isError`

**Message :** Le server state a son propre cycle de vie — fetch, cache, invalidation. TanStack Query le gère ; `useEffect` le subit.

#### 3b — `Apollo` · THÉORIE UNIQUEMENT

Quand choisir Apollo plutôt que TanStack Query :
- API GraphQL existante côté backend
- Cache normalisé par entité (pas par query)
- Subscriptions GraphQL natives
- Fragments pour la co-location des données

Slides + comparaison de snippets Apollo vs TanStack Query sur un même use case.

#### 3c — `Convex` · DÉMO

**Feature : Co-planning temps réel**

Killer feature de la conférence. Démo à deux onglets ouverts côte à côte.

- Les trips sont persistés dans Convex DB (remplacement du state local)
- Toute modification est visible en temps réel dans les deux onglets
- Indicateur de présence : qui est en train d'éditer

**Message :** Convex efface la frontière client/serveur. Le state devient réactif par défaut.

---

### Chapitre 4 — State manager classic

#### 4a — `Redux` · THÉORIE UNIQUEMENT

Contexte historique et pertinence actuelle :
- Pourquoi Redux a dominé 2016–2020
- Redux Toolkit : ce qui a changé (createSlice, createAsyncThunk)
- Devtools et middleware : ce qui reste inégalé
- Pourquoi on le croise encore en entreprise

Slides + snippets comparatifs Redux vs useReducer vs Zustand.

#### 4b — `Zustand` · DÉMO

**Refacto : TripContext → Zustand store**

Remplacement direct du Context + Reducer par un store Zustand.

- `useTripStore` remplace `TripContext + useReducer`
- `persist` middleware : trips sauvegardés en localStorage en 1 ligne
- Diff git côte à côte : -60 lignes, même comportement

**Message :** La simplicité est une feature. Zustand fait la même chose avec moins de bruit.

---

### Chapitre 5 — State manager exotic

#### 5a — `XState` · DÉMO

**Feature : Wizard de création de voyage**

Remplacement du formulaire unique du ch.1a par un wizard multi-étapes modélisé comme une machine d'états.

- Machine : `idle → destination → dates → steps → budget → confirm → created`
- Guards : dates valides, budget > 0 avant de pouvoir avancer
- Navigation back/forward sans perte de données
- XState Inspector activé en démo : la machine est visualisée en temps réel

**Message :** Certains états se modélisent mieux comme un graphe. XState rend les états impossibles... impossibles.

#### 5b — `Jotai` + `MobX` · THÉORIE UNIQUEMENT

Panorama des approches alternatives :
- **Jotai** : état atomique bottom-up, dérivations avec `atom`, comparaison avec Recoil
- **MobX** : observables et réactivité automatique, `computed`, `reaction`
- Quand les choisir plutôt que Zustand ou XState

Slides + extraits de code illustratifs.

---

## Architecture du projet

```
src/
  components/        # Composants UI partagés
  features/
    trips/           # Domaine voyage (composants + state)
    steps/           # Domaine étapes
  store/             # Zustand store (ch.5)
  machines/          # XState machines (ch.6)
  lib/
    api.ts           # Wrappers TanStack Query (ch.3)
    convex.ts        # Config Convex (ch.4)
```


## APIs utilisées

| Service | Usage | Auth |
|---|---|---|
| Backend maison (Hono/Express) | CRUD voyages + étapes (ch.3) | Aucune |
| Convex | Persistance + temps réel (ch.3c) | Compte gratuit |

---

## Contraintes

- Vite + React + TypeScript
- Code pré-écrit, présenté et expliqué étape par étape (pas de live coding)
- UI volontairement simple — l'attention doit rester sur le state management
- Chaque chapitre démo doit avoir un **message unique et clair**
