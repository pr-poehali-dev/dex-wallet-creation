import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import QRModal from '@/components/QRModal';
import SendModal from '@/components/SendModal';
import AddCryptoModal from '@/components/AddCryptoModal';
import { fetchCryptoPrices, calculateBalance } from '@/utils/cryptoPrices';
import { getBalances } from '@/utils/balanceManager';
import { toast } from 'sonner';

interface MainWalletProps {
  username: string;
  walletAddresses: Map<string, string>;
}

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  network: string;
  balance: string;
  usdValue: string;
  icon: string;
  iconUrl?: string;
  networkIconUrl?: string;
  address: string;
  color: string;
}

const STORAGE_KEY_SELECTED = 'dex_wallet_selected_cryptos';

const MainWallet = ({ username, walletAddresses }: MainWalletProps) => {
  const [activeTab, setActiveTab] = useState<'home' | 'nft' | 'defi' | 'profile'>('home');
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCryptoIds, setSelectedCryptoIds] = useState<string[]>(['1', '2', '3', '6', '4']); // USDT TRC20, BTC, ETH, SOL, BNB
  const [cryptoPrices, setCryptoPrices] = useState<{[key: string]: number}>({});
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [cryptoBalances, setCryptoBalances] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SELECTED);
    if (saved) {
      try {
        setSelectedCryptoIds(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading selected cryptos', e);
      }
    }

    const balances = getBalances();
    setCryptoBalances(balances);
  }, []);

  useEffect(() => {
    const loadPrices = async () => {
      const prices = await fetchCryptoPrices();
      setCryptoPrices(prices);
    };

    loadPrices();
    const interval = setInterval(loadPrices, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const saveSelectedCryptos = (ids: string[]) => {
    setSelectedCryptoIds(ids);
    localStorage.setItem(STORAGE_KEY_SELECTED, JSON.stringify(ids));
  };

  const getBalance = (id: string): string => {
    return cryptoBalances[id] || '0.00';
  };

  const allCryptoList: Crypto[] = useMemo(() => [
    // Стейблкоины в разных сетях
    { id: '1', name: 'Tether (TRC20)', symbol: 'USDT', network: 'TRC20', balance: cryptoBalances['1'] || '0.00', usdValue: '0.00', icon: '₮', iconUrl: 'https://cdn.poehali.dev/files/64ba7feb-f8b0-4f82-8ed8-a8b33c26c00d.png', networkIconUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png', address: walletAddresses.get('TRC20') || 'TXYZabcd1234...', color: 'text-green-600' },
    { id: '106', name: 'Tether (ERC20)', symbol: 'USDT', network: 'ERC20', balance: cryptoBalances['106'] || '0.00', usdValue: '0.00', icon: '₮', iconUrl: 'https://cdn.poehali.dev/files/64ba7feb-f8b0-4f82-8ed8-a8b33c26c00d.png', networkIconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: walletAddresses.get('Ethereum') || '0x742d35...', color: 'text-green-600' },
    { id: '107', name: 'Tether (Solana)', symbol: 'USDT', network: 'Solana', balance: '0.00', usdValue: '0.00', icon: '₮', iconUrl: 'https://cdn.poehali.dev/files/64ba7feb-f8b0-4f82-8ed8-a8b33c26c00d.png', networkIconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png', address: walletAddresses.get('Solana') || 'Sol9vXc...', color: 'text-green-600' },
    { id: '108', name: 'Tether (BEP20)', symbol: 'USDT', network: 'BEP20', balance: '0.00', usdValue: '0.00', icon: '₮', iconUrl: 'https://cdn.poehali.dev/files/64ba7feb-f8b0-4f82-8ed8-a8b33c26c00d.png', networkIconUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', address: walletAddresses.get('BSC') || '0xbnb123...', color: 'text-green-600' },
    { id: '109', name: 'Tether (Polygon)', symbol: 'USDT', network: 'Polygon', balance: '0.00', usdValue: '0.00', icon: '₮', iconUrl: 'https://cdn.poehali.dev/files/64ba7feb-f8b0-4f82-8ed8-a8b33c26c00d.png', networkIconUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png', address: walletAddresses.get('Polygon') || '0xmatic...', color: 'text-green-600' },
    { id: '110', name: 'Tether (Avalanche)', symbol: 'USDT', network: 'Avalanche', balance: '0.00', usdValue: '0.00', icon: '₮', iconUrl: 'https://cdn.poehali.dev/files/64ba7feb-f8b0-4f82-8ed8-a8b33c26c00d.png', networkIconUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', address: walletAddresses.get('Avalanche') || 'X-avax...', color: 'text-green-600' },
    { id: '111', name: 'USD Coin (ERC20)', symbol: 'USDC', network: 'ERC20', balance: '0.00', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: walletAddresses.get('Ethereum') || '0xusdc...', color: 'text-blue-600' },
    { id: '112', name: 'USD Coin (Solana)', symbol: 'USDC', network: 'Solana', balance: '0.00', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png', address: walletAddresses.get('Solana') || 'Sol9vXc...', color: 'text-blue-600' },
    { id: '113', name: 'USD Coin (BEP20)', symbol: 'USDC', network: 'BEP20', balance: '0.00', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', address: walletAddresses.get('BSC') || '0xusdc...', color: 'text-blue-600' },
    { id: '114', name: 'USD Coin (Polygon)', symbol: 'USDC', network: 'Polygon', balance: '0.00', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png', address: walletAddresses.get('Polygon') || '0xusdc...', color: 'text-blue-600' },
    { id: '115', name: 'Dai (ERC20)', symbol: 'DAI', network: 'ERC20', balance: '0.00', usdValue: '0.00', icon: 'D', iconUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: walletAddresses.get('Ethereum') || '0xdai...', color: 'text-yellow-600' },
    { id: '116', name: 'Dai (BEP20)', symbol: 'DAI', network: 'BEP20', balance: '0.00', usdValue: '0.00', icon: 'D', iconUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', address: walletAddresses.get('BSC') || '0xdai...', color: 'text-yellow-600' },
    { id: '117', name: 'Binance USD (BEP20)', symbol: 'BUSD', network: 'BEP20', balance: '0.00', usdValue: '0.00', icon: 'B', iconUrl: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', address: walletAddresses.get('BSC') || '0xbusd...', color: 'text-yellow-600' },
    { id: '118', name: 'TrueUSD (ERC20)', symbol: 'TUSD', network: 'ERC20', balance: '0.00', usdValue: '0.00', icon: 'T', iconUrl: 'https://cryptologos.cc/logos/trueusd-tusd-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: walletAddresses.get('Ethereum') || '0xtusd...', color: 'text-blue-600' },
    { id: '119', name: 'TrueUSD (TRC20)', symbol: 'TUSD', network: 'TRC20', balance: '0.00', usdValue: '0.00', icon: 'T', iconUrl: 'https://cryptologos.cc/logos/trueusd-tusd-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png', address: walletAddresses.get('Tron') || 'TRX7ya...', color: 'text-blue-600' },
    { id: '120', name: 'Pax Dollar (ERC20)', symbol: 'USDP', network: 'ERC20', balance: '0.00', usdValue: '0.00', icon: 'P', iconUrl: 'https://cryptologos.cc/logos/paxos-standard-pax-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: walletAddresses.get('Ethereum') || '0xusdp...', color: 'text-green-600' },
    { id: '121', name: 'Gemini Dollar (ERC20)', symbol: 'GUSD', network: 'ERC20', balance: '0.00', usdValue: '0.00', icon: 'G', iconUrl: 'https://cryptologos.cc/logos/gemini-dollar-gusd-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: walletAddresses.get('Ethereum') || '0xgusd...', color: 'text-blue-600' },
    { id: '122', name: 'Frax (ERC20)', symbol: 'FRAX', network: 'ERC20', balance: '0.00', usdValue: '0.00', icon: 'F', iconUrl: 'https://cryptologos.cc/logos/frax-frax-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: walletAddresses.get('Ethereum') || '0xfrax...', color: 'text-gray-700' },
    { id: '123', name: 'Frax (BEP20)', symbol: 'FRAX', network: 'BEP20', balance: '0.00', usdValue: '0.00', icon: 'F', iconUrl: 'https://cryptologos.cc/logos/frax-frax-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', address: walletAddresses.get('BSC') || '0xfrax...', color: 'text-gray-700' },
    { id: '124', name: 'USDD (TRC20)', symbol: 'USDD', network: 'TRC20', balance: '0.00', usdValue: '0.00', icon: 'U', iconUrl: 'https://cryptologos.cc/logos/usdd-usdd-logo.png', networkIconUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png', address: walletAddresses.get('Tron') || 'TRX7ya...', color: 'text-gray-700' },
    
    // Основные криптовалюты
    { id: '2', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', balance: getBalance('2'), usdValue: '0.00', icon: '₿', iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', address: walletAddresses.get('Bitcoin') || 'bc1qxy2k...', color: 'text-orange-500' },
    { id: '3', name: 'Ethereum', symbol: 'ETH', network: 'Ethereum', balance: getBalance('3'), usdValue: '0.00', icon: 'Ξ', iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: walletAddresses.get('Ethereum') || '0x742d35...', color: 'text-blue-600' },
    { id: '4', name: 'BNB', symbol: 'BNB', network: 'BSC', balance: getBalance('4'), usdValue: '0.00', icon: '🔶', iconUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', address: walletAddresses.get('BSC') || '0xbnb123...', color: 'text-yellow-600' },
    { id: '5', name: 'Cardano', symbol: 'ADA', network: 'Cardano', balance: '0', usdValue: '0.00', icon: '₳', iconUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png', address: walletAddresses.get('Cardano') || 'addr1qxy...', color: 'text-blue-500' },
    { id: '6', name: 'Solana', symbol: 'SOL', network: 'Solana', balance: getBalance('6'), usdValue: '0.00', icon: '◎', iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png', address: walletAddresses.get('Solana') || 'Sol9vXc...', color: 'text-purple-600' },
    { id: '7', name: 'Ripple', symbol: 'XRP', network: 'XRP Ledger', balance: '0', usdValue: '0.00', icon: '✕', iconUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', address: walletAddresses.get('XRP Ledger') || 'rN7n7o...', color: 'text-gray-600' },
    { id: '8', name: 'Polkadot', symbol: 'DOT', network: 'Polkadot', balance: '0.0', usdValue: '0.00', icon: '●', iconUrl: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png', address: walletAddresses.get('Polkadot') || '15oF4u...', color: 'text-pink-600' },
    { id: '9', name: 'Dogecoin', symbol: 'DOGE', network: 'Dogecoin', balance: '0', usdValue: '0.00', icon: 'Ð', iconUrl: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png', address: walletAddresses.get('Dogecoin') || 'DH5ya...', color: 'text-yellow-500' },
    { id: '10', name: 'Polygon', symbol: 'MATIC', network: 'Polygon', balance: '0', usdValue: '0.00', icon: '⬡', iconUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.png', address: walletAddresses.get('Polygon') || '0xmatic...', color: 'text-purple-500' },
    { id: '11', name: 'Litecoin', symbol: 'LTC', network: 'Litecoin', balance: '0.00', usdValue: '0.00', icon: 'Ł', iconUrl: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png', address: walletAddresses.get('Litecoin') || 'LTC9vXc...', color: 'text-gray-500' },
    { id: '12', name: 'Chainlink', symbol: 'LINK', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: '⬢', iconUrl: 'https://cryptologos.cc/logos/chainlink-link-logo.png', address: walletAddresses.get('Ethereum') || '0xlink...', color: 'text-blue-700' },
    { id: '13', name: 'Avalanche', symbol: 'AVAX', network: 'Avalanche', balance: '0.0', usdValue: '0.00', icon: '🔺', iconUrl: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', address: walletAddresses.get('Avalanche') || 'X-avax...', color: 'text-red-600' },
    { id: '14', name: 'Cosmos', symbol: 'ATOM', network: 'Cosmos', balance: '0.0', usdValue: '0.00', icon: '⚛', iconUrl: 'https://cryptologos.cc/logos/cosmos-atom-logo.png', address: walletAddresses.get('Cosmos') || 'cosmos1...', color: 'text-indigo-600' },
    { id: '15', name: 'Tron', symbol: 'TRX', network: 'Tron', balance: '0', usdValue: '0.00', icon: '◬', iconUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png', address: walletAddresses.get('Tron') || 'TRX7ya...', color: 'text-red-700' },
    { id: '16', name: 'Monero', symbol: 'XMR', network: 'Monero', balance: '0.00', usdValue: '0.00', icon: 'ɱ', iconUrl: 'https://cryptologos.cc/logos/monero-xmr-logo.png', address: walletAddresses.get('Monero') || '47qxy2...', color: 'text-orange-700' },
    { id: '17', name: 'Stellar', symbol: 'XLM', network: 'Stellar', balance: '0', usdValue: '0.00', icon: '*', iconUrl: 'https://cryptologos.cc/logos/stellar-xlm-logo.png', address: walletAddresses.get('Stellar') || 'GAXLM...', color: 'text-cyan-600' },
    { id: '18', name: 'VeChain', symbol: 'VET', network: 'VeChain', balance: '0', usdValue: '0.00', icon: 'V', iconUrl: 'https://cryptologos.cc/logos/vechain-vet-logo.png', address: walletAddresses.get('VeChain') || '0xvet...', color: 'text-blue-800' },
    { id: '19', name: 'Algorand', symbol: 'ALGO', network: 'Algorand', balance: '0', usdValue: '0.00', icon: '▲', iconUrl: 'https://cryptologos.cc/logos/algorand-algo-logo.png', address: walletAddresses.get('Algorand') || 'ALGO7X...', color: 'text-gray-700' },
    { id: '20', name: 'Filecoin', symbol: 'FIL', network: 'Filecoin', balance: '0.0', usdValue: '0.00', icon: '⨎', iconUrl: 'https://cryptologos.cc/logos/filecoin-fil-logo.png', address: walletAddresses.get('Filecoin') || 'f1abc...', color: 'text-cyan-700' },
    { id: '21', name: 'Hedera', symbol: 'HBAR', network: 'Hedera', balance: '0', usdValue: '0.00', icon: 'ℏ', iconUrl: 'https://cryptologos.cc/logos/hedera-hbar-logo.png', address: walletAddresses.get('Hedera') || '0.0.123...', color: 'text-purple-700' },
    { id: '22', name: 'Near', symbol: 'NEAR', network: 'Near', balance: '0.0', usdValue: '0.00', icon: 'N', iconUrl: 'https://cryptologos.cc/logos/near-protocol-near-logo.png', address: walletAddresses.get('Near') || 'near.xy...', color: 'text-green-700' },
    { id: '23', name: 'Fantom', symbol: 'FTM', network: 'Fantom', balance: '0', usdValue: '0.00', icon: '👻', iconUrl: 'https://cryptologos.cc/logos/fantom-ftm-logo.png', address: walletAddresses.get('Fantom') || '0xftm...', color: 'text-blue-900' },
    { id: '24', name: 'Aptos', symbol: 'APT', network: 'Aptos', balance: '0.0', usdValue: '0.00', icon: 'A', iconUrl: 'https://cryptologos.cc/logos/aptos-apt-logo.png', address: walletAddresses.get('Aptos') || '0xapt...', color: 'text-teal-600' },
    { id: '25', name: 'Optimism', symbol: 'OP', network: 'Optimism', balance: '0.0', usdValue: '0.00', icon: '🔴', iconUrl: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png', address: walletAddresses.get('Optimism') || '0xop...', color: 'text-red-500' },
    { id: '26', name: 'Arbitrum', symbol: 'ARB', network: 'Arbitrum', balance: '0', usdValue: '0.00', icon: '🔵', iconUrl: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png', address: walletAddresses.get('Arbitrum') || '0xarb...', color: 'text-blue-600' },
    { id: '27', name: 'Sui', symbol: 'SUI', network: 'Sui', balance: '0.0', usdValue: '0.00', icon: '💧', iconUrl: 'https://cryptologos.cc/logos/sui-sui-logo.png', address: walletAddresses.get('Sui') || '0xsui...', color: 'text-cyan-500' },
    { id: '28', name: 'Immutable', symbol: 'IMX', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: '⬢', iconUrl: 'https://cryptologos.cc/logos/immutable-x-imx-logo.png', address: walletAddresses.get('Ethereum') || '0ximx...', color: 'text-indigo-700' },
    { id: '29', name: 'Lido DAO', symbol: 'LDO', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: '◉', iconUrl: 'https://cryptologos.cc/logos/lido-dao-ldo-logo.png', address: walletAddresses.get('Ethereum') || '0xldo...', color: 'text-orange-500' },
    { id: '30', name: 'Toncoin', symbol: 'TON', network: 'TON', balance: '0', usdValue: '0.00', icon: '💎', iconUrl: 'https://cryptologos.cc/logos/toncoin-ton-logo.png', address: walletAddresses.get('TON') || 'EQDton...', color: 'text-blue-400' },
    { id: '31', name: 'Uniswap', symbol: 'UNI', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: '🦄', iconUrl: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', address: walletAddresses.get('Ethereum') || '0xuni...', color: 'text-pink-500' },
    { id: '32', name: 'Shiba Inu', symbol: 'SHIB', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: '🐕', iconUrl: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png', address: walletAddresses.get('Ethereum') || '0xshib...', color: 'text-orange-600' },
    { id: '33', name: 'Bitcoin Cash', symbol: 'BCH', network: 'Bitcoin Cash', balance: '0.00', usdValue: '0.00', icon: '₿', iconUrl: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png', address: walletAddresses.get('Bitcoin Cash') || 'bch1q...', color: 'text-green-500' },
    { id: '34', name: 'Ethereum Classic', symbol: 'ETC', network: 'Ethereum Classic', balance: '0.00', usdValue: '0.00', icon: 'Ξ', iconUrl: 'https://cryptologos.cc/logos/ethereum-classic-etc-logo.png', address: walletAddresses.get('Ethereum Classic') || '0xetc...', color: 'text-green-700' },
    { id: '35', name: 'Aave', symbol: 'AAVE', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: 'A', iconUrl: 'https://cryptologos.cc/logos/aave-aave-logo.png', address: walletAddresses.get('Ethereum') || '0xaave...', color: 'text-purple-600' },
    { id: '36', name: 'The Graph', symbol: 'GRT', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'G', iconUrl: 'https://cryptologos.cc/logos/the-graph-grt-logo.png', address: walletAddresses.get('Ethereum') || '0xgrt...', color: 'text-blue-600' },
    { id: '37', name: 'Maker', symbol: 'MKR', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: 'M', iconUrl: 'https://cryptologos.cc/logos/maker-mkr-logo.png', address: walletAddresses.get('Ethereum') || '0xmkr...', color: 'text-teal-600' },
    { id: '38', name: 'Curve', symbol: 'CRV', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png', address: walletAddresses.get('Ethereum') || '0xcrv...', color: 'text-blue-500' },
    { id: '39', name: 'PancakeSwap', symbol: 'CAKE', network: 'BSC', balance: '0', usdValue: '0.00', icon: '🥞', iconUrl: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png', address: walletAddresses.get('BSC') || '0xcake...', color: 'text-yellow-700' },
    { id: '40', name: 'Synthetix', symbol: 'SNX', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'S', iconUrl: 'https://cryptologos.cc/logos/synthetix-snx-logo.png', address: walletAddresses.get('Ethereum') || '0xsnx...', color: 'text-cyan-600' },
    { id: '41', name: 'Zcash', symbol: 'ZEC', network: 'Zcash', balance: '0.00', usdValue: '0.00', icon: 'Z', iconUrl: 'https://cryptologos.cc/logos/zcash-zec-logo.png', address: walletAddresses.get('Zcash') || 't1ZEC...', color: 'text-yellow-600' },
    { id: '42', name: 'Dash', symbol: 'DASH', network: 'Dash', balance: '0.00', usdValue: '0.00', icon: 'D', iconUrl: 'https://cryptologos.cc/logos/dash-dash-logo.png', address: walletAddresses.get('Dash') || 'Xdash...', color: 'text-blue-600' },
    { id: '43', name: 'Decentraland', symbol: 'MANA', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'M', iconUrl: 'https://cryptologos.cc/logos/decentraland-mana-logo.png', address: walletAddresses.get('Ethereum') || '0xmana...', color: 'text-red-500' },
    { id: '44', name: 'The Sandbox', symbol: 'SAND', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'S', iconUrl: 'https://cryptologos.cc/logos/the-sandbox-sand-logo.png', address: walletAddresses.get('Ethereum') || '0xsand...', color: 'text-cyan-500' },
    { id: '45', name: 'Axie Infinity', symbol: 'AXS', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'A', iconUrl: 'https://cryptologos.cc/logos/axie-infinity-axs-logo.png', address: walletAddresses.get('Ethereum') || '0xaxs...', color: 'text-blue-600' },
    { id: '46', name: 'Theta', symbol: 'THETA', network: 'Theta', balance: '0', usdValue: '0.00', icon: 'Θ', iconUrl: 'https://cryptologos.cc/logos/theta-theta-logo.png', address: walletAddresses.get('Theta') || '0xtheta...', color: 'text-cyan-600' },
    { id: '47', name: 'EOS', symbol: 'EOS', network: 'EOS', balance: '0', usdValue: '0.00', icon: 'E', iconUrl: 'https://cryptologos.cc/logos/eos-eos-logo.png', address: walletAddresses.get('EOS') || 'eos1...', color: 'text-gray-700' },
    { id: '48', name: 'Tezos', symbol: 'XTZ', network: 'Tezos', balance: '0', usdValue: '0.00', icon: 'T', iconUrl: 'https://cryptologos.cc/logos/tezos-xtz-logo.png', address: walletAddresses.get('Tezos') || 'tz1...', color: 'text-blue-600' },
    { id: '49', name: 'IOTA', symbol: 'MIOTA', network: 'IOTA', balance: '0', usdValue: '0.00', icon: 'I', iconUrl: 'https://cryptologos.cc/logos/iota-miota-logo.png', address: walletAddresses.get('IOTA') || 'iota1...', color: 'text-gray-600' },
    { id: '50', name: 'NEO', symbol: 'NEO', network: 'NEO', balance: '0', usdValue: '0.00', icon: 'N', iconUrl: 'https://cryptologos.cc/logos/neo-neo-logo.png', address: walletAddresses.get('NEO') || 'Aneo...', color: 'text-green-600' },
    { id: '51', name: 'Compound', symbol: 'COMP', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/compound-comp-logo.png', address: walletAddresses.get('Ethereum') || '0xcomp...', color: 'text-green-500' },
    { id: '52', name: 'Quant', symbol: 'QNT', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'Q', iconUrl: 'https://cryptologos.cc/logos/quant-qnt-logo.png', address: walletAddresses.get('Ethereum') || '0xqnt...', color: 'text-gray-700' },
    { id: '53', name: 'BitTorrent', symbol: 'BTT', network: 'Tron', balance: '0', usdValue: '0.00', icon: 'B', iconUrl: 'https://cryptologos.cc/logos/bittorrent-btt-logo.png', address: walletAddresses.get('Tron') || 'TBtt...', color: 'text-gray-600' },
    { id: '54', name: 'Flow', symbol: 'FLOW', network: 'Flow', balance: '0', usdValue: '0.00', icon: 'F', iconUrl: 'https://cryptologos.cc/logos/flow-flow-logo.png', address: walletAddresses.get('Flow') || '0xflow...', color: 'text-green-500' },
    { id: '55', name: 'Elrond', symbol: 'EGLD', network: 'Elrond', balance: '0', usdValue: '0.00', icon: 'E', iconUrl: 'https://cryptologos.cc/logos/elrond-egld-egld-logo.png', address: walletAddresses.get('Elrond') || 'erd1...', color: 'text-gray-700' },
    { id: '56', name: 'Chiliz', symbol: 'CHZ', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/chiliz-chz-logo.png', address: walletAddresses.get('Ethereum') || '0xchz...', color: 'text-red-600' },
    { id: '57', name: 'Basic Attention', symbol: 'BAT', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'B', iconUrl: 'https://cryptologos.cc/logos/basic-attention-token-bat-logo.png', address: walletAddresses.get('Ethereum') || '0xbat...', color: 'text-orange-600' },
    { id: '58', name: 'Enjin Coin', symbol: 'ENJ', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'E', iconUrl: 'https://cryptologos.cc/logos/enjin-coin-enj-logo.png', address: walletAddresses.get('Ethereum') || '0xenj...', color: 'text-purple-600' },
    { id: '59', name: 'Zilliqa', symbol: 'ZIL', network: 'Zilliqa', balance: '0', usdValue: '0.00', icon: 'Z', iconUrl: 'https://cryptologos.cc/logos/zilliqa-zil-logo.png', address: walletAddresses.get('Zilliqa') || 'zil1...', color: 'text-teal-600' },
    { id: '60', name: 'Kusama', symbol: 'KSM', network: 'Kusama', balance: '0', usdValue: '0.00', icon: 'K', iconUrl: 'https://cryptologos.cc/logos/kusama-ksm-logo.png', address: walletAddresses.get('Kusama') || 'ksm1...', color: 'text-gray-800' },
    { id: '61', name: 'Stacks', symbol: 'STX', network: 'Stacks', balance: '0', usdValue: '0.00', icon: 'S', iconUrl: 'https://cryptologos.cc/logos/stacks-stx-logo.png', address: walletAddresses.get('Stacks') || 'SP1...', color: 'text-purple-700' },
    { id: '62', name: 'Helium', symbol: 'HNT', network: 'Helium', balance: '0', usdValue: '0.00', icon: 'H', iconUrl: 'https://cryptologos.cc/logos/helium-hnt-logo.png', address: walletAddresses.get('Helium') || '13hnt...', color: 'text-cyan-600' },
    { id: '63', name: 'Gala', symbol: 'GALA', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'G', iconUrl: 'https://cryptologos.cc/logos/gala-gala-logo.png', address: walletAddresses.get('Ethereum') || '0xgala...', color: 'text-gray-700' },
    { id: '64', name: 'Loopring', symbol: 'LRC', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'L', iconUrl: 'https://cryptologos.cc/logos/loopring-lrc-logo.png', address: walletAddresses.get('Ethereum') || '0xlrc...', color: 'text-blue-600' },
    { id: '65', name: '1inch', symbol: '1INCH', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: '1', iconUrl: 'https://cryptologos.cc/logos/1inch-1inch-logo.png', address: walletAddresses.get('Ethereum') || '0x1inch...', color: 'text-red-600' },
    { id: '66', name: 'SushiSwap', symbol: 'SUSHI', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: '🍣', iconUrl: 'https://cryptologos.cc/logos/sushiswap-sushi-logo.png', address: walletAddresses.get('Ethereum') || '0xsushi...', color: 'text-pink-600' },
    { id: '67', name: 'Yearn Finance', symbol: 'YFI', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: 'Y', iconUrl: 'https://cryptologos.cc/logos/yearn-finance-yfi-logo.png', address: walletAddresses.get('Ethereum') || '0xyfi...', color: 'text-blue-700' },
    { id: '68', name: 'THORChain', symbol: 'RUNE', network: 'THORChain', balance: '0', usdValue: '0.00', icon: 'R', iconUrl: 'https://cryptologos.cc/logos/thorchain-rune-logo.png', address: walletAddresses.get('THORChain') || 'thor1...', color: 'text-teal-600' },
    { id: '69', name: 'Celo', symbol: 'CELO', network: 'Celo', balance: '0', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/celo-celo-logo.png', address: walletAddresses.get('Celo') || '0xcelo...', color: 'text-green-600' },
    { id: '70', name: 'Harmony', symbol: 'ONE', network: 'Harmony', balance: '0', usdValue: '0.00', icon: 'O', iconUrl: 'https://cryptologos.cc/logos/harmony-one-logo.png', address: walletAddresses.get('Harmony') || 'one1...', color: 'text-cyan-500' },
    { id: '71', name: 'Holo', symbol: 'HOT', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'H', iconUrl: 'https://cryptologos.cc/logos/holo-hot-logo.png', address: walletAddresses.get('Ethereum') || '0xhot...', color: 'text-purple-600' },
    { id: '72', name: 'Qtum', symbol: 'QTUM', network: 'Qtum', balance: '0', usdValue: '0.00', icon: 'Q', iconUrl: 'https://cryptologos.cc/logos/qtum-qtum-logo.png', address: walletAddresses.get('Qtum') || 'Qq...', color: 'text-blue-500' },
    { id: '73', name: 'Ravencoin', symbol: 'RVN', network: 'Ravencoin', balance: '0', usdValue: '0.00', icon: 'R', iconUrl: 'https://cryptologos.cc/logos/ravencoin-rvn-logo.png', address: walletAddresses.get('Ravencoin') || 'Rrvn...', color: 'text-orange-600' },
    { id: '74', name: 'OMG Network', symbol: 'OMG', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'O', iconUrl: 'https://cryptologos.cc/logos/omg-network-omg-logo.png', address: walletAddresses.get('Ethereum') || '0xomg...', color: 'text-blue-600' },
    { id: '75', name: 'Waves', symbol: 'WAVES', network: 'Waves', balance: '0', usdValue: '0.00', icon: 'W', iconUrl: 'https://cryptologos.cc/logos/waves-waves-logo.png', address: walletAddresses.get('Waves') || '3P...', color: 'text-blue-700' },
    { id: '76', name: 'ICON', symbol: 'ICX', network: 'ICON', balance: '0', usdValue: '0.00', icon: 'I', iconUrl: 'https://cryptologos.cc/logos/icon-icx-logo.png', address: walletAddresses.get('ICON') || 'hx...', color: 'text-cyan-600' },
    { id: '77', name: 'Ontology', symbol: 'ONT', network: 'Ontology', balance: '0', usdValue: '0.00', icon: 'O', iconUrl: 'https://cryptologos.cc/logos/ontology-ont-logo.png', address: walletAddresses.get('Ontology') || 'A...', color: 'text-teal-600' },
    { id: '78', name: 'Nano', symbol: 'XNO', network: 'Nano', balance: '0', usdValue: '0.00', icon: 'N', iconUrl: 'https://cryptologos.cc/logos/nano-xno-logo.png', address: walletAddresses.get('Nano') || 'nano_...', color: 'text-blue-600' },
    { id: '79', name: 'Siacoin', symbol: 'SC', network: 'Siacoin', balance: '0', usdValue: '0.00', icon: 'S', iconUrl: 'https://cryptologos.cc/logos/siacoin-sc-logo.png', address: walletAddresses.get('Siacoin') || 'sc...', color: 'text-green-600' },
    { id: '80', name: 'Ankr', symbol: 'ANKR', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'A', iconUrl: 'https://cryptologos.cc/logos/ankr-ankr-logo.png', address: walletAddresses.get('Ethereum') || '0xankr...', color: 'text-blue-600' },
    { id: '81', name: 'Ren', symbol: 'REN', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'R', iconUrl: 'https://cryptologos.cc/logos/ren-ren-logo.png', address: walletAddresses.get('Ethereum') || '0xren...', color: 'text-gray-700' },
    { id: '82', name: 'Band Protocol', symbol: 'BAND', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'B', iconUrl: 'https://cryptologos.cc/logos/band-protocol-band-logo.png', address: walletAddresses.get('Ethereum') || '0xband...', color: 'text-blue-600' },
    { id: '83', name: 'Ocean Protocol', symbol: 'OCEAN', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'O', iconUrl: 'https://cryptologos.cc/logos/ocean-protocol-ocean-logo.png', address: walletAddresses.get('Ethereum') || '0xocean...', color: 'text-pink-500' },
    { id: '84', name: 'Fetch.ai', symbol: 'FET', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'F', iconUrl: 'https://cryptologos.cc/logos/fetch-ai-fet-logo.png', address: walletAddresses.get('Ethereum') || '0xfet...', color: 'text-blue-600' },
    { id: '85', name: 'Reserve Rights', symbol: 'RSR', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'R', iconUrl: 'https://cryptologos.cc/logos/reserve-rights-rsr-logo.png', address: walletAddresses.get('Ethereum') || '0xrsr...', color: 'text-gray-700' },
    { id: '86', name: 'Arweave', symbol: 'AR', network: 'Arweave', balance: '0', usdValue: '0.00', icon: 'A', iconUrl: 'https://cryptologos.cc/logos/arweave-ar-logo.png', address: walletAddresses.get('Arweave') || 'ar...', color: 'text-gray-700' },
    { id: '87', name: 'Injective', symbol: 'INJ', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'I', iconUrl: 'https://cryptologos.cc/logos/injective-inj-logo.png', address: walletAddresses.get('Ethereum') || '0xinj...', color: 'text-cyan-600' },
    { id: '88', name: 'Kava', symbol: 'KAVA', network: 'Kava', balance: '0', usdValue: '0.00', icon: 'K', iconUrl: 'https://cryptologos.cc/logos/kava-kava-logo.png', address: walletAddresses.get('Kava') || 'kava1...', color: 'text-red-600' },
    { id: '89', name: 'Secret', symbol: 'SCRT', network: 'Secret', balance: '0', usdValue: '0.00', icon: 'S', iconUrl: 'https://cryptologos.cc/logos/secret-scrt-logo.png', address: walletAddresses.get('Secret') || 'secret1...', color: 'text-gray-700' },
    { id: '90', name: 'Nervos Network', symbol: 'CKB', network: 'Nervos', balance: '0', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/nervos-network-ckb-logo.png', address: walletAddresses.get('Nervos') || 'ckb1...', color: 'text-green-600' },
    { id: '91', name: 'Convex Finance', symbol: 'CVX', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/convex-finance-cvx-logo.png', address: walletAddresses.get('Ethereum') || '0xcvx...', color: 'text-gray-700' },
    { id: '92', name: 'Rocket Pool', symbol: 'RPL', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'R', iconUrl: 'https://cryptologos.cc/logos/rocket-pool-rpl-logo.png', address: walletAddresses.get('Ethereum') || '0xrpl...', color: 'text-orange-600' },
    { id: '93', name: 'Frax', symbol: 'FRAX', network: 'Ethereum', balance: '0.00', usdValue: '0.00', icon: 'F', iconUrl: 'https://cryptologos.cc/logos/frax-frax-logo.png', address: walletAddresses.get('Ethereum') || '0xfrax...', color: 'text-gray-700' },
    { id: '94', name: 'TrueUSD', symbol: 'TUSD', network: 'Ethereum', balance: '0.00', usdValue: '0.00', icon: 'T', iconUrl: 'https://cryptologos.cc/logos/trueusd-tusd-logo.png', address: walletAddresses.get('Ethereum') || '0xtusd...', color: 'text-blue-600' },
    { id: '95', name: 'Pax Dollar', symbol: 'USDP', network: 'Ethereum', balance: '0.00', usdValue: '0.00', icon: 'P', iconUrl: 'https://cryptologos.cc/logos/paxos-standard-pax-logo.png', address: walletAddresses.get('Ethereum') || '0xusdp...', color: 'text-green-600' },
    { id: '96', name: 'Gemini Dollar', symbol: 'GUSD', network: 'Ethereum', balance: '0.00', usdValue: '0.00', icon: 'G', iconUrl: 'https://cryptologos.cc/logos/gemini-dollar-gusd-logo.png', address: walletAddresses.get('Ethereum') || '0xgusd...', color: 'text-blue-600' },
    { id: '97', name: 'USD Coin', symbol: 'USDC', network: 'Ethereum', balance: '0.00', usdValue: '0.00', icon: 'C', iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', address: walletAddresses.get('Ethereum') || '0xusdc...', color: 'text-blue-600' },
    { id: '98', name: 'Dai', symbol: 'DAI', network: 'Ethereum', balance: '0.00', usdValue: '0.00', icon: 'D', iconUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', address: walletAddresses.get('Ethereum') || '0xdai...', color: 'text-yellow-600' },
    { id: '99', name: 'Binance USD', symbol: 'BUSD', network: 'BSC', balance: '0.00', usdValue: '0.00', icon: 'B', iconUrl: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png', address: walletAddresses.get('BSC') || '0xbusd...', color: 'text-yellow-600' },
    { id: '100', name: 'Wrapped Bitcoin', symbol: 'WBTC', network: 'Ethereum', balance: '0.00000000', usdValue: '0.00', icon: '₿', iconUrl: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png', address: walletAddresses.get('Ethereum') || '0xwbtc...', color: 'text-orange-500' },
    { id: '101', name: 'Staked Ether', symbol: 'stETH', network: 'Ethereum', balance: '0.0000', usdValue: '0.00', icon: 'Ξ', iconUrl: 'https://cryptologos.cc/logos/steth-steth-logo.png', address: walletAddresses.get('Ethereum') || '0xsteth...', color: 'text-purple-600' },
    { id: '102', name: 'Pepe', symbol: 'PEPE', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: '🐸', iconUrl: 'https://cryptologos.cc/logos/pepe-pepe-logo.png', address: walletAddresses.get('Ethereum') || '0xpepe...', color: 'text-green-600' },
    { id: '103', name: 'Render', symbol: 'RNDR', network: 'Ethereum', balance: '0', usdValue: '0.00', icon: 'R', iconUrl: 'https://cryptologos.cc/logos/render-token-rndr-logo.png', address: walletAddresses.get('Ethereum') || '0xrndr...', color: 'text-orange-600' },
    { id: '104', name: 'MultiversX', symbol: 'EGLD', network: 'MultiversX', balance: '0', usdValue: '0.00', icon: 'M', iconUrl: 'https://cryptologos.cc/logos/multiversx-egld-egld-logo.png', address: walletAddresses.get('MultiversX') || 'erd1...', color: 'text-gray-700' },
    { id: '105', name: 'Kaspa', symbol: 'KAS', network: 'Kaspa', balance: '0', usdValue: '0.00', icon: 'K', iconUrl: 'https://cryptologos.cc/logos/kaspa-kas-logo.png', address: walletAddresses.get('Kaspa') || 'kaspa:...', color: 'text-blue-600' },
  ], [walletAddresses, cryptoBalances]);

  const mainCryptos = useMemo(() => {
    return allCryptoList.filter(c => selectedCryptoIds.includes(c.id)).map(crypto => {
      const price = cryptoPrices[crypto.symbol] || 0;
      const balance = parseFloat(crypto.balance.replace(',', ''));
      const usdValue = (balance * price).toFixed(2);
      return { ...crypto, usdValue };
    });
  }, [allCryptoList, selectedCryptoIds, cryptoPrices]);

  const totalBalance = useMemo(() => {
    return mainCryptos.reduce((sum, c) => sum + parseFloat(c.usdValue || '0'), 0);
  }, [mainCryptos]);

  const handleReceive = (crypto: Crypto) => {
    setShowQR(true);
  };

  const handleSend = (crypto: Crypto) => {
    setShowSend(true);
  };

  const handleLogout = () => {
    const STORAGE_KEY = 'dex_wallet_data';
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_SELECTED);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-b from-primary to-primary/90 px-5 pt-safe pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between pt-4 pb-6">
          <h1 className="text-lg font-bold text-white">Кошелек</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-white/10 text-white rounded-xl"
          >
            <Icon name="Settings" size={22} />
          </Button>
        </div>

        <div className="text-center space-y-3 py-6">
          <p className="text-sm text-white/80 font-medium">Общий баланс</p>
          <h2 className="text-5xl font-bold text-white tracking-tight">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-green-500/20">
              <Icon name="TrendingUp" size={14} className="text-white" />
              <span className="text-sm font-semibold text-white">+12.5%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4">
          <Button
            onClick={() => {
              if (mainCryptos[0]) {
                setSelectedCrypto(mainCryptos[0]);
                setShowSend(true);
              }
            }}
            className="h-auto flex flex-col items-center justify-center space-y-2 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border-none backdrop-blur-sm active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Send" size={22} />
            </div>
            <span className="text-sm font-semibold">Отправить</span>
          </Button>

          <Button
            onClick={() => {
              if (mainCryptos[0]) {
                setSelectedCrypto(mainCryptos[0]);
                setShowQR(true);
              }
            }}
            className="h-auto flex flex-col items-center justify-center space-y-2 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border-none backdrop-blur-sm active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Download" size={22} />
            </div>
            <span className="text-sm font-semibold">Получить</span>
          </Button>

          <Button
            className="h-auto flex flex-col items-center justify-center space-y-2 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border-none backdrop-blur-sm active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="ArrowLeftRight" size={22} />
            </div>
            <span className="text-sm font-semibold">Обменять</span>
          </Button>
        </div>
      </div>

      <div className="px-5 pt-6 space-y-4">
        {activeTab === 'home' && (
          <>
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold text-foreground">Криптовалюты</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:bg-primary/10"
                onClick={() => setShowAddModal(true)}
              >
                <Icon name="Plus" size={18} className="mr-1" />
                Добавить
              </Button>
            </div>

            <div className="space-y-2">
              {mainCryptos.map((crypto) => (
                <Card
                  key={crypto.id}
                  className="p-4 bg-card hover:bg-secondary/30 border-border active:scale-[0.98] transition-all rounded-xl cursor-pointer shadow-sm"
                  onClick={() => setSelectedCrypto(crypto)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-visible">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          {crypto.iconUrl ? (
                            <img src={crypto.iconUrl} alt={crypto.symbol} className="w-full h-full object-cover" />
                          ) : (
                            <span className={`text-2xl font-bold ${crypto.color}`}>{crypto.icon}</span>
                          )}
                        </div>
                        {crypto.networkIconUrl && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-[3px] border-white dark:border-gray-900 overflow-hidden shadow-lg ring-1 ring-black/10">
                            <img src={crypto.networkIconUrl} alt={crypto.network} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">{crypto.symbol}</p>
                        <p className="text-xs text-muted-foreground">{crypto.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-foreground">${crypto.usdValue}</p>
                      <p className="text-xs text-muted-foreground">{crypto.balance} {crypto.symbol}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === 'nft' && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-foreground px-1">Коллекции NFT</h2>
            <Card className="p-8 bg-card border-border rounded-xl shadow-sm">
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Icon name="Image" size={36} className="text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">NFT не найдены</p>
                <p className="text-sm text-muted-foreground mb-6">Начните коллекционировать цифровые активы</p>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Узнать больше о NFT
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'defi' && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-foreground px-1">DeFi</h2>
            <Card className="p-8 bg-card border-border rounded-xl shadow-sm">
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Icon name="TrendingUp" size={36} className="text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">DeFi возможности</p>
                <p className="text-sm text-muted-foreground mb-6">Зарабатывайте и инвестируйте в DeFi</p>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Исследовать DeFi
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-foreground px-1">Настройки</h2>
            <Card className="p-5 bg-card border-border rounded-xl shadow-sm space-y-2">
              <div className="flex items-center space-x-4 pb-4 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-2xl">{username[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{username}</p>
                  <p className="text-sm text-muted-foreground">Trust Wallet</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                className="w-full justify-start h-14 rounded-xl hover:bg-secondary text-foreground"
              >
                <Icon name="User" size={22} className="mr-3 text-muted-foreground" />
                <span className="text-base">Профиль</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 rounded-xl hover:bg-secondary text-foreground"
              >
                <Icon name="Lock" size={22} className="mr-3 text-muted-foreground" />
                <span className="text-base">Безопасность</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 rounded-xl hover:bg-secondary text-foreground"
              >
                <Icon name="Bell" size={22} className="mr-3 text-muted-foreground" />
                <span className="text-base">Уведомления</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-14 rounded-xl hover:bg-secondary text-foreground"
              >
                <Icon name="Globe" size={22} className="mr-3 text-muted-foreground" />
                <span className="text-base">Язык и регион</span>
              </Button>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start h-14 rounded-xl hover:bg-destructive/10 text-destructive"
              >
                <Icon name="LogOut" size={22} className="mr-3" />
                <span className="text-base font-semibold">Выйти</span>
              </Button>
            </Card>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-xl border-t border-border shadow-lg z-50 pb-safe">
        <div className="flex items-center justify-around h-20 px-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 py-2 px-5 rounded-xl transition-all ${
              activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="Wallet" size={24} />
            <span className="text-xs font-semibold">Кошелек</span>
          </button>

          <button
            onClick={() => setActiveTab('nft')}
            className={`flex flex-col items-center space-y-1 py-2 px-5 rounded-xl transition-all ${
              activeTab === 'nft' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="Image" size={24} />
            <span className="text-xs font-semibold">NFT</span>
          </button>

          <button
            onClick={() => setActiveTab('defi')}
            className={`flex flex-col items-center space-y-1 py-2 px-5 rounded-xl transition-all ${
              activeTab === 'defi' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="TrendingUp" size={24} />
            <span className="text-xs font-semibold">DeFi</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 py-2 px-5 rounded-xl transition-all ${
              activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="Settings" size={24} />
            <span className="text-xs font-semibold">Настройки</span>
          </button>
        </div>
      </nav>

      {showQR && selectedCrypto && (
        <QRModal
          open={showQR}
          crypto={selectedCrypto}
          onClose={() => {
            setShowQR(false);
          }}
        />
      )}

      {showSend && selectedCrypto && (
        <SendModal
          open={showSend}
          crypto={selectedCrypto}
          onClose={() => {
            setShowSend(false);
          }}
        />
      )}

      {showAddModal && (
        <AddCryptoModal
          allCryptos={allCryptoList}
          selectedCryptos={selectedCryptoIds}
          onAdd={saveSelectedCryptos}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedCrypto && !showQR && !showSend && !showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" onClick={() => setSelectedCrypto(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 pb-safe animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-6"></div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-16 h-16 rounded-full bg-secondary flex items-center justify-center overflow-visible">
                <div className="w-full h-full rounded-full overflow-hidden">
                  {selectedCrypto.iconUrl ? (
                    <img src={selectedCrypto.iconUrl} alt={selectedCrypto.symbol} className="w-full h-full object-cover" />
                  ) : (
                    <span className={`text-3xl font-bold ${selectedCrypto.color}`}>{selectedCrypto.icon}</span>
                  )}
                </div>
                {selectedCrypto.networkIconUrl && (
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border-[3px] border-white dark:border-gray-900 overflow-hidden shadow-xl ring-2 ring-black/10">
                    <img src={selectedCrypto.networkIconUrl} alt={selectedCrypto.network} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{selectedCrypto.symbol}</p>
                <p className="text-sm text-muted-foreground">{selectedCrypto.name}</p>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-5 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Баланс</p>
              <p className="text-3xl font-bold text-foreground mb-2">${selectedCrypto.usdValue}</p>
              <p className="text-sm text-muted-foreground">{selectedCrypto.balance} {selectedCrypto.symbol}</p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-muted-foreground">Адрес кошелька</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(selectedCrypto.address);
                    setCopiedAddress(selectedCrypto.id);
                    toast.success('Адрес скопирован');
                    setTimeout(() => setCopiedAddress(null), 2000);
                  }}
                  className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                >
                  <Icon name={copiedAddress === selectedCrypto.id ? "Check" : "Copy"} size={16} />
                  <span className="text-sm font-semibold">{copiedAddress === selectedCrypto.id ? 'Скопировано' : 'Копировать'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                <p className="text-xs font-mono text-foreground break-all leading-relaxed">{selectedCrypto.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setShowSend(true);
                }}
                className="h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl"
              >
                <Icon name="Send" size={20} className="mr-2" />
                Отправить
              </Button>

              <Button
                onClick={() => {
                  setShowQR(true);
                }}
                className="h-14 bg-secondary hover:bg-secondary/80 text-foreground text-base font-semibold rounded-xl"
              >
                <Icon name="Download" size={20} className="mr-2" />
                Получить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainWallet;