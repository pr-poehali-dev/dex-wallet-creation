-- Создаём таблицу пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    seed_phrase_encrypted TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаём таблицу адресов криптовалют
CREATE TABLE IF NOT EXISTS crypto_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    network VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, network)
);

-- Создаём таблицу балансов
CREATE TABLE IF NOT EXISTS crypto_balances (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    crypto_id VARCHAR(10) NOT NULL,
    balance VARCHAR(50) DEFAULT '0.00',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, crypto_id)
);

-- Создаём таблицу транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(100) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL,
    crypto_id VARCHAR(10) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    amount VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    fee VARCHAR(50) DEFAULT '0',
    status VARCHAR(20) DEFAULT 'pending',
    hash TEXT NOT NULL,
    network VARCHAR(50) NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаём индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_crypto_addresses_user_id ON crypto_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_balances_user_id ON crypto_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);