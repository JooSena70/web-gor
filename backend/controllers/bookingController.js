// controllers/bookingController.js
import { Booking, User, Field } from "../models/index.js";

// GET all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [User, Field]
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [User, Field]
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE booking
export const createBooking = async (req, res) => {
  const { user_id, field_id, booking_date, start_time, end_time, status } = req.body;
  try {
    const booking = await Booking.create({ user_id, field_id, booking_date, start_time, end_time, status });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE booking
export const updateBooking = async (req, res) => {
  const { user_id, field_id, booking_date, start_time, end_time, status } = req.body;
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.update({ user_id, field_id, booking_date, start_time, end_time, status });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.destroy();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
