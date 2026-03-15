import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, Calendar, Clock, Car, Users, CreditCard, Tag, Printer, Download, UserCheck } from 'lucide-react';

const BookingDetailsModal = ({ isOpen, onClose, booking, onAssignDriver }) => {
  if (!isOpen || !booking) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED': return { bg: '#DEF7EC', text: '#03543F' };
      case 'IN_PROGRESS': return { bg: '#F5F3FF', text: '#7C3AED' }; // Purple
      case 'NEW': return { bg: '#FEF3C7', text: '#92400E' }; // Yellow
      case 'CANCELLED': return { bg: '#FDE8E8', text: '#9B1C1C' }; // Red
      case 'ASSIGNED': return { bg: '#E1EFFE', text: '#1E429F' }; // Blue
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const statusStyle = getStatusStyle(booking.status);

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="modal-container"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '700px' }}
        >
          <div className="modal-header">
            <div>
              <h2 className="modal-title">Booking Details</h2>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>ID: {booking.bookingId}</span>
            </div>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="modal-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '16px', background: '#F8F9FC', borderRadius: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', ...statusStyle }}>
                  {booking.status}
                </div>
                <div style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: '#E5E7EB', color: '#374151' }}>
                  {booking.paymentStatus}
                </div>
              </div>
              <h3 style={{ margin: 0, color: 'var(--primary)', fontWeight: '800', fontSize: '20px' }}>₹{booking.amount?.toLocaleString()}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

              {/* Left Column: Customer & Trip */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="detail-section">
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Customer</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <User size={16} color="var(--primary)" />
                    <span style={{ fontWeight: '600' }}>{booking.customerName || booking.customer?.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={16} color="var(--primary)" />
                    <span>{booking.customerPhone || booking.customer?.phone}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Trip Schedule</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Calendar size={16} color="var(--primary)" />
                    <span>{new Date(booking.tripDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={16} color="var(--primary)" />
                    <span>{new Date(booking.tripDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Vehicle</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Car size={16} color="var(--primary)" />
                    <span>{booking.vehicleType} ({booking.passengersCount} Pax)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Route & Driver */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="detail-section">
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Route</h4>
                  <div style={{ position: 'relative', paddingLeft: '24px' }}>
                    <div style={{ position: 'absolute', left: '0', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                    <div style={{ position: 'absolute', left: '3px', top: '13px', width: '2px', height: '20px', background: '#E2E8F0' }}></div>
                    <div style={{ position: 'absolute', left: '0', bottom: '5px', width: '8px', height: '8px', border: '2px solid var(--primary)', borderRadius: '2px', background: 'white' }}></div>

                    <div style={{ marginBottom: '16px' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Pickup</p>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{booking.pickupLocation}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Drop</p>
                      <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{booking.dropLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Driver Info</h4>
                  {booking.driver ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <UserCheck size={16} color="#10B981" />
                      <div>
                        <p style={{ margin: 0, fontWeight: '600' }}>{booking.driver.driverName}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{booking.driver.vehicleNumber}</p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: '#F59E0B', fontSize: '13px', fontWeight: '600' }}>Not Assigned Yet</p>
                  )}
                </div>
              </div>
            </div>

            {booking.specialNotes && (
              <div style={{ marginTop: '30px', padding: '16px', background: '#FFFBEB', borderRadius: '12px', border: '1px solid #FEF3C7' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '12px', textTransform: 'uppercase', color: '#92400E' }}>Special Notes</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#92400E' }}>{booking.specialNotes}</p>
              </div>
            )}

            <div style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
              <button 
                className="btn-save" 
                style={{ flex: 1 }}
                onClick={() => window.open(`/api/bookings/invoice/${booking.id}`, '_blank')}
              >
                <Download size={18} /> Invoice
              </button>
              <button 
                className="btn-outline" 
                style={{ flex: 1 }}
                onClick={() => window.print()}
              >
                <Printer size={18} /> Print
              </button>
              {!booking.driver && booking.status !== 'CANCELLED' && (
                <button 
                  className="btn-primary" 
                  style={{ flex: 2, background: '#7C3AED' }}
                  onClick={() => { onClose(); onAssignDriver(booking); }}
                >
                  <UserCheck size={18} /> Assign Driver
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingDetailsModal;
