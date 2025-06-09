import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/users">Users</Link>
      <Link to="/fields">Fields</Link>
      <Link to="/bookings">Bookings</Link>
      <Link to="/payments">Payments</Link>
      <Link to="/schedules">Schedules</Link>
    </nav>
  );
};

export default Navbar;  