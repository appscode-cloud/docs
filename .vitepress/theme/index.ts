// https://vitepress.dev/guide/custom-theme
import { createPinia } from 'pinia'
import type { VueI18nOptions } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import type { GuideLayoutOptions } from './typings/guide'
import Layout from './Layout.vue'
import './main.scss'

export interface ThemeConfig {
  i18n: VueI18nOptions
  guide: GuideLayoutOptions
  meilisearch?: {
    index: string
  }
}

export default {
  Layout,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  enhanceApp({ app, router, siteData }) {
    app.use(createPinia())
    app.use(createI18n({ legacy: false, ...siteData.value.themeConfig.i18n }))
    // ...
  },
}
