import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref()
  const userStatus = ref<{ phase: string; message?: string }>({
    phase: 'stale',
  })

  async function fetchAndStoreUser() {
    userStatus.value = { phase: 'pending' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!import.meta.env.SSR) {
      import('../plugins/fetch').then(({ useFetch }) => {
        // use code
        const { data, onFetchResponse, onFetchError } = useFetch('user').json()
        onFetchResponse(() => {
          user.value = data.value
          userStatus.value = { phase: 'success' }
        })
        onFetchError((error) => {
          userStatus.value = { phase: 'error', message: error }
        })
      })
    }
  }

  return { user, userStatus, fetchAndStoreUser }
})
