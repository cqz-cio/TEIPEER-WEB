<script setup>
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import {
  PhArrowRight as ArrowRight,
  PhCheckCircle as CheckCircle,
  PhClock as Clock,
  PhCube as Cube,
  PhEnvelopeSimple as EnvelopeSimple,
  PhFileText as FileText,
  PhFolderOpen as FolderOpen,
  PhGlobeHemisphereEast as GlobeHemisphereEast,
  PhMapPin as MapPin,
  PhPaperclip as Paperclip,
  PhPhone as Phone,
  PhShieldCheck as ShieldCheck,
  PhUsersThree as UsersThree,
} from '@phosphor-icons/vue'

const { locale } = useI18n()
const submitted = ref(false)
const successMessage = ref(null)

const content = computed(() => locale.value === 'zh'
  ? {
      heroTitle: '联系我们',
      heroSubtitle: '让我们从您的需求开始',
      heroBody: '无论是纸制与一次性日用品、相关消费品采购，还是产品与包装定制、订单与出口协同，我们都从具体需求开始。',
      formEyebrow: 'COOPERATION INQUIRY',
      formTitle: '提交合作需求',
      formIntro: '产品参考、规格、材料、包装、数量、目标市场和交期越清晰，我们越能有效评估项目。',
      fields: {
        name: '姓名',
        company: '公司名称',
        country: '国家/地区',
        email: '邮箱',
        phone: '联系电话',
        inquiry: '咨询类型',
        category: '产品品类',
        quantity: '预计采购数量',
        delivery: '目标交期',
        message: '需求说明',
        attachment: '附件上传（可选）',
      },
      placeholders: {
        name: '请输入您的姓名',
        company: '请输入公司名称',
        country: '请选择国家/地区',
        email: '请输入公司邮箱',
        phone: '请输入联系电话（含国家区号）',
        inquiry: '请选择咨询类型',
        category: '请选择或填写产品品类',
        quantity: '请输入预计采购数量',
        message: '请描述产品规格、用途、材质、包装、认证及其他关键要求。',
      },
      inquiryOptions: ['纸制与一次性日用品', '其他日用消费品采购', '产品与包装定制', '订单与出口协同'],
      countryOptions: ['中国', '欧洲', '北美', '南美', '中东', '东南亚', '其他地区'],
      upload: '点击选择文件或拖放到此处',
      uploadHint: '支持 PDF、Word、Excel、JPG、PNG，单个文件不超过10MB',
      consent: '我已阅读并同意隐私政策，并授权 TRIPEER 为回复本次咨询处理我提交的信息。',
      submit: '提交咨询',
      successTitle: '需求已提交',
      successBody: '感谢您的信任。我们已记录本次咨询，并会尽快与您联系。',
      directTitle: '直接联系',
      details: [
        { label: '邮箱', value: '正式邮箱待确认', icon: EnvelopeSimple },
        { label: '电话', value: '联系电话待确认', icon: Phone },
        { label: '工作时间', value: '周一至周五 09:00–18:00', icon: Clock },
        { label: '地址', value: '中国·浙江·宁波（详细地址待补充）', icon: MapPin },
      ],
      responseTitle: '我们会尽快回复',
      responseBody: '收到信息后，我们会先确认产品方向与关键条件；如需求可行，再沟通样品、报价和预计周期。',
      processTitle: '合作流程：简单三步，开启合作',
      steps: [
        { title: '描述需求', body: '说明产品、用途、规格、包装、数量、市场与目标交期。', icon: FileText },
        { title: '提供图片或文件', body: '上传参考产品、规格书、包装示意或其他可用资料。', icon: FolderOpen },
        { title: '确认可行方向', body: '我们评估产品与订单条件，并沟通样品、报价和下一步。', icon: Cube },
      ],
      trustTitle: '值得信赖的合作伙伴',
      trust: [
        { title: '信息安全与保密', body: '尊重客户资料与商业信息，按合作需要进行内部使用。', icon: ShieldCheck },
        { title: '专业响应与支持', body: '由相关业务人员跟进，保持清晰、及时的沟通。', icon: UsersThree },
        { title: '海外订单协同', body: '围绕产品、包装、质量、单证与出口交付提供协调支持。', icon: GlobeHemisphereEast },
      ],
    }
  : {
      heroTitle: 'Contact Us',
      heroSubtitle: 'Let’s Start with Your Requirement',
      heroBody: 'Start with a specific requirement for paper-based and disposable daily-use products, related consumer goods, customization or export coordination.',
      formEyebrow: 'COOPERATION INQUIRY',
      formTitle: 'Submit Your Requirement',
      formIntro: 'Product references, specifications, materials, packaging, quantity, market and timing help us assess the project effectively.',
      fields: {
        name: 'Name',
        company: 'Company',
        country: 'Country / Region',
        email: 'Email',
        phone: 'Phone',
        inquiry: 'Inquiry Type',
        category: 'Product Category',
        quantity: 'Estimated Quantity',
        delivery: 'Target Delivery',
        message: 'Requirement Details',
        attachment: 'Attachment (optional)',
      },
      placeholders: {
        name: 'Your name',
        company: 'Company name',
        country: 'Select country / region',
        email: 'Business email',
        phone: 'Phone number with country code',
        inquiry: 'Select inquiry type',
        category: 'Select or enter a product category',
        quantity: 'Estimated purchasing quantity',
        message: 'Describe specifications, use, materials, packaging, certifications and other key requirements.',
      },
      inquiryOptions: ['Paper-based & Disposable Products', 'Other Daily-use Consumer Goods', 'Product & Packaging Customization', 'Order & Export Coordination'],
      countryOptions: ['China', 'Europe', 'North America', 'South America', 'Middle East', 'Southeast Asia', 'Other'],
      upload: 'Choose a file or drag it here',
      uploadHint: 'PDF, Word, Excel, JPG or PNG, up to 10MB',
      consent: 'I have read the privacy notice and authorize TRIPEER to process the information submitted to respond to this inquiry.',
      submit: 'Submit Inquiry',
      successTitle: 'Inquiry Submitted',
      successBody: 'Thank you. We have recorded your inquiry and will contact you as soon as possible.',
      directTitle: 'Direct Contact',
      details: [
        { label: 'Email', value: 'Official email to be confirmed', icon: EnvelopeSimple },
        { label: 'Phone', value: 'Contact number to be confirmed', icon: Phone },
        { label: 'Business Hours', value: 'Mon–Fri 09:00–18:00', icon: Clock },
        { label: 'Address', value: 'Ningbo, Zhejiang, China (details TBC)', icon: MapPin },
      ],
      responseTitle: 'We’ll Respond Promptly',
      responseBody: 'We first review the product direction and key conditions. If feasible, we discuss samples, quotation and estimated timing.',
      processTitle: 'Three Simple Steps to Start',
      steps: [
        { title: 'Describe Your Needs', body: 'Share the product, application, specifications, packaging, quantity, market and target date.', icon: FileText },
        { title: 'Add Images or Files', body: 'Upload reference products, specifications or packaging information.', icon: FolderOpen },
        { title: 'Confirm a Feasible Direction', body: 'We assess the request and discuss samples, quotation and the next step.', icon: Cube },
      ],
      trustTitle: 'A Dependable Cooperation Partner',
      trust: [
        { title: 'Confidential Information', body: 'Customer files and commercial information are handled only as needed for cooperation.', icon: ShieldCheck },
        { title: 'Professional Support', body: 'The relevant team follows up with clear and timely communication.', icon: UsersThree },
        { title: 'Overseas Order Coordination', body: 'Coordinated support across products, packaging, quality, documents and export delivery.', icon: GlobeHemisphereEast },
      ],
    })

const handleSubmit = async () => {
  submitted.value = true
  await nextTick()
  successMessage.value?.focus()
}
</script>

<template>
  <a class="skip-link" href="#contact-main">{{ locale === 'zh' ? '跳至主要内容' : 'Skip to content' }}</a>
  <SiteHeader />

  <main id="contact-main" class="contact-page">
    <section class="contact-hero">
      <div class="contact-hero-media" aria-hidden="true">
        <img src="/assets/trade-2026/contact-hero-meeting.jpg" alt="" />
        <img src="/assets/trade-2026/contact-hero-port.jpg" alt="" />
      </div>
      <div class="contact-hero-overlay" aria-hidden="true"></div>
      <div class="contact-shell contact-hero-copy">
        <h1>{{ content.heroTitle }}</h1>
        <p>{{ content.heroSubtitle }}</p>
        <span>{{ content.heroBody }}</span>
      </div>
    </section>

    <section class="contact-shell contact-inquiry-section">
      <div class="contact-form-column">
        <header class="contact-section-heading">
          <p>{{ content.formEyebrow }}</p>
          <h2>{{ content.formTitle }}</h2>
          <span>{{ content.formIntro }}</span>
        </header>

        <div
          v-if="submitted"
          ref="successMessage"
          class="contact-success"
          role="status"
          tabindex="-1"
        >
          <CheckCircle :size="28" weight="fill" />
          <div><strong>{{ content.successTitle }}</strong><span>{{ content.successBody }}</span></div>
        </div>

        <form class="contact-form" @submit.prevent="handleSubmit">
          <label class="contact-field">
            <span>{{ content.fields.name }} <b>*</b></span>
            <input required type="text" name="name" :placeholder="content.placeholders.name" />
          </label>
          <label class="contact-field">
            <span>{{ content.fields.company }} <b>*</b></span>
            <input required type="text" name="company" :placeholder="content.placeholders.company" />
          </label>
          <label class="contact-field">
            <span>{{ content.fields.country }} <b>*</b></span>
            <select required name="country">
              <option value="" disabled selected>{{ content.placeholders.country }}</option>
              <option v-for="item in content.countryOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>
          <label class="contact-field">
            <span>{{ content.fields.email }} <b>*</b></span>
            <input required type="email" name="email" :placeholder="content.placeholders.email" />
          </label>
          <label class="contact-field">
            <span>{{ content.fields.phone }} <b>*</b></span>
            <input required type="tel" name="phone" :placeholder="content.placeholders.phone" />
          </label>
          <label class="contact-field">
            <span>{{ content.fields.inquiry }} <b>*</b></span>
            <select required name="inquiry">
              <option value="" disabled selected>{{ content.placeholders.inquiry }}</option>
              <option v-for="item in content.inquiryOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </label>
          <label class="contact-field">
            <span>{{ content.fields.category }}</span>
            <input type="text" name="category" :placeholder="content.placeholders.category" />
          </label>
          <label class="contact-field">
            <span>{{ content.fields.quantity }}</span>
            <input type="text" name="quantity" :placeholder="content.placeholders.quantity" />
          </label>
          <label class="contact-field contact-field-full">
            <span>{{ content.fields.delivery }}</span>
            <input type="date" name="delivery" />
          </label>
          <label class="contact-field contact-field-full">
            <span>{{ content.fields.message }} <b>*</b></span>
            <textarea required name="message" rows="5" :placeholder="content.placeholders.message"></textarea>
          </label>
          <label class="contact-upload contact-field-full">
            <span>{{ content.fields.attachment }}</span>
            <input type="file" name="attachment" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" />
            <span class="contact-upload-box">
              <Paperclip :size="26" />
              <strong>{{ content.upload }}</strong>
              <small>{{ content.uploadHint }}</small>
            </span>
          </label>
          <label class="contact-consent contact-field-full">
            <input required type="checkbox" name="consent" />
            <span>{{ content.consent }}</span>
          </label>
          <button class="contact-submit" type="submit">
            {{ content.submit }}
            <ArrowRight :size="19" weight="bold" />
          </button>
        </form>
      </div>

      <aside class="contact-direct">
        <div class="contact-direct-panel">
          <h2>{{ content.directTitle }}</h2>
          <div class="contact-direct-list">
            <article v-for="item in content.details" :key="item.label">
              <component :is="item.icon" :size="30" />
              <div><span>{{ item.label }}</span><strong>{{ item.value }}</strong></div>
            </article>
          </div>
          <div class="contact-response">
            <CheckCircle :size="31" />
            <div><strong>{{ content.responseTitle }}</strong><span>{{ content.responseBody }}</span></div>
          </div>
        </div>
        <img src="/assets/trade-2026/contact-office-consultation.jpg" :alt="locale === 'zh' ? '全品轩团队整理客户询盘与产品资料' : 'TRIPEER team reviewing inquiry and product materials'" />
      </aside>
    </section>

    <section class="contact-process">
      <div class="contact-shell">
        <h2>{{ content.processTitle }}</h2>
        <div class="contact-process-grid">
          <article v-for="(item, index) in content.steps" :key="item.title">
            <span>{{ index + 1 }}</span>
            <component :is="item.icon" :size="43" />
            <div><h3>{{ item.title }}</h3><p>{{ item.body }}</p></div>
          </article>
        </div>
      </div>
    </section>

    <section class="contact-trust">
      <div class="contact-shell">
        <h2>{{ content.trustTitle }}</h2>
        <div class="contact-trust-grid">
          <article v-for="item in content.trust" :key="item.title">
            <component :is="item.icon" :size="46" />
            <div><h3>{{ item.title }}</h3><p>{{ item.body }}</p></div>
          </article>
        </div>
      </div>
    </section>
  </main>

  <SiteFooter />
</template>
