import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Calendar,
  CreditCard,
  DollarSign
} from 'lucide-react';
import api from '../services/api';
import './Passbook.css';
import { toast } from 'react-hot-toast';

const Passbook = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalCredits: 0, totalDebits: 0, currentBalance: 0 });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [page]);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/passbook/summary');
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let url = isFiltering 
        ? `/passbook/filter?fromDate=${fromDate}&toDate=${toDate}&page=${page}&size=10`
        : `/passbook?page=${page}&size=10`;
      
      const res = await api.get(url);
      setTransactions(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both dates");
      return;
    }
    setPage(0);
    setIsFiltering(true);
    fetchTransactions();
  };

  const resetFilter = () => {
    setFromDate('');
    setToDate('');
    setIsFiltering(false);
    setPage(0);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div 
      className="passbook-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="passbook-header">
        <h1 className="passbook-title">Agent Passbook</h1>
        <p className="passbook-subtitle">View and track all your wallet credits and debits.</p>
      </div>

      {/* Filter Section */}
      <div className="filter-card">
        <div className="filter-grid">
          <div className="filter-group">
            <label>From Date</label>
            <input 
              type="date" 
              className="filter-input" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>To Date</label>
            <input 
              type="date" 
              className="filter-input" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="filter-actions" style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-search" onClick={handleSearch}>
              <Search size={18} />
              <span>Search</span>
            </button>
            {isFiltering && (
              <button className="btn-search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={resetFilter}>
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <motion.div className="stat-card" whileHover={{ y: -5 }}>
          <div className="stat-icon credit"><ArrowUpCircle size={32} /></div>
          <div className="stat-info">
            <h3>Total Credits</h3>
            <p>₹{summary.totalCredits?.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -5 }}>
          <div className="stat-icon debit"><ArrowDownCircle size={32} /></div>
          <div className="stat-info">
            <h3>Total Debits</h3>
            <p>₹{summary.totalDebits?.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -5 }} style={{ border: '1px solid rgba(167, 139, 250, 0.2)' }}>
          <div className="stat-icon balance"><Wallet size={32} /></div>
          <div className="stat-info">
            <h3>Wallet Balance</h3>
            <p style={{ color: '#a78bfa' }}>₹{summary.currentBalance?.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <div className="table-card">
        <div className="table-header-row">
          <h2>Recent Transactions</h2>
        </div>
        <div className="table-responsive">
          <table className="passbook-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Ref ID</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '100px 0' }}>Loading transactions...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '100px 0' }}>No transactions found</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td><span className="txn-id">TXN{tx.id+10000}</span></td>
                    <td>
                      <span className={`type-pill ${tx.transactionType?.toLowerCase()}`}>
                        {tx.transactionType}
                      </span>
                    </td>
                    <td>
                      <span className={`amt-val ${tx.transactionType === 'CREDIT' ? 'plus' : 'minus'}`}>
                        {tx.transactionType === 'CREDIT' ? '+' : '-'}₹{tx.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ maxWidth: '250px' }}>{tx.description}</td>
                    <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{tx.referenceId || '--'}</td>
                    <td>{formatDate(tx.createdAt)}</td>
                    <td>
                      <div className="status-label">
                        <span className={`status-dot ${tx.status?.toLowerCase()}`}></span>
                        {tx.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <span className="page-info">Page {page + 1} of {totalPages}</span>
            <button 
              className="page-btn" 
              disabled={page === 0} 
              onClick={() => setPage(prev => prev - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="page-btn" 
              disabled={page === totalPages - 1} 
              onClick={() => setPage(prev => prev + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Passbook;
