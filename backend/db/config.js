const { Pool } = require('pg');
require('dotenv').config();

// Configurazione pool PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'concessionario_db',
    // SSL per database cloud (Neon, Supabase, Render, etc.)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20, // massimo numero di connessioni nel pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

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
