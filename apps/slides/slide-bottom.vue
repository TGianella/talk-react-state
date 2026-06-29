<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

/**
 * Per-slide breadcrumb: shows the current chapter and the tool being showcased.
 *
 * `slide-bottom.vue` is rendered *inside each slide's context* (unlike the
 * single-instance `global-bottom.vue`), so `$page` is this slide's own number
 * and the crumb renders correctly in `slidev export --per-slide` too.
 *
 * The crumb is derived, not hand-set per slide: divider slides carry a `crumb`
 * frontmatter field, and we walk the deck up to the current slide to find the
 * active chapter/tool.
 *
 *   ---
 *   layout: section
 *   crumb: { chapter: "3 · L'état serveur" }   # chapter divider — resets tool
 *   ---
 *
 *   ---
 *   layout: cover
 *   crumb: { tool: "TanStack Query" }           # tool divider — keeps chapter
 *   ---
 *
 *   ---
 *   crumb: { clear: true }                       # drop the crumb (intro/outro)
 *   ---
 *
 * Hidden on the divider slides themselves (cover/section layouts) — they already
 * announce the chapter/tool — and on any slide before the first chapter (intro).
 */
const { $slidev, $page } = useSlideContext()

// `slides` and `$page` may arrive as refs or as plain values depending on the
// render context, so unwrap defensively.
const unref = (v: any) => (v && typeof v === 'object' && 'value' in v ? v.value : v)
const slideList = () => unref($slidev?.nav?.slides) ?? []
const pageNo = () => unref($page) ?? 1

const state = computed(() => {
  const list = slideList()
  const no = pageNo() // this slide's 1-based number
  let chapter: string | null = null
  let tool: string | null = null
  for (let i = 0; i < no && i < list.length; i++) {
    const crumb = list[i]?.meta?.slide?.frontmatter?.crumb
    if (!crumb)
      continue
    if (crumb.clear) {
      chapter = null
      tool = null
    }
    if (crumb.chapter) {
      chapter = crumb.chapter
      tool = crumb.tool ?? null // a new chapter resets the tool
    }
    else if (crumb.tool) {
      tool = crumb.tool
    }
  }
  return { chapter, tool }
})

const layout = computed(() => slideList()[pageNo() - 1]?.meta?.layout)

const visible = computed(() =>
  !!state.value.chapter && layout.value !== 'cover' && layout.value !== 'section',
)
</script>

<template>
  <div v-if="visible" class="deck-breadcrumb">
    <span class="bc-chapter">{{ state.chapter }}</span>
    <template v-if="state.tool">
      <span class="bc-sep">›</span>
      <span class="bc-tool">{{ state.tool }}</span>
    </template>
  </div>
</template>

<style scoped>
.deck-breadcrumb {
  position: absolute;
  left: 1.1rem;
  bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4em;
  font-size: 0.7rem;
  line-height: 1;
  letter-spacing: 0.01em;
  pointer-events: none;
  z-index: 5;
}
.bc-chapter {
  color: var(--slidev-theme-primary, currentColor);
  font-weight: 600;
  opacity: 0.55;
}
.bc-sep {
  color: var(--slidev-theme-primary, currentColor);
  opacity: 0.4;
}
.bc-tool {
  color: rgb(var(--accent));
  font-weight: 700;
}
</style>
