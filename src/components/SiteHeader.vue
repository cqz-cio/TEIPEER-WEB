<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import SiteSearch from './SiteSearch.vue'
import { PhCaretDown as CaretDown, PhList as List, PhX as X } from '@phosphor-icons/vue'

const { t, locale } = useI18n()
const route = useRoute()
const menuOpen = ref(false)
const mobileGroupOpen = ref('')
const dismissedDropdown = ref('')

const isAbout = computed(() => String(route.name || '').startsWith('about-'))
const isBusiness = computed(() => String(route.name || '').startsWith('business-'))
const isInsight = computed(() => String(route.name || '').startsWith('insight-'))

const aboutNav = computed(() => locale.value === 'zh'
  ? [{ label: '公司概况', route: 'about-profile' }, { label: '发展历程', route: 'about-history' }, { label: '海外市场', route: 'about-markets' }]
  : [{ label: 'Company Profile', route: 'about-profile' }, { label: 'Our Journey', route: 'about-history' }, { label: 'Overseas Markets', route: 'about-markets' }])

const navGroups = computed(() => [
  { key: 'about', label: t('nav.about'), active: isAbout.value, items: aboutNav.value, aria: locale.value === 'zh' ? '公司介绍二级导航' : 'About submenu' },
  { key: 'business', label: locale.value === 'zh' ? '业务介绍' : 'Business', active: isBusiness.value, route: 'business-overview' },
  { key: 'news', label: locale.value === 'zh' ? '新闻动态' : 'News & Updates', active: isInsight.value, items: locale.value === 'zh' ? [{ label: '行业动态', route: 'insight-industry' }, { label: '公司动态', route: 'insight-company' }] : [{ label: 'Industry News', route: 'insight-industry' }, { label: 'Company News', route: 'insight-company' }], aria: locale.value === 'zh' ? '新闻动态二级导航' : 'News submenu' },
  { key: 'culture', label: locale.value === 'zh' ? '企业文化' : 'Corporate Culture', active: route.name === 'corporate-culture', route: 'corporate-culture' },
])

const setLocale = (nextLocale) => {
  locale.value = nextLocale
  localStorage.setItem('tripeer-locale', nextLocale)
  closeMenu()
}

const closeMenu = () => {
  menuOpen.value = false
  mobileGroupOpen.value = ''
}

const toggleMobileGroup = (key) => {
  mobileGroupOpen.value = mobileGroupOpen.value === key ? '' : key
}

const dismissDesktopDropdown = (key, event) => {
  dismissedDropdown.value = key
  event?.currentTarget?.blur()
}

const releaseDesktopDropdown = (key) => {
  if (dismissedDropdown.value === key) dismissedDropdown.value = ''
}

const handleResize = () => {
  if (window.innerWidth > 760) closeMenu()
}

watch(() => route.fullPath, () => closeMenu())
onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink class="brand" :to="{ name: 'home' }" aria-label="TRIPEER home" @click="closeMenu">
        <img src="/assets/tripeer-logo-transparent.png" alt="TRIPEER" />
      </RouterLink>

      <nav class="desktop-nav" :aria-label="locale === 'zh' ? '主要导航' : 'Primary navigation'">
        <RouterLink class="header-nav-link" :class="{ active: route.name === 'home' && !route.hash }" :to="{ name: 'home' }">
          {{ t('nav.home') }}
        </RouterLink>

        <div
          v-for="group in navGroups"
          :key="group.key"
          class="header-nav-group"
          :class="{ 'dropdown-dismissed': dismissedDropdown === group.key }"
          @mouseenter="releaseDesktopDropdown(group.key)"
        >
          <RouterLink v-if="group.route" class="header-nav-link" :class="{ active: group.active }" :to="{ name: group.route }">{{ group.label }}</RouterLink>
          <button v-else class="header-nav-link header-nav-parent" :class="{ active: group.active }" type="button" aria-haspopup="true">
            {{ group.label }}
            <CaretDown :size="14" weight="bold" aria-hidden="true" />
          </button>
          <div v-if="group.items" class="header-dropdown" :aria-label="group.aria">
            <RouterLink
              v-for="item in group.items"
              :key="item.route"
              :to="{ name: item.route }"
              :class="{ active: route.name === item.route }"
              @click="dismissDesktopDropdown(group.key, $event)"
            >
              {{ item.label }}
            </RouterLink>
          </div>
        </div>

        <RouterLink class="header-nav-link" :class="{ active: route.name === 'contact' }" :to="{ name: 'contact' }">
          {{ t('nav.contact') }}
        </RouterLink>
      </nav>

      <div class="header-actions">
        <SiteSearch class="desktop-search" @navigate="closeMenu" />
        <div class="language-switch" aria-label="Language">
          <button :class="{ active: locale === 'zh' }" type="button" @click="setLocale('zh')">中文</button>
          <span>/</span>
          <button :class="{ active: locale === 'en' }" type="button" @click="setLocale('en')">EN</button>
        </div>
        <button class="menu-toggle" type="button" :aria-label="t('nav.menu')" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">
          <X v-if="menuOpen" :size="26" />
          <List v-else :size="26" />
        </button>
      </div>
    </div>

    <nav v-if="menuOpen" class="mobile-nav" :aria-label="locale === 'zh' ? '移动端导航' : 'Mobile navigation'">
      <SiteSearch mobile @navigate="closeMenu" />
      <RouterLink :to="{ name: 'home' }" @click="closeMenu">{{ t('nav.home') }}</RouterLink>

      <template v-for="group in navGroups" :key="group.key">
        <RouterLink v-if="group.route" :to="{ name: group.route }" @click="closeMenu">{{ group.label }}</RouterLink>
        <button v-else class="mobile-nav-parent" type="button" :aria-expanded="mobileGroupOpen === group.key" @click="toggleMobileGroup(group.key)">
          {{ group.label }}
          <CaretDown :size="18" :class="{ rotated: mobileGroupOpen === group.key }" />
        </button>
        <div v-if="mobileGroupOpen === group.key" class="mobile-subnav">
          <RouterLink v-for="item in group.items" :key="item.route" :to="{ name: item.route }" @click="closeMenu">
            {{ item.label }}
          </RouterLink>
        </div>
      </template>

      <RouterLink :to="{ name: 'contact' }" @click="closeMenu">{{ t('nav.contact') }}</RouterLink>
      <div class="mobile-language">
        <button type="button" @click="setLocale('zh')">中文</button>
        <button type="button" @click="setLocale('en')">English</button>
      </div>
    </nav>
  </header>
</template>
