<script setup lang="ts">
import type { Header } from 'vitepress'

defineProps<{
  options: Header[]
}>()
</script>

<template>
  <ul>
    <li v-for="header in options" :key="header.slug">
      <a :href="header.link">{{ header.title }}</a>
      <doc-outline-options v-if="header.children?.length" :options="header.children" />
    </li>
  </ul>
</template>
