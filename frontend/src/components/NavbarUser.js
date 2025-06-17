import React from 'react';
import { Link } from 'react-router-dom';

const NavbarUser = ({ onLogout }) => (
  <nav className="navbar">
    <div
      className="navbar-brand"
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      <img src="/SEGOR.png" alt="SEGOR Logo" style={{ height: "40px" }} />
    </div>
    <div className='navbar-menu'>

      <Link to="/user">Home</Link>
      <Link to="/fields_user">Fields</Link>
      <Link to="/bookings_user">Bookings</Link>
      <Link to="/payments_user">Payments</Link>

    </div>
    <div>

      {/* Tambahkan link lain khusus user di sini */}
      <Link onClick={onLogout}>Logout</Link>

    </div>
  </nav>
);

export default NavbarUser;
