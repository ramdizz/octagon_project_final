const express = require("express")
const router = express.Router()
const Specialty = require("../models/Specialty")

router.get("/", async (req, res) => {
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

module.exports = router
