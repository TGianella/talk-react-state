---
layout: section
image: /covers/factory-assunta-darnault.jpg
credit: Assunta Darnault
---

# Chapitre 2
## L'état dans l'URL
<div class="opacity-80 pt-2">La source de vérité qu'on oublie</div>

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
Si l'app affiche quelque chose qui <b>dépend d'un paramètre</b>, ce paramètre est du state.
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

- `?trip=abc123` — la modale du bon voyage s'ouvre depuis un lien
- `?view=grid` — vue cards vs liste, persistée entre navigations
- `?status=confirmed` — filtre actif sur la liste
- `?page=3` — reload = même page, pas retour à 1

</v-clicks>

</div>
<div>

<div class="font-bold text-red-400 pb-2">❌ Pas dans l'URL</div>

<v-clicks>

- Tooltip ouvert *(éphémère, sans sens hors contexte)*
- Valeur d'un champ en cours de frappe *(état intermédiaire)*
- Menu mobile ouvert/fermé *(UI state pur)*

</v-clicks>

</div>
</div>

<div v-click="8" class="pt-12 text-center text-xl">
Ce qui doit <span v-mark.underline.orange="8">survivre à un refresh</span> ou être <span v-mark.underline.orange="8">partageable</span> appartient à l'URL. Rien d'autre.
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
Les query params n'ont pas de type : tout arrive en <code>string</code>, à convertir manuellement.
</div>
</div>

<!--
pushState → pas d'événement React, pas de re-render. Il faudrait écouter popstate + forcer un re-render manuellement — fragile, oublié en pratique.
Tout est string | null : conversion manuelle à chaque paramètre. 5 params = 5 blocs identiques.
-->

---

# `nuqs`

<FicheSolution
  annee="2020"
  auteur="François Best (franky47) — 47ng"
  tagline="Des query params typés, avec une API identique à useState."
  probleme="L'API native (URLSearchParams + pushState) ne déclenche pas de re-render React, impose un typage manuel et force à dupliquer du code pour chaque paramètre."
  creneau="State navigable côté client (filtres, vues, IDs de ressource), partageable et persisté gratuitement par le navigateur."
  :infos="[
    'Initialement next-usequerystate (Next.js only), renommé nuqs en v2 pour supporter React SPA, Remix, React Router, TanStack Router.',
    'Adopté par shadcn/ui, Supabase, Sentry, Prisma Studio, Uniswap — 3,3M téléchargements/semaine.',
    'Sponsorisé par Vercel (programme OSS 2025) : testé automatiquement avec chaque release de Next.js.',
    'Utilise useSyncExternalStore : même mécanique que Zustand ou Redux, appliquée à l\'URL.',
  ]"
/>

<!--
nuqs résout exactement le manque de l'API native : typage, re-render automatique, et batching.
L'analogie useState est intentionnelle : même destructuring, même ergonomie.
-->

---

# `useQueryState` — le hook central

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

- API **identique à `useState`**, setter inclus
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

```tsx
// Primitives
useQueryState('page',   parseAsInteger)   // number | null
useQueryState('active', parseAsBoolean)   // boolean | null

// Union de valeurs : le cas WanderState
useQueryState('view', parseAsStringLiteral(['grid', 'list'] as const))
// 'grid' | 'list' | null
```

<div v-click class="pt-8 text-center text-xl">
Parsers déjà intégrés pour <span v-mark.underline.orange>les types courants</span> : <code>string</code>, <code>number</code>, <code>boolean</code>, dates, tableaux, JSON, enums…
</div>

<!--
Un parser = parse(string → T | null) + serialize(T → string).
withDefault() élimine le null quand il y a une valeur par défaut sensée → on voit ça slide suivante.
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
L'URL encode l'état complet : <code class="bg-gray-700 px-2 py-1 rounded">?trip=abc123&view=list</code>
<div class="text-xs opacity-60 pt-1">
Partager ce lien rouvre la modal en vue liste — avec un router (soft navigation) ou un state serveur pour rehydrater la donnée.
</div>
</div>

<!--
Démo : cliquer un voyage → montrer ?trip=<id> dans l'URL → toggle vue → ?view=list → combiner les deux.
La promesse du lien partageable nécessite un router ou un state serveur — on y vient dans les chapitres suivants.
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

# Sous le capot — `useSyncExternalStore`

<div class="grid grid-cols-2 gap-8 items-center">
<div>

<div class="flex flex-col items-center gap-2">
  <div class="border border-gray-500 rounded-xl px-4 py-3 w-64 text-center">
    <div class="text-xs uppercase tracking-widest opacity-40 pb-1">URL</div>
    <div class="font-mono text-sm opacity-80">window.location</div>
  </div>
  <div class="text-orange-400 text-sm opacity-60">↕ pushState · popstate</div>
  <div class="border-2 border-orange-500 rounded-xl px-4 py-3 w-64 text-center bg-orange-400/10">
    <div class="text-xs uppercase tracking-widest opacity-40 pb-1">nuqs internal store</div>
    <div class="font-mono text-sm opacity-80">cache de l'URL</div>
  </div>
  <div class="text-orange-400 text-sm opacity-60">↕ subscribe · getSnapshot</div>
  <div class="border border-gray-500 rounded-xl px-4 py-3 w-64 text-center">
    <div class="text-xs uppercase tracking-widest opacity-40 pb-1">useSyncExternalStore</div>
    <div class="font-mono text-sm opacity-80">hook React</div>
  </div>
  <div class="text-orange-400 text-sm opacity-60">↓</div>
  <div class="border border-gray-500 rounded-xl px-4 py-3 w-64 text-center">
    <div class="text-xs uppercase tracking-widest opacity-40 pb-1">composant React</div>
    <div class="font-mono text-sm opacity-80">const [v, setV] = …</div>
  </div>
</div>

</div>
<div>

<v-clicks>

- `pushState` seul ne déclenche **pas** de re-render
- nuqs traite l'URL comme un **store externe**
- s'abonne aux événements `popstate` (back/forward)
- quand l'URL change → notifie tous les abonnés → React re-rend

</v-clicks>

</div>
</div>

<!--
nuqs maintient un cache de l'URL → expose subscribe/getSnapshot → React sait quand re-rendre.
S'abonne à popstate + intercepte ses propres pushState.
Pont ch4 : Zustand/Redux = exactement le même pattern. L'URL et un store externe sont identiques pour React.
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
Parfait pour les SPA (Vite). Le router ne sait pas, et c'est très bien.
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

# `nuqs` — bilan

<Bilan
  :scores="[5, 4, 4, 4, 3]"
  poids="6 kB (gzip)"
  perimetre="URL comme source de vérité"
  idealPour="Le state le moins cher à maintenir — pas de store, un seul provider, géré par le navigateur"
  :avantages="[
    'API identique à useState — courbe d\'apprentissage quasi nulle',
    'Typage automatique via parsers',
    'Batching : plusieurs params, un seul pushState',
    'Back/forward gratuit, sans une ligne de code',
  ]"
  :limites="[
    'Taille de l\'URL limitée (~8 000 chars) — pas pour les objets volumineux',
    'SSR : adaptateur requis, lecture seule côté serveur',
    'État partagé entre plusieurs composants à coordonner manuellement',
  ]"
/>

<!--
Scores (sur 5) : prise en main 4 (la notion de parser et de null demande 5 min),
poids 4 (6 kB gzip — honnête, pas minimal), perf 4 (re-render ciblé via useSyncExternalStore),
écosystème 4 (3,3M dl/semaine, shadcn/ui, Supabase, Sentry, Prisma, testé contre chaque release Next.js),
montée en charge 3 (taille URL + SSR complexifient les grands formulaires).
Idéal pour : filtres de liste, sélection de ressource (tripId), toggle de vue — les cas à 90 %.
Limite principale : SSR avec Next.js App Router nécessite un adaptateur + comprendre
la frontière read-only serveur / write client.
-->
