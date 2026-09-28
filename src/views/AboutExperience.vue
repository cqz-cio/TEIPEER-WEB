<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { companyCopy } from '../company-copy.js'
import { useRoute } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import {

  PhCheckCircle as CheckCircle,
  PhCube as Cube,
  PhGlobeHemisphereEast as GlobeHemisphereEast,
  PhHandshake as Handshake,
  PhMagnifyingGlass as MagnifyingGlass,
  PhPackage as Package,
  PhShieldCheck as ShieldCheck,
  PhHouseLine as HouseLine,
  PhTarget as Target,
  PhUsersThree as UsersThree,
} from '@phosphor-icons/vue'

const { locale } = useI18n()
const route = useRoute()

const aboutNav = computed(() => {
  const zh = [
    { key: 'profile', label: '公司概况', route: 'about-profile' },
    { key: 'history', label: '发展历程', route: 'about-history' },
    { key: 'markets', label: '海外市场', route: 'about-markets' },
  ]
  const en = [
    { key: 'profile', label: 'Company Profile', route: 'about-profile' },
    { key: 'history', label: 'Our Journey', route: 'about-history' },
    { key: 'markets', label: 'Overseas Markets', route: 'about-markets' },
  ]
  return locale.value === 'zh' ? zh : en
})

const facts = computed(() => {
  const zh = [
    { value: '一次性食品包装', label: '餐饮包装供应', icon: Package },
    { value: '10年', label: '贸易执行积累', icon: Cube },
    { value: '实木家具', label: '品质家具供应', icon: HouseLine },
    { value: '海外市场', label: '出口服务经验', icon: GlobeHemisphereEast },
  ]
  const en = [
    { value: 'Food Packaging', label: 'Disposable Food Packaging', icon: Package },
    { value: '10 Years', label: 'Trade Execution', icon: Cube },
    { value: 'Solid Wood Furniture', label: 'Quality Furniture Supply', icon: HouseLine },
    { value: 'Overseas Markets', label: 'Export Service', icon: GlobeHemisphereEast },
  ]
  return locale.value === 'zh' ? zh : en
})

const processes = computed(() => {
  const zh = [
    { title: '产品匹配与寻源', body: '把使用场景、规格、包装、预算和交期转化为清晰的产品要求。', icon: MagnifyingGlass },
    { title: '订单与供应协同', body: '连接供应商、样品、生产与物流，让关键节点保持同步。', icon: UsersThree },
    { title: '质量检查与跟进', body: '依据确认样品和订单要求核对产品、包装与出货状态。', icon: ShieldCheck },
    { title: '国际贸易执行', body: '衔接订单、单证、报关与运输，并持续反馈交付进展。', icon: GlobeHemisphereEast },
  ]
  const en = [
    { title: 'Product Matching & Sourcing', body: 'Turning applications, specifications, packaging, budget and timing into clear product requirements.', icon: MagnifyingGlass },
    { title: 'Order & Supply Coordination', body: 'Connecting suppliers, samples, production and logistics around visible order milestones.', icon: UsersThree },
    { title: 'Quality Management', body: 'Managing quality checkpoints from sample approval to final inspection.', icon: ShieldCheck },
    { title: 'International Trade Execution', body: 'Handling orders, documents, customs and logistics with clarity.', icon: GlobeHemisphereEast },
  ]
  return locale.value === 'zh' ? zh : en
})

const content = {
  zh: {
    heroTitle: '公司介绍',
    heroSubtitle: '立足宁波，链接全球',
    sectionTitle: '公司介绍',
    contactEyebrow: '合作咨询',
    contactLabel: '联系我们',
    profile: {
      eyebrow: 'COMPANY PROFILE',
      title: companyCopy.zh.title,
      paragraphs: companyCopy.zh.paragraphs,
      lowerTitle: '从产品需求到海外交付',
    },
    history: {
      eyebrow: 'OUR JOURNEY',
      title: '十年积累，持续完善贸易服务能力',
      intro: '自2016年创立以来，全品轩依托宁波舟山港和长三角制造基础，持续深耕一次性食品包装与实木家具，完善全球供应链管理服务。',
      milestones: [
        { year: '2016', title: '从宁波出发', body: '宁波全品轩国际贸易有限公司创立于宁波，专注一次性食品包装与实木家具的出口贸易和全球供应链管理。' },
        { year: '业务起点', title: '把客户要求转化为订单语言', body: '在询价、样品和订单执行中，逐步形成对规格、包装、数量、价格与交期的系统沟通方式。' },
        { year: '能力沉淀', title: '在真实订单中完善协同流程', body: '将产品匹配、供应商沟通、生产跟进、质量检查、单证和物流衔接到同一条订单链路。' },
        { year: '服务延伸', title: '聚焦两大核心品类', body: '围绕一次性食品包装与实木家具，与合作工厂建立长期关系，打造稳定、透明、可追溯的供应链。' },
        { year: '2026', title: '迈入新的十年', body: '持续发展数字化贸易与跨境电商，计划用三年时间推动团队规模、客户覆盖和出口规模稳步增长。' },
      ],
    },
    mission: {
      eyebrow: 'MISSION & VISION',
      title: '使命、愿景与价值观',
      intro: '以客户为中心，推动中国制造走向全球，与团队和合作伙伴共创共享。',
      purpose: [
        { label: '使命', title: companyCopy.zh.mission, icon: Target },
        { label: '愿景', title: companyCopy.zh.vision, icon: Handshake },
      ],
      principlesTitle: '价值观',
      principles: companyCopy.zh.values,
    },
    markets: {
      eyebrow: 'OVERSEAS MARKETS',
      title: '立足宁波，面向海外市场',
      intro: '依托宁波舟山港和长三角制造基础，我们帮助海外客户在中国进行商品采购管理，支持大宗采购及小批量、多频次的电商订单。',
      mapTitle: '海外合作，从具体需求开始',
      mapBody: '市场不同，产品规格、包装规则、渠道节奏和交付要求也不同。我们以需求理解、产品适配、订单可见和及时沟通回应每一个项目。',
      clientsTitle: '我们服务的合作场景',
      clients: [
        { title: '零售商、品牌商与进口商', body: '围绕明确规格、包装、数量和交期，推进采购与出口订单执行。', icon: Package },
        { title: '餐饮供应链与酒店工程', body: '围绕一次性食品包装与实木家具，协同产品选型、打样、检测、质量控制和国际物流。', icon: CheckCircle },
        { title: '电商、社媒与直播卖家', body: '服务海外电商公司、社媒网红和直播卖家，以柔性订单响应支持小批量、多频次采购。', icon: Handshake },
      ],
    },
  },
  en: {
    heroTitle: 'About Tripeer',
    heroSubtitle: 'Rooted in Ningbo, connected to the world',
    sectionTitle: 'About Tripeer',
    contactEyebrow: 'WORK WITH US',
    contactLabel: 'Contact Us',
    profile: {
      eyebrow: 'COMPANY PROFILE',
      title: companyCopy.en.title,
      paragraphs: companyCopy.en.paragraphs,
      lowerTitle: 'From Product Requirements to Overseas Delivery',
    },
    history: {
      eyebrow: 'OUR JOURNEY',
      title: 'A Decade of Building Dependable Trade Capabilities',
      intro: 'Since 2016, TRIPEER has drawn on Ningbo-Zhoushan Port and the Yangtze River Delta manufacturing base to deepen its expertise in disposable food packaging, solid wood furniture and global supply-chain management.',
      milestones: [
        { year: '2016', title: 'Starting from Ningbo', body: 'Ningbo Tripeer International Trading was founded in Ningbo, focusing on exports of disposable food packaging and solid wood furniture and on global supply-chain management.' },
        { year: 'Foundation', title: 'Translating customer needs into order language', body: 'Quotation, sampling and execution shaped a clearer way to discuss specifications, packaging, quantity, price and timing.' },
        { year: 'Capability building', title: 'Improving coordination through real orders', body: 'Product matching, supplier communication, production, quality checks, documents and logistics became one connected order process.' },
        { year: 'Service development', title: 'Focusing on two core categories', body: 'Long-term partnerships with disposable food packaging and solid wood furniture factories support stable, transparent and traceable supply chains.' },
        { year: '2026', title: 'Entering a new decade', body: 'We continue to develop digital trade and cross-border e-commerce, with a three-year plan for steady growth in our team, customer reach and export business.' },
      ],
    },
    mission: {
      eyebrow: 'MISSION & VISION',
      title: 'Mission, Vision & Values',
      intro: 'We put customers first, bring Chinese manufacturing to global markets, and create and share value with our team and partners.',
      purpose: [
        { label: 'Mission', title: companyCopy.en.mission, icon: Target },
        { label: 'Vision', title: companyCopy.en.vision, icon: Handshake },
      ],
      principlesTitle: 'Our Values',
      principles: companyCopy.en.values,
    },
    markets: {
      eyebrow: 'OVERSEAS MARKETS',
      title: 'Rooted in Ningbo, Working with Overseas Markets',
      intro: 'Drawing on Ningbo-Zhoushan Port and the Yangtze River Delta manufacturing base, we help overseas customers manage sourcing in China, supporting bulk purchasing and frequent, small-batch e-commerce orders.',
      mapTitle: 'Overseas Cooperation Starts with Specific Needs',
      mapBody: 'Different markets bring different specifications, packaging rules, channel rhythms and delivery expectations. We respond through product fit, order visibility and timely communication.',
      clientsTitle: 'How We Support Our Partners',
      clients: [
        { title: 'Retailers, Brands & Importers', body: 'Purchasing and export execution around defined specifications, packaging, quantities and timing.', icon: Package },
        { title: 'Foodservice & Hotel Projects', body: 'Product selection, sampling, testing, quality control and international logistics for disposable food packaging and solid wood furniture.', icon: CheckCircle },
        { title: 'E-commerce, Social Media & Livestream Sellers', body: 'Flexible order handling for overseas e-commerce companies, social media creators and livestream sellers with frequent, small-batch sourcing needs.', icon: Handshake },
      ],
    },
  },
}

const currentKey = computed(() => route.meta.aboutKey || 'profile')
const currentContent = computed(() => content[locale.value][currentKey.value])
const commonContent = computed(() => content[locale.value])
</script>

<template>
  <a class="skip-link" href="#main">{{ locale === 'zh' ? '跳至主要内容' : 'Skip to content' }}</a>
  <SiteHeader />

  <main id="main" class="about-page">
    <section class="about-hero">
      <div class="about-hero-office"><img src="/assets/trade-2026/about-hero-team.jpg" alt="TRIPEER trade coordination team" /></div>
      <div class="about-hero-port"><img src="/assets/trade-2026/about-hero-port.jpg" alt="Container terminal serving overseas markets" /></div>
      <div class="about-hero-overlay" aria-hidden="true"></div>
      <div class="about-shell about-hero-copy">
        <h1>{{ route.name === 'corporate-culture' ? (locale === 'zh' ? '企业文化' : 'Corporate Culture') : commonContent.heroTitle }}</h1>
        <p>{{ commonContent.heroSubtitle }}</p>
      </div>
    </section>


    <div class="about-shell about-page-layout">

      <article class="about-main-content">
        <header class="about-content-heading">
          <p v-if="currentKey !== 'profile'">{{ currentContent.eyebrow }}</p>
          <h2>{{ currentContent.title }}</h2>
        </header>

        <template v-if="currentKey === 'profile'">
          <div class="about-profile-intro">
            <div class="about-prose">
              <p v-for="paragraph in currentContent.paragraphs" :key="paragraph">{{ paragraph }}</p>
            </div>
            <div class="about-facts-row">
              <article v-for="fact in facts" :key="fact.value">
                <component :is="fact.icon" :size="38" aria-hidden="true" />
                <strong>{{ fact.value }}</strong>
                <span>{{ fact.label }}</span>
              </article>
            </div>
          </div>
          <section class="about-process-section">
            <h3>{{ currentContent.lowerTitle }}</h3>
            <div class="about-process-layout">
              <img src="/assets/trade-2026/about-profile-inspection.jpg" :alt="locale === 'zh' ? '产品、包装与订单协同检查' : 'Product, packaging and order coordination check'" />
              <div class="about-process-grid">
                <article v-for="(item, index) in processes" :key="item.title">
                  <div><component :is="item.icon" :size="36" /><span>{{ String(index + 1).padStart(2, '0') }}</span></div>
                  <h4>{{ item.title }}</h4>
                  <p v-if="item.body">{{ item.body }}</p>
                </article>
              </div>
            </div>
          </section>
        </template>

        <template v-else-if="currentKey === 'history'">
          <p class="about-lead">{{ currentContent.intro }}</p>
          <ol class="about-timeline">
            <li v-for="item in currentContent.milestones" :key="item.year">
              <div class="about-timeline-marker" aria-hidden="true"></div>
              <div class="about-timeline-year">{{ item.year }}</div>
              <div><h3>{{ item.title }}</h3><p v-if="item.body">{{ item.body }}</p></div>
            </li>
          </ol>
        </template>

        <template v-else-if="currentKey === 'mission'">
          <p class="about-lead">{{ currentContent.intro }}</p>
          <div class="about-purpose-grid">
            <article v-for="item in currentContent.purpose" :key="item.label">
              <component :is="item.icon" :size="44" weight="duotone" />
              <span>{{ item.label }}</span>
              <h3>{{ item.title }}</h3>
              <p v-if="item.body">{{ item.body }}</p>
            </article>
          </div>
          <section class="about-principles">
            <h3>{{ currentContent.principlesTitle }}</h3>
            <div>
              <article v-for="(item, index) in currentContent.principles" :key="item.title">
                <span>{{ String(index + 1).padStart(2, '0') }}</span>
                <h4>{{ item.title }}</h4>
                <p v-if="item.body">{{ item.body }}</p>
              </article>
            </div>
          </section>
        </template>

        <template v-else>
          <p class="about-lead">{{ currentContent.intro }}</p>
          <section class="about-market-map">
            <div>
              <p>TRIPEER · NINGBO · CHINA</p>
              <h3>{{ currentContent.mapTitle }}</h3>
              <span>{{ currentContent.mapBody }}</span>
            </div>
            <img src="/assets/trade-2026/about-overseas-market.jpg" :alt="locale === 'zh' ? '海外市场与出口订单协同' : 'Overseas market and export-order coordination'" />
          </section>
          <section class="about-client-section">
            <h3>{{ currentContent.clientsTitle }}</h3>
            <div>
              <article v-for="item in currentContent.clients" :key="item.title">
                <component :is="item.icon" :size="38" />
                <h4>{{ item.title }}</h4>
                <p v-if="item.body">{{ item.body }}</p>
              </article>
            </div>
          </section>
        </template>
      </article>
    </div>
  </main>

  <SiteFooter />
</template>





