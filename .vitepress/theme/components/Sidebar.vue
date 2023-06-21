<script setup lang="ts">
import { useData } from 'vitepress'
import { defineAsyncComponent } from 'vue'

defineEmits(['toggleSidebar'])

const Sidebar = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/Sidebar.vue'))
const SidebarHeader = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/SidebarHeader.vue'))
const SidebarBody = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/SidebarBody.vue'))
const SidebarFooter = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/sidebar/SidebarFooter.vue'))
const SidebarOptions = defineAsyncComponent(() => import('./SidebarOptions.vue'))
const { theme } = useData()
const { guide } = theme.value
</script>

<template>
  <sidebar>
    <template #sidebar-header>
      <sidebar-header brand-logo="https://cdn.appscode.com/images/products/bytebuilders/bytebuilders-white.png" @toggle-sidebar="$emit('toggleSidebar')" />
    </template>

    <template #sidebar-body>
      <sidebar-body>
        <sidebar-options :options="guide.sidebar" />
      </sidebar-body>
    </template>

    <template #sidebar-footer>
      <sidebar-footer :is-colorpicker-enabled="false" @toggle-sidebar="$emit('toggleSidebar')" />
    </template>
  </sidebar>
</template>
