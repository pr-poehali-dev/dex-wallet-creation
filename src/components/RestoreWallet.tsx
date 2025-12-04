import { useState } from 'react';
import * as bip39 from 'bip39';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface RestoreWalletProps {
  onNext: (mnemonic: string[]) => void;
  onBack: () => void;
}

const RestoreWallet = ({ onNext, onBack }: RestoreWalletProps) => {
  const [seedInput, setSeedInput] = useState('');
  const [error, setError] = useState('');

  const handleRestore = () => {
    const words = seedInput.trim().toLowerCase().split(/\s+/);
    
    if (words.length !== 12 && words.length !== 24) {
      setError('Seed-фраза должна содержать 12 или 24 слова');
      return;
    }

    const mnemonic = words.join(' ');
    if (!bip39.validateMnemonic(mnemonic)) {
      setError('Неверная seed-фраза. Проверьте правильность слов');
      return;
    }

    toast.success('Кошелек успешно восстановлен');
    onNext(words);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSeedInput(text);
      setError('');
      toast.success('Фраза вставлена');
    } catch {
      toast.error('Не удалось вставить из буфера обмена');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSeedInput(e.target.value);
    setError('');
  };

  const wordCount = seedInput.trim().split(/\s+/).filter(w => w).length;

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
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Icon name="RotateCcw" size={24} className="text-secondary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Восстановить кошелек</h1>
                <p className="text-sm text-muted-foreground">Введите вашу seed-фразу</p>
              </div>
            </div>
            <div className="w-10" />
          </div>

          <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={18} className="text-secondary mt-0.5" />
              <div className="text-sm text-foreground">
                <p className="font-medium mb-1">Важная информация:</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Введите 12 или 24 слова из вашей seed-фразы</li>
                  <li>• Слова должны быть разделены пробелами</li>
                  <li>• Используйте только английские слова из BIP39 словаря</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Seed-фраза
              </label>
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${wordCount === 12 || wordCount === 24 ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {wordCount} / 12-24 слов
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePaste}
                  className="h-8"
                >
                  <Icon name="Clipboard" size={16} className="mr-1" />
                  Вставить
                </Button>
              </div>
            </div>
            
            <Textarea
              value={seedInput}
              onChange={handleChange}
              placeholder="abandon ability able about above absent absorb abstract absurd abuse access accident"
              className="min-h-[120px] bg-muted/30 border-border focus:border-secondary font-mono text-sm"
              maxLength={300}
            />
            
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center space-x-2">
                <Icon name="AlertCircle" size={18} className="text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-lg bg-muted/20">
            <div className="flex items-start space-x-2">
              <Icon name="Lock" size={18} className="text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Ваша seed-фраза никогда не покидает ваше устройство. Мы не храним и не передаем ваши данные.
              </p>
            </div>
          </div>

          <Button
            onClick={handleRestore}
            disabled={wordCount < 12 || wordCount > 24}
            className="w-full h-12 text-base font-medium bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            size="lg"
          >
            <Icon name="Check" size={18} className="mr-2" />
            Восстановить кошелек
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default RestoreWallet;
