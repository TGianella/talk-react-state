# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Monorepo for a **3h French conference talk** on React state management ("Deep Dive — gestion de state React"). Two apps:

- `apps/slides` — [Slidev](https://sli.dev/) deck (`slides.md`). **All slide content must be written in French.**
- `apps/wanderstate` — *WanderState*, a trip-planning demo app re-implemented chapter by chapter, each chapter introducing a different state-management approach.

The talk material is split across three places — read all three before writing slides or demo code:
1. **This repo** — `apps/slides/resources/*.md` (drafted chapter content) and `apps/slides/resources/wanderstate-design.md` (the demo's design spec, chapter→feature mapping).
2. **Notion** — `Talks > Deep Dive gestion de state react` (page id `3330a9dd-113b-8084-86ae-fd70b69b1498`), with one child page per chapter (e.g. "1. Les API natives", "3. State serveur", "4. Les state managers classiques", "1. Zustand", "2. Redux et RTK", "1. Jotai", "2. MobX"). Use the Notion MCP (`notion-fetch` / `notion-search`) to read these.
3. Per-app `AGENTS.md` — `apps/wanderstate/AGENTS.md` is the authoritative coding-convention doc for the demo app. **Read it before touching `wanderstate` code.**

## Commands

From the repo root (pnpm workspace):

```bash
pnpm install
pnpm dev:slides        # Slidev dev server (default :3030)
pnpm build:slides
pnpm dev:app           # WanderState (Vite, :5173)
```

Per-app (via filter):

```bash
pnpm --filter slides export                  # export deck to PDF/PNG
pnpm --filter wanderstate build              # tsc -b && vite build
pnpm --filter wanderstate preview
```

No test suite and no linter — the demo is intentionally "quick and dirty, readability first."

## WanderState chapter system (the key architectural idea)

The demo app renders **exactly one chapter at a time**, selected by a build-time constant. This is the central mechanism — understand it before changing anything in `wanderstate`:

- `src/current-chapter.ts` is **generated** by `scripts/set-chapter.mjs` — never edit it by hand. It's committed with `'1a'` (the default).
- Switch chapters with `pnpm --filter wanderstate chapter:<id>` (e.g. `chapter:1b`). Valid ids: `1a 1b 2 3a 3c 4b 5a`. This list lives in `scripts/set-chapter.mjs` — **adding a chapter means updating that array AND the import/`apps` map in `src/main.tsx`.**
- `src/main.tsx` statically imports every chapter and picks the active one from `CURRENT_CHAPTER`.

Chapter → topic mapping (demos only; some talk chapters like Redux 4a, Jotai/MobX 5b are *theory-only* slides with no demo):

| id  | Topic |
|-----|-------|
| 1a  | `useState` — local state |
| 1b  | `useContext` + `useReducer` |
| 2   | State in the URL |
| 3a  | TanStack Query (server state) |
| 3c  | Convex |
| 4b  | Zustand |
| 5a  | XState |

### Code organization in `wanderstate`

Strict split (enforced by convention, see `AGENTS.md`):

- `src/components/` — **pure presentational** components. Data in via props, actions in via callbacks. No context/store/business-hook access. Each owns a colocated `*.module.css`. **Never import from `chapters/`.** Presence of an optional callback = feature enabled (e.g. passing `onDeleteTrip` shows the delete button).
- `src/chapters/ch<id>/` — **only the logic that differs** between demos: providers, state hooks, reducers/stores/machines, derived calculations, dispatch. `index.tsx` is the entry point that wires visuals to logic. Support files (e.g. `TripContext.tsx`) are colocated. Chapters import **no CSS**.
- Derived values (e.g. `totalBudget`) are computed in the chapter and passed down as props — never computed inside visual components.
- `Layout` is a structural wrapper; `LayoutHeader`/`LayoutBody`/`LayoutFooter` are named slots composed directly in each chapter.

The point of this structure: the *same* presentational components are reused across chapters so the audience sees only the state-management layer change.

## Conventions worth knowing (from `apps/wanderstate/AGENTS.md`)

- **CSS Modules**, camelCase classes, one module per component. All colors go through CSS variables in `index.css` — no hardcoded hex outside `:root`. Use relative-color syntax for transparency: `rgb(from var(--color-accent) r g b / 40%)`.
- **Neo-brutalist** styling: flat shadows `box-shadow: Xpx Xpx 0 var(--color-primary)`. Don't combine `transform: translate` with a shadow on hover/active (it shifts the focus outline — animate shadow size only). No `border-radius` on shadowed elements (Firefox/Windows corner artifacts).
- **Conditional rendering**: always use a ternary, never `&&` with a possibly-falsy non-boolean (avoids rendering `0`): `{value ? value : ' '}`.

## Slides theming (`apps/slides`)

- The deck runs in **light theme** (`colorSchema: light` in `slides.md`). Content slides render on a **white background** — any opaque overlay/occlusion layer must use `#ffffff`, never a dark colour.
- The **only** dark surfaces are cover/section dividers (`layout: cover` / `section`), which use a photo or the `linear-gradient(135deg, #262626, #0a0a0a)` fallback — see `styles/index.css` (`.cover-slide`). Don't generalise that dark background to normal slides.
- The accent (orange) is **theme-aware** via the `--accent` CSS var: `styles/index.css` sets orange-600 on light / orange-400 on dark, and `uno.config.ts` remaps the `orange` palette (`DEFAULT`, `400`, `500`, `600`) to it. Use `text-orange` / `orange-400/500/600` (and `v-mark.orange`) for accents so they stay legible in both schemes. **Avoid other shades like `orange-300`** — they are *not* remapped and stay pale/washed-out on white.

## Deployment

`apps/slides` ships both `netlify.toml` and `vercel.json` (SPA rewrite to `/index.html`, build `npm run build` → `dist`).
