import React, { useEffect, useState } from "react";
import axios from "axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    booking_id: "",
    amount: "",
    payment_date: "",
    method: "transfer",
    status: "pending",
  });
  const [editId, setEditId] = useState(null);

  const userId = localStorage.getItem("user_id");

  const getPayments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/payments/user/${userId}`);
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const getBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bookings");
      const userBookings = res.data.filter((b) => b.user_id === parseInt(userId));
      setBookings(userBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    getPayments();
    getBookings();
  }, []);

  const savePayment = async (e) => {
    e.preventDefault();
    const payload = {
      booking_id: form.booking_id,
      payment_date: form.payment_date,
      method: form.method,
      status: form.status,
    };
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/payments/${editId}`, payload);
      } else {
        await axios.post("http://localhost:5000/payments", payload);
      }
      setForm({
        booking_id: "",
        amount: "",
        payment_date: "",
        method: "transfer",
        status: "pending",
      });
      setEditId(null);
      getPayments();
    } catch (err) {
      console.error("Error saving payment:", err);
    }
  };

  const createForm = () => {
    setForm({
      booking_id: "",
      amount: "",
      payment_date: "",
      method: "transfer",
      status: "pending",
    });
    setEditId(null);
  };

  const editPayment = (payment) => {
    setForm({
      booking_id: payment.booking_id,
      amount: payment.amount,
      payment_date: payment.payment_date,
      method: payment.method,
      status: payment.status,
    });
    setEditId(payment.id);
  };

  const deletePayment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/payments/${id}`);
      getPayments();
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Payment Management</h1>

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>ID Payment</th>
            <th>ID Booking</th>
            <th>Booking Date</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => {
            const booking = bookings.find((b) => b.id === payment.booking_id);
            return (
              <tr key={payment.id}>
                <td>{index + 1}</td>
                <td>ID - {payment.id}</td>
                <td>ID - {payment.booking_id}</td>
                <td>{booking?.booking_date || "-"}</td>
                <td>
                  Rp{" "}
                  {parseFloat(payment.amount || 0).toLocaleString("id-ID", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td>{payment.payment_date}</td>
                <td>{payment.method}</td>
                <td>{payment.status}</td>
              </tr>
            );
          })}
          {payments.length === 0 && (
            <tr>
              <td colSpan="9" className="has-text-centered">
                No payments available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
