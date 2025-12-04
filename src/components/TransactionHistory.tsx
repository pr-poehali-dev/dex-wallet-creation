import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Transaction } from '@/utils/transactionManager';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onTransactionClick: (tx: Transaction) => void;
}

const TransactionHistory = ({ transactions, onTransactionClick }: TransactionHistoryProps) => {
  const [filter, setFilter] = useState<'all' | 'send' | 'receive'>('all');

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Вчера, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <Icon name="Clock" size={12} />
            <span>В обработке</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold text-green-600 dark:text-green-400">
            <Icon name="CheckCircle" size={12} />
            <span>Завершено</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center space-x-1 text-xs font-semibold text-red-600 dark:text-red-400">
            <Icon name="XCircle" size={12} />
            <span>Ошибка</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className="rounded-full whitespace-nowrap"
        >
          Все
        </Button>
        <Button
          variant={filter === 'send' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('send')}
          className="rounded-full whitespace-nowrap"
        >
          Отправлено
        </Button>
        <Button
          variant={filter === 'receive' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('receive')}
          className="rounded-full whitespace-nowrap"
        >
          Получено
        </Button>
      </div>

      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <Card className="p-8 bg-card border-border rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                <Icon name="Receipt" size={28} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">Транзакций пока нет</p>
              <p className="text-xs text-muted-foreground">История операций появится здесь</p>
            </div>
          </Card>
        ) : (
          filteredTransactions.map((tx) => (
            <Card
              key={tx.id}
              onClick={() => onTransactionClick(tx)}
              className="p-4 bg-card hover:bg-secondary/30 border-border rounded-xl cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'send' ? 'bg-red-100 dark:bg-red-950/30' : 'bg-green-100 dark:bg-green-950/30'
                    }`}
                  >
                    <Icon
                      name={tx.type === 'send' ? 'ArrowUpRight' : 'ArrowDownLeft'}
                      size={20}
                      className={tx.type === 'send' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {tx.type === 'send' ? 'Отправка' : 'Получение'} {tx.symbol}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'send' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {tx.type === 'send' ? '-' : '+'}{tx.amount} {tx.symbol}
                  </p>
                  {getStatusBadge(tx.status)}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
