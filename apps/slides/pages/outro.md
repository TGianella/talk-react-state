---
layout: section
---

# Conclusion

---
layout: center
---

# Le compromis fondamental

<div class="text-center opacity-70 pt-2">Toute solution de store doit sacrifier <b>une</b> de ces trois propriétés :</div>

<div class="grid grid-cols-3 gap-4 pt-8">
<div v-click class="border-2 border-orange-500 rounded-lg p-5 text-center">
<div class="text-3xl">🎯</div>
<b>Réactivité fine</b>
<div class="text-xs opacity-60 pt-1">re-render seulement ce qui change</div>
</div>
<div v-click class="border-2 border-orange-500 rounded-lg p-5 text-center">
<div class="text-3xl">⏸️</div>
<b>Concurrent rendering</b>
<div class="text-xs opacity-60 pt-1">React peut interrompre un render</div>
</div>
<div v-click class="border-2 border-orange-500 rounded-lg p-5 text-center">
<div class="text-3xl">🧩</div>
<b>Pas de tearing</b>
<div class="text-xs opacity-60 pt-1">UI toujours cohérente</div>
</div>
</div>

<div v-click class="pt-8 text-center text-2xl font-bold">
On n'en garde que <span v-mark.circle.orange>deux sur trois.</span>
</div>

<!--
Le cadre théorique pour ranger TOUTES les solutions. useSyncExternalStore (store
externe) → réactivité fine + pas de tearing, mais sync → perd parfois le concurrent
rendering. Context → concurrent OK mais pas de réactivité fine. Voir interbolt.org
sur le tearing, et le thread de Tanner Linsley.
-->

---

# Le bon état, le bon outil

<div class="text-sm pt-2">

| Type d'état | Exemple WanderState | Outil |
|---|---|---|
| **Local / éphémère** | dropdown, champ de formulaire | `useState` |
| **Partagé (sous-arbre)** | voyage courant + étapes | `useContext` + `useReducer` |
| **URL** | voyage ouvert, vue active | `nuqs` |
| **Serveur (async)** | voyages persistés, cache | TanStack Query / Convex |
| **Global client riche** | beaucoup de state partagé | Zustand / Redux |
| **Graphe / dérivations** | wizard, dépendances en cascade | XState / MobX |

</div>

<div v-click class="pt-5 text-center text-lg">
Pas <span v-mark.orange>UN</span> outil pour tout. <span v-mark.underline.orange>Plusieurs outils simples</span>, chacun à sa place.
</div>

<!--
Le takeaway central. En connaissant les types d'état, on choisit des libs plus simples
et plus adaptées plutôt que tout gérer avec le même outil.
-->

---
layout: center
class: text-center
---

# Retour sur les idées reçues

<div class="pt-6 space-y-5 text-xl">
<div v-click>
<span class="line-through opacity-40">« Redux c'est trop lourd. »</span> → RTK + bon usage. ✅
</div>
<div v-click>
<span class="line-through opacity-40">« On peut rien faire sans Redux. »</span> → <code>useState</code>, URL, TanStack… ✅
</div>
<div v-click>
<span class="line-through opacity-40">« Toute app a besoin d'un store. »</span> → souvent, non. ✅
</div>
</div>

<div v-click class="pt-12 text-2xl font-bold">
UI = f(state). Connaissez votre state. 🧭
</div>

<div class="abs-br m-6 text-sm opacity-50">
Merci ! — Questions ?
</div>

<!--
Boucler sur les 3 idées reçues du début. Phrase finale = on revient à UI = f(state).
-->
