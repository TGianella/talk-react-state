<script setup lang="ts">
import { computed } from 'vue'

/**
 * Cover / divider layout: a full-bleed background photo, dimmed, with the title
 * in a semi-opaque overlay panel. Used for every title slide.
 *
 *   ---
 *   layout: cover
 *   image: /covers/zustand.jpg        # optional; falls back to an accent gradient
 *   position: top                     # optional background-position
 *   credit: Jane Doe                  # optional photo credit, shown bottom-right
 *   ---
 *   # Zustand
 *   <div class="opacity-70 pt-2">…</div>
 *
 * `layouts/section.vue` is a thin alias of this, so chapter dividers (which
 * already say `layout: section`) get the same look with no markup change.
 * Styles live in `styles/index.css` so they also reach slotted markdown.
 */
const props = defineProps<{
  image?: string
  position?: string
  credit?: string
}>()

function resolveAssetUrl(url: string) {
  if (url.startsWith('/'))
    return import.meta.env.BASE_URL + url.slice(1)
  return url
}

const style = computed(() => {
  if (!props.image)
    return {}
  // Neutral (greyscale) dim so the already-greyscale photo keeps no colour cast
  // while the white title stays readable.
  const dim = 'linear-gradient(rgb(0 0 0 / 0.45), rgb(0 0 0 / 0.6))'
  return {
    backgroundImage: `${dim}, url("${resolveAssetUrl(props.image)}")`,
    backgroundPosition: props.position ?? 'center',
  }
})
</script>

<template>
  <div
    class="slidev-layout cover-slide"
    :class="{ 'has-image': image }"
    :style="style"
  >
    <div class="cover-panel">
      <slot />
    </div>
    <div v-if="image && credit" class="cover-credit">
      Photo : {{ credit }}
    </div>
  </div>
</template>
