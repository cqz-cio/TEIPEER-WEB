<script setup>
defineProps({ items: { type: Array, required: true } })
</script>
<template>
  <template v-for="item in items" :key="item.key">
    <RouterLink v-if="item.href" :to="item.href">{{ item.label }}</RouterLink>
    <span v-else>{{ item.label }}</span>
    <div v-if="item.children.length" class="cms-nested-nav"><CmsNavigationItems :items="item.children" /></div>
  </template>
</template>
<style scoped>.cms-nested-nav { padding-left: 16px; }</style>
