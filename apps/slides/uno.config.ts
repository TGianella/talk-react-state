import { defineConfig } from 'unocss'

/**
 * Adaptive accent colour for the deck.
 *
 * The whole `orange` palette is redefined to read the `--accent` CSS variable
 * (RGB channels), which `styles/index.css` sets per colour-scheme. Because every
 * accent in the slides is already written as `*-orange-400/500` — and because
 * `v-mark.orange` strokes using the element's computed `text-orange` colour —
 * this single override makes every accent *and* every mark theme-aware with no
 * markup changes. The `<alpha-value>` placeholder keeps `bg-orange-400/10`-style
 * transparency working.
 *
 * Slidev deep-merges this with its built-in UnoCSS config (user config wins),
 * so the untouched orange shades (50…900) from preset-wind survive.
 */
const accent = 'rgb(var(--accent) / <alpha-value>)'

export default defineConfig({
  theme: {
    colors: {
      orange: {
        DEFAULT: accent,
        400: accent,
        500: accent,
        600: accent,
      },
    },
  },
})
