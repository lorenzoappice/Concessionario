const { Pool } = require('pg');
require('dotenv').config();

// Configurazione pool PostgreSQL
// Supporta DATABASE_URL (Neon, Railway, Heroku, ecc.) oppure variabili singole
let poolConfig;

if (process.env.DATABASE_URL) {
    // Connessione tramite connection string (formato Neon/Railway)
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // Richiesto da Neon
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    };
} else {
    // Connessione tramite variabili singole (sviluppo locale)
    poolConfig = {
        host: (process.env.DB_HOST || 'localhost').trim(),
        port: parseInt(process.env.DB_PORT) || 5432,
        user: (process.env.DB_USER || 'postgres').trim(),
        password: (process.env.DB_PASSWORD || '').trim(),
        database: (process.env.DB_NAME || 'concessionario_db').trim(),
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    };
}

const pool = new Pool(poolConfig);

// Test connessione
pool.on('connect', () => {
    console.log('✓ Connesso al database PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Errore inaspettato nel pool database:', err);
    process.exit(-1);
});

// Query helper
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Query eseguita:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Errore query database:', error);
        throw error;
    }
};

// Get client per transazioni
const getClient = async () => {
    const client = await pool.connect();
    const query = client.query.bind(client);
    const release = client.release.bind(client);
    
    // Timeout per evitare connessioni bloccate
    const timeout = setTimeout(() => {
        console.error('Client non rilasciato dopo 5 secondi!');
    }, 5000);
    
    client.release = () => {
        clearTimeout(timeout);
        return release();
    };
    
    return client;
};

module.exports = {
    pool,
    query,
    getClient
};
