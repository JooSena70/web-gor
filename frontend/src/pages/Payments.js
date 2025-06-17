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

	const getPayments = async () => {
		const res = await axios.get("http://localhost:5000/payments");
		setPayments(res.data);
	};

	const getBookings = async () => {
		const res = await axios.get("http://localhost:5000/bookings");
		setBookings(res.data);
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
		await axios.delete(`http://localhost:5000/payments/${id}`);
		getPayments();
	};

	return (
		<div className="container mt-5">
			<h1 className="title">Payment Management</h1>
			<form onSubmit={savePayment} className="box">
				<div className="field">
					<label className="label">Booking</label>
					<div className="control">
						<div className="select">
							<select
								value={form.booking_id}
								onChange={(e) =>
									setForm({ ...form, booking_id: e.target.value })
								}
								required
							>
								<option value="">Select Booking</option>
								{bookings.map((booking) => (
									<option key={booking.id} value={booking.id}>
										#{booking.id} - {booking.booking_date}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
				<div className="field">
					<div className="control"></div>
				</div>
				<div className="field">
					<label className="label">Payment Date</label>
					<div className="control">
						<input
							className="input"
							type="date"
							value={form.payment_date}
							onChange={(e) =>
								setForm({ ...form, payment_date: e.target.value })
							}
							required
						/>
					</div>
				</div>
				<div className="field">
					<label className="label">Method</label>
					<div className="control">
						<div className="select">
							<select
								value={form.method}
								onChange={(e) => setForm({ ...form, method: e.target.value })}
							>
								<option value="transfer">Transfer</option>
								<option value="cash">Cash</option>
								<option value="ewallet">E-Wallet</option>
							</select>
						</div>
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
								<option value="paid">Paid</option>
								<option value="unpaid">Failed</option>
							</select>
						</div>
					</div>
				</div>
				<div className="control">
					<button className="button is-primary" type="submit">
						{editId ? "Update" : "Add"} Payment
					</button>					
				</div>
			</form>

			<table className="table is-striped is-fullwidth">
				<thead>
					<tr>
						<th>No</th>
						<th>Booking</th>
						<th>Amount</th>
						<th>Payment Date</th>
						<th>Method</th>
						<th>Status</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{payments.map((payment, index) => (
						<tr key={payment.id}>
							<td>{index + 1}</td>
							<td>
								#{payment.booking_id} -{" "}
								{bookings.find((b) => b.id === payment.booking_id)
									?.booking_date || "-"}
							</td>
							<td>
								Rp{" "}
								{parseFloat(payment.amount).toLocaleString("id-ID", {
									minimumFractionDigits: 2,
								})}
							</td>
							<td>{payment.payment_date}</td>
							<td>{payment.method}</td>
							<td>{payment.status}</td>
							<td>								
								<button
									onClick={() => deletePayment(payment.id)}
									className="button is-small is-danger"
								>
									Delete
								</button>
							</td>
						</tr>
					))}
					{payments.length === 0 && (
						<tr>
							<td colSpan="7" className="has-text-centered">
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
