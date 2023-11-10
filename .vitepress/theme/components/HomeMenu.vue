<script setup lang="ts">
import { withBase } from 'vitepress'
import type { SidebarConfig, SidebarItemWithLink, SidebarItemWithSections } from '../typings/sidebar'

defineProps<{
  options: SidebarConfig
}>()

function wrapLinkWithLang(link: string) {
  return withBase(`/en/${link.startsWith('/') ? link.slice(1) : link}`)
}
</script>

<template>
  <ul>
    <template v-for="item in options" :key="item.title">
      <template v-if="(item as SidebarItemWithSections).sections">
        <li class="p-5">
          <h5>{{ item.title }}</h5>
        </li>
        <home-menu class="ml-5 pl-20 b-l-1" :options="(item as SidebarItemWithSections).sections" />
      </template>
      <li v-else class="p-5">
        <a :href="wrapLinkWithLang((item as SidebarItemWithLink).link)">{{ item.title }}</a>
      </li>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
ul{
  li {
    a{
      color: $color-link;

      &:hover {
        color: $ac-primary;
        text-decoration: underline;
      }
    }
  }
}
</style>
