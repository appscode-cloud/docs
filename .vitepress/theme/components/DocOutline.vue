<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useData } from 'vitepress'

const DocOutlineOptions = defineAsyncComponent(() => import('./DocOutlineOptions.vue'))

const { page } = useData()
</script>

<template>
  <div class="ac-doc-outline">
    <doc-outline-options :options="page.headers" />
  </div>
</template>

<style lang="scss">
.ac-doc-outline {
  position: fixed;
  height: calc(100vh - 90px);
  padding: 20px;
  border-left: 2px solid $primary-40;

  li {
    a {
      color: $primary-30;
      font-size: 14px;
    }

    ul {
      padding: 10px;
      border-left: 1px solid $primary-80;
    }
  }
}
</style>
