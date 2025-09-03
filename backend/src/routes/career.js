// routes/career.js
const express = require("express")
const router = express.Router()
const Specialty = require("../models/Specialty")
const CareerPlan = require("../models/CareerPlan")
const { authenticate } = require("../middleware/auth")

// Поиск специальностей
router.get("/specialties", async (req, res) => {
	const q = req.query.q || ""
	try {
		const specialties = await Specialty.find({
			name: { $regex: q, $options: "i" },
		}).limit(20)
		res.json(specialties)
	} catch (err) {
		console.error("Ошибка поиска специальностей:", err)
		res.status(500).json({ message: "Ошибка сервера" })
	}
})

// Получение карьерного плана пользователя
// Получить карьерный план текущего пользователя
router.get("/career-plan", authenticate, async (req, res) => {
	try {
		let plan = await CareerPlan.findOne({ userId: req.user._id }).populate(
			"items.specialty"
		)
		if (!plan) {
			plan = new CareerPlan({ userId: req.user._id, items: [] })
			await plan.save()
		}
		res.json(plan)
	} catch (err) {
		res.status(500).json({ message: "Ошибка сервера" })
	}
})

// Добавить специальность в карьерный план
router.post("/career-plan", authenticate, async (req, res) => {
	const { specialtyId, notes } = req.body
	if (!specialtyId)
		return res.status(400).json({ message: "Не указан specialtyId" })

	try {
		let plan = await CareerPlan.findOne({ userId: req.user._id })
		if (!plan) {
			plan = new CareerPlan({ userId: req.user._id, items: [] })
		}

		// Проверяем, есть ли уже такая специальность в плане
		if (plan.items.some(item => item.specialty.toString() === specialtyId)) {
			return res.status(400).json({ message: "Специальность уже в плане" })
		}

		plan.items.push({ specialty: specialtyId, notes: notes || "" })
		await plan.save()
		await plan.populate("items.specialty")
		res.json(plan)
	} catch (err) {
		res.status(500).json({ message: "Ошибка сервера" })
	}
})

module.exports = router

// Удаление специальности из карьерного плана
router.delete("/career-plan/:itemId", authenticate, async (req, res) => {
	const { itemId } = req.params
	try {
		const plan = await CareerPlan.findOne({ userId: req.user._id })
		if (!plan)
			return res.status(404).json({ message: "Карьерный план не найден" })

		// Найти индекс поддокумента с _id = itemId
		const itemIndex = plan.items.findIndex(
			item => item._id.toString() === itemId
		)
		if (itemIndex === -1)
			return res.status(404).json({ message: "Элемент не найден" })

		// Удалить элемент из массива по индексу
		plan.items.splice(itemIndex, 1)

		// Сохранить изменения
		await plan.save()

		await plan.populate("items.specialty")
		res.json(plan)
	} catch (err) {
		console.error("Ошибка при удалении элемента карьерного плана:", err)
		res.status(500).json({ message: "Внутренняя ошибка сервера" })
	}
})

module.exports = router
