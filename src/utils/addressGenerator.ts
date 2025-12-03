export const generateAddress = (network: string): string => {
  const chars = '0123456789abcdef';
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  const random = (length: number, charset: string) => {
    return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
  };

  switch (network) {
    case 'Bitcoin':
      return 'bc1q' + random(39, alphanumeric);
    
    case 'Ethereum':
    case 'BSC':
    case 'Polygon':
    case 'Optimism':
    case 'Arbitrum':
      return '0x' + random(40, chars);
    
    case 'TRC20':
    case 'Tron':
      return 'T' + random(33, alphanumeric);
    
    case 'Solana':
      return random(44, alphanumeric);
    
    case 'Cardano':
      return 'addr1' + random(54, alphanumeric);
    
    case 'XRP Ledger':
      return 'r' + random(33, alphanumeric);
    
    case 'Polkadot':
      return '1' + random(47, alphanumeric);
    
    case 'Dogecoin':
      return 'D' + random(33, alphanumeric);
    
    case 'Litecoin':
      return 'ltc1' + random(39, alphanumeric);
    
    case 'Avalanche':
      return 'X-avax1' + random(38, alphanumeric);
    
    case 'Cosmos':
      return 'cosmos1' + random(38, alphanumeric);
    
    case 'Monero':
      return '4' + random(94, alphanumeric);
    
    case 'Stellar':
      return 'G' + random(55, alphanumeric);
    
    case 'VeChain':
      return '0x' + random(40, chars);
    
    case 'Algorand':
      return random(58, alphanumeric);
    
    case 'Filecoin':
      return 'f1' + random(50, alphanumeric);
    
    case 'Hedera':
      return '0.0.' + Math.floor(Math.random() * 1000000);
    
    case 'Near':
      return random(12, 'abcdefghijklmnopqrstuvwxyz0123456789') + '.near';
    
    case 'Fantom':
      return '0x' + random(40, chars);
    
    case 'Aptos':
      return '0x' + random(64, chars);
    
    case 'Sui':
      return '0x' + random(64, chars);
    
    case 'TON':
      return 'EQ' + random(46, alphanumeric);
    
    default:
      return '0x' + random(40, chars);
  }
};

export const generateWalletAddresses = (seedPhrase: string[]): Map<string, string> => {
  const seed = seedPhrase.join('');
  const addressMap = new Map<string, string>();
  
  const networks = [
    'Bitcoin', 'Ethereum', 'BSC', 'TRC20', 'Cardano', 'Solana', 'XRP Ledger',
    'Polkadot', 'Dogecoin', 'Polygon', 'Litecoin', 'Avalanche', 'Cosmos',
    'Tron', 'Monero', 'Stellar', 'VeChain', 'Algorand', 'Filecoin', 'Hedera',
    'Near', 'Fantom', 'Aptos', 'Optimism', 'Arbitrum', 'Sui', 'TON'
  ];

  networks.forEach((network, index) => {
    const seedWithSalt = seed + network + index;
    let hash = 0;
    for (let i = 0; i < seedWithSalt.length; i++) {
      hash = ((hash << 5) - hash) + seedWithSalt.charCodeAt(i);
      hash = hash & hash;
    }
    Math.random = () => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
    addressMap.set(network, generateAddress(network));
  });

  return addressMap;
};
