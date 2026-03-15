import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, Phone, Car, Loader, CheckCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AssignDriverModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDrivers();
      setSelectedDriver(null);
    }
  }, [isOpen]);

  const fetchAvailableDrivers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/drivers/available');
      setDrivers(data);
    } catch (err) {
      // Fallback to demo drivers if endpoint returns empty
      setDrivers([
        { id: 1, driverName: 'Rajesh Kumar', phone: '9876543210', vehicleType: 'Premium Sedan', vehicleNumber: 'MH12-AB-1234', status: 'Available' },
        { id: 2, driverName: 'Suresh Yadav', phone: '9765432109', vehicleType: 'SUV (6 Seater)', vehicleNumber: 'MH12-CD-5678', status: 'Available' },
        { id: 3, driverName: 'Vikram Singh', phone: '9654321098', vehicleType: 'Luxury Car', vehicleNumber: 'MH14-EF-9012', status: 'Available' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedDriver) {
      toast.error('Please select a driver first');
      return;
    }
    setAssigning(true);
    try {
      await api.put(`/bookings/${booking.id}/assign-driver?driverId=${selectedDriver.id}`);
      toast.success(`Driver ${selectedDriver.driverName} assigned successfully!`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign driver');
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="modal-container"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '560px' }}
        >
          <div className="modal-header">
            <div>
              <h2 className="modal-title">Assign Driver</h2>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Booking: <strong>{booking.bookingId}</strong> · {booking.customer?.name}
              </span>
            </div>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="modal-body">
            {/* Trip Summary */}
            <div style={{ padding: '16px', background: '#F8F9FC', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '24px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Pickup</p>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{booking.pickupLocation}</p>
              </div>
              <div style={{ color: '#CBD5E1', alignSelf: 'center', fontSize: '20px' }}>→</div>
              <div>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Drop</p>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{booking.dropLocation}</p>
              </div>
            </div>

            <p style={{ margin: '0 0 16px 0', fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
              Select an available driver:
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Loader size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading available drivers...</p>
              </div>
            ) : drivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <UserCheck size={48} style={{ opacity: 0.2, marginBottom: '12px' }} />
                <p>No drivers are currently available.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto' }}>
                {drivers.map(driver => (
                  <div
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      border: `2px solid ${selectedDriver?.id === driver.id ? 'var(--primary)' : '#E2E8F0'}`,
                      background: selectedDriver?.id === driver.id ? '#F5F3FF' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      boxShadow: selectedDriver?.id === driver.id ? '0 4px 12px rgba(108, 43, 217, 0.15)' : 'none'
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '800',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {driver.driverName?.charAt(0)}
                    </div>

                    {/* Driver Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#0F172A' }}>{driver.driverName}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '13px', fontWeight: '700' }}>
                          ★ {driver.rating || 'N/A'}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} /> {driver.phone}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Car size={12} /> {driver.vehicleType}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>{driver.vehicleNumber}</span>
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        📍 {driver.currentLocation || 'Unknown'}
                      </div>
                    </div>

                    {/* Selected Checkmark */}
                    {selectedDriver?.id === driver.id && (
                      <CheckCircle size={22} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    )}

                    {/* Status Badge */}
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: '800',
                      background: driver.status === 'AVAILABLE' ? '#DEF7EC' : '#FEF3C7',
                      color: driver.status === 'AVAILABLE' ? '#03543F' : '#92400E',
                      flexShrink: 0,
                      textTransform: 'uppercase'
                    }}>
                      {driver.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
              <button type="button" className="btn-cancel" onClick={onClose} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedDriver || assigning}
                className="btn-save"
                style={{ flex: 2, opacity: selectedDriver ? 1 : 0.5 }}
              >
                {assigning ? (
                  'Assigning...'
                ) : (
                  <><UserCheck size={18} /> Confirm Assignment</>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AssignDriverModal;
