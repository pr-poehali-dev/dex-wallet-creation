import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WalletChoiceProps {
  onCreateNew: () => void;
  onRestore: () => void;
}

const WalletChoice = ({ onCreateNew, onRestore }: WalletChoiceProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-card border-border animate-fade-in">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl animate-scale-in">
            <Icon name="Wallet" size={40} className="text-white" />
          </div>
          
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-foreground">DEX Кошелек</h1>
            <p className="text-muted-foreground text-xs">
              Выберите способ настройки вашего кошелька
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            <Card 
              className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 active:border-primary/50 active:scale-[0.98] transition-all"
              onClick={onCreateNew}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="Plus" size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground mb-0.5">Создать новый кошелек</h3>
                  <p className="text-xs text-muted-foreground">
                    Генерация новой seed-фразы и создание кошелька с нуля
                  </p>
                </div>
                <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
              </div>
            </Card>

            <Card 
              className="p-4 bg-muted/20 border-border active:border-primary/30 active:scale-[0.98] transition-all"
              onClick={onRestore}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Icon name="RotateCcw" size={20} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-foreground mb-0.5">Восстановить кошелек</h3>
                  <p className="text-xs text-muted-foreground">
                    Импорт существующего кошелька с помощью seed-фразы
                  </p>
                </div>
                <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
              </div>
            </Card>
          </div>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-muted-foreground">
              Ваши ключи хранятся только на вашем устройстве
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletChoice;