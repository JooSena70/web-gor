import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', form);
      localStorage.setItem('role', res.data.role);
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ margin: '2rem auto', maxWidth: '400px' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input 
            type="email" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            required 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input 
            type="password" 
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })} 
            required 
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#3273dc', color: 'white', border: 'none' }}>
          Login
        </button>
      </form>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <span>Don't have an account? </span>
        <Link to="/register">Signup now</Link>
      </div>
    </div>
  );
};

export default Login;