import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Crypto {
  name: string;
  symbol: string;
  network: string;
  balance: string;
  icon: string;
  color: string;
}

interface SendModalProps {
  open: boolean;
  onClose: () => void;
  crypto: Crypto;
}

const SendModal = ({ open, onClose, crypto }: SendModalProps) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleSend = () => {
    if (!address || !amount) {
      toast.error('Заполните все поля');
      return;
    }
    toast.success('Транзакция отправлена');
    onClose();
    setAddress('');
    setAmount('');
  };

  const handleScan = () => {
    setShowScanner(true);
    setTimeout(() => {
      setAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
      setShowScanner(false);
      toast.success('QR-код отсканирован');
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl ${crypto.color}`}>
              {crypto.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Отправить {crypto.symbol}</p>
              <p className="text-xs text-muted-foreground font-normal">{crypto.network}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Доступно:</span>
              <span className="text-sm font-semibold text-foreground">
                {crypto.balance} {crypto.symbol}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Адрес получателя</label>
            <div className="flex space-x-2">
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 bg-muted/30 border-border"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleScan}
                disabled={showScanner}
              >
                <Icon name={showScanner ? "Loader2" : "QrCode"} size={18} className={showScanner ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Сумма</label>
              <button
                onClick={() => setAmount(crypto.balance.replace(',', ''))}
                className="text-xs text-primary hover:underline"
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
                className="bg-muted/30 border-border pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                {crypto.symbol}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/20 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Комиссия сети:</span>
              <span className="text-foreground">~0.001 {crypto.symbol}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Общая сумма:</span>
              <span className="text-foreground font-semibold">
                {amount ? (parseFloat(amount) + 0.001).toFixed(3) : '0.000'} {crypto.symbol}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5" />
              <p className="text-xs text-destructive">
                Проверьте адрес перед отправкой. Транзакции необратимы.
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSend}
              disabled={!address || !amount}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Icon name="Send" size={18} className="mr-2" />
              Отправить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendModal;
