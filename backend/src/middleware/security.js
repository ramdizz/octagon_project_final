const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const hpp = require("hpp")
const mongoSanitize = require("express-mongo-sanitize")

// Настройка CORS
const corsOptions = {
	origin: process.env.FRONTEND_URL || "http://localhost:3000",
	credentials: true,
	optionsSuccessStatus: 200,
}

// Ограничение количества запросов
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 минут
	max: 100, // Максимум 100 запросов с одного IP
	message: {
		success: false,
		message: "Слишком много запросов с этого IP, попробуйте позже",
	},
})

// Ограничение для авторизации
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 минут
	max: 5, // Максимум 5 попыток входа
	message: {
		success: false,
		message: "Слишком много попыток входа, попробуйте через 15 минут",
	},
})

const setupSecurity = app => {
	// Базовая безопасность
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					scriptSrc: ["'self'"],
					imgSrc: ["'self'", "data:", "https:"],
				},
			},
		})
	)

	// CORS
	app.use(cors(corsOptions))

	// Защита от XSS
	app.use(xss())

	// Защита от HTTP Parameter Pollution
	app.use(hpp())

	// Защита от MongoDB инъекций
	app.use(mongoSanitize())

	// Ограничение запросов
	app.use("/api/", limiter)
	app.use("/api/auth/login", authLimiter)
	app.use("/api/auth/register", authLimiter)
}

module.exports = {
	setupSecurity,
	limiter,
	authLimiter,
}
