<script setup lang="ts">
import { useData } from 'vitepress'
import { useLang } from '../composables/lang'

const { site } = useData()
const { locales } = site.value

const { wrapCurrentPageWithLang, activeLang } = useLang()
</script>

<template>
  <div v-if="activeLang" class="navbar-item has-dropdown is-hoverable lang-dropdown">
    <a class="navbar-link is-arrowless">
      <span>
        {{ activeLang.label }}
      </span>
    </a>

    <div class="navbar-dropdown is-boxed is-right">
      <a v-for="locale in Object.keys(locales)" :key="locale" class="navbar-item" :href="wrapCurrentPageWithLang(locale)" @click="$i18n.locale = locale">
        <span>{{ locales[locale].label }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lang-dropdown {
  .navbar-dropdown {
    width: 180px;

    .navbar-item {
      display: flex;
      align-items: center;

      span {
        display: block;
      }
    }
  }
}
</style>
