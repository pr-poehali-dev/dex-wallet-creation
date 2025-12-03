import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import QRModal from '@/components/QRModal';
import SendModal from '@/components/SendModal';

interface MainWalletProps {
  username: string;
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

const MainWallet = ({ username }: MainWalletProps) => {
  const [activeTab, setActiveTab] = useState<'home' | 'wallets' | 'history' | 'profile'>('home');
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showSend, setShowSend] = useState(false);

  const cryptoList: Crypto[] = [
    { id: '1', name: 'Tether', symbol: 'USDT', network: 'TRC20', balance: '1,250.00', usdValue: '1,250.00', icon: '₮', address: 'TXYZabcd1234...', color: 'text-green-500' },
    { id: '2', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', balance: '0.0234', usdValue: '2,450.00', icon: '₿', address: 'bc1qxy2k...', color: 'text-orange-500' },
    { id: '3', name: 'Ethereum', symbol: 'ETH', network: 'Ethereum', balance: '1.5432', usdValue: '5,200.00', icon: 'Ξ', address: '0x742d35...', color: 'text-blue-500' },
    { id: '4', name: 'BNB', symbol: 'BNB', network: 'BSC', balance: '4.23', usdValue: '1,850.00', icon: '🔶', address: '0xbnb123...', color: 'text-yellow-500' },
    { id: '5', name: 'Cardano', symbol: 'ADA', network: 'Cardano', balance: '2,450', usdValue: '980.00', icon: '₳', address: 'addr1qxy...', color: 'text-blue-400' },
    { id: '6', name: 'Solana', symbol: 'SOL', network: 'Solana', balance: '12.5', usdValue: '2,750.00', icon: '◎', address: 'Sol9vXc...', color: 'text-purple-500' },
    { id: '7', name: 'Ripple', symbol: 'XRP', network: 'XRP Ledger', balance: '5,234', usdValue: '3,140.00', icon: '✕', address: 'rN7n7o...', color: 'text-gray-400' },
    { id: '8', name: 'Polkadot', symbol: 'DOT', network: 'Polkadot', balance: '123.5', usdValue: '987.00', icon: '●', address: '15oF4u...', color: 'text-pink-500' },
    { id: '9', name: 'Dogecoin', symbol: 'DOGE', network: 'Dogecoin', balance: '15,234', usdValue: '1,520.00', icon: 'Ð', address: 'DH5ya...', color: 'text-yellow-400' },
    { id: '10', name: 'Polygon', symbol: 'MATIC', network: 'Polygon', balance: '2,340', usdValue: '2,105.00', icon: '⬡', address: '0xmatic...', color: 'text-purple-400' },
    { id: '11', name: 'Litecoin', symbol: 'LTC', network: 'Litecoin', balance: '8.45', usdValue: '760.00', icon: 'Ł', address: 'LTC9vXc...', color: 'text-gray-300' },
    { id: '12', name: 'Chainlink', symbol: 'LINK', network: 'Ethereum', balance: '234.5', usdValue: '4,220.00', icon: '⬢', address: '0xlink...', color: 'text-blue-600' },
    { id: '13', name: 'Avalanche', symbol: 'AVAX', network: 'Avalanche', balance: '45.3', usdValue: '1,810.00', icon: '🔺', address: 'X-avax...', color: 'text-red-500' },
    { id: '14', name: 'Cosmos', symbol: 'ATOM', network: 'Cosmos', balance: '156.7', usdValue: '1,880.00', icon: '⚛', address: 'cosmos1...', color: 'text-indigo-500' },
    { id: '15', name: 'Tron', symbol: 'TRX', network: 'Tron', balance: '12,450', usdValue: '1,495.00', icon: '◬', address: 'TRX7ya...', color: 'text-red-600' },
    { id: '16', name: 'Monero', symbol: 'XMR', network: 'Monero', balance: '3.45', usdValue: '570.00', icon: 'ɱ', address: '47qxy2...', color: 'text-orange-600' },
    { id: '17', name: 'Stellar', symbol: 'XLM', network: 'Stellar', balance: '8,234', usdValue: '987.00', icon: '*', address: 'GAXLM...', color: 'text-cyan-500' },
    { id: '18', name: 'VeChain', symbol: 'VET', network: 'VeChain', balance: '45,234', usdValue: '1,130.00', icon: 'V', address: '0xvet...', color: 'text-blue-700' },
    { id: '19', name: 'Algorand', symbol: 'ALGO', network: 'Algorand', balance: '3,456', usdValue: '1,245.00', icon: '▲', address: 'ALGO7X...', color: 'text-gray-800' },
    { id: '20', name: 'Filecoin', symbol: 'FIL', network: 'Filecoin', balance: '23.4', usdValue: '820.00', icon: '⨎', address: 'f1abc...', color: 'text-cyan-600' },
    { id: '21', name: 'Hedera', symbol: 'HBAR', network: 'Hedera', balance: '12,345', usdValue: '740.00', icon: 'ℏ', address: '0.0.123...', color: 'text-purple-600' },
    { id: '22', name: 'Near', symbol: 'NEAR', network: 'Near', balance: '567.8', usdValue: '2,270.00', icon: 'N', address: 'near.xy...', color: 'text-green-600' },
    { id: '23', name: 'Fantom', symbol: 'FTM', network: 'Fantom', balance: '4,567', usdValue: '2,740.00', icon: '👻', address: '0xftm...', color: 'text-blue-800' },
    { id: '24', name: 'Aptos', symbol: 'APT', network: 'Aptos', balance: '89.5', usdValue: '1,610.00', icon: 'A', address: '0xapt...', color: 'text-teal-500' },
    { id: '25', name: 'Optimism', symbol: 'OP', network: 'Optimism', balance: '234.5', usdValue: '705.00', icon: '🔴', address: '0xop...', color: 'text-red-400' },
    { id: '26', name: 'Arbitrum', symbol: 'ARB', network: 'Arbitrum', balance: '1,234', usdValue: '987.00', icon: '🔵', address: '0xarb...', color: 'text-blue-500' },
    { id: '27', name: 'Sui', symbol: 'SUI', network: 'Sui', balance: '789.3', usdValue: '1,895.00', icon: '💧', address: '0xsui...', color: 'text-cyan-400' },
    { id: '28', name: 'Immutable', symbol: 'IMX', network: 'Ethereum', balance: '456.7', usdValue: '685.00', icon: '⬢', address: '0ximx...', color: 'text-indigo-600' },
    { id: '29', name: 'Lido DAO', symbol: 'LDO', network: 'Ethereum', balance: '234.8', usdValue: '565.00', icon: '◉', address: '0xldo...', color: 'text-orange-400' },
    { id: '30', name: 'Toncoin', symbol: 'TON', network: 'TON', balance: '1,234', usdValue: '2,960.00', icon: '💎', address: 'EQDton...', color: 'text-blue-300' },
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
    <div className="min-h-screen bg-background pb-20">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Привет,</p>
            <h1 className="text-2xl font-bold text-foreground">{username}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-lg">{username[0].toUpperCase()}</span>
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="space-y-4">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Общий баланс</p>
                <h2 className="text-4xl font-bold text-foreground">
                  ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h2>
              </div>
            </Card>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Основные активы</h3>
              <div className="space-y-2">
                {topCryptos.map((crypto) => (
                  <Card key={crypto.id} className="p-4 bg-card border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl ${crypto.color}`}>
                          {crypto.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{crypto.symbol}</p>
                          <p className="text-xs text-muted-foreground">{crypto.network}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{crypto.balance}</p>
                        <p className="text-xs text-muted-foreground">${crypto.usdValue}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleSend(crypto)}
                      >
                        <Icon name="Send" size={16} className="mr-1" />
                        Отправить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleReceive(crypto)}
                      >
                        <Icon name="QrCode" size={16} className="mr-1" />
                        Получить
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Все кошельки</h2>
              <p className="text-sm text-muted-foreground">{cryptoList.length} активов</p>
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2 pr-4">
                {cryptoList.map((crypto) => (
                  <Card key={crypto.id} className="p-4 bg-card border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl ${crypto.color}`}>
                          {crypto.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{crypto.name}</p>
                          <p className="text-xs text-muted-foreground">{crypto.network}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{crypto.balance}</p>
                        <p className="text-xs text-muted-foreground">${crypto.usdValue}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleSend(crypto)}
                      >
                        <Icon name="Send" size={16} className="mr-1" />
                        Отправить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleReceive(crypto)}
                      >
                        <Icon name="QrCode" size={16} className="mr-1" />
                        Получить
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">История транзакций</h2>
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Icon name="History" size={48} className="text-muted-foreground" />
              <p className="text-muted-foreground">История пуста</p>
              <p className="text-sm text-muted-foreground">Ваши транзакции появятся здесь</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Профиль</h2>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{username[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{username}</p>
                  <p className="text-sm text-muted-foreground">DEX Wallet User</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name="Shield" size={20} className="text-primary" />
                    <span className="text-sm text-foreground">Безопасность</span>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
                <div className="p-3 rounded-lg bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name="Settings" size={20} className="text-primary" />
                    <span className="text-sm text-foreground">Настройки</span>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
                <div className="p-3 rounded-lg bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name="HelpCircle" size={20} className="text-primary" />
                    <span className="text-sm text-foreground">Помощь</span>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around p-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon name="Home" size={24} />
            <span className="text-xs">Главная</span>
          </button>
          <button
            onClick={() => setActiveTab('wallets')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'wallets' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon name="Wallet" size={24} />
            <span className="text-xs">Кошельки</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'history' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon name="History" size={24} />
            <span className="text-xs">История</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon name="User" size={24} />
            <span className="text-xs">Профиль</span>
          </button>
        </div>
      </div>

      {selectedCrypto && (
        <>
          <QRModal
            open={showQR}
            onClose={() => setShowQR(false)}
            crypto={selectedCrypto}
          />
          <SendModal
            open={showSend}
            onClose={() => setShowSend(false)}
            crypto={selectedCrypto}
          />
        </>
      )}
    </div>
  );
};

export default MainWallet;
