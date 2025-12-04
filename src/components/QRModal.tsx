import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

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
      <DialogContent className="bg-card border-border max-w-[90vw] sm:max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center text-lg ${crypto.color}`}>
              {crypto.icon}
            </div>
            <div>
              <p className="text-base font-bold text-foreground">Получить {crypto.symbol}</p>
              <p className="text-xs text-muted-foreground font-normal">{crypto.network}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-3">
          <div className="flex items-center justify-center p-4 rounded-lg bg-white">
            <QRCodeSVG
              value={crypto.address}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-foreground">Адрес кошелька:</p>
            <div className="p-2.5 rounded-lg bg-muted/30 break-all">
              <p className="text-xs font-mono text-foreground">{crypto.address}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start space-x-1.5">
              <Icon name="AlertTriangle" size={14} className="text-destructive mt-0.5" />
              <p className="text-[11px] text-destructive leading-snug">
                Отправляйте только {crypto.symbol} ({crypto.network}) на этот адрес
              </p>
            </div>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Icon name={copied ? "Check" : "Copy"} size={16} className="mr-2" />
            {copied ? 'Скопировано' : 'Скопировать адрес'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRModal;