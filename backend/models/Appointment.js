const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Consider using Date type if suitable
    required: true,
  },
  time: {
    type: String, // Consider using Date type if suitable
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
