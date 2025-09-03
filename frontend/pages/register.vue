<template>
	<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
		<h1 class="text-2xl font-bold mb-6">Регистрация</h1>
		<form
			@submit.prevent="handleRegister"
			class="space-y-4">
			<input
				v-model="form.firstName"
				type="text"
				placeholder="Имя"
				required
				class="input" />
			<input
				v-model="form.lastName"
				type="text"
				placeholder="Фамилия"
				required
				class="input" />
			<input
				v-model="form.email"
				type="email"
				placeholder="Email"
				required
				class="input" />
			<input
				v-model="form.password"
				type="password"
				placeholder="Пароль"
				required
				class="input" />
			<select
				v-model="form.role"
				required
				class="input">
				<option
					disabled
					value="">
					Выберите роль
				</option>
				<option value="student">Абитуриент</option>
				<option value="university">Вуз</option>
				<option value="employer">Работодатель</option>
			</select>
			<button
				type="submit"
				class="btn-primary w-full">
				Зарегистрироваться
			</button>
		</form>
		<p class="mt-4 text-center">
			Уже есть аккаунт?
			<NuxtLink
				to="/login"
				class="text-blue-600 hover:underline"
				>Войти</NuxtLink
			>
		</p>
	</div>
</template>

<script setup>
import { ref } from "vue"
import { useAuthStore } from "~/stores/auth"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	role: "",
})

const handleRegister = async () => {
	const result = await authStore.register(form.value)
	if (result.success) {
		router.push("/profile")
	} else {
		alert(result.message || "Ошибка регистрации")
	}
}
</script>

<style scoped>
.input {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 0.375rem;
}
.btn-primary {
	background-color: #3b82f6;
	color: white;
	padding: 0.75rem;
	border-radius: 0.375rem;
	font-weight: 600;
}
</style>
