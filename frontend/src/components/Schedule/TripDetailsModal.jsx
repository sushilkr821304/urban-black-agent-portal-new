import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, Calendar, Clock, Car, UserCheck, CreditCard } from 'lucide-react';

const TripDetailsModal = ({ isOpen, onClose, trip }) => {
  if (!isOpen || !trip) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return { bg: '#FEF3C7', text: '#92400E' };
      case 'Assigned': return { bg: '#E5EDFF', text: '#3F66D5' };
      case 'In Progress': return { bg: '#F3E8FF', text: '#6B21A8' };
      case 'Completed': return { bg: '#DEF7EC', text: '#03543F' };
      case 'Cancelled': return { bg: '#FDE8E8', text: '#9B1C1C' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const statusStyle = getStatusColor(trip.status);

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="modal-container"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '650px' }}
        >
          <div className="modal-header">
            <div>
              <h2 className="modal-title">Trip Details</h2>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Booking ID: {trip.bookingId}</span>
            </div>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="modal-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '12px 16px', background: '#F8F9FC', borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', ...statusStyle }}>{trip.status}</span>
                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', background: '#E5E7EB', color: '#374151' }}>{trip.paymentStatus || 'PENDING'}</span>
              </div>
              <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '18px' }}>₹{trip.amount?.toLocaleString()}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="detail-group">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}><User size={16} color="var(--primary)" /> <b>{trip.customer?.name}</b></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} color="var(--primary)" /> {trip.customer?.phone}</div>
              </div>

              <div className="detail-group">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Trip Schedule</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}><Calendar size={16} color="var(--primary)" /> {new Date(trip.tripDate).toLocaleDateString()}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={16} color="var(--primary)" /> {new Date(trip.tripDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>

              <div className="detail-group" style={{ gridColumn: 'span 2' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Route</h4>
                <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px dashed #E2E8F0', marginLeft: '8px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Pickup</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{trip.pickupLocation}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Drop</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{trip.dropLocation}</p>
                  </div>
                </div>
              </div>

              <div className="detail-group">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vehicle</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Car size={16} color="var(--primary)" /> {trip.vehicleType}</div>
              </div>

              <div className="detail-group">
                <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Driver Info</h4>
                {trip.driver ? (
                   <div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}><UserCheck size={16} color="#10B981" /> <b>{trip.driver.driverName}</b></div>
                     <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '26px' }}>{trip.driver.phone}</span>
                   </div>
                ) : (
                  <span style={{ color: '#F59E0B', fontSize: '13px', fontWeight: '600' }}>Not Assigned Yet</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={onClose} style={{ minWidth: '120px' }}>Close</button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TripDetailsModal;
