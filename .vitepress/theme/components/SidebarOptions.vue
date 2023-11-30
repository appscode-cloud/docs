<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, nextTick, onBeforeUnmount, onMounted, watch, type WatchStopHandle } from 'vue';
import { useLang } from '../composables/lang';
import type { Sidebar } from '../composables/menu';

defineProps<{
  options: Sidebar
}>()

const { activeLinkWithoutLang, wrapLinkWithLang } = useLang()
const { frontmatter } = useData()
const activeMenuName = computed(() => frontmatter.value.menu_name)
const activeMenuItemIdentifier = computed(() => frontmatter.value.menu[activeMenuName.value]?.identifier)

let activeLinkWatcher: WatchStopHandle
onMounted(() => {
  activeLinkWatcher = watch(activeLinkWithoutLang, () => {
    nextTick(() => {
      const element = document?.querySelector('.menu li a.is-active')
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }, { immediate: true })
})
onBeforeUnmount(() => {
  activeLinkWatcher()
})
</script>

<template>
  <aside class="menu">
    <template v-for="item in options" :key="item.identifier">
      <template v-if="item.children">
        <p class="menu-label ac-menu-label">
          <span> {{ item.name }}</span>
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>

          </span>
        </p>
        <ul class="menu-list">
          <sidebar-options :options="item.children" />
        </ul>
      </template>
      <li v-else>
        <a :href="wrapLinkWithLang(item.url, true)"
          :class="{ 'is-active': activeMenuItemIdentifier === item.identifier }">{{ item.name }}</a>
      </li>
    </template>
  </aside>
</template>

<style lang="scss">
.ac-left-sidebar {
  // .menu-list.ac-menu-list {
  //   padding: 24px !important;
  // }

  .ac-menu-label {
    font-size: 1rem;
    font-weight: 500;
    color: $color-heading;
    letter-spacing: 1px;
    display: flex;
    justify-content: space-between;

    .icon {
     height: 16px;
     width: 16px;
     display: flex;
     align-items: center;
     color: #555;
     margin-right: 20px;
    }
  }

  .menu-label:not(:last-child) {
    margin-bottom: 0;
  }

  .menu-list {
    padding: 20px 0 20px 20px;
    padding-top: 16px !important;
    position: relative;

    p {
      padding-left: 24px;
    }

    a {
      padding: 8px 15px 8px 24px;
      font-weight: 400 !important;
      color: $color-text;

      &::after {
        width: 12px !important;
        height: 12px !important;
        top: 12px !important;
        left: 0 !important;
        background-color: $ac-primary !important;
        border: 1px solid $ac-primary !important;
        border-radius: 50% !important;
        opacity: 0;
      }

      &:hover {
        color: $ac-primary !important;
        padding-left: 32px;
      }

      &.is-active {
        color: $ac-primary !important;

        &::after {
          background-color: $ac-primary;
          border: 1px solid $ac-primary;
          opacity: 1;
        }
      }
    }

    &::after {
      position: absolute;
      content: "";
      left: 26px;
      top: 0;
      width: 1px;
      height: calc(100% - 16px);
      background-color: $color-border;
      z-index: -1;
    }

    ul {
      li {
        position: relative;


      }
    }
  }
}
</style>
