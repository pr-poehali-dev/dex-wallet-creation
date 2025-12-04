const BALANCE_STORAGE_KEY = 'crypto_balances';

interface CryptoBalance {
  [cryptoId: string]: string;
}

export const getBalances = (): CryptoBalance => {
  try {
    const saved = localStorage.getItem(BALANCE_STORAGE_KEY);
    if (!saved) return {};
    return JSON.parse(saved);
  } catch (error) {
    console.error('Error loading balances:', error);
    return {};
  }
};

export const updateBalance = (cryptoId: string, balance: string): void => {
  try {
    const balances = getBalances();
    balances[cryptoId] = balance;
    localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(balances));
  } catch (error) {
    console.error('Error saving balance:', error);
  }
};

export const updateMultipleBalances = (balances: CryptoBalance): void => {
  try {
    localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(balances));
  } catch (error) {
    console.error('Error saving balances:', error);
  }
};
