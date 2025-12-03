import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface CreateUsernameProps {
  onNext: (username: string) => void;
}

const CreateUsername = ({ onNext }: CreateUsernameProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (username.length < 3) {
      setError('Имя должно содержать минимум 3 символа');
      return;
    }
    if (username.length > 20) {
      setError('Имя не должно превышать 20 символов');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Используйте только буквы, цифры и подчеркивание');
      return;
    }
    onNext(username);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border animate-fade-in">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Icon name="User" size={24} className="text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Создайте имя</h1>
              <p className="text-sm text-muted-foreground">
                Придумайте уникальное имя пользователя
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Имя пользователя
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={username}
                  onChange={handleChange}
                  placeholder="crypto_trader"
                  className="h-12 pl-10 text-base bg-muted/30 border-border focus:border-primary"
                  maxLength={20}
                />
                <Icon
                  name="AtSign"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
              {error && (
                <p className="text-xs text-destructive flex items-center space-x-1">
                  <Icon name="AlertCircle" size={14} />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-muted/20">
              <p className="text-sm font-medium text-foreground">Требования:</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Icon
                    name={username.length >= 3 ? "CheckCircle2" : "Circle"}
                    size={14}
                    className={username.length >= 3 ? "text-green-500" : "text-muted-foreground"}
                  />
                  <span>От 3 до 20 символов</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon
                    name={/^[a-zA-Z0-9_]*$/.test(username) ? "CheckCircle2" : "Circle"}
                    size={14}
                    className={/^[a-zA-Z0-9_]*$/.test(username) ? "text-green-500" : "text-muted-foreground"}
                  />
                  <span>Только буквы, цифры и _</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Icon name="Circle" size={14} className="text-muted-foreground" />
                  <span>Без пробелов и спецсимволов</span>
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={username.length < 3}
            className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            Продолжить
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateUsername;
