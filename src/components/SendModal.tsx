import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { addTransaction, generateTransactionHash, generateTransactionId, simulateTransactionConfirmation } from '@/utils/transactionManager';
import { updateBalance, getBalances } from '@/utils/balanceManager';

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

interface SendModalProps {
  open: boolean;
  onClose: () => void;
  crypto: Crypto;
  onTransactionComplete?: () => void;
}

const SendModal = ({ open, onClose, crypto, onTransactionComplete }: SendModalProps) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!open) return null;

  const handleSend = async () => {
    if (!address || !amount) {
      toast.error('Заполните все поля');
      return;
    }

    const sendAmount = parseFloat(amount);
    const fee = 0.001;
    const currentBalance = parseFloat(crypto.balance.replace(',', ''));

    if (sendAmount + fee > currentBalance) {
      toast.error('Недостаточно средств для отправки');
      return;
    }

    setIsSending(true);

    const transactionId = generateTransactionId();
    const transaction = {
      id: transactionId,
      type: 'send' as const,
      cryptoId: crypto.id,
      symbol: crypto.symbol,
      amount: sendAmount.toFixed(8).replace(/\.?0+$/, ''),
      address: address,
      fee: fee.toString(),
      status: 'pending' as const,
      timestamp: Date.now(),
      hash: generateTransactionHash(),
      network: crypto.network
    };

    await addTransaction(transaction);

    const newBalance = (currentBalance - sendAmount - fee).toFixed(8).replace(/\.?0+$/, '');
    await updateBalance(crypto.id, newBalance);

    toast.success('Транзакция отправлена в сеть');

    simulateTransactionConfirmation(transactionId, () => {
      toast.success('Транзакция подтверждена');
      if (onTransactionComplete) {
        onTransactionComplete();
      }
    });

    setIsSending(false);
    onClose();
    setAddress('');
    setAmount('');
  };

  const handleScan = () => {
    setShowScanner(true);
    setTimeout(() => {
      setAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
      setShowScanner(false);
      toast.success('QR-код успешно отсканирован');
    }, 1500);
  };

  const handleMaxAmount = () => {
    const maxAmount = parseFloat(crypto.balance.replace(',', ''));
    if (maxAmount > 0.001) {
      setAmount((maxAmount - 0.001).toFixed(8).replace(/\.?0+$/, ''));
    } else {
      setAmount('0');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-safe animate-slide-up max-h-[92vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card z-10 pt-3 pb-4 px-4 sm:px-6 border-b border-border shrink-0">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4"></div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary flex items-center justify-center overflow-visible shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden">
                  {crypto.iconUrl ? (
                    <img src={crypto.iconUrl} alt={crypto.symbol} className="w-full h-full object-cover" />
                  ) : (
                    <span className={`text-2xl font-bold ${crypto.color}`}>{crypto.icon}</span>
                  )}
                </div>
                {crypto.networkIconUrl && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-card border-[2.5px] border-card overflow-hidden shadow-lg">
                    <img src={crypto.networkIconUrl} alt={crypto.network} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold text-foreground truncate">Отправить {crypto.symbol}</p>
                <p className="text-sm text-muted-foreground truncate">{crypto.network}</p>
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

        <div className="flex-1 overflow-y-auto smooth-scroll px-4 sm:px-6 py-4 sm:py-6 space-y-5">
          <div className="p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Доступно:</span>
              <span className="text-sm sm:text-base font-bold text-foreground">
                {crypto.balance} {crypto.symbol}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Адрес получателя</label>
            </div>
            <div className="flex space-x-2 sm:space-x-3">
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Введите адрес"
                className="flex-1 h-11 sm:h-12 text-sm bg-secondary/50 border-border rounded-xl px-3 sm:px-4"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl border-border shrink-0 active:scale-95 transition-all"
                onClick={handleScan}
                disabled={showScanner}
              >
                <Icon name={showScanner ? "Loader2" : "QrCode"} size={20} className={showScanner ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Сумма</label>
              <button
                onClick={handleMaxAmount}
                className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors active:scale-95"
              >
                Максимум
              </button>
            </div>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-11 sm:h-12 text-base bg-secondary/50 border-border rounded-xl pl-3 sm:pl-4 pr-16 sm:pr-20"
              />
              <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">
                {crypto.symbol}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-secondary/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Комиссия сети</span>
              <span className="text-sm font-semibold text-foreground">~0.001 {crypto.symbol}</span>
            </div>
            <div className="h-px bg-border"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Итого</span>
              <span className="text-sm sm:text-base font-bold text-foreground">
                {amount ? (parseFloat(amount) + 0.001).toFixed(8).replace(/\.?0+$/, '') : '0'} {crypto.symbol}
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="AlertTriangle" size={12} className="text-white" />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-semibold text-red-900 dark:text-red-200">Внимание!</p>
                <p className="text-xs sm:text-sm text-red-800 dark:text-red-300 leading-relaxed">
                  Проверьте адрес получателя перед отправкой. Транзакции в блокчейне необратимы.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card px-4 sm:px-6 py-4 border-t border-border shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-11 sm:h-14 rounded-xl text-base font-semibold border-border transition-all active:scale-[0.98]"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSend}
              disabled={!address || !amount || parseFloat(amount) <= 0 || isSending}
              className="h-11 sm:h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {isSending ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" size={18} className="mr-2" />
                  Отправить
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendModal;