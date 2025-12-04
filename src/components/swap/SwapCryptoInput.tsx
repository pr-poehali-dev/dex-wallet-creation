import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

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

interface SwapCryptoInputProps {
  label: string;
  crypto: Crypto | null;
  amount: string;
  onAmountChange?: (value: string) => void;
  onSelectClick: () => void;
  onMaxClick?: () => void;
  prices: {[key: string]: number};
  readOnly?: boolean;
  showMaxButton?: boolean;
}

const SwapCryptoInput = ({ 
  label, 
  crypto, 
  amount, 
  onAmountChange, 
  onSelectClick, 
  onMaxClick,
  prices,
  readOnly = false,
  showMaxButton = false
}: SwapCryptoInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 gap-2">
        <label className="text-sm font-semibold text-muted-foreground">{label}</label>
        {showMaxButton && crypto && (
          <button
            onClick={onMaxClick}
            className="text-xs sm:text-sm text-primary hover:text-primary/80 font-semibold transition-colors active:scale-95 whitespace-nowrap"
          >
            Макс: {crypto.balance}
          </button>
        )}
      </div>
      
      <div className="p-3 sm:p-4 rounded-2xl bg-secondary/50 border-2 border-border hover:border-primary/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onSelectClick}
            className="flex items-center space-x-2 px-2.5 sm:px-3 py-2 rounded-xl bg-card hover:bg-secondary border border-border transition-all active:scale-95"
          >
            {crypto ? (
              <>
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center overflow-visible shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {crypto.iconUrl ? (
                      <img src={crypto.iconUrl} alt={crypto.symbol} className="w-full h-full object-cover" />
                    ) : (
                      <span className={`text-base sm:text-lg font-bold ${crypto.color}`}>{crypto.icon}</span>
                    )}
                  </div>
                  {crypto.networkIconUrl && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-card border border-card overflow-hidden shadow-md">
                      <img src={crypto.networkIconUrl} alt={crypto.network} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <span className="text-sm sm:text-base font-bold text-foreground">{crypto.symbol}</span>
                <Icon name="ChevronDown" size={18} className="text-muted-foreground" />
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Выберите</span>
            )}
          </button>
        </div>
        
        {readOnly ? (
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {amount || '0.00'}
          </div>
        ) : (
          <Input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            placeholder="0.00"
            className="text-xl sm:text-2xl font-bold h-auto p-0 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}
        
        {crypto && prices[crypto.symbol] && amount && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            ≈ ${(parseFloat(amount) * prices[crypto.symbol]).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default SwapCryptoInput;