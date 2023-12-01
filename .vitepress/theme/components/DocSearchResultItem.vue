<script setup lang="ts">
import { useLang } from '../composables/lang'

defineProps<{
  title: string
  url: string
  text: string
}>()

const { wrapLinkWithLang } = useLang()
</script>

<template>
  <div class="single-result-item">
    <h2><a :href="wrapLinkWithLang(url)" v-html="title" /></h2>
    <p class="is-ellipsis-2" v-html="text" />
  </div>
</template>

<style lang="scss">
// .single-result-item {
//   padding: 16px 32px;
//   transition: .3s ease-in-out;
//   border-bottom: 1px solid #dbdbde;

//   h2,
//   p {
//     font-family: Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//     font-style: normal;
//   }

//   h2 {
//     font-weight: 500;
//     font-size: 16px;
//     line-height: 130%;
//     color: var(--ac-primary);
//   }

//   p {
//     font-weight: 400;
//     font-size: 13px;
//     line-height: 150%;
//     color: #3e393e;
//   }

//   em {
//     background: #e6e7e9;
//     padding: 2px 4px;
//     font-style: normal;
//     color: var(--ac-primary);
//     border-radius: 2px;
//     font-size: 90%;
//     font-weight: 500;
//   }
// }
</style>
