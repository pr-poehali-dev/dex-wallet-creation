import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { addTransaction, generateTransactionHash, generateTransactionId, simulateTransactionConfirmation } from '@/utils/transactionManager';
import { updateBalance, getBalances } from '@/utils/balanceManager';
import { fetchCryptoPrices } from '@/utils/cryptoPrices';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  network: string;
  balance: string;
  icon: string;
  iconUrl?: string;
  color: string;
}

interface SwapModalProps {
  open: boolean;
  onClose: () => void;
  allCryptos: Crypto[];
  onTransactionComplete?: () => void;
}

const SwapModal = ({ open, onClose, allCryptos, onTransactionComplete }: SwapModalProps) => {
  const [fromCrypto, setFromCrypto] = useState<Crypto | null>(null);
  const [toCrypto, setToCrypto] = useState<Crypto | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromSelect, setShowFromSelect] = useState(false);
  const [showToSelect, setShowToSelect] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [prices, setPrices] = useState<{[key: string]: number}>({});
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');

  useEffect(() => {
    const loadPrices = async () => {
      const cryptoPrices = await fetchCryptoPrices();
      setPrices(cryptoPrices);
    };
    if (open) {
      loadPrices();
    }
  }, [open]);

  useEffect(() => {
    if (allCryptos.length > 0 && !fromCrypto) {
      setFromCrypto(allCryptos[0]);
    }
    if (allCryptos.length > 1 && !toCrypto) {
      setToCrypto(allCryptos[1]);
    }
  }, [allCryptos, fromCrypto, toCrypto]);

  const exchangeRate = useMemo(() => {
    if (!fromCrypto || !toCrypto || !prices[fromCrypto.symbol] || !prices[toCrypto.symbol]) {
      return 0;
    }
    return prices[fromCrypto.symbol] / prices[toCrypto.symbol];
  }, [fromCrypto, toCrypto, prices]);

  const fee = 0.003; // 0.3% комиссия

  useEffect(() => {
    if (fromAmount && exchangeRate > 0) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        const calculatedAmount = amount * exchangeRate * (1 - fee);
        setToAmount(calculatedAmount.toFixed(8).replace(/\.?0+$/, ''));
      }
    } else {
      setToAmount('');
    }
  }, [fromAmount, exchangeRate]);

  const filteredFromCryptos = useMemo(() => {
    return allCryptos.filter(c => 
      c.symbol.toLowerCase().includes(searchFrom.toLowerCase()) ||
      c.name.toLowerCase().includes(searchFrom.toLowerCase())
    );
  }, [allCryptos, searchFrom]);

  const filteredToCryptos = useMemo(() => {
    return allCryptos.filter(c => 
      c.symbol.toLowerCase().includes(searchTo.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTo.toLowerCase())
    );
  }, [allCryptos, searchTo]);

  if (!open) return null;

  const handleSwap = () => {
    console.log('=== SWAP STARTED ===');
    console.log('From:', fromCrypto?.symbol, fromCrypto?.name, 'Balance:', fromCrypto?.balance);
    console.log('To:', toCrypto?.symbol, toCrypto?.name, 'Balance:', toCrypto?.balance);
    console.log('Amount:', fromAmount);
    
    if (!fromCrypto || !toCrypto || !fromAmount) {
      console.log('❌ Validation failed: missing fields');
      toast.error('Заполните все поля');
      return;
    }

    const swapAmount = parseFloat(fromAmount);
    const currentBalance = parseFloat(fromCrypto.balance.replace(',', ''));
    console.log('Swap amount:', swapAmount, 'Current balance:', currentBalance);

    if (swapAmount > currentBalance) {
      console.log('❌ Insufficient funds');
      toast.error('Недостаточно средств');
      return;
    }

    if (swapAmount <= 0) {
      console.log('❌ Invalid amount');
      toast.error('Некорректная сумма');
      return;
    }

    console.log('✅ Validation passed, starting swap...');
    setIsSwapping(true);

    // Создаём транзакцию отправки
    const sendTxId = generateTransactionId();
    const sendTransaction = {
      id: sendTxId,
      type: 'send' as const,
      cryptoId: fromCrypto.id,
      symbol: fromCrypto.symbol,
      amount: swapAmount.toFixed(8).replace(/\.?0+$/, ''),
      address: 'Обмен на ' + toCrypto.symbol,
      fee: (swapAmount * fee).toFixed(8).replace(/\.?0+$/, ''),
      status: 'pending' as const,
      timestamp: Date.now(),
      hash: generateTransactionHash(),
      network: fromCrypto.network
    };

    // Создаём транзакцию получения
    const receiveTxId = generateTransactionId();
    const receiveAmount = parseFloat(toAmount);
    const receiveTransaction = {
      id: receiveTxId,
      type: 'receive' as const,
      cryptoId: toCrypto.id,
      symbol: toCrypto.symbol,
      amount: receiveAmount.toFixed(8).replace(/\.?0+$/, ''),
      address: 'Обмен с ' + fromCrypto.symbol,
      fee: '0',
      status: 'pending' as const,
      timestamp: Date.now() + 1000,
      hash: generateTransactionHash(),
      network: toCrypto.network
    };

    addTransaction(sendTransaction);
    addTransaction(receiveTransaction);

    // Обновляем балансы
    const newFromBalance = (currentBalance - swapAmount).toFixed(8).replace(/\.?0+$/, '');
    console.log(`Обмен: ${fromCrypto.symbol} баланс ${currentBalance} -> ${newFromBalance}`);
    updateBalance(fromCrypto.id, newFromBalance);

    const currentToBalance = parseFloat(toCrypto.balance.replace(',', ''));
    const newToBalance = (currentToBalance + receiveAmount).toFixed(8).replace(/\.?0+$/, '');
    console.log(`Обмен: ${toCrypto.symbol} баланс ${currentToBalance} -> ${newToBalance}`);
    updateBalance(toCrypto.id, newToBalance);

    // Сразу вызываем обновление данных
    if (onTransactionComplete) {
      onTransactionComplete();
    }

    toast.success(`Обменяно ${swapAmount} ${fromCrypto.symbol} на ${receiveAmount.toFixed(6)} ${toCrypto.symbol}`);

    // Подтверждаем транзакции
    simulateTransactionConfirmation(sendTxId, () => {
      if (onTransactionComplete) onTransactionComplete();
    });
    
    simulateTransactionConfirmation(receiveTxId, () => {
      if (onTransactionComplete) onTransactionComplete();
    });

    setIsSwapping(false);
    
    // Закрываем модалку с небольшой задержкой, чтобы пользователь увидел результат
    setTimeout(() => {
      onClose();
      setFromAmount('');
      setToAmount('');
    }, 500);
  };

  const handleSwitchCryptos = () => {
    const temp = fromCrypto;
    setFromCrypto(toCrypto);
    setToCrypto(temp);
    setFromAmount('');
    setToAmount('');
  };

  const handleMaxAmount = () => {
    if (fromCrypto) {
      setFromAmount(fromCrypto.balance);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-safe animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card z-10 pt-3 pb-4 px-6 border-b border-border">
          <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Icon name="ArrowLeftRight" size={22} className="text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">Обмен криптовалюты</p>
                <p className="text-sm text-muted-foreground">Лучший курс</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted rounded-xl"
            >
              <Icon name="X" size={22} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* FROM */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-semibold text-muted-foreground">Отдаёте</label>
              {fromCrypto && (
                <button
                  onClick={handleMaxAmount}
                  className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Макс: {fromCrypto.balance}
                </button>
              )}
            </div>
            
            <div className="p-4 rounded-2xl bg-secondary/50 border-2 border-border hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setShowFromSelect(true)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-card hover:bg-secondary border border-border transition-all"
                >
                  {fromCrypto ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {fromCrypto.iconUrl ? (
                          <img src={fromCrypto.iconUrl} alt={fromCrypto.symbol} className="w-full h-full object-cover" />
                        ) : (
                          <span className={`text-lg font-bold ${fromCrypto.color}`}>{fromCrypto.icon}</span>
                        )}
                      </div>
                      <span className="text-base font-bold text-foreground">{fromCrypto.symbol}</span>
                      <Icon name="ChevronDown" size={18} className="text-muted-foreground" />
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Выберите</span>
                  )}
                </button>
              </div>
              
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="text-2xl font-bold h-auto p-0 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              
              {fromCrypto && prices[fromCrypto.symbol] && fromAmount && (
                <p className="text-sm text-muted-foreground mt-2">
                  ≈ ${(parseFloat(fromAmount) * prices[fromCrypto.symbol]).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* SWITCH BUTTON */}
          <div className="flex justify-center -my-2">
            <button
              onClick={handleSwitchCryptos}
              className="w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center"
            >
              <Icon name="ArrowUpDown" size={20} />
            </button>
          </div>

          {/* TO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-semibold text-muted-foreground">Получаете</label>
            </div>
            
            <div className="p-4 rounded-2xl bg-secondary/50 border-2 border-border hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setShowToSelect(true)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-card hover:bg-secondary border border-border transition-all"
                >
                  {toCrypto ? (
                    <>
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {toCrypto.iconUrl ? (
                          <img src={toCrypto.iconUrl} alt={toCrypto.symbol} className="w-full h-full object-cover" />
                        ) : (
                          <span className={`text-lg font-bold ${toCrypto.color}`}>{toCrypto.icon}</span>
                        )}
                      </div>
                      <span className="text-base font-bold text-foreground">{toCrypto.symbol}</span>
                      <Icon name="ChevronDown" size={18} className="text-muted-foreground" />
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Выберите</span>
                  )}
                </button>
              </div>
              
              <div className="text-2xl font-bold text-foreground">
                {toAmount || '0.00'}
              </div>
              
              {toCrypto && prices[toCrypto.symbol] && toAmount && (
                <p className="text-sm text-muted-foreground mt-2">
                  ≈ ${(parseFloat(toAmount) * prices[toCrypto.symbol]).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* INFO */}
          {fromCrypto && toCrypto && exchangeRate > 0 && (
            <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Курс обмена</span>
                <span className="text-sm font-semibold text-foreground">
                  1 {fromCrypto.symbol} = {exchangeRate.toFixed(6)} {toCrypto.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Комиссия сервиса</span>
                <span className="text-sm font-semibold text-foreground">{(fee * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleSwap}
            disabled={!fromCrypto || !toCrypto || !fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSwapping ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                Обмен...
              </>
            ) : (
              <>
                <Icon name="ArrowLeftRight" size={18} className="mr-2" />
                Обменять
              </>
            )}
          </Button>
        </div>
      </div>

      {/* FROM SELECT MODAL */}
      {showFromSelect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in" onClick={() => setShowFromSelect(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-safe animate-slide-up max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card z-10 pt-3 pb-4 px-6 border-b border-border">
              <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4"></div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold text-foreground">Выберите криптовалюту</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFromSelect(false)}
                  className="hover:bg-muted rounded-xl"
                >
                  <Icon name="X" size={22} />
                </Button>
              </div>
              <Input
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                placeholder="Поиск..."
                className="h-11 bg-secondary/50 border-border rounded-xl"
              />
            </div>
            
            <div className="overflow-y-auto flex-1 px-6 py-4">
              <div className="space-y-2">
                {filteredFromCryptos.map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => {
                      setFromCrypto(crypto);
                      setShowFromSelect(false);
                      setSearchFrom('');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {crypto.iconUrl ? (
                          <img src={crypto.iconUrl} alt={crypto.symbol} className="w-full h-full object-cover" />
                        ) : (
                          <span className={`text-xl font-bold ${crypto.color}`}>{crypto.icon}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-base font-bold text-foreground">{crypto.symbol}</p>
                        <p className="text-xs text-muted-foreground">{crypto.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{crypto.balance}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TO SELECT MODAL */}
      {showToSelect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in" onClick={() => setShowToSelect(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-safe animate-slide-up max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-card z-10 pt-3 pb-4 px-6 border-b border-border">
              <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4"></div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold text-foreground">Выберите криптовалюту</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowToSelect(false)}
                  className="hover:bg-muted rounded-xl"
                >
                  <Icon name="X" size={22} />
                </Button>
              </div>
              <Input
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                placeholder="Поиск..."
                className="h-11 bg-secondary/50 border-border rounded-xl"
              />
            </div>
            
            <div className="overflow-y-auto flex-1 px-6 py-4">
              <div className="space-y-2">
                {filteredToCryptos.map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => {
                      setToCrypto(crypto);
                      setShowToSelect(false);
                      setSearchTo('');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {crypto.iconUrl ? (
                          <img src={crypto.iconUrl} alt={crypto.symbol} className="w-full h-full object-cover" />
                        ) : (
                          <span className={`text-xl font-bold ${crypto.color}`}>{crypto.icon}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-base font-bold text-foreground">{crypto.symbol}</p>
                        <p className="text-xs text-muted-foreground">{crypto.name}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapModal;