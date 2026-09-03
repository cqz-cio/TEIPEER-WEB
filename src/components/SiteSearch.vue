<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PhArrowRight as ArrowRight, PhMagnifyingGlass as MagnifyingGlass, PhX as X } from '@phosphor-icons/vue'
import { siteSearchItems } from '../search-data'

const props = defineProps({ mobile: { type: Boolean, default: false } })
const emit = defineEmits(['navigate'])
const { locale } = useI18n()
const router = useRouter()
const root = ref(null)
const input = ref(null)
const query = ref('')
const isOpen = ref(false)
const activeIndex = ref(-1)
const searchId = useId()

const copy = computed(() => locale.value === 'zh' ? {
  label: '站内搜索', placeholder: '请输入关键词', results: '搜索结果', clear: '清除搜索内容',
  empty: '未找到相关内容', emptyHint: '试试“产品”“定制”或“供应链”', page: '页面', section: '栏目',
} : {
  label: 'Site search', placeholder: 'Search', results: 'Search results', clear: 'Clear search',
  empty: 'No matching content found', emptyHint: 'Try “products”, “customization” or “supply chain”', page: 'Page', section: 'Section',
})

const items = computed(() => siteSearchItems.map((item) => {
  const [title, description, keywords] = item[locale.value]
  return { ...item, title, description, keywords }
}))
const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase())
const results = computed(() => {
  if (!normalizedQuery.value) return []
  const terms = normalizedQuery.value.split(/\s+/).filter(Boolean)
  return items.value.map((item) => {
    const title = item.title.toLocaleLowerCase()
    const description = item.description.toLocaleLowerCase()
    const keywords = item.keywords.toLocaleLowerCase()
    let score = 0
    terms.forEach((term) => {
      if (title === term) score += 12
      else if (title.startsWith(term)) score += 8
      else if (title.includes(term)) score += 6
      if (keywords.includes(term)) score += 3
      if (description.includes(term)) score += 2
    })
    return { ...item, score }
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 6)
})

const openSearch = async () => {
  isOpen.value = true
  await nextTick()
  input.value?.focus()
}
const closeSearch = () => {
  isOpen.value = false
  activeIndex.value = -1
}
const clearSearch = async () => {
  query.value = ''
  await nextTick()
  input.value?.focus()
}
const navigateTo = async (item) => {
  if (!item) return
  await router.push(item.to)
  query.value = ''
  closeSearch()
  emit('navigate')
}
const submitSearch = () => {
  if (!isOpen.value) return openSearch()
  if (!normalizedQuery.value) return input.value?.focus()
  navigateTo(results.value[activeIndex.value] || results.value[0])
}
const moveActive = (direction) => {
  if (!results.value.length) return
  const next = activeIndex.value + direction
  activeIndex.value = next < 0 ? results.value.length - 1 : next % results.value.length
}
const handleKeydown = (event) => {
  if (event.key === 'ArrowDown') { event.preventDefault(); moveActive(1) }
  else if (event.key === 'ArrowUp') { event.preventDefault(); moveActive(-1) }
  else if (event.key === 'Escape') { event.preventDefault(); closeSearch(); input.value?.blur() }
}
const handleOutside = (event) => {
  if (!root.value?.contains(event.target)) closeSearch()
}

watch(query, () => { activeIndex.value = -1 })
watch(locale, () => { query.value = ''; closeSearch() })
onMounted(() => document.addEventListener('pointerdown', handleOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutside))
</script>

<template>
  <div ref="root" class="site-search" :class="{ 'site-search-mobile': props.mobile, 'search-open': isOpen || normalizedQuery }" role="search">
    <form class="site-search-form" :aria-label="copy.label" @submit.prevent="submitSearch">
      <label class="visually-hidden" :for="searchId">{{ copy.label }}</label>
      <input
        :id="searchId"
        ref="input"
        v-model="query"
        type="search"
        autocomplete="off"
        :placeholder="copy.placeholder"
        :aria-expanded="isOpen && Boolean(normalizedQuery)"
        :aria-controls="`${searchId}-results`"
        :aria-activedescendant="activeIndex >= 0 ? `${searchId}-option-${activeIndex}` : undefined"
        role="combobox"
        aria-autocomplete="list"
        @focus="isOpen = true"
        @keydown="handleKeydown"
      />
      <button v-if="query" class="site-search-clear" type="button" :aria-label="copy.clear" @click="clearSearch">
        <X :size="15" weight="bold" aria-hidden="true" />
      </button>
      <button class="site-search-submit" type="submit" :aria-label="copy.label">
        <MagnifyingGlass :size="20" weight="bold" aria-hidden="true" />
      </button>
    </form>

    <div v-if="isOpen && normalizedQuery" :id="`${searchId}-results`" class="site-search-results" role="listbox" :aria-label="copy.results">
      <template v-if="results.length">
        <div class="site-search-results-heading"><span>{{ copy.results }}</span><span>{{ results.length }}</span></div>
        <button
          v-for="(item, index) in results"
          :id="`${searchId}-option-${index}`"
          :key="`${item.title}-${item.type}`"
          class="site-search-result"
          :class="{ active: activeIndex === index }"
          type="button"
          role="option"
          :aria-selected="activeIndex === index"
          @mouseenter="activeIndex = index"
          @click="navigateTo(item)"
        >
          <span class="site-search-result-copy">
            <span class="site-search-result-meta">{{ copy[item.type] }}</span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.description }}</small>
          </span>
          <ArrowRight :size="18" aria-hidden="true" />
        </button>
      </template>
      <div v-else class="site-search-empty">
        <MagnifyingGlass :size="24" aria-hidden="true" />
        <strong>{{ copy.empty }}</strong>
        <span>{{ copy.emptyHint }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.site-search {
  position: relative;
  width: clamp(168px, 12vw, 218px);
  flex: 0 0 auto;
}

.site-search-form {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  overflow: hidden;
  border: 1px solid #d8dde5;
  border-radius: 999px;
  background: #fff;
  transition: border-color .18s ease, box-shadow .18s ease, width .2s ease;
}

.site-search-form:focus-within {
  border-color: #133b78;
  box-shadow: 0 0 0 3px rgba(19, 59, 120, .1);
}

.site-search input {
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0 62px 0 15px;
  border: 0;
  outline: 0;
  color: #172033;
  background: transparent;
  font: inherit;
  font-size: 13px;
}

.site-search input::-webkit-search-cancel-button { display: none; }
.site-search input::placeholder { color: #89919d; opacity: 1; }

.site-search-submit,
.site-search-clear {
  position: absolute;
  top: 50%;
  display: grid;
  place-items: center;
  transform: translateY(-50%);
  color: #111827;
}

.site-search-submit { right: 5px; width: 32px; height: 32px; border-radius: 50%; }
.site-search-clear { right: 35px; width: 25px; height: 30px; color: #7d8796; }
.site-search-submit:hover,
.site-search-submit:focus-visible { color: #133b78; background: #eef3f9; }
.site-search-clear:hover,
.site-search-clear:focus-visible { color: #172033; }

.site-search-results {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 20;
  width: min(420px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid #e1e5eb;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 20px 56px rgba(8, 38, 84, .18);
}

.site-search-results-heading {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px 9px;
  border-bottom: 1px solid #edf0f4;
  color: #778191;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.site-search-result {
  width: 100%;
  min-height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #edf0f4;
  color: #172033;
  text-align: left;
}

.site-search-result:last-child { border-bottom: 0; }
.site-search-result:hover,
.site-search-result:focus-visible,
.site-search-result.active {
  outline: 0;
  background: #f3f6fb;
  box-shadow: inset 3px 0 #f57a25;
}
.site-search-result > svg { flex: 0 0 auto; color: #133b78; }
.site-search-result-copy { min-width: 0; display: grid; gap: 2px; }
.site-search-result-meta { color: #e26817; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.site-search-result strong { font-size: 14px; line-height: 1.35; }
.site-search-result small {
  overflow: hidden;
  color: #687487;
  font-size: 12px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-search-empty {
  min-height: 150px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  padding: 24px;
  color: #7b8593;
  text-align: center;
}
.site-search-empty strong { color: #2d3748; font-size: 14px; }
.site-search-empty span { font-size: 12px; }

.site-search-mobile { width: 100%; margin: 4px 0 12px; }
.site-search-mobile .site-search-form { height: 44px; border-radius: 5px; background: #f7f9fc; }
.site-search-mobile .site-search-results {
  position: static;
  width: 100%;
  margin-top: 8px;
  border-radius: 5px;
  box-shadow: 0 10px 28px rgba(8, 38, 84, .1);
}

@media (min-width: 761px) and (max-width: 1120px) {
  .site-search:not(.site-search-mobile) { width: 42px; height: 38px; }
  .site-search:not(.site-search-mobile) .site-search-form { position: absolute; top: 0; right: 0; width: 38px; }
  .site-search:not(.site-search-mobile) input { padding-inline: 0; opacity: 0; pointer-events: none; }
  .site-search:not(.site-search-mobile) .site-search-clear { display: none; }
  .site-search:not(.site-search-mobile).search-open .site-search-form { width: min(290px, calc(100vw - 32px)); }
  .site-search:not(.site-search-mobile).search-open input { padding: 0 62px 0 15px; opacity: 1; pointer-events: auto; }
  .site-search:not(.site-search-mobile).search-open .site-search-clear { display: grid; }
}
</style>
