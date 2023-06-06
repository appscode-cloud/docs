import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Bytebuilders Docs",
  description: "A documentation website for Bytebuilders Platform.",
  vite: {
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
  }
})
