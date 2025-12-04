import { updateMultipleBalances } from './balanceManager';

// Функция для инициализации тестовых балансов (только для демонстрации)
export const initTestBalances = () => {
  const testBalances = {
    '1': '1250.50',      // USDT TRC20
    '2': '0.05432',      // BTC
    '3': '1.2543',       // ETH
    '4': '5.8',          // BNB
    '6': '25.432',       // SOL
    '106': '500.00',     // USDT ERC20
    '111': '300.00',     // USDC ERC20
  };
  
  updateMultipleBalances(testBalances);
  console.log('Test balances initialized');
};

// Функция для сброса балансов
export const clearBalances = () => {
  updateMultipleBalances({});
  console.log('Balances cleared');
};
