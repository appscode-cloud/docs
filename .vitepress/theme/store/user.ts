import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetch } from '../plugins/fetch'

export const useUserStore = defineStore('user', () => {
  const user = ref()
  const userStatus = ref()

  async function fetchAndStoreUser() {
    userStatus.value = { phase: 'pending' }
    const { data, onFetchResponse, onFetchError } = useFetch('user').json()
    onFetchResponse(() => {
      user.value = data.value
      userStatus.value = { phase: 'success' }
    })
    onFetchError((error) => {
      userStatus.value = { phase: 'error', message: error }
    })
  }

  return { user, userStatus, fetchAndStoreUser }
})
