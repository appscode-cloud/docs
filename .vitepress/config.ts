import process from 'node:process'
import { defineConfigWithTheme } from 'vitepress'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import HeaderLinks from './header-links'
import type { ThemeConfig } from './theme/index'
import SidebarOptions from './sidebar-links.json'

const hostname = process.env.HOSTNAME || 'http://bb.test:5997'
const base = '/docs/'

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
  base,
  title: 'Bytebuilders Docs',
  titleTemplate: 'Bytebuilders',
  description: 'A documentation website for Bytebuilders Platform.',
  head: HeaderLinks.map(hl => ['link', hl]),
  srcDir: 'src',
  srcExclude: ['**/README.md', '**/TODO.md'],
  outDir: './.vitepress/dist/docs',
  locales: {
    en: {
      label: 'English',
      lang: 'en',
    },
    bn: {
      label: 'বাংলা',
      lang: 'bn',
    },
  },
  markdown: {
    headers: true,
  },
  sitemap: {
    hostname: `${hostname}${base}`,
  },
  transformHead(context) {
    if (context.pageData.isNotFound)
      return [['meta', { 'http-equiv': 'refresh', 'content': `0; URL=${base}` }]]
  },
  themeConfig: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en: {
          hello: 'Hello',
        },
        bn: {
          hello: 'হ্যালো',
        },
      },
    },
    navigation: {
      sidebar: [
        ...SidebarOptions,
      ],
    },
    meilisearch: {
      index: 'kubedb',
    },
  },
  vite: {
    plugins: [
      AutoImport(),
      Icons({ compiler: 'vue3' }),
    ],
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@appscode/design-system/vue-components/styles/base/utilities/colors"; @import "@appscode/design-system/vue-components/styles/theme/appscode.scss";',
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5997,
    },
    preview: {
      host: '0.0.0.0',
      port: 5997,
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => (tag.includes('nuxt-link') || tag.includes('router-link') || tag.includes('NuxtLink') || tag.includes('RouterLink')),
      },
    },
  },
})
