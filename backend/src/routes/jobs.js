const express = require("express")
const router = express.Router()
const Job = require("../models/Job")
const { authenticate, authorize } = require("../middleware/auth")

// Создание вакансии (только для работодателей)
router.post("/", authenticate, async (req, res) => {
	try {
		const jobData = req.body
		jobData.employer = req.user._id
		const job = new Job(jobData)
		await job.save()
		res.status(201).json({ success: true, job })
	} catch (err) {
		res.status(400).json({ success: false, message: err.message })
	}
})

// Получение вакансий работодателя
router.get("/my", authenticate, async (req, res) => {
	try {
		const jobs = await Job.find({ employer: req.user._id })
		res.json({ success: true, jobs })
	} catch (err) {
		res.status(500).json({ success: false, message: err.message })
	}
})

// Получение всех вакансий (для абитуриентов)
router.get("/", async (req, res) => {
	try {
		const jobs = await Job.find({ isActive: true }).populate(
			"employer",
			"companyName"
		)
		res.json({ success: true, jobs })
	} catch (err) {
		res.status(500).json({ success: false, message: err.message })
	}
})

module.exports = router
