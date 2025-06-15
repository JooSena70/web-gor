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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const bookingRes = await axios.get("http://localhost:5000/bookings");
				const fieldRes = await axios.get("http://localhost:5000/fields");
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
										} else {
											tds.push(
												<td
													key={`empty-${hour}`}
													style={{ textAlign: "center" }}
												>
													{/* empty */}
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
