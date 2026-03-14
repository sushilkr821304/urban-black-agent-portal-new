import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './context/WalletContext';

// Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard';
import Kyc from './pages/Kyc';
import MyProfile from './pages/MyProfile';
import BookingHistory from './pages/BookingHistory';
import Wallet from './pages/Wallet';
import Passbook from './pages/Passbook';
import Schedule from './pages/Schedule';
import Reviews from './pages/Reviews';
import Customers from './pages/Customers';
const MyServices = () => <div><h2>My Services</h2><p>Coming Soon...</p></div>;
const Earnings = () => <div><h2>Earnings Analytics</h2><p>Coming Soon...</p></div>;
const Support = () => <div><h2>Support & Help</h2><p>Coming Soon...</p></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <WalletProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes inside Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/kyc" element={<Kyc />} />
              <Route path="/bookings/history" element={<BookingHistory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/passbook" element={<Passbook />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/services" element={<MyServices />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/support" element={<Support />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WalletProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
