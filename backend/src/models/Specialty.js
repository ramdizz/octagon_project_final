// models/Specialty.js
const mongoose = require("mongoose")

const specialtySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	demand: { type: Number, default: 0 }, // востребованность, например от 0 до 100
	educationalPaths: [{ type: String }], // образовательные траектории
})

module.exports = mongoose.model("Specialty", specialtySchema)
