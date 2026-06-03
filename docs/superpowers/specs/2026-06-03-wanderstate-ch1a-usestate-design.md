# WanderState — Chapitre 1a · `useState` · Design Spec

**Conférence :** State Management React — Deep Dive  
**Chapitre :** 1a — State local avec `useState`  
**Stack :** Vite + React + TypeScript  
**Date :** 2026-06-03

---

## Contexte

WanderState est une app de planification de voyages utilisée comme fil conducteur de la conférence. Chaque chapitre introduit une technologie en ajoutant une feature ou en refactorant le code existant.

Ce chapitre est le point de départ : tout le state est local aux composants, aucune dépendance externe.

**Message pédagogique :** `useState` suffit pour de l'état local et éphémère. Il sert à deux usages distincts : l'état applicatif (liste des voyages) et l'état UI (champs de formulaire).

---

## Contraintes UI

- Thème **light uniquement**
- Éléments d'interface **grands** — lisibles sur vidéoprojecteur
- Contraste **très élevé** — palette Ardoise Nuit + Corail Fluo
- UI délibérément simple — l'attention reste sur le state, pas le design

### Palette

| Rôle | Valeur |
|---|---|
| Primaire | `#0f172a` (ardoise quasi-noir) |
| Accent / CTA | `#ff4d1a` (corail-orange fluo) |
| Fond app | `#f1f5f9` |
| Fond formulaire | `#ffffff` |
| Fond liste | `#f8fafc` |
| Fond card hover | `#fff7f5` |
| Texte secondaire | `#475569` |

---

## Features

### Formulaire de création de voyage

Formulaire contrôlé avec 3 champs + validation :

| Champ | Type | `useState` |
|---|---|---|
| Nom du voyage | texte libre | `name` |
| Destination | texte libre | `destination` |
| Budget | range slider 0–10 000 € | `budget` |

- La valeur du slider s'affiche en temps réel à côté du slider (re-render visible)
- Validation au submit : nom non vide, destination non vide, budget > 0
- Les erreurs s'affichent inline sous le champ concerné (`errors: Record<string, string>`)
- Le formulaire se réinitialise après un submit valide (les setters repassent aux valeurs initiales)

### Liste des voyages

- Grille responsive de cards (`auto-fill, minmax(260px, 1fr)`)
- Chaque card affiche : nom, destination, budget (badge corail)
- Pas de suppression à ce stade (introduit au chapitre 1b avec `useReducer`)

---

## Architecture

```
apps/wanderstate/
  src/
    App.tsx                   ← useState : trips: Trip[]
    components/
      TripForm.tsx            ← useState : name, destination, budget, errors
      TripList.tsx            ← props : trips[]
      TripCard.tsx            ← props : trip
    types.ts                  ← interface Trip
  index.html
  vite.config.ts
  tsconfig.json
  package.json
```

### Types

```ts
// types.ts
export interface Trip {
  id: string
  name: string
  destination: string
  budget: number
}
```

### Flux de données

```
App
  ├── trips: Trip[]           ← useState — state applicatif
  ├── onAddTrip(trip: Trip)   ← setter passé en prop
  │
  ├── TripForm
  │     ├── name        ← useState — champ texte contrôlé
  │     ├── destination ← useState — champ texte contrôlé
  │     ├── budget      ← useState — range slider (0–10 000 €)
  │     ├── errors      ← useState — validation inline
  │     └── onSubmit → onAddTrip
  │
  └── TripList
        └── TripCard[]        ← props seulement, aucun state
```

Le prop drilling `onAddTrip` est **intentionnel** — il prépare la douleur que `useContext` viendra résoudre au chapitre 1b.

---

## Layout

**Formulaire en haut (ligne horizontale), grille de cards en bas.**

```
┌─────────────────────────────────────────────────┐
│ WanderState          [useState]   Chapitre 1a   │  ← topbar #0f172a
├─────────────────────────────────────────────────┤
│ NOUVEAU VOYAGE                                   │
│ ┌──────────────┐ ┌──────────────┐               │
│ │ Nom          │ │ Destination  │               │
│ └──────────────┘ └──────────────┘               │
│ Budget : 2 400 € [━━━━━●──────────]             │
│ [Créer le voyage]                                │
├─────────────────────────────────────────────────┤
│ MES VOYAGES  2                                   │
│ ┌───────────┐ ┌───────────┐ ┌ ─ ─ ─ ─ ─ ─ ─┐  │
│ │ Tokyo     │ │ Lisbonne  │ │   + créer     │  │
│ │ Japon     │ │ Portugal  │ │               │  │
│ │ [2 400 €] │ │ [1 100 €] │ └ ─ ─ ─ ─ ─ ─ ─┘  │
│ └───────────┘ └───────────┘                      │
└─────────────────────────────────────────────────┘
```

---

## État initial de l'app

Au lancement : liste vide, formulaire vierge, budget slider à `500`.

---

## Ce qui est hors scope

- Suppression de voyage (ch. 1b)
- Navigation / routing (ch. 2)
- Persistance (ch. 3+)
- Champs de date (trop de complexité visuelle pour peu de valeur pédagogique)
