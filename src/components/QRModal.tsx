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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(crypto.address);
      setCopied(true);
      toast.success('Адрес скопирован в буфер обмена');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = crypto.address;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('Адрес скопирован в буфер обмена');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Не удалось скопировать адрес');
      }
      document.body.removeChild(textArea);
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
                <p className="text-base sm:text-lg font-bold text-foreground truncate">Получить {crypto.symbol}</p>
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

        <div className="flex-1 overflow-y-auto smooth-scroll px-4 sm:px-6 py-6 space-y-5">
          <div className="flex items-center justify-center p-4 sm:p-6 rounded-2xl bg-white shadow-sm">
            <QRCodeSVG
              value={crypto.address}
              size={Math.min(window.innerWidth - 120, 240)}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">Адрес кошелька</p>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 text-primary hover:text-primary/80 transition-colors active:scale-95"
              >
                <Icon name={copied ? "Check" : "Copy"} size={16} />
                <span className="text-sm font-semibold whitespace-nowrap">{copied ? 'Скопировано' : 'Копировать'}</span>
              </button>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-xs sm:text-sm font-mono text-foreground break-all leading-relaxed">{crypto.address}</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="AlertTriangle" size={12} className="text-white" />
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-200">Важно!</p>
                <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-300 leading-relaxed">
                  Отправляйте только {crypto.symbol} в сети {crypto.network} на этот адрес. Отправка других активов приведет к их потере.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card px-4 sm:px-6 py-4 border-t border-border shrink-0">
          <Button
            onClick={onClose}
            className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl transition-all active:scale-[0.98]"
          >
            Готово
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;