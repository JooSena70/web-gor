import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({
    field_id: '',
    day: '',
    open_time: '',
    close_time: ''
  });
  const [editId, setEditId] = useState(null);

  const getSchedules = async () => {
    const res = await axios.get('http://localhost:5000/schedules');
    setSchedules(res.data);
  };

  const getFields = async () => {
    const res = await axios.get('http://localhost:5000/fields');
    setFields(res.data);
  };

  useEffect(() => {
    getSchedules();
    getFields();
  }, []);

  const saveSchedule = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/schedules/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/schedules', form);
    }
    setForm({
      field_id: '',
      day: '',
      open_time: '',
      close_time: ''
    });
    setEditId(null);
    getSchedules();
  };

  const editSchedule = (schedule) => {
    setForm({
      field_id: schedule.field_id,
      day: schedule.day,
      open_time: schedule.open_time,
      close_time: schedule.close_time
    });
    setEditId(schedule.id);
  };

  const deleteSchedule = async (id) => {
    await axios.delete(`http://localhost:5000/schedules/${id}`);
    getSchedules();
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Schedule Management</h1>
      <form onSubmit={saveSchedule} className="box">
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
          <label className="label">Day</label>
          <div className="control">
            <div className="select">
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                required
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <label className="label">Open Time</label>
            <input
              className="input"
              type="time"
              value={form.open_time}
              onChange={(e) => setForm({ ...form, open_time: e.target.value })}
              required
            />
          </div>
          <div className="control">
            <label className="label">Close Time</label>
            <input
              className="input"
              type="time"
              value={form.close_time}
              onChange={(e) => setForm({ ...form, close_time: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">
            {editId ? 'Update' : 'Add'} Schedule
          </button>
        </div>
      </form>

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Field</th>
            <th>Day</th>
            <th>Open</th>
            <th>Close</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule, index) => (
            <tr key={schedule.id}>
              <td>{index + 1}</td>
              <td>
                {fields.find((f) => f.id === schedule.field_id)?.name || '-'}
              </td>
              <td>{schedule.day}</td>
              <td>{schedule.open_time}</td>
              <td>{schedule.close_time}</td>
              <td>
                <button
                  onClick={() => editSchedule(schedule)}
                  className="button is-small is-info mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSchedule(schedule.id)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {schedules.length === 0 && (
            <tr>
              <td colSpan="6" className="has-text-centered">No schedules available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Schedules;