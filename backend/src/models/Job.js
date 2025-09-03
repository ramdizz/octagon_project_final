const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema({
	employerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	title: { type: String, required: true },
	description: { type: String },
	requiredEducation: { type: String, required: true }, // например, "Высшее", "Среднее специальное"
	requiredCompetencies: [{ type: String }], // список компетенций
	requiredExams: [{ type: String }], // список экзаменов ЕГЭ
	createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Job", jobSchema)
