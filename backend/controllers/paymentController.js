import { Payment, Booking, Field } from "../models/index.js";

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { booking_id, method, status } = req.body;

    // Ambil data booking
    const booking = await Booking.findByPk(booking_id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Ambil data field
    const field = await Field.findByPk(booking.field_id);
    if (!field) return res.status(404).json({ message: "Field not found" });

    // Hitung durasi booking dalam jam
    const [startHour, startMinute] = booking.start_time.split(":").map(Number);
    const [endHour, endMinute] = booking.end_time.split(":").map(Number);
    const duration = (endHour + endMinute / 60) - (startHour + startMinute / 60);

    // Hitung amount
    const amount = duration * field.price_per_hour;

    // Buat payment
    const newPayment = await Payment.create({
      booking_id,
      amount,
      method,
      status,
    });
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const { booking_id, method, status } = req.body;

    // Ambil data booking
    const booking = await Booking.findByPk(booking_id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Ambil data field
    const field = await Field.findByPk(booking.field_id);
    if (!field) return res.status(404).json({ message: "Field not found" });

    // Hitung durasi booking dalam jam
    const [startHour, startMinute] = booking.start_time.split(":").map(Number);
    const [endHour, endMinute] = booking.end_time.split(":").map(Number);
    const duration = (endHour + endMinute / 60) - (startHour + startMinute / 60);

    // Hitung amount
    const amount = duration * field.price_per_hour;

    await payment.update({ booking_id, amount, method, status });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    await payment.destroy();
    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
