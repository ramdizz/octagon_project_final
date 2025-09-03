const jwt = require("jsonwebtoken")

// Генерация JWT токена
const generateToken = payload => {
	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || "30d",
	})
}

// Проверка JWT токена
const verifyToken = token => {
	return jwt.verify(token, process.env.JWT_SECRET)
}

// Форматирование ошибки
const formatError = (message, statusCode = 400) => {
	const error = new Error(message)
	error.statusCode = statusCode
	return error
}

// Валидация email
const isValidEmail = email => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

// Генерация случайного кода
const generateRandomCode = (length = 6) => {
	return Math.random()
		.toString(36)
		.substring(2, length + 2)
		.toUpperCase()
}

module.exports = {
	generateToken,
	verifyToken,
	formatError,
	isValidEmail,
	generateRandomCode,
}
