import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './AppShell.vue'
import { messages } from './messages'
import { router } from './router-full'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/noto-sans-sc/wght.css'
import './styles.css'

const savedLocale = localStorage.getItem('tripeer-locale')

const i18n = createI18n({
  legacy: false,
  locale: savedLocale === 'en' ? 'en' : 'zh',
  fallbackLocale: 'zh',
  messages,
})

createApp(App).use(i18n).use(router).mount('#app')
