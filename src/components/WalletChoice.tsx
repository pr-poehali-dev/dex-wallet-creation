import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WalletChoiceProps {
  onCreateNew: () => void;
  onRestore: () => void;
}

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  icon: string;
  size: number;
}

const WalletChoice = ({ onCreateNew, onRestore }: WalletChoiceProps) => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const cryptoIcons = ['Bitcoin', 'Wallet', 'DollarSign', 'Coins', 'CircleDollarSign'];
    const newSnowflakes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 7,
      icon: cryptoIcons[Math.floor(Math.random() * cryptoIcons.length)],
      size: 20 + Math.random() * 15,
    }));
    setSnowflakes(newSnowflakes);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-primary/20 animate-snowfall pointer-events-none"
          style={{
            left: `${flake.left}%`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
            top: '-50px',
          }}
        >
          <Icon name={flake.icon as any} size={flake.size} />
        </div>
      ))}

      <Card className="w-full max-w-2xl p-6 sm:p-10 bg-card/95 backdrop-blur-md border-border animate-fade-in shadow-2xl mx-auto relative z-10">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center shadow-2xl animate-scale-in relative">
            <Icon name="Wallet" size={44} className="text-white sm:w-16 sm:h-16" />
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
          
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight">
              Ywallet <span className="text-primary">DEX</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Децентрализованный кошелек с полным контролем над вашими активами
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl py-4">
            <div className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-primary/5">
              <Icon name="Shield" size={24} className="text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Безопасность</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-primary/5">
              <Icon name="Zap" size={24} className="text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Быстрый Swap</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-primary/5">
              <Icon name="TrendingUp" size={24} className="text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Аналитика</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-primary/5">
              <Icon name="Repeat" size={24} className="text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Обмен</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-primary/5">
              <Icon name="Send" size={24} className="text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">Переводы</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-primary/5">
              <Icon name="Database" size={24} className="text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">База Данных</span>
            </div>
          </div>

          <div className="w-full space-y-3 sm:space-y-4 pt-2">
            <Card 
              className="p-5 sm:p-6 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-primary/40 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 active:scale-[0.98] transition-all duration-300 cursor-pointer group"
              onClick={onCreateNew}
            >
              <div className="flex items-start space-x-4 sm:space-x-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/25 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="Plus" size={24} className="text-primary sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Создать новый кошелек</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Генерация безопасной seed-фразы и создание нового кошелька
                  </p>
                </div>
                <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
              </div>
            </Card>

            <Card 
              className="p-5 sm:p-6 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] transition-all duration-300 cursor-pointer group"
              onClick={onRestore}
            >
              <div className="flex items-start space-x-4 sm:space-x-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="RotateCcw" size={24} className="text-primary sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">Восстановить кошелек</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Импорт существующего кошелька через seed-фразу
                  </p>
                </div>
                <Icon name="ChevronRight" size={24} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
              </div>
            </Card>
          </div>

          <div className="pt-4 text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Icon name="Lock" size={16} />
              <p className="text-xs sm:text-sm font-medium">
                Полная приватность и контроль
              </p>
            </div>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Ваши ключи хранятся только на устройстве. Никто не имеет доступа к вашим средствам.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletChoice;