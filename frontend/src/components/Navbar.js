import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavbarUser from './NavbarUser';

const Navbar = () => {
  const location = useLocation();
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const role = localStorage.getItem('role');

  if (role === 'admin') {
    return (
      <nav className="navbar">
        <Link to="/admin">Home</Link>
        <Link to="/users">Users</Link>
        <Link to="/fields">Fields</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/schedules">Schedules</Link>
      </nav>
    );
  } else if (role === 'user') {
    return <NavbarUser />;
  } else {
    return null;
  }
};

export default Navbar;