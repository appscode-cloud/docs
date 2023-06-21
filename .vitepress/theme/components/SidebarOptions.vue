<script setup lang="ts">
import type { SidebarConfig } from '../typings/sidebar'

defineProps<{
  options: SidebarConfig
}>()
</script>

<template>
  <aside class="menu">
    <template v-for="item in options" :key="item.title">
      <template v-if="item.sections">
        <p class="menu-label">
          {{ item.title }}
        </p>
        <ul class="menu-list">
          <sidebar-options :options="item.sections" />
        </ul>
      </template>
      <li v-else>
        <a :href="item.link">{{ item.title }}</a>
      </li>
    </template>
  </aside>
</template>
