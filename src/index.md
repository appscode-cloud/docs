---
layout: home
lang: en
menu_name: home_menu
---

<script setup lang="ts">
import { useData } from 'vitepress'
import {computed} from "vue";
import { useMenu } from '../.vitepress/theme/composables/menu.ts'
import HeroArea from "../.vitepress/theme/components/HeroArea.vue"
import HomeMenu from "../.vitepress/theme/components/HomeMenu.vue"
const {theme, frontmatter} = useData();
const menuName = computed(() => frontmatter.value.menu_name)
const {activeMenu} = useMenu(menuName)
</script>

<!-- hero area  -->
<hero-area/>

<div class="container">
  <div class="columns is-multiline mt-32">
    <div class="column is-one-third-widescreen is-one-quarter-fullhd is-one-third-tablet is-full-mobile" v-for="menuItem in activeMenu">
      <h4>{{menuItem.name}}</h4>
      <home-menu :options=menuItem.children />
    </div>
  </div>
</div>
