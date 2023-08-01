import { Theme, defineConfigWithTheme } from 'vitepress'
import AutoImport from 'unplugin-auto-import/vite'
import HeaderLinks from './header-links'
import { ThemeConfig } from './theme/index'

// https://vitepress.dev/reference/site-config
export default defineConfigWithTheme<ThemeConfig>({
  base: '/docs/',
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
      lang: 'bn'
    }
  },
  markdown: {
    headers: true
  },
  themeConfig: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en: {
          hello: 'Hello'
        },
        bn: {
          hello: 'হ্যালো'
        }
      }
    },
    navigation: {
      sidebar: [
        {
          title: "Getting Started",
          link: '/getting-started'
        },
        {
          title: "Credentials",
          sections: [
            {
              title: "What are credentials in Bytebuilders?",
              link: "/credentials/what-are-credentials-bytebuilders"
            },
            {
              title: "How does it work?",
              link: "/credentials/how-does-it-work"
            },
            {
              title: "Adding a credential to your profile",
              link: ""
            }
          ]
        },
        {
          title: "Import Cluster",
          sections: [
            {
              title: "Import managed cluster",
              link: ""
            },
            {
              title: "Import private cluster",
              link: ""
            },
            {
              title: "Import public cluster",
              link: ""
            }
          ]
        }
      ]
    },
    meilisearch: {
      index: "kubedb"
    }
  },
  vite: {
    plugins: [AutoImport()],
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        }
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@appscode/design-system/base/utilities/colors";',
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
        isCustomElement: (tag) => (tag.includes('nuxt-link') || tag.includes('router-link')),
      },
    },
  }
})
