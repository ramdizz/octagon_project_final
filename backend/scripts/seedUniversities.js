const mongoose = require("mongoose")
const University = require("../src/models/University") // путь к модели может отличаться

// Подключение к MongoDB
const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/career-navigator"

const universitiesData = [
	{
		name: "Московский государственный университет",
		description: "Крупнейший университет России, основан в 1755 году.",
		address: "г. Москва, Ленинские горы, д.1",
		website: "https://www.msu.ru",
		isActive: true,
	},
	{
		name: "Санкт-Петербургский государственный университет",
		description: "Один из старейших университетов России, основан в 1724 году.",
		address: "г. Санкт-Петербург, Университетская наб., д.7-9",
		website: "https://spbu.ru",
		isActive: true,
	},
	{
		name: "Новосибирский государственный университет",
		description: "Современный исследовательский университет в Сибири.",
		address: "г. Новосибирск, ул. Пирогова, д.2",
		website: "https://nsu.ru",
		isActive: true,
	},
	{
		name: "Владивостокский государственный университет",
		description: "Современный университет дальнего востока.",
		address: "г. Владивосток, ул. Гоголя, д.41",
		website: "https://www.vvsu.ru/",
		isActive: true,
	},
	{
		name: "IT-hub",
		description: "Колледж информационных и креативных технологий.",
		address: "г. Владивосток, ул. Гоголя, д.42",
		website: "https://vvsu.ithub.ru/",
		isActive: true,
	},
]

async function seed() {
	try {
		await mongoose.connect(MONGODB_URI)
		console.log("Подключение к MongoDB успешно")

		// Очистка коллекции (опционально)
		await University.deleteMany({})
		console.log("Коллекция universities очищена")

		// Вставка данных
		await University.insertMany(universitiesData)
		console.log("Данные вузов успешно добавлены")

		process.exit(0)
	} catch (error) {
		console.error("Ошибка при добавлении данных:", error)
		process.exit(1)
	}
}

seed()
