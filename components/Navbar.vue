<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const Navbar = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/navbar/Navbar.vue'))

</script>
<template>
  <navbar modifier-classes="is-light" :full-width="true">
    <template #navbar-brand-logo>
      <router-link to="/">
        <img src="https://cdn.appscode.com/images/products/bytebuilders/bytebuilders.png" alt="Bytebuilders Logo">
      </router-link>
      <span class="brand-extension">
        Docs
      </span>
    </template>
  </navbar>
</template>

<style lang="scss">
.ac-navbar-brand {
  .brand-extension {
    padding: 8px 0 0 5px;
    font-size: 15px;
    font-weight: 500;
    color: $primary-20;
    font-family: Roboto;
  }
}
</style>
