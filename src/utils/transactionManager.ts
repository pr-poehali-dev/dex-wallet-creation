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

export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.unshift(transaction);
  localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
};

export const updateTransactionStatus = (id: string, status: Transaction['status']): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex(tx => tx.id === id);
  if (index !== -1) {
    transactions[index].status = status;
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
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
