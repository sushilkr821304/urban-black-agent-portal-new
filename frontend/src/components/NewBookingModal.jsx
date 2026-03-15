import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Phone, MapPin, Calendar, Clock, Car, Users, FileText } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const NewBookingModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickupLocation: '',
    dropLocation: '',
    tripDate: '',
    tripTime: '',
    vehicleType: 'Standard Sedan',
    passengersCount: 1,
    amount: '',
    specialNotes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Combine date and time
      const tripDateTime = `${formData.tripDate}T${formData.tripTime}`;
      
      const payload = {
        customer: {
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail
        },
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        tripDate: tripDateTime,
        tripTime: formData.tripTime,
        vehicleType: formData.vehicleType,
        passengersCount: parseInt(formData.passengersCount),
        amount: parseFloat(formData.amount),
        specialNotes: formData.specialNotes,
        status: 'NEW',
        paymentStatus: 'Pending'
      };

      await api.post('/bookings/create', payload);
      toast.success('Booking created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating booking:', err);
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="modal-container"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '800px', width: '90%' }}
        >
          <div className="modal-header">
            <h2 className="modal-title">Create New Booking</h2>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-grid-v3" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              
              {/* Customer Info */}
              <div className="form-section-title" style={{ gridColumn: '1 / -1', marginTop: '10px', fontSize: '15px', fontWeight: '700', color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                Customer Information
              </div>
              <div className="input-group">
                <label><User size={14} /> Full Name</label>
                <input name="customerName" value={formData.customerName} onChange={handleChange} required placeholder="e.g. Rahul Sharma" />
              </div>
              <div className="input-group">
                <label><Phone size={14} /> Phone Number</label>
                <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} required placeholder="e.g. 9155909858" />
              </div>
              <div className="input-group full-width">
                <label>Email Address (Optional)</label>
                <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="customer@email.com" />
              </div>

              {/* Trip Info */}
              <div className="form-section-title" style={{ gridColumn: '1 / -1', marginTop: '20px', fontSize: '15px', fontWeight: '700', color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                Trip Details
              </div>
              <div className="input-group">
                <label><MapPin size={14} /> Pickup Location</label>
                <input name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required placeholder="e.g. Pune Airport" />
              </div>
              <div className="input-group">
                <label><MapPin size={14} /> Drop Location</label>
                <input name="dropLocation" value={formData.dropLocation} onChange={handleChange} required placeholder="e.g. Mumbai Gateway of India" />
              </div>
              <div className="input-group">
                <label><Calendar size={14} /> Trip Date</label>
                <input type="date" name="tripDate" value={formData.tripDate} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label><Clock size={14} /> Trip Time</label>
                <input type="time" name="tripTime" value={formData.tripTime} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label><Car size={14} /> Vehicle Type</label>
                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                  <option value="Standard Sedan">Standard Sedan</option>
                  <option value="Premium Sedan">Premium Sedan</option>
                  <option value="SUV (6 Seater)">SUV (6 Seater)</option>
                  <option value="Luxury Car">Luxury Car</option>
                  <option value="Minibus">Minibus</option>
                </select>
              </div>
              <div className="input-group">
                <label><Users size={14} /> Passengers</label>
                <input type="number" name="passengersCount" value={formData.passengersCount} onChange={handleChange} min="1" max="50" />
              </div>
              <div className="input-group">
                <label>Total Fare (₹)</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required placeholder="e.g. 3500" />
              </div>

              <div className="input-group full-width">
                <label><FileText size={14} /> Special Notes</label>
                <textarea 
                  name="specialNotes" 
                  value={formData.specialNotes} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="Any extra instructions for the driver..."
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', resize: 'vertical' }}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ marginTop: '30px', padding: '20px 0 0 0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Creating...' : <><Save size={18} /> Confirm Booking</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NewBookingModal;
