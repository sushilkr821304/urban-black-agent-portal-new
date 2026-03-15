import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  PieChart as PieIcon,
  ArrowUpRight,
  Target,
  BarChart3,
  CalendarDays,
  Activity
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import api from '../services/api';
import './Earnings.css';
import { toast } from 'react-hot-toast';

const COLORS = ['#3b82f6', '#ef4444', '#10b981'];

const Earnings = () => {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('overall');
  const [summary, setSummary] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchData();
  }, [range]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summRes, bookRes] = await Promise.all([
        api.get(`/earnings/summary?range=${range}`),
        api.get('/earnings/bookings?limit=10')
      ]);
      setSummary(summRes.data);
      setBookings(bookRes.data);
    } catch (err) {
      console.error("Error fetching earnings:", err);
      toast.error("Failed to load earnings analytics");
    } finally {
      setLoading(false);
    }
  };

  const trendData = summary?.earningsTrend ? Object.keys(summary.earningsTrend).map(key => ({
    name: key,
    earnings: summary.earningsTrend[key]
  })) : [];

  const pieData = summary ? [
    { name: 'Total Fare Collected', value: summary.totalFareCollected },
    { name: 'Platform Commission', value: summary.totalCommission },
    { name: 'Agent Net Earnings', value: summary.netAgentEarnings }
  ] : [];

  return (
    <motion.div 
      className="earnings-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header Section */}
      <header className="earnings-header">
        <div className="earnings-header-info">
          <h1>Earnings Dashboard</h1>
          <p>Track your revenue, commissions and performance trends.</p>
        </div>
        <div className="filter-pills">
          {['today', 'weekly', 'monthly', 'overall'].map((r) => (
            <button 
              key={r}
              className={`filter-pill ${range === r ? 'active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Summary Cards */}
      <div className="earnings-summary-grid">
        <motion.div className="earn-card" whileHover={{ y: -5 }}>
          <div className="earn-card-icon today"><CalendarDays size={28} /></div>
          <div className="earn-card-info">
            <h3>Today's Earnings</h3>
            <p className="amount">₹{summary?.todayEarnings?.toLocaleString() || '0'}</p>
            <span className="growth-badge up"><ArrowUpRight size={14}/> {summary?.todayGrowth}</span>
          </div>
        </motion.div>

        <motion.div className="earn-card" whileHover={{ y: -5 }}>
          <div className="earn-card-icon week"><BarChart3 size={28} /></div>
          <div className="earn-card-info">
            <h3>Weekly Earnings</h3>
            <p className="amount">₹{summary?.weeklyEarnings?.toLocaleString() || '0'}</p>
            <span className="growth-badge up"><ArrowUpRight size={14}/> {summary?.weeklyGrowth}</span>
          </div>
        </motion.div>

        <motion.div className="earn-card" whileHover={{ y: -5 }}>
          <div className="earn-card-icon month"><Calendar size={28} /></div>
          <div className="earn-card-info">
            <h3>Monthly Earnings</h3>
            <p className="amount">₹{summary?.monthlyEarnings?.toLocaleString() || '0'}</p>
            <span className="growth-badge up"><ArrowUpRight size={14}/> {summary?.monthlyGrowth}</span>
          </div>
        </motion.div>

        <motion.div className="earn-card" whileHover={{ y: -5 }}>
          <div className="earn-card-icon total"><DollarSign size={28} /></div>
          <div className="earn-card-info">
            <h3>Total Earnings</h3>
            <p className="amount">₹{summary?.totalEarnings?.toLocaleString() || '0'}</p>
            <span className="growth-badge up"><ArrowUpRight size={14}/> {summary?.totalGrowth}</span>
          </div>
        </motion.div>
      </div>

      {/* Second Row Cards */}
      <div className="second-row-grid">
        <div className="mini-card">
          <div>
            <span className="mini-card-label">Total Trips Completed</span>
            <div className="mini-card-value">{summary?.totalTrips || '0'}</div>
          </div>
          <CheckCircle size={32} color="#10b981" />
        </div>
        <div className="mini-card">
          <div>
            <span className="mini-card-label">Average Earnings per Trip</span>
            <div className="mini-card-value">₹{summary?.averageEarningsPerTrip?.toFixed(2) || '0'}</div>
          </div>
          <Target size={32} color="#7c3aed" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="earnings-charts-container">
        <div className="chart-box">
          <h2><TrendingUp size={20} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#7c3aed' }} /> Earnings Trend</h2>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorE)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box">
          <h2><PieIcon size={20} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#7c3aed' }} /> Commission Breakdown</h2>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Earnings Table */}
      <div className="earnings-table-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2><Activity size={20} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#7c3aed' }} /> Recent Earnings</h2>
        </div>
        <div className="earn-table-res">
          <table className="earn-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer Name</th>
                <th>Route</th>
                <th>Trip Date</th>
                <th>Trip Fare</th>
                <th>Commission</th>
                <th>Agent Earnings</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '50px' }}>Loading transaction records...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '50px' }}>No earnings history found</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td><span className="earn-bk-id">{b.bookingId}</span></td>
                    <td style={{ fontWeight: 600 }}>{b.customerName}</td>
                    <td>{b.pickupLocation} → {b.dropLocation}</td>
                    <td>{new Date(b.tripDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td className="earn-fare">₹{b.amount?.toLocaleString()}</td>
                    <td className="earn-comm">-₹{b.commissionAmount?.toLocaleString()}</td>
                    <td className="earn-net">₹{b.agentEarning?.toLocaleString()}</td>
                    <td>
                      <span className="status-p completed">COMPLETED</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Earnings;
