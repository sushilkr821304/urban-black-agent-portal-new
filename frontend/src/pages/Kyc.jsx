import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Kyc = () => {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">KYC Verification</h1>
          <p className="page-subtitle">Submit your details to activate full agency privileges.</p>
        </div>
        <div style={{ background: '#FEF3C7', color: '#92400E', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></span>
          Pending Action
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="premium-card">
        <div style={{ display: 'flex', marginBottom: '32px', borderBottom: '1px solid var(--border-color)' }}>
           <button style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'personal' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'personal' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'personal' ? '600' : '500' }} onClick={() => setActiveTab('personal')}>
             Personal & Agency Info
           </button>
           <button style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'documents' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'documents' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'documents' ? '600' : '500' }} onClick={() => setActiveTab('documents')}>
             Document Uploads
           </button>
        </div>

        {activeTab === 'personal' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Agency Name</label>
                <input type="text" placeholder="e.g. Royal Travels" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#FAFAFB' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
                <input type="email" placeholder="contact@agency.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#FAFAFB' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>City & State</label>
                <input type="text" placeholder="Pune, Maharashtra" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#FAFAFB' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <hr style={{ border: 'none', borderBottom: '1px dashed var(--border-color)', margin: '16px 0' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Aadhar Number</label>
                <input type="text" placeholder="XXXX-XXXX-XXXX" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#FAFAFB', letterSpacing: '0.1em' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>PAN Number</label>
                <input type="text" placeholder="ABCDE1234F" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#FAFAFB', textTransform: 'uppercase' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Pin Code</label>
                <input type="text" placeholder="411001" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#FAFAFB' }} />
              </div>
            </div>
            
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setActiveTab('documents')}>Next: Documents &#8594;</button>
            </div>
          </motion.div>
        )}

        {activeTab === 'documents' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '14px' }}>Please upload clear images. Max file size: 5MB per file.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {['Aadhar Card Front', 'Aadhar Card Back', 'PAN Card'].map((doc, i) => (
                <div key={i} style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '32px 16px', textAlign: 'center', background: '#FAFAFB', cursor: 'pointer', transition: 'var(--transition-fast)', ':hover': { borderColor: 'var(--primary)', background: 'rgba(108, 43, 217, 0.02)' } }}>
                  <div style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '16px' }}>⬆️</div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>{doc}</h4>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Click to browse or drag & drop</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn-outline" onClick={() => setActiveTab('personal')}>&#8592; Back</button>
              <button className="btn-primary" style={{ background: '#10B981', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.2)' }}>Submit for Verification ✓</button>
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
};

export default Kyc;
