const express = require("express")
const path = require("path")
require("dotenv").config()

const connectDB = require("./utils/database")
const { setupSecurity } = require("./middleware/security")

// Подключение роутов
const authRoutes = require("./routes/auth")
const careerTestRoutes = require("./routes/career-tests")
const universitiesRoutes = require("./routes/universities")
const jobsRoutes = require("./routes/jobs")
const studentsRouter = require("./routes/students")
const employersRouter = require("./routes/employers")
const specialtiesRouter = require("./routes/specialties")
const careerRouter = require("./routes/career")
const app = express()

// Подключение к базе данных
connectDB()

// Настройка безопасности
setupSecurity(app)

// Middleware для парсинга JSON
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Статические файлы
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// API роуты
app.use("/api/auth", authRoutes)
app.use("/api/career-tests", careerTestRoutes)
app.use("/api/universities", universitiesRoutes)
app.use("/api/jobs", jobsRoutes)
app.use("/api/students", studentsRouter)
app.use("/api/employers", employersRouter)
app.use("/api/specialties", specialtiesRouter)
app.use("/api", careerRouter)
app.use(express.json())

// Обработка ошибок 404
app.use("*", (req, res) => {
	res.status(404).json({
		success: false,
		message: "Маршрут не найден",
	})
})

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
	console.error(err.stack)

	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Внутренняя ошибка сервера",
	})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Сервер запущен на порту ${PORT}`)
})

module.exports = app
