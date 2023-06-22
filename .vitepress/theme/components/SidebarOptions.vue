<script setup lang="ts">
import { useData } from 'vitepress'
import type { SidebarConfig } from '../typings/sidebar'
import { useLang } from '../composables/lang'

defineProps<{
  options: SidebarConfig
}>()

const { activeLinkWithoutLang, wrapLinkWithLang } = useLang()

const { page } = useData()
function isActiveLink(link: string) {
  return `/${activeLinkWithoutLang.value}` === link
}
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
        <a :href="wrapLinkWithLang(item.link)" :class="{ 'is-active': isActiveLink(item.link) }">{{ item.title }}</a>
      </li>
    </template>
  </aside>
</template>
