<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import LegacyHome from './App.vue'
import WebsiteAnalytics from './components/WebsiteAnalytics.vue'
import AboutExperience from './views/AboutExperience.vue'
import BusinessExperience from './views/BusinessExperience.vue'
import CapabilityExperience from './views/CapabilityExperience.vue'
import InsightsExperience from './views/InsightsExperience.vue'
import ContactExperience from './views/ContactExperience.vue'
import CmsPreviewExperience from './views/CmsPreviewExperience.vue'
import CmsArticleExperience from './views/CmsArticleExperience.vue'
import { previewActive, previewExpired, previewArticle, clearPreview } from './cms/preview-context.js'
import { createMotionController } from './motion'
import './about.css'
import './business.css'
import './knowledge.css'
import './contact.css'

const { t, locale } = useI18n()
const route = useRoute()
const isHome = computed(() => route.name === 'home')
const isBusiness = computed(() => String(route.name || '').startsWith('business-'))
const isCapability = computed(() => String(route.name || '').startsWith('capability-'))
const isInsight = computed(() => String(route.name || '').startsWith('insight-'))
const isContact = computed(() => route.name === 'contact')
let motionController
let previewRobots
watch(previewActive, (active) => {
  previewRobots?.remove()
  if (active) {
    previewRobots = document.createElement('meta'); previewRobots.name = 'robots'; previewRobots.content = 'noindex,nofollow,noarchive'; document.head.appendChild(previewRobots)
  }
}, { immediate: true })
function exitPreview() { clearPreview(); window.location.replace('/#/') }

watch(
  [locale, () => route.fullPath],
  () => {
    if (isHome.value) return
    document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
    document.title = route.meta.aboutTitle?.[locale.value] || route.meta.businessTitle?.[locale.value] || route.meta.capabilityTitle?.[locale.value] || route.meta.insightTitle?.[locale.value] || route.meta.contactTitle?.[locale.value] || t('meta.title')
    const description = route.meta.aboutDescription?.[locale.value] || route.meta.businessDescription?.[locale.value] || route.meta.capabilityDescription?.[locale.value] || route.meta.insightDescription?.[locale.value] || route.meta.contactDescription?.[locale.value] || t('meta.description')
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  },
  { immediate: true },
)

watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    motionController?.observe()
  },
)

onMounted(async () => {
  motionController = createMotionController()
  await nextTick()
  motionController.observe()
})

onBeforeUnmount(() => motionController?.destroy())
</script>

<template>
  <aside v-if="previewActive" role="status" class="cms-preview-notice">
    {{ previewExpired ? '预览已过期，请从 ERP 重新打开。' : '官网草稿预览 · 首页与导航为草稿，选中的文章为草稿，其余内容为已发布内容' }}
    <RouterLink v-if="!previewExpired" to="/">首页</RouterLink>
    <RouterLink v-if="previewArticle && !previewExpired" :to="{ name: 'cms-article', params: { slug: previewArticle.slug } }">当前文章</RouterLink>
    <button type="button" @click="exitPreview">退出预览</button>
  </aside>
  <CmsPreviewExperience v-if="route.name === 'cms-preview'" />
  <p v-else-if="previewExpired" role="alert">当前草稿已清除，请退出预览或返回 ERP 重新生成链接。</p>
  <CmsArticleExperience v-else-if="route.name === 'cms-article'" />
  <LegacyHome v-else-if="isHome" />
  <BusinessExperience v-else-if="isBusiness" />
  <CapabilityExperience v-else-if="isCapability" />
  <InsightsExperience v-else-if="isInsight" />
  <ContactExperience v-else-if="isContact" />
  <AboutExperience v-else />
  <WebsiteAnalytics />
</template>


<style scoped>
.cms-preview-notice { padding: 12px 20px; background: #fff3cd; color: #493500; position: relative; z-index: 100; }
.cms-preview-notice a, .cms-preview-notice button { margin-left: 16px; text-decoration: underline; }
</style>
