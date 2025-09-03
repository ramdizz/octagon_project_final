import viteTsconfigPaths from "vite-tsconfig-paths"
export default defineNuxtConfig({
	compatibilityDate: "2025-05-15",
	devtools: { enabled: true },
	vite: {
		plugins: [viteTsconfigPaths()],
	},
	runtimeConfig: {
		public: {
			apiBase: "http://localhost:5000/api",
		},
	},

	// Подключение модулей
	modules: [
		"@pinia/nuxt", // Pinia для управления состоянием
		"@nuxtjs/tailwindcss", // Tailwind CSS для стилей
	],

	// Глобальные CSS-файлы
	css: ["./assets/css/main.css"],

	// Конфигурация приложения
	app: {
		baseURL: "/", // Базовый URL приложения
		head: {
			title: "Карьерный навигатор",
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{
					hid: "description",
					name: "description",
					content: "Веб-ресурс для абитуриентов, вузов и работодателей",
				},
			],
			link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		},
	},

	// Автоматическая регистрация компонентов
	components: true,

	// Настройки сборки (опционально)
	build: {
		transpile: [], // сюда можно добавить пакеты, которые нужно транспилировать
	},
})
