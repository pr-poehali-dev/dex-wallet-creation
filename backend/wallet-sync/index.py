import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Синхронизация данных кошелька пользователя с базой данных
    Args: event - dict с httpMethod, body, queryStringParameters
          context - object с request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create_user':
                username = body.get('username')
                seed_phrase_encrypted = body.get('seed_phrase_encrypted')
                addresses = body.get('addresses', {})
                
                cur.execute(
                    "INSERT INTO users (username, seed_phrase_encrypted) VALUES (%s, %s) RETURNING id",
                    (username, seed_phrase_encrypted)
                )
                user_id = cur.fetchone()[0]
                
                for network, address in addresses.items():
                    cur.execute(
                        "INSERT INTO crypto_addresses (user_id, network, address) VALUES (%s, %s, %s)",
                        (user_id, network, address)
                    )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'user_id': user_id, 'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_user':
                username = body.get('username')
                seed_phrase_encrypted = body.get('seed_phrase_encrypted')
                
                if seed_phrase_encrypted:
                    cur.execute(
                        "SELECT id, username, seed_phrase_encrypted, created_at FROM users WHERE seed_phrase_encrypted = %s",
                        (seed_phrase_encrypted,)
                    )
                else:
                    cur.execute(
                        "SELECT id, username, seed_phrase_encrypted, created_at FROM users WHERE username = %s",
                        (username,)
                    )
                
                user_row = cur.fetchone()
                
                if not user_row:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
                
                user_id = user_row[0]
                
                cur.execute(
                    "SELECT network, address FROM crypto_addresses WHERE user_id = %s",
                    (user_id,)
                )
                addresses = {row[0]: row[1] for row in cur.fetchall()}
                
                cur.execute(
                    "SELECT crypto_id, balance FROM crypto_balances WHERE user_id = %s",
                    (user_id,)
                )
                balances = {row[0]: row[1] for row in cur.fetchall()}
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'user_id': user_id,
                        'username': user_row[1],
                        'seed_phrase_encrypted': user_row[2],
                        'addresses': addresses,
                        'balances': balances
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'update_balance':
                user_id = body.get('user_id')
                crypto_id = body.get('crypto_id')
                balance = body.get('balance')
                
                cur.execute(
                    """
                    INSERT INTO crypto_balances (user_id, crypto_id, balance, updated_at)
                    VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
                    ON CONFLICT (user_id, crypto_id)
                    DO UPDATE SET balance = %s, updated_at = CURRENT_TIMESTAMP
                    """,
                    (user_id, crypto_id, balance, balance)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'save_transaction':
                user_id = body.get('user_id')
                tx = body.get('transaction')
                
                cur.execute(
                    """
                    INSERT INTO transactions 
                    (id, user_id, type, crypto_id, symbol, amount, address, fee, status, hash, network, timestamp)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET status = %s
                    """,
                    (
                        tx['id'], user_id, tx['type'], tx['cryptoId'], tx['symbol'],
                        tx['amount'], tx['address'], tx['fee'], tx['status'],
                        tx['hash'], tx['network'], tx['timestamp'], tx['status']
                    )
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            
            elif action == 'get_transactions':
                user_id = body.get('user_id')
                
                cur.execute(
                    """
                    SELECT id, type, crypto_id, symbol, amount, address, fee, status, hash, network, timestamp
                    FROM transactions
                    WHERE user_id = %s
                    ORDER BY timestamp DESC
                    LIMIT 100
                    """,
                    (user_id,)
                )
                
                transactions = []
                for row in cur.fetchall():
                    transactions.append({
                        'id': row[0],
                        'type': row[1],
                        'cryptoId': row[2],
                        'symbol': row[3],
                        'amount': row[4],
                        'address': row[5],
                        'fee': row[6],
                        'status': row[7],
                        'hash': row[8],
                        'network': row[9],
                        'timestamp': row[10]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'transactions': transactions}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()