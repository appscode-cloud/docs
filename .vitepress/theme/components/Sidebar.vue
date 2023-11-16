<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { defineAsyncComponent } from 'vue'

defineEmits(['toggleSidebar'])

const Sidebar = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/Sidebar.vue'))
const SidebarBody = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/SidebarBody.vue'))
const SidebarFooter = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/SidebarFooter.vue'))
const SidebarOptions = defineAsyncComponent(() => import('./SidebarOptions.vue'))
const data = useData()
const { navigation } = data.theme.value
</script>

<template>
  <sidebar>
    <template #sidebar-header>
      <div class="sidebar-header">
        <!-- brand logo  -->
        <a class="is-flex brand-logo" :href="withBase('/')">
          <img src="https://cdn.appscode.com/images/products/appscode/appscode-white.png" alt="appscode-logo">
        </a>
        <span class="brand-extension">
          Docs
        </span>
        <!-- brand logo  -->
      </div>
    </template>

    <template #sidebar-body>
      <sidebar-body>
        <client-only>
          <sidebar-options :options="navigation.sidebar" />
        </client-only>
      </sidebar-body>
    </template>

    <template #sidebar-footer>
      <sidebar-footer :is-colorpicker-enabled="false" :hide-footer="true" @toggle-sidebar="$emit('toggleSidebar')" />
    </template>
  </sidebar>
</template>

<style lang="scss" scoped>
.sidebar-header {
  background-color: transparent;
  border-bottom: 1px solid #2f5473;
  height: 50px;
  display: flex;

  // justify-content: space-between;
  padding: 8px 20px;
  align-items: center;

  .hamburger-icon {
    cursor: pointer;
    position: relative;
    z-index: 1;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &::after {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgb(255 255 255 / 10%);
      opacity: 0;
      visibility: hidden;
      transition: 0.3s ease-in-out;
    }

    &:hover {
      &::after {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .brand-logo {
    display: flex;
    align-items: center;

    img {
      height: 30px;
    }
  }

  .brand-extension {
    padding: 10px 0 0 5px;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }
}

.sidebar-collapsed .ac-left-sidebar-wrapper {
  .brand-logo {
    display: none !important;
  }

  .sidebar-header {
    justify-content: center;
    padding: 10px;

    .hamburger-icon {
      margin-right: 0 !important;
    }
  }
}
</style>
