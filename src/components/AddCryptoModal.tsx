import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  network: string;
  balance: string;
  usdValue: string;
  icon: string;
  iconUrl?: string;
  networkIconUrl?: string;
  address: string;
  color: string;
}

interface AddCryptoModalProps {
  allCryptos: Crypto[];
  selectedCryptos: string[];
  onAdd: (ids: string[]) => void;
  onClose: () => void;
}

const AddCryptoModal = ({ allCryptos, selectedCryptos, onAdd, onClose }: AddCryptoModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelected, setTempSelected] = useState<string[]>(selectedCryptos);

  const filteredCryptos = allCryptos.filter(crypto => 
    !searchQuery || 
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCrypto = (id: string) => {
    if (tempSelected.includes(id)) {
      setTempSelected(tempSelected.filter(s => s !== id));
    } else {
      setTempSelected([...tempSelected, id]);
    }
  };

  const handleSave = () => {
    onAdd(tempSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 overflow-y-auto pt-safe pb-24" onClick={(e) => e.stopPropagation()}>
        <div className="min-h-full flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-border rounded-3xl overflow-hidden animate-slide-up">
            <div className="sticky top-0 bg-card z-10 border-b border-border">
              <div className="flex items-center justify-between p-5">
                <h2 className="text-xl font-bold text-foreground">Добавить криптовалюту</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-muted rounded-xl"
                >
                  <Icon name="X" size={22} />
                </Button>
              </div>
              
              <div className="px-5 pb-4">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Поиск криптовалюты..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-muted/50 border-border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-5 space-y-2">
              {filteredCryptos.map((crypto) => {
                const isSelected = tempSelected.includes(crypto.id);
                return (
                  <Card
                    key={crypto.id}
                    onClick={() => toggleCrypto(crypto.id)}
                    className={`p-4 cursor-pointer transition-all rounded-xl ${
                      isSelected 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-card border-border hover:bg-secondary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-visible">
                          <div className="w-full h-full rounded-full overflow-hidden">
                            {crypto.iconUrl ? (
                              <img src={crypto.iconUrl} alt={crypto.symbol} className="w-full h-full object-cover" />
                            ) : (
                              <span className={`text-lg font-bold ${crypto.color}`}>{crypto.icon}</span>
                            )}
                          </div>
                          {crypto.networkIconUrl && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-[2.5px] border-white dark:border-gray-900 overflow-hidden shadow-lg ring-1 ring-black/10">
                              <img src={crypto.networkIconUrl} alt={crypto.network} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{crypto.symbol}</p>
                          <p className="text-xs text-muted-foreground">{crypto.name}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-primary border-primary' 
                          : 'border-border'
                      }`}>
                        {isSelected && <Icon name="Check" size={14} className="text-white" />}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="sticky bottom-0 bg-card border-t border-border p-5">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 rounded-xl"
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl"
                >
                  Добавить ({tempSelected.length})
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddCryptoModal;