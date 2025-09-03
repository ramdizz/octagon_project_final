const express = require("express")
const router = express.Router()
const {
	getAllTests,
	getTestById,
	submitTestResult,
	getUserTestResults,
} = require("../controllers/careerTestController")
const { authenticate, authorize } = require("../middleware/auth")

// Получение всех тестов
router.get("/", getAllTests)

// Получение теста по ID
router.get("/:id", getTestById)

// Отправка результата теста
router.post("/submit", authenticate, authorize("student"), submitTestResult)

// Получение результатов пользователя
router.get(
	"/user/results",
	authenticate,
	authorize("student"),
	getUserTestResults
)

module.exports = router
