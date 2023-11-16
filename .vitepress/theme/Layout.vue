<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent } from 'vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { data as docs } from '../docs.data'
import Navbar from './components/Navbar.vue'

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

console.log({ docs })
</script>

<template>
  <navbar />
  <div v-if="frontmatter.layout === 'home'">
    {{ docs }}
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
