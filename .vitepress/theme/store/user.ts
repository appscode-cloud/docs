import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref()
  const userStatus = ref()

  return { user, userStatus }
})
