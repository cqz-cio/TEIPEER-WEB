<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { startPreview } from '../cms/preview-context.js'
const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const error = ref('')
let disposed = false
async function load() {
  const ticket = typeof route.query.ticket === 'string' ? route.query.ticket : ''
  await router.replace({ name: 'cms-preview', query: {} })
  if (disposed) return
  try {
    const snapshot = await startPreview(ticket)
    if (!snapshot || disposed) return
    locale.value = snapshot.locale === 'zh-CN' ? 'zh' : 'en'
    await router.replace(snapshot.article ? { name: 'cms-article', params: { slug: snapshot.article.slug } } : { name: 'home' })
  } catch (err) { if (!disposed) error.value = err.message || '预览打开失败，请从 ERP 重新打开。' }
}
load()
onBeforeUnmount(() => { disposed = true })
</script>
<template><p v-if="error" role="alert">{{ error }}</p><p v-else role="status">正在读取官网预览…</p></template>
