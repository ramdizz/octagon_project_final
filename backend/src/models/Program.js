const mongoose = require("mongoose")

const programSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		university: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "University",
			required: true,
		},
		degree: {
			type: String,
			enum: ["bachelor", "master", "specialist"],
			required: true,
		},
		duration: {
			type: Number,
			required: true, // в семестрах
		},
		requiredEge: [
			{
				subject: {
					type: String,
					required: true,
				},
				minScore: {
					type: Number,
					required: true,
				},
			},
		],
		competencies: [
			{
				name: String,
				description: String,
				level: {
					type: String,
					enum: ["basic", "intermediate", "advanced"],
				},
			},
		],
		tuitionFee: {
			budget: {
				type: Number,
				default: 0,
			},
			paid: {
				type: Number,
				default: 0,
			},
		},
		employmentRate: {
			type: Number,
			min: 0,
			max: 100,
			default: 0,
		},
		averageSalary: {
			type: Number,
			default: 0,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("Program", programSchema)
