import axios from "axios"
import { useAuthStore } from "~/stores/auth"
import { getActivePinia } from "pinia"

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const pinia = nuxtApp.$pinia || getActivePinia()
  const authStore = useAuthStore(pinia)

  const api = axios.create({
    baseURL: config.public.apiBaseUrl || "http://localhost:5000/api",
  })

  api.interceptors.request.use(requestConfig => {
    if (authStore.token) {
      requestConfig.headers = requestConfig.headers || {}
      requestConfig.headers.Authorization = `Bearer ${authStore.token}`
    }
    return requestConfig
  })

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        authStore.logout()
      }
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      api,
    },
  }
})