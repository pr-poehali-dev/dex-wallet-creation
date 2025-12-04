import { updateBalance as updateBalanceApi } from './walletApi';

const BALANCE_STORAGE_KEY = 'crypto_balances';
const USER_ID_KEY = 'dex_wallet_user_id';

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

export const updateBalance = async (cryptoId: string, balance: string): Promise<void> => {
  try {
    const balances = getBalances();
    balances[cryptoId] = balance;
    localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(balances));
    console.log(`Balance updated: crypto ${cryptoId} = ${balance}`);
    console.log('All balances:', balances);
    
    const userIdStr = localStorage.getItem(USER_ID_KEY);
    if (userIdStr) {
      const userId = parseInt(userIdStr);
      await updateBalanceApi(userId, cryptoId, balance);
    }
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

export const setBalances = (balances: CryptoBalance): void => {
  try {
    localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(balances));
  } catch (error) {
    console.error('Error setting balances:', error);
  }
};