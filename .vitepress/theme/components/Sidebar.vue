<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed, defineAsyncComponent } from 'vue'
import { useMenu } from '../composables/menu'

defineEmits(['toggleSidebar'])

const Sidebar = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/Sidebar.vue'))
const SidebarBody = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/SidebarBody.vue'))
const SidebarFooter = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/SidebarFooter.vue'))
const SidebarOptions = defineAsyncComponent(() => import('./SidebarOptions.vue'))

const { frontmatter } = useData()
const menuName = computed(() => frontmatter.value.menu_name)
const { activeMenu } = useMenu(menuName)
</script>

<template>
  <sidebar :sidebar-light="true">
    <template #sidebar-header>
      <div class="sidebar-header">
        <!-- brand logo  -->
        <a class="is-flex brand-logo" :href="withBase('/')">
          <img src="https://cdn.appscode.com/images/products/appscode/appscode.svg" alt="appscode-logo">
        </a>
        <!-- <span class="brand-extension">
          Docs
        </span> -->
        <!-- brand logo  -->
      </div>
    </template>

    <template #sidebar-body>
      <sidebar-body>
        <sidebar-options :options="activeMenu" />
      </sidebar-body>
    </template>

    <template #sidebar-footer>
      <sidebar-footer :is-colorpicker-enabled="false" :hide-footer="true" @toggle-sidebar="$emit('toggleSidebar')" />
    </template>
  </sidebar>
</template>
