const mongoose = require("mongoose")

const careerTestSchema = new mongoose.Schema(
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
		type: {
			type: String,
			enum: ["personality", "interests", "skills", "aptitude"],
			required: true,
		},
		questions: [
			{
				question: {
					type: String,
					required: true,
				},
				options: [
					{
						text: String,
						value: Number,
						category: String,
					},
				],
				type: {
					type: String,
					enum: ["single", "multiple", "scale"],
					default: "single",
				},
			},
		],
		scoring: {
			categories: [
				{
					name: String,
					description: String,
					minScore: Number,
					maxScore: Number,
				},
			],
			results: [
				{
					type: String,
					title: String,
					description: String,
					recommendations: [String],
					relatedPrograms: [
						{
							type: mongoose.Schema.Types.ObjectId,
							ref: "Program",
						},
					],
					relatedJobs: [
						{
							type: mongoose.Schema.Types.ObjectId,
							ref: "Job",
						},
					],
				},
			],
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

module.exports = mongoose.model("CareerTest", careerTestSchema)
