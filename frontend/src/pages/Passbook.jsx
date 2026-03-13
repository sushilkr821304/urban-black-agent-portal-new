import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMyPayments } from '../services/paymentService';
import { useWallet } from '../context/WalletContext';

const Passbook = () => {
  const { balance } = useWallet();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getMyPayments();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Passbook</h1>
        <p className="page-subtitle">View your detailed financial statement and all transaction logs.</p>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="premium-card">
        <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <button className="btn-primary" style={{ padding: '10px 24px' }}>Filter</button>
          </div>
          <div style={{ alignSelf: 'flex-end', marginLeft: 'auto' }}>
             <button className="btn-outline">Download Statement</button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', marginTop: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#F9FAFB' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Date & Time</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Description</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Reference ID</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Credit (₹)</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Debit (₹)</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    {loading ? 'Loading...' : 'No transactions found.'}
                  </td>
                </tr>
              ) : (
                transactions.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: '500' }}>Wallet Topup</td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>{row.razorpayOrderId}</td>
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: '#10B981' }}>+ {row.amount}</td>
                    <td style={{ padding: '16px 24px', fontWeight: '600', color: '#EF4444' }}>-</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: 'bold',
                        background: row.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: row.status === 'SUCCESS' ? '#10B981' : '#EF4444'
                      }}>
                        {row.status}
                      </span>
                    </td>
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

export default Passbook;
