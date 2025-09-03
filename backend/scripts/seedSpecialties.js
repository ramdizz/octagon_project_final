const mongoose = require("mongoose")
const Specialty = require("../src/models/Specialty")

const specialtiesData = [
	{
		name: "Информационные технологии",
		demand: 95,
		educationalPaths: [
			"Программирование",
			"Системное администрирование",
			"Анализ данных",
		],
	},
	{
		name: "Экономика",
		demand: 80,
		educationalPaths: ["Финансы и кредит", "Бухгалтерский учет", "Маркетинг"],
	},
	{
		name: "Медицина",
		demand: 90,
		educationalPaths: ["Лечебное дело", "Стоматология", "Фармация"],
	},
	{
		name: "Инженерия",
		demand: 85,
		educationalPaths: ["Механика", "Электротехника", "Строительство"],
	},
	{
		name: "Веб-Разработка",
		demand: 95,
		educationalPaths: ["Дизайн", "Инженерия", "Проектирование"],
	},
	{
		name: "Программирование",
		demand: 90,
		educationalPaths: ["Разработка", "Машинный код", "Проектирование"],
	},
	{
		name: "Тестирование",
		demand: 80,
		educationalPaths: ["Математика", "Машинный код", "Коммуникация"],
	},
	{
		name: "Руководитель",
		demand: 80,
		educationalPaths: ["Обучение", "Деловое общение", "Коммуникация"],
	},
	{
		name: "Учитель",
		demand: 80,
		educationalPaths: ["Высшая математика", "Обучение", "Коммуникация"],
	},
]

async function seed() {
	try {
		await mongoose.connect("mongodb://localhost:27017/career-navigator", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log("Подключено к базе данных")

		// Очистим коллекцию, если нужно
		await Specialty.deleteMany({})

		// Вставим данные
		await Specialty.insertMany(specialtiesData)
		console.log("Специальности успешно добавлены")

		process.exit(0)
	} catch (err) {
		console.error("Ошибка при заполнении базы:", err)
		process.exit(1)
	}
}

seed()
