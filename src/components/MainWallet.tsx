import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import QRModal from '@/components/QRModal';
import SendModal from '@/components/SendModal';

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
  address: string;
  color: string;
}

const MainWallet = ({ username, walletAddresses }: MainWalletProps) => {
  const [activeTab, setActiveTab] = useState<'home' | 'nft' | 'defi' | 'profile'>('home');
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showSend, setShowSend] = useState(false);

  const cryptoList: Crypto[] = [
    { id: '1', name: 'Tether', symbol: 'USDT', network: 'TRC20', balance: '0.00', usdValue: '0.00', icon: '₮', address: walletAddresses.get('TRC20') || 'TXYZabcd1234...', color: 'text-green-600' },
    { id: '2', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', balance: '0.00000000', usdValue: '0.00', icon: '₿', address: walletAddresses.get('Bitcoin') || 'bc1qxy2k...', color: 'text-orange-500' },
    { id: '3', name: 'Ethereum', symbol: 'ETH', network: 'Ethereum', balance: '0.0000', usdValue: '0.00', icon: 'Ξ', address: walletAddresses.get('Ethereum') || '0x742d35...', color: 'text-blue-600' },
    { id: '4', name: 'BNB', symbol: 'BNB', network: 'BSC', balance: '0.00', usdValue: '0.00', icon: '🔶', address: walletAddresses.get('BSC') || '0xbnb123...', color: 'text-yellow-600' },
    { id: '5', name: 'Cardano', symbol: 'ADA', network: 'Cardano', balance: '0', usdValue: '0.00', icon: '₳', address: walletAddresses.get('Cardano') || 'addr1qxy...', color: 'text-blue-500' },
    { id: '6', name: 'Solana', symbol: 'SOL', network: 'Solana', balance: '0.0', usdValue: '0.00', icon: '◎', address: walletAddresses.get('Solana') || 'Sol9vXc...', color: 'text-purple-600' },
    { id: '7', name: 'Ripple', symbol: 'XRP', network: 'XRP Ledger', balance: '0', usdValue: '0.00', icon: '✕', address: walletAddresses.get('XRP Ledger') || 'rN7n7o...', color: 'text-gray-600' },
    { id: '8', name: 'Polkadot', symbol: 'DOT', network: 'Polkadot', balance: '0.0', usdValue: '0.00', icon: '●', address: walletAddresses.get('Polkadot') || '15oF4u...', color: 'text-pink-600' },
    { id: '9', name: 'Dogecoin', symbol: 'DOGE', network: 'Dogecoin', balance: '0', usdValue: '0.00', icon: 'Ð', address: walletAddresses.get('Dogecoin') || 'DH5ya...', color: 'text-yellow-500' },
    { id: '10', name: 'Polygon', symbol: 'MATIC', network: 'Polygon', balance: '0', usdValue: '0.00', icon: '⬡', address: walletAddresses.get('Polygon') || '0xmatic...', color: 'text-purple-500' },
    { id: '11', name: 'Litecoin', symbol: 'LTC', network: 'Litecoin', balance: '0.00', usdValue: '0.00', icon: 'Ł', address: walletAddresses.get('Litecoin') || 'LTC9vXc...', color: 'text-gray-500' },
    { id: '12', name: 'Chainlink', symbol: 'LINK', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: '⬢', address: walletAddresses.get('Ethereum') || '0xlink...', color: 'text-blue-700' },
    { id: '13', name: 'Avalanche', symbol: 'AVAX', network: 'Avalanche', balance: '0.0', usdValue: '0.00', icon: '🔺', address: walletAddresses.get('Avalanche') || 'X-avax...', color: 'text-red-600' },
    { id: '14', name: 'Cosmos', symbol: 'ATOM', network: 'Cosmos', balance: '0.0', usdValue: '0.00', icon: '⚛', address: walletAddresses.get('Cosmos') || 'cosmos1...', color: 'text-indigo-600' },
    { id: '15', name: 'Tron', symbol: 'TRX', network: 'Tron', balance: '0', usdValue: '0.00', icon: '◬', address: walletAddresses.get('Tron') || 'TRX7ya...', color: 'text-red-700' },
    { id: '16', name: 'Monero', symbol: 'XMR', network: 'Monero', balance: '0.00', usdValue: '0.00', icon: 'ɱ', address: walletAddresses.get('Monero') || '47qxy2...', color: 'text-orange-700' },
    { id: '17', name: 'Stellar', symbol: 'XLM', network: 'Stellar', balance: '0', usdValue: '0.00', icon: '*', address: walletAddresses.get('Stellar') || 'GAXLM...', color: 'text-cyan-600' },
    { id: '18', name: 'VeChain', symbol: 'VET', network: 'VeChain', balance: '0', usdValue: '0.00', icon: 'V', address: walletAddresses.get('VeChain') || '0xvet...', color: 'text-blue-800' },
    { id: '19', name: 'Algorand', symbol: 'ALGO', network: 'Algorand', balance: '0', usdValue: '0.00', icon: '▲', address: walletAddresses.get('Algorand') || 'ALGO7X...', color: 'text-gray-700' },
    { id: '20', name: 'Filecoin', symbol: 'FIL', network: 'Filecoin', balance: '0.0', usdValue: '0.00', icon: '⨎', address: walletAddresses.get('Filecoin') || 'f1abc...', color: 'text-cyan-700' },
    { id: '21', name: 'Hedera', symbol: 'HBAR', network: 'Hedera', balance: '0', usdValue: '0.00', icon: 'ℏ', address: walletAddresses.get('Hedera') || '0.0.123...', color: 'text-purple-700' },
    { id: '22', name: 'Near', symbol: 'NEAR', network: 'Near', balance: '0.0', usdValue: '0.00', icon: 'N', address: walletAddresses.get('Near') || 'near.xy...', color: 'text-green-700' },
    { id: '23', name: 'Fantom', symbol: 'FTM', network: 'Fantom', balance: '0', usdValue: '0.00', icon: '👻', address: walletAddresses.get('Fantom') || '0xftm...', color: 'text-blue-900' },
    { id: '24', name: 'Aptos', symbol: 'APT', network: 'Aptos', balance: '0.0', usdValue: '0.00', icon: 'A', address: walletAddresses.get('Aptos') || '0xapt...', color: 'text-teal-600' },
    { id: '25', name: 'Optimism', symbol: 'OP', network: 'Optimism', balance: '0.0', usdValue: '0.00', icon: '🔴', address: walletAddresses.get('Optimism') || '0xop...', color: 'text-red-500' },
    { id: '26', name: 'Arbitrum', symbol: 'ARB', network: 'Arbitrum', balance: '0', usdValue: '0.00', icon: '🔵', address: walletAddresses.get('Arbitrum') || '0xarb...', color: 'text-blue-600' },
    { id: '27', name: 'Sui', symbol: 'SUI', network: 'Sui', balance: '0.0', usdValue: '0.00', icon: '💧', address: walletAddresses.get('Sui') || '0xsui...', color: 'text-cyan-500' },
    { id: '28', name: 'Immutable', symbol: 'IMX', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: '⬢', address: walletAddresses.get('Ethereum') || '0ximx...', color: 'text-indigo-700' },
    { id: '29', name: 'Lido DAO', symbol: 'LDO', network: 'Ethereum', balance: '0.0', usdValue: '0.00', icon: '◉', address: walletAddresses.get('Ethereum') || '0xldo...', color: 'text-orange-500' },
    { id: '30', name: 'Toncoin', symbol: 'TON', network: 'TON', balance: '0', usdValue: '0.00', icon: '💎', address: walletAddresses.get('TON') || 'EQDton...', color: 'text-blue-400' },
  ];

  const topCryptos = cryptoList.filter(c => ['USDT', 'BTC', 'ETH'].includes(c.symbol));
  const totalBalance = cryptoList.reduce((sum, c) => sum + parseFloat(c.usdValue.replace(',', '')), 0);

  const handleReceive = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
    setShowQR(true);
  };

  const handleSend = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
    setShowSend(true);
  };

  const handleLogout = () => {
    const STORAGE_KEY = 'dex_wallet_data';
    localStorage.removeItem(STORAGE_KEY);
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
            onClick={() => topCryptos[0] && handleSend(topCryptos[0])}
            className="h-auto flex flex-col items-center justify-center space-y-2 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border-none backdrop-blur-sm active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Send" size={22} />
            </div>
            <span className="text-sm font-semibold">Отправить</span>
          </Button>

          <Button
            onClick={() => topCryptos[0] && handleReceive(topCryptos[0])}
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
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                <Icon name="Plus" size={18} className="mr-1" />
                Добавить
              </Button>
            </div>

            <div className="space-y-2">
              {cryptoList.map((crypto) => (
                <Card
                  key={crypto.id}
                  className="p-4 bg-card hover:bg-secondary/30 border-border active:scale-[0.98] transition-all rounded-xl cursor-pointer shadow-sm"
                  onClick={() => setSelectedCrypto(crypto)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <span className={`text-2xl font-bold ${crypto.color}`}>{crypto.icon}</span>
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
          crypto={selectedCrypto}
          onClose={() => {
            setShowQR(false);
            setSelectedCrypto(null);
          }}
        />
      )}

      {showSend && selectedCrypto && (
        <SendModal
          crypto={selectedCrypto}
          onClose={() => {
            setShowSend(false);
            setSelectedCrypto(null);
          }}
        />
      )}

      {selectedCrypto && !showQR && !showSend && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" onClick={() => setSelectedCrypto(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 pb-safe animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-6"></div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <span className={`text-3xl font-bold ${selectedCrypto.color}`}>{selectedCrypto.icon}</span>
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

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  handleSend(selectedCrypto);
                }}
                className="h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl"
              >
                <Icon name="Send" size={20} className="mr-2" />
                Отправить
              </Button>

              <Button
                onClick={() => {
                  handleReceive(selectedCrypto);
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