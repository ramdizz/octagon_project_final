<template>
	<div class="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
		<h2 class="text-2xl font-bold mb-4">Добавить работодателя</h2>
		<form @submit.prevent="submitEmployer">
			<!-- Поля для создания работодателя -->
			<label class="block mb-2 font-semibold">Название компании *</label>
			<input
				v-model="name"
				type="text"
				required
				placeholder="Введите название компании"
				class="input" />

			<label class="block mt-4 mb-2 font-semibold">Описание компании</label>
			<textarea
				v-model="companyDescription"
				placeholder="Введите описание деятельности компании"
				class="textarea"></textarea>

			<label class="block mt-4 mb-2 font-semibold">Индустрия *</label>
			<input
				v-model="industry"
				type="text"
				required
				placeholder="Например, IT, Строительство"
				class="input" />

			<h3 class="text-lg font-semibold mt-6 mb-2">Контактная информация</h3>

			<label class="block mt-2 mb-1 font-semibold">Email</label>
			<input
				v-model="contact.email"
				type="email"
				placeholder="contact@company.ru"
				class="input" />

			<label class="block mt-3 mb-1 font-semibold">Телефон</label>
			<input
				v-model="contact.phone"
				type="tel"
				placeholder="+7 XXX XXX XX XX"
				class="input" />

			<label class="block mt-3 mb-1 font-semibold">Адрес</label>
			<input
				v-model="contact.address"
				type="text"
				placeholder="Город, улица, дом"
				class="input" />

			<button
				type="submit"
				class="btn btn-primary mt-6"
				:disabled="loading">
				{{ loading ? "Сохраняем..." : "Добавить работодателя" }}
			</button>

			<p
				v-if="error"
				class="text-red-600 mt-4">
				{{ error }}
			</p>
			<p
				v-if="success"
				class="text-green-600 mt-4">
				{{ success }}
			</p>
		</form>

		<section class="mt-10">
			<h2 class="text-2xl font-bold mb-4">Список работодателей</h2>
			<div v-if="employersLoading">Загрузка данных...</div>
			<div
				v-else-if="employersError"
				class="text-red-600">
				{{ employersError }}
			</div>
			<ul v-else>
				<li
					v-for="employer in employers"
					:key="employer._id"
					class="mb-4 p-4 border rounded bg-gray-50">
					<h3 class="text-lg font-semibold">{{ employer.name }}</h3>
					<p>
						<strong>Описание:</strong>
						{{ employer.description || "Отсутствует" }}
					</p>
					<p>
						<strong>Индустрия:</strong> {{ employer.industry || "Не указана" }}
					</p>
					<div v-if="employer.contact">
						<p>
							<strong>Email:</strong>
							{{ employer.contact.email || "Не указан" }}
						</p>
						<p>
							<strong>Телефон:</strong>
							{{ employer.contact.phone || "Не указан" }}
						</p>
						<p>
							<strong>Адрес:</strong>
							{{ employer.contact.address || "Не указан" }}
						</p>
					</div>
					<p>
						<strong>Статус:</strong>
						{{ employer.isActive ? "Активен" : "Неактивен" }}
					</p>
					<p class="text-sm text-gray-500 mt-2">
						Добавлен: {{ new Date(employer.createdAt).toLocaleDateString() }}
					</p>
					<button
						@click="deleteEmployer(employer._id)"
						class="btn btn-danger ml-4 self-start"
						:disabled="deleteLoading[employer._id]"
						title="Удалить работодателя">
						{{ deleteLoading[employer._id] ? "Удаление..." : "Удалить" }}
					</button>
				</li>
			</ul>
		</section>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import axios from "axios"

// Поля для создания работодателя
const name = ref("")
const companyDescription = ref("")
const industry = ref("")
const contact = ref({
	email: "",
	phone: "",
	address: "",
})

const loading = ref(false)
const error = ref("")
const success = ref("")

// Список работодателей
const employers = ref([])
const employersLoading = ref(false)
const employersError = ref("")

// Объект для отслеживания загрузки удаления по id работодателя
const deleteLoading = reactive({})

// Функция создания работодателя
async function submitEmployer() {
	error.value = ""
	success.value = ""

	if (!name.value.trim() || !industry.value.trim()) {
		error.value =
			"Пожалуйста, заполните обязательные поля (Название и Индустрия)"
		return
	}

	loading.value = true
	try {
		const token = localStorage.getItem("token")
		if (!token) throw new Error("Токен авторизации отсутствует")

		const payload = {
			name: name.value.trim(),
			description: companyDescription.value.trim(),
			industry: industry.value.trim(),
			contact: {
				email: contact.value.email.trim(),
				phone: contact.value.phone.trim(),
				address: contact.value.address.trim(),
			},
		}

		await axios.post("http://localhost:5000/api/employers", payload, {
			headers: { Authorization: `Bearer ${token}` },
		})

		success.value = "Работодатель успешно добавлен!"

		// Очистка формы
		name.value = ""
		companyDescription.value = ""
		industry.value = ""
		contact.value = { email: "", phone: "", address: "" }

		await fetchEmployers()
	} catch (e) {
		error.value =
			e.response?.data?.message ||
			e.message ||
			"Ошибка при добавлении работодателя."
	} finally {
		loading.value = false
	}
}

// Функция загрузки списка работодателей
async function fetchEmployers() {
	employersLoading.value = true
	employersError.value = ""
	try {
		const token = localStorage.getItem("token")
		if (!token) throw new Error("Токен авторизации отсутствует")

		const response = await axios.get("http://localhost:5000/api/employers", {
			headers: { Authorization: `Bearer ${token}` },
		})

		employers.value = response.data.employers || []
	} catch (e) {
		employersError.value =
			e.response?.data?.message ||
			e.message ||
			"Ошибка при загрузке работодателей."
	} finally {
		employersLoading.value = false
	}
}

// Функция удаления работодателя
async function deleteEmployer(id) {
	if (!confirm("Вы уверены, что хотите удалить этого работодателя?")) return

	deleteLoading[id] = true
	try {
		const token = localStorage.getItem("token")
		if (!token) throw new Error("Токен авторизации отсутствует")

		await axios.delete(`http://localhost:5000/api/employers/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		})

		await fetchEmployers()
	} catch (e) {
		alert(
			e.response?.data?.message ||
				e.message ||
				"Ошибка при удалении работодателя."
		)
	} finally {
		deleteLoading[id] = false
	}
}

onMounted(() => {
	fetchEmployers()
})
</script>

<style scoped>
.input {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 4px;
	margin-bottom: 0.5rem;
}
.textarea {
	width: 100%;
	height: 100px;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}
.btn-primary {
	background-color: #2563eb;
	color: white;
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}
.btn-primary:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}
.btn-danger {
	background-color: #dc2626;
	color: white;
	padding: 0.5rem 1rem;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}
.btn-danger:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}
</style>
