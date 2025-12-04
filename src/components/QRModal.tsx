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
  iconUrl?: string;
  networkIconUrl?: string;
  color: string;
}

interface QRModalProps {
  open: boolean;
  onClose: () => void;
  crypto: Crypto;
}

const QRModal = ({ open, onClose, crypto }: QRModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(crypto.address);
    setCopied(true);
    toast.success('Адрес скопирован в буфер обмена');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-safe animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card z-10 pt-3 pb-4 px-6 border-b border-border">
          <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-visible">
                <div className="w-full h-full rounded-full overflow-hidden">
                  {crypto.iconUrl ? (
                    <img src={crypto.iconUrl} alt={crypto.symbol} className="w-full h-full object-cover" />
                  ) : (
                    <span className={`text-2xl font-bold ${crypto.color}`}>{crypto.icon}</span>
                  )}
                </div>
                {crypto.networkIconUrl && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-[2.5px] border-white dark:border-gray-900 overflow-hidden shadow-lg">
                    <img src={crypto.networkIconUrl} alt={crypto.network} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">Получить {crypto.symbol}</p>
                <p className="text-sm text-muted-foreground">{crypto.network}</p>
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

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-center p-6 rounded-2xl bg-white shadow-sm">
            <QRCodeSVG
              value={crypto.address}
              size={220}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Адрес кошелька</p>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
              >
                <Icon name={copied ? "Check" : "Copy"} size={16} />
                <span className="text-sm font-semibold">{copied ? 'Скопировано' : 'Копировать'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-sm font-mono text-foreground break-all leading-relaxed">{crypto.address}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="AlertTriangle" size={12} className="text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">Важно!</p>
                <p className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">
                  Отправляйте только {crypto.symbol} в сети {crypto.network} на этот адрес. Отправка других активов приведет к их потере.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl"
          >
            Готово
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;