<script setup lang="ts">
import { useData, useRoute, useRouter } from 'vitepress'
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent, ref, watchEffect } from 'vue'
import Navbar from './components/Navbar.vue'
import { useMenu } from './composables/menu'

const Sidebar = defineAsyncComponent(() => import('./components/Sidebar.vue'))
const DocOutline = defineAsyncComponent(() => import('./components/DocOutline.vue'))
const DocFooter = defineAsyncComponent(() => import('./components/DocFooter.vue'))
// https://vitepress.dev/reference/runtime-api#usedata
const { frontmatter, page } = useData()
// set i18n local from path
const { path } = useRoute()
const [, lang] = path.split('/')
const { locale } = useI18n()
locale.value = lang

const { go } = useRouter()
watchEffect(() => {
  const redirectCtx = frontmatter.value.redirect || {}
  if (redirectCtx) {
    const { to_menu_name, to_identifier } = redirectCtx || {}
    if (to_menu_name && to_identifier) {
      const { getMenuItemUrl } = useMenu(ref(to_menu_name))
      const url = getMenuItemUrl(to_identifier)
      if (url)
        go(url)
    }
  }
})
</script>

<template>
  <navbar />
  <div v-if="page.isNotFound">
    <div class="pt-60">
      404 not found page
    </div>
  </div>
  <div v-else-if="frontmatter.layout === 'home'">
    <div class="pt-60">
      <div class="container is-fluid">
        <content />
      </div>
    </div>
  </div>
  <div v-else-if="frontmatter.layout === 'guide'" class="ac-system-body is-terminal">
    <sidebar />
    <div class="ac-system-content">
      <div class="p-20">
        <div class="columns is-multiline">
          <div class="column is-9 content">
            <content />
            <doc-footer />
          </div>
          <div class="column is-3">
            <doc-outline />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
