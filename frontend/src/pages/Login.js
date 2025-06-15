import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../Login.css"; // Import the CSS file

const Login = () => {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:5000/login", form, {
				withCredentials: true,
			});
			localStorage.setItem("role", res.data.role);
			if (res.data.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/user");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
		}
	};

	return (
		<div className="login-container">
			<h1>Login</h1>
			<form className="login-form" onSubmit={handleSubmit}>
				{error && <p className="error-message">{error}</p>}
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						required
					/>
				</div>
				<button type="submit" className="login-button">
					Login
				</button>
			</form>
			<div className="signup-link">
				<span>Don't have an account? </span>
				<Link to="/register">Signup now</Link>
			</div>
		</div>
	);
};

export default Login;
