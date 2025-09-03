const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { authenticate } = require("../middleware/auth")

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

// Валидация регистрации
const validateRegistration = [
	body("firstName").notEmpty().withMessage("Имя обязательно"),
	body("lastName").notEmpty().withMessage("Фамилия обязательна"),
	body("email").isEmail().withMessage("Неверный email"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Пароль минимум 6 символов"),
	body("role")
		.isIn(["student", "university", "employer"])
		.withMessage("Неверная роль"),
]

// Валидация входа
const validateLogin = [
	body("email").isEmail().withMessage("Неверный email"),
	body("password").notEmpty().withMessage("Пароль обязателен"),
]

// Регистрация
router.post("/register", validateRegistration, async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res
			.status(400)
			.json({ success: false, message: errors.array()[0].msg })
	}

	const { firstName, lastName, email, password, role } = req.body
	const normalizedEmail = email.toLowerCase().trim()

	try {
		const existingUser = await User.findOne({ email: normalizedEmail })
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "Пользователь с таким email уже существует",
			})
		}

		// Передаем пароль как есть — хэширование сделает pre('save') в модели
		const user = new User({
			firstName,
			lastName,
			email: normalizedEmail,
			password,
			role,
		})

		await user.save()

		const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
			expiresIn: "7d",
		})

		res.json({
			success: true,
			data: {
				token,
				user: {
					id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					role: user.role,
				},
			},
		})
	} catch (err) {
		console.error("Ошибка регистрации:", err)
		res
			.status(500)
			.json({ success: false, message: "Внутренняя ошибка сервера" })
	}
})

// Вход
router.post("/login", validateLogin, async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res
			.status(400)
			.json({ success: false, message: errors.array()[0].msg })
	}

	const { email, password } = req.body
	const normalizedEmail = email.toLowerCase().trim()

	try {
		const user = await User.findOne({ email: normalizedEmail })
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Неверный email или пароль" })
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Неверный email или пароль" })
		}

		const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
			expiresIn: "7d",
		})

		res.json({
			success: true,
			data: {
				token,
				user: {
					id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					role: user.role,
				},
			},
		})
	} catch (error) {
		console.error("Ошибка при логине:", error)
		res
			.status(500)
			.json({ success: false, message: "Внутренняя ошибка сервера" })
	}
})

module.exports = router

// Получение профиля
router.get("/profile", authenticate, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password")
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "Пользователь не найден" })
		}
		res.json({ success: true, data: { user } })
	} catch (err) {
		console.error("Ошибка получения профиля:", err)
		res
			.status(500)
			.json({ success: false, message: "Внутренняя ошибка сервера" })
	}
})

// Обновление профиля
router.put("/profile", authenticate, async (req, res) => {
	try {
		const updates = { ...req.body }
		delete updates.password // Пароль обновляется отдельно

		const user = await User.findByIdAndUpdate(req.user._id, updates, {
			new: true,
		}).select("-password")

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "Пользователь не найден" })
		}

		res.json({ success: true, data: { user } })
	} catch (err) {
		console.error("Ошибка обновления профиля:", err)
		res
			.status(500)
			.json({ success: false, message: "Внутренняя ошибка сервера" })
	}
})

module.exports = router
