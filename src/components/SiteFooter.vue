<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  PhArrowUp as ArrowUp,
  PhCaretDown as CaretDown,
  PhEnvelopeSimple as EnvelopeSimple,
  PhTiktokLogo as TiktokLogo,
} from '@phosphor-icons/vue'

const contactEmail = 'hr@nbtrendz.com'
const emailHref = 'mailto:' + contactEmail
const douyinHref = 'https://www.douyin.com/user/MS4wLjABAAAAGPHZ2xRGPN61qemPA3ImuPuxu55--Y_oS5NuPAmyv7BRvN3bBkK7B1fAzVyaS4_P'

const { t, locale } = useI18n()
const route = useRoute()
const mobileQuery = window.matchMedia('(max-width: 640px)')
const isMobile = ref(mobileQuery.matches)
const expandedGroups = ref({})

const content = computed(() => {
  if (locale.value === 'en') {
    return {
      summary: t('footer.summary'),
      location: 'TRIPEER · NINGBO · CHINA',
      groups: [
        {
          key: 'company',
          title: 'Company',
          links: [
            { label: 'Company Profile', to: { name: 'about-profile' } },
            { label: 'Our Journey', to: { name: 'about-history' } },
            { label: 'Overseas Markets', to: { name: 'about-markets' } },
          ],
        },
        {
          key: 'business', title: 'Business', links: [{ label: 'Business', to: { name: 'business-overview' } }],
        },
        {
          key: 'news', title: 'Company News', links: [{ label: 'Company News', to: { name: 'insight-company' } }],
        },
        {
          key: 'culture', title: 'Corporate Culture', links: [{ label: 'Corporate Culture', to: { name: 'corporate-culture' } }],
        },
      ],
      contactTitle: t('contact.title'),
      contactBody: t('contact.body'),
      contactDetails: ['Location: Ningbo, Zhejiang, China'],
      emailLabel: 'Email',
      socialTitle: 'FOLLOW & CONTACT',
      douyinLabel: 'Visit our Douyin profile (opens in a new tab)',
      rights: '© 2016–2026 Ningbo Tripeer International Trading Co., Ltd.',
      privacy: 'Privacy',
      sitemap: 'Sitemap',
      language: '中文',
      icp: 'ICP filing details pending confirmation',
      backToTop: 'Back to top',
    }
  }

  return {
    summary: t('footer.summary'),
    location: 'TRIPEER · NINGBO · CHINA',
    groups: [
      {
        key: 'company',
        title: '公司介绍',
        links: [
          { label: '公司概况', to: { name: 'about-profile' } },
          { label: '发展历程', to: { name: 'about-history' } },
          { label: '海外市场', to: { name: 'about-markets' } },
        ],
      },
      {
        key: 'business', title: '业务介绍', links: [{ label: '业务介绍', to: { name: 'business-overview' } }],
      },
      {
        key: 'news', title: '公司动态', links: [{ label: '公司动态', to: { name: 'insight-company' } }],
      },
      {
        key: 'culture', title: '企业文化', links: [{ label: '企业文化', to: { name: 'corporate-culture' } }],
      },
    ],
    contactTitle: t('contact.title'),
    contactBody: t('contact.body'),
    contactDetails: ['所在地：中国·浙江·宁波'],
    emailLabel: '邮箱',
    socialTitle: '关注与联系',
    douyinLabel: '访问抖音主页（新标签页打开）',
    rights: '© 2016–2026 宁波全品轩国际贸易有限公司 版权所有',
    privacy: '隐私政策',
    sitemap: '网站地图',
    language: 'English',
    icp: 'ICP备案信息待确认',
    backToTop: '返回顶部',
  }
})

const setLocale = () => {
  if (route.name === 'cms-preview') return
  const nextLocale = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = nextLocale
  localStorage.setItem('tripeer-locale', nextLocale)
}

const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const syncMobile = () => {
  isMobile.value = mobileQuery.matches
}

const handleGroupToggle = (key, event) => {
  if (!isMobile.value) return
  expandedGroups.value = { ...expandedGroups.value, [key]: event.currentTarget.open }
}

onMounted(() => mobileQuery.addEventListener('change', syncMobile))
onBeforeUnmount(() => mobileQuery.removeEventListener('change', syncMobile))
</script>

<template>
  <footer id="site-footer" class="global-footer">
    <div class="global-footer-main">
      <section class="global-footer-brand" aria-label="TRIPEER">
        <img src="/assets/tripeer-logo-transparent.png" alt="TRIPEER" />
        <p>{{ content.summary }}</p>
        <span>{{ content.location }}</span>
      </section>

      <details
        v-for="group in content.groups"
        :key="group.key"
        class="global-footer-group"
        :open="!isMobile || Boolean(expandedGroups[group.key])"
        @toggle="handleGroupToggle(group.key, $event)"
      >
        <summary>
          <span>{{ group.title }}</span>
          <CaretDown :size="17" weight="bold" aria-hidden="true" />
        </summary>
        <nav class="global-footer-links" :aria-label="group.title">
          <RouterLink v-for="link in group.links" :key="link.label" :to="link.to">
            {{ link.label }}
          </RouterLink>
        </nav>
      </details>

      <section id="footer-contact" class="global-footer-contact">
        <h2>{{ content.contactTitle }}</h2>
        <p>{{ content.contactBody }}</p>
        <ul class="global-footer-contact-details">
          <li v-for="item in content.contactDetails" :key="item">{{ item }}</li>
          <li>
            {{ content.emailLabel }}{{ locale === 'zh' ? '：' : ': ' }}<a class="global-footer-email" :href="emailHref">{{ contactEmail }}</a>
          </li>
        </ul>
        <div class="global-footer-social-title">{{ content.socialTitle }}</div>
        <div class="global-footer-social" :aria-label="content.socialTitle">
          <a
            class="global-footer-social-button is-douyin"
            :href="douyinHref"
            target="_blank"
            rel="noopener noreferrer"
            :title="content.douyinLabel"
            :aria-label="content.douyinLabel"
          >
            <TiktokLogo :size="24" weight="fill" aria-hidden="true" />
          </a>
          <a
            class="global-footer-social-button is-email"
            :href="emailHref"
            :title="content.emailLabel + ': ' + contactEmail"
            :aria-label="content.emailLabel + ': ' + contactEmail"
          >
            <EnvelopeSimple :size="22" weight="regular" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>

    <div class="global-footer-bottom">
      <div class="global-footer-bottom-inner">
        <span>{{ content.rights }}</span>
        <div class="global-footer-legal">
          <span class="global-footer-pending" title="页面待配置">{{ content.privacy }}</span>
          <span class="global-footer-pending" title="页面待配置">{{ content.sitemap }}</span>
          <button type="button" @click="setLocale">{{ content.language }}</button>
          <span class="global-footer-pending">{{ content.icp }}</span>
          <button class="global-footer-top" type="button" @click="backToTop">
            {{ content.backToTop }}
            <ArrowUp :size="14" weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>
