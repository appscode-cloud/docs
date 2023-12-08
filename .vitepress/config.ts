import { defineConfigWithTheme } from 'vitepress'
import type { ThemeConfig } from '@bytebuilders/docs-base'
import baseConfig from '@bytebuilders/docs-base/config'
import HeaderLinks from './header-links'

const head: [string, Record<string, string>][] = HeaderLinks.map(hl => ['link', hl])
// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  title: 'AppsCode Docs',
  titleTemplate: 'AppsCode',
  description: 'A documentation website for AppsCode Platform.',
  head,
  vite: {
    resolve: {
      alias: {
        '@vueuse/integrations/useCookies': '@vueuse/integrations/useCookies.mjs',
      },
    },
  },
})
