import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, ChevronLeft, ChevronRight,
  Eye, Trash2, UserCheck, Download, FileText,
  Play, CheckCircle
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import NewBookingModal from '../components/NewBookingModal';
import BookingDetailsModal from '../components/BookingDetailsModal';
import AssignDriverModal from '../components/AssignDriverModal';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings', {
        params: {
          page: currentPage,
          size: pageSize,
          status: statusFilter === 'All' ? null : statusFilter,
          query: searchTerm || null
        }
      });
      setBookings(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/bookings/cancel/${id}`);
        toast.success('Booking cancelled');
        fetchBookings();
      } catch (err) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const handleStartTrip = async (id) => {
    try {
      await api.put(`/bookings/start/${id}`);
      toast.success('Trip started - In Progress');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to start trip');
    }
  };

  const handleCompleteTrip = async (id) => {
    try {
      await api.put(`/bookings/complete/${id}`);
      toast.success('Trip completed!');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to complete trip');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return { bg: '#DEF7EC', text: '#03543F' };
      case 'IN_PROGRESS': return { bg: '#F5F3FF', text: '#7C3AED' }; // Purple
      case 'NEW': return { bg: '#FEF3C7', text: '#92400E' }; // Yellow
      case 'CANCELLED': return { bg: '#FDE8E8', text: '#9B1C1C' }; // Red
      case 'ASSIGNED': return { bg: '#E1EFFE', text: '#1E429F' }; // Blue
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '1400px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Bookings Management</h1>
          <p className="page-subtitle">Centralized hub for all your passenger transit records.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.open('/api/bookings/export-csv', '_blank')}
            style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'white', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}
          >
            <Download size={18} /> Export CSV
          </button>
          <button className="btn-save" onClick={() => setIsNewModalOpen(true)} style={{ padding: '12px 24px', borderRadius: '12px' }}>
            <Plus size={20} /> New Booking
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '0' }}>

        {/* Toolbar */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { label: 'All', value: 'All' },
              { label: 'Upcoming', value: 'NEW' },
              { label: 'Assigned', value: 'ASSIGNED' },
              { label: 'In Progress', value: 'IN_PROGRESS' },
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Cancelled', value: 'CANCELLED' }
            ].map(f => (
              <button
                key={f.value}
                onClick={() => { setStatusFilter(f.value); setCurrentPage(0); }}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: statusFilter === f.value ? 'transparent' : '1px solid var(--border-color)',
                  background: statusFilter === f.value ? 'var(--primary)' : 'white',
                  color: statusFilter === f.value ? 'white' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  boxShadow: statusFilter === f.value ? '0 4px 12px rgba(108, 43, 217, 0.2)' : 'none'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by ID, Name, Phone or Route..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
              style={{
                padding: '12px 16px 12px 48px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                width: '100%',
                fontSize: '14px',
                background: '#F8F9FC'
              }}
            />
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#F8F9FC', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Booking ID</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Route (Pickup → Drop)</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Trip Date</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Amount</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '60px', textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto 16px', border: '3px solid #f3f3f3', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Fetching live data...</p>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '80px 24px', textAlign: 'center' }}>
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <FileText size={64} style={{ color: '#E2E8F0', marginBottom: '16px' }} />
                      <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '18px' }}>No records found</h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>Try broadening your filters or search keywords.</p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                bookings.map((bk, i) => (
                  <tr key={bk.id} className="v3-row" style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em' }}>{bk.bookingId}</span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '14px' }}>{bk.customerName || bk.customer?.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{bk.customerPhone || bk.customer?.phone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ maxWidth: '280px' }}>
                        <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ color: '#64748B' }}>From:</span> {bk.pickupLocation}
                        </p>
                        <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <span style={{ color: '#64748B' }}>To:</span> {bk.dropLocation}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{new Date(bk.tripDate).toLocaleDateString()}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(bk.tripDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        background: getStatusColor(bk.status).bg,
                        color: getStatusColor(bk.status).text
                      }}>
                        {bk.status}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', fontWeight: '800', color: '#0F172A', fontSize: '15px' }}>
                      ₹{bk.amount?.toLocaleString()}
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="icon-btn-v3" title="View Details" onClick={() => { setSelectedBooking(bk); setIsDetailsModalOpen(true); }}><Eye size={16} /></button>
                        
                        {bk.status === 'ASSIGNED' && (
                          <button 
                            className="icon-btn-v3" 
                            title="Start Trip" 
                            style={{ color: '#0ea5e9' }}
                            onClick={() => handleStartTrip(bk.id)}
                          >
                            <Play size={16} />
                          </button>
                        )}

                        {bk.status === 'IN_PROGRESS' && (
                          <button 
                            className="icon-btn-v3" 
                            title="Complete Trip" 
                            style={{ color: '#10b981' }}
                            onClick={() => handleCompleteTrip(bk.id)}
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        {!bk.driver && bk.status === 'NEW' && (
                          <button
                            className="icon-btn-v3"
                            title="Assign Driver"
                            style={{ color: '#7C3AED', borderColor: '#DDD6FE' }}
                            onClick={() => { setAssignTarget(bk); setIsAssignModalOpen(true); }}
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        {bk.status !== 'CANCELLED' && bk.status !== 'COMPLETED' && (
                          <button className="icon-btn-v3" title="Cancel Booking" style={{ color: '#EF4444' }} onClick={() => handleCancelBooking(bk.id)}><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 0 && (
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', background: '#F8F9FC' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
              Showing Page {currentPage + 1} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="pagination-btn"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={18} /> Previous
              </button>
              <button
                className="pagination-btn"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <NewBookingModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchBookings}
      />

      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        booking={selectedBooking}
        onAssignDriver={(bk) => { setAssignTarget(bk); setIsAssignModalOpen(true); }}
      />

      <AssignDriverModal
        isOpen={isAssignModalOpen}
        onClose={() => { setIsAssignModalOpen(false); setAssignTarget(null); }}
        booking={assignTarget}
        onSuccess={fetchBookings}
      />

      <style>{`
        .icon-btn-v3 {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: white;
          color: #64748B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .icon-btn-v3:hover {
          background: #F8F9FC;
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .pagination-btn {
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: white;
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .pagination-btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
          background: #F5F3FF;
        }
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BookingHistory;
