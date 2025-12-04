interface CryptoPriceMap {
  [key: string]: number;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';
const CACHE_KEY = 'crypto_prices_cache';
const CACHE_TIMESTAMP_KEY = 'crypto_prices_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 минут

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
  'VET': 'vechain',
  'ALGO': 'algorand',
  'FIL': 'filecoin',
  'HBAR': 'hedera',
  'NEAR': 'near',
  'FTM': 'fantom',
  'APT': 'aptos',
  'OP': 'optimism',
  'ARB': 'arbitrum',
  'SUI': 'sui',
  'IMX': 'immutable-x',
  'LDO': 'lido-dao',
  'TON': 'toncoin',
  'UNI': 'uniswap',
  'SHIB': 'shiba-inu',
  'BCH': 'bitcoin-cash',
  'ETC': 'ethereum-classic',
  'AAVE': 'aave',
  'GRT': 'the-graph',
  'MKR': 'maker',
  'CRV': 'curve-dao-token',
  'CAKE': 'pancakeswap-token',
  'SNX': 'synthetix-network-token',
  'ZEC': 'zcash',
  'DASH': 'dash',
  'MANA': 'decentraland',
  'SAND': 'the-sandbox',
  'AXS': 'axie-infinity',
  'THETA': 'theta-network',
  'EOS': 'eos',
  'XTZ': 'tezos',
  'MIOTA': 'iota',
  'NEO': 'neo',
  'COMP': 'compound',
  'QNT': 'quant-network',
  'BTT': 'bittorrent',
  'FLOW': 'flow',
  'EGLD': 'multiversx',
  'CHZ': 'chiliz',
  'BAT': 'basic-attention-token',
  'ENJ': 'enjin-coin',
  'ZIL': 'zilliqa',
  'KSM': 'kusama',
  'STX': 'stacks',
  'HNT': 'helium',
  'GALA': 'gala',
  'LRC': 'loopring',
  '1INCH': '1inch',
  'SUSHI': 'sushi',
  'YFI': 'yearn-finance',
  'RUNE': 'thorchain',
  'CELO': 'celo',
  'ONE': 'harmony',
  'HOT': 'holochain',
  'QTUM': 'qtum',
  'RVN': 'ravencoin',
  'OMG': 'omisego',
  'WAVES': 'waves',
  'ICX': 'icon',
  'ONT': 'ontology',
  'XNO': 'nano',
  'SC': 'siacoin',
  'ANKR': 'ankr',
  'REN': 'ren',
  'BAND': 'band-protocol',
  'OCEAN': 'ocean-protocol',
  'FET': 'fetch-ai',
  'RSR': 'reserve-rights',
  'AR': 'arweave',
  'INJ': 'injective',
  'KAVA': 'kava',
  'SCRT': 'secret',
  'CKB': 'nervos-network',
  'CVX': 'convex-finance',
  'RPL': 'rocket-pool',
  'FRAX': 'frax',
  'TUSD': 'trueusd',
  'USDP': 'paxos-standard',
  'GUSD': 'gemini-dollar',
  'DAI': 'dai',
  'BUSD': 'binance-usd',
  'WBTC': 'wrapped-bitcoin',
  'stETH': 'staked-ether',
  'PEPE': 'pepe',
  'RNDR': 'render-token',
  'KAS': 'kaspa',
  'USDD': 'usdd'
};

export const getCachedPrices = (): CryptoPriceMap | null => {
  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return null;

    const age = Date.now() - parseInt(timestamp);
    if (age > CACHE_DURATION) return null;

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    return JSON.parse(cached);
  } catch (error) {
    console.error('Error loading cached prices:', error);
    return null;
  }
};

export const fetchCryptoPrices = async (): Promise<CryptoPriceMap> => {
  const cached = getCachedPrices();
  if (cached) return cached;

  try {
    const ids = Object.values(CRYPTO_IDS).join(',');
    const response = await fetch(
      `${COINGECKO_API}?ids=${ids}&vs_currencies=usd`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }

    const data = await response.json();
    
    const priceMap: CryptoPriceMap = {};
    Object.entries(CRYPTO_IDS).forEach(([symbol, id]) => {
      priceMap[symbol] = data[id]?.usd || 0;
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify(priceMap));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());

    return priceMap;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    
    const fallbackPrices: CryptoPriceMap = {};
    Object.keys(CRYPTO_IDS).forEach(symbol => {
      if (symbol === 'BTC') fallbackPrices[symbol] = 43000;
      else if (symbol === 'ETH') fallbackPrices[symbol] = 2300;
      else if (['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'USDP', 'GUSD', 'FRAX', 'USDD'].includes(symbol)) {
        fallbackPrices[symbol] = 1;
      } else {
        fallbackPrices[symbol] = 0;
      }
    });
    
    return fallbackPrices;
  }
};

export const calculateBalance = (amount: string, priceUSD: number): number => {
  const numAmount = parseFloat(amount.replace(',', ''));
  if (isNaN(numAmount)) return 0;
  return numAmount * priceUSD;
};
