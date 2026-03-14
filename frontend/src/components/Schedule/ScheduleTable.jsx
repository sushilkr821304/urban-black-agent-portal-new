import React from 'react';
import { Eye } from 'lucide-react';

const ScheduleRow = ({ trip, onView }) => {
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
    <tr style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
      <td style={{ padding: '16px 24px', fontWeight: '800', color: 'var(--primary)' }}>{trip.bookingId}</td>
      <td style={{ padding: '16px 24px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600' }}>{new Date(trip.tripDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(trip.tripDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </td>
      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{trip.pickupLocation}</td>
      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{trip.dropLocation}</td>
      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600' }}>{trip.customer?.name}</td>
      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{trip.driver ? trip.driver.driverName : 'Not Assigned'}</td>
      <td style={{ padding: '16px 24px', fontSize: '14px' }}>{trip.vehicleType}</td>
      <td style={{ padding: '16px 24px' }}>
        <span style={{
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '800',
          textTransform: 'uppercase',
          background: statusStyle.bg,
          color: statusStyle.text
        }}>
          {trip.status}
        </span>
      </td>
      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
        <button 
          onClick={() => onView(trip)}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            background: 'white',
            color: '#64748B',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Eye size={16} />
        </button>
      </td>
    </tr>
  );
};

const ScheduleTable = ({ trips, loading, onView }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: '#F8F9FC', borderBottom: '1px solid var(--border-color)' }}>
          <tr>
            <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Booking ID</th>
            <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Trip Date</th>
            <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Pickup</th>
            <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Drop</th>
            <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Customer</th>
            <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Driver</th>
            <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Vehicle</th>
            <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Trip Status</th>
            <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="9" style={{ padding: '40px', textAlign: 'center' }}>Loading trips...</td></tr>
          ) : trips.length === 0 ? (
            <tr><td colSpan="9" style={{ padding: '40px', textAlign: 'center' }}>No trips found for the selected filter.</td></tr>
          ) : (
            trips.map(trip => <ScheduleRow key={trip.id} trip={trip} onView={onView} />)
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
