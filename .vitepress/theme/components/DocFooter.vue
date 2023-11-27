<script setup lang="ts">
import { useData } from 'vitepress';
import { computed } from 'vue';
import { useLang } from '../composables/lang';
import { useMenu } from '../composables/menu';

const { frontmatter } = useData()
const { wrapLinkWithLang } = useLang()
const menuName = computed(() => frontmatter.value.menu_name)
const { flattenedActiveMenu } = useMenu(menuName)
const activeMenuItemIdentifier = computed(() => frontmatter.value.menu[menuName.value]?.identifier)

const activeSidebarOptionIdx = computed(() => flattenedActiveMenu.value.findIndex(menuItem => menuItem.identifier === activeMenuItemIdentifier.value))

const nextOption = computed(() => {
  if (activeSidebarOptionIdx.value >= 0 && activeSidebarOptionIdx.value < flattenedActiveMenu.value.length - 1)
    return flattenedActiveMenu.value[activeSidebarOptionIdx.value + 1]
  else return undefined
})
const previousOption = computed(() => {
  if (activeSidebarOptionIdx.value > 0)
    return flattenedActiveMenu.value[activeSidebarOptionIdx.value - 1]
  else return undefined
})
</script>

<template>
  <footer class="ac-doc-footer is-flex is-justify-content-space-between">
    <a v-if="previousOption" class="ac-doc-footer-left button ac-button is-grey b-1 is-light gap-4" :href="wrapLinkWithLang(previousOption.url, true)">
      <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10" clip-rule="evenodd"/></svg></span>
      <span class="">{{ previousOption.name }}</span>
    </a>
    <div v-else />
    <a v-if="nextOption" class="ac-doc-footer-right button ac-button is-grey b-1 is-light gap-4" :href="wrapLinkWithLang(nextOption.url, true)">
      <span>{{ nextOption.name }}</span>
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20"><path fill="currentColor" fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10" clip-rule="evenodd"/></svg>
      </span>
    </a>
    <div v-else />
  </footer>
</template>

<style scoped lang="scss">
// .ac-doc-footer {
//   // border-top: 1px solid $color-border;
//   padding: 20px 10px;
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;

//   .ac-doc-footer-left, .ac-doc-footer-right {
//     padding: 10px;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-between;

//     .header {
//       font-size: 14px;
//       color: $primary-50;
//     }

//     .title {
//       margin-top: 10px;
//       font-size: 16px;
//       color: $primary-20;
//     }
//   }

//   .ac-doc-footer-left {
//     text-align: left;

//     .header {
//       i {
//         margin-right: 5px;
//       }
//     }
//   }

//   .ac-doc-footer-right {
//     text-align: right;

//     .header {
//       i {
//         margin-left: 5px;
//       }
//     }
//   }
// }
</style>
