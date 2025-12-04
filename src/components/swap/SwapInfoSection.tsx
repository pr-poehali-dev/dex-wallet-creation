interface Crypto {
  id: string;
  name: string;
  symbol: string;
  network: string;
  balance: string;
  icon: string;
  iconUrl?: string;
  networkIconUrl?: string;
  color: string;
}

interface SwapInfoSectionProps {
  fromCrypto: Crypto | null;
  toCrypto: Crypto | null;
  exchangeRate: number;
  fee: number;
}

const SwapInfoSection = ({ fromCrypto, toCrypto, exchangeRate, fee }: SwapInfoSectionProps) => {
  if (!fromCrypto || !toCrypto || exchangeRate <= 0) {
    return null;
  }

  return (
    <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Курс обмена</span>
        <span className="text-sm font-semibold text-foreground">
          1 {fromCrypto.symbol} = {exchangeRate.toFixed(6)} {toCrypto.symbol}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Комиссия сервиса</span>
        <span className="text-sm font-semibold text-foreground">{(fee * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default SwapInfoSection;
