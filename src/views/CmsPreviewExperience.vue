<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LegacyHome from '../App.vue'
import { previewPage, startPreview, clearPreview } from '../cms/preview-context.js'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const originalLocale = locale.value
const loading = ref(true)
const error = ref('')
let disposed = false
const robots = document.createElement('meta')
robots.name = 'robots'
robots.content = 'noindex,nofollow,noarchive'
document.head.appendChild(robots)

async function load() {
  const ticket = typeof route.query.ticket === 'string' ? route.query.ticket : ''
  // Remove the one-time credential even when exchange fails.
  await router.replace({ name: 'cms-preview', query: {} })
  if (disposed) return
  try {
    const page = await startPreview(ticket)
    if (page && !disposed) locale.value = page.locale === 'zh-CN' ? 'zh' : 'en'
  } catch (err) {
    if (!disposed) error.value = err.message || '预览打开失败，请从 ERP 重新打开。'
  } finally { if (!disposed) loading.value = false }
}
watch(previewPage, (value) => {
  if (!value && !loading.value) error.value = '预览已过期，请从 ERP 重新打开。'
})
load()
onBeforeUnmount(() => {
  disposed = true
  clearPreview()
  robots.remove()
  locale.value = originalLocale
})
</script>

<template>
  <aside role="status" class="cms-preview-notice">
    草稿预览 · 当前只预览首页首屏，其余模块保持现有内容
    <RouterLink :to="{ name: 'home' }">退出预览</RouterLink>
  </aside>
  <p v-if="loading" role="status">正在读取预览…</p>
  <p v-else-if="error" role="alert">{{ error }}</p>
  <LegacyHome v-else-if="previewPage" />
</template>

<style scoped>
.cms-preview-notice { padding: 12px 20px; background: #fff3cd; color: #493500; position: relative; z-index: 100; }
.cms-preview-notice a { margin-left: 16px; text-decoration: underline; }
</style>
