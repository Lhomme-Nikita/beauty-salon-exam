const express = require("express");
const router = express.Router();
const { getAppointments, getAppointment, postAppointment, putAppointment, deleteAppointment } = require("../controllers/appointmentControllers");
const { verifyAccessToken } = require("../middlewares");

router.get("/", verifyAccessToken, getAppointments);
router.get("/:appointmentId", verifyAccessToken, getAppointment);
router.post("/", verifyAccessToken, postAppointment);
router.put("/:appointmentId", verifyAccessToken, putAppointment);
router.delete("/:appointmentId", verifyAccessToken, deleteAppointment);

module.exports = router;
