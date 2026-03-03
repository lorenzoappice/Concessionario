const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { query, getClient } = require('./db/config');
const { authenticateToken, isAdmin, generateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Crea la cartella uploads se non esiste
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configurazione Multer per upload immagini
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo immagini sono permesse!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(UPLOAD_DIR));

// ==================== AUTH ROUTES ====================

// Route per login admin con JWT
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username e password richiesti' });
    }
    
    // Cerca utente nel database
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenziali non valide' });
    }
    
    const user = result.rows[0];
    
    // Verifica password con bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Credenziali non valide' });
    }
    
    // Genera JWT token
    const token = generateToken(user);
    
    res.json({ 
      success: true, 
      message: 'Login effettuato con successo',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ success: false, error: 'Errore nel login' });
  }
});

// Route per verificare token
app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ==================== VEICOLI ROUTES ====================

// Route per ottenere tutti i veicoli con filtri e ricerca
app.get('/api/veicoli', async (req, res) => {
  try {
    const { 
      search, 
      marca, 
      prezzoMin, 
      prezzoMax, 
      annoMin, 
      annoMax,
      kmMin,
      kmMax,
      carburante,
      cambio,
      orderBy = 'id',
      orderDir = 'ASC'
    } = req.query;
    
    let queryText = `
      SELECT v.*, 
             (SELECT array_agg(vi.image_path ORDER BY vi.image_order) FROM vehicle_images vi WHERE vi.vehicle_id = v.id) as immagini,
             (SELECT array_agg(DISTINCT vo.optional_name) FROM vehicle_optionals vo WHERE vo.vehicle_id = v.id) as optional
      FROM vehicles v
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    // Filtro ricerca testuale
    if (search) {
      queryText += ` AND (LOWER(v.marca) LIKE LOWER($${paramCount}) OR LOWER(v.modello) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
      paramCount++;
    }
    
    // Filtro marca
    if (marca) {
      queryText += ` AND LOWER(v.marca) = LOWER($${paramCount})`;
      params.push(marca);
      paramCount++;
    }
    
    // Filtro prezzo
    if (prezzoMin) {
      queryText += ` AND v.prezzo >= $${paramCount}`;
      params.push(prezzoMin);
      paramCount++;
    }
    if (prezzoMax) {
      queryText += ` AND v.prezzo <= $${paramCount}`;
      params.push(prezzoMax);
      paramCount++;
    }
    
    // Filtro anno
    if (annoMin) {
      queryText += ` AND v.anno >= $${paramCount}`;
      params.push(annoMin);
      paramCount++;
    }
    if (annoMax) {
      queryText += ` AND v.anno <= $${paramCount}`;
      params.push(annoMax);
      paramCount++;
    }
    
    // Filtro chilometri
    if (kmMin) {
      queryText += ` AND v.chilometri >= $${paramCount}`;
      params.push(kmMin);
      paramCount++;
    }
    if (kmMax) {
      queryText += ` AND v.chilometri <= $${paramCount}`;
      params.push(kmMax);
      paramCount++;
    }
    
    // Filtro carburante
    if (carburante) {
      queryText += ` AND LOWER(v.carburante) = LOWER($${paramCount})`;
      params.push(carburante);
      paramCount++;
    }
    
    // Filtro cambio
    if (cambio) {
      queryText += ` AND LOWER(v.cambio) = LOWER($${paramCount})`;
      params.push(cambio);
      paramCount++;
    }
    
    /* no GROUP BY needed with subqueries */
    
    // Ordinamento
    const allowedOrderBy = ['id', 'prezzo', 'anno', 'chilometri', 'marca'];
    const allowedOrderDir = ['ASC', 'DESC'];
    
    if (allowedOrderBy.includes(orderBy) && allowedOrderDir.includes(orderDir.toUpperCase())) {
      queryText += ` ORDER BY v.${orderBy} ${orderDir}`;
    }
    
    const result = await query(queryText, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Errore recupero veicoli:', error);
    res.status(500).json({ error: 'Errore nel recupero dei veicoli' });
  }
});

// Route per ottenere marche disponibili
app.get('/api/veicoli/filtri/marche', async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT marca FROM vehicles ORDER BY marca');
    res.json(result.rows.map(row => row.marca));
  } catch (error) {
    console.error('Errore recupero marche:', error);
    res.status(500).json({ error: 'Errore nel recupero delle marche' });
  }
});

// Route per ottenere range prezzi
app.get('/api/veicoli/filtri/range-prezzi', async (req, res) => {
  try {
    const result = await query('SELECT MIN(prezzo) as min, MAX(prezzo) as max FROM vehicles');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Errore recupero range prezzi:', error);
    res.status(500).json({ error: 'Errore nel recupero del range prezzi' });
  }
});

// Route per confronto multiplo veicoli
app.post('/api/veicoli/confronta', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0 || ids.length > 3) {
      return res.status(400).json({ error: 'Specificare da 1 a 3 ID veicoli' });
    }
    
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const queryText = `
      SELECT v.*, 
             (SELECT array_agg(vi.image_path ORDER BY vi.image_order) FROM vehicle_images vi WHERE vi.vehicle_id = v.id) as immagini,
             (SELECT array_agg(DISTINCT vo.optional_name) FROM vehicle_optionals vo WHERE vo.vehicle_id = v.id) as optional
      FROM vehicles v
      WHERE v.id IN (${placeholders})
      ORDER BY v.id
    `;
    
    const result = await query(queryText, ids);
    res.json(result.rows);
  } catch (error) {
    console.error('Errore confronto veicoli:', error);
    res.status(500).json({ error: 'Errore nel confronto dei veicoli' });
  }
});

// Route per ottenere un singolo veicolo per ID
app.get('/api/veicoli/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const result = await query(`
      SELECT v.*, 
             (SELECT array_agg(vi.image_path ORDER BY vi.image_order) FROM vehicle_images vi WHERE vi.vehicle_id = v.id) as immagini,
             (SELECT array_agg(DISTINCT vo.optional_name) FROM vehicle_optionals vo WHERE vo.vehicle_id = v.id) as optional
      FROM vehicles v
      WHERE v.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Veicolo non trovato' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Errore recupero veicolo:', error);
    res.status(500).json({ error: 'Errore nel recupero del veicolo' });
  }
});

// Route per aggiungere un veicolo con immagini (solo admin autenticato)
app.post('/api/veicoli', authenticateToken, isAdmin, upload.array('immagini', 10), async (req, res) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    
    // Validazione campi obbligatori
    const campiObbligatori = ['marca', 'modello', 'anno', 'prezzo', 'chilometri', 'potenza', 
                               'cilindrata', 'carburante', 'cambio', 'colore', 'carrozzeria', 
                               'trazione', 'porte', 'posti', 'descrizione'];
    
    const campiMancanti = campiObbligatori.filter(campo => !req.body[campo]);
    
    if (campiMancanti.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        success: false,
        error: 'Campi obbligatori mancanti', 
        campiMancanti: campiMancanti 
      });
    }
    
    // Estrae i percorsi delle immagini caricate
    const immagini = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    if (immagini.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        success: false,
        error: 'Almeno un\'immagine è obbligatoria' 
      });
    }
    
    // Parsing dell'array optional (da textarea multilinea)
    let optional = [];
    if (req.body.optional) {
      if (typeof req.body.optional === 'string') {
        // Da textarea: dividi per newline
        optional = req.body.optional.split('\n')
          .map(line => line.trim())
          .filter(line => line !== '');
      } else {
        // Da JSON (per retrocompatibilità)
        try {
          optional = Array.isArray(req.body.optional) ? req.body.optional : JSON.parse(req.body.optional);
        } catch (e) {
          optional = [];
        }
      }
    }
    
    // Inserisci veicolo
    const vehicleResult = await client.query(
      `INSERT INTO vehicles (marca, modello, anno, prezzo, chilometri, potenza, cilindrata, 
       carburante, cambio, colore, porte, posti, carrozzeria, trazione, descrizione)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        req.body.marca, req.body.modello, parseInt(req.body.anno), 
        parseFloat(req.body.prezzo), parseInt(req.body.chilometri),
        req.body.potenza, req.body.cilindrata, req.body.carburante,
        req.body.cambio, req.body.colore, parseInt(req.body.porte),
        parseInt(req.body.posti), req.body.carrozzeria, req.body.trazione,
        req.body.descrizione
      ]
    );
    
    const vehicleId = vehicleResult.rows[0].id;
    
    // Inserisci immagini
    for (let i = 0; i < immagini.length; i++) {
      await client.query(
        'INSERT INTO vehicle_images (vehicle_id, image_path, image_order) VALUES ($1, $2, $3)',
        [vehicleId, immagini[i], i]
      );
    }
    
    // Inserisci optional
    if (optional.length > 0) {
      const uniqueOptional = [...new Set(optional)];
      for (const opt of uniqueOptional) {
        await client.query(
          'INSERT INTO vehicle_optionals (vehicle_id, optional_name) VALUES ($1, $2)',
          [vehicleId, opt]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Recupera veicolo completo
    const fullVehicle = await query(`
      SELECT v.*, 
             (SELECT array_agg(vi.image_path ORDER BY vi.image_order) FROM vehicle_images vi WHERE vi.vehicle_id = v.id) as immagini,
             (SELECT array_agg(DISTINCT vo.optional_name) FROM vehicle_optionals vo WHERE vo.vehicle_id = v.id) as optional
      FROM vehicles v
      WHERE v.id = $1
    `, [vehicleId]);
    
    res.json({ success: true, veicolo: fullVehicle.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore aggiunta veicolo:', error);
    res.status(500).json({ error: 'Errore nell\'aggiunta del veicolo', details: error.message });
  } finally {
    client.release();
  }
});

// Route per eliminare un veicolo (solo admin autenticato)
app.delete('/api/veicoli/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const result = await query('DELETE FROM vehicles WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Veicolo non trovato' });
    }
    
    res.json({ success: true, message: 'Veicolo eliminato' });
  } catch (error) {
    console.error('Errore eliminazione veicolo:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione del veicolo' });
  }
});

// Route per modificare un veicolo (solo admin autenticato)
app.put('/api/veicoli/:id', authenticateToken, isAdmin, upload.array('immagini', 10), async (req, res) => {
  const client = await getClient();
  
  try {
    const id = parseInt(req.params.id);
    await client.query('BEGIN');
    
    // Verifica che il veicolo esista
    const checkVehicle = await client.query('SELECT id FROM vehicles WHERE id = $1', [id]);
    if (checkVehicle.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        success: false,
        error: 'Veicolo non trovato' 
      });
    }
    
    // Validazione campi obbligatori
    const campiObbligatori = ['marca', 'modello', 'anno', 'prezzo', 'chilometri', 'potenza', 
                               'cilindrata', 'carburante', 'cambio', 'colore', 'carrozzeria', 
                               'trazione', 'porte', 'posti', 'descrizione'];
    
    const campiMancanti = campiObbligatori.filter(campo => !req.body[campo]);
    
    if (campiMancanti.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        success: false,
        error: 'Campi obbligatori mancanti', 
        campiMancanti: campiMancanti 
      });
    }
    
    // Aggiorna veicolo
    await client.query(
      `UPDATE vehicles SET 
       marca = $1, modello = $2, anno = $3, prezzo = $4, chilometri = $5, 
       potenza = $6, cilindrata = $7, carburante = $8, cambio = $9, colore = $10,
       porte = $11, posti = $12, carrozzeria = $13, trazione = $14, descrizione = $15
       WHERE id = $16`,
      [
        req.body.marca, req.body.modello, parseInt(req.body.anno), 
        parseFloat(req.body.prezzo), parseInt(req.body.chilometri),
        req.body.potenza, req.body.cilindrata, req.body.carburante,
        req.body.cambio, req.body.colore, parseInt(req.body.porte),
        parseInt(req.body.posti), req.body.carrozzeria, req.body.trazione,
        req.body.descrizione, id
      ]
    );
    
    // Gestisci nuove immagini se presenti
    if (req.files && req.files.length > 0) {
      const immagini = req.files.map(file => `/uploads/${file.filename}`);
      
      // Ottieni l'ultimo image_order esistente
      const maxOrderResult = await client.query(
        'SELECT COALESCE(MAX(image_order), -1) as max_order FROM vehicle_images WHERE vehicle_id = $1',
        [id]
      );
      let nextOrder = maxOrderResult.rows[0].max_order + 1;
      
      // Inserisci nuove immagini
      for (const img of immagini) {
        await client.query(
          'INSERT INTO vehicle_images (vehicle_id, image_path, image_order) VALUES ($1, $2, $3)',
          [id, img, nextOrder++]
        );
      }
    }
    
    // Aggiorna optional
    if (req.body.optional !== undefined) {
      // Rimuovi i vecchi optional
      await client.query('DELETE FROM vehicle_optionals WHERE vehicle_id = $1', [id]);
      
      // Parsing degli optional (da textarea multilinea)
      let optional = [];
      if (req.body.optional && req.body.optional.trim() !== '') {
        optional = req.body.optional.split('\n')
          .map(line => line.trim())
          .filter(line => line !== '');
      }
      
      // Inserisci nuovi optional
      if (optional.length > 0) {
        const uniqueOptional = [...new Set(optional)];
        for (const opt of uniqueOptional) {
          await client.query(
            'INSERT INTO vehicle_optionals (vehicle_id, optional_name) VALUES ($1, $2)',
            [id, opt]
          );
        }
      }
    }
    
    await client.query('COMMIT');
    
    // Recupera veicolo completo aggiornato
    const fullVehicle = await query(`
      SELECT v.*, 
             (SELECT array_agg(vi.image_path ORDER BY vi.image_order) FROM vehicle_images vi WHERE vi.vehicle_id = v.id) as immagini,
             (SELECT array_agg(DISTINCT vo.optional_name) FROM vehicle_optionals vo WHERE vo.vehicle_id = v.id) as optional
      FROM vehicles v
      WHERE v.id = $1
    `, [id]);
    
    res.json({ success: true, veicolo: fullVehicle.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore modifica veicolo:', error);
    res.status(500).json({ error: 'Errore nella modifica del veicolo', details: error.message });
  } finally {
    client.release();
  }
});

// Route per eliminare una singola immagine (solo admin autenticato)
app.delete('/api/veicoli/:id/immagine', authenticateToken, isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { imagePath } = req.body;
    
    if (!imagePath) {
      return res.status(400).json({ error: 'imagePath è richiesto' });
    }
    
    // Verifica che non sia l'ultima immagine
    const countResult = await query(
      'SELECT COUNT(*) as count FROM vehicle_images WHERE vehicle_id = $1',
      [id]
    );
    
    if (parseInt(countResult.rows[0].count) <= 1) {
      return res.status(400).json({ 
        success: false,
        error: 'Non puoi eliminare l\'ultima immagine' 
      });
    }
    
    // Elimina l'immagine dal database
    const result = await query(
      'DELETE FROM vehicle_images WHERE vehicle_id = $1 AND image_path = $2 RETURNING id',
      [id, imagePath]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Immagine non trovata' });
    }
    
    // Opzionale: elimina il file fisico dal filesystem
    const fs = require('fs');
    const filePath = path.join(__dirname, '..', 'frontend', imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ success: true, message: 'Immagine eliminata' });
  } catch (error) {
    console.error('Errore eliminazione immagine:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione dell\'immagine' });
  }
});

// ==================== SERVE PAGINE HTML ====================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/contatti', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/contatti.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.get('/confronta', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/confronta.html'));
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`\n🚀 Server in esecuzione su http://localhost:${PORT}`);
  console.log(`📊 Database: PostgreSQL`);
  console.log(`🔐 JWT Authentication attivo\n`);
});
