<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { useI18n } from 'vue-i18n'
import Navbar from './components/Navbar.vue'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
// set i18n local from path
const { path } = useRoute()
const [, lang] = path.split('/')
const { locale } = useI18n()
locale.value = lang
</script>

<template>
  <div>
    <navbar />
    <div class="ac-system-body is-terminal">
      <div v-if="frontmatter.home">
        <Content />
      </div>
    </div>
  </div>
</template>
