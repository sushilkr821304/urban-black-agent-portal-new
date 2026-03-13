import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPaymentOrder, verifyPaymentSignature, getWalletBalance, getMyPayments } from '../services/paymentService';
import toast from 'react-hot-toast';
import { useWallet } from '../context/WalletContext';

const Wallet = () => {
  const { balance, setBalance, refreshBalance } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [newTransactions] = await Promise.all([
        getMyPayments()
      ]);
      await refreshBalance();
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    const amount = prompt("Enter amount to add (INR):", "500");
    if (!amount || isNaN(amount) || amount <= 0) return;

    try {
      const order = await createPaymentOrder(parseFloat(amount));
      
      const options = {
        key: "rzp_test_SQbnlhk9jtL3LE", // Test Key from application.properties
        amount: order.amount * 100, // Amount in paise
        currency: order.currency,
        name: "Urban Black",
        description: "Add Money to Wallet",
        order_id: order.razorpayOrderId,
        handler: async (response) => {
          try {
            const verificationData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };
            
            const verificationResult = await verifyPaymentSignature(verificationData);
            if (verificationResult.status === 'SUCCESS') {
              toast.success('Payment successful! Balance updated.');
              fetchWalletData(); // Refresh balance and transaction list
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Error verifying payment.');
          }
        },
        prefill: {
          name: "Agent",
          email: "agent@urbanblack.com",
          contact: ""
        },
        theme: {
          color: "#7C3AED" // Using your primary purple theme
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment order creation failed:', error);
      toast.error('Failed to initiate payment.');
    }
  };

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

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
            <p style={{ margin: 0, fontSize: '48px', fontWeight: 'bold' }}>₹ {balance.toLocaleString()}</p>
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" style={{ background: 'white', color: 'var(--primary)' }} onClick={handleAddMoney}>Add Money</button>
            <button className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>Withdraw to Bank</button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Recent Transactions</h2>
            <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '600' }}>View All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {transactions.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>No transactions found.</p>
            ) : (
              transactions.map((tx, i) => (
                <div key={tx.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i === transactions.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: tx.status === 'SUCCESS' ? '#DEF7EC' : '#FDE8E8', color: tx.status === 'SUCCESS' ? '#03543F' : '#9B1C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      {tx.status === 'SUCCESS' ? '↓' : '!'}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Top-up: {tx.razorpayOrderId}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(tx.createdAt).toLocaleString()} • {tx.razorpayPaymentId || 'N/A'}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold', color: tx.status === 'SUCCESS' ? '#10B981' : '#EF4444' }}>
                      + ₹{tx.amount?.toLocaleString()}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: tx.status === 'SUCCESS' ? '#10B981' : '#EF4444' }}>{tx.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wallet;
