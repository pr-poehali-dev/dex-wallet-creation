interface PricePoint {
  timestamp: number;
  price: number;
}

const COINGECKO_CHART_API = 'https://api.coingecko.com/api/v3/coins';
const CACHE_KEY_PREFIX = 'price_history_';
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут

const CRYPTO_IDS: { [key: string]: string } = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDT': 'tether',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'USDC': 'usd-coin',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'TRX': 'tron',
  'DOT': 'polkadot',
  'MATIC': 'polygon',
  'LTC': 'litecoin',
  'AVAX': 'avalanche',
  'LINK': 'chainlink',
  'ATOM': 'cosmos',
  'XMR': 'monero',
  'XLM': 'stellar',
  'UNI': 'uniswap',
  'SHIB': 'shiba-inu',
  'BCH': 'bitcoin-cash',
  'ETC': 'ethereum-classic',
  'AAVE': 'aave',
  'CAKE': 'pancakeswap-token'
};

export const getCachedPriceHistory = (symbol: string): PricePoint[] | null => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${symbol}`;
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const age = Date.now() - data.timestamp;
    if (age > CACHE_DURATION) return null;

    return data.prices;
  } catch (error) {
    console.error('Error loading cached price history:', error);
    return null;
  }
};

export const fetchPriceHistory = async (symbol: string, days: number = 7): Promise<PricePoint[]> => {
  const cached = getCachedPriceHistory(symbol);
  if (cached) return cached;

  const coinId = CRYPTO_IDS[symbol];
  if (!coinId) {
    return generateMockPriceHistory(days);
  }

  try {
    const response = await fetch(
      `${COINGECKO_CHART_API}/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }

    const data = await response.json();
    const prices: PricePoint[] = data.prices.map((item: [number, number]) => ({
      timestamp: item[0],
      price: item[1]
    }));

    const cacheKey = `${CACHE_KEY_PREFIX}${symbol}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      prices
    }));

    return prices;
  } catch (error) {
    console.error('Error fetching price history:', error);
    return generateMockPriceHistory(days);
  }
};

const generateMockPriceHistory = (days: number): PricePoint[] => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const points: PricePoint[] = [];
  
  let basePrice = 100;
  for (let i = days; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * 10;
    basePrice = Math.max(basePrice + variance, 1);
    points.push({
      timestamp: now - (i * dayMs),
      price: basePrice
    });
  }
  
  return points;
};

export const calculatePriceChange = (prices: PricePoint[]): { change: number; percentage: number } => {
  if (prices.length < 2) return { change: 0, percentage: 0 };
  
  const firstPrice = prices[0].price;
  const lastPrice = prices[prices.length - 1].price;
  const change = lastPrice - firstPrice;
  const percentage = (change / firstPrice) * 100;
  
  return { change, percentage };
};
