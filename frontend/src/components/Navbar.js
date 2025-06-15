import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarUser from "./NavbarUser";

const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();

	if (location.pathname === "/login" || location.pathname === "/register") {
		return null;
	}

	const role = localStorage.getItem("role");

	const handleLogout = async () => {
		try {
			await axios.post(
				"http://localhost:5000/logout",
				{},
				{ withCredentials: true }
			);
			localStorage.removeItem("role");
			navigate("/login");
		} catch (err) {
			console.error("Logout failed", err);
		}
	};

	if (role === "admin") {
		return (
			<nav className="navbar">
				<div
					className="navbar-brand"
					style={{ display: "flex", alignItems: "center", gap: "10px" }}
				>
					<img src="/SEGOR.png" alt="SEGOR Logo" style={{ height: "40px" }} />
				</div>
				<div className="navbar-menu">
					<Link to="/admin">Home</Link>
					<Link to="/users">Users</Link>
					<Link to="/fields">Fields</Link>
					<Link to="/bookings">Bookings</Link>
					<Link to="/payments">Payments</Link>
					<Link to="/schedules">Schedules</Link>
				</div>
				<div>
					<Link onClick={handleLogout}>Logout</Link>
				</div>
			</nav>
		);
	} else if (role === "user") {
		return <NavbarUser onLogout={handleLogout} />;
	} else {
		return null;
	}
};

export default Navbar;
