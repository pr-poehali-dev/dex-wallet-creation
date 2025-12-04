import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { getUser, updateBalance as updateBalanceApi } from '@/utils/walletApi';

interface AdminPanelProps {
  onClose: () => void;
}

const CRYPTO_LIST = [
  { id: '1', symbol: 'USDT', name: 'Tether (TRC20)', network: 'TRC20' },
  { id: '2', symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin' },
  { id: '3', symbol: 'ETH', name: 'Ethereum', network: 'Ethereum' },
  { id: '4', symbol: 'BNB', name: 'BNB', network: 'BSC' },
  { id: '5', symbol: 'ADA', name: 'Cardano', network: 'Cardano' },
  { id: '6', symbol: 'SOL', name: 'Solana', network: 'Solana' },
  { id: '7', symbol: 'XRP', name: 'Ripple', network: 'XRP Ledger' },
  { id: '8', symbol: 'DOT', name: 'Polkadot', network: 'Polkadot' },
  { id: '9', symbol: 'DOGE', name: 'Dogecoin', network: 'Dogecoin' },
  { id: '10', symbol: 'MATIC', name: 'Polygon', network: 'Polygon' },
  { id: '11', symbol: 'LTC', name: 'Litecoin', network: 'Litecoin' },
  { id: '12', symbol: 'LINK', name: 'Chainlink', network: 'Ethereum' },
  { id: '13', symbol: 'AVAX', name: 'Avalanche', network: 'Avalanche' },
  { id: '14', symbol: 'ATOM', name: 'Cosmos', network: 'Cosmos' },
  { id: '15', symbol: 'TRX', name: 'Tron', network: 'Tron' },
  { id: '16', symbol: 'XMR', name: 'Monero', network: 'Monero' },
  { id: '17', symbol: 'XLM', name: 'Stellar', network: 'Stellar' },
  { id: '18', symbol: 'VET', name: 'VeChain', network: 'VeChain' },
  { id: '19', symbol: 'ALGO', name: 'Algorand', network: 'Algorand' },
  { id: '20', symbol: 'FIL', name: 'Filecoin', network: 'Filecoin' },
];

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [targetUsername, setTargetUsername] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('1');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!targetUsername.trim()) {
      toast.error('Введите никнейм пользователя');
      return;
    }

    setLoading(true);
    try {
      const userData = await getUser(targetUsername.trim());
      if (userData) {
        setSearchResults(userData);
        toast.success('Пользователь найден');
      } else {
        setSearchResults(null);
        toast.error('Пользователь не найден');
      }
    } catch (error) {
      console.error('Ошибка поиска пользователя:', error);
      toast.error('Ошибка поиска пользователя');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBalance = async () => {
    if (!searchResults) {
      toast.error('Сначала найдите пользователя');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }

    setLoading(true);
    try {
      const crypto = CRYPTO_LIST.find(c => c.id === selectedCrypto);
      if (!crypto) {
        toast.error('Криптовалюта не найдена');
        return;
      }

      const currentBalance = parseFloat(searchResults.balances[selectedCrypto] || '0');
      const newBalance = (currentBalance + parseFloat(amount)).toFixed(8);

      await updateBalanceApi(searchResults.user_id, selectedCrypto, newBalance);

      window.dispatchEvent(new CustomEvent('balanceUpdated', {
        detail: {
          userId: searchResults.user_id,
          cryptoId: selectedCrypto,
          newBalance,
          amount: parseFloat(amount),
          symbol: crypto.symbol
        }
      }));

      toast.success(`Пополнено ${amount} ${crypto.symbol} для ${targetUsername}`);
      
      setAmount('');
      handleSearch();
    } catch (error) {
      console.error('Ошибка пополнения баланса:', error);
      toast.error('Ошибка пополнения баланса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose}>
      <div 
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-safe animate-slide-up max-h-[90vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card z-10 pt-3 pb-4 px-4 sm:px-6 border-b border-border shrink-0">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <Icon name="ShieldCheck" size={20} className="text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Админ Панель</h2>
                <p className="text-xs text-muted-foreground">Управление балансами пользователей</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto smooth-scroll px-4 sm:px-6 py-6 space-y-5">
          <Card className="p-4 bg-destructive/10 border-destructive/30">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-destructive mt-1 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Административный доступ</p>
                <p className="text-xs text-muted-foreground">
                  Вы имеете полный доступ к управлению балансами всех пользователей
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Никнейм пользователя
              </label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={targetUsername}
                  onChange={(e) => setTargetUsername(e.target.value)}
                  placeholder="Введите никнейм"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading || !targetUsername.trim()}
                  className="shrink-0"
                >
                  <Icon name="Search" size={18} />
                </Button>
              </div>
            </div>

            {searchResults && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground">{searchResults.username}</p>
                      <p className="text-xs text-muted-foreground">ID: {searchResults.user_id}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Текущие балансы:</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto smooth-scroll">
                      {Object.entries(searchResults.balances).map(([cryptoId, balance]) => {
                        const crypto = CRYPTO_LIST.find(c => c.id === cryptoId);
                        if (!crypto || parseFloat(balance as string) === 0) return null;
                        return (
                          <div key={cryptoId} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{crypto.symbol}:</span>
                            <span className="font-mono text-foreground">{parseFloat(balance as string).toFixed(8)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {searchResults && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Выберите криптовалюту
                  </label>
                  <select
                    value={selectedCrypto}
                    onChange={(e) => setSelectedCrypto(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm"
                  >
                    {CRYPTO_LIST.map((crypto) => (
                      <option key={crypto.id} value={crypto.id}>
                        {crypto.symbol} - {crypto.name} ({crypto.network})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Сумма пополнения
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.00000001"
                    className="text-lg"
                  />
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount('10')}
                      className="flex-1"
                    >
                      10
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount('100')}
                      className="flex-1"
                    >
                      100
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount('1000')}
                      className="flex-1"
                    >
                      1000
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {searchResults && (
          <div className="sticky bottom-0 bg-card px-4 sm:px-6 py-4 border-t border-border shrink-0">
            <Button
              onClick={handleAddBalance}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <>
                  <Icon name="Plus" size={20} className="mr-2" />
                  Пополнить баланс
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;