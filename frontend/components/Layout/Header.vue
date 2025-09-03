<template>
	<header class="bg-white shadow-sm">
		<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<!-- Logo -->
				<div class="flex items-center">
					<NuxtLink
						to="/"
						class="text-2xl font-bold text-blue-600">
						Карьерный навигатор
					</NuxtLink>
				</div>

				<!-- Navigation -->
				<div class="hidden md:flex items-center space-x-8">
					<NuxtLink
						to="/career-test"
						class="text-gray-700 hover:text-blue-600">
						Тесты
					</NuxtLink>
					<NuxtLink
						to="/universities"
						class="text-gray-700 hover:text-blue-600">
						Вузы
					</NuxtLink>
					<NuxtLink
						to="/employers"
						class="text-gray-700 hover:text-blue-600">
						Работодатели
					</NuxtLink>
				</div>

				<!-- User Menu -->
				<div class="flex items-center space-x-4">
					<div
						v-if="authStore.isAuthenticated"
						class="relative">
						<button
							@click="showUserMenu = !showUserMenu"
							class="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
							<span>{{ authStore.user?.firstName }}</span>
							<ChevronDownIcon class="h-4 w-4" />
						</button>

						<div
							v-if="showUserMenu"
							class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
							<NuxtLink
								to="/profile"
								class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								@click="showUserMenu = false">
								Профиль
							</NuxtLink>
							<button
								@click="handleLogout"
								class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
								Выйти
							</button>
						</div>
					</div>

					<div
						v-else
						class="space-x-2">
						<BaseButton
							variant="outline"
							size="sm"
							@click="$router.push('/login')">
							Войти
						</BaseButton>
						<BaseButton
							size="sm"
							@click="$router.push('/register')">
							Регистрация
						</BaseButton>
					</div>
				</div>
			</div>
		</nav>
	</header>
</template>

<script setup>
import { ref } from "vue"
import { onClickOutside } from "@vueuse/core"

const authStore = useAuthStore()
const showUserMenu = ref(false)

const handleLogout = () => {
	authStore.logout()
	showUserMenu.value = false
}

// Закрытие меню при клике вне его
onClickOutside(showUserMenu, () => {
	showUserMenu.value = false
})
</script>
