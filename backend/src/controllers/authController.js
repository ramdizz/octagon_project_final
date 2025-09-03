const User = require("../models/User")
const { generateToken, formatError } = require("../utils/helpers")

const register = async (req, res) => {
	try {
		const { email, password, firstName, lastName, role } = req.body

		// Проверка существования пользователя
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "Пользователь с таким email уже существует",
			})
		}

		// Создание нового пользователя
		const user = new User({
			email,
			password,
			firstName,
			lastName,
			role,
		})

		await user.save()

		// Генерация токена
		const token = generateToken({ id: user._id, role: user.role })

		res.status(201).json({
			success: true,
			message: "Пользователь успешно зарегистрирован",
			data: {
				token,
				user: user.toPublicJSON(),
			},
		})
	} catch (error) {
		console.error("Ошибка регистрации:", error)
		res.status(500).json({
			success: false,
			message: "Внутренняя ошибка сервера",
		})
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body

		// Поиск пользователя
		const user = await User.findOne({ email }).select("+password")
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Неверный email или пароль",
			})
		}

		// Проверка пароля
		const isPasswordValid = await user.comparePassword(password)
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Неверный email или пароль",
			})
		}

		// Проверка активности аккаунта
		if (!user.isActive) {
			return res.status(401).json({
				success: false,
				message: "Аккаунт заблокирован",
			})
		}

		// Генерация токена
		const token = generateToken({ id: user._id, role: user.role })

		res.json({
			success: true,
			message: "Успешный вход в систему",
			data: {
				token,
				user: user.toPublicJSON(),
			},
		})
	} catch (error) {
		console.error("Ошибка входа:", error)
		res.status(500).json({
			success: false,
			message: "Внутренняя ошибка сервера",
		})
	}
}

const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.populate("universityProfile.programs")
			.populate("employerProfile.vacancies")

		res.json({
			success: true,
			data: { user: user.toPublicJSON() },
		})
	} catch (error) {
		console.error("Ошибка получения профиля:", error)
		res.status(500).json({
			success: false,
			message: "Внутренняя ошибка сервера",
		})
	}
}

const updateProfile = async (req, res) => {
	try {
		const { firstName, lastName, ...profileData } = req.body
		const user = await User.findById(req.user.id)

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "Пользователь не найден",
			})
		}

		// Обновление базовых данных
		if (firstName) user.firstName = firstName
		if (lastName) user.lastName = lastName

		// Обновление профиля в зависимости от роли
		if (user.role === "student" && profileData.studentProfile) {
			user.studentProfile = {
				...user.studentProfile,
				...profileData.studentProfile,
			}
		} else if (user.role === "university" && profileData.universityProfile) {
			user.universityProfile = {
				...user.universityProfile,
				...profileData.universityProfile,
			}
		} else if (user.role === "employer" && profileData.employerProfile) {
			user.employerProfile = {
				...user.employerProfile,
				...profileData.employerProfile,
			}
		}

		await user.save()

		res.json({
			success: true,
			message: "Профиль успешно обновлен",
			data: { user: user.toPublicJSON() },
		})
	} catch (error) {
		console.error("Ошибка обновления профиля:", error)
		res.status(500).json({
			success: false,
			message: "Внутренняя ошибка сервера",
		})
	}
}

module.exports = {
	register,
	login,
	getProfile,
	updateProfile,
}
