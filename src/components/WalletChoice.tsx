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
      <Card className="w-full max-w-md p-8 bg-card border-border animate-fade-in">
        <div className="flex flex-col items-center space-y-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl animate-scale-in">
            <Icon name="Wallet" size={48} className="text-white" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">DEX Кошелек</h1>
            <p className="text-muted-foreground text-sm">
              Выберите способ настройки вашего кошелька
            </p>
          </div>

          <div className="w-full space-y-4 pt-4">
            <Card 
              className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 hover:border-primary/50 transition-all cursor-pointer group"
              onClick={onCreateNew}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Icon name="Plus" size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">Создать новый кошелек</h3>
                  <p className="text-sm text-muted-foreground">
                    Генерация новой seed-фразы и создание кошелька с нуля
                  </p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Card>

            <Card 
              className="p-6 bg-muted/20 border-border hover:border-primary/30 transition-all cursor-pointer group"
              onClick={onRestore}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <Icon name="RotateCcw" size={24} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">Восстановить кошелек</h3>
                  <p className="text-sm text-muted-foreground">
                    Импорт существующего кошелька с помощью seed-фразы
                  </p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
            </Card>
          </div>

          <div className="pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Ваши ключи хранятся только на вашем устройстве
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletChoice;
