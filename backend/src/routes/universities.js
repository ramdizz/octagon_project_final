const express = require("express")
const router = express.Router()
const University = require("../models/University")

// Получить список всех вузов
router.get("/", async (req, res) => {
	try {
		const universities = await University.find({ isActive: true }).select(
			"name description address website"
		)
		res.json({ success: true, universities })
	} catch (error) {
		console.error("Ошибка получения вузов:", error)
		res
			.status(500)
			.json({ success: false, message: "Внутренняя ошибка сервера" })
	}
})

// Получить детали конкретного вуза по ID
router.get("/:id", async (req, res) => {
	try {
		const university = await University.findById(req.params.id).populate(
			"programs"
		)
		if (!university) {
			return res.status(404).json({ success: false, message: "Вуз не найден" })
		}
		res.json({ success: true, university })
	} catch (error) {
		console.error("Ошибка получения вуза:", error)
		res
			.status(500)
			.json({ success: false, message: "Внутренняя ошибка сервера" })
	}
})

module.exports = router
