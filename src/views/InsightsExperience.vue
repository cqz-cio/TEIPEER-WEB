<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { PhArrowRight as ArrowRight, PhCalendarBlank as Calendar, PhTag as Tag } from '@phosphor-icons/vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'

const { locale } = useI18n()
const route = useRoute()

const contentSets = {
  zh: {
    company: {
      title: '贸易实践', subtitle: '记录十年订单执行中的经验与方法', label: 'TRADE PRACTICE',
      intro: '从2016年成立至今，全品轩在询价、样品、产品与包装确认、供应沟通、质量检查、单证和出运中持续积累经验。本栏目以具体工作方法呈现我们如何理解并推进一笔出口订单。',
      articles: [
        ['从宁波出发：十年贸易执行中的积累', '从最初的需求沟通到样品、订单、单证与出运，真实订单如何推动服务流程逐步清晰。', '2026-08-28', '/assets/trade-2026/insight-history-ningbo.jpg', '发展与实践'],
        ['把客户要求转化为可执行的订单节点', '规格、材料、包装、数量与交期如何在报价和打样阶段得到准确确认。', '2026-08-18', '/assets/trade-2026/product-trade-order.jpg', '订单协同'],
        ['小型贸易团队如何保持信息清晰', '通过统一版本、节点记录和及时反馈，减少客户、供应商和物流之间的信息偏差。', '2026-08-08', '/assets/trade-2026/contact-office-consultation.jpg', '工作方法'],
      ],
    },
    events: {
      title: '客户与项目协同', subtitle: '从具体问题中理解市场与渠道需求', label: 'CUSTOMER & PROJECT COORDINATION',
      intro: '海外客户带来的不只是一个产品名称，还包括渠道、使用场景、成本、包装和交付节奏。本栏目总结项目沟通中需要提前澄清的关键问题。',
      articles: [
        ['采购需求沟通前应准备哪些信息', '产品参考、规格、用途、数量、包装、目标市场与交期越清晰，后续评估越有效。', '2026-08-26', '/assets/trade-2026/contact-office-consultation.jpg', '需求沟通'],
        ['如何从大量产品信息中筛选可执行方向', '结合渠道、用户、目标价格、起订量和交期，建立更实际的产品判断标准。', '2026-08-16', '/assets/trade-2026/insight-sourcing-material.jpg', '产品筛选'],
        ['样品确认如何减少后续量产偏差', '在量产前确认材质、尺寸、外观、折叠、标签与包装，为订单建立共同基准。', '2026-08-06', '/assets/trade-2026/business-customization.jpg', '样品协同'],
      ],
    },
    industry: {
      title: '行业洞察', subtitle: '关注消费趋势与国际贸易实践', label: 'INDUSTRY INSIGHTS',
      intro: '围绕纸制与一次性日用品、相关消费品、包装、采购和质量检查，分享贴近出口订单执行的观察，为客户评估产品与项目提供参考。',
      articles: [
        ['纸制与一次性日用品的采购关注点', '从材料、尺寸、折叠、包装数量和使用场景，梳理下单前需要确认的产品信息。', '2026-08-20', '/assets/trade-2026/insight-sourcing-material.jpg', '产品采购'],
        ['从样品到出货：五个质量确认节点', '梳理样品、物料、生产、包装与出货检查之间的关系。', '2026-08-12', '/assets/trade-2026/insight-quality-check.jpg', '质量实践'],
        ['组合采购如何兼顾效率与清晰度', '通过统一规格、供应匹配和节点管理，降低多产品订单中的沟通与交付风险。', '2026-08-02', '/assets/trade-2026/matrix-combination.jpg', '订单协同'],
      ],
    },
    responsibility: {
      title: '责任与可持续', subtitle: '以合规和长期主义连接合作伙伴', label: 'RESPONSIBILITY & SUSTAINABILITY',
      intro: '负责任的贸易服务来自对合规、质量、供应商协同和资源使用的持续关注。我们从日常业务流程出发，推动更稳健的合作方式。',
      articles: [
        ['负责任采购：从供应商沟通开始', '通过清晰要求、持续沟通和问题反馈，让质量、交期与合作责任得到共同理解。', '2026-08-24', '/assets/trade-2026/about-profile-inspection.jpg', '责任采购'],
        ['包装优化与运输效率的协同思考', '在保护产品的前提下关注包装结构、材料使用和装载效率之间的平衡。', '2026-08-14', '/assets/trade-2026/matrix-packaging.jpg', '可持续协同'],
        ['合规经营是长期合作的基础', '将产品要求、贸易文件与执行节点保持一致，为跨市场合作提供稳定基础。', '2026-08-04', '/assets/trade-2026/capability-trade.jpg', '合规实践'],
      ],
    },
  },
  en: {
    company: {
      title: 'Trade Practice', subtitle: 'Methods shaped by a decade of order execution', label: 'TRADE PRACTICE',
      intro: 'Since 2016, quotation, sampling, product and packaging approval, supplier communication, quality checks, documents and shipment have shaped the way TRIPEER works.',
      articles: [['From Ningbo: A Decade of Trade Execution', 'How real orders have gradually clarified our approach from requirement to shipment.', '2026-08-28', '/assets/trade-2026/insight-history-ningbo.jpg', 'Development'], ['Turning Requirements into Executable Milestones', 'Confirming specifications, materials, packaging, quantity and timing before execution.', '2026-08-18', '/assets/trade-2026/product-trade-order.jpg', 'Orders'], ['How a Focused Trade Team Keeps Information Clear', 'Shared versions, milestone records and timely feedback reduce information gaps.', '2026-08-08', '/assets/trade-2026/contact-office-consultation.jpg', 'Methods']],
    },
    events: {
      title: 'Customer & Project Coordination', subtitle: 'Understanding markets through specific project questions', label: 'CUSTOMER & PROJECT COORDINATION',
      intro: 'An inquiry includes more than a product name. Channel, application, cost, packaging and delivery rhythm all shape an executable project.',
      articles: [['Preparing for Customer Product-selection Meetings', 'Align market, target price, category and delivery expectations before selection.', '2026-08-26', '/assets/trade-2026/contact-office-consultation.jpg', 'Customers'], ['From Event Information to Product Opportunity', 'Use channel, user and commercial goals to evaluate new products.', '2026-08-16', '/assets/trade-2026/insight-sourcing-material.jpg', 'Events'], ['How Sample Reviews Reduce Production Variance', 'Confirm material, color, workmanship and packaging before production.', '2026-08-06', '/assets/trade-2026/business-customization.jpg', 'Sampling']],
    },
    industry: {
      title: 'Industry Insights', subtitle: 'Consumer trends and international trade practice', label: 'INDUSTRY INSIGHTS',
      intro: 'Practical perspectives on paper-based and disposable products, related consumer goods, packaging, sourcing and quality checks.',
      articles: [['Sourcing Paper-based & Disposable Daily-use Products', 'Key questions around materials, dimensions, folding, pack counts and applications.', '2026-08-20', '/assets/trade-2026/insight-sourcing-material.jpg', 'Sourcing'], ['From Sample to Shipment: Five Quality Checkpoints', 'How samples, materials, production, packaging and final checks connect.', '2026-08-12', '/assets/trade-2026/insight-quality-check.jpg', 'Quality'], ['Keeping Combined Sourcing Efficient and Clear', 'Shared specifications and visible milestones reduce communication and delivery risk.', '2026-08-02', '/assets/trade-2026/matrix-combination.jpg', 'Orders']],
    },
    responsibility: {
      title: 'Responsibility & Sustainability', subtitle: 'Connecting partners through compliance and long-term thinking', label: 'RESPONSIBILITY & SUSTAINABILITY',
      intro: 'Responsible trade starts with ongoing attention to compliance, quality, supplier coordination and resource use.',
      articles: [['Responsible Sourcing Starts with Supplier Communication', 'Shared requirements and feedback create common accountability.', '2026-08-24', '/assets/trade-2026/about-profile-inspection.jpg', 'Sourcing'], ['Packaging Optimization and Transport Efficiency', 'Balance product protection, material use and loading efficiency.', '2026-08-14', '/assets/trade-2026/matrix-packaging.jpg', 'Sustainability'], ['Compliance as the Foundation of Long-term Cooperation', 'Keep product requirements, documents and milestones aligned.', '2026-08-04', '/assets/trade-2026/capability-trade.jpg', 'Compliance']],
    },
  },
}

const currentKey = computed(() => route.meta.insightKey || 'company')
const content = computed(() => contentSets[locale.value]?.[currentKey.value] || contentSets.zh.company)
const featured = computed(() => content.value.articles[0])
const remaining = computed(() => content.value.articles.slice(1))
</script>

<template>
  <a class="skip-link" href="#insight-main">{{ locale === 'zh' ? '跳转到主要内容' : 'Skip to content' }}</a>
  <SiteHeader />
  <main id="insight-main" class="knowledge-page insights-experience">
    <section class="knowledge-hero insights-hero">
      <div class="insights-hero-media" aria-hidden="true">
        <img src="/assets/trade-2026/insight-hero-history.jpg" alt="" />
        <img src="/assets/trade-2026/insight-hero-products.jpg" alt="" />
        <img src="/assets/trade-2026/insight-hero-quality.jpg" alt="" />
      </div>
      <div class="knowledge-hero-overlay"></div>
      <div class="knowledge-hero-copy">
        <span>{{ locale === 'zh' ? '贸易实践与洞察' : 'TRADE PRACTICE & INSIGHTS' }}</span>
        <h1>{{ content.title }}</h1>
        <p>{{ content.subtitle }}</p>
      </div>
    </section>

    <section class="knowledge-shell insights-intro">
      <span class="knowledge-label">{{ content.label }}</span>
      <h2>{{ content.subtitle }}</h2>
      <p>{{ content.intro }}</p>
    </section>

    <section class="knowledge-shell news-feature-section">
      <article class="news-feature-card">
        <img :src="featured[3]" :alt="featured[0]" />
        <div>
          <span class="news-category"><Tag :size="15" />{{ featured[4] }}</span>
          <h2>{{ featured[0] }}</h2>
          <p>{{ featured[1] }}</p>
          <time :datetime="featured[2]"><Calendar :size="16" />{{ featured[2] }}</time>
        </div>
      </article>

      <div class="news-card-grid">
        <article v-for="article in remaining" :key="article[0]" class="news-card">
          <img :src="article[3]" :alt="article[0]" />
          <div>
            <span class="news-category"><Tag :size="14" />{{ article[4] }}</span>
            <h3>{{ article[0] }}</h3>
            <p>{{ article[1] }}</p>
            <time :datetime="article[2]"><Calendar :size="15" />{{ article[2] }}</time>
          </div>
        </article>
      </div>
    </section>

    <section class="knowledge-soft-section news-editorial-section">
      <div class="knowledge-shell news-editorial">
        <div><span>{{ locale === 'zh' ? '内容原则' : 'EDITORIAL PRINCIPLES' }}</span><h2>{{ locale === 'zh' ? '真实、专业、持续更新' : 'Real, practical and consistently updated' }}</h2></div>
        <p>{{ locale === 'zh' ? '内容围绕真实业务、客户协同和行业实践持续更新，不使用无法验证的数据或空泛的宣传内容。' : 'Updates focus on real business practice, customer collaboration and relevant industry perspectives, without unverified claims.' }}</p>
      </div>
    </section>

    <section class="knowledge-shell business-cta">
      <div><h2>{{ locale === 'zh' ? '想进一步了解我们的业务？' : 'Want to learn more about our business?' }}</h2><p>{{ locale === 'zh' ? '欢迎联系我们，讨论产品、采购与国际贸易合作需求。' : 'Talk to us about product, sourcing and international trade requirements.' }}</p></div>
      <RouterLink :to="{ name: 'contact' }">{{ locale === 'zh' ? '联系我们' : 'Contact Us' }} <ArrowRight :size="20" /></RouterLink>
    </section>
  </main>
  <SiteFooter />
</template>
