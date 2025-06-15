import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editId, setEditId] = useState(null);


  const getUsers = async () => {
    const res = await axios.get('http://localhost:5000/users');
    setUsers(res.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const saveUser = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:5000/users/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/users', form);
    }
    setForm({ name: '', email: '', password: '', role: 'user' });
    setEditId(null);
    getUsers();
  };

  const createUser = () => {
    setForm({ name: '', email: '', password: '', role: 'user' });
    setEditId(null);
  };

  const editUser = (user) => {
    setForm(user);
    setEditId(user.id);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    getUsers();
  };

  return (
    <div className="container mt-5">
      <h1 className="title">User Management</h1>
      <form onSubmit={saveUser} className="box">
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input className="input" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Role</label>
          <div className="control">
            <div className="select">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
        <div className="control">
          <button className="button is-primary mr-2" type="submit">{editId ? 'Update' : 'Add'} User</button>
          <button className="button is-light" type="button" onClick={() => createUser()}>Create</button>
        </div>
      </form>

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => editUser(user)} className="button is-small is-info mr-2">Edit</button>
                <button onClick={() => deleteUser(user.id)} className="button is-small is-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;