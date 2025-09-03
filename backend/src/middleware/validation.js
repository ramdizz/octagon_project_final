const { body, param, query, validationResult } = require("express-validator")
const { isValidEmail } = require("../utils/helpers")

const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			message: "Ошибка валидации",
			errors: errors.array(),
		})
	}
	next()
}

const validateRegistration = [
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Введите корректный email"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Пароль должен содержать минимум 6 символов"),
	body("firstName")
		.trim()
		.isLength({ min: 2 })
		.withMessage("Имя должно содержать минимум 2 символа"),
	body("lastName")
		.trim()
		.isLength({ min: 2 })
		.withMessage("Фамилия должна содержать минимум 2 символа"),
	body("role")
		.isIn(["student", "university", "employer"])
		.withMessage("Недопустимая роль пользователя"),
	handleValidationErrors,
]

const validateLogin = [
	body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("Введите корректный email"),
	body("password").notEmpty().withMessage("Пароль обязателен"),
	handleValidationErrors,
]

const validateUniversity = [
	body("name")
		.trim()
		.isLength({ min: 2 })
		.withMessage("Название университета должно содержать минимум 2 символа"),
	body("description")
		.trim()
		.isLength({ min: 10 })
		.withMessage("Описание должно содержать минимум 10 символов"),
	body("address").trim().notEmpty().withMessage("Адрес обязателен"),
	body("website").isURL().withMessage("Введите корректный URL сайта"),
	handleValidationErrors,
]

const validateJob = [
	body("title")
		.trim()
		.isLength({ min: 3 })
		.withMessage("Название должности должно содержать минимум 3 символа"),
	body("description")
		.trim()
		.isLength({ min: 20 })
		.withMessage("Описание должно содержать минимум 20 символов"),
	body("requirements.education")
		.isIn(["bachelor", "master", "specialist", "any"])
		.withMessage("Недопустимый тип образования"),
	body("requirements.experience")
		.isIn(["none", "1-3", "3-5", "5+"])
		.withMessage("Недопустимый опыт работы"),
	body("conditions.schedule")
		.isIn(["full-time", "part-time", "remote", "hybrid"])
		.withMessage("Недопустимый график работы"),
	handleValidationErrors,
]

module.exports = {
	handleValidationErrors,
	validateRegistration,
	validateLogin,
	validateUniversity,
	validateJob,
}
