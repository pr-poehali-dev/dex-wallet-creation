import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface SeedPhraseProps {
  seedPhrase: string[];
  onNext: () => void;
}

const SeedPhrase = ({ seedPhrase, onNext }: SeedPhraseProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase.join(' '));
    setIsCopied(true);
    toast.success('Фраза скопирована');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-card border-border animate-fade-in">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Фраза восстановления</h1>
              <p className="text-sm text-muted-foreground">Сохраните эти 12 слов в надежном месте</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex items-start space-x-2">
              <Icon name="ShieldAlert" size={18} className="text-destructive mt-0.5" />
              <div className="text-sm text-foreground">
                <p className="font-medium mb-1">Важные правила безопасности:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Никогда не делитесь этой фразой с другими</li>
                  <li>• Храните копию в надежном оффлайн месте</li>
                  <li>• С помощью этой фразы можно восстановить доступ к кошельку</li>
                </ul>
              </div>
            </div>
          </div>

          {!isRevealed ? (
            <div className="relative">
              <div className="grid grid-cols-3 gap-3 blur-sm pointer-events-none">
                {seedPhrase.map((word, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30 text-center">
                    <span className="text-xs text-muted-foreground font-mono">
                      {index + 1}. {word}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={() => setIsRevealed(true)}
                  variant="outline"
                  className="bg-card hover:bg-muted"
                >
                  <Icon name="Eye" size={18} className="mr-2" />
                  Показать фразу
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {seedPhrase.map((word, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30 text-center hover:bg-muted/50 transition-colors">
                    <span className="text-xs text-muted-foreground mr-1">{index + 1}.</span>
                    <span className="text-sm font-mono text-foreground font-medium">{word}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full"
              >
                <Icon name={isCopied ? "Check" : "Copy"} size={18} className="mr-2" />
                {isCopied ? 'Скопировано' : 'Скопировать фразу'}
              </Button>
            </div>
          )}

          <Button
            onClick={onNext}
            disabled={!isRevealed}
            className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Ок, я сохранил фразу
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SeedPhrase;
