import { BaseLayout } from '@bytebuilders/docs-base'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

export default {
  Layout: BaseLayout,
  enhanceApp({ app, router, siteData }) {
    app.use(createPinia())
    app.use(createI18n({ legacy: false, ...siteData.value.themeConfig.i18n }))
    // ...
  },

}
