<script setup lang="ts">
import { withBase } from 'vitepress';
import type { Sidebar } from '../composables/menu';

defineProps<{
  options: Sidebar
}>()
</script>

<template>
  <ul>
    <template v-for="item in options" :key="item.identifier">
      <template v-if="item.children?.length">
        <li class="is-flex is-align-items-center gap-8">
          <h6>{{ item.name }}</h6>
        </li>
        <home-menu class="ml-5 pl-16 b-l-1" :options="item.children" />
      </template>
      <li v-else class="py-2">
        <a :href="withBase(item.url)">{{ item.name }}</a>
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
