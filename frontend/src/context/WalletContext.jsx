import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWalletBalance } from '../services/paymentService';
import { useAuth } from './AuthContext';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshBalance = async () => {
    try {
      if (!user) {
        setBalance(0);
        return;
      }
      const newBalance = await getWalletBalance();
      setBalance(newBalance);
    } catch (error) {
      console.error('Error refreshing wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBalance();
  }, [user]);

  return (
    <WalletContext.Provider value={{ balance, setBalance, refreshBalance, loading }}>
      {children}
    </WalletContext.Provider>
  );
};
