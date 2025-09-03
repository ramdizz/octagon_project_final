import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: null,
		token: null,
		isAuthenticated: false,
		loading: false,
	}),
	actions: {
		async login(credentials) {
			this.loading = true
			try {
				const { $api } = useNuxtApp()
				if (!$api) throw new Error("$api не инициализирован")

				if (!credentials.email || !credentials.password) {
					throw new Error("Email и пароль обязательны")
				}

				const response = await $api.post("/auth/login", credentials)

				if (response.data.success) {
					this.token = response.data.data.token
					this.user = response.data.data.user
					this.isAuthenticated = true

					if (process.client) {
						localStorage.setItem("token", this.token)
					}

					return { success: true }
				} else {
					return { success: false, message: response.data.message }
				}
			} catch (error) {
				console.error("Ошибка входа:", error.response?.data || error.message)
				return {
					success: false,
					message:
						error.response?.data?.message || error.message || "Ошибка входа",
				}
			} finally {
				this.loading = false
			}
		},

		async register(userData) {
			this.loading = true
			try {
				const { $api } = useNuxtApp()
				const response = await $api.post("/auth/register", userData)

				if (response.data.success) {
					this.token = response.data.data.token
					this.user = response.data.data.user
					this.isAuthenticated = true

					if (process.client) {
						localStorage.setItem("token", this.token)
					}

					return { success: true }
				} else {
					return { success: false, message: response.data.message }
				}
			} catch (error) {
				console.error("Ошибка регистрации:", error)
				return {
					success: false,
					message: error.response?.data?.message || "Ошибка регистрации",
				}
			} finally {
				this.loading = false
			}
		},

		async fetchProfile() {
			if (!this.token) return

			try {
				const { $api } = useNuxtApp()
				const response = await $api.get("/auth/profile")

				if (response.data.success) {
					this.user = response.data.data.user
				}
			} catch (error) {
				console.error("Ошибка получения профиля:", error)
				this.logout()
			}
		},

		async updateProfile(profileData) {
			try {
				const { $api } = useNuxtApp()
				const response = await $api.put("/auth/profile", profileData)

				if (response.data.success) {
					this.user = response.data.data.user
					return { success: true }
				}
			} catch (error) {
				console.error("Ошибка обновления профиля:", error)
				return {
					success: false,
					message: error.response?.data?.message || "Ошибка обновления профиля",
				}
			}
		},

		logout() {
			this.user = null
			this.token = null
			this.isAuthenticated = false

			if (process.client) {
				localStorage.removeItem("token")
			}

			navigateTo("/login")
		},

		initializeAuth() {
			if (process.client) {
				const token = localStorage.getItem("token")
				if (token) {
					this.token = token
					this.isAuthenticated = true
					this.fetchProfile()
				}
			}
		},
	},
})
