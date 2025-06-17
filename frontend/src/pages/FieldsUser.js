// src/pages/Fields.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Fields = () => {
	const [fields, setFields] = useState([]);
	const [name, setName] = useState("");
	const [type, setType] = useState("futsal");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [editingId, setEditingId] = useState(null);

	useEffect(() => {
		getFields();
	}, []);

	const getFields = async () => {
		try {
			const res = await axios.get("http://localhost:5000/fields");
			setFields(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const fieldData = {
			name,
			type,
			price_per_hour: parseFloat(price),
			description,
		};

		try {
			if (editingId === null) {
				await axios.post("http://localhost:5000/fields", fieldData);
			} else {
				await axios.put(`http://localhost:5000/fields/${editingId}`, fieldData);
				setEditingId(null);
			}
			resetForm();
			getFields();
		} catch (err) {
			console.error(err);
		}
	};

	const createForm = () => {
		resetForm();
		setEditingId(null);
	};

	const handleEdit = (field) => {
		setEditingId(field.id);
		setName(field.name);
		setType(field.type);
		setPrice(field.price_per_hour);
		setDescription(field.description || "");
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/fields/${id}`);
			getFields();
		} catch (err) {
			console.error(err);
		}
	};

	const resetForm = () => {
		setName("");
		setType("futsal");
		setPrice("");
		setDescription("");
	};

	return (
		<div className="container mt-5">
		

			<hr />

			<h2 className="title is-4">Field List</h2>
			<table className="table is-striped is-fullwidth">
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Type</th>
						<th>Price/Hour</th>
						<th>Description</th>
						
					</tr>
				</thead>
				<tbody>
					{fields.map((field, index) => (
						<tr key={field.id}>
							<td>{index + 1}</td>
							<td>{field.name}</td>
							<td>{field.type}</td>
							<td>
								Rp{" "}
								{parseFloat(field.price_per_hour).toLocaleString("id-ID", {
									minimumFractionDigits: 2,
								})}
							</td>
							<td>{field.description}</td>
							
						</tr>
					))}
					{fields.length === 0 && (
						<tr>
							<td colSpan="6" className="has-text-centered">
								No fields available
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default Fields;
