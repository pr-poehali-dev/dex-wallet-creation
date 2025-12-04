import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WalletChoiceProps {
  onCreateNew: () => void;
  onRestore: () => void;
}

const WalletChoice = ({ onCreateNew, onRestore }: WalletChoiceProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md p-6 sm:p-8 bg-card border-border animate-fade-in shadow-xl mx-auto">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl animate-scale-in">
            <Icon name="Wallet" size={40} className="text-white sm:w-12 sm:h-12" />
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">DEX Кошелек</h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xs mx-auto">
              Выберите способ настройки вашего кошелька
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            <Card 
              className="p-4 sm:p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 hover:border-primary/50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              onClick={onCreateNew}
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon name="Plus" size={20} className="text-primary sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Создать новый кошелек</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Генерация новой seed-фразы и создание кошелька с нуля
                  </p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground shrink-0" />
              </div>
            </Card>

            <Card 
              className="p-4 sm:p-5 bg-muted/20 border-border hover:border-primary/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              onClick={onRestore}
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Icon name="RotateCcw" size={20} className="text-primary sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">Восстановить кошелек</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Импорт существующего кошелька с помощью seed-фразы
                  </p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground shrink-0" />
              </div>
            </Card>
          </div>

          <div className="pt-2 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ваши ключи хранятся только на вашем устройстве
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletChoice;