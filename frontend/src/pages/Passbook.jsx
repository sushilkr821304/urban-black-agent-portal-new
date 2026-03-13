import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Passbook = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)' }}>Balance (₹)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: '2026-03-13 10:30 AM', desc: 'Trip Earning (UB-001)', ref: 'TRX-101', cr: 3500, dr: null, bal: 24500 },
                { date: '2026-03-12 04:15 PM', desc: 'Platform Fee', ref: 'TRX-102', cr: null, dr: 250, bal: 21000 },
                { date: '2026-03-11 02:00 PM', desc: 'Trip Earning (UB-005)', ref: 'TRX-103', cr: 1200, dr: null, bal: 21250 },
                { date: '2026-03-10 09:00 AM', desc: 'Wallet Topup', ref: 'Bnk-Transfer', cr: 5000, dr: null, bal: 20050 },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-muted)' }}>{row.date}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '500' }}>{row.desc}</td>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-muted)' }}>{row.ref}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '600', color: '#10B981' }}>{row.cr ? `+ ${row.cr}` : '-'}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '600', color: '#EF4444' }}>{row.dr ? `- ${row.dr}` : '-'}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '600' }}>{row.bal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Passbook;
