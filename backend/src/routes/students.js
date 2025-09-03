// routes/students.js
const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { authenticate } = require("../middleware/auth") // ваш middleware аутентификации

// Получить список студентов (только для работодателей)
router.get("/", authenticate, async (req, res) => {
	try {
		// Проверяем роль пользователя
		if (req.user.role !== "employer") {
			return res
				.status(403)
				.json({ success: false, message: "Доступ запрещён" })
		}

		// Находим пользователей с ролью student
		const students = await User.find({ role: "student" })
			.select("firstName lastName studentProfile") // выбираем нужные поля
			.populate({
				path: "studentProfile.careerTestResults.testId",
				select: "name", // подгружаем название теста
			})
			.lean()

		res.json({ success: true, students })
	} catch (error) {
		console.error("Ошибка получения студентов:", error)
		res
			.status(500)
			.json({ success: false, message: "Внутренняя ошибка сервера" })
	}
})

module.exports = router
