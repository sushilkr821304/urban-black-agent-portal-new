import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  RotateCcw, 
  Download, 
  Calendar, 
  TrendingUp, 
  PieChart as PieIcon,
  Activity,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  MapPin,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../services/api';
import './Reports.css';
import { toast } from 'react-hot-toast';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [fromDate, setFromDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('All');
  const [route, setRoute] = useState('');

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, bookingsRes] = await Promise.all([
        api.get(`/reports/summary?fromDate=${fromDate}&toDate=${toDate}`),
        api.get(`/reports/bookings?fromDate=${fromDate}&toDate=${toDate}&status=${status}&route=${route}&page=${page}&size=10`)
      ]);

      setSummary(summaryRes.data);
      setBookings(bookingsRes.data.content);
      setTotalPages(bookingsRes.data.totalPages);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchData();
  };

  const handleReset = () => {
    setFromDate(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
    setToDate(new Date().toISOString().split('T')[0]);
    setStatus('All');
    setRoute('');
    setPage(0);
  };

  const handleDownload = async (format) => {
    try {
      toast.loading(`Preparing ${format.toUpperCase()} report...`, { id: 'report' });
      const response = await api.get(`/reports/download?fromDate=${fromDate}&toDate=${toDate}&format=${format}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `UrbanBlack_Report_${fromDate}_to_${toDate}.${format === 'csv' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      toast.success(`${format.toUpperCase()} Report downloaded`, { id: 'report' });
    } catch (error) {
      toast.error("Export failed", { id: 'report' });
    }
  };

  const trendData = summary?.bookingsTrend ? Object.keys(summary.bookingsTrend).map(key => ({
    name: key,
    bookings: summary.bookingsTrend[key],
    revenue: summary.revenueTrend[key] || 0
  })) : [];

  const pieData = summary?.statusDistribution ? Object.keys(summary.statusDistribution).map(key => ({
    name: key,
    value: summary.statusDistribution[key]
  })) : [];

  const filteredBookings = bookings.filter(b => 
    b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.dropLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="reports-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Page Header */}
      <header className="reports-header">
        <motion.h1 variants={itemVariants}>Reports & Analytics</motion.h1>
        <motion.p variants={itemVariants}>Detailed insights into your business growth and trip performance.</motion.p>
      </header>

      {/* 2. Filters Section */}
      <motion.section className="filter-card" variants={itemVariants}>
        <div className="filter-grid">
          <div className="filter-group">
            <label><Calendar size={14} className="icon-purple" /> From Date</label>
            <input type="date" className="filter-input" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="filter-group">
            <label><Calendar size={14} className="icon-purple" /> To Date</label>
            <input type="date" className="filter-input" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="filter-group">
            <label><Filter size={14} className="icon-purple" /> Booking Status</label>
            <select className="filter-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
          <div className="filter-group">
            <label><MapPin size={14} className="icon-purple" /> City / Route</label>
            <input type="text" className="filter-input" placeholder="Search route..." value={route} onChange={(e) => setRoute(e.target.value)} />
          </div>
        </div>
        <div className="filter-btns">
          <button className="btn btn-primary" onClick={handleSearch}><Search size={18} /> Search Report</button>
          <button className="btn btn-outline" onClick={handleReset}><RotateCcw size={18} /> Reset Filters</button>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-pdf" onClick={() => handleDownload('pdf')}><Download size={18} /> Export PDF</button>
          <button className="btn btn-excel" onClick={() => handleDownload('csv')}><Download size={18} /> Export Excel</button>
        </div>
      </motion.section>

      {/* 3. Summary Cards */}
      <section className="summary-grid">
        <motion.div className="summary-card" variants={itemVariants}>
          <div className="card-icon-box purple-icon"><Activity size={24} /></div>
          <div className="card-info">
            <h3>Total Bookings</h3>
            <p>{summary ? summary.totalBookings : '0'}</p>
          </div>
        </motion.div>
        <motion.div className="summary-card" variants={itemVariants}>
          <div className="card-icon-box green-icon"><CheckCircle size={24} /></div>
          <div className="card-info">
            <h3>Completed Trips</h3>
            <p>{summary ? summary.completedTrips : '0'}</p>
          </div>
        </motion.div>
        <motion.div className="summary-card" variants={itemVariants}>
          <div className="card-icon-box red-icon"><XCircle size={24} /></div>
          <div className="card-info">
            <h3>Cancelled Trips</h3>
            <p>{summary ? summary.cancelledTrips : '0'}</p>
          </div>
        </motion.div>
        <motion.div className="summary-card" variants={itemVariants}>
          <div className="card-icon-box blue-icon"><DollarSign size={24} /></div>
          <div className="card-info">
            <h3>Total Earnings</h3>
            <p>₹{summary ? summary.totalRevenue?.toLocaleString() : '0'}</p>
          </div>
        </motion.div>
      </section>

      {/* 4. Chart Section */}
      <section className="charts-grid">
        <motion.div className="chart-container" variants={itemVariants}>
          <h2><TrendingUp size={20} className="text-purple" /> Bookings Growth Trend</h2>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#7c3aed" strokeWidth={4} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="chart-container" variants={itemVariants}>
          <h2><PieIcon size={20} className="text-purple" /> Status Distribution</h2>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={70} 
                  outerRadius={95} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>

      {/* 5. Detailed Booking Report Table */}
      <motion.section className="table-section" variants={itemVariants}>
        <div className="table-header-tools">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText className="text-purple" size={24} />
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Trip Log Details</h2>
          </div>
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Filter by ID, Customer or Route..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Booking ID <ArrowUpDown size={12} className="sort-icon" /></th>
                <th>Customer Name</th>
                <th>Route Info</th>
                <th>Trip Date</th>
                <th>Fare Amount</th>
                <th>Net Earnings</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '4rem' }}><div className="loader">Analyzing data...</div></td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>No transaction records found.</td></tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td><span className="booking-id">{b.bookingId}</span></td>
                    <td style={{ fontWeight: 600 }}>{b.customerName}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px' }}>{b.pickupLocation}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>to {b.dropLocation}</span>
                      </div>
                    </td>
                    <td>{new Date(b.tripDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ fontWeight: 600 }}>₹{b.amount?.toLocaleString()}</td>
                    <td style={{ color: '#10b981', fontWeight: 800 }}>₹{b.agentEarning?.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge status-${b.status?.toLowerCase().replace(/\s/g, '')}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <p>Displaying <b>{filteredBookings.length}</b> records on page <b>{page + 1}</b> of <b>{totalPages}</b></p>
            <div className="page-btn-group">
              <button className="icon-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                <ChevronLeft size={20} />
              </button>
              <button className="icon-btn" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
};

export default Reports;
