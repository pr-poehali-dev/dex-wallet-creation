import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CreateWalletProps {
  onNext: () => void;
  onBack: () => void;
}

const CreateWallet = ({ onNext, onBack }: CreateWalletProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-card border-border animate-fade-in">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="w-10" />
          </div>
          <div className="flex flex-col items-center space-y-5">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Wallet" size={40} className="text-primary" />
          </div>
          
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Создать кошелек</h1>
            <p className="text-muted-foreground text-xs">
              Безопасный DEX кошелек для управления вашими криптоактивами
            </p>
          </div>

          <div className="w-full space-y-2.5 pt-2">
            <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-muted/30">
              <Icon name="Shield" size={18} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Полная безопасность</p>
                <p className="text-xs text-muted-foreground">Ваши ключи хранятся только у вас</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-muted/30">
              <Icon name="Globe" size={18} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">30+ криптовалют</p>
                <p className="text-xs text-muted-foreground">Поддержка всех популярных сетей</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-muted/30">
              <Icon name="Zap" size={18} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Быстрые транзакции</p>
                <p className="text-xs text-muted-foreground">Мгновенная отправка через QR</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={onNext}
            className="w-full h-11 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Создать новый кошелек
          </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateWallet;