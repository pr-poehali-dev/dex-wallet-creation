import { saveTransaction as saveTransactionApi } from './walletApi';

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  cryptoId: string;
  symbol: string;
  amount: string;
  address: string;
  fee: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  hash: string;
  network: string;
}

const TRANSACTION_STORAGE_KEY = 'crypto_transactions';
const USER_ID_KEY = 'dex_wallet_user_id';

export const generateTransactionHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const generateTransactionId = (): string => {
  return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const getTransactions = (): Transaction[] => {
  try {
    const saved = localStorage.getItem(TRANSACTION_STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const setTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error setting transactions:', error);
  }
};

export const addTransaction = async (transaction: Transaction): Promise<void> => {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
  
  const userIdStr = localStorage.getItem(USER_ID_KEY);
  if (userIdStr) {
    const userId = parseInt(userIdStr);
    await saveTransactionApi(userId, transaction);
  }
};

export const updateTransactionStatus = async (id: string, status: Transaction['status']): Promise<void> => {
  const transactions = getTransactions();
  const index = transactions.findIndex(tx => tx.id === id);
  if (index !== -1) {
    transactions[index].status = status;
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
    
    const userIdStr = localStorage.getItem(USER_ID_KEY);
    if (userIdStr) {
      const userId = parseInt(userIdStr);
      await saveTransactionApi(userId, transactions[index]);
    }
  }
};

export const getTransactionsByCrypto = (cryptoId: string): Transaction[] => {
  return getTransactions().filter(tx => tx.cryptoId === cryptoId);
};

export const getRecentTransactions = (limit: number = 10): Transaction[] => {
  return getTransactions().slice(0, limit);
};

export const simulateTransactionConfirmation = (
  transactionId: string,
  onComplete: () => void
): void => {
  setTimeout(() => {
    updateTransactionStatus(transactionId, 'completed');
    onComplete();
  }, 3000);
};