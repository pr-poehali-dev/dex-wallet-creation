import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Transaction } from '@/utils/transactionManager';
import { toast } from 'sonner';
import { useState } from 'react';

interface TransactionDetailModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const TransactionDetailModal = ({ open, onClose, transaction }: TransactionDetailModalProps) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!open) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(transaction.hash);
    setCopiedHash(true);
    toast.success('Хеш транзакции скопирован');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const getStatusInfo = () => {
    switch (transaction.status) {
      case 'pending':
        return {
          icon: 'Clock',
          color: 'text-orange-600 dark:text-orange-400',
          bg: 'bg-orange-50 dark:bg-orange-950/20',
          border: 'border-orange-200 dark:border-orange-900/30',
          label: 'В обработке'
        };
      case 'completed':
        return {
          icon: 'CheckCircle',
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-950/20',
          border: 'border-green-200 dark:border-green-900/30',
          label: 'Завершено'
        };
      case 'failed':
        return {
          icon: 'XCircle',
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-950/20',
          border: 'border-red-200 dark:border-red-900/30',
          label: 'Ошибка'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-safe animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-card z-10 pt-3 pb-4 px-6 border-b border-border">
          <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4"></div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Детали транзакции</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted rounded-xl"
            >
              <Icon name="X" size={22} />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className={`p-4 rounded-xl ${statusInfo.bg} border ${statusInfo.border}`}>
            <div className="flex items-center justify-center space-x-2">
              <Icon name={statusInfo.icon as any} size={20} className={statusInfo.color} />
              <span className={`text-base font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                transaction.type === 'send' ? 'bg-red-100 dark:bg-red-950/30' : 'bg-green-100 dark:bg-green-950/30'
              }`}
            >
              <Icon
                name={transaction.type === 'send' ? 'ArrowUpRight' : 'ArrowDownLeft'}
                size={28}
                className={transaction.type === 'send' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
              />
            </div>
            <p className={`text-3xl font-bold ${transaction.type === 'send' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {transaction.type === 'send' ? '-' : '+'}{transaction.amount} {transaction.symbol}
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction.type === 'send' ? 'Отправлено' : 'Получено'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Статус</span>
              <span className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Сеть</span>
              <span className="text-sm font-semibold text-foreground">{transaction.network}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Дата и время</span>
              <span className="text-sm font-semibold text-foreground">{formatDate(transaction.timestamp)}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Комиссия</span>
              <span className="text-sm font-semibold text-foreground">{transaction.fee} {transaction.symbol}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Итого</span>
              <span className="text-sm font-bold text-foreground">
                {(parseFloat(transaction.amount) + parseFloat(transaction.fee)).toFixed(8).replace(/\.?0+$/, '')} {transaction.symbol}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                {transaction.type === 'send' ? 'Адрес получателя' : 'Адрес отправителя'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 border border-border">
              <p className="text-xs font-mono text-foreground break-all leading-relaxed">{transaction.address}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Хеш транзакции</span>
              <button
                onClick={handleCopyHash}
                className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
              >
                <Icon name={copiedHash ? "Check" : "Copy"} size={16} />
                <span className="text-sm font-semibold">{copiedHash ? 'Скопировано' : 'Копировать'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 border border-border">
              <p className="text-xs font-mono text-foreground break-all leading-relaxed">{transaction.hash}</p>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-xl"
          >
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
