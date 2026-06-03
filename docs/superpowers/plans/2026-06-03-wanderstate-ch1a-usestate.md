# WanderState Ch.1a — `useState` — Implementation Plan

> **STATUT : IMPLÉMENTÉ** — Ce plan a été entièrement exécuté.
> Pour les conventions et l'état réel du code, consulter :
> - `apps/wanderstate/AGENTS.md` — référence authoritative
> - `git log --oneline apps/wanderstate/` — historique des commits

---

**Goal:** Scaffolder et implémenter l'app WanderState chapitre 1a — formulaire contrôlé (nom, destination, budget slider) + grille de cards — en Vite + React + TypeScript avec la palette Ardoise Nuit & Corail Fluo, optimisée vidéoprojecteur.

**Architecture:** `App.tsx` détient `trips: Trip[]` via `useState`. `TripForm` gère 4 `useState` locaux (name, destination, budget, errors) et remonte le trip via `onAddTrip`. `TripList`/`TripCard` sont des composants de présentation purs (props seulement, aucun state). Le prop drilling `onAddTrip` est intentionnel — il prépare la douleur que `useContext` viendra résoudre au chapitre 1b.

**Tech Stack:** Vite 5, React 18, TypeScript 5. **Pas de tests.**

---

## Tasks — toutes complétées

- [x] Task 1 — Scaffold Vite + React + TypeScript (`4ac080f`)
- [x] Task 2 — `src/types.ts` avec interface `Trip` (`d932592`)
- [x] Task 3 — `TripCard` component
- [x] Task 4 — `TripList` component
- [x] Task 5 — `TripForm` avec validation et budget slider
- [x] Task 6 — `App.tsx` avec `useState trips[]`
- [x] Task 7 — Styles projector-ready + migration CSS Modules (`5c6c325`)

---

> **Note :** Le contenu détaillé des tâches (code snippets CSS/JSX) a été volontairement retiré
> car il reflétait une version antérieure du code. Les patterns qui y figuraient
> (classNames en string, `rgba()`, `border-radius` sur éléments ombrés, `transform` sur hover)
> ont tous été corrigés en cours de session. Se référer à `AGENTS.md` pour les conventions à jour.
