const mongoose = require("mongoose")

const employerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String },
	industry: { type: String },
	contact: {
		email: { type: String },
		phone: { type: String },
		address: { type: String },
	},
	isActive: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Employer", employerSchema)
