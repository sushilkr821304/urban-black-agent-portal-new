import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Simulated fetch or real fetch depending on backend readiness
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/history');
        setBookings(data);
      } catch (err) {
        // Fallback to mock data if API fails to prevent empty state in demo
        setBookings([
          { id: 'UB-001', customer: 'Rahul Sharma', route: 'Pune to Mumbai', date: '2026-03-12', status: 'Completed', amount: 3500 },
          { id: 'UB-002', customer: 'Amit Kumar', route: 'Airport Drop', date: '2026-03-13', status: 'In Progress', amount: 1200 },
          { id: 'UB-003', customer: 'Priya Singh', route: 'City Tour', date: '2026-03-14', status: 'Upcoming', amount: 4500 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return { bg: '#DEF7EC', text: '#03543F' };
      case 'In Progress': return { bg: '#E1EFFE', text: '#1E429F' };
      case 'Upcoming': return { bg: '#FEF3C7', text: '#92400E' };
      case 'Cancelled': return { bg: '#FDE8E8', text: '#9B1C1C' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = (b.bookingId || b.id || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.customerName || b.customer || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Bookings History</h1>
        <p className="page-subtitle">View and manage all your past and upcoming trips.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '0' }}>
        
        {/* Filters and Search Bar */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Upcoming', 'In Progress', 'Completed', 'Cancelled'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  border: filter === f ? 'transparent' : '1px solid var(--border-color)',
                  background: filter === f ? 'var(--primary)' : 'transparent',
                  color: filter === f ? 'white' : 'var(--text-muted)',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'var(--transition-fast)'
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '10px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search by ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '280px' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#F9FAFB' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking ID</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Route</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>Loading bookings...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                    <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>No bookings found</h3>
                    <p style={{ margin: 0 }}>Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((bk, i) => (
                   <tr key={bk.id} style={{ borderBottom: i === filteredBookings.length - 1 ? 'none' : '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px 24px', fontWeight: '600' }}>{bk.bookingId || bk.id}</td>
                    <td style={{ padding: '16px 24px' }}>{bk.customerName || bk.customer}</td>
                    <td style={{ padding: '16px 24px' }}>{bk.serviceType || bk.route}</td>
                    <td style={{ padding: '16px 24px' }}>{bk.date ? new Date(bk.date).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        background: getStatusColor(bk.status).bg,
                        color: getStatusColor(bk.status).text
                      }}>
                        {bk.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: 'var(--text-main)' }}>₹{bk.amount?.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingHistory;
