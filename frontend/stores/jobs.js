import { defineStore } from "pinia"
import { useNuxtApp } from "#app"

export const useJobsStore = defineStore("jobs", {
	state: () => ({
		jobs: [],
	}),
	actions: {
		async fetchMyJobs() {
			try {
				const { $api } = useNuxtApp()
				const response = await $api.get("/jobs/my")
				if (response.data.success) {
					this.jobs = response.data.jobs.map(job => ({
						...job,
						requirements: {
							education: job.requirements?.education || "",
							competencies: job.requirements?.competencies || [],
							egeRequirements: job.requirements?.egeRequirements || [],
						},
					}))
					return { success: true }
				} else {
					return { success: false, message: response.data.message }
				}
			} catch (error) {
				console.error("Ошибка загрузки вакансий:", error)
				return { success: false, message: error.message || "Ошибка сети" }
			}
		},

		async createJob(jobData) {
			try {
				const { $api } = useNuxtApp()
				const response = await $api.post("/jobs", jobData)
				if (response.data.success) {
					// Добавляем новую вакансию в начало списка
					this.jobs.unshift({
						...response.data.job,
						requirements: {
							education: response.data.job.requirements?.education || "",
							competencies: response.data.job.requirements?.competencies || [],
							egeRequirements:
								response.data.job.requirements?.egeRequirements || [],
						},
					})
					return { success: true }
				} else {
					return { success: false, message: response.data.message }
				}
			} catch (error) {
				console.error("Ошибка создания вакансии:", error)
				return { success: false, message: error.message || "Ошибка сети" }
			}
		},
	},
})
