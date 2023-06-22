<script setup lang="ts">
import type { SidebarConfig, SidebarItemWithLink, SidebarItemWithSections } from '../typings/sidebar'
import { useLang } from '../composables/lang'

defineProps<{
  options: SidebarConfig
}>()

const { activeLinkWithoutLang, wrapLinkWithLang } = useLang()

function isActiveLink(link: string) {
  return `/${activeLinkWithoutLang.value}` === link
}
</script>

<template>
  <aside class="menu">
    <template v-for="item in options" :key="item.title">
      <template v-if="(item as SidebarItemWithSections).sections">
        <p class="menu-label ac-menu-label">
          {{ item.title }}
        </p>
        <ul class="menu-list">
          <sidebar-options :options="(item as SidebarItemWithSections).sections" />
        </ul>
      </template>
      <li v-else>
        <a :href="wrapLinkWithLang((item as SidebarItemWithLink).link)" :class="{ 'is-active': isActiveLink((item as SidebarItemWithLink).link) }">{{ item.title }}</a>
      </li>
    </template>
  </aside>
</template>

<style lang="scss" scoped>
.ac-menu-label {
  padding-left: 20px;
  font-size: 14px;
  color: #bbb;
}
</style>
