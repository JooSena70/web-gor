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
      <h1 className="title">{editingId ? "Edit Field" : "Add New Field"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        </div>

        <div className="field">
          <label className="label">Type</label>
          <div className="control">
            <div className="select">
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="futsal">Futsal</option>
                <option value="badminton">Badminton</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Price per Hour</label>
          <div className="control">
            <input className="input" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
        </div>

        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
        </div>

        <div className="field is-grouped mt-4">
          <div className="control">
            <button className="button is-link" type="submit">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
          <div className="control">
          </div>
        </div>
      </form>

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>{index + 1}</td>
              <td>{field.name}</td>
              <td>{field.type}</td>
              <td>Rp {parseFloat(field.price_per_hour).toLocaleString("id-ID", { minimumFractionDigits: 2 })}</td>
              <td>{field.description}</td>
              <td>
                <button className="button is-small is-info mr-2" onClick={() => handleEdit(field)}>
                  Edit
                </button>
                <button className="button is-small is-danger" onClick={() => handleDelete(field.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {fields.length === 0 && (
            <tr>
              <td colSpan="6" className="has-text-centered">No fields available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Fields;
