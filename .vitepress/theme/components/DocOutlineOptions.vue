<script setup lang="ts">
import { useDebounceFn, useThrottleFn } from '@vueuse/core'
import type { Header } from 'vitepress'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  options: Header[]
}>()

const activeOption = ref<string>()

function getDocumentHeaders() {
  return Array.from(document.querySelectorAll('.content a.header-anchor'))
}
function setActiveLink() {
  const anchorElements = getDocumentHeaders()
  if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 1) {
    // end of the page
    // active last option
    activeOption.value = (anchorElements[anchorElements.length - 1] as HTMLAnchorElement).hash
    return
  }

  for (let i = 0; i < anchorElements.length; i++) {
    const elem = anchorElements[i] as HTMLAnchorElement
    const nextElem = i < anchorElements.length - 1 ? anchorElements[i + 1] as HTMLAnchorElement : undefined
    const scrollOffset = window.scrollY

    if (i === 0 && scrollOffset === 0) {
      activeOption.value = elem.hash
      break
    }
    if (scrollOffset < (elem.parentElement!.offsetTop - 56 - 15))
      break

    if (!nextElem || (scrollOffset < (nextElem.parentElement!.offsetTop - 56 - 15))) {
      activeOption.value = elem.hash
      break
    }
  }
}

const deBouncedSetActiveLink = useDebounceFn(setActiveLink, 100)
const throttledAndDebouncedSetActiveLink = useThrottleFn(deBouncedSetActiveLink, 100)

onMounted(() => {
  requestAnimationFrame(
    setActiveLink,
  )
  window.addEventListener('scroll', throttledAndDebouncedSetActiveLink)
})
onUnmounted(() => {
  window.removeEventListener('scroll', throttledAndDebouncedSetActiveLink)
})
</script>

<template>
  <ul>
    <li v-for="header in options" :key="header.slug">
      <a :href="header.link" :class="{ 'is-active': activeOption === header.link }">{{ header.title }}</a>
      <doc-outline-options v-if="header.children?.length" :options="header.children" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
a {
  &.is-active {
    color: $primary-10;
    font-weight: 500;
  }
}
</style>
