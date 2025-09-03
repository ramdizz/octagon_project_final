<template>
	<div class="container mx-auto p-6 max-w-5xl">
		<h1 class="text-3xl font-bold mb-6">
			Карьерный навигатор для абитуриентов
		</h1>

		<!-- Поиск специальностей -->
		<input
			v-model="search"
			type="text"
			placeholder="Введите название специальности"
			class="border p-2 rounded w-full max-w-md mb-6"
			autocomplete="off" />

		<!-- Список специальностей -->
		<ul
			v-if="filteredSpecialties.length"
			class="mb-6 border rounded divide-y">
			<li
				v-for="spec in filteredSpecialties"
				:key="spec._id"
				class="p-3 cursor-pointer hover:bg-gray-100"
				:class="{
					'bg-blue-100 font-semibold':
						selectedSpecialty && selectedSpecialty._id === spec._id,
				}"
				@click="selectSpecialty(spec)">
				{{ spec.name }}
				<span class="text-sm text-gray-600"
					>(Востребованность: {{ spec.demand }})</span
				>
				<p class="text-gray-700 mt-1">{{ spec.educationalPaths.join(", ") }}</p>
			</li>
		</ul>
		<p
			v-else
			class="mb-6 text-gray-600">
			Специальности не найдены.
		</p>

		<!-- Планирование карьерной траектории -->
		<div
			v-if="selectedSpecialty"
			class="border rounded p-4">
			<h2 class="text-2xl font-semibold mb-4">
				Планирование траектории: {{ selectedSpecialty.name }}
			</h2>

			<textarea
				v-model="planNotes"
				placeholder="Добавьте заметки или цели по этой специальности"
				class="w-full border rounded p-2 mb-4"
				rows="4"></textarea>

			<button
				class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
				:disabled="isAdding || !planNotes.trim()"
				@click="addToCareerPlan">
				{{ isAdding ? "Добавление..." : "Добавить в карьерный план" }}
			</button>
		</div>

		<!-- Отображение карьерного плана -->
		<div
			v-if="careerPlan.length"
			class="mt-8 border rounded p-4">
			<h2 class="text-2xl font-semibold mb-4">Ваш карьерный план</h2>
			<ul class="divide-y">
				<li
					v-for="(item, index) in careerPlan"
					:key="item._id || index"
					class="py-2 flex justify-between items-center">
					<div>
						<p><strong>Специальность:</strong> {{ item.specialty.name }}</p>
						<p v-if="item.notes"><strong>Заметки:</strong> {{ item.notes }}</p>
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
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import axios from "axios"

const search = ref("")
const specialties = ref([])
const selectedSpecialty = ref(null)
const planNotes = ref("")
const careerPlan = ref([])

const isAdding = ref(false)
const isRemoving = ref(false)

function getAuthHeaders() {
	const token = localStorage.getItem("token")
	return token ? { Authorization: `Bearer ${token}` } : {}
}

async function fetchSpecialties() {
	try {
		const res = await axios.get("http://localhost:5000/api/specialties")
		specialties.value = res.data.specialties || res.data || []
	} catch (e) {
		console.error("Ошибка загрузки специальностей:", e)
		specialties.value = []
	}
}

const filteredSpecialties = computed(() => {
	if (!search.value.trim()) return specialties.value
	const lowerSearch = search.value.toLowerCase()
	return specialties.value.filter(spec =>
		spec.name.toLowerCase().includes(lowerSearch)
	)
})

function selectSpecialty(spec) {
	selectedSpecialty.value = spec
	planNotes.value = ""
}

async function fetchCareerPlan() {
	try {
		const res = await axios.get("http://localhost:5000/api/career-plan", {
			headers: getAuthHeaders(),
		})
		careerPlan.value = res.data.items || []
	} catch (e) {
		console.error("Ошибка загрузки карьерного плана:", e)
	}
}

async function addToCareerPlan() {
	if (!selectedSpecialty.value || !planNotes.value.trim()) return
	isAdding.value = true
	try {
		await axios.post(
			"http://localhost:5000/api/career-plan",
			{
				specialtyId: selectedSpecialty.value._id,
				notes: planNotes.value,
			},
			{ headers: getAuthHeaders() }
		)
		await fetchCareerPlan()
		planNotes.value = ""
		alert("Добавлено в карьерный план")
	} catch (e) {
		console.error("Ошибка добавления в карьерный план:", e)
		alert("Ошибка при добавлении")
	} finally {
		isAdding.value = false
	}
}

async function removeFromCareerPlan(itemId) {
	if (!itemId) return
	isRemoving.value = true
	try {
		await axios.delete(`http://localhost:5000/api/career-plan/${itemId}`, {
			headers: getAuthHeaders(),
		})
		await fetchCareerPlan()
	} catch (e) {
		console.error("Ошибка удаления из карьерного плана:", e)
		alert("Ошибка при удалении")
	} finally {
		isRemoving.value = false
	}
}

onMounted(() => {
	fetchSpecialties()
	fetchCareerPlan()
})
</script>

<style scoped>
.container {
	min-height: 80vh;
}
</style>
