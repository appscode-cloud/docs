<script setup lang="ts">
import { useData } from 'vitepress';
import { defineAsyncComponent } from 'vue';

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
  height: calc(100vh - 50px);
  padding: 24px;
  border-left: 1px solid $color-border;

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
