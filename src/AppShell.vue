<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import LegacyHome from './App.vue'
import AboutExperience from './views/AboutExperience.vue'
import BusinessExperience from './views/BusinessExperience.vue'
import CapabilityExperience from './views/CapabilityExperience.vue'
import InsightsExperience from './views/InsightsExperience.vue'
import ContactExperience from './views/ContactExperience.vue'
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
  <LegacyHome v-if="isHome" />
  <BusinessExperience v-else-if="isBusiness" />
  <CapabilityExperience v-else-if="isCapability" />
  <InsightsExperience v-else-if="isInsight" />
  <ContactExperience v-else-if="isContact" />
  <AboutExperience v-else />
</template>

