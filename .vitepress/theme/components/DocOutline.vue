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
  height: calc(100vh - 0px);
  border-left: 1px solid $color-border;
  width: 100%;
  padding-top: 64px;
  top: 0;

  ul {
    li {
      a {
        color: $color-text;
        font-weight: 500;
        font-size: 1rem;
        padding: 4px 16px;
        display: block;
        transition: 0.3s ease-in-out;

        &.is-active {
          color: $ac-primary;
          position: relative;
          z-index: 9;

          &::after {
            position: absolute;
            content: "";
            left: 0;
            top: 0;
            width: 3px;
            height: 100%;
            background-color: $ac-primary;
          }
        }
      }
    }
  }
}
</style>
