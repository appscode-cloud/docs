<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent } from 'vue'
import Navbar from './components/Navbar.vue'

const Sidebar = defineAsyncComponent(() => import('./components/Sidebar.vue'))
// https://vitepress.dev/reference/runtime-api#usedata
const { frontmatter } = useData()
// set i18n local from path
const { path } = useRoute()
const [, lang] = path.split('/')
const { locale } = useI18n()
locale.value = lang
</script>

<template>
  <navbar />
  <div v-if="frontmatter.layout === 'home'">
    <div class="pt-60 pl-20">
      <content />
    </div>
  </div>
  <div v-else-if="frontmatter.layout === 'guide'" class="ac-system-body is-terminal">
    <sidebar />
    <div class="ac-system-content">
      <div class="p-20">
        <content />
      </div>
    </div>
  </div>
</template>
