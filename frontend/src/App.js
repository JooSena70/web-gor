import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Users from './pages/Users';
import Fields from './pages/Fields';
import Bookings from './pages/Bookings';
import Payments from './pages/Payments';
import Schedules from './pages/Schedules';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeAdmin from './pages/HomeAdmin';
import HomeUser from './pages/HomeUser';
import PaymentsUser from './pages/PaymentsUser'; // Assuming you have a PaymentsUser page
import BookingsUser from './pages/BookingsUser'; // Assuming you have a BookingsUser page
import FieldsUser from './pages/FieldsUser'; // Assuming you have a FieldsUser page

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/users" element={<Users />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/user" element={<HomeAdmin />} />  
        <Route path="/payments_user" element={<PaymentsUser />} />
        <Route path="/bookings_user" element={<BookingsUser />} />
        <Route path='/fields_user' element={<FieldsUser />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;