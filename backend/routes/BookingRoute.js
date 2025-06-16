// routes/bookingRoute.js
import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  createBookingByUserId,
  updateBooking,
  deleteBooking
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/bookings", getBookings);
router.get("/bookings/:id", getBookingById);
router.post("/bookings", createBooking);
router.post("/users/:userId/bookings", createBookingByUserId);
router.put("/bookings/:id", updateBooking);
router.delete("/bookings/:id", deleteBooking);

export default router;
