const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			enum: ["student", "university", "employer"],
			required: true,
		},
		avatar: {
			type: String,
			default: null,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		// Профили для разных ролей (оставляем без изменений)
		studentProfile: {
			birthDate: Date,
			phone: String,
			city: String,
			egeParts: [
				{
					subject: String,
					score: Number,
				},
			],
			interests: [String],
			skills: [String],
			careerTestResults: [
				{
					testId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "CareerTest",
					},
					score: Number,
					resultType: String,
					completedAt: Date,
				},
			],
		},
		universityProfile: {
			name: String,
			description: String,
			address: String,
			website: String,
			logo: String,
			contactEmail: String,
			contactPhone: String,
			programs: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Program",
				},
			],
		},
		employerProfile: {
			companyName: String,
			description: String,
			industry: String,
			address: String,
			website: String,
			logo: String,
			contactEmail: String,
			contactPhone: String,
			vacancies: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Job",
				},
			],
		},
	},
	{
		timestamps: true,
	}
)

// Хеширование пароля перед сохранением
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next()

	try {
		const salt = await bcrypt.genSalt(10)
		this.password = await bcrypt.hash(this.password, salt)
		next()
	} catch (error) {
		next(error)
	}
})

// Метод для проверки пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password)
}

// Виртуальное поле для полного имени
userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`
})

// Метод для получения публичных данных пользователя (без пароля)
userSchema.methods.toPublicJSON = function () {
	const userObject = this.toObject()
	delete userObject.password
	return userObject
}

module.exports = mongoose.model("User", userSchema)
