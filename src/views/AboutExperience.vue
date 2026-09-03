<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import {

  PhCalendarBlank as CalendarBlank,
  PhCheckCircle as CheckCircle,
  PhCube as Cube,
  PhGlobeHemisphereEast as GlobeHemisphereEast,
  PhHandshake as Handshake,
  PhMagnifyingGlass as MagnifyingGlass,
  PhPackage as Package,
  PhShieldCheck as ShieldCheck,
  PhStack as Stack,
  PhTarget as Target,
  PhUsersThree as UsersThree,
} from '@phosphor-icons/vue'

const { locale } = useI18n()
const route = useRoute()

const aboutNav = computed(() => {
  const zh = [
    { key: 'profile', label: '公司概况', route: 'about-profile' },
    { key: 'history', label: '发展历程', route: 'about-history' },
    { key: 'mission', label: '使命愿景', route: 'about-mission' },
    { key: 'markets', label: '海外市场', route: 'about-markets' },
  ]
  const en = [
    { key: 'profile', label: 'Company Profile', route: 'about-profile' },
    { key: 'history', label: 'Our Journey', route: 'about-history' },
    { key: 'mission', label: 'Mission & Vision', route: 'about-mission' },
    { key: 'markets', label: 'Overseas Markets', route: 'about-markets' },
  ]
  return locale.value === 'zh' ? zh : en
})

const facts = computed(() => {
  const zh = [
    { value: '2016', label: '成立于宁波', icon: CalendarBlank },
    { value: '10年', label: '贸易执行积累', icon: Cube },
    { value: '日用消费品', label: '产品供应方向', icon: Stack },
    { value: '海外市场', label: '出口服务经验', icon: GlobeHemisphereEast },
  ]
  const en = [
    { value: '2016', label: 'Founded in Ningbo', icon: CalendarBlank },
    { value: '10 Years', label: 'Trade Execution', icon: Cube },
    { value: 'Daily-use Goods', label: 'Product Focus', icon: Stack },
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
    heroSubtitle: '立足宁波，连接产品需求、供应资源与海外交付',
    sectionTitle: '公司介绍',
    contactEyebrow: '合作咨询',
    contactLabel: '联系我们',
    profile: {
      eyebrow: 'COMPANY PROFILE',
      title: '十年贸易积累，专注把每一笔订单做清楚',
      paragraphs: [
        '宁波全品轩国际贸易有限公司成立于2016年，是一家立足宁波、面向海外市场的日用消费品国际贸易企业。公开可见业务以纸制与一次性日用品及相关消费品为基础，并根据客户项目协调其他日用产品。',
        '我们的工作从理解需求开始：明确产品规格、材料、使用场景、包装、数量和交期，再衔接产品匹配、打样确认、供应商沟通、生产跟进、质量检查与出口交付。',
        '十年来，全品轩在一笔笔真实订单中不断完善询价、样品、订单、单证和出运流程。相比夸大规模，我们更重视信息是否准确、节点是否清晰、问题是否及时反馈。',
        '面向未来，我们将继续围绕日用消费品和海外客户需求积累产品理解与执行经验，以专业、灵活和负责任的协同建立长期合作。',
      ],
      lowerTitle: '从产品需求到海外交付',
    },
    history: {
      eyebrow: 'OUR JOURNEY',
      title: '十年积累，持续完善贸易服务能力',
      intro: '全品轩的发展不是用规模和数字堆砌故事，而是在真实订单中持续完善对产品、包装、供应协同、质量检查和出口交付的理解。',
      milestones: [
        { year: '2016', title: '从宁波出发', body: '宁波全品轩国际贸易有限公司成立，开始围绕日用消费品开展国际贸易和出口订单服务。' },
        { year: '业务起点', title: '把客户要求转化为订单语言', body: '在询价、样品和订单执行中，逐步形成对规格、包装、数量、价格与交期的系统沟通方式。' },
        { year: '能力沉淀', title: '在真实订单中完善协同流程', body: '将产品匹配、供应商沟通、生产跟进、质量检查、单证和物流衔接到同一条订单链路。' },
        { year: '服务延伸', title: '围绕日常消费场景积累产品理解', body: '以纸制与一次性日用品及相关消费品为基础，根据不同市场和渠道要求持续拓展项目经验。' },
        { year: '2026', title: '迈入新的十年', body: '从完成一次交付走向建立长期合作，以更清晰的流程、更及时的沟通和更稳健的执行回应海外客户。' },
      ],
    },
    mission: {
      eyebrow: 'MISSION & VISION',
      title: '以清晰、可靠的协同创造长期价值',
      intro: '我们相信，贸易服务的价值不只在于把货物送达，更在于让客户要求、产品标准、订单信息和交付节点始终保持一致。',
      purpose: [
        { label: '使命', title: '让跨境采购和订单交付更清晰', body: '准确理解需求，连接合适的产品与供应资源，把关键决定落实到可执行的订单节点。', icon: Target },
        { label: '愿景', title: '成为海外客户长期信赖的贸易伙伴', body: '以专业执行、及时沟通和持续改进，让每一次合作为下一次合作积累信任。', icon: Handshake },
      ],
      principlesTitle: '我们的服务原则',
      principles: [
        { title: '可靠', body: '重视承诺与关键节点，让合作过程可预期。' },
        { title: '专业', body: '以清晰流程和细致执行解决真实贸易问题。' },
        { title: '协同', body: '连接客户、供应商、生产与物流，提高整体效率。' },
        { title: '长期', body: '关注持续价值，而不是一次性的交易结果。' },
      ],
    },
    markets: {
      eyebrow: 'OVERSEAS MARKETS',
      title: '立足宁波，面向海外市场',
      intro: '依托宁波的港口条件与周边制造资源，我们面向海外进口商、批发商和渠道客户，提供从产品需求到出口交付的协同服务。',
      mapTitle: '海外合作，从具体需求开始',
      mapBody: '市场不同，产品规格、包装规则、渠道节奏和交付要求也不同。我们以需求理解、产品适配、订单可见和及时沟通回应每一个项目。',
      clientsTitle: '我们服务的合作场景',
      clients: [
        { title: '进口商与批发客户', body: '围绕明确规格、包装、数量和交期，推进采购与出口订单执行。', icon: Package },
        { title: '品牌与定制项目', body: '协同样品、标签、包装和装箱要求，将品牌需求落实到产品细节。', icon: CheckCircle },
        { title: '渠道与持续补货项目', body: '通过清晰节点和持续沟通，支持重复订单与阶段性采购计划。', icon: Handshake },
      ],
    },
  },
  en: {
    heroTitle: 'About Tripeer',
    heroSubtitle: 'Rooted in Ningbo, connecting product needs, supply resources and overseas delivery',
    sectionTitle: 'About Tripeer',
    contactEyebrow: 'WORK WITH US',
    contactLabel: 'Contact Us',
    profile: {
      eyebrow: 'COMPANY PROFILE',
      title: 'A Decade of Making Every Order Clearer',
      paragraphs: [
        'Founded in Ningbo in 2016, TRIPEER is an international trading company focused on daily-use consumer goods for overseas markets. Publicly visible activity is centered on paper-based and disposable daily-use products, with related categories coordinated according to project needs.',
        'Our work starts with understanding specifications, materials, applications, packaging, quantity and timing, then connects product matching, sampling, supplier communication, production follow-up, quality checks and export delivery.',
        'Over the past decade, real orders have helped us improve quotation, sampling, order, documentation and shipping processes. We value accurate information, visible milestones and timely feedback more than exaggerated scale.',
        'Looking ahead, we will continue building product understanding and execution experience around daily-use goods and overseas customer needs, creating long-term value through professional and flexible coordination.',
      ],
      lowerTitle: 'From Product Requirements to Overseas Delivery',
    },
    history: {
      eyebrow: 'OUR JOURNEY',
      title: 'A Decade of Building Dependable Trade Capabilities',
      intro: 'TRIPEER’s journey is not a story built on inflated scale. It is the continuous improvement of product, packaging, supply coordination, quality checks and export delivery through real orders.',
      milestones: [
        { year: '2016', title: 'Starting from Ningbo', body: 'Ningbo Tripeer International Trading was established to support international trade and export orders for daily-use consumer goods.' },
        { year: 'Foundation', title: 'Translating customer needs into order language', body: 'Quotation, sampling and execution shaped a clearer way to discuss specifications, packaging, quantity, price and timing.' },
        { year: 'Capability building', title: 'Improving coordination through real orders', body: 'Product matching, supplier communication, production, quality checks, documents and logistics became one connected order process.' },
        { year: 'Service development', title: 'Building product knowledge around daily-use needs', body: 'Paper-based and disposable products became a visible foundation while related categories developed according to markets and channels.' },
        { year: '2026', title: 'Entering a new decade', body: 'We move from completing individual deliveries to building lasting cooperation through clearer processes and dependable execution.' },
      ],
    },
    mission: {
      eyebrow: 'MISSION & VISION',
      title: 'Long-Term Value Through Clear, Dependable Coordination',
      intro: 'Trade service is not only about moving goods. It is about keeping requirements, standards, order information and delivery milestones aligned.',
      purpose: [
        { label: 'Mission', title: 'Make cross-border sourcing and delivery clearer', body: 'Understand needs, connect suitable products and supply resources, and turn decisions into executable milestones.', icon: Target },
        { label: 'Vision', title: 'Become a trusted long-term trade partner', body: 'Build trust from one order to the next through professional execution, timely communication and continuous improvement.', icon: Handshake },
      ],
      principlesTitle: 'Our Service Principles',
      principles: [
        { title: 'Reliable', body: 'Honor commitments and make critical milestones predictable.' },
        { title: 'Professional', body: 'Solve real trade challenges through clear processes and careful execution.' },
        { title: 'Collaborative', body: 'Connect customers, suppliers, production and logistics efficiently.' },
        { title: 'Long-term', body: 'Focus on lasting value, not one-time transactions.' },
      ],
    },
    markets: {
      eyebrow: 'OVERSEAS MARKETS',
      title: 'Rooted in Ningbo, Working with Overseas Markets',
      intro: 'Supported by Ningbo’s port access and surrounding manufacturing resources, we work with overseas importers, wholesalers and channel partners from product requirements through export delivery.',
      mapTitle: 'Overseas Cooperation Starts with Specific Needs',
      mapBody: 'Different markets bring different specifications, packaging rules, channel rhythms and delivery expectations. We respond through product fit, order visibility and timely communication.',
      clientsTitle: 'How We Support Our Partners',
      clients: [
        { title: 'Importers and Wholesalers', body: 'Purchasing and export execution around defined specifications, packaging, quantities and timing.', icon: Package },
        { title: 'Brands and Custom Projects', body: 'Samples, labels, packaging and carton requirements translated into product details.', icon: CheckCircle },
        { title: 'Channels and Repeat Orders', body: 'Visible milestones and ongoing communication for replenishment and phased purchasing plans.', icon: Handshake },
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
        <h1>{{ commonContent.heroTitle }}</h1>
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
                  <p>{{ item.body }}</p>
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
              <div><h3>{{ item.title }}</h3><p>{{ item.body }}</p></div>
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
              <p>{{ item.body }}</p>
            </article>
          </div>
          <section class="about-principles">
            <h3>{{ currentContent.principlesTitle }}</h3>
            <div>
              <article v-for="(item, index) in currentContent.principles" :key="item.title">
                <span>{{ String(index + 1).padStart(2, '0') }}</span>
                <h4>{{ item.title }}</h4>
                <p>{{ item.body }}</p>
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
                <p>{{ item.body }}</p>
              </article>
            </div>
          </section>
        </template>
      </article>
    </div>
  </main>

  <SiteFooter />
</template>





