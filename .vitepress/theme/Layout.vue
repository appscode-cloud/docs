<script setup lang="ts">
import { useData } from 'vitepress'
import Navbar from '../../components/Navbar.vue'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.home">
    <navbar />
  </div>
  <div v-else>
    <a href="/">Home</a>
    <Content />
  </div>
</template>
