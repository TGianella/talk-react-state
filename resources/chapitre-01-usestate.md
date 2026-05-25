# Chapitre 1 — `useState`

## React est une machine à muter du state

- Une UI n'est qu'une projection d'un état à un instant T.
- Changer l'UI = changer l'état. Rien d'autre.
- React re-rend le composant entier à chaque mutation de state.
- C'est le principe fondamental sur lequel tout repose.

---

## `useState` — le state local

- `useState` crée une variable réactive locale au composant.
- Elle retourne un tuple : `[valeur, setter]`.
- Le setter déclenche un re-render du composant.
- La valeur est immuable dans le cycle courant — on ne la modifie pas directement.

```js
const [count, setCount] = useState(0);

setCount(count + 1); // déclenche un re-render
```

- L'état initial n'est lu qu'une seule fois, au premier montage.
- Entre deux renders, React conserve la valeur en mémoire (dans la fiber).

### La Fiber — comment React stocke le state

- Chaque composant a une **fiber node** : un objet interne géré par React.
- Les hooks sont stockés dans une liste chaînée attachée à cette fiber.
- `useState` = un nœud dans cette liste, avec sa valeur courante.
- L'ordre des hooks doit être stable — c'est pourquoi on ne peut pas les appeler conditionnellement.

---

## Immutabilité — la règle centrale

- On ne mute jamais la valeur directement.
- On passe toujours une nouvelle référence au setter.
- Pour les objets et tableaux : spread, `map`, `filter`, jamais de mutation en place.

```js
// MAUVAIS
state.items.push(item);
setState(state);

// BON
setState({ ...state, items: [...state.items, item] });
```

- Cette contrainte permet à React de détecter les changements par comparaison de référence.

---

## Comparaison avec les autres approches

### Vue — Proxy

- Vue 3 enveloppe le state dans un `Proxy` JavaScript.
- La mutation directe est détectée et interceptée automatiquement.
- Pas besoin d'un setter explicite.

```js
const state = reactive({ count: 0 });
state.count++; // Vue détecte la mutation via le Proxy
```

- Ergonomie plus naturelle, mais la "magie" est moins visible.

### Solid — Signals

- Les Signals sont des primitives réactives granulaires.
- Seuls les consommateurs directs d'un signal se re-rendent — pas le composant entier.
- Pas de VDOM, pas de reconciliation globale.

```js
const [count, setCount] = createSignal(0);
count(); // lecture explicite
setCount(1); // écriture
```

- Plus performant par nature, mais paradigme différent de React.

### Svelte — compilation

- Svelte transforme les assignations classiques en code réactif à la compilation.
- `let count = 0; count++` devient du code qui met à jour le DOM.
- Zéro runtime réactif, zéro overhead.

### Angular — RxJS / Signals

- Historiquement basé sur Zone.js pour la détection de changements.
- Évolue vers les Signals (Angular 17+), convergence des paradigmes.

---

## Ce que React choisit — et pourquoi

- React fait le choix de la **prévisibilité** : state immuable, flux de données explicite.
- Le re-render du composant entier est intentionnel — simplifie le modèle mental.
- Le VDOM minimise le coût réel des re-renders.
- Contrepartie : verbosité, boilerplate sur les structures complexes.

---

## Points clés à retenir

- Toute UI React est une fonction de son state.
- `useState` = état local, éphémère, propre au composant.
- Setter = déclencheur de re-render, jamais de mutation directe.
- Les autres frameworks résolvent le même problème avec des mécanismes différents (proxy, signals, compilation).
- React privilégie l'explicite sur l'implicite.
