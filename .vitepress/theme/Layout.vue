<script setup lang="ts">
import { useData, useRoute } from 'vitepress';
import { defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import Navbar from './components/Navbar.vue';

const Sidebar = defineAsyncComponent(() => import('./components/Sidebar.vue'))
const DocOutline = defineAsyncComponent(() => import('./components/DocOutline.vue'))
const DocFooter = defineAsyncComponent(() => import('./components/DocFooter.vue'))
// https://vitepress.dev/reference/runtime-api#usedata
const { frontmatter, page } = useData()
// set i18n local from path
const { path } = useRoute()
const [, lang] = path.split('/')
const { locale } = useI18n()
locale.value = lang
</script>

<template>
  <navbar />
  <div v-if="page.isNotFound">
    <div class="pt-60">
      404 not found page
    </div>
  </div>
  <div v-else-if="frontmatter.layout === 'home'">
    <div class="pt-60">
      <content />
    </div>
  </div>
  <div v-else-if="frontmatter.layout === 'guide'" class="ac-system-body is-terminal">
    <sidebar />
    <div class="content">
      <content class="content-body" />
      <doc-footer class="content-footer" />
    </div>
    <div class="toc">
      <doc-outline />
    </div>
  </div>
</template>
<style lang="scss">
.ac-left-sidebar {
  .menu-list {
    &.ac-menu-list {
      padding: 20px;
      padding-top: 16px !important;


      .menu-list {
        position: relative;

        &::after {
          position: absolute;
          content: "";
          left: 6px;
          top: 0;
          width: 1px;
          height: 100%;
          background-color: $color-border;
          z-index: -1;
        }
      }

     ul {
      li {
        position: relative;

        a {
          padding: 8px 15px 8px 24px;
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
      }
     }
    }
  }
}

.ac-system-body {
  grid-template-columns: 350px auto 350px !important;

  .ac-left-sidebar-wrapper {
    width: 350px;

    .sidebar-header {
      border-bottom: 1px solid $color-border !important;
    }

    .ac-left-sidebar .menu-list.ac-menu-list,
    .sidebar-footer {
      border-right: 1px solid $color-border;
    }
  }
}

.content {
  width: calc(100% - 120px);
  margin: 20px auto;

  .content-body {
    min-height: calc(100vh - 160px);
  }

}
</style>