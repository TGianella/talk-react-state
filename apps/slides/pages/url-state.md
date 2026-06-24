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
wanderstate.app/?trip=42&view=grid
                  └──┬──┘ └───┬───┘
              quel voyage   quelle vue
```

</div>

<div class="grid grid-cols-3 gap-4 pt-8">
<div v-click class="text-center">
<div class="text-4xl">🆓</div>
<b>Gratuite</b>
<div class="text-xs opacity-60">gérée par le navigateur</div>
</div>
<div v-click class="text-center">
<div class="text-4xl">🔗</div>
<b>Partageable</b>
<div class="text-xs opacity-60">un lien rouvre le bon état</div>
</div>
<div v-click class="text-center">
<div class="text-4xl">↩️</div>
<b>Persistante</b>
<div class="text-xs opacity-60">back/forward marche tout seul</div>
</div>
</div>

<!--
Transition naturelle vers la couche réseau. Avant d'aller chercher le serveur,
rappeler que l'URL est un endroit de state gratuit, partageable, persistant.
-->

---

# `nuqs` — l'URL comme `useState`

<div class="grid grid-cols-2 gap-6 items-center">
<div>

```tsx
// au lieu de useState
const [view, setView] =
  useQueryState('view')

// modal détail d'un voyage
const [tripId, setTripId] =
  useQueryState('trip')
```

</div>
<div>

<v-clicks>

- même ergonomie que `useState`
- la valeur **vit dans l'URL**
- lien partageable ⇒ rouvre le bon voyage, la bonne vue
- back/forward du navigateur **gratuit**

</v-clicks>

</div>
</div>

<div v-click class="pt-6 text-center text-lg">
<span v-mark.underline.orange>L'URL est une source de vérité</span> — gratuite, persistante, partageable.
</div>

<!--
Démo 2 : modal détail via ?trip=<id>, toggle liste/grid via ?view=grid.
Message : avant d'inventer du state client, demandez-vous s'il ne va pas dans l'URL.
-->

