const mongoose = require("mongoose")

const careerPlanItemSchema = new mongoose.Schema({
	specialty: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Specialty",
		required: true,
	},
	notes: { type: String, default: "" },
	createdAt: { type: Date, default: Date.now },
})

const careerPlanSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
	items: [careerPlanItemSchema],
})

module.exports = mongoose.model("CareerPlan", careerPlanSchema)
