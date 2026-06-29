---
layout: center
class: text-center
---

<div class="grid grid-cols-2 gap-30 pt-10 max-w-3xl mx-auto">

<div class="flex flex-col items-center">
<img :src="'/photo-theo.png'" class="w-50 h-50 rounded-full border-2 border-orange-500 object-cover" />
<div class="text-3xl font-bold pt-5">Théo Gianella</div>
<div class="text-xl opacity-60 pt-1">Développeur Web</div>
<img :src="'Logo Zenika Horizontal_Noir.svg'" class="w-30 pt-5"/>
</div>

<div class="flex flex-col items-center">
<img :src="'/photo-yoann.jpeg'" class="w-50 h-50 rounded-full border-2 border-orange-500 object-cover" />
<div class="text-3xl font-bold pt-5">Yoann Frommelt</div>
<div class="text-xl opacity-60 pt-1">Tech Lead web</div>
<img :src="'bedrock_streaming_logo.jpeg'" class="w-15 pt-2"/>
</div>

</div>

<!--
On se présente, on peut aussi annoncer qu'on va faire des pauses toutes les heures et que les gens peuvent poser des questions quand ils veulent.
-->

---
layout: center
class: text-center
---

# 🙋 Avant de commencer

<div v-click class="text-2xl pt-8 leading-relaxed">
Quels outils de gestion de state React<br>connaissez-vous ?
</div>

<!--
Ice-breaker. Lever de main. On note ceux qui sortent… et surtout ceux qui ne sortent
jamais. Intéressant : est-ce qu'on les connaît en profondeur ?
Si personne ne cite de solution de state serveur, c'est intéressant.
-->

---

# Qu'est-ce que « l'état » ?

<div class="grid grid-cols-2 gap-8 pt-10">
<div v-click class="border border-gray-500 rounded-lg p-6">

### Programme sans état

Même entrée → même sortie.<br>Aucune mémoire.

<div class="opacity-60 text-sm pt-2">
une fonction pure · un LLM · une calculatrice
</div>

</div>
<div v-click class="border-2 border-orange-500 rounded-lg p-6">

### Programme avec état

Se souvient du passé — et <b>réagit en continu</b> aux événements extérieurs.

<div class="opacity-60 text-sm pt-2">
un éditeur de texte · un chatbot · un jeu vidéo
</div>

</div>
</div>

<div v-click class="pt-12 text-center text-xl">
Tout programme <span v-mark.underline.orange>qui tourne</span> et sert à quelque chose garde un état.
</div>

<!--
Notion universelle (tout logiciel, pas que web/React). Insister sur EN COURS D'EXÉCUTION : un
programme qui tourne et fait quelque chose d'utile garde forcément une trace de son état —
sinon c'est une fonction pure, one-shot. Sans état = même entrée → même sortie, aucune mémoire.
Avec état = se souvient du passé et réagit en continu aux événements extérieurs. Enchaîner sur :
et où vit cet état ?
-->

---

# Et sur le web ?

<div v-click class="text-center opacity-55 pt-3">
Difficile de trouver une vraie page <b>sans état</b>. 🦄
</div>

<div v-click class="text-center text-3xl font-bold pt-4">
Sur le web, <span v-mark.orange>l'état est partout.</span>
</div>

<div v-click class="text-center text-xl pt-3">
interactivité <span class="text-orange-500">→</span> état
</div>

<div v-click class="flex items-center justify-center gap-4 pt-6">

<div class="border border-gray-400 rounded-xl px-4 py-3">
<div class="text-xs uppercase tracking-widest opacity-40 pb-2">💻 Client</div>
<div class="flex flex-col gap-2">
<div class="border border-gray-500 rounded-lg px-4 py-1.5 leading-tight">
Navigateur
<div class="text-xs opacity-50">DOM · URL</div>
</div>
<div class="border-2 border-orange-500 rounded-lg px-4 py-1.5 leading-tight bg-orange-400/10">
Code applicatif
<div class="text-xs opacity-50">JS</div>
</div>
</div>
</div>

<div class="flex flex-col items-center text-orange-400">
<div class="text-3xl leading-none">⇄</div>
<div class="text-[10px] uppercase tracking-wider opacity-60 pt-1">réseau · async</div>
</div>

<div class="border border-gray-400 rounded-xl px-6 py-4 text-center">
<div class="text-3xl">🗄️</div>
<div class="pt-1">Serveur</div>
</div>

<div class="flex items-center text-orange-400 text-3xl">⇄</div>

<div class="border border-gray-400 rounded-xl px-6 py-4 text-center">
<div class="text-3xl">🛢️</div>
<div class="pt-1">Base de données</div>
</div>

</div>

<!--
Narrowing vers le web. Une vraie page sans état est l'exception (doc, Wikipédia, et encore).
Le point clé : c'est l'INTERACTIVITÉ qui crée le besoin d'état — un livre ne suit aucun état,
une page qui réagit aux actions, si. D'où : sur le web, l'état est partout (interaction, compte,
panier, thème, brouillon, cache d'API — 99 % des pages). En plus, une app web n'est pas UN
programme mais un process distribué et asynchrone (navigateur + code JS, serveur, DB), éparpillé
sur beaucoup de pièces. D'où la difficulté → le catégoriser est déjà un défi (slide suivante).
-->

---

# Comment catégoriser l'état ?

<div class="grid grid-cols-2 gap-6 pt-8">

<div v-click class="border border-gray-500 rounded-lg p-4">
<div class="text-xs uppercase tracking-widest opacity-40">Hypothèse 1</div>

### Par son contenu

<div class="text-sm opacity-70 pt-1">interaction (dropdown, formulaire)<br>vs métier (compte, panier)</div>

<div class="text-sm opacity-50 pt-3">❌ frontière floue, ça ne dit pas où le ranger</div>
</div>

<div v-click class="border border-gray-500 rounded-lg p-4">
<div class="text-xs uppercase tracking-widest opacity-40">Hypothèse 2</div>

### Par où il est lu

<div class="text-sm opacity-70 pt-1">local à un composant<br>vs partagé / global</div>

<div class="text-sm opacity-50 pt-3">❌ pas stable, un état peut finir lu partout</div>
</div>

</div>

<div v-click class="border-2 border-orange-500 rounded-lg p-4 mt-8 bg-orange-400/10 text-center max-w-md mx-auto">

### 🎯 Par sa source de vérité

<div class="pt-1">Où l'état <b>naît</b>-il ? Qui le <b>possède</b> ?</div>
</div>

<!--
Reframe central : on pourrait classer l'état par son contenu (interaction vs métier)
ou par où il est lu (local vs partagé), mais ces axes sont flous et instables. 
Ils peuvent être utiles parfois mais c'est pas la meilleure distinction. 
L'axe qui détermine vraiment l'outil, c'est la SOURCE DE VÉRITÉ : où l'état naît, qui le
possède. C'est le fil rouge de tout le talk.
-->

---

# La source de vérité : où naît l'état ?

<div class="flex items-stretch justify-center gap-4 pt-6">

<div v-click="1" class="border-2 border-gray-400 rounded-xl p-4 flex-1 max-w-md">
<div class="text-sm uppercase tracking-widest opacity-50 text-center pb-3">💻 Client</div>

<div class="flex flex-col gap-2">

<div v-click="2" class="border border-gray-500 rounded-lg p-3">
🌐 <b>navigateur</b>
<div class="text-xs opacity-60 pt-1">DOM · formulaires · scroll · localStorage · <b class="opacity-100">URL</b></div>
<div v-click="3" class="text-xs text-orange-400 mt-2 border-l-2 border-orange-500 pl-2">
L'<b>URL</b> à part : un state <b>partageable</b> et <b>dans l'historique</b>
</div>
</div>

<div v-click="2" class="border-2 border-orange-500 rounded-lg p-3 bg-orange-400/10">
💻 <b>runtime JS</b>
<div class="text-xs opacity-60 pt-1">variables en mémoire runtime ⚠️ volatile, perdu au refresh</div>
</div>

</div>
</div>

<div v-click="1" class="flex flex-col items-center justify-center text-orange-400">
<div class="text-3xl">⇄</div>
</div>

<div v-click="1" class="border-2 border-gray-400 rounded-xl p-4 flex flex-col items-center justify-center text-center">
<div class="text-4xl">🗄️</div>
<div class="font-bold pt-2">Serveur / DB</div>
<div class="text-xs opacity-60 pt-2">persisté · partagé<br>asynchrone</div>
</div>

</div>

<div class="pt-10 max-w-3xl mx-auto text-sm space-y-3">
<div v-click="4">💻 <b>State client</b> — interaction, formulaire, sélection…</div>
<div v-click="5">🗄️ <b>State serveur</b> — compte, voyages, catalogue, persisté en base…</div>
</div>

<!--
Construire progressivement : (1) d'abord la grande séparation client ⇄ serveur. (2) puis
ouvrir le client : ce que le navigateur gère pour nous (DOM, formulaires, scroll,
localStorage, URL) vs ce que NOTRE code JS gère (variables en mémoire, volatiles). (3) cas
spécial de l'URL : contrairement au reste du state navigateur, elle est partageable et dans
l'historique — gratuite, persistante, souvent oubliée (→ ch.2). Cette grille mappe les
chapitres : URL (ch.2), state client (ch.1,4,5), serveur (ch.3).
-->

---

# Donnée persistée ≠ état

<div class="flex items-center justify-center gap-6 pt-6">

<div v-click="1" class="border border-gray-500 rounded-xl p-5 text-center max-w-xs">
<div class="text-4xl">🗄️</div>
<div class="font-bold pt-2">Donnée persistée</div>
<div class="text-sm opacity-60 pt-2">au repos, inerte,<br>mémoire durable</div>
<div class="text-xs opacity-50 pt-2">ligne en DB · fichier · localStorage</div>
</div>

<div class="flex flex-col items-center text-orange-400 gap-2">
<div v-click="2" class="flex flex-col items-center">
<div class="text-xs uppercase tracking-wider opacity-70">chargée dans l'app</div>
<div class="text-3xl leading-none">→</div>
</div>
<div v-click="5" class="flex flex-col items-center">
<div class="text-3xl leading-none">←</div>
<div class="text-xs uppercase tracking-wider opacity-70">persiste la donnée</div>
</div>
</div>

<div v-click="2" class="border-2 border-orange-500 rounded-xl p-5 text-center max-w-xs bg-orange-400/10">
<div class="text-4xl">⚡</div>
<div class="font-bold pt-2">État</div>
<div class="text-sm opacity-60 pt-2">vivant, en mémoire, <br>ce que l'UI lit & affiche</div>
<div class="text-xs opacity-50 pt-2">disparaît quand l'app s'arrête</div>
</div>

</div>

<div v-click="3" class="pt-6 text-center text-lg">
La donnée devient de l'état au moment où elle est <b>chargée</b> dans le client.
</div>

<div v-click="4" class="pt-4 text-center text-xl font-bold">
Tout l'état <span v-mark.underline.orange>finit dans le client</span>.
</div>

<!--
Distinction mémoire persistée vs état. Une ligne en DB, un fichier, du localStorage = de la
mémoire durable, inerte, au repos. Ce n'est pas « l'état » de l'app tant que ce n'est pas
chargé dans le client : à ce moment-là ça devient de l'état vivant, en mémoire. Et puisque
l'état est ce qui change l'écran, TOUT l'état finit par vivre dans le client, quelle que soit
sa source (c'est l'ancienne « règle d'or »). Corollaire : le client n'en tient qu'une COPIE —
elle peut diverger (donnée périmée → state serveur, ch.3). Le flux est bidirectionnel : on
charge l'état (récupération) ET on le persiste en sens inverse — une annexe nécessaire à la
gestion de state, sans en être à proprement parler.
-->

---

# MPA vs SPA : fragmenter ou tout concentrer

<div class="grid grid-cols-2 gap-6 pt-4">

<div class="border border-gray-500 rounded-xl p-5">
<div class="text-sm uppercase tracking-widest opacity-50 pb-2">🌍 MPA — le problème est <b>fragmenté</b></div>

<div class="text-sm opacity-80 leading-relaxed space-y-1">
<div v-click="1">🗄️ <b>Serveur</b> — reconstruit l'état à chaque requête</div>
<div v-click="2">🌐 <b>Navigateur</b> — ne tient qu'un état d'UI léger</div>
<div v-click="3">🔗 <b>URL</b> — fait le lien entre les deux</div>
</div>
</div>

<div class="border-2 border-orange-500 rounded-xl p-5 bg-orange-400/10">
<div class="text-sm uppercase tracking-widest opacity-60 pb-2">⚡ SPA — tout converge dans le client</div>

<div class="text-sm opacity-80 leading-relaxed space-y-1">
<div v-click="4">connaître <b>tout l'état</b> et le <b>propager</b> correctement, à chaque frame</div>
<div v-click="5" class="opacity-60">risque : afficher des données <b>périmées</b></div>
</div>
</div>

</div>

<div v-click="6" class="pt-6 text-center text-lg">
En SPA, le <b>client</b> est la source de vérité de <b>ce qui s'affiche</b>.
</div>

<div v-click="7" class="pt-2 text-center text-lg">
Tradeoff : fluidité &amp; réactivité mais <span v-mark.underline.orange>gestion de tout l'état côté client</span>.
</div>

<!--
Reframe : le MPA répond au problème de state en le FRAGMENTANT. Le serveur reconstruit l'état
métier à chaque requête (à partir de la DB), le navigateur ne tient qu'un état d'UI léger
(scroll, champ en cours, hover), et l'URL fait le pont entre les deux (elle sélectionne ce que
le serveur rend). Chaque pièce a donc peu à gérer → c'est ce qui rend le MPA simple. Le SPA
casse cette répartition : le client doit connaître TOUT l'état à chaque frame pour rendre l'UI
correctement. Tout écart se paie cash — flash de données périmées, voire désynchronisation
complète. D'où la nécessité de gérer le state côté client : le sujet du reste du talk.
-->

---

# Un angle qui rend compte de tous les paradigmes

<div class="text-center opacity-70 text-sm pb-3">« Où vit l'état ? » suffit à reconnaître chaque architecture.</div>

<div class="max-w-3xl mx-auto pt-2">

<div class="grid grid-cols-[1fr_2fr] gap-x-6 pb-2 border-b border-gray-600 text-sm uppercase tracking-wider opacity-50">
<div>Architecture</div>
<div>Où vit l'état</div>
</div>

<div v-click class="grid grid-cols-[1fr_2fr] gap-x-6 py-2 border-b border-gray-700">
<div><b>Site statique</b></div>
<div>Client — surtout le <b>DOM</b></div>
</div>

<div v-click class="grid grid-cols-[1fr_2fr] gap-x-6 py-2 border-b border-gray-700">
<div><b>SPA + AJAX</b></div>
<div>Client <b>et</b> serveur</div>
</div>

<div v-click class="grid grid-cols-[1fr_2fr] gap-x-6 py-2 border-b border-gray-700">
<div><b>MPA</b></div>
<div>Serveur — tout passe par des <b>requêtes</b></div>
</div>

<div v-click class="grid grid-cols-[1fr_2fr] gap-x-6 py-2">
<div><b>HTMX</b></div>
<div>Backend — l'état client <i>est</i> le <b>markup HTML</b></div>
</div>

</div>

<div v-click class="pt-5 text-center opacity-80">
Du <b>tout-serveur</b> au <b>tout-client</b>, des réponses différentes au même problème.<br>
L'état <b>affecte</b> toujours le client, mais seulement en SPA <span v-mark.orange>il est géré par le client</span>.
</div>

<!--
Le prisme "où vit l'état" range tous les paradigmes. HTMX = la logique poussée à fond,
tout côté backend, le client ne tient que du markup. C'est un spectre, il y a deux extrêmes et plein de positions entre.
Conséquence centrale pour React/SPA :
en abstrayant le DOM, l'état doit vivre ailleurs → mémoire JS volatile.
-->

---

# L'importance du métier

<div class="text-center opacity-70 pb-4">Le métier de l'application influe sur l'importance relative de chaque source de vérité.</div>

<div class="grid grid-cols-3 gap-5 pt-2">
<div v-click class="border border-gray-500 rounded-xl p-5 text-center">
<div class="text-4xl">🪧</div>
<b>Site vitrine · blog</b>
<div class="text-xs opacity-60 pt-2">quasi pas d'état</div>
<div class="text-sm pt-3">🌐 surtout <b>navigateur · URL</b></div>
</div>
<div v-click class="border border-gray-500 rounded-xl p-5 text-center">
<div class="text-4xl">🛒</div>
<b>E-commerce · back-office</b>
<div class="text-xs opacity-60 pt-2">catalogue, stock, commandes</div>
<div class="text-sm pt-3">🗄️ surtout <b>serveur</b></div>
</div>
<div v-click class="border-2 border-orange-500 rounded-xl p-5 text-center bg-orange-400/10">
<div class="text-4xl">✏️</div>
<b>Éditeur · Figma · Gmail</b>
<div class="text-xs opacity-60 pt-2">document vivant, interactions</div>
<div class="text-sm pt-3">💻 surtout <b>client</b></div>
</div>
</div>

<div v-click class="pt-6 text-center text-lg">
Repérer <span v-mark.underline.orange>d'où vient surtout l'état</span> oriente le choix des outils.
</div>

<!--
Retour sur les sources de vérité : toutes les apps ne les pondèrent pas pareil. Site vitrine
≈ quasi pas d'état (un peu de navigateur/URL) ; e-commerce/back-office ≈ surtout du serveur
(catalogue, stock, commandes en base) ; éditeur/Figma/Gmail ≈ surtout du client (document
vivant en mémoire, interactions riches). La plupart des vraies apps mélangent les trois — mais
identifier la source dominante oriente déjà le choix des outils. Bien sûr il y a une corrélation avec le paradigme choisi en général.
-->

---

# Le state en React

<div v-click="1" class="text-center text-2xl pt-8">
La donnée ne circule que dans <span v-mark.orange>un seul sens</span>. L'état reste <b class="text-orange-400">immuable</b>.
</div>

<div v-click="2" class="flex flex-col items-center gap-1 pt-8">
<div class="border-2 border-orange-500 rounded-lg px-6 py-2 bg-orange-400/10 font-medium">Parent (détient le state)</div>
<div class="flex gap-16 pt-1">
<div class="flex flex-col items-center">
<div class="flex flex-col items-center text-orange-400 leading-tight">
<span class="text-2xl leading-none">↓</span>
<span class="text-xs">props</span>
</div>
<div class="border border-gray-500 rounded-lg px-6 py-2 mt-1">Enfant A</div>
</div>
<div class="flex flex-col items-center">
<div class="flex flex-col items-center text-orange-400 leading-tight">
<span class="text-2xl leading-none">↓</span>
<span class="text-xs">props</span>
</div>
<div class="border border-gray-500 rounded-lg px-6 py-2 mt-1">Enfant B</div>
</div>
</div>
</div>

<div v-click="3" class="pt-8 text-center opacity-70">
La donnée ne va que <b>vers le bas</b>. jamais de l'enfant au parent, jamais entre enfants.<br>On sait toujours d'où vient chaque valeur.
</div>

<div v-click="4" class="pt-6 text-center text-lg">
Ça se complique quand deux composants <span v-mark.orange>éloignés</span> doivent partager la donnée.
</div>

<!--
Le trait unique de React : flux de données unidirectionnel. La donnée ne descend QUE vers le
bas, du parent vers l'enfant via les props — jamais vers le haut, jamais entre frères. Pour
qu'une donnée « remonte », il n'y a qu'un mécanisme (à expliquer à l'oral) : le parent passe
un callback en prop, et l'enfant l'appelle en lui passant des arguments. Ce n'est donc pas un
vrai flux remontant, juste l'enfant qui déclenche du code du parent. Très prévisible → facile
à débugger. Le coût : pour partager entre composants éloignés, il faut tout remonter au parent
commun → point de départ des chapitres (prop drilling → contexte → stores).
-->

---

# Et dans les autres frameworks ?

<div class="max-w-4xl mx-auto pt-8 grid grid-cols-[auto_1fr_1fr_1fr] gap-x-5 gap-y-5 items-center">

<div></div>
<div class="text-center font-bold text-orange-400">React</div>
<div class="text-center font-bold opacity-80">Vue</div>
<div class="text-center font-bold opacity-80">Angular</div>

<div v-click="1" class="text-sm opacity-60 whitespace-nowrap">Lier état ↔ vue</div>
<div v-click="1" class="text-center"><code class="text-xs whitespace-nowrap">&lt;Field value={count}<br/>onChange={setCount} /&gt;</code></div>
<div v-click="1" class="text-center"><code class="text-xs whitespace-nowrap">&lt;Field v-model="count" /&gt;</code></div>
<div v-click="1" class="text-center"><code class="text-xs whitespace-nowrap">&lt;app-field [(value)]="count" /&gt;</code></div>

<div v-click="2" class="text-sm opacity-60 whitespace-nowrap">Changer l'état</div>
<div v-click="2" class="text-center"><code class="text-sm whitespace-nowrap">setCount(count + 1)</code></div>
<div v-click="2" class="text-center"><code class="text-sm whitespace-nowrap">count.value++</code></div>
<div v-click="2" class="text-center"><code class="text-sm whitespace-nowrap">this.count++</code></div>

</div>

<div v-click="3" class="pt-10 text-center text-lg">
Vue &amp; Angular : on <b>mute</b>, le framework réagit.<br>
React : l'état est <span v-mark.underline.orange>immuable</span>, il est remplacé.
</div>

<div v-click="4" class="pt-3 text-center opacity-70">
Immutabilité &amp; flux à sens unique vont de pair → un flux <b>prévisible et traçable</b>.
</div>

<!--
Deux axes pour enfoncer le clou. (1) Lier état ↔ vue : Vue (v-model) et Angular ([(x)]) font du
two-way binding (sur composant aussi, pas que les inputs natifs : modelValue/update:modelValue,
@Input x + @Output xChange) ; React reste explicite (value en prop, onChange en callback).
(2) Changer l'état : Vue et Angular MUTENT directement la donnée et le framework réagit
(Proxy / détection de changement) ; React n'autorise jamais la mutation — on passe par le
setter et l'état reste immuable. Bilan : plus verbeux, mais un seul sens, prévisible et traçable.
-->

---
layout: center
---

<div class="text-6xl font-mono pt-6 pb-4">
  UI = <span v-mark.circle.orange="1">f(state)</span>
</div>

<div v-click="2" class="text-xl opacity-70">
Une UI n'est qu'une <b>projection de l'état</b> à un instant T.
</div>

<div v-click="3" class="text-xl opacity-70 pt-2">
Changer l'UI = changer l'état.
</div>

<div v-click="4" class="flex justify-center pt-12">

```mermaid {scale: 0.9}
graph LR
  A(Action) --> S(State)
  S --> V(Vue / UI)
  V --> A
  style S fill:#f97316,stroke:#ea580c,color:#fff
```

</div>

<!--
Le modèle mental qui accompagne le flux : UI = projection de l'état. Pas unique à React (Vue,
Solid le partagent), mais c'est ainsi qu'on raisonne. Corollaire: changer l'écran = changer l'état, rien
d'autre. Tout le reste du talk : où vit le state, et comment on le change.
-->

---

# Alors… comment gère-t-on tout ça ?

<div v-click="1" class="text-center text-lg pt-3 opacity-80">
L'état n'est pas un concept <b>simple</b>.
</div>

<div v-click="2" class="text-center text-lg opacity-80 pt-2">
En React, il faut trouver une façon de <b>tout gérer côté client</b>.
</div>

<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 pt-10 max-w-4xl mx-auto leading-tight">
<span v-click="3" class="fall text-4xl font-bold" style="transform: rotate(-4deg)">Redux</span>
<span v-click="4" class="fall text-4xl font-bold text-orange-400" style="transform: rotate(-2deg)">TanStack Query</span>
<span v-click="5" class="fall text-3xl font-bold" style="transform: rotate(2deg)">Zustand</span>
<span v-click="6" class="fall text-xl opacity-60" style="transform: rotate(3deg); transition-delay: 0ms">useState</span>
<span v-click="6" class="fall text-lg opacity-50" style="transform: rotate(-5deg); transition-delay: 70ms">Context API</span>
<span v-click="6" class="fall text-2xl" style="transform: rotate(5deg); transition-delay: 140ms">Jotai</span>
<span v-click="6" class="fall text-base opacity-40" style="transform: rotate(4deg); transition-delay: 210ms">useReducer</span>
<span v-click="6" class="fall text-2xl text-orange-400" style="transform: rotate(-6deg); transition-delay: 280ms">MobX</span>
<span v-click="6" class="fall text-lg opacity-55" style="transform: rotate(2deg); transition-delay: 350ms">Recoil</span>
<span v-click="6" class="fall text-3xl font-bold" style="transform: rotate(3deg); transition-delay: 420ms">Apollo</span>
<span v-click="6" class="fall text-xl" style="transform: rotate(-3deg); transition-delay: 490ms">SWR</span>
<span v-click="6" class="fall text-2xl font-bold text-orange-400" style="transform: rotate(4deg); transition-delay: 560ms">Convex</span>
<span v-click="6" class="fall text-base opacity-45" style="transform: rotate(-4deg); transition-delay: 630ms">Valtio</span>
<span v-click="6" class="fall text-2xl" style="transform: rotate(2deg); transition-delay: 700ms">Redux Toolkit</span>
<span v-click="6" class="fall text-lg opacity-60" style="transform: rotate(-2deg); transition-delay: 770ms">nuqs</span>
<span v-click="6" class="fall text-3xl font-bold" style="transform: rotate(5deg); transition-delay: 840ms">XState</span>
<span v-click="6" class="fall text-xl opacity-50" style="transform: rotate(-5deg); transition-delay: 910ms">RTK Query</span>
<span v-click="6" class="fall text-2xl text-orange-400" style="transform: rotate(3deg); transition-delay: 980ms">Firebase</span>
<span v-click="6" class="fall text-lg opacity-55" style="transform: rotate(-3deg); transition-delay: 1050ms">Relay</span>
<span v-click="6" class="fall text-xl" style="transform: rotate(4deg); transition-delay: 1120ms">Supabase</span>
<span v-click="6" class="fall text-2xl font-bold" style="transform: rotate(2deg); transition-delay: 1190ms">Signals</span>
<span v-click="6" class="fall text-lg opacity-50" style="transform: rotate(-6deg); transition-delay: 1260ms">Nano Stores</span>
<span v-click="6" class="fall text-base opacity-45" style="transform: rotate(5deg); transition-delay: 1330ms">useSyncExternalStore</span>
<span v-click="6" class="fall text-xl opacity-60" style="transform: rotate(-2deg); transition-delay: 1400ms">Immer</span>
<span v-click="6" class="fall text-lg opacity-40" style="transform: rotate(3deg); transition-delay: 1470ms">Flux</span>
</div>

<div v-click="7" class="text-center text-sm opacity-50 pt-10">
Chaque outil finit par faire un peu de <b>tout</b> : cache, sélecteurs, middleware, persistance, optimistic updates, normalisation…
</div>

<style>
.fall {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
}
.fall.slidev-vclick-hidden {
  transform: translateY(-80px) !important;
  opacity: 0 !important;
}
</style>

<!--
L'état n'est pas un
concept simple, et React/SPA rapatrie TOUT le state côté client — c'est à nous de trouver
une façon de tout gérer. Réaction de l'écosystème : une avalanche d'outils. Double problème :
il y a BEAUCOUP d'outils, ET chacun déborde de son rôle (un store qui fait du cache, un client
réseau qui fait du state global…). C'est exactement le brouillard qu'on va dissiper.
-->

---
layout: center
---

<div class="flex flex-col gap-5 max-w-3xl mx-auto">

<div v-click="1" class="flex items-center gap-5 border border-gray-600 rounded-xl p-5">
<div class="text-4xl font-bold text-orange-400 opacity-80">01</div>
<div class="text-xl">Comment <b>s'y retrouver</b> dans tous ces outils ?</div>
</div>

<div v-click="2" class="flex items-center gap-5 border border-gray-600 rounded-xl p-5">
<div class="text-4xl font-bold text-orange-400 opacity-80">02</div>
<div class="text-xl"><b>Quel outil</b> pour <b>quel besoin</b> ?</div>
</div>

<div v-click="3" class="flex items-center gap-5 border-2 border-orange-500 rounded-xl p-5 bg-orange-400/10">
<div class="text-4xl font-bold text-orange-400">03</div>
<div class="text-xl">Comment <b>tirer le meilleur</b> de chacun ?</div>
</div>

</div>

<!--
On sort du brouillard du nuage pour poser les trois questions auxquelles le talk répond.
(1) Se repérer dans l'écosystème — une carte, pas une liste à apprendre par cœur.
(2) Choisir : associer un type d'état à l'outil adapté, plutôt qu'un outil par défaut pour tout.
(3) Maîtriser : une fois le bon outil choisi, en exploiter les forces (sélecteurs, cache,
invalidation, machines à états…).
-->

---

# Ce qu'on va voir aujourd'hui

<div class="flex gap-6 max-w-3xl mx-auto pt-4">

<div v-click="6" class="flex flex-col items-center self-stretch text-orange-400">
<div class="text-[10px] uppercase tracking-widest opacity-70 pb-2 text-center leading-tight">Le plus<br>courant</div>
<div class="w-0.5 flex-1 bg-gradient-to-b from-orange-400/20 to-orange-500"></div>
<div class="text-xl leading-none -mt-1">▼</div>
<div class="text-[10px] uppercase tracking-widest opacity-70 pt-2 text-center leading-tight">Le plus<br>spécialisé</div>
</div>

<div class="flex flex-col gap-3 flex-1">

<div v-click="1" class="flex items-baseline gap-5 border-b border-gray-700 pb-3">
<div class="text-2xl font-bold text-orange-400 opacity-80 w-8">1</div>
<div>
<div class="text-xl font-medium">Les API natives de React</div>
<div class="text-sm opacity-50">useState · useContext · useReducer</div>
</div>
</div>

<div v-click="2" class="flex items-baseline gap-5 border-b border-gray-700 pb-3">
<div class="text-2xl font-bold text-orange-400 opacity-80 w-8">2</div>
<div>
<div class="text-xl font-medium">L'état dans l'URL</div>
<div class="text-sm opacity-50">nuqs</div>
</div>
</div>

<div v-click="3" class="flex items-baseline gap-5 border-b border-gray-700 pb-3">
<div class="text-2xl font-bold text-orange-400 opacity-80 w-8">3</div>
<div>
<div class="text-xl font-medium">L'état serveur</div>
<div class="text-sm opacity-50">SWR · TanStack Query · Apollo · Convex</div>
</div>
</div>

<div v-click="4" class="flex items-baseline gap-5 border-b border-gray-700 pb-3">
<div class="text-2xl font-bold text-orange-400 opacity-80 w-8">4</div>
<div>
<div class="text-xl font-medium">Les state managers classiques</div>
<div class="text-sm opacity-50">Zustand · Redux &amp; RTK</div>
</div>
</div>

<div v-click="5" class="flex items-baseline gap-5 pb-1">
<div class="text-2xl font-bold text-orange-400 opacity-80 w-8">5</div>
<div>
<div class="text-xl font-medium">Les solutions exotiques</div>
<div class="text-sm opacity-50">Jotai · MobX · XState </div>
</div>
</div>

</div>

</div>

<!--
Le plan, révélé chapitre par chapitre. On suit la grille "où vit l'état" : on part des API
natives (state client local/partagé), on passe par l'URL (souvent oubliée), puis le state
serveur (asynchrone, le gros morceau), avant les state managers classiques (tout-en-un) et on
finit par les paradigmes exotiques. Ordre voulu : du plus natif/courant au plus spécialisé.
La flèche (clic 6) matérialise ce gradient : plus on descend, plus la solution est rare/de
niche. À l'oral : dans ~90 % des cas aujourd'hui (API natives + URL + state serveur), on n'a
pas besoin d'un state manager dédié — d'où l'ordre du talk.
-->

---

# Notre fil rouge : <span class="text-orange-500">WanderState</span>

<div class="grid grid-cols-2 gap-10 items-center pt-4">

<div>

<div v-click="1" class="text-lg pb-4">Une app de <b>planification de voyages</b>. 🗺️</div>

<div v-click="2" class="border-2 border-orange-500 rounded-lg p-4 mt-6 bg-orange-400/10">
À chaque chapitre, <b>les écrans ne changent pas</b>.<br>
Seule <b>la couche de state</b> est remplacée.
</div>

<div v-click="3" class="text-sm opacity-60 pt-4">
Même UI, même feature — pour voir <b>uniquement</b> ce que l'outil change.
</div>

</div>

<div v-click="1" class="border-2 border-gray-700 rounded-xl bg-white text-gray-900 p-4 shadow-[6px_6px_0_#0f172a]">
<div class="flex items-center justify-between border-b-2 border-gray-200 pb-2 mb-3">
<div class="font-bold text-lg">✈️ WanderState</div>
<div class="text-xs border-2 border-orange-500 text-orange-600 rounded px-2 py-0.5 font-medium">+ Nouveau voyage</div>
</div>
<div class="grid grid-cols-2 gap-3">
<div class="border-2 border-gray-800 rounded-lg p-3 shadow-[3px_3px_0_#0f172a]">
<div class="font-bold">Road trip <br>Sicile</div>
<div class="text-xs opacity-60">Palerme</div>
<div class="text-orange-600 font-bold pt-2">1 200 €</div>
</div>
<div class="border-2 border-gray-800 rounded-lg p-3 shadow-[3px_3px_0_#0f172a]">
<div class="font-bold">Week-end Lisbonne</div>
<div class="text-xs opacity-60">Lisbonne</div>
<div class="text-orange-600 font-bold pt-2">450 €</div>
</div>
</div>
</div>

</div>

<!--
Présentation du fil rouge. WanderState = app de planification de voyages (créer un voyage,
destination, budget, étapes…). UI volontairement minimaliste : l'attention reste sur le state,
pas sur le design. Point clé à marteler : on ne réécrit pas l'app à chaque chapitre, on
remplace UNIQUEMENT la couche de gestion de state. Les composants présentationnels (les cards
qu'on voit ici) sont réutilisés tels quels — seul change ce qui fournit et met à jour la donnée.
Comme ça l'audience voit en isolation ce que chaque outil apporte, sans bruit visuel.
-->


