import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ConfirmSeedProps {
  seedPhrase: string[];
  onNext: () => void;
  onBack: () => void;
}

const ConfirmSeed = ({ seedPhrase, onNext, onBack }: ConfirmSeedProps) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setShuffledWords([...seedPhrase].sort(() => Math.random() - 0.5));
  }, [seedPhrase]);

  const handleWordClick = (word: string) => {
    if (selectedWords.length < seedPhrase.length) {
      setSelectedWords([...selectedWords, word]);
      setIsCorrect(null);
    }
  };

  const handleRemoveWord = (index: number) => {
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
    setIsCorrect(null);
  };

  const handleVerify = () => {
    const correct = selectedWords.every((word, index) => word === seedPhrase[index]);
    setIsCorrect(correct);
    if (correct) {
      setTimeout(() => onNext(), 1000);
    }
  };

  const handleClear = () => {
    setSelectedWords([]);
    setIsCorrect(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-card border-border animate-fade-in">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-muted"
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Подтвердите фразу</h1>
                <p className="text-sm text-muted-foreground">
                  Выберите слова в правильном порядке
                </p>
              </div>
            </div>
            <div className="w-10" />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Ваша фраза:</p>
            <div className="min-h-[120px] p-4 rounded-lg bg-muted/20 border-2 border-dashed border-border">
              {selectedWords.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Выберите слова ниже</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedWords.map((word, index) => (
                    <button
                      key={index}
                      onClick={() => handleRemoveWord(index)}
                      className="px-3 py-2 rounded-lg bg-primary/20 hover:bg-destructive/20 text-foreground text-sm font-mono transition-colors"
                    >
                      <span className="text-xs text-muted-foreground mr-1">{index + 1}.</span>
                      {word}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isCorrect === false && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center space-x-2">
              <Icon name="XCircle" size={18} className="text-destructive" />
              <p className="text-sm text-destructive">Неверный порядок. Попробуйте снова.</p>
            </div>
          )}

          {isCorrect === true && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center space-x-2">
              <Icon name="CheckCircle" size={18} className="text-green-500" />
              <p className="text-sm text-green-500">Отлично! Фраза подтверждена.</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Доступные слова:</p>
            <div className="flex flex-wrap gap-2">
              {shuffledWords.map((word, index) => {
                const isUsed = selectedWords.includes(word);
                const usedCount = selectedWords.filter(w => w === word).length;
                const totalCount = seedPhrase.filter(w => w === word).length;
                const isDisabled = usedCount >= totalCount;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleWordClick(word)}
                    disabled={isDisabled}
                    className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                      isDisabled
                        ? 'bg-muted/20 text-muted-foreground opacity-50 cursor-not-allowed'
                        : 'bg-muted hover:bg-muted/70 text-foreground hover:scale-105'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1"
              disabled={selectedWords.length === 0}
            >
              <Icon name="RotateCcw" size={18} className="mr-2" />
              Очистить
            </Button>
            <Button
              onClick={handleVerify}
              disabled={selectedWords.length !== seedPhrase.length}
              className="flex-1 h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Подтвердить
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmSeed;