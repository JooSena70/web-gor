import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({
    user_id: '',
    field_id: '',
    booking_date: '',
    start_time: '',
    end_time: '',
    status: 'pending'
  });
  const [editId, setEditId] = useState(null);

  const getBookings = async () => {
    const res = await axios.get('http://localhost:5000/bookings');
    setBookings(res.data);
  };

  const getUsers = async () => {
    const res = await axios.get('http://localhost:5000/users');
    setUsers(res.data);
  };

  const getFields = async () => {
    const res = await axios.get('http://localhost:5000/fields');
    setFields(res.data);
  };

  useEffect(() => {
    getBookings();
    getUsers();
    getFields();
  }, []);

  const saveBooking = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/bookings/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/bookings', form);
    }
    setForm({
      user_id: '',
      field_id: '',
      booking_date: '',
      start_time: '',
      end_time: '',
      status: 'pending'
    });
    setEditId(null);
    getBookings();
  };

  const editBooking = (booking) => {
    setForm({
      user_id: booking.user_id,
      field_id: booking.field_id,
      booking_date: booking.booking_date,
      start_time: booking.start_time,
      end_time: booking.end_time,
      status: booking.status
    });
    setEditId(booking.id);
  };

  const deleteBooking = async (id) => {
    await axios.delete(`http://localhost:5000/bookings/${id}`);
    getBookings();
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Booking Management</h1>
      <form onSubmit={saveBooking} className="box">
        <div className="field">
          <label className="label">User</label>
          <div className="control">
            <div className="select">
              <select
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Field</label>
          <div className="control">
            <div className="select">
              <select
                value={form.field_id}
                onChange={(e) => setForm({ ...form, field_id: e.target.value })}
                required
              >
                <option value="">Select Field</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>{field.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Booking Date</label>
          <div className="control">
            <input
              className="input"
              type="date"
              value={form.booking_date}
              onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <label className="label">Start Time</label>
            <input
              className="input"
              type="time"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              required
            />
          </div>
          <div className="control">
            <label className="label">End Time</label>
            <input
              className="input"
              type="time"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Status</label>
          <div className="control">
            <div className="select">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">
            {editId ? 'Update' : 'Add'} Booking
          </button>
        </div>
      </form>

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>User</th>
            <th>Field</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={booking.id}>
              <td>{index + 1}</td>
              <td>
                {users.find((u) => u.id === booking.user_id)?.name || '-'}
              </td>
              <td>
                {fields.find((f) => f.id === booking.field_id)?.name || '-'}
              </td>
              <td>{booking.booking_date}</td>
              <td>{booking.start_time}</td>
              <td>{booking.end_time}</td>
              <td>{booking.status}</td>
              <td>
                <button
                  onClick={() => editBooking(booking)}
                  className="button is-small is-info mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBooking(booking.id)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Booking;