import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Phone, Mail, MapPin, 
  History, MessageSquare, Eye, X,
  ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/customers', {
        params: {
          page: currentPage,
          size: pageSize,
          query: searchTerm
        }
      });
      setCustomers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      toast.error('Failed to load customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const handleViewProfile = async (id) => {
    setSelectedCustomerId(id);
    try {
      const { data } = await api.get(`/customers/${id}`);
      setCustomerDetails(data);
      setIsProfileModalOpen(true);
    } catch (err) {
      toast.error('Failed to load customer profile');
    }
  };

  const handleViewHistory = async (id) => {
    setSelectedCustomerId(id);
    try {
      const { data } = await api.get(`/customers/${id}/bookings`);
      setBookingHistory(data);
      setIsHistoryModalOpen(true);
    } catch (err) {
      toast.error('Failed to load booking history');
    }
  };

  const getStatusColor = (status) => {
    return { bg: '#DEF7EC', text: '#03543F' }; // Assuming Active for now
  };

  return (
    <div className="page-container" style={{ maxWidth: '1400px' }}>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 className="page-title">Customers</h1>
        <p className="page-subtitle">Manage and view all customer bookings from one place.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="premium-card" 
        style={{ padding: '0', overflow: 'hidden' }}
      >
        {/* Toolbar */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '350px', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by Name or Mobile Number..." 
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
          <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} /> Filter List
          </button>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#F8F9FC', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Customer Name</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Mobile Number</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>City</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Total Bookings</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Last Booking</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '18px 24px', fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '60px', textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto 16px', border: '3px solid #f3f3f3', borderTop: '3px solid var(--primary)', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Loading customers...</p>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>No customers found</h3>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>Try adjusting your search or check back later.</p>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                          {c.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontWeight: '500' }}>{c.phone}</td>
                    <td style={{ padding: '20px 24px', color: 'var(--text-muted)' }}>{c.email || 'N/A'}</td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} color="#94a3b8" /> {c.city || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                      <span style={{ fontWeight: '800', background: '#F1F5F9', padding: '4px 10px', borderRadius: '8px', fontSize: '13px' }}>{c.totalBookings}</span>
                    </td>
                    <td style={{ padding: '20px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      {c.lastBookingDate ? new Date(c.lastBookingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No bookings'}
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', ...getStatusColor(c.status) }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleViewProfile(c.id)} title="View Profile" style={actionBtnStyle}><Eye size={16} /></button>
                        <button onClick={() => handleViewHistory(c.id)} title="Booking History" style={actionBtnStyle}><History size={16} /></button>
                        <a href={`tel:${c.phone}`} title="Contact Customer" style={actionBtnStyle}><MessageSquare size={16} /></a>
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
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-container"
              style={{ maxWidth: '550px' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">Customer Profile</h2>
                <button className="close-btn" onClick={() => setIsProfileModalOpen(false)}><X size={20} /></button>
              </div>
              <div className="modal-body" style={{ padding: '32px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px', fontWeight: 'bold', boxShadow: '0 8px 16px rgba(108, 43, 217, 0.2)' }}>
                    {customerDetails?.name?.charAt(0)}
                  </div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>{customerDetails?.name}</h3>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>Customer since {new Date(customerDetails?.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="info-item">
                    <p style={labelStyle}>Mobile</p>
                    <p style={valueStyle}>{customerDetails?.phone}</p>
                  </div>
                  <div className="info-item">
                    <p style={labelStyle}>Email</p>
                    <p style={valueStyle}>{customerDetails?.email || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <p style={labelStyle}>City</p>
                    <p style={valueStyle}>{customerDetails?.city || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <p style={labelStyle}>Status</p>
                    <span style={{ padding: '4px 8px', borderRadius: '12px', background: '#DEF7EC', color: '#03543F', fontSize: '11px', fontWeight: '800' }}>{customerDetails?.status}</span>
                  </div>
                  <div className="info-item" style={{ gridColumn: 'span 2' }}>
                    <p style={labelStyle}>Address</p>
                    <p style={valueStyle}>{customerDetails?.address || 'N/A'}</p>
                  </div>
                </div>

                <div style={{ marginTop: '32px', padding: '20px', background: '#F8F9FC', borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' }}>
                  <div>
                    <History size={20} style={{ margin: '0 auto 8px', color: 'var(--primary)' }} />
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Total Bookings</p>
                    <p style={{ margin: 0, fontWeight: '800', fontSize: '18px' }}>{customerDetails?.totalBookings}</p>
                  </div>
                  <div>
                    <History size={20} style={{ margin: '0 auto 8px', color: '#10B981' }} />
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Completed</p>
                    <p style={{ margin: 0, fontWeight: '800', fontSize: '18px' }}>{customerDetails?.completedTrips}</p>
                  </div>
                  <div>
                    <History size={20} style={{ margin: '0 auto 8px', color: '#EF4444' }} />
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Cancelled</p>
                    <p style={{ margin: 0, fontWeight: '800', fontSize: '18px' }}>{customerDetails?.cancelledTrips}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isHistoryModalOpen && (
          <div className="modal-overlay" onClick={() => setIsHistoryModalOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-container"
              style={{ maxWidth: '800px' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">Booking History</h2>
                <button className="close-btn" onClick={() => setIsHistoryModalOpen(false)}><X size={20} /></button>
              </div>
              <div className="modal-body" style={{ padding: '0' }}>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F8F9FC', position: 'sticky', top: 0, zIndex: 1, borderBottom: '1px solid var(--border-color)' }}>
                      <tr>
                        <th style={thStyle}>Booking ID</th>
                        <th style={thStyle}>Route</th>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Fare</th>
                        <th style={thStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingHistory.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No bookings found.</td></tr>
                      ) : (
                        bookingHistory.map(b => (
                          <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={tdStyle}>{b.bookingId}</td>
                            <td style={tdStyle}>{b.pickupLocation} &rarr; {b.dropLocation}</td>
                            <td style={tdStyle}>{new Date(b.tripDate).toLocaleDateString()}</td>
                            <td style={tdStyle}>₹{b.amount}</td>
                            <td style={tdStyle}>
                              <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', padding: '4px 8px', borderRadius: '12px', background: '#F1F5F9' }}>{b.status}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .table-row-hover:hover {
          background-color: #F8FAFC !important;
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

const actionBtnStyle = {
  width: '34px',
  height: '34px',
  borderRadius: '10px',
  border: '1px solid #E2E8F0',
  background: 'white',
  color: '#64748B',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  textDecoration: 'none'
};

const labelStyle = { margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' };
const valueStyle = { margin: 0, fontWeight: '600', fontSize: '15px' };
const thStyle = { padding: '16px 20px', fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', textAlign: 'left' };
const tdStyle = { padding: '16px 20px', fontSize: '13px', color: 'var(--text-main)' };

export default Customers;
