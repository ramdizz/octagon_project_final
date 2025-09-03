const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Middleware для аутентификации пользователя по JWT
const authenticate = async (req, res, next) => {
	try {
		const authHeader = req.header("Authorization")
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Токен доступа не предоставлен",
			})
		}

		const token = authHeader.replace("Bearer ", "")
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		const user = await User.findById(decoded.userId).select("-password")
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Пользователь не найден",
			})
		}

		if (!user.isActive) {
			return res.status(401).json({
				success: false,
				message: "Аккаунт заблокирован",
			})
		}

		// Добавляем пользователя в объект запроса
		req.user = user
		next()
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Недействительный токен",
		})
	}
}

// Middleware для авторизации по ролям
const authorize = (...roles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({
				success: false,
				message: "Пользователь не аутентифицирован",
			})
		}

		// Проверяем, есть ли роль пользователя в списке разрешённых ролей
		if (roles.length > 0 && !roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "Недостаточно прав доступа",
			})
		}

		next()
	}
}

module.exports = {
	authenticate,
	authorize,
}
