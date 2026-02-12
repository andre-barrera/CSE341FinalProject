const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  locationName: { type: String, required: true },
  locationAddress: { type: String, required: true },
  createdByGithubId: { type: String, required: true },
  createdByUsername: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("event", eventSchema);
