# Chapitre 2 — `useContext` + `useReducer`

## Le problème — prop drilling

- `useState` suffit pour de l'état local à un composant.
- Dès que plusieurs composants partagent le même état, on commence à passer des props vers le bas.
- Les composants intermédiaires reçoivent des props qu'ils ne consomment pas — ils ne font que les transmettre.

```tsx
<App user={user} onLogout={onLogout}>
  <Header user={user} />
  <Layout user={user} onLogout={onLogout}>
    <Sidebar user={user} />
    <UserMenu user={user} onLogout={onLogout} />  ← seul composant qui en a besoin
  </Layout>
</App>
```

- Ajouter un champ = modifier la signature de chaque composant sur le chemin.
- C'est le **prop drilling** — et ça ne scale pas.

---

## L'origine — pourquoi ces hooks existent

| Quand | Quoi |
|---|---|
| 2014 | Flux — Facebook propose une architecture unidirectionnelle pour React |
| 2015 | Redux — Dan Abramov simplifie Flux en s'inspirant d'Elm |
| mars 2018 | React 16.3 — Context API officiel |
| février 2019 | React 16.8 — `useContext` + `useReducer` : le pattern reducer natif |

- **Flux** : le bon diagnostic (flux unidirectionnel, actions nommées), mais trop de boilerplate — un Dispatcher central, plusieurs stores, beaucoup de wiring.
- **Redux** en a gardé l'essentiel et l'a radicalement simplifié : un seul store, un reducer pur, pas de Dispatcher.
- `useReducer` = Redux a prouvé le pattern, React l'a intégré nativement.

---

## `useContext` — partager l'état sans prop drilling

- On crée un contexte : un conteneur pour une valeur partagée.
- Un `Provider` l'expose à tous ses descendants dans l'arbre.
- N'importe quel composant descendant lit cette valeur directement.

```jsx
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={theme}>
      <Layout />     {/* pas besoin de passer theme en prop */}
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext); // accès direct, peu importe la profondeur
  return <button className={theme}>Cliquer</button>;
}
```

- React remonte l'arbre pour trouver le `Provider` le plus proche.
- Si aucun `Provider` n'est trouvé, la valeur par défaut de `createContext` est utilisée.
- Quand la valeur du `Provider` change, **tous les consommateurs se re-rendent**.

### Cas d'usage adaptés

Context est fait pour des données vraiment globales à un sous-arbre : thème, utilisateur authentifié, locale, préférences. Ce n'est pas un outil universel pour tout état partagé.

---

## `useReducer` — centraliser la logique de mutation

- Quand plusieurs `useState` liés s'invoquent en cascade, la logique se disperse dans les handlers.
- `useReducer` centralise toutes les transitions d'état dans une seule fonction pure.

```js
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "ADD_ITEM", payload: item });
```

- `state` : l'état courant.
- `dispatch` : envoie une action au reducer.
- Le reducer est **pur** : `(state, action) => newState`, aucun effet de bord.

```ts
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return { items: [...state.items, action.payload], total: state.total + action.payload.price };
    case "REMOVE_ITEM":
      const item = state.items.find(i => i.id === action.payload.id);
      return { items: state.items.filter(i => i.id !== action.payload.id), total: state.total - (item?.price ?? 0) };
    case "CLEAR":
      return { items: [], total: 0 };
    default:
      return state;
  }
}
```

### Une action = un seul re-render

- Avec plusieurs `useState`, chaque setter déclenche potentiellement un re-render séparé.
- Avec `useReducer`, une action met à jour tout l'état en une passe — un seul re-render.

> **React 18 :** L'**automatic batching** regroupe automatiquement les setters d'un même événement en un seul re-render. Ce différentiel de performance est donc moins critique depuis React 18. La vraie valeur de `useReducer` reste la lisibilité et la testabilité.

### Testable en isolation

Le reducer est une fonction pure — testable sans React, sans DOM.

```ts
it("calcule le total après ajout", () => {
  const next = cartReducer({ items: [], total: 0 }, {
    type: "ADD_ITEM",
    payload: { id: "1", name: "Café", price: 2.5 },
  });
  expect(next.total).toBe(2.5);
});
```

---

## Le pattern — `Context + Reducer`

- `useContext` résout le *où accéder au state*.
- `useReducer` résout le *comment le mettre à jour*.
- Ensemble : un store applicatif sans dépendance externe.

```tsx
const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}
```

```tsx
function CartSummary() {
  const { state, dispatch } = useContext(CartContext)!;
  return (
    <div>
      <p>{state.items.length} article(s) — {state.total}€</p>
      <button onClick={() => dispatch({ type: "CLEAR" })}>Vider</button>
    </div>
  );
}
```

- Aucun prop drilling.
- La logique de mutation est dans le reducer, pas dans les composants.

---

## Les limites — quand ça ne suffit plus

### Re-renders non ciblés

- Quand la valeur du Provider change, tous les consommateurs se re-rendent — même ceux dont le slice de state n'a pas bougé.
- React compare la **référence** de `value`, pas son contenu. L'objet `{ state, dispatch }` est recréé à chaque render.

```tsx
function CartBadge() {
  const { state } = useContext(CartContext)!;
  return <span>{state.items.length}</span>; // re-rend même si seul total a changé
}
```

**Workaround natif : splitter les contextes.** `dispatch` est stable (référence constante de `useReducer`) :

```tsx
const CartStateContext = createContext<CartState | null>(null);
const CartDispatchContext = createContext<React.Dispatch<CartAction> | null>(null);
// Un composant qui ne dispatche jamais ne se re-rend plus quand l'état change
```

- Fonctionne pour séparer lecture et écriture.
- Mais pour une granularité fine (re-rendre uniquement si `items.length` change), il faudrait un contexte par slice — ingérable.

**C'est là qu'entrent les sélecteurs** — une feature clé des stores dédiés :

```ts
// Zustand — re-render uniquement si items.length change
const itemCount = useCartStore(state => state.items.length);

// Redux — même principe
const itemCount = useSelector(state => state.cart.items.length);
```

On y revient plus tard.

### Autres limites

- **Persistance** : état en mémoire, perdu au refresh.
- **DevTools** : pas de time-travel, pas de replay d'actions nativement.
- **Scalabilité** : à mesure que l'app grandit, on finit par recréer Redux en moins bien outillé.

---

## Points clés à retenir

- `useState` ne suffit plus dès que l'état est partagé entre niveaux → prop drilling.
- `useContext` = accès direct à une valeur partagée, sans traverser les intermédiaires.
- `useReducer` = logique de mutation centralisée dans une fonction pure et testable.
- `Context + Reducer` = store applicatif natif, sans dépendance.
- Limite : pas de sélecteurs — tous les consommateurs se re-rendent quand le context change.
- C'est la fondation conceptuelle de Redux, Zustand, et tous les stores React.
