import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
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

interface CryptoSelectModalProps {
  open: boolean;
  onClose: () => void;
  cryptos: Crypto[];
  onSelect: (crypto: Crypto) => void;
  title?: string;
}

const CryptoSelectModal = ({ open, onClose, cryptos, onSelect, title = "Выберите криптовалюту" }: CryptoSelectModalProps) => {
  const [search, setSearch] = useState('');

  const filteredCryptos = useMemo(() => {
    return cryptos.filter(c => 
      c.symbol.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [cryptos, search]);

  if (!open) return null;

  const handleSelect = (crypto: Crypto) => {
    onSelect(crypto);
    onClose();
    setSearch('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-safe animate-slide-up max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card z-10 pt-3 pb-4 px-4 sm:px-6 border-b border-border shrink-0">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4"></div>
          <div className="flex items-center justify-between mb-4 gap-3">
            <p className="text-base sm:text-lg font-bold text-foreground">{title}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted rounded-xl shrink-0"
            >
              <Icon name="X" size={22} />
            </Button>
          </div>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="h-11 sm:h-12 bg-secondary/50 border-border rounded-xl px-3 sm:px-4"
          />
        </div>
        
        <div className="overflow-y-auto smooth-scroll flex-1 px-4 sm:px-6 py-4">
          <div className="space-y-2">
            {filteredCryptos.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => handleSelect(crypto)}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-secondary/50 active:scale-[0.98] transition-all"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-secondary flex items-center justify-center overflow-visible shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {crypto.iconUrl ? (
                        <img src={crypto.iconUrl} alt={crypto.symbol} className="w-full h-full object-cover" />
                      ) : (
                        <span className={`text-lg sm:text-xl font-bold ${crypto.color}`}>{crypto.icon}</span>
                      )}
                    </div>
                    {crypto.networkIconUrl && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card border-2 border-card overflow-hidden shadow-lg">
                        <img src={crypto.networkIconUrl} alt={crypto.network} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm sm:text-base font-bold text-foreground truncate">{crypto.symbol}</p>
                    <p className="text-xs text-muted-foreground truncate">{crypto.name}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">{crypto.balance}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoSelectModal;