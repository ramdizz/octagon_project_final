const express = require("express")
const router = express.Router()
const Employer = require("../models/Employer")
const GraduateProfile = require("../models/GraduateProfile")
const { authenticate, authorize } = require("../middleware/auth")
const mongoose = require("mongoose")

// Получить список всех активных работодателей
router.get("/", async (req, res) => {
	try {
		const employers = await Employer.find().select("+isActive")
		res.json({ success: true, employers })
	} catch (error) {
		console.error("Ошибка получения работодателей:", error)
		res
			.status(500)
			.json({ success: false, message: "Внутренняя ошибка сервера" })
	}
})

// Получить детали конкретного работодателя по ID
router.get("/:id", async (req, res) => {
	const id = req.params.id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(400)
			.json({ success: false, message: "Неверный ID работодателя" })
	}
	try {
		const employer = await Employer.findById(id)
		if (!employer) {
			return res
				.status(404)
				.json({ success: false, message: "Работодатель не найден" })
		}
		res.json({ success: true, employer })
	} catch (error) {
		console.error("Ошибка получения работодателя:", error)
		res
			.status(500)
			.json({ success: false, message: "Внутренняя ошибка сервера" })
	}
})

// Создать работодателя
router.post("/", authenticate, authorize("employer"), async (req, res) => {
	try {
		const { name, description, industry, contact } = req.body

		if (!name || !name.trim()) {
			return res
				.status(400)
				.json({ success: false, message: "Поле 'name' обязательно" })
		}

		const employer = new Employer({
			name: name.trim(),
			description: description?.trim() || "",
			industry: industry?.trim() || "",
			contact: {
				email: contact?.email?.trim() || "",
				phone: contact?.phone?.trim() || "",
				address: contact?.address?.trim() || "",
			},
		})

		await employer.save()
		res.status(201).json({ success: true, employer })
	} catch (error) {
		console.error("Ошибка создания работодателя:", error)
		res.status(500).json({ success: false, message: "Ошибка сервера" })
	}
})

router.delete("/:id", authenticate, authorize("employer"), async (req, res) => {
	try {
		const deleted = await Employer.findByIdAndDelete(req.params.id)
		if (!deleted) {
			return res
				.status(404)
				.json({ success: false, message: "Работодатель не найден" })
		}
		res.json({ success: true, message: "Работодатель успешно удалён" })
	} catch (err) {
		console.error(err)
		res.status(500).json({ success: false, message: "Ошибка сервера" })
	}
})

// Получить профили выпускников (если нужно)
router.get(
	"/graduates",
	authenticate,
	authorize("employer"),
	async (req, res) => {
		try {
			const graduates = await GraduateProfile.find().populate(
				"userId",
				"firstName lastName email"
			)
			res.json({ success: true, graduates })
		} catch (err) {
			console.error("Ошибка получения профилей выпускников:", err)
			res.status(500).json({ message: "Ошибка сервера" })
		}
	}
)

module.exports = router
