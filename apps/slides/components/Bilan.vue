<script setup lang="ts">
// Scorecard réutilisable pour chaque solution du talk.
// Critères PARTAGÉS (ordre fixe) — passer `scores` dans ce même ordre, note de 0 à 5.
const criteres = [
  'Prise en main',
  'Poids du package',
  'Performance',
  'Écosystème & outillage',
  'Montée en charge',
]
const POIDS_INDEX = 1

defineProps<{
  scores: number[] // [priseEnMain, poidsDuPackage, performance, écosystème, montéeEnCharge]
  poids?: string // poids exact du package, ex. "4.2 kB (gzip)"
  perimetre?: string
  idealPour?: string
  avantages?: string[]
  limites?: string[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-12 pt-4">
    <!-- Scorecard partagée + contexte -->
    <div class="space-y-4">
      <div
        v-for="(c, i) in criteres"
        :key="c"
        class="flex items-center justify-between gap-4 border-b border-gray-700 pb-2"
      >
        <span class="text-sm opacity-80">{{ c }}</span>
        <span class="flex items-center gap-3 whitespace-nowrap">
          <span
            v-if="i === POIDS_INDEX && poids"
            class="font-mono text-xs px-2 py-0.5 border border-orange-500 text-orange-400 rounded"
          >{{ poids }}</span>
          <span class="font-mono text-lg tracking-widest">
            <span
              v-for="n in 5"
              :key="n"
              :class="n <= scores[i] ? 'text-orange-400' : 'opacity-20'"
            >●</span>
          </span>
        </span>
      </div>

      <div v-if="perimetre || idealPour" class="text-sm space-y-1 pt-1">
        <div v-if="perimetre">
          <span class="opacity-50 uppercase text-xs tracking-widest">Périmètre</span> · <b>{{ perimetre }}</b>
        </div>
        <div v-if="idealPour">
          <span class="opacity-50 uppercase text-xs tracking-widest">Idéal pour</span> · {{ idealPour }}
        </div>
      </div>
    </div>

    <!-- Avantages / limites (listes extensibles) -->
    <div class="text-sm space-y-4 self-center">
      <div v-if="avantages?.length">
        <div class="font-bold pb-1">👍 Avantages</div>
        <ul class="list-disc list-inside space-y-1 opacity-80">
          <li v-for="a in avantages" :key="a">{{ a }}</li>
        </ul>
      </div>
      <div v-if="limites?.length">
        <div class="font-bold pb-1">👎 Limites</div>
        <ul class="list-disc list-inside space-y-1 opacity-80">
          <li v-for="l in limites" :key="l">{{ l }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
