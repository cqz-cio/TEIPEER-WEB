<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { PhClock as Clock, PhMapPin as MapPin, PhPaperclip as Paperclip, PhInfo as Info } from '@phosphor-icons/vue'

const { locale } = useI18n()
const inquiry = ref('')
const company = ref('')
const attachment = ref(null)
const attachmentInput = ref(null)
const attachmentError = ref(false)
const isCareer = computed(() => inquiry.value === 'career')
const content = computed(() => locale.value === 'zh' ? {
  title: '合作与求职咨询', intro: '无论您是寻求商务合作，还是希望加入我们团队，欢迎留下您的信息与需求。',
  note: '当前接收服务尚未启用，填写内容和所选附件不会保存或发送。',
  name: '姓名', nameHint: '请输入您的姓名', type: '联系类型', typeHint: '请选择联系类型', career: '求职应聘', business: '商务合作',
  company: '公司名称（合作填）', companyHint: '请输入公司名称', companySkip: '求职应聘无需填写公司名称', email: '邮箱', emailHint: '请输入您的邮箱', phone: '联系电话', phoneHint: '请输入您的联系电话',
  message: '需求说明', messageHint: '如果是合作，请简述您的项目；如果是求职，请说明意向岗位及相关情况。',
  attachment: '附件上传（可选）', choose: '选择附件', uploadHint: '可添加简历、项目介绍或相关资料', formats: 'PDF、Word、Excel、JPG、PNG，单个文件不超过10MB', remove: '移除附件', invalid: '请选择支持的文件格式，且文件大小不超过10MB。',
  submit: '提交咨询（暂未开放）', submitHint: '接收服务开通后可提交咨询及附件。', direct: '联系我们', directHint: '商务合作 · 求职应聘', hours: '工作时间', time: '周一至周五 09:00–18:00', location: '所在地', address: '中国 · 浙江 · 宁波', imageAlt: '团队整理产品资料与合作需求',
} : {
  title: 'Business & Career Inquiries', intro: 'Whether you are exploring a business partnership or joining our team, share your details and requirements with us.',
  note: 'Our receiving service is not active yet. Entered details and selected files will not be saved or sent.',
  name: 'Name', nameHint: 'Your name', type: 'Contact Type', typeHint: 'Select contact type', career: 'Job Application', business: 'Business Cooperation',
  company: 'Company (business inquiries)', companyHint: 'Company name', companySkip: 'Not required for job applications', email: 'Email', emailHint: 'Your email address', phone: 'Phone', phoneHint: 'Your phone number',
  message: 'Inquiry Details', messageHint: 'For business cooperation, briefly describe your project. For job applications, specify your desired role and relevant background.',
  attachment: 'Attachment (optional)', choose: 'Choose attachment', uploadHint: 'Add a resume, project introduction or related materials', formats: 'PDF, Word, Excel, JPG or PNG; maximum 10MB per file', remove: 'Remove attachment', invalid: 'Choose a supported file format no larger than 10MB.',
  submit: 'Submit Inquiry (unavailable)', submitHint: 'Inquiries and attachments can be submitted once the receiving service is active.', direct: 'Contact Us', directHint: 'Business Cooperation · Careers', hours: 'Business Hours', time: 'Mon–Fri 09:00–18:00', location: 'Location', address: 'Ningbo, Zhejiang, China', imageAlt: 'Team reviewing product materials and cooperation requirements',
})
function selectAttachment(event) {
  const file = event.target.files?.[0]
  attachmentError.value = false
  attachment.value = null
  if (!file) return
  if (!/\.(pdf|docx?|xlsx?|jpe?g|png)$/i.test(file.name) || file.size > 10 * 1024 * 1024) {
    attachmentError.value = true
    event.target.value = ''
    return
  }
  attachment.value = file
}
function clearAttachment() {
  attachment.value = null
  attachmentError.value = false
  if (attachmentInput.value) attachmentInput.value.value = ''
}
</script>

<template>
  <a class="skip-link" href="#contact-main">{{ locale === 'zh' ? '跳至主要内容' : 'Skip to content' }}</a>
  <SiteHeader />
  <main id="contact-main" class="contact-page inquiry-redesign">
    <section class="contact-shell contact-inquiry-section">
      <div class="contact-form-column">
        <header class="contact-section-heading">
          <p>BUSINESS &amp; CAREER INQUIRIES</p>
          <h1>{{ content.title }}</h1>
          <span>{{ content.intro }}</span>
        </header>
        <p id="contact-unavailable" class="inquiry-note" role="note"><Info :size="18" aria-hidden="true" />{{ content.note }}</p>
        <form @submit.prevent aria-describedby="contact-unavailable">
          <fieldset class="contact-form" :aria-label="content.title">
            <label class="contact-field"><span>{{ content.name }} <b>*</b></span><input required name="name" type="text" autocomplete="name" :placeholder="content.nameHint" /></label>
            <label class="contact-field"><span>{{ content.type }} <b>*</b></span>
              <select v-model="inquiry" required name="inquiry"><option disabled value="">{{ content.typeHint }}</option><option value="career">{{ content.career }}</option><option value="business">{{ content.business }}</option></select>
            </label>
            <label class="contact-field"><span>{{ content.company }} <b v-if="inquiry === 'business'">*</b></span><input v-model="company" :disabled="isCareer" :required="inquiry === 'business'" name="company" type="text" autocomplete="organization" :placeholder="isCareer ? content.companySkip : content.companyHint" /></label>
            <label class="contact-field"><span>{{ content.email }} <b>*</b></span><input required name="email" type="email" autocomplete="email" :placeholder="content.emailHint" /></label>
            <label class="contact-field contact-field-full"><span>{{ content.phone }} <b>*</b></span><input required name="phone" type="tel" autocomplete="tel" :placeholder="content.phoneHint" /></label>
            <label class="contact-field contact-field-full"><span>{{ content.message }} <b>*</b></span><textarea required name="message" rows="5" :placeholder="content.messageHint"></textarea></label>
            <div class="contact-upload contact-field-full">
              <span id="attachment-label">{{ content.attachment }}</span>
              <label class="inquiry-upload-control">
                <input ref="attachmentInput" type="file" name="attachment" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" aria-labelledby="attachment-label" aria-describedby="attachment-help attachment-error" @change="selectAttachment" />
                <span class="contact-upload-box"><Paperclip :size="32" aria-hidden="true" /><strong>{{ attachment ? attachment.name : content.choose }}</strong><small>{{ content.uploadHint }}</small><small id="attachment-help">{{ content.formats }}</small></span>
              </label>
              <button v-if="attachment" class="inquiry-remove" type="button" @click="clearAttachment">{{ content.remove }}</button>
              <span id="attachment-error" class="inquiry-file-error" role="alert">{{ attachmentError ? content.invalid : '' }}</span>
            </div>
            <div class="inquiry-submit-row contact-field-full"><button class="contact-submit" type="submit" disabled>{{ content.submit }}</button><span>{{ content.submitHint }}</span></div>
          </fieldset>
        </form>
      </div>
      <aside class="contact-direct">
        <div class="contact-direct-panel">
          <h2>{{ content.direct }}</h2><p class="inquiry-direct-intro">{{ content.directHint }}</p>
          <div class="contact-direct-list">
            <article><Clock :size="34" aria-hidden="true" /><div><span>{{ content.hours }}</span><strong>{{ content.time }}</strong></div></article>
            <article><MapPin :size="34" aria-hidden="true" /><div><span>{{ content.location }}</span><strong>{{ content.address }}</strong></div></article>
          </div>
          <img class="inquiry-team-image" src="/assets/trade-2026/contact-office-consultation.jpg" :alt="content.imageAlt" />
        </div>
      </aside>
    </section>
  </main>
  <SiteFooter />
</template>
