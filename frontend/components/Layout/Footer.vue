<template>
	<footer class="bg-gray-100 text-gray-600 py-6 mt-12">
		<div
			class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
			<p class="text-sm">
				&copy; {{ currentYear }} Карьерный навигатор. Все права защищены.
			</p>
			<nav class="mt-4 md:mt-0 space-x-4">
				<NuxtLink
					to="/"
					class="hover:text-gray-900 transition"
					>Главная</NuxtLink
				>
				<NuxtLink
					to="/employers"
					class="hover:text-gray-900 transition"
					>Вакансии</NuxtLink
				>
				<NuxtLink
					to="/universities"
					class="hover:text-gray-900 transition"
					>Вузы</NuxtLink
				>
				<NuxtLink
					to="/career-test"
					class="hover:text-gray-900 transition"
					>Тесты</NuxtLink
				>
			</nav>
		</div>
	</footer>
</template>

<script setup>
import { ref } from "vue"

const currentYear = new Date().getFullYear()
</script>

<style scoped>
/* Дополнительные стили, если нужны */
</style>
