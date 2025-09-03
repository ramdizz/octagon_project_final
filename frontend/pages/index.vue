<template>
	<div>
		<!-- Hero Section -->
		<section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
				<div class="text-center space-y-6">
					<h1 class="text-4xl md:text-6xl font-bold mb-6">
						Карьерный навигатор
					</h1>
					<p class="text-xl md:text-2xl max-w-3xl mx-auto">
						Ваш путь к успешной карьере начинается здесь. Соединяем
						абитуриентов, вузы и работодателей.
					</p>
					<div class="flex justify-center space-x-4">
						<BaseButton
							size="lg"
							@click="$router.push('/career-test')">
							Пройти тест
						</BaseButton>
						<BaseButton
							variant="outline"
							size="lg"
							@click="$router.push('/universities')">
							Найти вуз
						</BaseButton>
						<BaseButton
							size="lg"
							@click="goToEmployers">
							Вакансии работодателей
						</BaseButton>
					</div>
				</div>
			</div>
		</section>

		<!-- Features Section -->
		<section class="py-20 bg-gray-50">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="text-center items-center mb-16">
					<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Наши возможности
					</h2>
					<p class="text-xl text-gray-600 max-w-2xl mx-auto">
						Комплексная платформа для планирования образования и карьеры
					</p>
				</div>

				<div class="grid md:grid-cols-5 lg:grid-cols-5 gap-10">
					<div class="text-center cursor-default"></div>

					<NuxtLink
						to="/universities"
						class="text-center hover:shadow-lg rounded p-4 bg-white transition cursor-pointer">
						<div
							class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<BuildingLibraryIcon class="h-8 w-8 text-green-600" />
						</div>
						<h3 class="text-xl font-semibold mb-2">Поиск вузов</h3>
						<p class="text-gray-600">
							Найдите подходящие учебные программы и требования для поступления
						</p>
					</NuxtLink>

					<NuxtLink
						to="/employers"
						class="text-center hover:shadow-lg rounded p-4 bg-white transition cursor-pointer">
						<div
							class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<BriefcaseIcon class="h-8 w-8 text-purple-600" />
						</div>
						<h3 class="text-xl font-semibold mb-2">Вакансии работодателей</h3>
						<p class="text-gray-600">
							Размещайте вакансии и указывайте требования для трудоустройства
						</p>
					</NuxtLink>

					<NuxtLink
						to="/students"
						class="text-center hover:shadow-lg rounded p-4 bg-white transition cursor-pointer">
						<div
							class="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-yellow-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.73 6.879 1.98M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<h3 class="text-xl font-semibold mb-2">Выбор карьеры</h3>
						<p class="text-gray-600">Выберите карьеру своей мечты</p>
					</NuxtLink>

					<NuxtLink
						to="/career-test"
						class="text-center hover:shadow-lg rounded p-4 bg-white transition cursor-pointer">
						<div
							class="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
							<AcademicCapIcon class="h-8 w-8 text-indigo-600" />
						</div>
						<h3 class="text-xl font-semibold mb-2">Карьерные возможности</h3>
						<p class="text-gray-600">
							Изучите востребованные профессии и требования работодателей
						</p>
					</NuxtLink>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="py-20 bg-white">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
					Готовы начать свой путь?
				</h2>
				<p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
					Присоединяйтесь к тысячам студентов, которые уже нашли свое призвание
				</p>
			</div>
		</section>
	</div>
</template>

<script setup>
import {
	AcademicCapIcon,
	BuildingLibraryIcon,
	BriefcaseIcon,
} from "@heroicons/vue/24/outline"
import { useRouter } from "vue-router"

const router = useRouter()

definePageMeta({
	layout: "default",
})

useSeoMeta({
	title: "Карьерный навигатор - Ваш путь к успешной карьере",
	description:
		"Веб-ресурс для абитуриентов, вузов и работодателей. Профориентация, поиск вузов и карьерные возможности.",
})

const goToEmployers = () => {
	router.push("/employers")
}
</script>

<style scoped>
BaseButton {
	cursor: pointer;
	transition: all 0.3s ease;
}
BaseButton:hover {
	scale: 1.1;
	color: bisque;
}
</style>
