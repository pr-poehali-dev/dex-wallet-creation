import { updateMultipleBalances } from './balanceManager';

// Функция для инициализации тестовых балансов (только для демонстрации)
export const initTestBalances = () => {
  const testBalances = {
    '1': '1250.50',      // USDT TRC20
    '2': '0.15432',      // BTC
    '3': '2.5543',       // ETH
    '4': '8.3',          // BNB
    '6': '45.832',       // SOL
    '106': '750.00',     // USDT ERC20
    '111': '500.00',     // USDC ERC20
  };
  
  updateMultipleBalances(testBalances);
  console.log('Test balances initialized');
};

// Функция для сброса балансов
export const clearBalances = () => {
  updateMultipleBalances({});
  console.log('Balances cleared');
};