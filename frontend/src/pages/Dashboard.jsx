import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, TrendingUp, Calendar, CheckCircle, 
  XCircle, Clock, Plus, MapPin, Car, 
  UserPlus, MessageCircle, Phone, FileText, 
  HelpCircle, ShieldCheck, ArrowRight, User, AlertTriangle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { balance } = useWallet();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  const agentName = user?.agent?.name || 'Agent';
  const agentId = `UB-AG-${user?.agent?.id?.toString().padStart(4, '0') || '0000'}`;
  
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes, activitiesRes, analyticsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/recent-bookings'),
        api.get('/dashboard/activities'),
        api.get('/dashboard/analytics')
      ]);

      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data);
      setActivities(activitiesRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Mock data for UI development if API is not fully ready
      setStats({
        walletBalance: balance || 501,
        todayBookings: 8,
        totalBookings: 245,
        overallEarnings: 54000,
        todayCommission: 350,
        pendingBookings: 4,
        completedBookings: 230,
        cancelledBookings: 15
      });
      setRecentBookings([
        { id: 'UB2345', customerName: 'Rahul', serviceType: 'Airport Drop', amount: 2400, status: 'Completed', date: '2026-03-13' },
        { id: 'UB2346', customerName: 'Aman', serviceType: 'City Trip', amount: 1800, status: 'Pending', date: '2026-03-13' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    'Completed': { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
    'In Progress': { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' },
    'Pending': { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
    'Cancelled': { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' }
  };

  if (loading && !stats) return <div className="loading-container">Loading Dashboard...</div>;

  const distributionData = [
    { name: 'Completed', value: stats?.completedBookings || 230, color: '#10B981' },
    { name: 'Pending', value: stats?.pendingBookings || 4, color: '#F59E0B' },
    { name: 'Cancelled', value: stats?.cancelledBookings || 15, color: '#EF4444' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 8000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 18000 },
    { month: 'Jun', revenue: 25000 },
  ];

  return (
    <div className="dashboard-v3">
      {/* 3. Dashboard Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="agent-banner-v3"
      >
        <div className="agent-banner-info">
          <div className="agent-avatar-l">
            {user?.agent?.profilePhoto ? (
              <img 
                src={user.agent.profilePhoto.startsWith('http') ? user.agent.profilePhoto : `http://localhost:8080/${user.agent.profilePhoto}`} 
                alt="Profile" 
                className="banner-avatar-img"
              />
            ) : (
              <User size={32} color="white" />
            )}
          </div>
          <div>
            <h1 className="welcome-text">Welcome back, {agentName}! 👋</h1>
            <div className="agent-meta-pills">
              <span className="metadata-pill"><ShieldCheck size={14} /> ID: {agentId}</span>
              <span className="metadata-pill"><Calendar size={14} /> Member since Mar 2026</span>
              <span className="metadata-pill status-active">Verified Agent</span>
              <span className="metadata-pill"><Clock size={14} /> Pune City</span>
              <span className="metadata-pill rating-pill">⭐ 4.8 Rating</span>
            </div>
          </div>
        </div>
        <div className="banner-actions">
           <button className="btn-glass" onClick={() => navigate('/profile')}>Edit Profile</button>
        </div>
      </motion.div>

      {/* 4 & 5. Statistics Cards + Wallet Summary */}
      <div className="stats-grid-v3">
        {/* Wallet balance with alert */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="stat-card-v3 wallet">
          <div className="card-icon-rounded purple">
            <Wallet size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Wallet Balance</p>
            <h2 className="card-value">₹{stats?.walletBalance?.toLocaleString()}</h2>
            {stats?.walletBalance < 200 && (
              <div className="wallet-alert">
                <AlertTriangle size={14} /> <span>Low Balance Alarm!</span>
              </div>
            )}
            <div className="card-actions">
              <button className="mini-btn-primary" onClick={() => navigate('/wallet')}>Add Money</button>
              <button className="mini-btn-outline" onClick={() => navigate('/wallet')}>Go to Wallet</button>
            </div>
          </div>
        </motion.div>

        {/* Today's Bookings */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="stat-card-v3">
          <div className="card-icon-rounded blue">
            <Calendar size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Today's Bookings</p>
            <h2 className="card-value">{stats?.todayBookings}</h2>
            <div className="trend-row up">
              <TrendingUp size={14} /> <span>Commission: ₹{stats?.todayCommission}</span>
            </div>
          </div>
        </motion.div>

        {/* Total Bookings */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="stat-card-v3">
          <div className="card-icon-rounded green">
            <CheckCircle size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Total Bookings</p>
            <h2 className="card-value">{stats?.totalBookings}</h2>
            <div className="booking-breakdown">
              <span className="br-item"><span className="dot green"></span> {stats?.completedBookings} Done</span>
              <span className="br-item"><span className="dot yellow"></span> {stats?.pendingBookings} Pend.</span>
            </div>
          </div>
        </motion.div>

        {/* Overall Earnings */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="stat-card-v3 earning">
          <div className="card-icon-rounded gold">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <p className="card-label">Overall Earnings</p>
            <h2 className="card-value">₹{stats?.overallEarnings?.toLocaleString()}</h2>
            <div className="earning-mini-grid">
              <div>
                <span className="mini-lbl">Today</span>
                <span className="mini-val">₹{stats?.todayCommission}</span>
              </div>
              <div>
                <span className="mini-lbl">This Month</span>
                <span className="mini-val">₹32,500</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 6. Quick Actions Section */}
      <div className="quick-actions-bar">
        <h3 className="section-title">Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-item" onClick={() => navigate('/bookings/new')}>
            <div className="action-icon"><Plus size={20} /></div>
            <span>New Booking</span>
          </button>
          <button className="action-item" onClick={() => navigate('/search')}>
            <div className="action-icon"><MapPin size={20} /></div>
            <span>Search Route</span>
          </button>
          <button className="action-item" onClick={() => navigate('/bookings/history')}>
            <div className="action-icon"><Car size={20} /></div>
            <span>Book Cab</span>
          </button>
          <button className="action-item" onClick={() => navigate('/customers')}>
            <div className="action-icon"><UserPlus size={20} /></div>
            <span>Add Customer</span>
          </button>
           <button className="action-item" onClick={() => navigate('/modify')}>
            <div className="action-icon"><FileText size={20} /></div>
            <span>Modify Booking</span>
          </button>
           <button className="action-item" onClick={() => navigate('/support')}>
            <div className="action-icon"><HelpCircle size={20} /></div>
            <span>Raise Ticket</span>
          </button>
        </div>
      </div>

      {/* 7 & 8. Recent Bookings + Booking Analytics */}
      <div className="dashboard-main-content">
        <div className="content-left">
          {/* 7. Recent Bookings Table */}
          <div className="premium-card-v3">
            <div className="card-header-v3">
              <h3 className="card-title">Recent Bookings</h3>
              <button className="text-link" onClick={() => navigate('/bookings/history')}>View All <ArrowRight size={14} /></button>
            </div>
            <div className="table-wrapper">
              <table className="v3-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length > 0 ? recentBookings.slice(0, 5).map((bk, i) => (
                    <tr key={bk.id || i}>
                      <td className="bk-id">{bk.bookingId || bk.id}</td>
                      <td>{bk.customerName || 'N/A'}</td>
                      <td>{bk.serviceType || 'Standard'}</td>
                      <td className="bk-amount">₹{bk.amount?.toLocaleString()}</td>
                      <td>
                        <span className="v3-status-pill" style={{ 
                          background: statusColors[bk.status]?.bg || '#f3f4f6', 
                          color: statusColors[bk.status]?.text || '#374151'
                        }}>
                          {bk.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px' }}>No bookings found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 8. Booking Analytics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="premium-card-v3">
              <h3 className="card-title">Booking Distribution</h3>
              <div style={{ height: '220px', width: '100%', marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-legend-v3">
                  {distributionData.map(d => (
                    <div key={d.name} className="legend-item">
                      <span className="dot" style={{ background: d.color }}></span>
                      <span>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="premium-card-v3">
              <h3 className="card-title">Revenue Trend</h3>
              <div style={{ height: '220px', width: '100%', marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="content-right">
          {/* 9. Recent Activity Panel */}
          <div className="premium-card-v3 activity-card">
            <h3 className="card-title">Activity Logs</h3>
            <div className="activity-list">
              {activities.length > 0 ? activities.slice(0, 6).map((activity, i) => (
                <div key={i} className="activity-item-v3">
                  <div className="activity-icon-v3" style={{ background: 'rgba(108, 43, 217, 0.1)', color: 'var(--primary)' }}>
                    <Clock size={16} />
                  </div>
                  <div className="activity-info-v3">
                    <p className="act-title">{activity.type}</p>
                    <p className="act-desc">{activity.description}</p>
                    <p className="act-time">{new Date(activity.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              )) : (
                <div className="activity-empty">
                   <Clock size={32} style={{ opacity: 0.2 }} />
                   <p>No recent activity logs.</p>
                </div>
              )}
            </div>
          </div>

          <div className="premium-card-v3 support-card">
              <div className="support-header">
                <HelpCircle size={24} color="var(--primary)" />
                <h3 className="card-title">Support Desk</h3>
              </div>
              <p className="support-p">Contact us for any technical or payment issues.</p>
              <div className="support-links">
                <button className="support-btn"><MessageCircle size={16} /> Chat</button>
                <button className="support-btn"><Phone size={16} /> Call</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
