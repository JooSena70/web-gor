import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomeAdmin = () => {
	const today = new Date();
	const [selectedDate, setSelectedDate] = useState(
		today.toISOString().split("T")[0]
	); // YYYY-MM-DD
	const [bookings, setBookings] = useState([]);
	const [fields, setFields] = useState([]);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const navigate = useNavigate();
	const [schedules, setSchedules] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const bookingRes = await axios.get("http://localhost:5000/bookings");
				const fieldRes = await axios.get("http://localhost:5000/fields");
				const schedulesRes = await axios.get("http://localhost:5000/schedules");
				setSchedules(schedulesRes.data);
				setBookings(bookingRes.data);
				setFields(fieldRes.data);
			} catch (error) {
				console.error(error);
			}
		};

		const checkSession = async () => {
			try {
				const res = await axios.get("http://localhost:5000/session", {
					withCredentials: true,
				});
				localStorage.setItem("role", res.data.role || res.data.user.role);
			} catch (err) {
				localStorage.removeItem("role");
				navigate("/login");
			}
		};
		fetchData();
		checkSession();
	}, [navigate]);

	// Filter bookings for selected date
	const filteredBookings = bookings.filter(
		(b) => new Date(b.booking_date).toISOString().split("T")[0] === selectedDate
	);

	const isHourBooked = (booking, hour) => {
		const startHour = parseInt(booking.start_time.split(":")[0], 10);
		const endHour = parseInt(booking.end_time.split(":")[0], 10);
		return hour >= startHour && hour <= endHour;
	};

	const getBookingAtHour = (fieldId, hour) => {
		return filteredBookings.find(
			(b) => b.field_id === fieldId && isHourBooked(b, hour)
		);
	};

	const getFieldName = (fieldId) => {
		const field = fields.find((f) => f.id === fieldId);
		return field ? field.name : `Field #${fieldId}`;
	};

	const isHourOpenBySchedule = (fieldId, hour, date) => {
		const day = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
		const dayStr = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		][day];

		return schedules.some((s) => {
			if (s.field_id !== fieldId) return false;
			if (s.day !== dayStr) return false;

			const openHour = parseInt(s.open_time.split(":")[0], 10);
			const closeHour = parseInt(s.close_time.split(":")[0], 10);

			return hour >= openHour && hour < closeHour;
		});
	};

	const getScheduleForDay = (fieldId, date) => {
		const day = new Date(date).getDay(); // 0 = Sunday, ..., 6 = Saturday
		const dayStr = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		][day];

		// Filter all schedules matching field & day
		return schedules.filter((s) => s.field_id === fieldId && s.day === dayStr);
	};

	return (
		<div className="container mt-5">
			<h1 className="title mb-4">Admin Gantenk</h1>

			<div className="field">
				<label htmlFor="label">
					<strong>Select a Date:</strong>
				</label>
				<input
					id="dateInput"
					type="date"
					className="input"
					value={selectedDate}
					onChange={(e) => setSelectedDate(e.target.value)}
				/>
			</div>

			<h4>Bookings on {new Date(selectedDate).toDateString()}</h4>

			<div className="overflow-scroll">
				<div className="mt-3">
					<span className="legend-booked">Booked</span>
					<span className="legend-open">Open</span>
					<span className="legend-closed">Closed</span>
				</div>
				<table className="table table-bordered mt-3">
					<thead>
						<tr>
							<th>Field</th>
							{[...Array(24)].map((_, hour) => (
								<th key={hour}>{hour.toString().padStart(2, "0")}:00</th>
							))}
						</tr>
					</thead>
					<tbody>
						{fields.map((field) => (
							<tr key={field.id}>
								<td>{getFieldName(field.id)}</td>
								{(() => {
									const tds = [];
									let hour = 0;
									while (hour < 24) {
										const booking = getBookingAtHour(field.id, hour);

										if (booking) {
											const startHour = parseInt(
												booking.start_time.split(":")[0],
												10
											);
											const endHour = parseInt(
												booking.end_time.split(":")[0],
												10
											);
											const span = endHour - startHour;

											// Avoid duplicate td for same booking.id
											const alreadyRendered = tds.find(
												(td) => td.key === `booking-${booking.id}`
											);
											if (alreadyRendered) {
												hour++; // skip this hour
												continue;
											}

											tds.push(
												<td
													key={`booking-${booking.id}`}
													colSpan={span}
													onClick={() => setSelectedBooking(booking)}
													style={{
														backgroundColor: "#ffcccb",
														cursor: "pointer",
														textAlign: "center",
													}}
												>
													{booking.start_time.slice(0, 5)} -{" "}
													{booking.end_time.slice(0, 5)}
												</td>
											);
											hour += span;
										} else if (
											isHourOpenBySchedule(field.id, hour, selectedDate)
										) {
											tds.push(
												<td
													key={`open-${hour}`}
													style={{
														backgroundColor: "#d4edda", // light green for open slot
														textAlign: "center",
													}}
												>
													{/* Open */}
												</td>
											);
											hour++;
										} else {
											tds.push(
												<td
													key={`closed-${hour}`}
													style={{
														textAlign: "center",
													}}
												>
													{/* Closed */}
												</td>
											);
											hour++;
										}
									}
									return tds;
								})()}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<h4 className="mt-5">Weekly Overview</h4>
			<div className="overflow-scroll">
				<div className="mt-3">
					<span className="legend-booked">Booked</span>
					<span className="legend-open">Open (Scheduled)</span>
					<span className="legend-closed">Closed</span>
				</div>
				<table className="table table-bordered mt-3">
					<thead>
						<tr>
							<th>Field</th>
							{[
								"Monday",
								"Tuesday",
								"Wednesday",
								"Thursday",
								"Friday",
								"Saturday",
								"Sunday",
							].map((day) => (
								<th key={day}>{day}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{fields.map((field) => (
							<tr key={field.id}>
								<td>{getFieldName(field.id)}</td>
								{[...Array(7)].map((_, i) => {
									const dayDate = new Date(selectedDate);
									const dayOffset = (dayDate.getDay() + 6) % 7; // Convert Sun=0 to Mon=0
									dayDate.setDate(dayDate.getDate() - dayOffset + i); // Set to current week day i

									const dateStr = dayDate.toISOString().split("T")[0];

									const bookingsOnDay = bookings.filter(
										(b) =>
											b.field_id === field.id &&
											new Date(b.booking_date).toISOString().split("T")[0] ===
												dateStr
									);

									return (
										<td key={i} style={{ textAlign: "center" }}>
											{bookingsOnDay.length > 0 ? (
												bookingsOnDay.map((b) => (
													<div
														key={b.id}
														style={{
															cursor: "pointer",
															backgroundColor: "#ffcccb",
															marginBottom: "3px",
															padding: "2px",
														}}
														onClick={() => setSelectedBooking(b)}
													>
														{b.start_time.slice(0, 5)} -{" "}
														{b.end_time.slice(0, 5)}
													</div>
												))
											) : getScheduleForDay(field.id, dateStr).length > 0 ? (
												getScheduleForDay(field.id, dateStr).map((s, idx) => (
													<div
														key={idx}
														style={{
															backgroundColor: "#d4edda",
															marginBottom: "3px",
															padding: "2px",
														}}
													>
														{s.open_time.slice(0, 5)} -{" "}
														{s.close_time.slice(0, 5)}
													</div>
												))
											) : (
												<span>-</span>
											)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{selectedBooking && (
				<div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<button
							className="modal-close"
							onClick={() => setSelectedBooking(null)}
						>
							×
						</button>
						<h2>Booking Details</h2>
						<p>
							<strong>ID:</strong> {selectedBooking.id}
						</p>
						<p>
							<strong>User ID:</strong> {selectedBooking.user_id}
						</p>
						<p>
							<strong>Field:</strong> {getFieldName(selectedBooking.field_id)}
						</p>
						<p>
							<strong>Date:</strong> {selectedBooking.booking_date}
						</p>
						<p>
							<strong>Time:</strong> {selectedBooking.start_time.slice(0, 5)} -{" "}
							{selectedBooking.end_time.slice(0, 5)}
						</p>
						<p>
							<strong>Status:</strong> {selectedBooking.status}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default HomeAdmin;
