<script setup lang="ts">
import { useData, useRoute } from 'vitepress';
import { defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import Navbar from './components/Navbar.vue';

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
      <content />
    </div>
  </div>
  <div v-else-if="frontmatter.layout === 'guide'" class="ac-system-body is-terminal">
    <sidebar />
    <div class="content">
      <content class="content-body"/>
      <doc-footer class="content-footer" />
    </div>
    <div class="toc">
      <doc-outline />
    </div>
  </div>
</template>
<style lang="scss">
.ac-system-body {
  grid-template-columns: 350px auto 350px !important;
  .ac-left-sidebar-wrapper {
    width: 350px;
  }
}
 .content {
  .content-body {
    min-height: calc(100vh - 160px);
  }
  width: calc(100% - 120px);
  margin: 20px auto 20px;
 }
</style>