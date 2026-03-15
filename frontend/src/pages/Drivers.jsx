import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Phone, Car, MapPin, 
  Star, UserPlus, FileText, Loader, Trash2, Edit 
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/drivers');
      setDrivers(data);
    } catch (err) {
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return { bg: '#DEF7EC', text: '#03543F' };
      case 'BUSY': return { bg: '#FEF3C7', text: '#92400E' };
      case 'OFFLINE': return { bg: '#FDE8E8', text: '#9B1C1C' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      d.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone?.includes(searchTerm) ||
      d.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container" style={{ maxWidth: '1400px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Driver Management</h1>
          <p className="page-subtitle">Manage your fleet of professional drivers and vehicles.</p>
        </div>
        <button className="btn-save" style={{ padding: '12px 24px', borderRadius: '12px' }}>
          <UserPlus size={20} /> Add New Driver
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '0' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'AVAILABLE', 'BUSY', 'OFFLINE'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: statusFilter === f ? 'transparent' : '1px solid var(--border-color)',
                  background: statusFilter === f ? 'var(--primary)' : 'white',
                  color: statusFilter === f ? 'white' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: '700',
                  transition: 'all 0.2s',
                  boxShadow: statusFilter === f ? '0 4px 12px rgba(108, 43, 217, 0.2)' : 'none'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search Name, Phone or Vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Drivers Grid */}
        <div style={{ padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <Loader size={48} className="spinner" style={{ color: 'var(--primary)', margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)' }}>Loading drivers...</p>
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <Car size={64} style={{ color: '#E2E8F0', marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-main)', fontSize: '18px' }}>No drivers found</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>No drivers match your current filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {filteredDrivers.map(d => (
                <motion.div 
                  key={d.id}
                  whileHover={{ y: -4 }}
                  style={{
                    padding: '24px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    background: 'white',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '20px'
                      }}>
                        {d.driverName?.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>{d.driverName}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', marginTop: '4px' }}>
                          <Star size={14} fill="#F59E0B" />
                          <span style={{ fontSize: '13px', fontWeight: '700' }}>{d.rating || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: '800',
                      background: getStatusColor(d.status).bg,
                      color: getStatusColor(d.status).text
                    }}>
                      {d.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="driver-info-item">
                      <p className="label">Phone</p>
                      <p className="val"><Phone size={14} /> {d.phone}</p>
                    </div>
                    <div className="driver-info-item">
                      <p className="label">Vehicle</p>
                      <p className="val"><Car size={14} /> {d.vehicleNumber}</p>
                    </div>
                    <div className="driver-info-item">
                      <p className="label">Type</p>
                      <p className="val">{d.vehicleType}</p>
                    </div>
                    <div className="driver-info-item">
                      <p className="label">Location</p>
                      <p className="val"><MapPin size={14} /> {d.currentLocation || 'N/A'}</p>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '8px' }}>
                    <button className="secondary-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                      <Edit size={14} /> Edit
                    </button>
                    <button className="secondary-btn" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#EF4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <style>{`
        .driver-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .driver-info-item .label {
          margin: 0;
          font-size: 11px;
          text-transform: uppercase;
          color: #94A3B8;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .driver-info-item .val {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .secondary-btn:hover {
          background: #F8F9FC;
          border-color: #64748B;
        }
      `}</style>
    </div>
  );
};

export default Drivers;
