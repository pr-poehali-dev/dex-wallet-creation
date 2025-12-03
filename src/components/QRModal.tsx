import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useState } from 'react';

interface Crypto {
  name: string;
  symbol: string;
  network: string;
  address: string;
  icon: string;
  color: string;
}

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  crypto: Crypto;
}

const QRModal = ({ open, onClose, crypto }: QRModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(crypto.address);
    setCopied(true);
    toast.success('Адрес скопирован');
    setTimeout(() => setCopied(false), 2000);
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
              <p className="text-lg font-bold text-foreground">Получить {crypto.symbol}</p>
              <p className="text-xs text-muted-foreground font-normal">{crypto.network}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center p-6 rounded-lg bg-white">
            <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <Icon name="QrCode" size={80} className="text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">QR-код адреса</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Адрес кошелька:</p>
            <div className="p-3 rounded-lg bg-muted/30 break-all">
              <p className="text-sm font-mono text-foreground">{crypto.address}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5" />
              <p className="text-xs text-destructive">
                Отправляйте только {crypto.symbol} ({crypto.network}) на этот адрес
              </p>
            </div>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Icon name={copied ? "Check" : "Copy"} size={18} className="mr-2" />
            {copied ? 'Скопировано' : 'Скопировать адрес'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRModal;
