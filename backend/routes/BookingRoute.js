// routes/bookingRoute.js
import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/bookings", getBookings);
router.get("/bookings/:id", getBookingById);
router.post("/bookings", createBooking);
router.put("/bookings/:id", updateBooking);
router.delete("/bookings/:id", deleteBooking);

export default router;
