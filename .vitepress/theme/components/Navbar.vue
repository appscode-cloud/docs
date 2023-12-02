<script setup lang="ts">
import { defineClientComponent } from 'vitepress';
import { defineAsyncComponent } from 'vue';

const Navbar = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/navbar/Navbar.vue'))
const NavbarMenu = defineAsyncComponent(() => import('./NavbarMenu.vue'))
const NavbarUser = defineClientComponent(() => import('./NavbarUser.vue')).setup()
// const NavbarLanguageSwitcher = defineClientComponent(() => import('./NavbarLanguageSwitcher.vue')).setup()
// const DocSearch = defineClientComponent(() => import('./DocSearch.vue')).setup()

// const { theme } = useData()
// const showSearchbar = !!theme.value.meilisearch
</script>

<template>
  <navbar modifier-classes="is-light" :full-width="true">
    <template #navbar-brand-logo>
      <a href="/" class="is-flex">
        <img src="https://cdn.appscode.com/images/products/appscode/appscode.png" alt="AppsCode Logo">
      </a>
      <!-- <span class="brand-extension">
        Docs
      </span> -->

      <div class="responsive-menu is-hidden-desktop">
        <label for="check">
          <input type="checkbox" id="check" />
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>
    </template>
    <navbar-menu />
    <template #navbar-cluster-switcher>
      <!-- <doc-search v-if="showSearchbar" /> -->
    </template>
    <!-- <navbar-language-switcher /> -->
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

.responsive-menu {
  position: fixed;
  right: 0;

  label {
    display: flex;
    flex-direction: column;
    width: 70px;
    cursor: pointer;
    transform: rotate(180deg) scale(0.4);
  }

  label span {
    background: $color-text;
    border-radius: 10px;
    height: 7px;
    margin: 7px 0;
    transition: .4s cubic-bezier(0.68, -0.6, 0.32, 1.6);

  }


  span:nth-of-type(1) {
    width: 50%;

  }

  span:nth-of-type(2) {
    width: 100%;
  }


  span:nth-of-type(3) {
    width: 75%;

  }


  input[type="checkbox"] {
    display: none;
  }


  input[type="checkbox"]:checked~span:nth-of-type(1) {
    transform-origin: bottom;
    transform: rotatez(45deg) translate(8px, 0px)
  }


  input[type="checkbox"]:checked~span:nth-of-type(2) {

    transform-origin: top;
    transform: rotatez(-45deg)
  }


  input[type="checkbox"]:checked~span:nth-of-type(3) {

    transform-origin: bottom;
    width: 50%;
    transform: translate(30px, -11px) rotatez(45deg);

  }
}

</style>
