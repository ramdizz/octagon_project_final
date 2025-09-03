<template>
	<div class="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
		<h1 class="text-3xl font-bold mb-6">Профиль пользователя</h1>

		<div v-if="loading">Загрузка профиля...</div>

		<div
			v-else-if="error"
			class="text-red-600">
			{{ error }}
		</div>

		<div v-else-if="user">
			<p><strong>Имя:</strong> {{ user.firstName }} {{ user.lastName }}</p>
			<p><strong>Email:</strong> {{ user.email }}</p>
			<p><strong>Роль:</strong> {{ user.role }}</p>

			<!-- Карьерный план -->
			<div
				class="mt-8"
				v-if="careerPlan.length">
				<h2 class="text-2xl font-semibold mb-4">Ваш карьерный план</h2>
				<ul class="divide-y border rounded">
					<li
						v-for="item in careerPlan"
						:key="item._id"
						class="flex justify-between items-center p-4">
						<div>
							<p><strong>Специальность:</strong> {{ item.specialty.name }}</p>
							<p v-if="item.notes">
								<strong>Заметки:</strong> {{ item.notes }}
							</p>
						</div>
						<button
							class="text-red-600 hover:underline"
							:disabled="isRemoving"
							@click="removeFromCareerPlan(item._id)">
							{{ isRemoving ? "Удаление..." : "Удалить" }}
						</button>
					</li>
				</ul>
			</div>

			<div
				v-else
				class="mt-8 text-gray-600">
				Карьерный план пуст.
			</div>
		</div>

		<div v-else>Профиль не найден.</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { useAuthStore } from "~/stores/auth"

const authStore = useAuthStore()
const user = ref(null)
const loading = ref(false)
const error = ref(null)

const careerPlan = ref([])
const isRemoving = ref(false)

// Загрузка профиля пользователя
const loadProfile = async () => {
	loading.value = true
	error.value = null
	try {
		if (authStore.user) {
			user.value = authStore.user
		} else {
			await authStore.fetchProfile()
			user.value = authStore.user
		}
	} catch (e) {
		error.value = "Ошибка загрузки профиля"
	} finally {
		loading.value = false
	}
}

// Загрузка карьерного плана пользователя
const fetchCareerPlan = async () => {
	try {
		const token = localStorage.getItem("token")
		const res = await axios.get("http://localhost:5000/api/career-plan", {
			headers: { Authorization: `Bearer ${token}` },
		})
		careerPlan.value = res.data.items || []
	} catch (e) {
		console.error("Ошибка загрузки карьерного плана:", e)
	}
}

// Удаление одного элемента из карьерного плана
async function removeFromCareerPlan(itemId) {
	if (!itemId) return
	isRemoving.value = true
	try {
		const token = localStorage.getItem("token")
		await axios.delete(`http://localhost:5000/api/career-plan/${itemId}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		await fetchCareerPlan()
	} catch (e) {
		console.error("Ошибка удаления из карьерного плана:", e)
		alert("Ошибка при удалении")
	} finally {
		isRemoving.value = false
	}
}

onMounted(async () => {
	await loadProfile()
	await fetchCareerPlan()
})
</script>

<style scoped>
/* Добавьте стили по желанию */
</style>
