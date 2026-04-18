import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dev" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="login" element={<AdminLogin />} />
      </Route>
    </Routes>
  );
}
