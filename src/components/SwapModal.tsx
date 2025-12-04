import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { addTransaction, generateTransactionHash, generateTransactionId, simulateTransactionConfirmation } from '@/utils/transactionManager';
import { updateBalance } from '@/utils/balanceManager';
import { fetchCryptoPrices } from '@/utils/cryptoPrices';
import SwapCryptoInput from '@/components/swap/SwapCryptoInput';
import CryptoSelectModal from '@/components/swap/CryptoSelectModal';
import SwapInfoSection from '@/components/swap/SwapInfoSection';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  network: string;
  balance: string;
  icon: string;
  iconUrl?: string;
  networkIconUrl?: string;
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

  if (!open) return null;

  const handleSwap = async () => {
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

    await addTransaction(sendTransaction);
    await addTransaction(receiveTransaction);

    const newFromBalance = (currentBalance - swapAmount).toFixed(8).replace(/\.?0+$/, '');
    console.log(`Обмен: ${fromCrypto.symbol} баланс ${currentBalance} -> ${newFromBalance}`);
    await updateBalance(fromCrypto.id, newFromBalance);

    const currentToBalance = parseFloat(toCrypto.balance.replace(',', ''));
    const newToBalance = (currentToBalance + receiveAmount).toFixed(8).replace(/\.?0+$/, '');
    console.log(`Обмен: ${toCrypto.symbol} баланс ${currentToBalance} -> ${newToBalance}`);
    await updateBalance(toCrypto.id, newToBalance);

    if (onTransactionComplete) {
      onTransactionComplete();
    }

    toast.success(`Обменяно ${swapAmount} ${fromCrypto.symbol} на ${receiveAmount.toFixed(6)} ${toCrypto.symbol}`);

    simulateTransactionConfirmation(sendTxId, () => {
      if (onTransactionComplete) onTransactionComplete();
    });
    
    simulateTransactionConfirmation(receiveTxId, () => {
      if (onTransactionComplete) onTransactionComplete();
    });

    setIsSwapping(false);
    
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
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-safe animate-slide-up max-h-[92vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card z-10 pt-3 pb-4 px-4 sm:px-6 border-b border-border shrink-0">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4"></div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-lg">
                <Icon name="ArrowLeftRight" size={22} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-foreground">Обмен криптовалюты</p>
                <p className="text-sm text-muted-foreground">Лучший курс</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted rounded-xl shrink-0"
            >
              <Icon name="X" size={22} />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto smooth-scroll px-4 sm:px-6 py-4 sm:py-6 space-y-4">
          {/* FROM */}
          <SwapCryptoInput
            label="Отдаёте"
            crypto={fromCrypto}
            amount={fromAmount}
            onAmountChange={setFromAmount}
            onSelectClick={() => setShowFromSelect(true)}
            onMaxClick={handleMaxAmount}
            prices={prices}
            showMaxButton={true}
          />

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
          <SwapCryptoInput
            label="Получаете"
            crypto={toCrypto}
            amount={toAmount}
            onSelectClick={() => setShowToSelect(true)}
            prices={prices}
            readOnly={true}
          />

          {/* INFO */}
          <SwapInfoSection
            fromCrypto={fromCrypto}
            toCrypto={toCrypto}
            exchangeRate={exchangeRate}
            fee={fee}
          />

        </div>

        <div className="sticky bottom-0 bg-card px-4 sm:px-6 py-4 border-t border-border shrink-0">
          <Button
            onClick={handleSwap}
            disabled={!fromCrypto || !toCrypto || !fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
            className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
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
      <CryptoSelectModal
        open={showFromSelect}
        onClose={() => setShowFromSelect(false)}
        cryptos={allCryptos}
        onSelect={setFromCrypto}
      />

      {/* TO SELECT MODAL */}
      <CryptoSelectModal
        open={showToSelect}
        onClose={() => setShowToSelect(false)}
        cryptos={allCryptos}
        onSelect={setToCrypto}
      />
    </div>
  );
};

export default SwapModal;