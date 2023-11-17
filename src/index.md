---
layout: home
lang: en
---

<script setup lang="ts">
import { useData } from 'vitepress'
import HomeMenu from "../.vitepress/theme/components/HomeMenu.vue"
const {theme} = useData();
</script>

# Appscode Docs

<div class="columns is-multiline mt-20">
  <!-- <div class="column" v-for="option in navigation.sidebar">
    <h4>{{option.title}}</h4>
    <hr />
    <home-menu :options=option.sections />
  </div> -->
</div>
