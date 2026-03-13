import api from './api';

export const createPaymentOrder = async (amount) => {
  const response = await api.post('/payments/create-order', {
    amount: amount,
    currency: 'INR'
  });
  return response.data;
};

export const verifyPaymentSignature = async (paymentData) => {
  const response = await api.post('/payments/verify-signature', paymentData);
  return response.data;
};

export const getMyPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const getWalletBalance = async () => {
  const response = await api.get('/auth/me');
  // Assuming the user object has an agent which has a wallet
  return response.data.agent?.wallet?.balance || 0;
};
