import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-safe space-y-4">
        <div className="flex items-center justify-between pt-4 pb-2">
          <div>
            <p className="text-xs text-muted-foreground">Привет,</p>
            <h1 className="text-xl font-bold text-foreground">{username}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">{username[0].toUpperCase()}</span>
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 border-primary/30 shadow-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Общий баланс</p>
                  <Icon name="Eye" size={16} className="text-muted-foreground" />
                </div>
                <h2 className="text-4xl font-bold text-foreground tracking-tight">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h2>
                <div className="flex items-center space-x-2 pt-1">
                  <div className="flex items-center space-x-1 text-green-500">
                    <Icon name="TrendingUp" size={14} />
                    <span className="text-xs font-medium">+12.5%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">за 24ч</span>
                </div>
              </div>
            </Card>

            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
              {topCryptos.map((crypto) => (
                <Card key={crypto.id} className="flex-shrink-0 w-40 snap-center p-4 bg-card/80 border-border active:scale-95 transition-transform">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-full bg-muted/50 flex items-center justify-center text-lg font-bold ${crypto.color}`}>
                        {crypto.icon}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                      <p className="text-base font-bold text-foreground truncate">{crypto.balance}</p>
                      <p className="text-xs text-muted-foreground">${crypto.usdValue}</p>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Button
                        onClick={() => handleReceive(crypto)}
                        size="sm"
                        variant="outline"
                        className="w-full h-7 text-xs"
                      >
                        <Icon name="Download" size={12} className="mr-1" />
                        Получить
                      </Button>
                      <Button
                        onClick={() => handleSend(crypto)}
                        size="sm"
                        className="w-full h-7 text-xs bg-primary/90 hover:bg-primary"
                      >
                        <Icon name="Send" size={12} className="mr-1" />
                        Отправить
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-foreground">Все активы</h3>
                <Button variant="ghost" size="sm" className="text-primary h-8">
                  <Icon name="Search" size={14} className="mr-1" />
                  Поиск
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-420px)]">
                <div className="space-y-1.5">
                  {cryptoList.map((crypto) => (
                    <Card key={crypto.id} className="p-3 bg-card/50 border-border active:bg-card active:scale-[0.98] transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold ${crypto.color}`}>
                            {crypto.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{crypto.name}</p>
                            <p className="text-xs text-muted-foreground">{crypto.network}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{crypto.balance}</p>
                          <p className="text-xs text-muted-foreground">${crypto.usdValue}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-2">
              {cryptoList.map((crypto) => (
                <Card key={crypto.id} className="p-4 bg-card border-border">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold ${crypto.color}`}>
                          {crypto.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{crypto.name}</p>
                          <p className="text-xs text-muted-foreground">{crypto.network}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{crypto.balance}</p>
                        <p className="text-xs text-muted-foreground">${crypto.usdValue}</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Адрес:</p>
                      <p className="text-xs font-mono text-foreground break-all">{crypto.address}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleReceive(crypto)}
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9"
                      >
                        <Icon name="Download" size={14} className="mr-1" />
                        Получить
                      </Button>
                      <Button
                        onClick={() => handleSend(crypto)}
                        size="sm"
                        className="flex-1 h-9 bg-primary hover:bg-primary/90"
                      >
                        <Icon name="Send" size={14} className="mr-1" />
                        Отправить
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        {activeTab === 'history' && (
          <div className="flex items-center justify-center h-[calc(100vh-240px)]">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                <Icon name="History" size={32} className="text-muted-foreground" />
              </div>
              <p className="text-base font-medium text-foreground">Нет транзакций</p>
              <p className="text-sm text-muted-foreground">История появится здесь</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">{username[0].toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{username}</h2>
                  <p className="text-xs text-muted-foreground">DEX Wallet User</p>
                </div>
              </div>
            </Card>

            <div className="space-y-1.5">
              {[
                { icon: 'Settings', label: 'Настройки', desc: 'Управление кошельком' },
                { icon: 'Shield', label: 'Безопасность', desc: 'Seed-фраза и пароль' },
                { icon: 'Bell', label: 'Уведомления', desc: 'Настройка оповещений' },
                { icon: 'Globe', label: 'Сеть', desc: 'Выбор сети' },
                { icon: 'HelpCircle', label: 'Помощь', desc: 'Поддержка и FAQ' },
              ].map((item, index) => (
                <Card key={index} className="p-3 bg-card border-border active:bg-card/80 active:scale-[0.98] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name={item.icon as any} size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-xl border-t border-border shadow-2xl z-50 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {[
            { id: 'home', icon: 'Home', label: 'Главная' },
            { id: 'wallets', icon: 'Wallet', label: 'Кошельки' },
            { id: 'history', icon: 'History', label: 'История' },
            { id: 'profile', icon: 'User', label: 'Профиль' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center space-y-0.5 px-3 py-2 rounded-xl transition-all active:scale-95 ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground active:text-foreground active:bg-muted/50'
              }`}
            >
              <Icon name={tab.icon as any} size={22} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {selectedCrypto && (
        <>
          <QRModal
            open={showQR}
            onClose={() => {
              setShowQR(false);
              setSelectedCrypto(null);
            }}
            crypto={selectedCrypto}
          />
          <SendModal
            open={showSend}
            onClose={() => {
              setShowSend(false);
              setSelectedCrypto(null);
            }}
            crypto={selectedCrypto}
          />
        </>
      )}
    </div>
  );
};

export default MainWallet;
