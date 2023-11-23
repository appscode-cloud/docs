---
layout: home
lang: en
menu_name: home_menu
---

<script setup lang="ts">
import { useData } from 'vitepress'
import { useMenu } from '../.vitepress/theme/composables/menu.ts'
import HomeMenu from "../.vitepress/theme/components/HomeMenu.vue"
const {theme, frontmatter} = useData();
const {activeMenu} = useMenu(frontmatter.value.menu_name)
</script>

# Appscode Docs

<div class="columns is-multiline mt-20">
  <div class="column" v-for="menuItem in activeMenu">
    <h4>{{menuItem.name}}</h4>
    <hr />
    <home-menu :options=menuItem.children />
  </div>
</div>
