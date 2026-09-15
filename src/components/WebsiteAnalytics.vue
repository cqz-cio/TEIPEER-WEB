<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { previewActive } from '../cms/preview-context.js'
import { createAnalyticsClient, pageView, randomId } from '../cms/analytics.js'

const route = useRoute()
const { locale } = useI18n()
const enabled = ref(false)
const decision = ref('')
const busy = ref(false)
const error = ref('')
const client = createAnalyticsClient()
const storageKey = 'tripeer-analytics-consent-v1'
let identity, policy, disposed = false, generation = 0
let lastPath = '', lastTime = 0
const read = (storage, key) => { try { return JSON.parse(storage.getItem(key)) } catch { return null } }
const write = (storage, key, value) => { try { value ? storage.setItem(key, JSON.stringify(value)) : storage.removeItem(key) } catch { /* The in-memory choice remains usable. */ } }

function restoreChoice() {
  const value = read(localStorage, storageKey)
  identity = null; decision.value = ''
  if (value?.policy !== policy || value.expires <= Date.now()) return
  if (value.decision === 'declined') { decision.value = 'declined'; return }
  if (value.decision === 'accepted' && typeof value.evidence === 'string' && /^[a-f0-9-]{36}$/.test(value.visitor || '')) {
    const session = read(sessionStorage, 'tripeer-analytics-session') || randomId()
    write(sessionStorage, 'tripeer-analytics-session', session)
    identity = { evidence: value.evidence, visitor: value.visitor, session, expires: value.expires }
    decision.value = 'accepted'
  }
}
async function track() {
  if (!enabled.value || disposed || route.name === 'cms-preview') return
  if (identity && identity.expires <= Date.now()) { identity = null; decision.value = ''; write(localStorage, storageKey, null) }
  const event = pageView(route.path, { preview: previewActive.value, consent: decision.value === 'accepted' && Boolean(identity) })
  if (!event || (lastPath === route.path && Date.now() - lastTime < 5000)) return
  lastPath = route.path; lastTime = Date.now()
  try { await client.track(event, identity) } catch { /* Analytics must never block reading or navigation; no retry inflation. */ }
}
async function choose(accepted) {
  if (busy.value) return
  const current = ++generation
  busy.value = true; error.value = ''
  try {
    const oldEvidence = identity?.evidence
    if (!accepted) {
      identity = null; decision.value = 'declined'
      write(localStorage, storageKey, { decision: 'declined', policy, expires: Date.now() + 180 * 86400000 })
      write(sessionStorage, 'tripeer-analytics-session', null)
      if (oldEvidence) await client.withdraw(oldEvidence)
      return
    }
    const grant = await client.consent(policy)
    if (disposed || current !== generation) return
    if (!grant?.evidence || grant.policyVersion !== policy || grant.expiresAtEpochSeconds * 1000 <= Date.now()) throw new Error()
    const visitor = randomId(), session = randomId()
    identity = { visitor, session, evidence: grant.evidence, expires: grant.expiresAtEpochSeconds * 1000 }
    write(localStorage, storageKey, { decision: 'accepted', policy, visitor, evidence: grant.evidence, expires: grant.expiresAtEpochSeconds * 1000 })
    write(sessionStorage, 'tripeer-analytics-session', session)
    decision.value = 'accepted'; lastPath = ''; await track()
  } catch {
    error.value = locale.value === 'zh' ? '统计服务暂不可用；当前选择不会影响浏览。' : 'Analytics is temporarily unavailable. You can continue browsing.'
  } finally { if (!disposed) busy.value = false }
}
function storageChanged(event) { if (event.key === storageKey) { generation++; restoreChoice() } }
watch([() => route.path, previewActive], track)
onMounted(async () => {
  if (import.meta.env.VITE_CMS_ENABLED !== 'true') return
  window.addEventListener('storage', storageChanged)
  try {
    const config = await client.config()
    if (disposed || !config.enabled || typeof config.policyVersion !== 'string') return
    policy = config.policyVersion; enabled.value = true
    restoreChoice(); await track()
  } catch { /* No tracking or prompt when the backend is not configured. */ }
})
onBeforeUnmount(() => { disposed = true; generation++; window.removeEventListener('storage', storageChanged) })
</script>

<template>
  <aside v-if="enabled && !previewActive && route.name !== 'cms-preview'" class="analytics-choice" :aria-label="locale === 'zh' ? '访问统计设置' : 'Analytics preferences'">
    <template v-if="!decision">
      <span>{{ locale === 'zh' ? '允许匿名访问统计？用于了解页面浏览量，不收集咨询内容。' : 'Allow anonymous analytics to measure page visits? Inquiry content is not collected.' }}</span>
      <button :disabled="busy" @click="choose(true)">{{ locale === 'zh' ? '允许统计' : 'Allow' }}</button>
      <button :disabled="busy" @click="choose(false)">{{ locale === 'zh' ? '暂不允许' : 'Decline' }}</button>
    </template>
    <template v-else>
      <span>{{ locale === 'zh' ? (decision === 'accepted' ? '访问统计已允许' : '访问统计已关闭') : (decision === 'accepted' ? 'Analytics enabled' : 'Analytics disabled') }}</span>
      <button :disabled="busy" @click="choose(decision !== 'accepted')">{{ locale === 'zh' ? (decision === 'accepted' ? '撤回同意' : '允许统计') : (decision === 'accepted' ? 'Withdraw consent' : 'Allow analytics') }}</button>
    </template>
    <span v-if="error" role="status">{{ error }}</span>
  </aside>
</template>
<style scoped>
.analytics-choice { padding: 14px 24px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; font-size: 13px; background: #f6f7f8; color: #374151; }
.analytics-choice button { text-decoration: underline; }
</style>
