import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from '@bytebuilders/docs-base'
import baseConfig from '@bytebuilders/docs-base/config'

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  vite: {
    resolve: {
      alias: {
        '@vueuse/integrations/useCookies': '@vueuse/integrations/useCookies.mjs',
      },
    },
  },
})
