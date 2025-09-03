<template>
	<div class="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-10">
		<h1 class="text-3xl font-bold mb-6">Список вузов</h1>

		<div
			v-if="loading"
			class="text-center py-10">
			Загрузка данных...
		</div>

		<div
			v-else-if="error"
			class="text-red-600 text-center py-10">
			Ошибка загрузки: {{ error }}
		</div>

		<div v-else>
			<div
				v-if="universities.length === 0"
				class="text-center py-10 text-gray-600">
				Вузы не найдены.
			</div>

			<ul class="space-y-4">
				<li
					v-for="university in universities"
					:key="university._id"
					class="border p-4 rounded hover:shadow-md transition cursor-pointer"
					@click="goToUniversity(university._id)">
					<h2 class="text-xl font-semibold mb-1">{{ university.name }}</h2>
					<p class="text-gray-700 mb-1">{{ university.description }}</p>
					<p class="text-sm text-gray-500">Адрес: {{ university.address }}</p>
					<a
						v-if="university.website"
						:href="university.website"
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-600 hover:underline text-sm"
						@click.stop>
						Официальный сайт
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const universities = ref([])
const loading = ref(false)
const error = ref(null)
const router = useRouter()

const fetchUniversities = async () => {
	loading.value = true
	error.value = null
	try {
		const response = await fetch("http://localhost:5000/api/universities")
		if (!response.ok) throw new Error("Ошибка сети")
		const data = await response.json()
		if (data.success) {
			universities.value = data.universities
		} else {
			throw new Error(data.message || "Ошибка получения данных")
		}
	} catch (err) {
		error.value = err.message || "Ошибка загрузки"
	} finally {
		loading.value = false
	}
}

const goToUniversity = id => {
	router.push(`/universities/${id}`)
}

onMounted(() => {
	fetchUniversities()
})
</script>

<style scoped></style>
