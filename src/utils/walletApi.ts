const API_URL = 'https://functions.poehali.dev/0d606cb5-d32f-4895-b27b-e293b5eaff45';

interface CreateUserResponse {
  user_id: number;
  success: boolean;
}

interface GetUserResponse {
  user_id: number;
  username: string;
  seed_phrase_encrypted: string;
  addresses: Record<string, string>;
  balances: Record<string, string>;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  cryptoId: string;
  symbol: string;
  amount: string;
  address: string;
  fee: string;
  status: 'pending' | 'completed' | 'failed';
  hash: string;
  network: string;
  timestamp: number;
}

function simpleEncrypt(text: string): string {
  return btoa(text);
}

function simpleDecrypt(encrypted: string): string {
  return atob(encrypted);
}

export async function createUser(
  username: string,
  seedPhrase: string[],
  addresses: Record<string, string>
): Promise<number> {
  const seedPhraseEncrypted = simpleEncrypt(seedPhrase.join(' '));
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create_user',
      username,
      seed_phrase_encrypted: seedPhraseEncrypted,
      addresses,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  const data: CreateUserResponse = await response.json();
  return data.user_id;
}

export async function getUser(username: string): Promise<GetUserResponse | null> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'get_user',
      username,
    }),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to get user');
  }

  const data: GetUserResponse = await response.json();
  data.seed_phrase_encrypted = simpleDecrypt(data.seed_phrase_encrypted);
  
  return data;
}

export async function getUserBySeedPhrase(seedPhrase: string[]): Promise<GetUserResponse | null> {
  const seedPhraseEncrypted = simpleEncrypt(seedPhrase.join(' '));
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'get_user',
      seed_phrase_encrypted: seedPhraseEncrypted,
    }),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to get user by seed phrase');
  }

  const data: GetUserResponse = await response.json();
  data.seed_phrase_encrypted = simpleDecrypt(data.seed_phrase_encrypted);
  
  return data;
}

export async function getUserBalances(userId: number): Promise<Record<string, string>> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'get_balances',
      user_id: userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get user balances');
  }

  const data = await response.json();
  return data.balances;
}

export async function updateBalance(
  userId: number,
  cryptoId: string,
  balance: string
): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'update_balance',
      user_id: userId,
      crypto_id: cryptoId,
      balance,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update balance');
  }
}

export async function saveTransaction(
  userId: number,
  transaction: Transaction
): Promise<void> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'save_transaction',
      user_id: userId,
      transaction,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to save transaction');
  }
}

export async function getTransactions(userId: number): Promise<Transaction[]> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'get_transactions',
      user_id: userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get transactions');
  }

  const data = await response.json();
  return data.transactions;
}