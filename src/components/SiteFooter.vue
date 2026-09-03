<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PhArrowUp as ArrowUp,
  PhCaretDown as CaretDown,
  PhEnvelopeSimple as EnvelopeSimple,
  PhLinkedinLogo as LinkedinLogo,
  PhWechatLogo as WechatLogo,
} from '@phosphor-icons/vue'

const socialIcons = [
  { key: 'linkedin', icon: LinkedinLogo, size: 23, weight: 'fill' },
  { key: 'email', icon: EnvelopeSimple, size: 22, weight: 'regular' },
  { key: 'wechat', icon: WechatLogo, size: 25, weight: 'fill' },
]

const { locale } = useI18n()
const mobileQuery = window.matchMedia('(max-width: 640px)')
const isMobile = ref(mobileQuery.matches)
const expandedGroups = ref({})
const socialFeedback = ref('')
const friendLinksOpen = ref(false)
let socialFeedbackTimer

const content = computed(() => {
  if (locale.value === 'en') {
    return {
      summary: 'Founded in 2016 and rooted in Ningbo, TRIPEER connects daily-use consumer product requirements with clear order coordination and export delivery.',
      location: 'TRIPEER · NINGBO · CHINA',
      groups: [
        {
          key: 'company',
          title: 'Company',
          links: [
            { label: 'Company Profile', to: { name: 'about-profile' } },
            { label: 'Our Journey', to: { name: 'about-history' } },
            { label: 'Mission & Vision', to: { name: 'about-mission' } },
            { label: 'Overseas Markets', to: { name: 'about-markets' } },
          ],
        },
        {
          key: 'business',
          title: 'Business',
          links: [
            { label: 'Business Overview', to: { name: 'business-overview' } },
            { label: 'Product Categories', to: { name: 'business-categories' } },
            { label: 'Customization & Development', to: { name: 'business-customization' } },
            { label: 'Supply-chain Services', to: { name: 'business-supply' } },
            { label: 'Cooperation Process', to: { name: 'business-workflow' } },
          ],
        },
        {
          key: 'capabilities',
          title: 'Capabilities',
          links: [
            { label: 'Product Matching & Sourcing', to: { name: 'capability-development' } },
            { label: 'Order & Supply Coordination', to: { name: 'capability-supply' } },
            { label: 'Quality Management', to: { name: 'capability-quality' } },
            { label: 'Trade Execution', to: { name: 'capability-trade' } },
          ],
        },
        {
          key: 'insights',
          title: 'Trade Practice',
          links: [
            { label: 'Trade Practice', to: { name: 'insight-company' } },
            { label: 'Customer & Projects', to: { name: 'insight-events' } },
            { label: 'Industry Insights', to: { name: 'insight-industry' } },
            { label: 'Responsibility', to: { name: 'insight-responsibility' } },
          ],
        },
      ],
      contactTitle: 'Contact',
      contactBody: 'Share a product reference, specifications, quantity, packaging and target date to start a practical discussion.',
      contactDetails: ['Email: To be confirmed', 'Phone: To be confirmed', 'Address: Ningbo, Zhejiang, China (details TBC)'],
      socialTitle: 'FOLLOW & CONTACT',
      socialLabels: ['LinkedIn', 'Email', 'WeChat'],
      socialPending: 'Official account details will be enabled once confirmed.',
      friendLinks: 'Partner links (available after confirmation)',
      friendLinksPending: 'Partner link details will be available once confirmed.',
      rights: '© 2016–2026 Ningbo Tripeer International Trading Co., Ltd.',
      privacy: 'Privacy',
      sitemap: 'Sitemap',
      language: '中文',
      icp: 'ICP filing details pending confirmation',
      backToTop: 'Back to top',
    }
  }

  return {
    summary: '宁波全品轩国际贸易有限公司成立于2016年，专注日用消费品国际贸易，以清晰的订单协同连接产品需求与出口交付。',
    location: 'TRIPEER · NINGBO · CHINA',
    groups: [
      {
        key: 'company',
        title: '公司介绍',
        links: [
          { label: '公司概况', to: { name: 'about-profile' } },
          { label: '发展历程', to: { name: 'about-history' } },
          { label: '使命愿景', to: { name: 'about-mission' } },
          { label: '海外市场', to: { name: 'about-markets' } },
        ],
      },
      {
        key: 'business',
        title: '主营业务',
        links: [
          { label: '业务概览', to: { name: 'business-overview' } },
          { label: '产品品类', to: { name: 'business-categories' } },
          { label: '定制与开发', to: { name: 'business-customization' } },
          { label: '供应链服务', to: { name: 'business-supply' } },
          { label: '合作流程', to: { name: 'business-workflow' } },
        ],
      },
      {
        key: 'capabilities',
        title: '核心能力',
        links: [
          { label: '产品匹配与寻源', to: { name: 'capability-development' } },
          { label: '订单与供应协同', to: { name: 'capability-supply' } },
          { label: '质量管理', to: { name: 'capability-quality' } },
          { label: '国际贸易执行', to: { name: 'capability-trade' } },
        ],
      },
      {
        key: 'insights',
        title: '贸易实践',
        links: [
          { label: '贸易实践', to: { name: 'insight-company' } },
          { label: '客户与项目', to: { name: 'insight-events' } },
          { label: '行业洞察', to: { name: 'insight-industry' } },
          { label: '责任与可持续', to: { name: 'insight-responsibility' } },
        ],
      },
    ],
    contactTitle: '联系合作',
    contactBody: '请提供产品参考、规格、数量、包装与目标交期，让我们从具体需求开始沟通。',
    contactDetails: ['邮箱：待确认', '电话：待确认', '地址：中国·浙江·宁波（详细地址待补充）'],
    socialTitle: '关注与联系',
    socialLabels: ['LinkedIn', '电子邮箱', '微信'],
    socialPending: '官方账号信息确认后启用。',
    friendLinks: '友情链接（合作伙伴确认后启用）',
    friendLinksPending: '合作伙伴链接信息确认后开放。',
    rights: '© 2016–2026 宁波全品轩国际贸易有限公司 版权所有',
    privacy: '隐私政策',
    sitemap: '网站地图',
    language: 'English',
    icp: 'ICP备案信息待确认',
    backToTop: '返回顶部',
  }
})

const setLocale = () => {
  const nextLocale = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = nextLocale
  localStorage.setItem('tripeer-locale', nextLocale)
}

const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const handleSocialClick = (index) => {
  window.clearTimeout(socialFeedbackTimer)
  socialFeedback.value = `${content.value.socialLabels[index]}：${content.value.socialPending}`
  socialFeedbackTimer = window.setTimeout(() => {
    socialFeedback.value = ''
  }, 3200)
}

const syncMobile = () => {
  isMobile.value = mobileQuery.matches
}

const handleGroupToggle = (key, event) => {
  if (!isMobile.value) return
  expandedGroups.value = { ...expandedGroups.value, [key]: event.currentTarget.open }
}

onMounted(() => mobileQuery.addEventListener('change', syncMobile))
onBeforeUnmount(() => {
  mobileQuery.removeEventListener('change', syncMobile)
  window.clearTimeout(socialFeedbackTimer)
})
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
        </ul>
        <div class="global-footer-social-title">{{ content.socialTitle }}</div>
        <div class="global-footer-social" :aria-label="content.socialPending">
          <button
            v-for="(item, index) in socialIcons"
            :key="item.key"
            class="global-footer-social-button"
            :class="`is-${item.key}`"
            type="button"
            :title="`${content.socialLabels[index]}：${content.socialPending}`"
            :aria-label="`${content.socialLabels[index]}。${content.socialPending}`"
            aria-describedby="footer-social-status"
            @click="handleSocialClick(index)"
          >
            <component
              :is="item.icon"
              :size="item.size"
              :weight="item.weight"
              aria-hidden="true"
            />
          </button>
        </div>
        <p id="footer-social-status" class="global-footer-social-status" aria-live="polite">
          {{ socialFeedback }}
        </p>
        <div class="global-footer-friends-wrap">
          <button
            class="global-footer-friends"
            :class="{ 'is-open': friendLinksOpen }"
            type="button"
            :aria-expanded="friendLinksOpen"
            aria-controls="footer-friend-links-panel"
            @click="friendLinksOpen = !friendLinksOpen"
          >
            <span>{{ content.friendLinks }}</span>
            <CaretDown :size="15" weight="bold" aria-hidden="true" />
          </button>
          <Transition name="footer-friends-panel">
            <div
              v-if="friendLinksOpen"
              id="footer-friend-links-panel"
              class="global-footer-friends-panel"
              role="status"
            >
              {{ content.friendLinksPending }}
            </div>
          </Transition>
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
