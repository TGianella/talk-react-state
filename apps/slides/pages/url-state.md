---
layout: section
---

# Chapitre 2
## L'état dans l'URL
<div class="opacity-60 pt-2">La source de vérité qu'on oublie</div>

---

# L'URL est du state

<div class="text-center pt-2">

```
wanderstate.app/?trip=abc123&view=grid
                  └────┬────┘ └───┬───┘
                  quel voyage quelle vue
```

</div>

<div class="grid grid-cols-3 gap-4 pt-8">
<div v-click class="text-center">
<div class="text-4xl">🔗</div>
<b>Partageable</b>
<div class="text-xs opacity-60">un lien rouvre le bon état</div>
</div>
<div v-click class="text-center">
<div class="text-4xl">💾</div>
<b>Persistante</b>
<div class="text-xs opacity-60">survit au refresh</div>
</div>
<div v-click class="text-center">
<div class="text-4xl">↩️</div>
<b>Back/forward gratuit</b>
<div class="text-xs opacity-60">sans une ligne de code</div>
</div>
</div>

<div v-click class="pt-6 text-center opacity-70 text-sm">
Si ton app affiche quelque chose qui <b>dépend d'un paramètre</b>, ce paramètre est du state.
</div>

<!--
"Qui a déjà partagé un lien et la modal s'est pas rouverte ?"
useState → en mémoire, disparaît au refresh. L'URL → déjà là, gratuite, gérée par le navigateur.
-->

---

# Ce qui appartient à l'URL

<div class="grid grid-cols-2 gap-8 pt-2">
<div>

<div class="font-bold text-green-400 pb-2">✅ Dans l'URL</div>

<v-clicks>

- `?trip=abc123` — la modal du bon voyage s'ouvre depuis un lien
- `?view=grid` — vue cards vs liste, persistée entre navigations
- `?status=confirmed` — filtre actif sur la liste
- `?page=3` — reload = même page, pas retour à 1

</v-clicks>

</div>
<div>

<div class="font-bold text-red-400 pb-2">❌ Pas dans l'URL</div>

<v-clicks>

- Tooltip ouvert — éphémère, sans sens hors contexte
- Valeur d'un champ en cours de frappe — état intermédiaire
- Menu mobile ouvert/fermé — UI state pur

</v-clicks>

</div>
</div>

<div v-click="8" class="pt-4 border-l-4 border-orange-500 pl-3 text-sm opacity-80">
<b>Règle :</b> ce qui doit <span v-mark.underline.orange="8">survivre à un refresh</span> ou être <span v-mark.underline.orange="8">partageable</span> appartient à l'URL. Rien d'autre.
</div>

<!--
Les "non" : aucun sens hors contexte immédiat, pas de valeur à partager.
Cas limites : champ de recherche → URL après soumission seulement. Drawer → l'ID dans l'URL, l'ouverture en est la conséquence.
-->

---

# Le problème sans librairie

```tsx {all|3|6-9}
// Lecture
const searchParams = new URLSearchParams(window.location.search)
const tripId = searchParams.get('trip') // string | null — pas typé

// Écriture
const params = new URLSearchParams(window.location.search)
params.set('trip', id)
window.history.pushState({}, '', `?${params.toString()}`)
// ↑ React ne sait pas que l'URL a changé. Pas de re-render.
```

<div class="grid grid-cols-2 gap-6 pt-4 text-sm">
<div v-click class="opacity-75">
<code>pushState</code> écrit dans l'URL mais ne déclenche <b>pas</b> de re-render React. Il faut écouter <code>popstate</code> + forcer un re-render manuellement.
</div>
<div v-click class="opacity-75">
Aucun typage : tout est <code>string | null</code>. La conversion est à la charge du développeur. Chaque paramètre = un bloc de code identique à dupliquer.
</div>
</div>

<!--
pushState → pas d'événement React, pas de re-render. Il faudrait écouter popstate + forcer un re-render manuellement — fragile, oublié en pratique.
Tout est string | null : conversion manuelle à chaque paramètre. 5 params = 5 blocs identiques.
-->

---

# `nuqs` — l'URL comme `useState`

<div class="grid grid-cols-2 gap-6 items-center">
<div>

```tsx
import { useQueryState, parseAsString } from 'nuqs'

// ?trip=abc123
const [tripId, setTripId] =
  useQueryState('trip', parseAsString)
// tripId : string | null

setTripId('abc123') // écrit ?trip=abc123
setTripId(null)     // supprime le paramètre
```

</div>
<div>

<v-clicks>

- API **identique à `useState`** — setter inclus
- la valeur est **typée** automatiquement
- `null` = paramètre absent de l'URL
- back/forward déclenche un **re-render** React

</v-clicks>

</div>
</div>

<!--
Même destructuring que useState — intentionnel. Le parser = contrat de typage (slide suivante).
setTripId(null) → supprime le paramètre de l'URL.
-->

---

# Les parsers — le contrat de typage

| Parser | Type TypeScript | Exemple URL |
|---|---|---|
| `parseAsString` | `string \| null` | `?q=paris` |
| `parseAsInteger` | `number \| null` | `?page=3` |
| `parseAsFloat` | `number \| null` | `?budget=1500.5` |
| `parseAsBoolean` | `boolean \| null` | `?confirmed=true` |
| `parseAsStringLiteral(['a','b'])` | `'a' \| 'b' \| null` | `?view=grid` |
| `parseAsArrayOf(parseAsString)` | `string[] \| null` | `?tags=vol,hotel` |
| `parseAsJson<T>()` | `T \| null` | `?filter=%7B...%7D` |

<div v-click class="pt-4 border-l-4 border-orange-500 pl-3 text-sm">
Un parser = deux méthodes : <code>parse(string → T | null)</code> et <code>serialize(T → string)</code>.<br>
C'est le contrat entre l'URL (string) et le composant (type TypeScript).
</div>

<!--
parse() : string → T | null. serialize() : T → string. Si null → paramètre ignoré/absent.
withDefault() : élimine le null quand il y a une valeur par défaut sensée → on voit ça slide suivante.
-->

---

# WanderState — deux paramètres, deux approches

<div class="grid grid-cols-2 gap-6 text-sm">
<div>

**`tripId` — ressource navigable**

```tsx {all|2|6}
const [tripId, setTripId] =
  useQueryState('trip', parseAsString)

// Ouvrir un voyage
<TripList
  onSelectTrip={(t) => setTripId(t.id)}
/>

// Fermer la modal
<TripModal
  trip={selectedTrip}
  onClose={() => setTripId(null)}
/>
```

</div>
<div>

**`view` — état UI**

```tsx {all|3-4|7}
const [view, setView] =
  useQueryState('view',
    parseAsStringLiteral(['grid', 'list'] as const)
      .withDefault('grid'))
// view : 'grid' | 'list' — jamais null

<TripList view={view} onViewChange={setView} />
```

<div class="pt-3 opacity-60 text-xs">
<code>withDefault</code> → jamais <code>null</code>, la vue a toujours une valeur.
</div>

</div>
</div>

<div v-click class="pt-4 text-center">
Ouvrir le voyage <code>abc123</code> en vue liste : <code class="bg-gray-700 px-2 py-1 rounded">?trip=abc123&view=list</code>
<div class="text-xs opacity-60 pt-1">Ce lien fonctionne directement — modal ouverte + vue liste. Le bouton back ferme la modal. <b>Gratuit.</b></div>
</div>

<!--
Démo : créer des voyages → cliquer un voyage → montrer ?trip=<id> dans l'URL → copier/coller dans un nouvel onglet → modal rouverte.
Back → modal fermée. Toggle vue → ?view=list. Combiner : ?trip=abc123&view=list.
-->

---

# Sous le capot — `useSyncExternalStore`

<div class="grid grid-cols-2 gap-8 items-center">
<div>

```
        ┌─────────────────────────┐
        │    nuqs internal store   │
        │  (cache de l'URL en mém) │
        └────────────┬────────────┘
                     │ subscribe / getSnapshot
         ┌───────────▼──────────┐
         │  useSyncExternalStore │  ← hook React
         └───────────┬──────────┘
                     │
         ┌───────────▼──────────┐
         │  composant React      │
         │  const [v, setV] = …  │
         └──────────────────────┘
```

</div>
<div>

<v-clicks>

- `pushState` seul ne déclenche **pas** de re-render
- nuqs traite l'URL comme un **store externe**
- s'abonne aux événements `popstate` (back/forward)
- quand l'URL change → notifie tous les abonnés → React re-rend

</v-clicks>

<div v-click class="pt-3 text-xs border-l-4 border-gray-500 pl-2 opacity-70">
C'est le même mécanisme que Zustand, Redux — <code>useSyncExternalStore</code> est l'API officielle React pour les stores externes.
</div>

</div>
</div>

<!--
nuqs maintient un cache de l'URL → expose subscribe/getSnapshot → React sait quand re-rendre.
S'abonne à popstate + intercepte ses propres pushState.
Pont ch4 : Zustand/Redux = exactement le même pattern. L'URL et un store externe sont identiques pour React.
-->

---

# Sous le capot — batching des writes

```tsx
// Sans batching — 2 entrées dans l'historique pour 1 action
setTripId('abc123')  // pushState → ?trip=abc123
setView('grid')      // pushState → ?trip=abc123&view=grid
```

<div v-click class="pt-4">

nuqs résout ça par **micro-task batching** :

```
tick 1 : setTripId('abc123')  → mise en file d'attente
tick 1 : setView('grid')       → mise en file d'attente
                                     ↓ fin du tick synchrone
tick 2 : flush → un seul pushState(?trip=abc123&view=grid)
```

</div>

<v-clicks>

- Les writes sont accumulés dans la même micro-task
- À la fin du tick, nuqs fusionne et appelle `pushState` **une seule fois**
- Une seule entrée dans l'historique, peu importe le nombre de paramètres
- Même principe que le batching de React 18 pour les setters `useState`

</v-clicks>

<!--
Sans batching, ouvrir un voyage en vue grille créerait 2 entrées dans l'historique.
Le back fermerait seulement la vue grille, pas la modal. Comportement cassé.
Le batching est la feature silencieuse qui rend le tout cohérent.
-->

---

# Shallow routing vs adaptateurs

<div class="grid grid-cols-2 gap-8 pt-2 text-sm">
<div>

**Par défaut — shallow**

```
URL change → History API (pushState)
           → nuqs store notifié
           → re-renders React
           ✗ Router non notifié
```

<div class="pt-2 opacity-70">
Parfait pour les SPA (Vite). Le router ne sait pas — pas besoin.
</div>

</div>
<div v-click>

**Avec adaptateur — router notifié**

```tsx
// Next.js App Router
import { NuqsAdapter } from 'nuqs/adapters/next/app'

// React Router
import { NuqsAdapter } from 'nuqs/adapters/react-router'

<NuqsAdapter>
  <App />
</NuqsAdapter>
```

<div class="pt-2 opacity-70">
nuqs délègue les writes au router → loaders, SSR, navigation réelle.
</div>

</div>
</div>

<!--
SPA Vite → shallow, pas d'adaptateur. Next.js App Router → avec adaptateur, les Server Components voient les params + loaders se ré-exécutent.
Règle : pas de SSR/loaders → pas d'adaptateur.
-->

---

# ⚠️ Les limites

<div class="grid grid-cols-3 gap-4 pt-4 text-sm">

<div v-click class="border border-gray-600 rounded p-3">
<b>Taille de l'URL</b>
<div class="pt-2 opacity-70">
Limite navigateur (~8 000 chars). IDs, filtres, vues : OK. Objets complets : non. <code>parseAsJson</code> existe mais reste pour des structures petites.
</div>
</div>

<div v-click class="border border-gray-600 rounded p-3">
<b>Types complexes</b>
<div class="pt-2 opacity-70">
Tableaux sérialisés en virgules : <code>?tags=vol,hotel</code> — les virgules dans les valeurs posent problème. Préférer une représentation aplatie à un objet JSON encodé.
</div>
</div>

<div v-click class="border border-gray-600 rounded p-3">
<b>SSR</b>
<div class="pt-2 opacity-70">
Next.js App Router : adaptateur nécessaire, lecture seule côté serveur. Pages Router : params accessibles uniquement via <code>getServerSideProps</code>.
</div>
</div>

</div>

<div v-click class="pt-5 text-center opacity-60 text-sm">
Vite / SPA : aucun de ces problèmes. nuqs fonctionne out of the box.
</div>

<!--
Taille : problème seulement si on met des objets complets → signal qu'on utilise mal l'URL.
Complexe : préférer ?from=2026-06&to=2026-09 à un JSON encodé illisible.
SSR : lecture seule côté serveur, c'est normal — on ne peut pas écrire dans l'URL depuis le serveur.
IDs + filtres + vues → aucune de ces limites ne se pose.
-->

---
layout: quote
---

# « L'URL est une base de données gratuite. »

Elle est déjà là, elle persiste, elle se partage, elle gère le back/forward.

<div class="text-base opacity-60 pt-4">
<code>useQueryState</code> = <code>useState</code> dont la valeur vit dans l'URL.<br>
Avant d'inventer du state client, demandez-vous si ça n'appartient pas ici.
</div>

<div v-click class="text-sm opacity-50 pt-8">
nuqs utilise <code>useSyncExternalStore</code> — exactement le même mécanisme que Zustand ou Redux.<br>
L'URL et un store externe sont techniquement identiques du point de vue de React.
</div>

<!--
Conclusion du chapitre. Le message à emporter : l'URL est sous-utilisée.
La plupart des filtres, vues, et IDs de ressource devraient y vivre.
nuqs rend ça aussi simple que useState — il n'y a aucune excuse.
-->
