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
    <div class=" content">
      <content class="content-body" />
      <doc-footer class="content-footer" />
    </div>
    <div class="toc">
      <doc-outline />
    </div>
  </div>
</template>
<style lang="scss">
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
    overflow: hidden;
    min-height: calc(100vh - 160px);

    h1 {
      font-size: 2rem;
      padding-bottom: 10px;
      line-height: 1.3;
    }

    h2 {
      font-size: 24px;
    }

    h3 {
      font-size: 18px;
    }

    h4 {
      font-size: 16px;
    }

    h5 {
      font-size: 15px;
    }

    h6 {
      font-size: 13px;
    }

    a {
      @extend .text-underline;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 40px;
      font-weight: 700;
      margin-bottom: 10px;

      &:first-child {
        margin-top: 0;
      }

      a {
        svg {
          padding-left: 10px;
        }

        font-size: 16px;

        &.hash-tag {
          opacity: 0;
          visibility: hidden;
          transition: 0.3s ease-in-out;
        }
      }

      &:hover a {
        opacity: 1;
        visibility: visible;
      }
    }

    img {
      padding: 20px;
      border: 1px solid $color-border;
      border-radius: 4px;
      margin-top: 8px;
    }


  }

}

.text-underline {
  font-weight: 500;
  position: relative;
  text-decoration: underline;

  &::after {
    position: absolute;
    content: "";
    left: 0;
    bottom: 0;
    width: 0;
    height: 2px;
    background: $ac-primary;
    border-radius: 50px;
    transition: 0.3s ease-in-out;
  }

  &:hover {
    &::after {
      width: 100%;
    }
  }
}
</style>