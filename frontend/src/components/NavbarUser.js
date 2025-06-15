import React from 'react';
import { Link } from 'react-router-dom';

const NavbarUser = ({ onLogout }) => (
  <nav className="navbar">
    <Link to="/user">Home</Link>
    <Link to="/bookings_user">Bookings</Link>
    <Link to="/payments_user">Payments</Link>
    {/* Tambahkan link lain khusus user di sini */}
    <Link onClick={onLogout}>Logout</Link>
  </nav>
);

export default NavbarUser;
