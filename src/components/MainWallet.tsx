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
  const [activeTab, setActiveTab] = useState<'home' | 'wallets' | 'history' | 'profile'>('home');
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showSend, setShowSend] = useState(false);

  const cryptoList: Crypto[] = [
    { id: '1', name: 'Tether', symbol: 'USDT', network: 'TRC20', balance: '1,250.00', usdValue: '1,250.00', icon: '₮', address: walletAddresses.get('TRC20') || 'TXYZabcd1234...', color: 'text-green-500' },
    { id: '2', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', balance: '0.0234', usdValue: '2,450.00', icon: '₿', address: walletAddresses.get('Bitcoin') || 'bc1qxy2k...', color: 'text-orange-500' },
    { id: '3', name: 'Ethereum', symbol: 'ETH', network: 'Ethereum', balance: '1.5432', usdValue: '5,200.00', icon: 'Ξ', address: walletAddresses.get('Ethereum') || '0x742d35...', color: 'text-blue-500' },
    { id: '4', name: 'BNB', symbol: 'BNB', network: 'BSC', balance: '4.23', usdValue: '1,850.00', icon: '🔶', address: walletAddresses.get('BSC') || '0xbnb123...', color: 'text-yellow-500' },
    { id: '5', name: 'Cardano', symbol: 'ADA', network: 'Cardano', balance: '2,450', usdValue: '980.00', icon: '₳', address: walletAddresses.get('Cardano') || 'addr1qxy...', color: 'text-blue-400' },
    { id: '6', name: 'Solana', symbol: 'SOL', network: 'Solana', balance: '12.5', usdValue: '2,750.00', icon: '◎', address: walletAddresses.get('Solana') || 'Sol9vXc...', color: 'text-purple-500' },
    { id: '7', name: 'Ripple', symbol: 'XRP', network: 'XRP Ledger', balance: '5,234', usdValue: '3,140.00', icon: '✕', address: walletAddresses.get('XRP Ledger') || 'rN7n7o...', color: 'text-gray-400' },
    { id: '8', name: 'Polkadot', symbol: 'DOT', network: 'Polkadot', balance: '123.5', usdValue: '987.00', icon: '●', address: walletAddresses.get('Polkadot') || '15oF4u...', color: 'text-pink-500' },
    { id: '9', name: 'Dogecoin', symbol: 'DOGE', network: 'Dogecoin', balance: '15,234', usdValue: '1,520.00', icon: 'Ð', address: walletAddresses.get('Dogecoin') || 'DH5ya...', color: 'text-yellow-400' },
    { id: '10', name: 'Polygon', symbol: 'MATIC', network: 'Polygon', balance: '2,340', usdValue: '2,105.00', icon: '⬡', address: walletAddresses.get('Polygon') || '0xmatic...', color: 'text-purple-400' },
    { id: '11', name: 'Litecoin', symbol: 'LTC', network: 'Litecoin', balance: '8.45', usdValue: '760.00', icon: 'Ł', address: walletAddresses.get('Litecoin') || 'LTC9vXc...', color: 'text-gray-300' },
    { id: '12', name: 'Chainlink', symbol: 'LINK', network: 'Ethereum', balance: '234.5', usdValue: '4,220.00', icon: '⬢', address: walletAddresses.get('Ethereum') || '0xlink...', color: 'text-blue-600' },
    { id: '13', name: 'Avalanche', symbol: 'AVAX', network: 'Avalanche', balance: '45.3', usdValue: '1,810.00', icon: '🔺', address: walletAddresses.get('Avalanche') || 'X-avax...', color: 'text-red-500' },
    { id: '14', name: 'Cosmos', symbol: 'ATOM', network: 'Cosmos', balance: '156.7', usdValue: '1,880.00', icon: '⚛', address: walletAddresses.get('Cosmos') || 'cosmos1...', color: 'text-indigo-500' },
    { id: '15', name: 'Tron', symbol: 'TRX', network: 'Tron', balance: '12,450', usdValue: '1,495.00', icon: '◬', address: walletAddresses.get('Tron') || 'TRX7ya...', color: 'text-red-600' },
    { id: '16', name: 'Monero', symbol: 'XMR', network: 'Monero', balance: '3.45', usdValue: '570.00', icon: 'ɱ', address: walletAddresses.get('Monero') || '47qxy2...', color: 'text-orange-600' },
    { id: '17', name: 'Stellar', symbol: 'XLM', network: 'Stellar', balance: '8,234', usdValue: '987.00', icon: '*', address: walletAddresses.get('Stellar') || 'GAXLM...', color: 'text-cyan-500' },
    { id: '18', name: 'VeChain', symbol: 'VET', network: 'VeChain', balance: '45,234', usdValue: '1,130.00', icon: 'V', address: walletAddresses.get('VeChain') || '0xvet...', color: 'text-blue-700' },
    { id: '19', name: 'Algorand', symbol: 'ALGO', network: 'Algorand', balance: '3,456', usdValue: '1,245.00', icon: '▲', address: walletAddresses.get('Algorand') || 'ALGO7X...', color: 'text-gray-800' },
    { id: '20', name: 'Filecoin', symbol: 'FIL', network: 'Filecoin', balance: '23.4', usdValue: '820.00', icon: '⨎', address: walletAddresses.get('Filecoin') || 'f1abc...', color: 'text-cyan-600' },
    { id: '21', name: 'Hedera', symbol: 'HBAR', network: 'Hedera', balance: '12,345', usdValue: '740.00', icon: 'ℏ', address: walletAddresses.get('Hedera') || '0.0.123...', color: 'text-purple-600' },
    { id: '22', name: 'Near', symbol: 'NEAR', network: 'Near', balance: '567.8', usdValue: '2,270.00', icon: 'N', address: walletAddresses.get('Near') || 'near.xy...', color: 'text-green-600' },
    { id: '23', name: 'Fantom', symbol: 'FTM', network: 'Fantom', balance: '4,567', usdValue: '2,740.00', icon: '👻', address: walletAddresses.get('Fantom') || '0xftm...', color: 'text-blue-800' },
    { id: '24', name: 'Aptos', symbol: 'APT', network: 'Aptos', balance: '89.5', usdValue: '1,610.00', icon: 'A', address: walletAddresses.get('Aptos') || '0xapt...', color: 'text-teal-500' },
    { id: '25', name: 'Optimism', symbol: 'OP', network: 'Optimism', balance: '234.5', usdValue: '705.00', icon: '🔴', address: walletAddresses.get('Optimism') || '0xop...', color: 'text-red-400' },
    { id: '26', name: 'Arbitrum', symbol: 'ARB', network: 'Arbitrum', balance: '1,234', usdValue: '987.00', icon: '🔵', address: walletAddresses.get('Arbitrum') || '0xarb...', color: 'text-blue-500' },
    { id: '27', name: 'Sui', symbol: 'SUI', network: 'Sui', balance: '789.3', usdValue: '1,895.00', icon: '💧', address: walletAddresses.get('Sui') || '0xsui...', color: 'text-cyan-400' },
    { id: '28', name: 'Immutable', symbol: 'IMX', network: 'Ethereum', balance: '456.7', usdValue: '685.00', icon: '⬢', address: walletAddresses.get('Ethereum') || '0ximx...', color: 'text-indigo-600' },
    { id: '29', name: 'Lido DAO', symbol: 'LDO', network: 'Ethereum', balance: '234.8', usdValue: '565.00', icon: '◉', address: walletAddresses.get('Ethereum') || '0xldo...', color: 'text-orange-400' },
    { id: '30', name: 'Toncoin', symbol: 'TON', network: 'TON', balance: '1,234', usdValue: '2,960.00', icon: '💎', address: walletAddresses.get('TON') || 'EQDton...', color: 'text-blue-300' },
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
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-safe space-y-6">
        <div className="flex items-center justify-between pt-6 pb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-primary shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">{username[0].toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{username}</h1>
              <p className="text-xs text-muted-foreground">Мой кошелек</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-muted/50 rounded-xl"
          >
            <Icon name="LogOut" size={20} className="text-muted-foreground" />
          </Button>
        </div>

        {activeTab === 'home' && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border-primary/20 shadow-2xl rounded-3xl backdrop-blur-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Баланс портфеля</p>
                  <Icon name="Eye" size={18} className="text-muted-foreground" />
                </div>
                <h2 className="text-5xl font-extrabold text-foreground tracking-tight">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h2>
                <div className="flex items-center space-x-2 pt-1">
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-green-500/10">
                    <Icon name="TrendingUp" size={14} className="text-green-500" />
                    <span className="text-sm font-semibold text-green-500">+12.5%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">сегодня</span>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => topCryptos[0] && handleReceive(topCryptos[0])}
                className="h-16 flex flex-col items-center justify-center space-y-1 bg-muted/30 hover:bg-muted/50 text-foreground rounded-2xl border border-border/50 active:scale-95 transition-all"
              >
                <Icon name="ArrowDown" size={20} className="text-primary" />
                <span className="text-xs font-semibold">Получить</span>
              </Button>
              <Button
                onClick={() => topCryptos[0] && handleSend(topCryptos[0])}
                className="h-16 flex flex-col items-center justify-center space-y-1 bg-muted/30 hover:bg-muted/50 text-foreground rounded-2xl border border-border/50 active:scale-95 transition-all"
              >
                <Icon name="ArrowUp" size={20} className="text-primary" />
                <span className="text-xs font-semibold">Отправить</span>
              </Button>
              <Button
                className="h-16 flex flex-col items-center justify-center space-y-1 bg-muted/30 hover:bg-muted/50 text-foreground rounded-2xl border border-border/50 active:scale-95 transition-all"
              >
                <Icon name="RefreshCw" size={20} className="text-primary" />
                <span className="text-xs font-semibold">Обменять</span>
              </Button>
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground mb-4 px-1">Токены</h3>
              <div className="space-y-2">
                {cryptoList.map((crypto) => (
                  <Card
                    key={crypto.id}
                    className="p-4 bg-card/50 hover:bg-card/80 border-border/50 backdrop-blur-sm active:scale-[0.98] transition-all rounded-2xl cursor-pointer"
                    onClick={() => setSelectedCrypto(crypto)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className={`text-xl font-bold ${crypto.color}`}>{crypto.icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{crypto.symbol}</p>
                          <p className="text-xs text-muted-foreground">{crypto.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">${crypto.usdValue}</p>
                        <p className="text-xs text-muted-foreground">{crypto.balance} {crypto.symbol}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-foreground px-1">Кошельки</h2>
            <div className="space-y-2">
              {cryptoList.map((crypto) => (
                <Card key={crypto.id} className="p-4 bg-card/50 border-border/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className={`text-lg ${crypto.color}`}>{crypto.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{crypto.name}</p>
                        <p className="text-xs text-muted-foreground">{crypto.network}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Адрес</p>
                    <p className="text-xs font-mono text-foreground break-all">{crypto.address}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-foreground px-1">История</h2>
            <Card className="p-6 bg-card/50 border-border/50 rounded-2xl">
              <div className="text-center py-8">
                <Icon name="History" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">История транзакций пуста</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-bold text-foreground px-1">Профиль</h2>
            <Card className="p-5 bg-card/50 border-border/50 rounded-2xl space-y-3">
              <div className="flex items-center space-x-4 pb-4 border-b border-border">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary shadow-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{username[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{username}</p>
                  <p className="text-xs text-muted-foreground">DEX Wallet</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                className="w-full justify-start h-12 rounded-xl hover:bg-muted/50"
              >
                <Icon name="Settings" size={20} className="mr-3 text-muted-foreground" />
                <span className="text-sm">Настройки</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12 rounded-xl hover:bg-muted/50"
              >
                <Icon name="Lock" size={20} className="mr-3 text-muted-foreground" />
                <span className="text-sm">Безопасность</span>
              </Button>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start h-12 rounded-xl hover:bg-destructive/10 text-destructive"
              >
                <Icon name="LogOut" size={20} className="mr-3" />
                <span className="text-sm">Выйти из кошелька</span>
              </Button>
            </Card>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-2xl border-t border-border/50 shadow-2xl z-50 pb-safe">
        <div className="flex items-center justify-around h-20 px-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl transition-all ${
              activeTab === 'home' ? 'bg-primary/10' : ''
            }`}
          >
            <Icon name="Home" size={22} className={activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'} />
            <span className={`text-xs font-medium ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}>
              Главная
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wallets')}
            className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl transition-all ${
              activeTab === 'wallets' ? 'bg-primary/10' : ''
            }`}
          >
            <Icon name="Wallet" size={22} className={activeTab === 'wallets' ? 'text-primary' : 'text-muted-foreground'} />
            <span className={`text-xs font-medium ${activeTab === 'wallets' ? 'text-primary' : 'text-muted-foreground'}`}>
              Кошельки
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl transition-all ${
              activeTab === 'history' ? 'bg-primary/10' : ''
            }`}
          >
            <Icon name="Clock" size={22} className={activeTab === 'history' ? 'text-primary' : 'text-muted-foreground'} />
            <span className={`text-xs font-medium ${activeTab === 'history' ? 'text-primary' : 'text-muted-foreground'}`}>
              История
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl transition-all ${
              activeTab === 'profile' ? 'bg-primary/10' : ''
            }`}
          >
            <Icon name="User" size={22} className={activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'} />
            <span className={`text-xs font-medium ${activeTab === 'profile' ? 'text-primary' : 'text-foreground'}`}>
              Профиль
            </span>
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
    </div>
  );
};

export default MainWallet;
