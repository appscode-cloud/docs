<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

defineProps<{
  results: Array<{
    title: string
    url: string
    text: string
  }>
  isSearching: boolean
}>()

const DocSearchResultItem = defineAsyncComponent(() => import('./DocSearchResultItem.vue'))
</script>

<template>
  <div class="search-result-box">
    <div v-if="!isSearching && results.length" class="search-content">
      <doc-search-result-item v-for="result in results" :key="result.url" :title="result.title" :text="result.text" :url="result.url" />
    </div>
    <div v-else-if="!isSearching" class="search-notice">
      No matches found
    </div>
    <div v-else class="search-notice">
      Loading...
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-result-box {
  position: absolute;
  background-color: #fff;
  box-shadow: 0 4px 18px 5px rgb(77 77 203 / 13%);
  border-radius: 0 0 8px 8px;
  width: 600px;
  top: 52px;
  padding: 8px 0;

  .search-content {
    max-height: 350px;
    overflow-y: auto;
  }

  .search-notice {
    text-align: center;
    padding: 10px;
    margin: auto;
    font-weight: 600;
  }
}
</style>
