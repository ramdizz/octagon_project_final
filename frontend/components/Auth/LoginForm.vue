<template>
	<div
		class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<div>
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Вход в систему
				</h2>
				<p class="mt-2 text-center text-sm text-gray-600">
					Или
					<NuxtLink
						to="/register"
						class="font-medium text-blue-600 hover:text-blue-500">
						зарегистрируйтесь
					</NuxtLink>
				</p>
			</div>

			<form
				class="mt-8 space-y-6"
				@submit.prevent="handleSubmit">
				<div class="rounded-md shadow-sm -space-y-px">
					<div>
						<label
							for="email"
							class="sr-only"
							>Email</label
						>
						<input
							id="email"
							v-model="form.email"
							name="email"
							type="email"
							autocomplete="email"
							required
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
							placeholder="Email адрес" />
					</div>
					<div>
						<label
							for="password"
							class="sr-only"
							>Пароль</label
						>
						<input
							id="password"
							v-model="form.password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
							placeholder="Пароль" />
					</div>
				</div>

				<div
					v-if="error"
					class="text-red-600 text-sm text-center">
					{{ error }}
				</div>

				<div>
					<BaseButton
						type="submit"
						:loading="loading"
						full-width>
						Войти
					</BaseButton>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
definePageMeta({
	middleware: "guest",
	layout: "auth",
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
	email: "",
	password: "",
})

const error = ref("")
const loading = ref(false)

const handleSubmit = async () => {
	error.value = ""
	loading.value = true

	const result = await authStore.login(form)

	if (result.success) {
		await router.push("/profile")
	} else {
		error.value = result.message
	}

	loading.value = false
}
</script>
