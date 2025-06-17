import React, { useEffect, useState } from "react";
import axios from "axios";

const BookingUser = () => {
	const [bookings, setBookings] = useState([]);
	const [users, setUsers] = useState([]);
	const [fields, setFields] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [editId, setEditId] = useState(null);

	const storedUserId = localStorage.getItem("user_id");

	const [form, setForm] = useState({
		user_id: storedUserId || "",
		field_id: "",
		booking_date: "",
		start_time: "",
		end_time: "",
		status: "pending",
	});

	const getBookings = async () => {
		const res = await axios.get("http://localhost:5000/bookings");
		setBookings(
			res.data.filter((b) => b.user_id === parseInt(storedUserId))
		);
	};

	const getUsers = async () => {
		const res = await axios.get("http://localhost:5000/users");
		setUsers(res.data);
	};

	const getFields = async () => {
		const res = await axios.get("http://localhost:5000/fields");
		setFields(res.data);
	};

	const getSchedules = async () => {
		const res = await axios.get("http://localhost:5000/schedules");
		setSchedules(res.data);
	};

	useEffect(() => {
		getBookings();
		getUsers();
		getFields();
		getSchedules();
	}, []);

	const saveBooking = async (e) => {
		e.preventDefault();

		const error = validateBooking();
		if (error) {
			setErrorMessage(error);
			return;
		}

		if (editId) {
			await axios.put(`http://localhost:5000/bookings/${editId}`, form);
		} else {
			await axios.post(
				`http://localhost:5000/users/${form.user_id}/bookings`,
				{
					field_id: form.field_id,
					booking_date: form.booking_date,
					start_time: form.start_time,
					end_time: form.end_time,
					status: form.status,
				}
			);
		}

		setForm((prev) => ({
			...prev,
			field_id: "",
			booking_date: "",
			start_time: "",
			end_time: "",
			status: "pending",
		}));
		setEditId(null);
		getBookings();
	};

	const createForm = () => {
		setForm((prev) => ({
			...prev,
			field_id: "",
			booking_date: "",
			start_time: "",
			end_time: "",
			status: "pending",
		}));
		setEditId(null);
	};

	const editBooking = (booking) => {
		setForm({
			user_id: booking.user_id,
			field_id: booking.field_id,
			booking_date: booking.booking_date,
			start_time: booking.start_time,
			end_time: booking.end_time,
			status: booking.status,
		});
		setEditId(booking.id);
	};

	const deleteBooking = async (id) => {
		await axios.delete(`http://localhost:5000/bookings/${id}`);
		getBookings();
	};

	const validateBooking = () => {
		const { booking_date, start_time, end_time, field_id } = form;

		const dayIndex = new Date(booking_date).getDay();
		const dayName = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		][dayIndex];

		const fieldSchedules = schedules.filter(
			(s) => s.field_id === parseInt(field_id) && s.day === dayName
		);

		if (fieldSchedules.length === 0) {
			return "Field is not scheduled on this day.";
		}

		const withinSchedule = fieldSchedules.some((s) => {
			return start_time >= s.open_time && end_time <= s.close_time;
		});

		if (!withinSchedule) {
			return "Booking time is outside of open hours.";
		}

		const overlapping = bookings.some((b) => {
			return (
				b.field_id === parseInt(field_id) &&
				b.booking_date === booking_date &&
				b.id !== editId &&
				((start_time >= b.start_time && start_time < b.end_time) ||
					(end_time > b.start_time && end_time <= b.end_time) ||
					(start_time <= b.start_time && end_time >= b.end_time))
			);
		});

		if (overlapping) {
			return "Booking time overlaps with an existing booking.";
		}

		return null;
	};

	return (
		<div className="container mt-5">
			<h1 className="title">Booking User</h1>
			<form onSubmit={saveBooking} className="box">
				<div className="field">
					<label className="label">User</label>
					<div className="control">
						<input
							className="input"
							type="text"
							value={
								users.find((u) => u.id === parseInt(form.user_id))?.name ||
								"Unknown User"
							}
							disabled
						/>
					</div>
				</div>

				<div className="field">
					<label className="label">Field</label>
					<div className="control">
						<div className="select">
							<select
								value={form.field_id}
								onChange={(e) =>
									setForm({ ...form, field_id: e.target.value })
								}
								required
							>
								<option value="">Select Field</option>
								{fields.map((field) => (
									<option key={field.id} value={field.id}>
										{field.name}
									</option>
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
							onChange={(e) =>
								setForm({ ...form, booking_date: e.target.value })
							}
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
							onChange={(e) =>
								setForm({ ...form, start_time: e.target.value })
							}
							required
						/>
					</div>
					<div className="control">
						<label className="label">End Time</label>
						<input
							className="input"
							type="time"
							value={form.end_time}
							onChange={(e) =>
								setForm({ ...form, end_time: e.target.value })
							}
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
								onChange={(e) =>
									setForm({ ...form, status: e.target.value })
								}
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
						{editId ? "Update" : "Add"} Booking
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
								{users.find((u) => u.id === booking.user_id)?.name || "-"}
							</td>
							<td>
								{fields.find((f) => f.id === booking.field_id)?.name || "-"}
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

			{errorMessage && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.8)",
						color: "white",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1000,
					}}
				>
					<h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
						⚠️ Booking Failed
					</h2>
					<p
						style={{
							fontSize: "18px",
							maxWidth: "600px",
							textAlign: "center",
						}}
					>
						{errorMessage}
					</p>
					<button
						style={{
							marginTop: "30px",
							padding: "10px 20px",
							fontSize: "16px",
							background: "white",
							color: "black",
							borderRadius: "5px",
						}}
						onClick={() => setErrorMessage("")}
					>
						Close
					</button>
				</div>
			)}
		</div>
	);
};

export default BookingUser;
