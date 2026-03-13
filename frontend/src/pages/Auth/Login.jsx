import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import './Auth.css';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      return Swal.fire('Error', 'Please enter a valid 10-digit phone number', 'error');
    }
    setLoading(true);
    try {
      await login(phoneNumber, password);
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/');
    } catch (err) {
      Swal.fire('Login Failed', err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-content">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-header"
          >
            <h1>Login</h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <div className="phone-input-wrapper">
                <span className="country-code">🇮🇳 +91</span>
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <input 
                type="password" 
                placeholder="Enter Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="auth-extra">
              <Link to="/forgot-password">Forgot Password.?</Link>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </button>

            <div className="auth-footer">
              New to Urban Black? <Link to="/signup">SignUp</Link>
            </div>
          </form>
        </div>
        <div className="auth-visual">
          <img src="https://img.freepik.com/free-vector/bus-driver-concept-illustration_114360-6432.jpg" alt="Login Graphic" />
        </div>
      </div>
    </div>
  );
};

export default Login;
