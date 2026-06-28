---
layout: section
image: /covers/factory-german-simonson-1.jpg
credit: German Simonson
---

# Chapitre 4
## Les state managers classiques
<div class="opacity-80 pt-2">Centraliser l'état dans un store global</div>

---

# ⚠️ Mise en garde

<div class="text-base pt-1 opacity-80 text-center">
Une grande partie de la donnée qu'on met d'instinct dans un store est <b>déjà couverte</b> par les chapitres précédents.
</div>

<!-- Diagramme : Serveur ↔ URL ↔ Client -->
<div class="pt-8 max-w-3xl mx-auto grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-x-3 gap-y-5 items-center">

<!-- ligne 1 : les trois lieux -->
<div class="text-center">
<div class="text-4xl">🖥️</div>
<div class="text-sm opacity-60 pt-1">Serveur</div>
</div>
<div class="text-2xl opacity-30">↔</div>
<div class="text-center">
<div class="text-4xl">🔗</div>
<div class="text-sm opacity-60 pt-1">URL</div>
</div>
<div class="text-2xl opacity-30">↔</div>
<div class="text-center">
<div class="text-4xl">💻</div>
<div class="text-sm opacity-60 pt-1">Client</div>
</div>

<!-- ligne 2 : les boîtes d'état (apparition : URL → serveur → client) -->
<div v-click="2" class="border border-gray-600 rounded-lg p-3 text-center self-start">
<div class="font-bold">État serveur</div>
<div class="opacity-70 text-xs pt-1">→ cache réseau<br>SWR, TanStack Query, Convex</div>
</div>
<div></div>
<div v-click="1" class="border border-gray-600 rounded-lg p-3 text-center self-start">
<div class="font-bold">État d'URL</div>
<div class="opacity-70 text-xs pt-1">→ <code>nuqs</code><br>filtres, sélection</div>
</div>
<div></div>
<div v-click="3" class="border-2 border-orange-500 rounded-lg p-3 text-center self-start">
<div class="font-bold">État client</div>
<div class="opacity-70 text-xs pt-1">→ <b class="text-orange-400">store managers</b><br>global &amp; complexe</div>
</div>

</div>

<div v-click="4" class="pt-6 text-center">
<div class="text-base">Côté client, les state managers font le travail des <b>API natives</b>… <span v-mark.orange>en mieux à l'échelle</span>.</div>
<div class="text-sm opacity-60 pt-2">
<code>useState</code> <span class="opacity-40 px-1">→</span> <code>useReducer</code> <span class="opacity-40 px-1">→</span> <code>Context</code> <span class="opacity-40 px-1">→</span> <b class="opacity-100">store</b>
</div>
</div>

<div v-click="5" class="pt-5 text-center text-lg">
Leur cas d'usage est la gestion <span v-mark.orange>de l'état client global réellement complexe</span>
</div>

<div v-click="6" class="pt-3 text-center text-base opacity-70">
Store classique = outil <b>de niche</b> : gros projets, beaucoup de state client.<br>
Dans la majorité des apps, les chapitres précédents suffisent.
</div>

<!--
Mise en garde d'ouverture, version diagramme. Le réflexe « j'installe Redux/Zustand » est
souvent prématuré. On situe la donnée par son lieu de vie : l'URL au milieu (état partageable
→ nuqs, ch. 2), le serveur (état serveur → cache réseau, ch. 3), le client (état purement
client). Apparition URL → serveur → client : une fois l'URL et le serveur retirés, ce qui
reste est de l'état client — et c'est là, seulement là, que les store managers se justifient.
Côté client, ils ne font pas autre chose que les API natives (useState → useReducer → Context) :
ils font le MÊME travail, en mieux à l'échelle (réactivité fine, outillage). D'où les lignes du
bas : outil de niche (gros projets, beaucoup de state client) ; dans la majorité des apps, les
chapitres précédents suffisent.
-->

---

# Store manager, quelle utilité ?

<div class="grid grid-cols-2 gap-8 pt-4">
<div>

### Le problème
<div class="opacity-80 text-sm pt-1">État client global, gros, interdépendant.</div>

<v-clicks>

- Context + Reducer : **tout l'arbre re-render**
- pas de lecture ciblée (pas de sélecteurs)
- logique de mutation **éparpillée**
- aucun outil pour tracer / débugger

</v-clicks>

</div>
<div>

### La promesse d'un store
<div class="opacity-80 text-sm pt-1">Un état qui vit <b>hors</b> du cycle de vie React.</div>

<v-clicks>

- une **source de vérité** centralisée
- des **sélecteurs** → re-render ciblé
- mutations **au même endroit** que l'état
- DevTools, middleware, persistance

</v-clicks>

</div>
</div>

<!--
Le problème que résolvent les stores : à grande échelle, Context+Reducer re-render tout
l'arbre, pas d'abonnement fin, pas d'outillage. Un store = état externe + sélecteurs +
devtools. Mécanisme commun : useSyncExternalStore. Mais ils ne se ressemblent pas tous,
d'où deux axes pour les ranger.
-->

---

# Anatomie d'un store externe

<div class="text-sm opacity-80 pb-1 text-center">Zustand, Redux &amp; co. reposent sur la même mécanique : un état qui vit <b>hors du cycle de vie React</b>.</div>

<div class="grid grid-cols-2 gap-10 pt-4 items-center">
<div>

<!-- diagramme : composants ↔ store externe -->
<div class="flex flex-col items-center gap-1">
<div class="border border-gray-600 rounded-lg px-4 py-2 text-center text-sm w-56">
<div class="text-xl">🧩</div>
<div class="opacity-70">Composants</div>
</div>
<div class="flex gap-8 text-xs opacity-60 py-1">
<div class="text-center">notifie<br>↑</div>
<div class="text-center">set / dispatch<br>↓</div>
</div>
<div class="border-2 border-orange-500 rounded-lg px-4 py-3 text-center w-56">
<div class="font-bold">Store externe</div>
<div class="opacity-70 text-xs pt-1">objet JS · hors React</div>
</div>
</div>

</div>
<div>

<v-clicks>

- **État externe** — un objet JS, indépendant du cycle de vie React
- **Abonnement** — le store notifie ses abonnés à chaque changement (pub/sub)
- **Sélecteurs** — on ne lit qu'une part → re-render ciblé
- **Immuabilité** — chaque update produit un nouvel état (`set` / `dispatch`)

</v-clicks>

</div>
</div>

<div v-click class="pt-5 text-center text-base">
Reste à brancher cet état externe au rendu de React → <span v-mark.orange>useSyncExternalStore</span>
</div>

<!--
Le socle commun des store managers « standalone » (Zustand, Redux). Avant de les opposer,
montrer ce qu'ils PARTAGENT : l'état ne vit pas dans React, c'est un objet JS externe. Le store
expose un mécanisme d'abonnement (pub/sub) : les composants s'abonnent, le store les notifie à
chaque changement. On lit via un sélecteur (une part du state) → re-render ciblé, à l'opposé du
Context qui re-render tout. Et la mise à jour est immuable : set (Zustand) / dispatch (Redux)
produit un nouvel état, jamais une mutation en place. Reste le pont avec React : useSyncExternalStore,
qui fait justement l'objet de la slide suivante (et de son compromis avec le concurrent rendering).
-->

---

# Le problème du _concurrent rendering_

<div class="grid grid-cols-2 gap-8 pt-2">
<div>

### Avant : rendu synchrone
<v-clicks>

- un rendu = un bloc **atomique**, non interruptible
- l'état est lu une seule fois, de façon cohérente
- un store externe (simple objet JS) marche sans souci

</v-clicks>

</div>
<div>

### React 18 : rendu concurrent
<v-clicks>

- React peut **interrompre**, reprendre ou abandonner un rendu pour prioriser le traitement de l'interaction utilisateur
- le rendu n'est plus atomique
- ⚠️ un store **hors du cycle de vie React** peut changer en cours de route

</v-clicks>

</div>
</div>

<div v-click class="pt-5 text-center">
Deux composants lisent le même état à deux instants → valeurs incohérentes = <span v-mark.orange>state tearing</span>.
</div>

<div v-click class="pt-5 text-center">
<div class="inline-block border border-green-500 rounded-lg px-5 py-2">
<div class="text-xl font-mono">use<span class="text-green-400 font-bold">Sync</span>ExternalStore</div>
<div class="text-xs opacity-70 pt-1">un escape hatch pour brancher un store externe sans state tearing</div>
</div>
</div>

<!--
Contexte du trade-off. Avant React 18, le rendu était synchrone et atomique : lire un store
externe pendant le rendu était sûr. Le concurrent rendering (React 18) permet à React de
mettre un rendu en pause, le reprendre, voire le jeter. Du coup un store externe — qui vit
HORS du cycle de vie React — peut muter entre deux lectures du même rendu : deux composants
affichent deux versions du même état = state tearing.
useSyncExternalStore est l'escape hatch officiel. Le « Sync » est clé : le hook force une
lecture synchrone et cohérente du store, ce qui garantit l'absence de tearing mais désactive
de fait le time-slicing pour ce state. D'où le compromis de la slide suivante (le triangle).
-->

---

# Le compromis impossible

<div class="grid grid-cols-2 gap-4 items-center pt-1">
<div>

<svg viewBox="0 0 600 500" class="w-full max-w-md mx-auto">
  <g v-click="1">
    <circle cx="300" cy="217" r="165" fill="#f97316" fill-opacity="0.16" stroke="#f97316" stroke-width="2"/>
    <text x="300" y="120" text-anchor="middle" fill="#fb923c" font-size="6" font-weight="700">Réactivité fine</text>
  </g>
  <g v-click="2">
    <circle cx="240" cy="321" r="165" fill="#38bdf8" fill-opacity="0.16" stroke="#38bdf8" stroke-width="2"/>
    <text x="120" y="395" text-anchor="middle" fill="#38bdf8" font-size="6" font-weight="700">Concurrent</text>
    <text x="120" y="415" text-anchor="middle" fill="#38bdf8" font-size="6" font-weight="700">rendering</text>
  </g>
  <g v-click="3">
    <circle cx="360" cy="321" r="165" fill="#a78bfa" fill-opacity="0.16" stroke="#a78bfa" stroke-width="2"/>
    <text x="480" y="395" text-anchor="middle" fill="#a78bfa" font-size="6" font-weight="700">Pas de</text>
    <text x="480" y="415" text-anchor="middle" fill="#a78bfa" font-size="6" font-weight="700">state tearing</text>
  </g>

  <g v-click="4">
    <text x="400" y="200" text-anchor="middle" fill="currentColor" font-size="5.5" font-weight="600">Zustand</text>
    <text x="422" y="245" text-anchor="middle" fill="currentColor" font-size="5.5" font-weight="600">Redux</text>
  </g>
  <g v-click="5">
    <text x="185" y="225" text-anchor="middle" fill="currentColor" font-size="5.5" font-weight="600">MobX</text>
    <text x="175" y="260" text-anchor="middle" fill="currentColor" font-size="5.5" font-weight="600">Jotai</text>
    <text x="215" y="190" text-anchor="middle" fill="currentColor" font-size="5.5" font-weight="600">XState</text>
  </g>
  <g v-click="6">
    <text x="300" y="410" text-anchor="middle" fill="currentColor" font-size="5.5" font-weight="600">React natif</text>
  </g>

  <g v-click="8">
    <text x="300" y="283" text-anchor="middle" fill="#4ade80" font-size="6.5" font-weight="700">React</text>
    <text x="300" y="308" text-anchor="middle" fill="#4ade80" font-size="6.5" font-weight="700">compiler</text>
  </g>
</svg>

</div>
<div>

<div class="text-lg pb-2">Trois propriétés désirables — on n'en cumule que <span v-mark.orange="3">deux sur trois</span>.</div>

<v-clicks at="4">

- **Fine + sans tearing** → on perd le concurrent rendering<br><span class="text-xs opacity-60">c'est le rôle de <code>useSyncExternalStore</code> — Redux, Zustand</span>
- **Fine + concurrent** → tearing temporaire possible<br><span class="text-xs opacity-60">signaux / observables lus pendant un rendu interruptible — MobX, Jotai, XState</span>
- **Concurrent + sans tearing** → trop de re-renders<br><span class="text-xs opacity-60">l'état natif de React — Context, <code>useReducer</code></span>

</v-clicks>

<div v-click="7" class="pt-4 text-base">
Tout store choisit son <b>compromis</b> — il n'y a pas de gagnant absolu.
</div>

</div>
</div>

<!--
Le state tearing : en concurrent rendering, React peut interrompre puis reprendre un rendu.
Si l'état (dans un store externe mutable) change entre-temps, deux composants affichent des
valeurs différentes du MÊME état → incohérence visible = tearing.
useSyncExternalStore (React 18) garantit l'absence de tearing pour un store externe, mais
force un rendu synchrone : on renonce aux bénéfices du concurrent rendering pour ce state.
Le triangle (Daishi Kato / Tanner Linsley) : réactivité fine, concurrent rendering, pas de
tearing — on ne peut en garantir que deux. React natif sacrifie la finesse (re-renders en
cascade) ; les libs uSES sacrifient le concurrent ; les signaux/MobX acceptent un tearing
temporaire. À placer en tête de chapitre : ça explique POURQUOI les libs diffèrent autant.
Réf : interbolt.org/blog/react-ui-tearing, thread Tanner Linsley.
-->

---

# Sérialiser le state ?

<div class="text-sm opacity-70 pb-4">Sérialiser = transformer l'état (un graphe d'objets en mémoire) en une chaîne transportable, et le reconstruire à l'identique.</div>

```ts
const snap = JSON.stringify(state)   // état   → string
const back = JSON.parse(snap)        // string → état
```

<div v-click="1" class="pt-4 pb-2 text-base">Une chaîne ne contient que des <b>données plates</b> — deux choses n'y entrent pas :</div>

<div class="grid grid-cols-2 gap-4">
<div v-click="2" class="border border-gray-600 rounded-lg p-3">
<b>Type absent de JSON</b>
<div class="text-xs opacity-50 pb-2">la grammaire JSON ne le connaît pas</div>
<div class="text-sm opacity-80"><code>Map</code>, <code>Set</code>, <code>Date</code>, <code>BigInt</code>, <code>undefined</code>, <code>Symbol</code> <span class="opacity-60">→ ignorés, déformés, ou erreur</span></div>
</div>
<div v-click="3" class="border border-gray-600 rounded-lg p-3">
<b>Lié au runtime</b>
<div class="text-xs opacity-50 pb-2">pas une donnée, mais un état vivant de la VM</div>
<div class="text-sm opacity-80">fonctions <span class="opacity-60">(du code + une closure)</span>, instances de classe <span class="opacity-60">(méthodes sur le prototype)</span>, références circulaires <span class="opacity-60">(un graphe, pas un arbre)</span></div>
</div>
</div>

<!--
On reste général : sérialiser, c'est transformer l'état vivant (un graphe d'objets en mémoire)
en une représentation texte transportable, et désérialiser c'est reconstruire ce graphe. En
pratique JSON.stringify / JSON.parse.
Le point clé : une chaîne ne contient que des données plates, et il y a DEUX raisons distinctes
qu'une valeur n'y rentre pas.
1) Elle est liée au runtime — ce n'est pas vraiment une donnée, mais un état vivant de la VM.
Une fonction, c'est du code + une closure (des variables capturées dans une portée) : aucune
chaîne ne peut capturer ça. Une instance de classe : les champs sont des données, mais les
méthodes vivent sur le prototype, dans le runtime — JSON.stringify ne sérialise que les champs
propres et on récupère un objet nu, sans son comportement ni son type. Une référence circulaire :
JSON représente un arbre, pas un graphe avec des pointeurs qui bouclent → TypeError.
2) C'est un type que la grammaire JSON ne définit pas. JSON ne connaît que objet, tableau,
string, number, boolean, null. Tout le reste est traité au cas par cas par stringify, en général
silencieusement : Date → string ISO (on perd le type, parse rend une string), Map/Set → {} (vidés),
undefined / fonction / Symbol → la clé est carrément omise, BigInt → TypeError. Le piège, c'est
que la plupart de ces cas ne lèvent PAS d'erreur : la donnée disparaît sans bruit.
D'où la question qui structure la slide suivante : est-ce que le store GARANTIT un état
sérialisable, ou est-ce qu'il laisse passer n'importe quel objet ? C'est un vrai choix de design.
-->

---

# Les bénéfices d'un état sérialisable

<div class="grid grid-cols-2 gap-4">

<div v-click="1" class="border border-gray-600 rounded-lg p-4">
<div class="text-2xl">💾</div>
<b>Persistance</b>
<div class="text-sm opacity-70 pt-1">l'état entier tient dans <code>localStorage</code> — survit au refresh, à la fermeture de l'onglet</div>
</div>

<div v-click="2" class="border border-gray-600 rounded-lg p-4">
<div class="text-2xl">🖥️</div>
<b>SSR & hydratation</b>
<div class="text-sm opacity-70 pt-1">le serveur sérialise l'état dans le HTML, le client le reprend tel quel</div>
</div>

<div v-click="3" class="border border-gray-600 rounded-lg p-4">
<div class="text-2xl">⏪</div>
<b>Time-travel & DevTools</b>
<div class="text-sm opacity-70 pt-1">chaque état = un snapshot → enregistrer, rejouer, revenir en arrière, exporter un bug</div>
</div>

<div v-click="4" class="border border-gray-600 rounded-lg p-4">
<div class="text-2xl">🔗</div>
<b>Transport & sync</b>
<div class="text-sm opacity-70 pt-1">envoyer l'état sur le réseau, entre onglets, client ↔ serveur</div>
</div>

</div>

<div v-click="5" class="pt-5 text-center text-sm">
À part Redux qui force la sérialisabilité, toutes les solutions acceptent des données non sérialisables. Pour débloquer les features ci-dessus, il faut <span v-mark.orange>réintroduire soi-même la contrainte</span>.
</div>

<!--
L'angle : le bénéfice de NE PAS contraindre est évident (pas de contrainte = on stocke ce qu'on
veut, instances, méthodes, Map). Donc on passe vite dessus. Ce qui mérite qu'on s'y attarde, c'est
ce que la contrainte DÉBLOQUE — pas intuitif tant qu'on ne l'a pas vu. D'où une slide tournée vers
les bénéfices de la sérialisabilité.
Les quatre, c'est le même mécanisme (state ↔ string) sous quatre angles :
- Persistance : tout l'état tient dans localStorage / IndexedDB, donc il survit au refresh et à la
  fermeture de l'onglet. JSON.stringify au save, JSON.parse au boot.
- SSR & hydratation : le serveur calcule un état, le sérialise dans le HTML envoyé, le client le
  désérialise et reprend exactement là où le serveur s'est arrêté — sans refetch.
- Time-travel & DevTools : si chaque état est un snapshot, on peut les empiler, revenir en arrière,
  rejouer une séquence, et exporter l'historique dans un rapport de bug reproductible.
- Transport & sync : un état sérialisable se met sur le réseau — synchro multi-onglets, client ↔
  serveur (c'est exactement ce que fait un Convex, par ex.).
La dernière ligne pose l'alternative sans s'y attarder : ne rien contraindre, c'est juste la liberté
de stocker des objets riches — évident — au prix de tout ce qui précède.
À NUANCER si on te pose la question : presque aucune lib n'IMPOSE la sérialisabilité au runtime.
Zustand stocke des objets plats par convention mais ne t'empêche pas d'y mettre une Map ; rien ne
casse jusqu'à ce que tu actives persist ou devtools, qui eux exigent un état sérialisable. C'est
opt-in partout via middleware/plugins ; même Redux ne bloque pas, RTK se contente d'avertir
(serializableCheck). Enchaîne sur l'axe immuable/mutable — un état sérialisable est presque
toujours immuable et plat.
-->

---

# Critères distinctifs

<div class="text-sm opacity-70 pb-2">
<b>Mutabilité</b> : on remplace l'état (immuable) ou on le modifie en place (mutable) ?<br>
<b>Provider</b> : faut-il wrapper l'app dans un contexte React, ou non ?
</div>

<div class="grid grid-cols-[7rem_1fr_1fr] gap-3 pt-3 text-center items-stretch">

<div></div>
<div class="font-bold opacity-70 self-center">Sans Provider</div>
<div class="font-bold opacity-70 self-center">Avec Provider</div>

<div class="font-bold opacity-70 self-center text-right pr-2">Immuable</div>
<div v-click class="border border-gray-600 rounded-lg p-4">
<b class="text-lg">Zustand</b>
<div class="opacity-60 text-xs pt-1">un hook, set() immuable</div>
</div>
<div v-click class="border border-gray-600 rounded-lg p-4">
<b class="text-lg">Redux</b> <span class="opacity-50 text-xs">+ RTK</span>
<div class="opacity-60 text-xs pt-1">action → reducer pur → store</div>
</div>

<div class="font-bold opacity-70 self-center text-right pr-2">Mutable</div>
<div class="flex flex-col gap-2">
<div v-click class="border border-gray-600 rounded-lg p-3">
<b class="text-lg">MobX</b>
<div class="opacity-60 text-xs pt-1">observables, mutation directe</div>
</div>
<div v-click class="border border-gray-600 rounded-lg p-3">
<b class="text-lg">Jotai</b>
<div class="opacity-60 text-xs pt-1">atomes, granulaire <span class="opacity-80">· provider optionnel</span></div>
</div>
</div>
<div v-click class="self-center opacity-40 text-3xl">—</div>

</div>

<!--
Deux axes orthogonaux. Mutabilité : immuable (fonctionnel, comme React — Redux, Zustand)
vs mutable (signaux/observables — MobX, Jotai). Provider : SEUL Redux impose de wrapper l'app
dans un <Provider>. Zustand et MobX n'en ont pas, et Jotai marche sans (store global par
défaut) — son <Provider> est optionnel et niche (scoping de plusieurs stores, SSR, isolation
en test). D'où la colonne « Avec Provider » qui ne contient que Redux, et la case mutable +
provider laissée vide. Jotai range-able en mutable car modèle atomique/granulaire proche des
signaux. On démarre par Zustand (coin simple), puis Redux.
-->

---
layout: cover
image: /covers/factory-postrh-2.avif
credit: postrh
---

# Zustand

<div class="text-xl opacity-80 pt-3">Le state manager minimaliste</div>

---

# `Zustand`

<FicheSolution
  annee="2019"
  auteur="Paul Henschel — pmndrs (Poimandres)"
  tagline="Une gestion de state minimaliste, rapide et qui passe à l'échelle."
  probleme="Le boilerplate de Redux et le re-render global du Context : avoir du state partagé sans provider ni cérémonie."
  creneau="State global client, simple et performant, via un hook et des sélecteurs."
  :infos="[
    'Zustand = « état » en allemand (clin d\'œil à Redux/Valtio/Jotai, tous nommés par l\'équipe pmndrs).',
    'Même écurie que Jotai et Valtio ; maintenu notamment par Daishi Kato.',
    'API minuscule (~1 kB gzip), sans dépendance, agnostique du framework.',
    'Sélecteurs → re-render ciblé ; middlewares persist / devtools / immer fournis.',
  ]"
/>

<!--
Slide d'ouverture de la sous-section Zustand. Poser le décor avant la démo 4b :
d'où ça vient, quel problème, son créneau. Enchaîner sur le hook + sélecteur.
-->

---

# `create`

<div class="text-sm opacity-80 pb-1">La fonction <code>create()</code> renvoie un <b>hook</b> qui permet d'interagir avec le store.</div>

```ts {all|1|2-5|7}
const useTripStore = create((set) => ({
  trips: [],                                          // state
  addTrip:    (t)  => set((s) => ({ trips: [...s.trips, t] })),
  removeTrip: (id) => set((s) => ({ trips: s.trips.filter(x => x.id !== id) })),
}))

const count = useTripStore((s) => s.trips.length)     // hook + sélecteur, SANS provider
```

<v-clicks>

- le **state** est une propriété (`trips`)
- on le **mute via des propriétés-fonctions** (`addTrip`, `removeTrip`)
- `set` fait un **merge superficiel** avec le state existant

</v-clicks>

<!--
Démo 4b : refacto TripContext → Zustand. set merge superficiellement. Sélecteur =
une seule propriété par appel (sinon nouvelle référence → re-render). useShallow pour
plusieurs. Encourage plusieurs stores (un par domaine). persist en 1 ligne. Diff: -60 lignes.
-->

---

# Consommer le store

<div class="text-sm opacity-80 pb-1">Dans un composant, on appelle le hook avec un <b>sélecteur</b> pour ne lire que ce qu'on utilise.</div>

```tsx {all|2|3|6}
function TripList() {
  const trips   = useTripStore((s) => s.trips)       // on lit un morceau de state
  const addTrip = useTripStore((s) => s.addTrip)     // … et une action, de la même façon

  return (
    <button onClick={() => addTrip(newTrip)}>Ajouter</button>
  )
}
```

<v-clicks>

- **state et actions** se récupèrent pareil : ce sont des propriétés du store
- Bonne pratique : un appel au store par propriété.

</v-clicks>

<!--
Consommation du hook. On passe un sélecteur (s) => s.xxx pour ne s'abonner qu'à une part
du store. State et actions sont logés au même endroit → on les récupère de la même façon.
Un sélecteur par valeur = re-render ciblé. Appeler useTripStore() sans sélecteur renvoie
l'objet entier et re-render à chaque update (à éviter). Pour lire plusieurs valeurs d'un
coup sans nouvelle référence : useShallow (détaillé sur la slide suivante).
-->

---

# Sélecteurs

<div class="text-center py-4">
<span class="font-mono text-3xl">(<span class="text-orange-400">state</span>) <span class="opacity-40">=&gt;</span> <span class="text-green-400">state.trips</span></span>
<div class="text-sm opacity-60 pt-3">reçoit <b>tout</b> le state · en renvoie une <b>part</b> · aucun effet de bord</div>
</div>

<v-clicks>

- à chaque update du store, Zustand **ré-exécute** le sélecteur
- il compare le résultat par référence (`===`) (attention aux tableaux et objets littéraux !)
- le composant re-render **seulement si cette part a changé**

</v-clicks>

<div v-click class="pt-4 text-center text-lg">
concept central pour la <span v-mark.orange>réactivité fine</span>
</div>

<div v-click class="pt-6 text-sm opacity-80">Récupérer plusieurs valeurs en un appel :</div>

<div v-click>

```ts
// useShallow compare champ par champ (pas la référence)
const { trips, addTrip } = useTripStore(
  useShallow((s) => ({ trips: s.trips, addTrip: s.addTrip }))
)
```

</div>

<!--
Insister : un sélecteur n'est rien de plus qu'une fonction pure (state) => part. Pas de magie,
pas de syntaxe propriétaire. Il reçoit l'intégralité du state et en extrait ce dont le composant
a besoin, sans effet de bord. À chaque update, Zustand le ré-exécute et compare son résultat par
référence (===) : re-render uniquement si cette part a changé. C'est LE mécanisme de la réactivité
fine — à opposer à Context, qui re-render tous les consommateurs dès que sa value change.
-->

---

# Actions « standalone » — `setState`

<div class="text-sm opacity-80 pt-1 pb-3 text-center">Le hook expose une <b>API statique</b> (<code>getState</code>, <code>setState</code>, <code>subscribe</code>) utilisable <b>hors de React</b>, sans s'abonner.</div>

```ts
// l'action vit hors du hook, branchée sur le store
export const addTrip = (t) =>
  useTripStore.setState((s) => ({ trips: [...s.trips, t] }))
```

```tsx
// appel direct : pas de useTripStore(...) → aucun abonnement
<button onClick={() => addTrip(newTrip)}>Ajouter</button>
```

<div class="grid grid-cols-2 gap-4 pt-3 text-sm">
<div v-click class="border border-gray-600 rounded-lg p-3">
Récupérer une <b>action</b> ne devrait pas obliger à <b>s'abonner</b> à l'état.
</div>
<div v-click class="border border-orange-500 rounded-lg p-3">
Un composant qui ne fait qu'<b>émettre</b> ne re-render <b>jamais</b>.
</div>
</div>

<!--
API statique du store. Le hook créé par create() porte aussi useStore.getState / setState /
subscribe — accessibles HORS de React, sans hook ni abonnement. On peut donc définir les actions
comme de simples fonctions autonomes qui appellent useStore.setState(...). Un composant qui ne
fait que déclencher une action l'importe et l'appelle directement : il ne lit pas le store, donc
ne s'y abonne pas, donc ne re-render jamais inutilement. (À noter : sélectionner une action via
useStore(s => s.addTrip) renvoie déjà une réf stable ; les actions standalone vont plus loin —
zéro souscription, et utilisables hors composant : events, callbacks, code non-React.)
-->

---

# Stores atomiques

<div class="text-sm opacity-80 pt-1 pb-4 text-center">Un store = un hook → on en crée un <b>par domaine</b> métier, plutôt qu'un mono-store global.</div>

<div v-click class="flex gap-3 justify-center">
<div class="border border-gray-600 rounded-lg px-5 py-2 text-center text-sm w-44">🧳<div class="font-mono pt-1 opacity-80">useTripStore</div></div>
<div class="border border-gray-600 rounded-lg px-5 py-2 text-center text-sm w-44">👤<div class="font-mono pt-1 opacity-80">useUserStore</div></div>
<div class="border border-gray-600 rounded-lg px-5 py-2 text-center text-sm w-44">🎛️<div class="font-mono pt-1 opacity-80">useUiStore</div></div>
</div>

<div class="grid grid-cols-2 gap-8 pt-5 items-start">
<div v-click>
<div class="text-xs opacity-70 pb-1">❌ recoupler deux stores dans la vue</div>

```tsx
const userId     = useUserStore((s) => s.id)
const resetTrips = useTripStore((s) => s.reset)
// user change → on vide ses voyages à la main
useEffect(() => resetTrips(), [userId])
```

</div>
<div v-click>
<div class="text-xs opacity-70 pb-1">✅ domaines liés → un store, des slices</div>

```ts
// le couplage vit dans le store
logout: () => set({ user: null, trips: [] })
```

</div>
</div>

<div v-click class="pt-4 text-sm text-center opacity-70">
⚠️ Domaines <b>interdépendants</b> → un seul store : la logique de couplage ne vit pas dans la vue.
</div>

<!--
Stores atomiques. Un store = un hook → un par domaine métier (voyages, user, UI), pas un
mono-store global. Contre-exemple : quand deux domaines sont interdépendants, on est tenté de
les resynchroniser à la main dans un composant (useEffect qui appelle l'action d'un autre store)
→ logique métier qui fuit dans la vue, fragile. La bonne réponse : un seul store découpé en
slices, où le couplage (ex. logout vide user ET trips) vit dans l'action. (useShallow : slide Sélecteurs.)
-->

---

# Bound store — composer des slices

<div class="text-sm opacity-80 pt-1 pb-2 text-center">Découper le store en <b>slices</b> ciblées, mais les réunir dans <b>un seul store</b> cohérent.</div>

```ts {all|2-5|6-9|12-15}
// 1 slice = 1 domaine, défini comme une fonction
const createTripSlice = (set) => ({
  trips: [],
  addTrip: (t) => set((s) => ({ trips: [...s.trips, t] })),
})
const createUserSlice = (set) => ({
  user: null,
  logout: () => set({ user: null, trips: [] }),   // ← peut toucher une autre slice
})

// 1 seul store, composé de toutes les slices
const useStore = create((...a) => ({
  ...createTripSlice(...a),
  ...createUserSlice(...a),
}))
```

<div class="grid grid-cols-3 gap-3 pt-3 text-xs">
<div v-click class="border border-gray-600 rounded-lg p-3">🧩 chaque slice reste <b>petite et isolée</b></div>
<div v-click class="border border-gray-600 rounded-lg p-3">🔗 une action peut toucher <b>plusieurs slices</b></div>
<div v-click class="border border-gray-600 rounded-lg p-3">🎯 sélecteurs toujours ciblés : <code>useStore(s =&gt; s.trips)</code></div>
</div>

<!--
Bound store (slices pattern). Quand les domaines sont interdépendants, on ne fait pas plusieurs
stores recouplés à la main : on découpe UN store en slices, chacune = une fonction (set, get) =>
({ state + actions }) ciblée sur un domaine. On les combine via create((...a) => ({ ...sliceA(...a),
...sliceB(...a) })). Comme tout vit dans le même store, une action d'une slice peut lire/modifier
une autre slice (ex. logout vide user ET trips) — le couplage est explicite et centralisé, pas
éparpillé dans les composants. Et on garde des slices petites + des sélecteurs ciblés.
-->

---

# Une slice de jonction

<div class="text-sm opacity-80 pt-1 pb-3 text-center">La logique qui <b>croise plusieurs domaines</b> mérite sa propre slice — qui lit les autres via <code>get()</code>.</div>

<div v-click class="flex items-center justify-center gap-3 text-xs pb-3">
<span class="border border-gray-600 rounded px-2 py-1 font-mono">userSlice</span>
<span class="opacity-50">+</span>
<span class="border border-gray-600 rounded px-2 py-1 font-mono">tripSlice</span>
<span class="opacity-50">→</span>
<span class="border-2 border-orange-500 rounded px-2 py-1 font-mono">userTripsSlice</span>
</div>

```ts {all|4|5-8|13-15}
const createUserTripsSlice = (set, get) => ({
  // action de jonction : lit user + trips, met à jour trips
  archiveMyTrips: () => {
    const { user, trips } = get()                       // lit les autres slices
    set({
      trips: trips.map((t) =>
        t.ownerId === user.id ? { ...t, archived: true } : t),
    })
  },
})

const useStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createTripSlice(...a),
  ...createUserTripsSlice(...a),                         // ← la jonction
}))
```

<div v-click class="pt-2 text-center text-sm opacity-70">
Les slices de base restent <b>pures et isolées</b> ; la slice de jonction <b>orchestre</b>.
</div>

<!--
Slice de jonction (combined slice). Pour modéliser finement un store qui mêle plusieurs domaines :
en plus des slices de base (user, trip), une slice de jonction qui dépend des autres. Ses actions
utilisent get() pour lire l'état des autres slices et set() pour les mettre à jour de façon
cohérente (ex. archiveMyTrips lit le user courant + tous les trips, archive ceux qui lui
appartiennent). Avantage : les slices de base restent pures et découplées, toute la logique
transversale est isolée et explicite dans la slice de jonction. C'est la façon canonique (doc
Zustand) de composer un « bounded store » élaboré sans recoupler à la main.
-->

---

# Middlewares

<div class="text-base opacity-80 pt-1 pb-4 text-center">Des fonctions qui <b>enveloppent</b> le store pour lui ajouter des capacités.</div>

<div class="grid grid-cols-2 gap-10 items-center pt-2">

<div v-click class="font-mono text-sm">
<div class="border-2 border-orange-500 rounded-lg p-3">
<div class="pb-2 text-orange-400">create</div>
<div class="border border-gray-500 rounded p-3">
<div class="pb-2">devtools</div>
<div class="border border-gray-500 rounded p-3">
<div class="pb-2">persist <span class="opacity-50">→ localStorage</span></div>
<div class="border border-gray-500 rounded p-3 text-center opacity-70">state + actions</div>
</div>
</div>
</div>
</div>

<div v-click>

```ts
const useStore = create(
  devtools(
    persist(
      (set) => ({ /* state + actions */ }),
      { name: 'wanderstate' },   // clé localStorage
    ),
  ),
)
```

</div>

</div>

<div class="grid grid-cols-3 gap-3 pt-5 text-xs">
<div v-click class="border border-gray-600 rounded-lg p-3"><code>persist</code> — survit au refresh (localStorage)</div>
<div v-click class="border border-gray-600 rounded-lg p-3"><code>devtools</code> — Redux DevTools, time-travel</div>
<div v-click class="border border-gray-600 rounded-lg p-3"><code>immer</code> — mutations « directes »</div>
</div>

<div v-click class="text-center text-sm opacity-60 pt-3">
persistance en <b>une ligne</b> · diff vs Context+Reducer : <b class="text-orange-400">−60 lignes</b>
</div>

<!--
Les middlewares enveloppent le store (create → devtools → persist → state). On les empile pour
ajouter des capacités sans toucher à la logique. persist = persistance localStorage en une
ligne (l'argument démo le plus parlant). devtools = Redux DevTools + time-travel. immer = écrire
des mutations « directes » tout en restant immuable. Diff vs Context+Reducer : −60 lignes.
-->

---

# `Zustand` — bilan

<Bilan
  :scores="[5, 5, 4, 4, 3]"
  poids="485 B (gzip)"
  perimetre="état client global"
  idealPour="la majorité des besoins de store, du plus simple au moyennement complexe"
  :avantages="[
    'Pas de provider — juste un hook',
    'API minimale, très peu de boilerplate',
    'Sélecteurs → réactivité fine',
    'Middlewares : persist, devtools, immer',
  ]"
  :limites="[
    'Aucune structure imposée → force à se discipliner',
    'Couplage inter-stores géré à la main (slices)',
    'Outillage en deçà de Redux DevTools',
  ]"
/>

<!--
Bilan Zustand. Scores (sur 5) : prise en main 5 (un hook, on démarre en 2 min), poids 5
(485 B gzip), perf 4 (sélecteurs = re-render ciblé), écosystème 4 (middlewares solides mais
moins fourni que Redux), montée en charge 3 (pas de structure imposée, à cadrer soi-même).
Idéal pour la majorité des besoins de store client. Limite principale : la liberté = il faut
imposer ses propres conventions (slices, un store par domaine) sur les gros projets.
-->

---
layout: cover
image: /covers/factory-atsushi-maeda-2.jpg
credit: Atsushi Maeda
---

# Redux

<div class="text-xl opacity-80 pt-3">Le pionnier des store managers</div>

---

# `Redux` + RTK

<FicheSolution
  annee="2015"
  auteur="Dan Abramov & Andrew Clark"
  tagline="Un conteneur d'état prévisible : chaque changement passe par une action traçable."
  probleme="Des architectures event-based, illisibles et très difficiles à débugger : impossible de comprendre comment/pourquoi l'état a changé"
  creneau="Gros état client complexe, où la traçabilité, le time-travel et l'outillage priment."
  :infos="[
    'Redux = implémentation de l\'architecture Flux ; premier et plus connu des store managers React.',
    'Conçu initialement pour pouvoir suivre les actions plus que partager un état global',
    'L\'architecture state → action → reducer a été reprise par React lui-même (useReducer + useContext).',
    'Redux Toolkit (RTK) standard moderne de Redux : configureStore, createSlice, createAsyncThunk → fin du boilerplate.',
  ]"
/>

<!--
Slide d'ouverture de la sous-section Redux. Poser le décor avant la théorie 4a :
d'où ça vient (Flux), quel problème (event-based intraçable), son créneau. Insister
sur le fait que le store global est un bénéfice collatéral, pas la raison d'être :
si le seul besoin est d'éviter le prop drilling, utiliser Context. Enchaîner sur la
sainte trinité state-action-reducer.
-->

---

# Flux : flux de données unidirectionnel

<div class="text-sm opacity-80 pb-1 text-center"><b>Architecture</b> née chez Facebook, en réaction au two-way data binding du MVC.</div>

<!-- le cycle unidirectionnel -->
<div class="flex items-center justify-center gap-2 text-sm py-4">
<span class="border border-gray-600 rounded px-3 py-1.5">Action</span>
<span class="opacity-40">→</span>
<span class="border border-gray-600 rounded px-3 py-1.5">Dispatcher</span>
<span class="opacity-40">→</span>
<span class="border-2 border-orange-500 rounded px-3 py-1.5 font-bold">Store</span>
<span class="opacity-40">→</span>
<span class="border border-gray-600 rounded px-3 py-1.5">Vue</span>
<span class="opacity-40 pl-1">↺</span>
</div>

<div class="grid grid-cols-2 gap-8 pt-2">
<div>

### Le principe
<v-clicks>

- la donnée circule **dans un seul sens**, jamais en retour
- une interaction = une **action**, jamais une mutation directe
- prévisible : pour comprendre l'UI, on **suit le flux**

</v-clicks>

</div>
<div>

### Comment Redux l'implémente
<v-clicks>

- **un seul store** (Flux en autorise plusieurs)
- **pas de dispatcher** séparé → `dispatch` intégré au store
- la logique sort des stores → **reducers purs**

</v-clicks>

</div>
</div>

<div v-click class="pt-5 text-center text-base">
Redux = Flux <span v-mark.orange>resserré</span> : un store, des reducers purs, un seul flux à suivre.
</div>

<!--
Flux = l'architecture, pas la lib. Née chez Facebook (~2014) pour tuer le two-way data binding
du MVC (état muté de partout → bugs intraçables, ex. le compteur de notifications). Idée centrale :
flux de données UNIDIRECTIONNEL — Action → Dispatcher → Store → Vue, et la boucle recommence par
une nouvelle action. La vue ne mute jamais le store directement ; elle émet une action.
Redux reprend ce flux mais le resserre : là où Flux a PLUSIEURS stores (chacun contenant état +
logique) et un Dispatcher central, Redux n'a qu'UN store, pas de dispatcher séparé (dispatch est
une méthode du store), et sort la logique des stores vers des reducers PURS. D'où la sainte
trinité de la slide suivante : state - action - reducer.
-->

---

# Pourquoi un <span class="text-orange-400">seul</span> store ?

<div class="text-sm opacity-80 pb-1 text-center">Là où Flux a plusieurs stores, Redux n'en a qu'un : <b>tout l'état de l'app, dans un seul objet</b>.</div>

<div class="flex justify-center py-3">
<div class="border-2 border-orange-500 rounded-lg px-6 py-2 text-center">
<div class="font-mono text-sm opacity-70">état à l'instant T</div>
<div class="font-mono pt-1">{ trips, user, ui, … }</div>
</div>
</div>

<div class="grid grid-cols-3 gap-4 pt-2 text-sm">
<div v-click class="border border-gray-600 rounded-lg p-4">
<div class="font-bold pb-1">📸 Un snapshot complet</div>
<div class="opacity-70 text-xs">L'état entier est <b>sérialisable</b> en un objet → time-travel, persistance, hydratation SSR.</div>
</div>
<div v-click class="border border-gray-600 rounded-lg p-4">
<div class="font-bold pb-1">📜 Un seul journal</div>
<div class="opacity-70 text-xs">Toute mutation passe par <code>dispatch</code> → une <b>trace ordonnée</b> de chaque changement.</div>
</div>
<div v-click class="border border-gray-600 rounded-lg p-4">
<div class="font-bold pb-1">🔗 Zéro synchro</div>
<div class="opacity-70 text-xs">Pas de stores à <b>tenir cohérents</b> entre eux : une seule source de vérité.</div>
</div>
</div>

<div v-click class="pt-5 text-center text-base">
Un seul store <span v-mark.orange>≠</span> un gros objet fourre-tout : on le <b>découpe en slices</b> → la source de vérité reste unique.
</div>

<!--
Le store unique est ce qui rend l'outillage Redux possible. Tout l'état de l'app à un instant T
tient dans UN objet → on peut le sérialiser intégralement : c'est ce qui permet le time-travel
debugging (rejouer/annuler les actions), la persistance, l'hydratation SSR. Comme toute mutation
passe par dispatch sur ce store unique, on obtient un journal ordonné et complet de chaque
changement (les devtools). Et contrairement à Flux (plusieurs stores) ou à une approche multi-stores,
il n'y a aucune cohérence inter-stores à maintenir à la main. NUANCE IMPORTANTE (fait le lien avec
la slide réputation suivante) : un seul store ne veut pas dire un blob fourre-tout — on le découpe
en slices (createSlice / combineReducers), mais la source de vérité reste unique.
-->

---

# Les DevTools : la vraie raison d'être

<div class="text-sm opacity-80 pb-1 text-center">Redux est né d'une démo pour <b>React Europe 2015</b> — « <i>Hot Reloading with Time Travel</i> ». Les DevTools n'étaient pas un bonus : c'était <span v-mark.orange>l'objectif</span>.</div>

<div class="grid grid-cols-2 gap-8 pt-3 items-center">
<div>

<!-- mock DevTools : journal d'actions + time-travel -->
<div class="border-2 border-orange-500 rounded-lg overflow-hidden text-xs font-mono max-w-xs mx-auto">
<div class="bg-orange-500 bg-opacity-20 px-3 py-1.5 font-bold">⏱️ Redux DevTools</div>
<div class="p-2 flex flex-col gap-1">
<div class="flex justify-between px-2 py-1 border border-gray-600 rounded"><span>@@INIT</span></div>
<div class="flex justify-between px-2 py-1 border border-gray-600 rounded"><span>trips/added</span><span class="opacity-50">paris</span></div>
<div class="flex justify-between px-2 py-1 border border-gray-600 rounded"><span>trips/added</span><span class="opacity-50">tokyo</span></div>
<div class="flex justify-between px-2 py-1 border-2 border-orange-400 rounded"><span>user/loggedIn</span><span class="text-orange-400">◀ ici</span></div>
<div class="flex justify-between px-2 py-1 border border-gray-700 rounded opacity-30"><span>trips/cleared</span><span>à venir</span></div>
</div>
<div class="border-t border-gray-600 px-3 py-1.5 flex items-center gap-3">
<span>⏮ ◀ ▶ ⏭</span><span class="opacity-50">time-travel</span>
</div>
<div class="border-t border-gray-600 px-3 py-1.5 opacity-70 truncate">state: { trips: [paris, tokyo], user }</div>
</div>

</div>
<div>

<div class="text-sm opacity-80 pb-2">Les contraintes « rigides » de Redux <b>en découlent</b> :</div>

<v-clicks>

- **store unique** → l'état entier est un **snapshot sérialisable**
- **actions = objets simples** → un **journal** rejouable d'événements
- **reducers purs** → `(state, action)` déterministe → on **rejoue** n'importe quel état
- **immuabilité** → un snapshot par dispatch → on **navigue** avant / après

</v-clicks>

</div>
</div>

<div v-click class="pt-4 text-center text-sm opacity-80">
Time-travel, inspection, import/export d'actions, bug reports rejouables : <span v-mark.orange>les structures servent l'outillage</span>.
</div>

<!--
Slide DevTools, placée juste après le « pourquoi un seul store » : c'est le PAYOFF de toutes les
contraintes structurelles de Redux. Point historique à raconter : Redux n'a pas été conçu comme
un state manager d'abord — Dan Abramov l'a écrit pour sa démo à React Europe 2015, « Live React:
Hot Reloading with Time Travel ». Le but premier, c'était les DevTools (hot reloading + voyage
dans le temps) ; l'API a été dessinée POUR rendre cette démo possible.
D'où le retournement à marteler : les contraintes qu'on reproche souvent à Redux ne sont pas
arbitraires, chacune existe pour l'outillage —
- store unique → tout l'état est UN objet sérialisable → on peut le snapshotter/exporter ;
- actions = objets simples (sérialisables) → un journal ordonné et rejouable de ce qui s'est passé ;
- reducers purs et déterministes → rejouer la même séquence d'actions reproduit exactement le même
  état → c'est ce qui rend le time-travel fiable ;
- immuabilité → chaque dispatch produit un nouveau snapshot distinct → on peut se déplacer entre
  les états (avant/après) sans les écraser.
Le mock illustre le journal d'actions + le curseur de time-travel (l'action « à venir » grisée =
on a rembobiné). Conséquences concrètes : inspection état/diff, import/export d'une séquence
d'actions (bug reports reproductibles), hot reloading. Citer Dan Abramov : la « rigidité » de
Redux est le prix à payer pour cet outillage. Transition vers la sainte trinité : ces 3 pièces
(action/reducer/store) sont précisément ce que les DevTools observent.
-->

---

# La sainte trinité

<div class="flex justify-center pt-4">
<div class="inline-block">

<!-- flux principal : Action → Reducer → Store (Redux pur, sans bindings React) -->
<div class="flex items-stretch justify-center gap-2 text-sm">
<div class="border border-gray-600 rounded-lg px-4 py-3 text-center">Action<div class="font-mono text-xs opacity-60 pt-0.5">{ type, payload }</div></div>
<div v-click="1" class="flex flex-col items-center justify-center text-xs opacity-60 px-1"><span>dispatch</span><span class="text-lg leading-none">→</span></div>
<div v-click="1" class="border border-gray-600 rounded-lg px-4 py-3 text-center">Reducer<div class="text-xs opacity-60 pt-0.5">(pur)</div></div>
<div v-click="2" class="flex flex-col items-center justify-center text-xs opacity-60 px-1"><span>nouvel état</span><span class="text-lg leading-none">→</span></div>
<div v-click="2" class="border-2 border-orange-500 rounded-lg px-4 py-3 text-center">Store<div class="text-xs opacity-60 pt-0.5">immuable</div></div>
</div>

</div>
</div>

<div class="grid grid-cols-3 gap-4 pt-6 text-sm">
<div v-click="3" class="border border-gray-600 rounded-lg p-4">
<div class="font-bold pb-1">Action</div>
<div class="opacity-70 text-xs">Un simple objet qui <b>décrit ce qui s'est passé</b> : un <code>type</code> (requis) et un <code>payload</code>. Le seul moyen de demander un changement.</div>
</div>
<div v-click="4" class="border border-gray-600 rounded-lg p-4">
<div class="font-bold pb-1">Reducer</div>
<div class="opacity-70 text-xs">Une fonction <b>pure</b> <code>(state, action) → nouvel état</code>. Aucun effet de bord : c'est ce qui rend les changements traçables.</div>
</div>
<div v-click="5" class="border-2 border-orange-500 rounded-lg p-4">
<div class="font-bold pb-1">Store</div>
<div class="opacity-70 text-xs">L'unique <b>source de vérité</b>, immuable. Jamais muté directement ; lu via des sélecteurs.</div>
</div>
</div>

<div v-click="6" class="pt-6 text-center text-sm opacity-80 italic">
« <b>Dispatching is the only feature of Redux.</b> » — Dan Abramov
</div>

<!--
4a théorie. Trinité state-action-reducer. Reducer PUR. Le store global avec provider
est un bénéfice collatéral. POINT CLÉ : si le seul usage est d'éviter le prop drilling,
utiliser Context. La vraie valeur de Redux : tracer l'évolution du state (devtools).
-->

---

# Exemples

<div class="grid grid-cols-3 gap-3 pt-2 text-xs">

<div>
<div class="opacity-50 uppercase tracking-widest pb-1">Action</div>

```ts
{ type: 'trips/cleared' }
```

```ts
{ type: 'trips/added',
  payload: paris }
```

```ts
const addTrip = (trip) => ({
  type: 'trips/added',
  payload: trip,
})
```

</div>

<div v-click="1">
<div class="opacity-50 uppercase tracking-widest pb-1">Reducer</div>

```ts
// (state, action) → nouvel état
function reducer(state = init, action) {
  switch (action.type) {
    case 'trips/cleared':
      return { ...state, trips: [] }
    case 'trips/added':
      return { ...state,
        trips: [...state.trips,
                action.payload] }
    default:
      return state
  }
}
```

</div>

<div v-click="2">
<div class="opacity-50 uppercase tracking-widest pb-1">Store</div>

```ts
import { createStore } from 'redux'

const store = createStore(reducer)

store.dispatch(addTrip(paris))

store.getState().trips // [paris]
```

</div>

</div>

<div v-click="3" class="pt-3 text-center text-sm opacity-80">
Aucune magie : un <code>switch</code>, un <code>spread</code>, et <code>dispatch</code>. <span v-mark.orange>Tout est explicite.</span>
</div>

<!--
On retrouve les 3 pièces. Insister : reducer = nouvel objet (spread), JAMAIS de mutation.
createStore (Redux pur, sans RTK). RTK supprimera ce boilerplate (createSlice + Immer)
mais le modèle mental reste exactement celui-là.
-->

---

# Middlewares

<div class="text-sm opacity-80 pb-1 text-center">Le flux vu jusqu'ici est <b>synchrone</b>. Un middleware s'intercale entre <code>dispatch</code> et le reducer — pour <b>intercepter, transformer ou différer</b> une action.</div>

<!-- pipeline : dispatch → middlewares → reducer -->
<div class="flex justify-center pt-4">
<div class="flex items-stretch justify-center gap-2 text-sm">
<div class="border border-gray-600 rounded-lg px-4 py-3 flex items-center font-mono">dispatch</div>
<div class="flex items-center text-lg opacity-40 px-1">→</div>
<div v-click="1" class="border border-gray-600 rounded-lg px-4 py-3 text-center">logger<div class="text-xs opacity-60 pt-0.5">middleware</div></div>
<div v-click="1" class="flex items-center text-lg opacity-40 px-1">→</div>
<div v-click="1" class="border border-gray-600 rounded-lg px-4 py-3 text-center">thunk<div class="text-xs opacity-60 pt-0.5">middleware</div></div>
<div v-click="2" class="flex items-center text-lg opacity-40 px-1">→</div>
<div v-click="2" class="border-2 border-orange-500 rounded-lg px-4 py-3 flex items-center text-center">Reducer</div>
</div>
</div>

<div class="text-center text-xs opacity-60 pt-2">l'action traverse <b>chaque middleware enregistré</b> avant d'atteindre le reducer</div>

<div class="grid grid-cols-2 gap-8 pt-5 items-center">
<div v-click="3">

```ts
// signature « curryfiée » d'un middleware
const logger = (store) => (next) => (action) => {
  console.log('avant', store.getState())
  const result = next(action)   // ← passe au suivant
  console.log('après', store.getState())
  return result
}
```

</div>
<div v-click="4">

- `next(action)` → passe au middleware suivant (puis au reducer)
- on peut exécuter du code **avant ET après** `next`
- on peut **modifier, bloquer ou émettre** d'autres actions

</div>
</div>

<div v-click="5" class="pt-4 text-center text-sm opacity-80">
Le point d'extension de Redux — c'est ici que vit l'<b>asynchrone</b> : <code>redux-thunk</code>, devtools, persistance…
</div>

<!--
Les middlewares. Tout le flux trinité est synchrone ; les middlewares sont LE point d'extension
de Redux. Ils wrappent dispatch : l'action traverse chaque middleware enregistré, dans l'ordre,
avant d'atteindre le reducer. Signature curryfiée store => next => action. On appelle next(action)
pour passer au maillon suivant — mais comme on peut écrire du code après next(), on agit aussi
APRÈS que le reducer a tourné (d'où le « avant / après » du logger). Très puissant : intercepter,
transformer, bloquer, ou dispatcher d'autres actions. C'est là que vit l'asynchrone (redux-thunk),
le logging, les devtools, la persistance. RTK fournit createAsyncThunk par-dessus ce mécanisme
(slide RTK suivante).
-->

---

# Thunks : la logique à effets de bord

<div class="text-sm opacity-80 pb-1 text-center">Le reducer doit rester <b>pur</b>. Les effets de bord et la logique impérative vivent dans un <b>thunk</b> : une fonction dispatchée, qui reçoit <code>dispatch</code> et <code>getState</code>.</div>

<div class="grid grid-cols-2 gap-8 pt-4 items-center">
<div>

```ts {all|2|3-4|6-7|8}
// on dispatche une fonction, pas un objet
const shareTrip = (id) => (dispatch, getState) => {
  const trip = getState().trips.find((t) => t.id === id)
  if (!trip) return
                                              // effets de bord :
  navigator.clipboard.writeText(trip.url)     //  presse-papier
  analytics.track('trip_shared', { id })      //  télémétrie
  dispatch({ type: 'ui/toast', payload: 'Lien copié' })
}
```

</div>
<div>

<!-- reducer pur vs thunk -->
<div v-click="5" class="flex justify-center gap-3 text-xs pb-4">
<span class="border border-gray-600 rounded px-3 py-1.5 text-center">Reducer<br><span class="opacity-60">pur · aucun effet</span></span>
<span class="border-2 border-orange-500 rounded px-3 py-1.5 text-center">Thunk<br><span class="opacity-60">effets autorisés</span></span>
</div>

<v-clicks at="6">

- `getState()` → lit l'état courant pour **décider**
- exécute les **effets de bord** : I/O, navigation, télémétrie…
- `dispatch` **une ou plusieurs** actions, conditionnellement

</v-clicks>

</div>
</div>

<div v-click="9" class="pt-3 text-center text-sm opacity-80">
Le cas d'usage <b>historique</b> du thunk était le <b>fetch de données</b> — aujourd'hui largement <span v-mark.orange>déprécié par TanStack Query</span>.
</div>

<div v-click="10" class="pt-2 text-center text-sm">
<span class="opacity-60">même résultat, deux philosophies :</span> le thunk reste <b>impératif</b> (on orchestre les étapes), là où TanStack Query est <b>déclaratif</b> (on décrit, il gère).
</div>

<!--
Thunks, vus côté effets de bord. Rappel : le reducer doit être PUR (pas d'I/O, pas d'aléatoire,
pas d'horloge). Où vit alors la logique impérative et les effets ? Dans un thunk : grâce au
middleware redux-thunk, on dispatche une FONCTION au lieu d'un objet. Elle reçoit (dispatch,
getState) → elle peut lire l'état courant pour décider, exécuter des effets de bord (presse-papier,
navigation, télémétrie, storage, websockets…), puis dispatcher une ou plusieurs actions, le tout
de façon conditionnelle. Exemple shareTrip : lit le trip dans le state, copie son URL, log un
event analytics, déclenche un toast. C'est de l'orchestration impérative, pas du data-fetching.

DEUX POINTS À MARTELER :
1. Historique : à l'origine, LE cas d'usage du thunk, c'était le fetch de données async
   (dispatch pending → await → fulfilled/rejected). Ce cas est aujourd'hui largement déprécié
   par TanStack Query (ch. 3, état serveur), bien plus adapté.
2. Impératif vs déclaratif : TanStack Query ferait la même chose, mais en DÉCLARATIF — on décrit
   la query (clé + fetcher) et la lib gère loading/cache/refetch. Le thunk, lui, est IMPÉRATIF :
   on écrit pas-à-pas les étapes et les dispatch. C'est précisément ce caractère impératif qui le
   rend pertinent pour l'orchestration d'effets de bord côté client (pas pour du data-fetching).
RTK fournit aussi createAsyncThunk, mais ce n'est plus le cœur de l'intérêt ici.
-->

---

# `react-redux` : les bindings

<div class="text-sm opacity-80 pb-1 text-center">Redux est un store <b>agnostique du framework</b> : un objet JS + <code>subscribe</code>. Pour le brancher à React, il faut une couche de <b>bindings</b>.</div>

<!-- store agnostique → pont react-redux → composants -->
<div class="flex justify-center items-center gap-3 text-sm py-4">
<div class="border border-gray-600 rounded-lg px-4 py-2 text-center">🗄️ Store Redux<div class="text-xs opacity-60 pt-0.5">objet JS · agnostique</div></div>
<div class="flex flex-col items-center text-xs opacity-60"><span class="font-mono">react-redux</span><span class="text-lg leading-none">↔</span></div>
<div class="border-2 border-orange-500 rounded-lg px-4 py-2 text-center">⚛️ Composants React</div>
</div>

<div class="grid grid-cols-2 gap-8 pt-2 items-center">
<div>

```tsx
<Provider store={store}>
  <App />
</Provider>

function TripCount() {
  const n = useSelector((s) => s.trips.length)
  const dispatch = useDispatch()
  return <button onClick={() => dispatch(addTrip())}>{n}</button>
}
```

</div>
<div>

<v-clicks>

- `<Provider store>` → rend le store dispo dans l'arbre
- `useSelector` → s'abonne à une **part** du state
- `useDispatch` → renvoie `dispatch` pour **émettre** des actions

</v-clicks>

</div>
</div>

<!--
react-redux, les bindings. Point clé : Redux EN SOI ne sait rien de React. C'est un store pur,
agnostique du framework — un objet JS exposant getState / dispatch / subscribe. On pourrait
brancher subscribe sur sa propre fonction de rendu. Pour React, on utilise la lib de bindings
react-redux, qui fait le pont (via le Context). Trois pièces modernes : <Provider store> place le
store dans l'arbre ; useSelector(s => part) abonne le composant à une part du state et le re-render
quand cette part change (comparaison par référence === → interdiction des objets/tableaux littéraux,
cf. slide réputation/perf) ; useDispatch() renvoie dispatch pour émettre des actions. Historiquement
c'était l'API connect() (HOC mapState/mapDispatch → props), associée aux composants de classe,
aujourd'hui dépréciée au profit des hooks. C'est ce qui complète enfin la boucle vers React qu'on
avait volontairement retirée de la slide « sainte trinité ».
-->

---

# Dériver les valeurs autant que possible

<div class="text-sm opacity-80 pb-1 text-center">Ne stocker que la <b>source de vérité</b> ; tout ce qui s'en <b>déduit</b> se calcule dans un sélecteur.</div>

<div class="grid grid-cols-2 gap-6 pt-3 text-xs items-start">

<div>
<div class="opacity-50 uppercase tracking-widest pb-1">❌ Store inutilement rempli de données dérivées</div>

```ts
{
  trips: [paris, tokyo],
  tripCount: 2,            // dupliqué
  totalBudget: 4200,       // dupliqué
  activeTrips: [tokyo],    // dupliqué
}
```

<div class="opacity-70 pt-2">Chaque action doit <b>maintenir</b> ces champs en cohérence → risque de <span v-mark.orange>désync</span>.</div>

</div>

<div v-click="1">
<div class="opacity-50 uppercase tracking-widest pb-1">✅ Store minimal + sélecteurs</div>

```ts
{ trips: [paris, tokyo] }  // une seule vérité

// le dérivé vit dans des sélecteurs
const selectCount  = (s) => s.trips.length
const selectBudget = (s) =>
  s.trips.reduce((n, t) => n + t.cost, 0)
const selectActive = (s) =>
  s.trips.filter((t) => t.active)
```

<div class="opacity-70 pt-2">Le dérivé est <b>toujours juste</b> : recalculé depuis la source.</div>

</div>

</div>

<div v-click="2" class="pt-3 text-center text-sm opacity-80">
Moins d'état = moins d'actions, moins de bugs.
</div>

<!--
Principe fondateur avant les bonnes pratiques de useSelector : « lean store, fat selectors ».
On ne met dans le store QUE la source de vérité (état normalisé, minimal). Tout ce qui se
déduit — compteurs, totaux, listes filtrées/triées — ne se stocke PAS : ça se calcule à la
lecture, dans un sélecteur. Stocker le dérivé, c'est dupliquer une information : il faut alors
le re-synchroniser à chaque action concernée, et le moindre oubli = désync (le compteur ne
correspond plus à la liste). À l'inverse, un dérivé calculé depuis la source est toujours juste.
Bénéfice : store plus petit, moins d'actions à écrire, moins de surface de bug. Transition
naturelle vers la slide suivante : ces sélecteurs « gras » deviennent le point de perf à
soigner (lecture ciblée, références stables, mémoïsation via createSelector).
-->

---

# `useSelector` : les bonnes pratiques

<div class="text-sm opacity-80 pb-1 text-center">Le sélecteur tourne après <b>chaque</b> dispatch ; le composant re-render si le résultat change (comparaison <code>===</code>).</div>

<div class="grid grid-cols-2 gap-6 pt-3 text-xs">

<div>
<div class="opacity-50 uppercase tracking-widest pb-1">1 · Lire le strict minimum</div>

```ts
// ❌ s'abonne à TOUT le store
const state = useSelector((s) => s)

// ✅ une part précise → re-render ciblé
const count = useSelector((s) => s.trips.length)
```

</div>

<div v-click="1">
<div class="opacity-50 uppercase tracking-widest pb-1">2 · Pas de nouvelle référence</div>

```ts
// ❌ nouvel objet/array à chaque appel
//    → !== → re-render à CHAQUE dispatch
const { a, b } = useSelector((s) => ({ a, b }))

// ✅ un useSelector par valeur primitive
const a = useSelector((s) => s.a)
const b = useSelector((s) => s.b)
```

</div>

</div>

<div class="grid grid-cols-2 gap-6 pt-3 text-xs">

<div v-click="2">
<div class="opacity-50 uppercase tracking-widest pb-1">3 · Comparaison adaptée</div>

```ts
// si on doit renvoyer un objet/array :
import { shallowEqual } from 'react-redux'

const trips = useSelector(
  (s) => s.trips.filter((t) => t.active),
  shallowEqual, // 2e arg : equalityFn
)
```

</div>

<div v-click="3">
<div class="opacity-50 uppercase tracking-widest pb-1">4 · Mémoïser le dérivé</div>

```ts
// calcul coûteux → createSelector (reselect)
const selectBudget = createSelector(
  (s) => s.trips,
  (trips) => trips.reduce((n, t) => n + t.cost, 0),
)
const budget = useSelector(selectBudget)
```

</div>

</div>

<div v-click="4" class="pt-3 text-center text-sm opacity-80">
Sélecteur = <span v-mark.orange>petit, pur, stable</span>. Clé de la réactivité fine.
</div>

<!--
useSelector mérite sa slide : c'est le point de perf #1 côté lecture. (1) On lit le strict
minimum : un sélecteur large = abonnement large = re-render inutiles. (2) PIÈGE classique :
renvoyer un objet/tableau littéral. useSelector compare le résultat précédent et le nouveau
en === (référence) ; un littéral est recréé à chaque rendu → toujours !== → re-render à chaque
dispatch, même sans changement réel. Parade simple : un useSelector par primitive. (3) Si on
doit vraiment renvoyer une structure (liste filtrée), passer en comparaison superficielle
en passant shallowEqual en 2e argument de useSelector (l'equalityFn). (4) Pour un dérivé coûteux, le
mémoïser avec createSelector (reselect) : recalcule seulement si les entrées changent. Règle :
sélecteur petit, pur, stable.
-->

---

# `useDispatch` : émettre une action

<div class="text-sm opacity-80 pb-1 text-center">Le pendant de <code>useSelector</code> : il renvoie <code>dispatch</code>, à qui on passe une <b>action</b> (ou un <b>thunk</b>).</div>

<div class="grid grid-cols-2 gap-6 pt-3 text-xs items-start">

<div>
<div class="opacity-50 uppercase tracking-widest pb-1">On dispatche…</div>

```ts
const dispatch = useDispatch()

// …une action (objet)
dispatch({ type: 'trips/cleared' })
dispatch(addTrip(paris))

// …ou un thunk (fonction)
dispatch(shareTrip(id))
```

</div>

<div v-click="1">
<div class="opacity-50 uppercase tracking-widest pb-1">Jamais au rendu</div>

```ts
function Trips({ error }) {
  const dispatch = useDispatch()

  // ❌ au fil du rendu → boucle de re-render
  if (error) dispatch(showToast(error))

  // ✅ réagir à un changement → useEffect
  useEffect(() => {
    if (error) dispatch(showToast(error))
  }, [error])
}
```

</div>

</div>

<div v-click="2" class="pt-3 text-center text-sm opacity-80">
Dispatcher est un <span v-mark.orange>effet de bord</span> : déclenché par un événement, jamais au fil du rendu.
</div>

<!--
useDispatch, le pendant de useSelector. Peu à dire : il renvoie la fonction dispatch, à
laquelle on passe une action (objet) ou un thunk (fonction). Le SEUL vrai piège : dispatcher
modifie le store → c'est un effet de bord. Donc jamais au niveau racine du composant (au fil
du rendu) : ça déclenche un re-render, qui re-dispatche → boucle infinie. Toujours depuis un
gestionnaire d'événement (onClick…) ou, à défaut, un useEffect. Même règle mentale que setState :
on ne mute pas l'état pendant qu'on calcule le rendu.
-->

---

# Le problème avec Redux

<div class="text-sm opacity-80 pb-1 text-center">D'abord, trois reproches faits à l'<b>outil</b> — le Redux <b>« classique »</b>, écrit à la main :</div>

<div class="grid grid-cols-3 gap-4 pt-2 items-start">

<div v-click>
<div class="border border-gray-600 rounded-lg p-3 h-full">
<div class="text-sm italic pb-2">« Configurer un store Redux est <b>trop compliqué</b>. »</div>

```ts
const store = createStore(
  combineReducers({ trips, user }),
  compose(applyMiddleware(thunk),
    devToolsEnhancer()),
)
```

</div>
</div>

<div v-click>
<div class="border border-gray-600 rounded-lg p-3 h-full">
<div class="text-sm italic pb-2">« Je dois ajouter <b>plein de packages</b> pour que Redux fasse quoi que ce soit d'utile. »</div>

<div class="flex flex-wrap gap-1.5 text-xs font-mono pt-1">
<span class="border border-gray-600 rounded px-1.5 py-0.5">redux</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">react-redux</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">redux-thunk</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">reselect</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">redux-persist</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">redux-devtools</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">redux-logger</span>
</div>
</div>
</div>

<div v-click>
<div class="border border-gray-600 rounded-lg p-3 h-full">
<div class="text-sm italic pb-2">« Redux demande <b>trop de boilerplate</b>. »</div>

```ts
// 3 fichiers pour 1 action
const ADD = 'trips/added'
const addTrip = (t) =>
  ({ type: ADD, payload: t })
case ADD:
  return { ...s,
    trips: [...s.trips, t] }
```

</div>
</div>

</div>

<div v-click class="pt-4 grid grid-cols-2 gap-6 items-center">
<div>
<div class="border-2 border-orange-500 rounded-lg p-3">
<div class="text-sm italic pb-2">« On finit par <b>tout</b> mettre dans le store → un état énorme, brouillon, ingérable. »</div>

```ts
{ trips, user, ui, modals, forms, cache,
  pagination, theme, toasts, isLoading, … }
```

</div>
</div>
<div v-click>

💡 Redux date de **2015**. Beaucoup d'apps écrites *avant* les bonnes pratiques d'aujourd'hui :

<div class="text-xs opacity-70">

- l'état serveur vit dans un cache réseau, **pas** dans le store
- l'état d'URL vit dans l'**URL**
- le dérivé se **recalcule** dans des sélecteurs

</div>

<div class="text-sm pt-2">Le store fourre-tout est un <span v-mark.orange>mésusage historique</span>, pas une fatalité de Redux.</div>

</div>
</div>

<!--
Slide réputation, en deux temps.
TEMPS 1 — trois reproches faits à l'OUTIL (le Redux classique, écrit à la main). Ce sont
littéralement les trois motivations citées par la doc Redux Toolkit, qu'on illustre au lieu
de les asséner :
1. « Configurer un store est trop compliqué » → cérémonie createStore + combineReducers +
   compose(applyMiddleware(thunk), devtools), tout câblé à la main.
2. « Trop de packages pour être utile » → Redux nu ne fait presque rien ; il faut empiler
   react-redux, redux-thunk, reselect, redux-persist, redux-devtools, redux-logger… (chips).
3. « Trop de boilerplate » → une action triviale = constante de type + action creator + case
   de reducer, éparpillés sur ~3 fichiers pour une seule ligne utile.
TEMPS 2 — un reproche d'USAGE : à force, tout finit dans le store (état serveur, formulaires,
UI, flags de chargement…) → un état géant, illisible, non maintenable. NUANCE / réponse : ce
n'est pas une fatalité de Redux mais un effet de son ÂGE. Redux a 10 ans (2015) ; énormément
d'apps ont été écrites avant que les bonnes pratiques actuelles n'existent — état serveur dans
un cache réseau (TanStack Query, ch.3), état d'URL dans l'URL (ch.2), dérivé recalculé via
sélecteurs, store découpé en slices. Le « store fourre-tout » est un mésusage historique.
Pas de pivot vers RTK ici (demande explicite) : on reste sur le constat + la nuance d'âge.
-->

---

# Redux Toolkit (RTK)

<div class="text-sm opacity-80 pb-1 text-center"><b>RTK</b> : boîte à outils <b>officielle</b>, « batteries incluses », pour utiliser Redux.<br><span class="opacity-60">Recommandé comme la <b>seule</b> façon d'écrire du Redux aujourd'hui.</span></div>

<div class="grid grid-cols-3 gap-4 pt-1 items-start">

<div v-click>
<div class="border border-gray-600 rounded-lg p-3 h-full">
<div class="text-xs opacity-50 italic pb-1">« configurer un store est trop compliqué »</div>
<div class="text-sm font-bold pb-2 text-orange-400">→ <code>configureStore</code></div>

```ts
const store = configureStore({
  reducer: { trips, user },
})
// thunk + DevTools : inclus
```

</div>
</div>

<div v-click>
<div class="border border-gray-600 rounded-lg p-3 h-full">
<div class="text-xs opacity-50 italic pb-1">« trop de packages »</div>
<div class="text-sm font-bold pb-2 text-orange-400">→ batteries incluses</div>

<div class="text-center text-xs font-mono pb-2 opacity-80">npm i @reduxjs/toolkit</div>
<div class="text-xs opacity-50 pb-1 text-center">tout est dedans :</div>
<div class="flex flex-wrap gap-1.5 justify-center text-xs font-mono">
<span class="border border-gray-600 rounded px-1.5 py-0.5">immer</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">reselect</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">redux-thunk</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">devtools</span>
<span class="border border-gray-600 rounded px-1.5 py-0.5">RTK Query</span>
</div>

</div>
</div>

<div v-click>
<div class="border border-gray-600 rounded-lg p-3 h-full">
<div class="text-xs opacity-50 italic pb-1">« trop de boilerplate »</div>
<div class="text-sm font-bold pb-2 text-orange-400">→ <code>createSlice</code></div>

```ts
createSlice({
  name: 'trips',
  initialState: [],
  reducers: {
    addTrip: (s, a) =>
      { s.push(a.payload) }, // immer
  },
})
```

</div>
</div>

</div>

<div v-click class="pt-3 text-center text-sm">
Un <code>createSlice</code> = state + reducers + <b>actions générées</b>, colocalisés ; l'immuabilité s'écrit « <span v-mark.orange>en mutant</span> » grâce à Immer.
</div>

<!--
Slide d'intro RTK, conçue en diptyque avec la slide réputation précédente : à chaque reproche,
sa réponse, dans la même grille 3 colonnes pour la rime visuelle.
RTK = Redux Toolkit, la boîte à outils OFFICIELLE et opinionated de l'équipe Redux. Point clé à
dire : ce n'est plus « une option » — la doc Redux la présente comme LA façon d'écrire du Redux
aujourd'hui si on part de 0 (createStore brut est déconseillé). Sur une app legacy la migration progressive est possible.
Réponses aux 3 reproches :
1. Config compliquée → configureStore : un seul appel, reducer en objet (combineReducers
   implicite), redux-thunk + Redux DevTools branchés PAR DÉFAUT (defaults sains).
2. Trop de packages → un seul install @reduxjs/toolkit embarque immer, reselect, redux-thunk,
   la config devtools, et RTK Query (data fetching) en option.
3. Trop de boilerplate → createSlice colocalise nom + état initial + reducers, et GÉNÈRE les
   action creators + types automatiquement (slice.actions.addTrip). Grâce à Immer, on écrit des
   updates « mutatives » (s.push) qui produisent en réalité un nouvel état immuable.
Chute : le modèle mental Redux (action → reducer → store) ne change pas — RTK supprime juste la
cérémonie autour. Enchaîner ensuite sur le détail de createSlice / le bilan Redux si besoin.
-->

---

# `configureStore`

<div class="text-sm opacity-80 pb-1 text-center">Un <b>seul appel</b> remplace tout le câblage manuel de <code>createStore</code> — avec des <b>defaults sains</b>.</div>

<div class="grid grid-cols-2 gap-6 pt-3 text-xs items-start">

<div>
<div class="opacity-50 uppercase tracking-widest pb-1">❌ Redux classique</div>

```ts
const store = createStore(
  combineReducers({ trips, user }),
  compose(
    applyMiddleware(thunk),
    devToolsEnhancer(),
  ),
)
```

</div>

<div v-click="1">
<div class="opacity-50 uppercase tracking-widest pb-1">✅ RTK — configureStore</div>

```ts
const store = configureStore({
  reducer: { trips, user },  // combineReducers implicite
})
// thunk, DevTools, vérifs dev : inclus
```

</div>

</div>

<div class="grid grid-cols-3 gap-3 pt-5 text-xs">
<div v-click="2" class="border border-gray-600 rounded-lg p-3">🧩 <b><code>combineReducers</code> implicite</b> — un <code>reducer</code> en objet, une slice par clé</div>
<div v-click="3" class="border border-gray-600 rounded-lg p-3">⚙️ <b>middlewares par défaut</b> — thunk + vérifs d'immuabilité &amp; de sérialisabilité (en dev)</div>
<div v-click="4" class="border border-gray-600 rounded-lg p-3">🔌 <b>Redux DevTools</b> branchés automatiquement</div>
</div>

<!--
Zoom sur configureStore, après la slide d'intro RTK. C'est la réponse concrète au reproche
« configurer un store est trop compliqué ». Diptyque gauche/droite : à gauche le câblage manuel
de Redux classique (createStore + combineReducers + compose(applyMiddleware(thunk), devtools)),
à droite le même résultat en un seul appel.
Ce que configureStore fait POUR nous (les 3 cartes) :
1. combineReducers implicite : on passe reducer comme un objet { clé: reducerDeSlice }, RTK combine
   automatiquement → chaque clé devient une branche du state.
2. middlewares par défaut (getDefaultMiddleware) : redux-thunk est inclus, plus deux vérifs DEV
   très utiles — immutableStateInvariant (détecte une mutation accidentelle hors Immer) et
   serializableStateInvariant (détecte une valeur non sérialisable, ex. une Date / une Map, qui
   casserait le time-travel). Ces checks sont désactivés en prod (coût nul).
3. Redux DevTools : branchés automatiquement, plus besoin du compose/enhancer manuel.
Personnalisation : on n'écrase JAMAIS la liste des middlewares — on part de getDefault() et on
.concat() les siens, pour ne pas perdre thunk + les vérifs. devTools accepte un booléen (souvent
conditionné à l'environnement). preloadedState existe aussi (hydratation SSR / état initial).
Enfin, le bonus TypeScript : on dérive RootState et AppDispatch directement du store (ReturnType),
sans les écrire à la main → typages exacts pour useSelector / useDispatch (via des hooks typés).
Chute : on garde toutes les garanties de Redux, sans la cérémonie.
-->

---

# Immer : l'immuabilité « en mutant »

<div class="text-sm opacity-80 pb-1 text-center">Écrire une mise à jour comme une <b>mutation</b>, obtenir un <b>nouvel état immuable</b>. C'est ce qui fait tourner <code>createSlice</code>.</div>

<div class="grid grid-cols-2 gap-6 pt-3 text-xs items-start">

<div>
<div class="opacity-50 uppercase tracking-widest pb-1">❌ Immutable</div>

```ts
return {
  ...state,
  trips: state.trips.map((t) =>
    t.id === id
      ? { ...t, budget: { ...t.budget, total: n } }
      : t),
}
```

</div>

<div v-click="1">
<div class="opacity-50 uppercase tracking-widest pb-1">✅ Immer : mutabilité d'un draft</div>

```ts
produce(state, (draft) => {
  const t = draft.trips.find((t) => t.id === id)
  t.budget.total = n
})
```

</div>

</div>

<div v-click="2" class="pt-4 text-center text-sm opacity-80">
Immer passe un <b>draft</b> (un Proxy) : on le modifie librement, il en déduit le <span v-mark.orange>nouvel état immuable</span>.
</div>

<div v-click="3" class="text-sm opacity-80 pt-5 pb-2 text-center">Pas réservé à RTK — Immer est une <b>lib autonome</b> :</div>

<div class="grid grid-cols-3 gap-3 text-xs">
<div v-click="4" class="border-2 border-orange-500 rounded-lg p-3">⚡ <b>RTK</b> — déjà intégré, <code>createSlice</code> l'utilise sans rien installer</div>
<div v-click="5" class="border border-gray-600 rounded-lg p-3">🗄️ <b>Redux classique</b> — <code>npm i immer</code>, on enveloppe le reducer avec <code>produce</code></div>
<div v-click="6" class="border border-gray-600 rounded-lg p-3">⚛️ <b>React natif</b> — pareil avec <code>useState</code> / <code>useReducer</code> (ou <code>use-immer</code>)</div>
</div>

<!--
Slide Immer, juste après configureStore. On a vu createSlice écrire des updates « mutatives »
(s.push) : cette slide explique la mécanique derrière, et surtout qu'elle n'est PAS propre à RTK.
Le problème : en immuable, mettre à jour un état profondément imbriqué au spread devient vite
illisible et fragile (cascade de ...spread, un oubli = mutation accidentelle ou perte de branche).
Immer : on appelle produce(state, draft => { ... }) et on modifie le draft comme un objet normal.
Le draft est un Proxy qui enregistre les changements ; à la sortie, Immer produit un NOUVEL état
immuable (structural sharing : les branches non touchées sont réutilisées). On écrit du code
« mutatif », on obtient de l'immuable — sans spread.
POINT CLÉ à marteler : Immer est une lib INDÉPENDANTE, pas un truc RTK.
- RTK l'embarque : createSlice enveloppe déjà chaque reducer dans produce → rien à installer.
- Redux classique : npm i immer, et on wrappe son reducer existant avec produce (ou on l'utilise
  ponctuellement dans un case).
- React natif : exactement pareil — setState(produce(s, draft => {...})) sur un useState/useReducer.
  Le package use-immer fournit useImmer / useImmerReducer pour le rendre ergonomique.
Chute : « écrire en mutant, rester immuable » est un outil transversal, pas une fonctionnalité Redux.
-->

---

# `createSlice`

<div class="text-sm opacity-80 pb-1 text-center">Nom + état initial + reducers au même endroit → RTK <b>génère</b> les actions et le reducer.</div>

<div class="grid grid-cols-2 gap-6 pt-3 text-xs items-start">

<div>
<div class="opacity-50 uppercase tracking-widest pb-1">On déclare une slice</div>

```ts
const tripsSlice = createSlice({
  name: 'trips',
  initialState: [],
  reducers: {
    addTrip:    (s, a) => { s.push(a.payload) },  // immer
    removeTrip: (s, a) =>
      s.filter((t) => t.id !== a.payload),
  },
})
```

</div>

<div v-click="1">
<div class="opacity-50 uppercase tracking-widest pb-1">RTK génère tout le reste</div>

```ts
// action creators + types, dérivés des clés
export const { addTrip, removeTrip } = tripsSlice.actions
addTrip(paris)      // { type: 'trips/addTrip', payload }

// le reducer, prêt pour le store
export default tripsSlice.reducer
```

</div>

</div>

<div class="grid grid-cols-3 gap-3 pt-5 text-xs">
<div v-click="2" class="border border-gray-600 rounded-lg p-3">🏷️ <b>type auto</b> — <code>'{name}/{clé}'</code>, plus de constantes à la main</div>
<div v-click="3" class="border border-gray-600 rounded-lg p-3">📦 <b>colocalisé</b> — état, reducers et actions dans <b>un</b> fichier</div>
<div v-click="4" class="border border-gray-600 rounded-lg p-3">🔗 <b><code>extraReducers</code></b> — réagir aux thunks &amp; aux actions d'autres slices</div>
</div>

<div v-click="5" class="pt-5 text-center text-sm opacity-80">
Une action triviale passe de <b>~3 fichiers</b> à <span v-mark.orange>une fonction</span> — sans changer le modèle Redux.
</div>

<!--
Slide createSlice, après Immer (dont elle se sert). C'est la réponse au reproche « trop de
boilerplate » : on déclare une slice et RTK fabrique le reste.
Anatomie : name (préfixe des types), initialState, et reducers — un objet de fonctions
(state, action) où, grâce à Immer, on écrit des updates « mutatives » (s.push) OU on renvoie un
nouvel état (le filter de removeTrip). Les deux styles sont permis : muter le draft, ou return
une nouvelle valeur — jamais les deux dans le même reducer.
Ce que createSlice GÉNÈRE :
- slice.actions : un action creator par clé de reducers (addTrip, removeTrip), avec le type
  automatiquement préfixé → 'trips/addTrip'. Plus de constante de type ni d'action creator à la main.
- slice.reducer : le reducer de la slice, qu'on passe à configureStore({ reducer: { trips:
  tripsSlice.reducer } }).
extraReducers (3e carte) : pour répondre à des actions définies AILLEURS — les états d'un
createAsyncThunk (pending/fulfilled/rejected) ou une action d'une autre slice (couplage inter-domaines).
À distinguer de reducers (qui, lui, génère des actions). On le mentionne, on n'entre pas dans le détail.
Chute : l'action triviale qui demandait ~3 fichiers (constante + creator + case) tient en une
fonction nommée — le modèle mental action → reducer → store est INCHANGÉ, seul le boilerplate disparaît.
-->

---

# RTK Query

<div class="text-sm opacity-80 pb-1 text-center">La couche <b>data-fetching</b> incluse dans RTK : un cache d'<b>état serveur</b>, déclaratif, logé dans le store.</div>

<div class="grid grid-cols-2 gap-6 pt-3 text-xs items-start">

<div>
<div class="opacity-50 uppercase tracking-widest pb-1">On décrit ses endpoints</div>

```ts
const tripsApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Trip'],
  endpoints: (build) => ({
    getTrips: build.query({
      query: () => '/trips',
      providesTags: ['Trip'],
    }),
    addTrip: build.mutation({
      query: (t) => ({ url: '/trips', method: 'POST', body: t }),
      invalidatesTags: ['Trip'],   // → refetch auto
    }),
  }),
})
```

</div>

<div v-click="1">
<div class="opacity-50 uppercase tracking-widest pb-1">RTK génère les hooks</div>

```tsx
export const { useGetTripsQuery, useAddTripMutation } = tripsApi

function Trips() {
  const { data, isLoading, error } = useGetTripsQuery()
  const [addTrip] = useAddTripMutation()
  // …
}
```

</div>

</div>

<div class="grid grid-cols-3 gap-3 pt-4 text-xs">
<div v-click="2" class="border border-gray-600 rounded-lg p-3">🪝 <b>hooks générés</b> — un par endpoint, <code>data / isLoading / error</code></div>
<div v-click="3" class="border border-gray-600 rounded-lg p-3">⚡ <b>cache, dédup &amp; refetch</b> — comme TanStack Query, sans l'écrire</div>
<div v-click="4" class="border border-gray-600 rounded-lg p-3">🏷️ <b>invalidation par tags</b> — une mutation rafraîchit les queries liées</div>
</div>

<div v-click="5" class="pt-5 text-center text-sm opacity-80">
C'est de l'<b>état serveur</b> (ch. 3) — même rôle que <span v-mark.orange>TanStack Query</span>, à privilégier si l'app vit déjà dans Redux.
</div>

<!--
Slide RTK Query, dernière brique de la boîte RTK. Point de cadrage essentiel, à relier au ch. 3 :
ce n'est PAS du state client — c'est de l'ÉTAT SERVEUR. RTK Query est la réponse de l'écosystème
Redux au même problème que TanStack Query / SWR / Convex : récupérer, mettre en cache et
synchroniser de la donnée distante. La différence : le cache vit dans le store Redux (inspectable
dans les DevTools, cohérent avec le reste de l'app Redux).
Mécanique : createApi — on déclare un baseQuery (fetchBaseQuery = petit wrapper fetch) et un set
d'endpoints, soit des query (lecture) soit des mutation (écriture). RTK GÉNÈRE alors un hook par
endpoint : useGetTripsQuery(), useAddTripMutation(). Le hook de query renvoie data/isLoading/error/
isFetching ; le hook de mutation renvoie un trigger + son état.
Ce qu'on obtient gratuitement (cartes) : cache normalisé, déduplication des requêtes, refetch
(focus/reconnect/polling) — exactement le boulot de TanStack Query. Et l'invalidation par TAGS :
une query providesTags(['Trip']), une mutation invalidatesTags(['Trip']) → après l'écriture, RTKQ
refetch automatiquement les queries concernées. Plus de gestion manuelle du cache.
Chute / recommandation : comme c'est de l'état serveur, le vrai choix se fait au ch. 3. RTK Query
est l'option pertinente si l'app est DÉJÀ investie dans Redux (un seul écosystème, un seul cache,
mêmes DevTools) ; sinon, TanStack Query reste le défaut côté React. Ne PAS mettre de l'état serveur
dans des slices à la main : c'est précisément le mésusage historique dénoncé plus tôt.
-->

---

# `Redux` + RTK — bilan

<Bilan
  :scores="[2, 2, 4, 5, 5]"
  poids="≈ 14 kB (gzip, RTK + react-redux)"
  perimetre="gros état client complexe"
  idealPour="les grosses apps où traçabilité, outillage et conventions partagées priment"
  :avantages="[
    'DevTools inégalés — time-travel, inspection, replay',
    'Structure imposée → cohérence à grande échelle, en équipe',
    'RTK supprime le boilerplate : configureStore, createSlice, Immer',
    'Écosystème mûr : RTK Query, middlewares, reselect',
  ]"
  :limites="[
    'Courbe d\'apprentissage : plus de concepts qu\'un simple hook',
    'Plus verbeux et plus lourd que Zustand',
    'Pas de concurrent rendering (useSyncExternalStore)',
    'Surdimensionné pour la majorité des apps',
  ]"
/>

<!--
Bilan Redux + RTK, en miroir du bilan Zustand (mêmes axes, sur 5 : prise en main, poids, perf,
écosystème, montée en charge).
Scores : prise en main 2 (le plus de concepts à intégrer — action/reducer/store/middleware/thunk ;
RTK adoucit mais la courbe reste réelle), poids 2 (RTK + react-redux ≈ 14 kB gzip, loin des ~500 B
de Zustand), perf 4 (sélecteurs + reselect = lecture ciblée, mais re-renders à surveiller),
écosystème 5 (le plus mûr et le mieux outillé de tout le chapitre — RTK Query, middlewares,
devtools), montée en charge 5 (structure imposée + traçabilité = la valeur sûre sur gros projet
et en équipe).
Idéal pour : les grosses apps à fort état client où la traçabilité, l'outillage et des conventions
partagées comptent plus que la concision. Limite à marteler : pour la MAJORITÉ des apps, c'est
surdimensionné — Zustand (ou les chapitres précédents) suffit. Et toujours : ne pas y mettre l'état
serveur (RTK Query / TanStack Query) ni l'état d'URL.
-->

