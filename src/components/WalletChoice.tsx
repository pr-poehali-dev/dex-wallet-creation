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
    const cryptoIcons = ['Bitcoin', 'Wallet', 'DollarSign', 'Coins', 'CircleDollarSign', 'TrendingUp', 'Zap'];
    const newSnowflakes = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 8,
      icon: cryptoIcons[Math.floor(Math.random() * cryptoIcons.length)],
      size: 16 + Math.random() * 20,
    }));
    setSnowflakes(newSnowflakes);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
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

      <Card className="w-full max-w-4xl p-6 sm:p-8 bg-card/95 backdrop-blur-md border-border animate-fade-in shadow-2xl mx-auto relative z-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center shadow-2xl animate-scale-in relative">
            <Icon name="Wallet" size={32} className="text-white sm:w-10 sm:h-10" />
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
          
          <div className="text-center space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Ywallet <span className="text-primary">DEX</span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto">
              Децентрализованный кошелек с полным контролем
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full max-w-3xl py-3">
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary/5">
              <Icon name="Shield" size={20} className="text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-foreground">Безопасность</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary/5">
              <Icon name="Zap" size={20} className="text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-foreground">Swap</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary/5">
              <Icon name="TrendingUp" size={20} className="text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-foreground">Аналитика</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary/5">
              <Icon name="Repeat" size={20} className="text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-foreground">Обмен</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary/5">
              <Icon name="Send" size={20} className="text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-foreground">Переводы</span>
            </div>
            <div className="flex flex-col items-center space-y-1 p-2 rounded-lg bg-primary/5">
              <Icon name="Database" size={20} className="text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-foreground">База</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 w-full pt-2">
            <Card 
              className="p-4 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-primary/40 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 active:scale-[0.98] transition-all duration-300 cursor-pointer group"
              onClick={onCreateNew}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/25 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="Plus" size={24} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Создать кошелек</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Генерация seed-фразы
                  </p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
              </div>
            </Card>

            <Card 
              className="p-4 bg-gradient-to-br from-muted/30 via-muted/20 to-muted/10 border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] transition-all duration-300 cursor-pointer group"
              onClick={onRestore}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon name="RotateCcw" size={24} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Восстановить</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Импорт через seed-фразу
                  </p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
              </div>
            </Card>
          </div>

          <div className="pt-2 text-center">
            <div className="flex items-center justify-center space-x-2 text-primary mb-1">
              <Icon name="Lock" size={14} />
              <p className="text-xs font-medium">
                Полная приватность и контроль
              </p>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground max-w-md mx-auto">
              Ваши ключи хранятся только на устройстве
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletChoice;