<template>
	<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
		<h1 class="text-2xl font-bold mb-6">Вход</h1>
		<form
			@submit.prevent="handleLogin"
			class="space-y-4">
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
			<button
				type="submit"
				class="btn-primary w-full"
				:disabled="loading">
				{{ loading ? "Вход..." : "Войти" }}
			</button>
		</form>
		<p class="mt-4 text-center">
			Нет аккаунта?
			<NuxtLink
				to="/register"
				class="text-blue-600 hover:underline"
				>Зарегистрироваться</NuxtLink
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
	email: "",
	password: "",
})

const loading = ref(false)

const handleLogin = async () => {
	loading.value = true
	const result = await authStore.login(form.value)
	loading.value = false

	if (result.success) {
		router.push("/profile")
	} else {
		alert(result.message || "Ошибка входа")
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
