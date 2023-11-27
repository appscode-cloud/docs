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
    <a v-if="previousOption" class="ac-doc-footer-left button ac-button is-grey b-1  is-light" :href="wrapLinkWithLang(previousOption.url, true)">
      <span class=""><i class="fa fa-angle-left" />{{ previousOption.name }}</span>
    </a>
    <div v-else />
    <a v-if="nextOption" class="ac-doc-footer-right button ac-button is-grey b-1   is-light" :href="wrapLinkWithLang(nextOption.url, true)">
      <span class="">{{ nextOption.name }}<i class="fa fa-angle-right" /></span>
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
