import React from 'react';
import { motion } from 'framer-motion';

const Earnings = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Earnings Analytics</h1>
        <p className="page-subtitle">Track your daily, weekly and monthly earnings.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <motion.div className="premium-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Total Earnings</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>₹ 1,45,000</p>
        </motion.div>

        <motion.div className="premium-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Weekly Earnings</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)' }}>₹ 12,400</p>
        </motion.div>

        <motion.div className="premium-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-muted)' }}>Monthly Earnings</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--text-main)' }}>₹ 45,000</p>
        </motion.div>
      </div>

      <div className="premium-card" style={{ height: '400px', display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '18px' }}>Earnings Trend</h3>
        <div style={{ flex: 1, border: '1px dashed var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(243, 244, 246, 0.4)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Chart component rendering here...</p>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
                ))}
              </tbody >
            </table >
          </div >
        </motion.div >

  <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
    <div className="card-title">Wallet Ledger</div>
    <div className="trans-scroll">
      {transactions.map((t) => (
        <div className="trans-item" key={t.id}>
          <div className={`t-icon ${t.type.toLowerCase()}`}>
            <Award size={20} />
          </div>
          <div className="t-details">
            <div className="t-desc">{t.description}</div>
            <div className="t-date">{new Date(t.date).toLocaleDateString()} at {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          <div className="t-amount">+₹{t.amount}</div>
        </div>
      ))}
      {transactions.length === 0 && <div className="no-data">No transactions recorded</div>}
    </div>
  </motion.div>
      </div >
    </motion.div >
  );
};

export default Earnings;
