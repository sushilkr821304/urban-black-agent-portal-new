import React from 'react';
import { motion } from 'framer-motion';

const Wallet = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Wallet</h1>
        <p className="page-subtitle">Manage your funds and process withdrawals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '24px' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="premium-card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>Available Balance</h3>
            <p style={{ margin: 0, fontSize: '48px', fontWeight: 'bold' }}>₹ 24,500</p>
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" style={{ background: 'white', color: 'var(--primary)' }}>Add Money</button>
            <button className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>Withdraw to Bank</button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Recent Transactions</h2>
            <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '600' }}>View All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { id: 'TRX-101', type: 'Credit', desc: 'Trip Payment: UB-001', amount: '+ ₹3,500', date: 'Today, 10:30 AM', status: 'Success' },
              { id: 'TRX-102', type: 'Debit', desc: 'Platform Fee', amount: '- ₹250', date: 'Yesterday, 4:15 PM', status: 'Success' },
              { id: 'TRX-103', type: 'Credit', desc: 'Trip Payment: UB-005', amount: '+ ₹1,200', date: '11 Mar, 2:00 PM', status: 'Success' },
            ].map((tx, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i === 2 ? 'none' : '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: tx.type === 'Credit' ? '#DEF7EC' : '#FDE8E8', color: tx.type === 'Credit' ? '#03543F' : '#9B1C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                    {tx.type === 'Credit' ? '↓' : '↑'}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{tx.desc}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{tx.date} • {tx.id}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: tx.type === 'Credit' ? '#10B981' : '#EF4444' }}>{tx.amount}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#10B981' }}>{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wallet;
