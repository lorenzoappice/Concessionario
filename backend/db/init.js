const { pool, getClient } = require('./config');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
    const client = await getClient();
    
    try {
        console.log('Inizializzazione database...');
        
        // Leggi e esegui schema
        const schemaSQL = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
        await client.query(schemaSQL);
        console.log('✓ Schema creato');
        
        // Crea utente admin di default
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await client.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING',
            ['admin', hashedPassword, 'admin']
        );
        console.log('✓ Utente admin creato (username: admin, password: admin123)');
        
        // Migra dati da db.json se esiste
        const dbJsonPath = path.join(__dirname, '..', 'db.json');
        if (fs.existsSync(dbJsonPath)) {
            const oldData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
            
            if (oldData.veicoli && oldData.veicoli.length > 0) {
                console.log(`Migrazione di ${oldData.veicoli.length} veicoli...`);
                
                for (const veicolo of oldData.veicoli) {
                    // Inserisci veicolo
                    const vehicleResult = await client.query(
                        `INSERT INTO vehicles (marca, modello, anno, prezzo, chilometri, potenza, cilindrata, 
                         carburante, cambio, colore, porte, posti, carrozzeria, trazione, descrizione)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                         RETURNING id`,
                        [
                            veicolo.marca, veicolo.modello, veicolo.anno, veicolo.prezzo,
                            veicolo.chilometri, veicolo.potenza, veicolo.cilindrata,
                            veicolo.carburante, veicolo.cambio, veicolo.colore,
                            veicolo.porte, veicolo.posti, veicolo.carrozzeria,
                            veicolo.trazione, veicolo.descrizione
                        ]
                    );
                    
                    const vehicleId = vehicleResult.rows[0].id;
                    
                    // Inserisci immagini
                    if (veicolo.immagini && veicolo.immagini.length > 0) {
                        for (let i = 0; i < veicolo.immagini.length; i++) {
                            await client.query(
                                'INSERT INTO vehicle_images (vehicle_id, image_path, image_order) VALUES ($1, $2, $3)',
                                [vehicleId, veicolo.immagini[i], i]
                            );
                        }
                    }
                    
                    // Inserisci optional
                    if (veicolo.optional && veicolo.optional.length > 0) {
                        for (const optional of veicolo.optional) {
                            await client.query(
                                'INSERT INTO vehicle_optionals (vehicle_id, optional_name) VALUES ($1, $2)',
                                [vehicleId, optional]
                            );
                        }
                    }
                    
                    console.log(`  ✓ Migrato: ${veicolo.marca} ${veicolo.modello}`);
                }
            }
        }
        
        console.log('\n✅ Database inizializzato con successo!');
        console.log('\nCredenziali admin:');
        console.log('Username: admin');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('❌ Errore durante inizializzazione:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Esegui inizializzazione
initializeDatabase()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
