<script setup lang="ts">
import { defineClientComponent } from 'vitepress'
import { defineAsyncComponent } from 'vue'

const Navbar = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/navbar/Navbar.vue'))
const NavbarUser = defineClientComponent(() => import('./NavbarUser.vue')).setup()
const NavbarLanguageSwitcher = defineClientComponent(() => import('./NavbarLanguageSwitcher.vue')).setup()
</script>

<template>
  <navbar modifier-classes="is-light" :full-width="true">
    <template #navbar-brand-logo>
      <a href="/">
        <img src="https://cdn.appscode.com/images/products/bytebuilders/bytebuilders.png" alt="Bytebuilders Logo">
      </a>
      <span class="brand-extension">
        Docs
      </span>
    </template>
    <navbar-language-switcher />
    <navbar-user />
  </navbar>
</template>

<style lang="scss">
.ac-navbar-brand {
  .brand-extension {
    padding: 8px 0 0 5px;
    font-size: 15px;
    font-weight: 500;
    color: $primary-20;
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }
}
</style>
