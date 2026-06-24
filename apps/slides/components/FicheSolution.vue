<script setup lang="ts">
// Carte d'introduction réutilisable — PREMIÈRE slide de chaque sous-section solution.
// Pendant du `Bilan` (qui clôt la solution). Le titre (`# Nom`) reste dans le markdown ;
// ce composant rend le corps : qui, quand, pour résoudre quoi, et son créneau.
defineProps<{
  annee?: string // année de création, ex. "2019"
  auteur?: string // créateur(s) / équipe, ex. "Paul Henschel — pmndrs"
  tagline?: string // accroche en une phrase
  probleme?: string // le problème que la solution vient résoudre
  creneau?: string // sa niche, là où elle brille
  infos?: string[] // autres faits intéressants (à savoir)
}>()
</script>

<template>
  <div class="pt-2">
    <!-- Méta : année + auteur -->
    <div v-if="annee || auteur" class="flex items-center gap-4 text-sm">
      <span
        v-if="annee"
        class="font-mono px-2 py-0.5 border border-orange-500 text-orange-400 rounded"
      >{{ annee }}</span>
      <span v-if="auteur" class="opacity-70">par <b class="opacity-100">{{ auteur }}</b></span>
    </div>

    <p v-if="tagline" class="text-xl pt-3 opacity-90 italic">« {{ tagline }} »</p>

    <!-- Problème ↔ créneau -->
    <div v-if="probleme || creneau" class="grid grid-cols-2 gap-8 pt-6">
      <div v-if="probleme" class="border-l-4 border-orange-500 pl-3">
        <div class="opacity-50 uppercase text-xs tracking-widest pb-1">Le problème</div>
        <div class="opacity-90 text-sm">{{ probleme }}</div>
      </div>
      <div v-if="creneau" class="border-l-4 border-gray-600 pl-3">
        <div class="opacity-50 uppercase text-xs tracking-widest pb-1">Son créneau</div>
        <div class="opacity-90 text-sm">{{ creneau }}</div>
      </div>
    </div>

    <!-- Autres faits intéressants -->
    <div v-if="infos?.length" class="pt-6">
      <div class="opacity-50 uppercase text-xs tracking-widest pb-2">À savoir</div>
      <ul class="space-y-1.5 opacity-80 text-sm">
        <li v-for="info in infos" :key="info" class="flex gap-2">
          <span class="text-orange-400">·</span><span>{{ info }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
