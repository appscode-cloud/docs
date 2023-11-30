<script setup lang="ts">
import { type WatchStopHandle, computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import { useLang } from '../composables/lang'
import type { Sidebar } from '../composables/menu'

defineProps<{
  options: Sidebar
}>()

const { activeLinkWithoutLang, wrapLinkWithLang } = useLang()
const { frontmatter } = useData()
const activeMenuName = computed(() => frontmatter.value.menu_name)
const activeMenuItemIdentifier = computed(() => frontmatter.value.menu[activeMenuName.value]?.identifier)

let activeLinkWatcher: WatchStopHandle
onMounted(() => {
  activeLinkWatcher = watch(activeLinkWithoutLang, () => {
    nextTick(() => {
      const element = document?.querySelector('.menu li a.is-active')
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }, { immediate: true })
})
onBeforeUnmount(() => {
  activeLinkWatcher()
})
</script>

<template>
  <aside class="menu">
    <template v-for="item in options" :key="item.identifier">
      <template v-if="item.children">
        <p class="menu-label ac-menu-label pl-10">
          {{ item.name }}
        </p>
        <ul class="menu-list pl-20">
          <sidebar-options :options="item.children" />
        </ul>
      </template>
      <li v-else>
        <a :href="wrapLinkWithLang(item.url, true)" :class="{ 'is-active': activeMenuItemIdentifier === item.identifier }">{{ item.name }}</a>
      </li>
    </template>
  </aside>
</template>

<style lang="scss" scoped>
.ac-menu-label {
  padding-left: 20px;
  margin: 0;
  margin-top: 24px;
  font-size: 1rem;
  color: $primary-95;
}
</style>
