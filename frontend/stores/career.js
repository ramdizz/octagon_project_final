import { defineStore } from "pinia"

export const useCareerStore = defineStore("career", {
	state: () => ({
		tests: [],
		currentTest: null,
		testResults: [],
		loading: false,
	}),

	actions: {
		async fetchTests() {
			this.loading = true
			try {
				const { $api } = useNuxtApp()
				const response = await $api.get("/career-tests")

				if (response.data.success) {
					this.tests = response.data.data.tests
				}
			} catch (error) {
				console.error("Ошибка получения тестов:", error)
			} finally {
				this.loading = false
			}
		},

		async fetchTestById(id) {
			this.loading = true
			try {
				const { $api } = useNuxtApp()
				const response = await $api.get(`/career-tests/${id}`)

				if (response.data.success) {
					this.currentTest = response.data.data.test
					return { success: true }
				}
			} catch (error) {
				console.error("Ошибка получения теста:", error)
				return {
					success: false,
					message: error.response?.data?.message || "Ошибка получения теста",
				}
			} finally {
				this.loading = false
			}
		},

		async submitTestResult(testId, answers) {
			this.loading = true
			try {
				const { $api } = useNuxtApp()
				const response = await $api.post("/career-tests/submit", {
					testId,
					answers,
				})

				if (response.data.success) {
					return {
						success: true,
						data: response.data.data,
					}
				}
			} catch (error) {
				console.error("Ошибка отправки результата теста:", error)
				return {
					success: false,
					message:
						error.response?.data?.message || "Ошибка отправки результата",
				}
			} finally {
				this.loading = false
			}
		},

		async fetchUserTestResults() {
			this.loading = true
			try {
				const { $api } = useNuxtApp()
				const response = await $api.get("/career-tests/user/results")

				if (response.data.success) {
					this.testResults = response.data.data.results
				}
			} catch (error) {
				console.error("Ошибка получения результатов тестов:", error)
			} finally {
				this.loading = false
			}
		},
	},
})
