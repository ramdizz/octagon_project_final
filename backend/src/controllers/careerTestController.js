const CareerTest = require("../models/CareerTest")
const User = require("../models/User")

const getAllTests = async (req, res) => {
	try {
		const tests = await CareerTest.find({ isActive: true }).select(
			"name description type"
		)

		res.json({
			success: true,
			data: { tests },
		})
	} catch (error) {
		console.error("Ошибка получения тестов:", error)
		res.status(500).json({
			success: false,
			message: "Внутренняя ошибка сервера",
		})
	}
}

const getTestById = async (req, res) => {
	try {
		const test = await CareerTest.findById(req.params.id)
			.populate("scoring.results.relatedPrograms")
			.populate("scoring.results.relatedJobs")

		if (!test || !test.isActive) {
			return res.status(404).json({
				success: false,
				message: "Тест не найден",
			})
		}

		res.json({
			success: true,
			data: { test },
		})
	} catch (error) {
		console.error("Ошибка получения теста:", error)
		res.status(500).json({
			success: false,
			message: "Внутренняя ошибка сервера",
		})
	}
}

const submitTestResult = async (req, res) => {
	try {
		const { testId, answers } = req.body
		const userId = req.user.id

		const test = await CareerTest.findById(testId)
		if (!test || !test.isActive) {
			return res.status(404).json({
				success: false,
				message: "Тест не найден",
			})
		}

		// Подсчет результатов
		const scores = calculateTestScore(test, answers)
		const result = determineTestResult(test, scores)

		// Сохранение результата в профиле пользователя
		const user = await User.findById(userId)
		if (user.role === "student") {
			user.studentProfile.careerTestResults.push({
				testId,
				score: scores.total,
				resultType: result.type,
				completedAt: new Date(),
			})
			await user.save()
		}

		res.json({
			success: true,
			message: "Результат теста сохранен",
			data: {
				scores,
				result,
				recommendations: result.recommendations,
			},
		})
	} catch (error) {
		console.error("Ошибка сохранения результата теста:", error)
		res.status(500).json({
			success: false,
			message: "Внутренняя ошибка сервера",
		})
	}
}

const getUserTestResults = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate(
			"studentProfile.careerTestResults.testId"
		)

		if (!user || user.role !== "student") {
			return res.status(404).json({
				success: false,
				message: "Пользователь не найден или не является студентом",
			})
		}

		res.json({
			success: true,
			data: { results: user.studentProfile.careerTestResults },
		})
	} catch (error) {
		console.error("Ошибка получения результатов тестов:", error)
		res.status(500).json({
			success: false,
			message: "Внутренняя ошибка сервера",
		})
	}
}

// Вспомогательные функции для подсчета результатов
const calculateTestScore = (test, answers) => {
	const categoryScores = {}
	let totalScore = 0

	// Инициализация счетчиков категорий
	test.scoring.categories.forEach(category => {
		categoryScores[category.name] = 0
	})

	// Подсчет баллов
	answers.forEach((answer, index) => {
		const question = test.questions[index]
		if (question && question.options) {
			const selectedOption = question.options[answer]
			if (selectedOption) {
				totalScore += selectedOption.value
				if (selectedOption.category) {
					categoryScores[selectedOption.category] += selectedOption.value
				}
			}
		}
	})

	return {
		total: totalScore,
		categories: categoryScores,
	}
}

const determineTestResult = (test, scores) => {
	// Находим результат с наибольшим соответствием
	let bestResult = test.scoring.results[0]
	let bestScore = 0

	test.scoring.results.forEach(result => {
		let score = 0
		Object.keys(scores.categories).forEach(category => {
			const categoryScore = scores.categories[category]
			const categoryConfig = test.scoring.categories.find(
				c => c.name === category
			)
			if (categoryConfig) {
				const normalizedScore = categoryScore / categoryConfig.maxScore
				score += normalizedScore
			}
		})

		if (score > bestScore) {
			bestScore = score
			bestResult = result
		}
	})

	return bestResult
}

module.exports = {
	getAllTests,
	getTestById,
	submitTestResult,
	getUserTestResults,
}
