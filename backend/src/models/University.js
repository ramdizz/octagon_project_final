const mongoose = require("mongoose")

const universitySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: String,
		address: String,
		website: String,
		isActive: { type: Boolean, default: true },
		programs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
	},
	{ timestamps: true }
)

module.exports = mongoose.model("University", universitySchema)
