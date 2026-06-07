# Design — Fusion badge + subtitle en un seul prop `chapter`

Date : 2026-06-07

## Problème

Le composant `Layout` expose deux props pour identifier le chapitre actif : `badge` et `subtitle`. Les deux remplissent le même rôle conceptuel (indiquer à l'audience quelle démo est en cours), ce qui crée une redondance dans le topbar.

Topbar actuel :
```
WanderState  [useState]  Ch. 1a · State local
```

## Décision

Fusionner `badge` et `subtitle` en un seul prop `chapter: string`. Le topbar affiche un seul élément identifiant, le badge.

Topbar cible :
```
WanderState  [Ch. 1a · useState]
```

## Changements

### `src/Layout.tsx`

- Supprimer `badge: string` et `subtitle: string` de `LayoutProps`
- Ajouter `chapter: string`
- Supprimer le `<span className={styles.topbarSub}>`
- Le `<span className={styles.topbarBadge}>` affiche `{chapter}`

### `src/Layout.module.css`

- Supprimer la classe `.topbarSub` (plus aucune référence)

### Fichiers chapitres (7 fichiers)

| Fichier | Valeur `chapter` |
|---|---|
| `src/chapters/ch1a.tsx` | `"Ch. 1a · useState"` |
| `src/chapters/ch1b.tsx` | `"Ch. 1b · useContext + useReducer"` |
| `src/chapters/ch2.tsx` | `"Ch. 2 · nuqs"` |
| `src/chapters/ch3a.tsx` | `"Ch. 3a · TanStack Query"` |
| `src/chapters/ch3c.tsx` | `"Ch. 3c · Convex"` |
| `src/chapters/ch4b.tsx` | `"Ch. 4b · Zustand"` |
| `src/chapters/ch5a.tsx` | `"Ch. 5a · XState"` |

Les mentions `"— à venir"` présentes dans les anciens `subtitle` des stubs sont supprimées.

## Non-changements

- Le nom de la classe CSS `topbarBadge` est conservé tel quel.
- Le style visuel du badge (pill) ne change pas.
- Aucun autre comportement ou composant n'est affecté.
