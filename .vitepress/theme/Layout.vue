<script setup lang="ts">
import { useData } from 'vitepress'
import Navbar from './components/Navbar.vue'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
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
