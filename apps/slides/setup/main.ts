import { defineAppSetup } from '@slidev/types'
import type { DirectiveBinding, ObjectDirective } from 'vue'

/**
 * Global fix for `v-mark` inside `v-click` (slidevjs/slidev#2331).
 *
 * Vue runs directive `mounted` hooks child-first, so a `v-mark` nested in a
 * `v-click` registers its click *before* the parent. With both on the implicit
 * `'+1'`, the mark grabs the lower number: it fires (invisibly) one click early
 * AND pushes the line one click later — a wasted click. The maintainer says the
 * relative/implicit case can't be fixed and to use an explicit `at`.
 *
 * Fix: default a bare `v-mark` (no explicit `at`) to the relative `'+0'`.
 * `'+0'` resolves to delta 0 — it consumes no click and shifts nothing — with
 * `start = currentOffset`. So the mark never inflates the surrounding `v-click`
 * (the line keeps its own click number, no wasted click), and it reveals *with*
 * whatever step shows its container: inside a `v-click` it sits in the line's
 * `opacity:0` subtree until the line appears, then shows already-drawn.
 *
 * It stays a real, reactive click (unlike a draw-once `at: false`, which
 * measured nothing when a slide mounted off-screen during a soft navigation),
 * so it redraws across navigation just like any normal mark — and because it's
 * registered synchronously at mount it triggers no "register after mounted"
 * warnings.
 *
 * Marks with an explicit `at` (`v-mark="3"`, `v-mark="{ at: 2 }"`, …) are left
 * to the built-in directive untouched — use those for a deliberate click beat.
 */
export default defineAppSetup(({ app }) => {
  const original = app.directive('mark') as ObjectDirective<HTMLElement> | undefined
  const mounted = original?.mounted
  if (!mounted) {
    console.warn('[slides] v-mark override skipped: built-in directive not found')
    return
  }

  const hasExplicitAt = (v: any) =>
    (v != null && typeof v !== 'object')
    || (v && typeof v === 'object' && !Array.isArray(v) && v.at != null)

  app.directive('mark', {
    ...original,
    mounted(el, binding, vnode, prev) {
      if (!hasExplicitAt(binding.value)) {
        const value = binding.value && typeof binding.value === 'object' && !Array.isArray(binding.value)
          ? { ...binding.value, at: '+0' }
          : '+0'
        binding = { ...binding, value }
      }
      return mounted.call(this, el, binding as DirectiveBinding, vnode, prev)
    },
  })
})
