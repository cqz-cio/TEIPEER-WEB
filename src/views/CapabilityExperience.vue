<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  PhArrowRight as ArrowRight,
  PhBoat as Boat,
  PhCheckCircle as CheckCircle,
  PhClipboardText as ClipboardText,
  PhGlobeHemisphereEast as Globe,
  PhMagnifyingGlass as Search,
  PhPackage as Package,
  PhPencilLine as Pencil,
  PhShieldCheck as Shield,
  PhUsersThree as Users,
} from '@phosphor-icons/vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'

const { locale } = useI18n()
const route = useRoute()

const routeNames = {
  development: 'capability-development',
  supply: 'capability-supply',
  quality: 'capability-quality',
  trade: 'capability-trade',
}

const contentSets = {
  zh: {
    development: {
      title: '产品匹配与寻源',
      subtitle: '把客户需求转化为可执行的产品要求',
      label: 'PRODUCT MATCHING & SOURCING',
      lead: '从目标市场、使用场景、规格、包装、目标价格和交期出发，我们梳理产品要求、匹配供应资源并推进样品确认，让询盘逐步形成可执行的订单基础。',
      image: '/assets/trade-2026/capability-sourcing.jpg',
      result: ['需求更清晰', '资源更匹配', '开发更高效'],
      steps: [
        ['01', '需求分析', '明确目标市场、使用场景、规格、预算、数量和交付时间。', ClipboardText],
        ['02', '产品方向梳理', '结合现有产品、公开市场信息与供应条件，形成可沟通的产品和包装方向。', Search],
        ['03', '供应资源匹配', '综合产品适配、工艺、起订量、交期、质量基础与沟通效率进行选择。', Users],
        ['04', '样品与细节确认', '推进打样并核对材料、尺寸、外观、包装和成本，为后续订单建立确认基准。', Pencil],
      ],
      proofTitle: '把产品需求转化为执行方案',
      proofs: [
        ['需求导向的产品建议', '不是简单提供目录，而是围绕客户市场、渠道、使用场景与订单条件组织选品。', Search],
        ['供应资源匹配', '综合考虑品类、工艺、起订量、交期和质量要求，选择更适合的合作资源。', Users],
        ['开发过程协同', '串联样品、包装、成本与交期，使关键决定在量产前得到确认。', CheckCircle],
      ],
    },
    supply: {
      title: '订单与供应协同',
      subtitle: '连接供应商、生产与交付环节',
      label: 'ORDER & SUPPLY COORDINATION',
      lead: '针对多产品、组合采购和定制项目，我们以订单为主线连接供应商沟通、采购执行、生产跟进、包装与物流安排，减少信息偏差并提高节点可见性。',
      image: '/assets/trade-2026/capability-supply.jpg',
      result: ['多品类协同', '节点可追踪', '交付更稳定'],
      steps: [
        ['01', '资源准入与匹配', '根据品类、制造能力、配合基础与项目要求建立供应资源组合。', Users],
        ['02', '采购与订单整合', '统一关键规格、数量、包装和交期，降低多环节沟通成本。', ClipboardText],
        ['03', '生产进度协同', '围绕样品、物料、排产与关键节点持续跟进和异常反馈。', Package],
        ['04', '仓储物流衔接', '协调集货、装运和交付安排，使生产结果顺畅进入出口流程。', Boat],
      ],
      proofTitle: '让复杂采购保持清晰可控',
      proofs: [
        ['供应商协同机制', '以统一要求和节点反馈连接不同制造资源，减少信息偏差。', Users],
        ['订单节点管理', '从确认到生产、验货与出运，对关键状态持续跟踪。', ClipboardText],
        ['异常响应与调整', '发现偏差后及时沟通影响、修正方案与后续安排。', CheckCircle],
      ],
    },
    quality: {
      title: '质量管理',
      subtitle: '把质量要求落实到每一个关键节点',
      label: 'QUALITY MANAGEMENT',
      lead: '质量工作从需求确认开始，贯穿样品、生产、包装和出货环节。我们把已确认的产品与包装要求转化为检查重点，并根据项目需要进行核对和问题跟进。',
      image: '/assets/trade-2026/capability-quality.jpg',
      result: ['标准前置', '过程管控', '结果可追踪'],
      steps: [
        ['01', '标准与样品确认', '在生产前明确规格、材质、颜色、工艺、包装及可接受标准。', ClipboardText],
        ['02', '生产前核对', '确认关键物料、样品版本和生产要求已准确传递。', CheckCircle],
        ['03', '过程与出货检查', '依据项目需要检查关键工序，并在出货前核对成品与包装。', Shield],
        ['04', '异常整改追踪', '记录问题、沟通原因与改善要求，并跟踪处理结果。', Pencil],
      ],
      proofTitle: '让检查围绕已确认的要求展开',
      proofs: [
        ['清晰检验依据', '将客户要求转化为可确认、可执行的质量检查重点。', ClipboardText],
        ['关键节点控制', '在问题仍可调整的阶段开展核对，避免风险集中到出货前。', Shield],
        ['问题闭环', '通过记录、反馈和整改追踪，为后续订单持续优化。', CheckCircle],
      ],
    },
    trade: {
      title: '国际贸易执行',
      subtitle: '从订单确认到海外交付的专业协同',
      label: 'INTERNATIONAL TRADE EXECUTION',
      lead: '国际贸易交付涉及订单、单证、报关、运输和多方沟通。我们以确认信息和关键节点连接各项工作，并通过持续反馈帮助客户掌握订单状态和交付进展。',
      image: '/assets/trade-2026/capability-trade.jpg',
      result: ['单证清晰', '节点协同', '海外交付'],
      steps: [
        ['01', '订单与条款确认', '核对产品、数量、价格、包装、付款与交付要求。', ClipboardText],
        ['02', '生产与出运衔接', '同步生产进度、验货结果、装运计划和交付窗口。', Package],
        ['03', '单证与报关协同', '准备并核对贸易单证，配合报关及相关出口流程。', CheckCircle],
        ['04', '运输跟踪与交付', '协调国际运输，跟踪关键节点并支持到货后的沟通。', Globe],
      ],
      proofTitle: '让每一次出口交付更加清晰',
      proofs: [
        ['订单信息管理', '统一产品、商务和交付信息，为后续执行建立准确基础。', ClipboardText],
        ['出口流程衔接', '协调验货、装运、单证和报关，减少环节之间的等待与偏差。', Boat],
        ['持续状态反馈', '围绕关键节点提供进度信息，便于客户安排市场与库存计划。', Globe],
      ],
    },
  },
  en: {
    development: {
      title: 'Product Matching & Sourcing',
      subtitle: 'Turning customer needs into executable product requirements',
      label: 'PRODUCT MATCHING & SOURCING',
      lead: 'Starting with the target market, application, specifications, packaging, price and timing, we organize product requirements, match supply resources and coordinate sample approval.',
      image: '/assets/trade-2026/capability-sourcing.jpg',
      result: ['Clearer briefs', 'Better resource fit', 'Faster development'],
      steps: [['01', 'Requirement Analysis', 'Define market, use case, specification, budget, quantity and timing.', ClipboardText], ['02', 'Market & Category Research', 'Identify product directions and opportunities through category experience.', Search], ['03', 'Supplier Selection', 'Match resources by product fit, manufacturing, quality and cooperation.', Users], ['04', 'Sample Approval', 'Coordinate sampling, refinement and cost review before production.', Pencil]],
      proofTitle: 'From product opportunity to executable solution',
      proofs: [['Scenario-led Recommendations', 'Selections are organized around markets, channels and use cases.', Search], ['Resource Matching', 'Category, process, MOQ, timing and quality are evaluated together.', Users], ['Development Coordination', 'Samples, packaging, cost and timing are aligned before production.', CheckCircle]],
    },
    supply: {
      title: 'Order & Supply Coordination',
      subtitle: 'Connecting suppliers, production and delivery',
      label: 'ORDER & SUPPLY COORDINATION',
      lead: 'For multi-product and customized projects, we connect supplier communication, procurement, production follow-up, packaging and logistics around a clear order plan.',
      image: '/assets/trade-2026/capability-supply.jpg',
      result: ['Multi-category coordination', 'Visible milestones', 'Dependable delivery'],
      steps: [['01', 'Resource Matching', 'Build the right supplier mix for the category and project.', Users], ['02', 'Order Integration', 'Align specifications, quantities, packaging and timing.', ClipboardText], ['03', 'Production Follow-up', 'Track sampling, materials, production and key exceptions.', Package], ['04', 'Logistics Connection', 'Coordinate consolidation, shipment and delivery arrangements.', Boat]],
      proofTitle: 'Keeping complex sourcing clear and controlled',
      proofs: [['Supplier Coordination', 'Shared requirements and milestone feedback reduce information gaps.', Users], ['Order Milestones', 'Critical status is tracked from confirmation through shipment.', ClipboardText], ['Exception Response', 'Impacts, corrective actions and updated plans are communicated early.', CheckCircle]],
    },
    quality: {
      title: 'Quality Management',
      subtitle: 'Embedding quality requirements at every critical stage',
      label: 'QUALITY MANAGEMENT',
      lead: 'Quality work begins with confirmed requirements and continues through samples, production, packaging and shipment. Practical checks and issue follow-up help reduce execution variance.',
      image: '/assets/trade-2026/capability-quality.jpg',
      result: ['Standards first', 'Process control', 'Traceable results'],
      steps: [['01', 'Standards & Samples', 'Confirm specifications, materials, colors, workmanship and packaging.', ClipboardText], ['02', 'Pre-production Check', 'Verify materials, sample version and production requirements.', CheckCircle], ['03', 'Process & Final Inspection', 'Check critical stages and finished goods according to project needs.', Shield], ['04', 'Corrective Follow-up', 'Record issues, communicate improvements and track completion.', Pencil]],
      proofTitle: 'Checks built around confirmed requirements',
      proofs: [['Clear Criteria', 'Customer requirements become practical inspection priorities.', ClipboardText], ['Critical-stage Control', 'Checks happen while there is still time to adjust.', Shield], ['Closed-loop Improvement', 'Records and corrective actions support future optimization.', CheckCircle]],
    },
    trade: {
      title: 'International Trade Execution',
      subtitle: 'Professional coordination from order to global delivery',
      label: 'INTERNATIONAL TRADE EXECUTION',
      lead: 'International delivery connects orders, documents, customs, transport and multiple parties. Clear milestones keep status and delivery progress visible.',
      image: '/assets/trade-2026/capability-trade.jpg',
      result: ['Clear documents', 'Coordinated milestones', 'Global delivery'],
      steps: [['01', 'Order Confirmation', 'Align products, quantities, pricing, packaging, payment and delivery.', ClipboardText], ['02', 'Production to Shipment', 'Connect production, inspection and shipping schedules.', Package], ['03', 'Documents & Customs', 'Prepare and review trade documents and support export procedures.', CheckCircle], ['04', 'Tracking & Delivery', 'Coordinate transport, track milestones and support arrival communication.', Globe]],
      proofTitle: 'Clearer execution in every export delivery',
      proofs: [['Order Information', 'Product, commercial and delivery information stays aligned.', ClipboardText], ['Export Coordination', 'Inspection, shipment, documents and customs connect smoothly.', Boat], ['Status Feedback', 'Milestone updates support market and inventory planning.', Globe]],
    },
  },
}

const currentKey = computed(() => route.meta.capabilityKey || 'development')
const content = computed(() => contentSets[locale.value]?.[currentKey.value] || contentSets.zh.development)
const related = computed(() => {
  const labels = locale.value === 'zh'
    ? { development: '产品匹配与寻源', supply: '订单与供应协同', quality: '质量管理', trade: '国际贸易执行' }
    : { development: 'Product Matching & Sourcing', supply: 'Order & Supply Coordination', quality: 'Quality Management', trade: 'Trade Execution' }
  return Object.entries(labels).filter(([key]) => key !== currentKey.value).map(([key, label]) => ({ key, label, route: routeNames[key] }))
})
</script>

<template>
  <a class="skip-link" href="#capability-main">{{ locale === 'zh' ? '跳转到主要内容' : 'Skip to content' }}</a>
  <SiteHeader />
  <main id="capability-main" class="knowledge-page capability-experience">
    <section class="knowledge-hero">
      <img :src="content.image" alt="" />
      <div class="knowledge-hero-overlay"></div>
      <div class="knowledge-hero-copy">
        <span>{{ locale === 'zh' ? '核心能力' : 'CORE CAPABILITIES' }}</span>
        <h1>{{ content.title }}</h1>
        <p>{{ content.subtitle }}</p>
      </div>
    </section>

    <section class="knowledge-shell knowledge-intro">
      <div>
        <span class="knowledge-label">{{ content.label }}</span>
        <h2>{{ content.subtitle }}</h2>
        <p>{{ content.lead }}</p>
      </div>
      <aside class="knowledge-results" :aria-label="locale === 'zh' ? '能力价值' : 'Capability outcomes'">
        <div v-for="(item, index) in content.result" :key="item">
          <strong>0{{ index + 1 }}</strong><span>{{ item }}</span>
        </div>
      </aside>
    </section>

    <section class="knowledge-soft-section">
      <div class="knowledge-shell">
        <header class="knowledge-section-heading">
          <span>{{ locale === 'zh' ? '工作方法' : 'HOW WE WORK' }}</span>
          <h2>{{ locale === 'zh' ? '清晰流程，连接关键环节' : 'A clear process connecting critical stages' }}</h2>
        </header>
        <div class="knowledge-step-grid">
          <article v-for="step in content.steps" :key="step[0]">
            <div class="knowledge-step-top"><span>{{ step[0] }}</span><component :is="step[3]" :size="34" weight="thin" /></div>
            <h3>{{ step[1] }}</h3>
            <p>{{ step[2] }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="knowledge-shell knowledge-proof-section">
      <header class="knowledge-section-heading">
        <span>{{ locale === 'zh' ? '执行重点' : 'EXECUTION PRIORITIES' }}</span>
        <h2>{{ content.proofTitle }}</h2>
      </header>
      <div class="knowledge-proof-grid">
        <article v-for="proof in content.proofs" :key="proof[0]">
          <component :is="proof[2]" :size="42" weight="thin" />
          <h3>{{ proof[0] }}</h3>
          <p>{{ proof[1] }}</p>
        </article>
      </div>
    </section>

    <section class="knowledge-shell related-pages">
      <div>
        <span>{{ locale === 'zh' ? '继续了解' : 'EXPLORE MORE' }}</span>
        <h2>{{ locale === 'zh' ? '其他核心能力' : 'Related Capabilities' }}</h2>
      </div>
      <nav>
        <RouterLink v-for="item in related" :key="item.key" :to="{ name: item.route }">
          {{ item.label }} <ArrowRight :size="17" />
        </RouterLink>
      </nav>
    </section>

    <section class="knowledge-shell business-cta">
      <div><h2>{{ locale === 'zh' ? '有采购需求或合作想法？' : 'Have a sourcing requirement or project idea?' }}</h2><p>{{ locale === 'zh' ? '欢迎联系我们，获取适合您市场与项目的产品及供应链建议。' : 'Talk to us for product and supply-chain recommendations suited to your market.' }}</p></div>
      <RouterLink :to="{ name: 'contact' }">{{ locale === 'zh' ? '联系合作' : 'Contact Us' }} <ArrowRight :size="20" /></RouterLink>
    </section>
  </main>
  <SiteFooter />
</template>
