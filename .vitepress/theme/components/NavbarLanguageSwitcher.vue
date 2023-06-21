<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useData } from 'vitepress'

const NavbarItem = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/navbar/NavbarItem.vue'))
const NavbarItemContent = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/navbar/NavbarItemContent.vue'))

const { site, page } = useData()

const { locales } = site.value
const activeLang = computed(() => {
  return site.value.locales[site.value.localeIndex as string]
})

function getLink(lang: string) {
  const [link] = page.value.relativePath.split('.')
  return `/${link.replace(activeLang.value.lang || '', locales[lang].lang || '')}`
}
</script>

<template>
  <div v-if="activeLang" class="navbar-item has-dropdown is-hoverable lang-dropdown">
    <a class="navbar-link is-arrowless">
      <span>
        {{ activeLang.label }}
      </span>
    </a>

    <div class="navbar-dropdown is-boxed is-right">
      <a v-for="locale in Object.keys(locales)" :key="locale" class="navbar-item" :href="getLink(locale)" @click="$i18n.locale = locale">
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
