import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import './Auth.css';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length !== 10) {
      return Swal.fire('Error', 'Please enter a valid 10-digit phone number', 'error');
    }
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phoneNumber: formData.phoneNumber });
      Swal.fire('Success', 'Verification code sent!', 'success');
      setStep(2);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', {
        phoneNumber: formData.phoneNumber,
        otp: formData.otp
      });
      setStep(3);
    } catch (err) {
      Swal.fire('Error', 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire('Error', 'Passwords do not match', 'error');
    }
    setLoading(true);
    try {
      await api.post('/auth/signup', {
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });
      Swal.fire('Success', 'Account created! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-content">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
              >
                <div className="auth-header">
                  <h1>Signup</h1>
                  <p>Enter your phone number to get started</p>
                </div>
                <form onSubmit={handleSendOtp} className="auth-form">
                  <div className="phone-input-wrapper">
                    <span className="country-code">🇮🇳 +91</span>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      required
                    />
                  </div>
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                  <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
              >
                <div className="auth-header">
                  <h1>Verification</h1>
                  <p>Enter the 6-digit code sent to +91 ******{formData.phoneNumber.slice(-4)}</p>
                </div>
                <form onSubmit={handleVerifyOtp} className="auth-form">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    maxLength={6}
                    required
                  />
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button type="button" className="text-btn" onClick={() => setStep(1)}>
                    Back to Phone
                  </button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
              >
                <div className="auth-header">
                  <h1>Security</h1>
                  <p>Create a strong password for your account</p>
                </div>
                <form onSubmit={handleCreatePassword} className="auth-form">
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? 'Creating...' : 'Finish Signup'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="auth-visual">
          <img src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg" alt="Signup Graphic" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
