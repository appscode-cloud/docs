<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../composables/lang'
import { useNavigation } from '../composables/navigation'

const { activeLinkWithoutLang, wrapLinkWithLang } = useLang()
const { flattenedSidebarOptions } = useNavigation()

const activeSidebarOptionIdx = computed(() => flattenedSidebarOptions.findIndex(option => option.link === `/${activeLinkWithoutLang.value}`))

const nextOption = computed(() => {
  if (activeSidebarOptionIdx.value >= 0 && activeSidebarOptionIdx.value < flattenedSidebarOptions.length - 1)
    return flattenedSidebarOptions[activeSidebarOptionIdx.value + 1]
  else return undefined
})
const previousOption = computed(() => {
  if (activeSidebarOptionIdx.value > 0)
    return flattenedSidebarOptions[activeSidebarOptionIdx.value - 1]
  else return undefined
})
</script>

<template>
  <footer class="ac-doc-footer">
    <a v-if="previousOption" class="ac-doc-footer-left" :href="wrapLinkWithLang(previousOption.link)">
      <span class="header"><i class="fa fa-angle-left" />Previous</span>
      <span class="title">{{ previousOption.title }}</span>
    </a>
    <div v-else />
    <a v-if="nextOption" class="ac-doc-footer-right" :href="wrapLinkWithLang(nextOption.link)">
      <span class="header">Next<i class="fa fa-angle-right" /></span>
      <span class="title">{{ nextOption.title }}</span>
    </a>
    <div v-else />
  </footer>
</template>

<style scoped lang="scss">
.ac-doc-footer {
  margin-top: 50px;
  border-top: 2px solid $primary;
  padding: 20px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .ac-doc-footer-left, .ac-doc-footer-right {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .header {
      font-size: 14px;
      color: $primary-50;
    }

    .title {
      margin-top: 10px;
      font-size: 16px;
      color: $primary-20;
    }
  }

  .ac-doc-footer-left {
    text-align: left;

    .header {
      i {
        margin-right: 5px;
      }
    }
  }

  .ac-doc-footer-right {
    text-align: right;

    .header {
      i {
        margin-left: 5px;
      }
    }
  }
}
</style>
