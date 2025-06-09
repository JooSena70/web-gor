import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Users from './pages/Users';
import Fields from './pages/Fields';
import Bookings from './pages/Bookings';
import Payments from './pages/Payments';
import Schedules from './pages/Schedules';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/schedules" element={<Schedules />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;