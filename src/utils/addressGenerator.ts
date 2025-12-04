export const generateAddress = (network: string): string => {
  const chars = '0123456789abcdef';
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  const random = (length: number, charset: string) => {
    return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
  };

  switch (network) {
    case 'Bitcoin':
      return 'bc1q' + random(38, alphanumeric).toLowerCase();
    
    case 'Bitcoin Cash':
      return 'bitcoincash:q' + random(40, alphanumeric);
    
    case 'Ethereum':
    case 'ERC20':
    case 'BSC':
    case 'BEP20':
    case 'Polygon':
    case 'Optimism':
    case 'Arbitrum':
    case 'Ethereum Classic':
    case 'VeChain':
    case 'Fantom':
    case 'Celo':
    case 'Theta':
      return '0x' + random(40, chars);
    
    case 'TRC20':
    case 'Tron':
      const base58Chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      return 'T' + random(33, base58Chars);
    
    case 'Solana':
      return random(44, alphanumeric);
    
    case 'Cardano':
      return 'addr1' + random(54, alphanumeric);
    
    case 'XRP Ledger':
      return 'r' + random(33, alphanumeric);
    
    case 'Polkadot':
      return '1' + random(47, alphanumeric);
    
    case 'Kusama':
      return random(48, alphanumeric);
    
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
    
    case 'Algorand':
      return random(58, alphanumeric);
    
    case 'Filecoin':
      return 'f1' + random(50, alphanumeric);
    
    case 'Hedera':
      return '0.0.' + Math.floor(Math.random() * 1000000);
    
    case 'Near':
      return random(12, 'abcdefghijklmnopqrstuvwxyz0123456789') + '.near';
    
    case 'Aptos':
    case 'Sui':
      return '0x' + random(64, chars);
    
    case 'TON':
      return 'EQ' + random(46, alphanumeric);
    
    case 'Zcash':
      return 't1' + random(33, alphanumeric);
    
    case 'Dash':
      return 'X' + random(33, alphanumeric);
    
    case 'EOS':
      return random(12, 'abcdefghijklmnopqrstuvwxyz12345');
    
    case 'Tezos':
      return 'tz1' + random(33, alphanumeric);
    
    case 'IOTA':
      return 'iota1' + random(60, alphanumeric);
    
    case 'NEO':
      return 'A' + random(33, alphanumeric);
    
    case 'Qtum':
      return 'Q' + random(33, alphanumeric);
    
    case 'Ravencoin':
      return 'R' + random(33, alphanumeric);
    
    case 'Waves':
      return '3P' + random(33, alphanumeric);
    
    case 'ICON':
      return 'hx' + random(40, chars);
    
    case 'Ontology':
      return 'A' + random(33, alphanumeric);
    
    case 'Nano':
      return 'nano_' + random(60, alphanumeric);
    
    case 'Siacoin':
      return random(76, chars);
    
    case 'Arweave':
      return random(43, alphanumeric);
    
    case 'Kava':
      return 'kava1' + random(38, alphanumeric);
    
    case 'Secret':
      return 'secret1' + random(38, alphanumeric);
    
    case 'Nervos':
      return 'ckb1' + random(42, alphanumeric);
    
    case 'THORChain':
      return 'thor1' + random(38, alphanumeric);
    
    case 'Harmony':
      return 'one1' + random(38, alphanumeric);
    
    case 'Flow':
      return '0x' + random(16, chars);
    
    case 'Elrond':
    case 'MultiversX':
      return 'erd1' + random(58, alphanumeric);
    
    case 'Zilliqa':
      return 'zil1' + random(38, alphanumeric);
    
    case 'Stacks':
      return 'SP' + random(39, alphanumeric);
    
    case 'Helium':
      return '13' + random(48, alphanumeric);
    
    case 'Kaspa':
      return 'kaspa:' + random(61, alphanumeric);
    
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
    'Near', 'Fantom', 'Aptos', 'Optimism', 'Arbitrum', 'Sui', 'TON',
    'Bitcoin Cash', 'Ethereum Classic', 'Zcash', 'Dash', 'Theta', 'EOS',
    'Tezos', 'IOTA', 'NEO', 'Qtum', 'Ravencoin', 'Waves', 'ICON', 'Ontology',
    'Nano', 'Siacoin', 'Arweave', 'Kava', 'Secret', 'Nervos', 'THORChain',
    'Celo', 'Harmony', 'Flow', 'Elrond', 'MultiversX', 'Zilliqa', 'Kusama',
    'Stacks', 'Helium', 'Kaspa', 'ERC20', 'BEP20'
  ];

  networks.forEach((network, index) => {
    const seedWithSalt = seed + network + index;
    let hash = 0;
    for (let i = 0; i < seedWithSalt.length; i++) {
      hash = ((hash << 5) - hash) + seedWithSalt.charCodeAt(i);
      hash = hash & hash;
    }
    
    // Создаём детерминированный генератор
    let currentHash = Math.abs(hash);
    const originalRandom = Math.random;
    Math.random = () => {
      currentHash = (currentHash * 1103515245 + 12345) & 0x7fffffff;
      return currentHash / 0x7fffffff;
    };
    
    const generatedAddress = generateAddress(network);
    Math.random = originalRandom;
    
    // Debug для проверки
    if (network === 'Tron' || network === 'TRC20' || network === 'Bitcoin') {
      console.log(`Generated ${network}: ${generatedAddress} (length: ${generatedAddress.length})`);
    }
    
    addressMap.set(network, generatedAddress);
  });

  return addressMap;
};