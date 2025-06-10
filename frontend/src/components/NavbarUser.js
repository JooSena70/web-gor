import React from 'react';
import { Link } from 'react-router-dom';

const NavbarUser = () => (
  <nav className="navbar">
    <Link to="/user">Home</Link>
    {/* Tambahkan link lain khusus user di sini */}
  </nav>
);

export default NavbarUser;