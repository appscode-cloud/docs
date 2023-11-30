<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { useMenu } from '../composables/menu'

const menuName = ref('section_menu')
const { activeMenu } = useMenu(menuName)

const { frontmatter } = useData()
const activeSectionMenu = computed(() => frontmatter.value.section_menu)
</script>

<template>
  <template v-for="menuItem in activeMenu" :key="menuItem.identifier">
    <div v-if="menuItem.children?.length" class="navbar-item has-dropdown is-hoverable">
      <a class="navbar-link" :class="{ 'is-active': menuItem.identifier === activeSectionMenu }" href="">{{ menuItem.name }}</a>
      <div class="navbar-dropdown is-boxed">
        <a v-for="item in menuItem.children" :key="item.identifier" class="navbar-item" :href="withBase(item.url)">{{ item.name }}</a>
      </div>
    </div>
    <a v-else class="navbar-item" :class="{ 'is-active': menuItem.identifier === activeSectionMenu }" :href="withBase(menuItem.url)">
      {{ menuItem.name }}
    </a>
  </template>
</template>
