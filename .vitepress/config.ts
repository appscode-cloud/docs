import { defineConfig } from 'vitepress'
import AutoImport from 'unplugin-auto-import/vite'
import HeaderLinks from './header-links'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Bytebuilders Docs',
  titleTemplate: 'Bytebuilders',
  description: 'A documentation website for Bytebuilders Platform.',
  head: HeaderLinks.map(hl => ['link', hl]),
  srcDir: 'src',
  srcExclude: ['**/README.md', '**/TODO.md'],
  vite: {
    plugins: [AutoImport()],
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
