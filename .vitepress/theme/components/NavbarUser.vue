<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { useUserStore } from '../store/user';

const UserDropdown = defineAsyncComponent(() => import('@appscode/design-system/vue-components/v3/navbar/User.vue'))

const userStore = useUserStore()

// fetch and store user
let serverDomain = ''
let accountsDomain = ''
onMounted(() => {
  userStore.fetchAndStoreUser()
  import('../plugins/fetch').then(({ getServerDomain }) => {
    serverDomain = getServerDomain()
    accountsDomain = getServerDomain('accounts', '3000')
  })
})

const href = window.location
</script>

<template>
  <button v-if="userStore.userStatus.phase === 'pending'" class="button ac-button is-rounded is-loading" />
  <user-dropdown v-else-if="userStore.userStatus.phase === 'success'" :user="userStore.user" :show-account-switcher="false" :server-domain="serverDomain" :accounts-domain="accountsDomain" />
  <div v-else class="buttons px-4">
    <a class="button ac-button is-primary" :href="`${accountsDomain}/user/sign_up`">SIGN UP</a>
    <a class="button ac-button is-outlined is-primary" :href="`${accountsDomain}/user/login?redirect_to=${href}`">LOG IN</a>
  </div>
</template>

