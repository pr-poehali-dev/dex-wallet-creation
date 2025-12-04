import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WelcomeProps {
  username: string;
  onNext: () => void;
}

const Welcome = ({ username, onNext }: WelcomeProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border animate-fade-in">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-scale-in">
            <Icon name="Sparkles" size={48} className="text-white" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Добро пожаловать, {username}!
            </h1>
            <p className="text-muted-foreground text-sm">
              Ваш кошелек успешно создан и готов к использованию
            </p>
          </div>

          <div className="w-full space-y-3 pt-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <div className="flex items-start space-x-3">
                <Icon name="Shield" size={20} className="text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Ваши средства в безопасности
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Никто кроме вас не имеет доступа к вашим криптоактивам
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-muted/30 text-center">
                <Icon name="Coins" size={24} className="text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">1000+</p>
                <p className="text-xs text-muted-foreground">Криптовалют</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 text-center">
                <Icon name="Network" size={24} className="text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">10+</p>
                <p className="text-xs text-muted-foreground">Сетей</p>
              </div>
            </div>
          </div>

          <div className="w-full pt-2">
            <Button
              onClick={onNext}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white"
              size="lg"
            >
              Продолжить
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Welcome;