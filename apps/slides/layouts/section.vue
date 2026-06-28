<script setup lang="ts">
import Cover from './cover.vue'

/**
 * Override of the built-in `section` layout: an alias of `cover` so every
 * chapter divider (which already uses `layout: section`) renders as a cover
 * slide with no markup change — and stays conflict-free with in-review branches.
 * Pass `image:` / `position:` in frontmatter exactly like `layout: cover`.
 */
defineProps<{
  image?: string
  position?: string
  credit?: string
}>()
</script>

<template>
  <Cover :image="image" :position="position" :credit="credit" variant="section">
    <slot />
  </Cover>
</template>
