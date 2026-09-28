<script setup>
import {
  PhUsersThree as UsersThree,
  PhChartLineUp as ChartLineUp,
  PhShieldCheck as ShieldCheck,
} from '@phosphor-icons/vue'

defineProps({
  items: { type: Array, required: true },
  label: { type: String, required: true },
})

const icons = [UsersThree, ChartLineUp, ShieldCheck]
</script>

<template>
  <section class="culture-values" :aria-label="label">
    <article v-for="(item, index) in items" :key="item.title" class="culture-value">
      <component :is="icons[index]" :size="60" weight="thin" aria-hidden="true" />
      <div><h3>{{ item.title }}</h3><p v-if="item.body">{{ item.body }}</p></div>
    </article>
  </section>
</template>

<style scoped>
.culture-values { color: var(--navy); }
</style>
