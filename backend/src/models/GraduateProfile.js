const mongoose = require("mongoose")

const graduateProfileSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
	education: { type: String, required: true },
	competencies: [{ type: String }],
	exams: [{ name: String, score: Number }], // например, [{name: "Математика", score: 85}]
	graduationYear: { type: Number },
	// другие поля по необходимости
})

module.exports = mongoose.model("GraduateProfile", graduateProfileSchema)
