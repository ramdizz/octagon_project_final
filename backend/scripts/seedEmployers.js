const mongoose = require("mongoose")
const employer = require("../src/models/Employer")

const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/career-navigator"

const employersData = [
	{
		name: "ООО Ромашка",
		description: "Компания в сфере IT",
		industry: "Информационные технологии",
		contact: {
			email: "contact@romashka.ru",
			phone: "+7 123 456 7890",
			address: "г. Москва, ул. Ленина, д. 1",
		},
	},
	{
		name: "ЗАО ТехноПлюс",
		description: "Производство электроники",
		industry: "Промышленность",
		contact: {
			email: "info@technoplus.ru",
			phone: "+7 987 654 3210",
			address: "г. Санкт-Петербург, Невский проспект, д. 10",
		},
	},
	{
		name: "АО СтройИнвест",
		description: "Строительная компания с многолетним опытом",
		industry: "Строительство",
		contact: {
			email: "contact@stroiinvest.ru",
			phone: "+7 495 555 1234",
			address: "г. Москва, ул. Тверская, д. 15",
		},
	},
	{
		name: "ООО МедТех",
		description: "Разработка медицинского оборудования",
		industry: "Медицина и технологии",
		contact: {
			email: "info@medtech.ru",
			phone: "+7 812 333 4455",
			address: "г. Санкт-Петербург, ул. Мира, д. 22",
		},
	},
	{
		name: "ЗАО АгроПром",
		description: "Агропромышленный холдинг",
		industry: "Сельское хозяйство",
		contact: {
			email: "contact@agroprom.ru",
			phone: "+7 495 777 8888",
			address: "г. Краснодар, ул. Советская, д. 5",
		},
	},
	{
		name: "ООО ЛогистикСервис",
		description: "Логистические услуги по всей России",
		industry: "Логистика",
		contact: {
			email: "info@logisticservice.ru",
			phone: "+7 495 666 9999",
			address: "г. Москва, ул. Новая, д. 7",
		},
	},
]

async function seed() {
	try {
		await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log("Подключение к MongoDB успешно")

		// Очистим коллекцию работодателей (опционально)
		await employer.deleteMany({})
		console.log("Коллекция Employers очищена")

		// Вставим данные
		await employer.insertMany(employersData)
		console.log("Данные работодателей успешно добавлены")

		process.exit(0) // успешное завершение
	} catch (err) {
		console.error("Ошибка при заполнении базы:", err)
		process.exit(1) // завершение с ошибкой
	}
}

seed()
