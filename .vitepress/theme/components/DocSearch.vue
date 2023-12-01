<script setup lang="ts">
import { useDebounceFn, useFetch } from '@vueuse/core';
import { useData } from 'vitepress';
import { defineAsyncComponent, ref, watch } from 'vue';

const Searchbar = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/form-fields/Searchbar.vue'))
const HeroiconsMagnifyingGlass = defineAsyncComponent(() => import('~icons/heroicons/magnifying-glass'))

const DocSearchResults = defineAsyncComponent(() => import('./DocSearchResults.vue'))

const showSearchResults = ref(false)

const searchText = ref('')
const isSearching = ref(false)
const searchHits = ref([])
function onFocusoutSearchBox() {
  setTimeout(() => {
    searchText.value = ''
    searchHits.value = []
    showSearchResults.value = false
  }, 100)
}

const searchConfig = {
  attributesToRetrieve: ['title', 'url'],
  attributesToHighlight: ['title', 'text'],
  attributesToCrop: ['text'],
  cropLength: 15,
  limit: 7,
  offset: 0,
}

const { theme } = useData()
const index = theme.value.meilisearch.index

const url = `https://search.docs.appscode.com/indexes/${index}/search`
const token = '8fd610038d901dd16a111e6f1568343bb969b084a1952dafdcb1545fd8c35e96'
async function search() {
  showSearchResults.value = true

  isSearching.value = true
  const { data } = await useFetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }, { timeout: 5000 }).post({
    q: searchText.value.trim(),
    ...searchConfig,
  }).json()

  searchHits.value = data.value.hits?.map((hit: { _formatted: { text: string; title: string; url: string } }) => hit._formatted) || []
  isSearching.value = false
}
const debouncedSearch = useDebounceFn(search, 300)

watch(searchText, (n) => {
  if (n.length)
    debouncedSearch()
  else
    showSearchResults.value = false
})
</script>

<template>
  <!-- searchbar item  -->
<searchbar/>
<!-- /Users/mohin/go/src/go.bytebuilders.dev/design-system/src/components/vue-components/v3/form-fields/Searchbar.vue -->
  <!-- <div class="ac-navbar-search">
    <div class="search-item">
      <span class="icon">
        <heroicons-magnifying-glass />

      </span>
      <input
        v-model="searchText" type="search"
        name="search"
        placeholder="Search what you are looking for"
        @focusout="onFocusoutSearchBox"
      >
      <doc-search-results v-show="showSearchResults" :results="searchHits" :is-searching="isSearching" />
    </div>
  </div> -->
</template>

<style lang="scss">
.search-result-box{
  display: none;
}

.searchbar{
  width: 80%;
  margin: 0 auto;
}
</style>
