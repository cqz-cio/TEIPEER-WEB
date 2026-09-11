import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { cmsProxyOptions } from './deploy/cms-proxy.js'

export default defineConfig(({ mode }) => {
  const cmsProxy = cmsProxyOptions({ ...loadEnv(mode, process.cwd(), ''), ...process.env })
  const proxy = cmsProxy ? { '/cms-api': cmsProxy } : undefined
  return {
    plugins: [vue()],
    optimizeDeps: {
      entries: ['index.html'],
    },
    server: {
      proxy,
      host: '0.0.0.0',
      allowedHosts: ['terminal.local'],
    },
    preview: { proxy },
  }
})
