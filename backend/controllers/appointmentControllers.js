const Appointment = require("../models/Appointment");
const { validateObjectId } = require("../utils/validation");

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id });
    res.status(200).json({ appointments, status: true, msg: "Appointments found successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.getAppointment = async (req, res) => {
  try {
    if (!validateObjectId(req.params.appointmentId)) {
      return res.status(400).json({ status: false, msg: "Appointment ID not valid" });
    }

    const appointment = await Appointment.findOne({ user: req.user.id, _id: req.params.appointmentId });
    if (!appointment) {
      return res.status(404).json({ status: false, msg: "Appointment not found." });
    }
    res.status(200).json({ appointment, status: true, msg: "Appointment found successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.postAppointment = async (req, res) => {
  try {
    const { name, surname, date, time, email } = req.body;
    if (!name || !surname || !date || !time || !email) {
      return res.status(400).json({ status: false, msg: "All fields are required." });
    }

    const appointment = await Appointment.create({ user: req.user.id, name, surname, date, time, email });
    res.status(201).json({ appointment, status: true, msg: "Appointment created successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.putAppointment = async (req, res) => {
  try {
    const { name, surname, date, time, email } = req.body;
    if (!validateObjectId(req.params.appointmentId)) {
      return res.status(400).json({ status: false, msg: "Appointment ID not valid" });
    }

    let appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ status: false, msg: "Appointment not found." });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ status: false, msg: "Unauthorized to update this appointment." });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.appointmentId, { name, surname, date, time, email }, { new: true });
    res.status(200).json({ appointment, status: true, msg: "Appointment updated successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}

exports.deleteAppointment = async (req, res) => {
  try {
    if (!validateObjectId(req.params.appointmentId)) {
      return res.status(400).json({ status: false, msg: "Appointment ID not valid" });
    }

    let appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ status: false, msg: "Appointment not found." });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(403).json({ status: false, msg: "Unauthorized to delete this appointment." });
    }

    await Appointment.findByIdAndDelete(req.params.appointmentId);
    res.status(200).json({ status: true, msg: "Appointment deleted successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
}
