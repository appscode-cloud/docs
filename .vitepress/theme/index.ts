// https://vitepress.dev/guide/custom-theme
import { createPinia } from 'pinia'
import Layout from './Layout.vue'
import './main.scss'

export default {
  Layout,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  enhanceApp({ app, router, siteData }) {
    app.use(createPinia())
    // ...
  },
}
