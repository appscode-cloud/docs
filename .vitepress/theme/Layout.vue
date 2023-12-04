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
    <div class="pt-50">
      404 not found page
    </div>
  </div>
  <div v-else-if="frontmatter.layout === 'home'">
    <div class="pt-50">
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

  @media (width >=  0) and (width <= 1215px) {
    grid-template-columns: 300px auto 260px !important;

    .ac-left-sidebar-wrapper {
      width: 300px !important;
    }

    .content {
      width: calc(100% - 30px);
      
     ul, ol {
      pre {
          // max-width: 600px !important;
         
      }
     }
    }
  }

  @media (width >=  0) and (width <= 768px) {
    grid-template-columns: 200px auto 200px !important;

    .ac-left-sidebar-wrapper {
      width: 200px !important;
    }

    .content {
      ul, ol {
        pre {
          max-width: 500px;
        }
      }
    }
  }


  @media (width >=  769px) and (width <= 1215px) {
    grid-template-columns: 250px auto 250px !important;

    .ac-left-sidebar-wrapper {
      width: 250px !important;
    }

    .content {
      ul, ol {
        pre {
          max-width: 500px;
        }
      }
    }
  }

  @media (width >=  1216px) and (width <= 1407px) {
    grid-template-columns: 270px auto 270px !important;

    .ac-left-sidebar-wrapper {
      width: 270px !important;
    }

    .content {
      ul, ol {
        pre {
          max-width: 700px;
        }
      }
    }
  }


  .ac-left-sidebar-wrapper {
    z-index: 9 !important;
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

  div[class*="language-"] {
    position: relative;
    margin-bottom: 8px;

    &:hover {
      .copy{
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .lang {
    position: absolute;
    right: 8px;
    top: 8px;
    color: $color-text;
  }

  .copy {
    position: absolute;
    right: 4px;
    top: 4px;
    z-index: 99;
    width: 40px;
    height: 40px;
    padding: 10px;
    background-repeat: no-repeat;
    border: 1px solid $color-border;
    background-color: $white-100;
    background-position: 50%;
    cursor: pointer;
    border-radius: 4px;
    background-size: 20px;
    transition: 0.3s ease-in-out;
    background-image: url("https://api.iconify.design/heroicons:clipboard.svg");
    opacity: 0;
    visibility: hidden;

    &:hover {
      border: 1px solid $ac-primary;
    }

    &.copied {
      background-image: url("https://api.iconify.design/heroicons:clipboard-document-check.svg");
    }
  }

  pre {
    border-radius: 4px;
  }

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