---
mode: 'edit'
description: 'Aggiunge una nuova route API REST al backend Express del concessionario'
---

# Aggiungi Nuova Route API

## Obiettivo
Aggiungere una nuova route REST a `backend/server.js` seguendo le convenzioni del progetto.

## Informazioni necessarie
- **Metodo HTTP**: [GET | POST | PUT | DELETE]
- **Path**: `/api/[risorsa]`
- **Richiede autenticazione admin?**: [sì/no — se sì, usare middleware `authenticateToken, isAdmin`]
- **Cosa deve fare**: [descrizione]
- **Tabelle DB coinvolte**: [vehicles | vehicle_images | vehicle_optionals | users]

## Regole obbligatorie nel codice

### Query SQL
```javascript
// SEMPRE parametrizzato con $1, $2, ...
const result = await query('SELECT * FROM vehicles WHERE marca = $1', [marca]);

// MAI interpolazione diretta di variabili utente in SQL
// ❌ SBAGLIATO: `SELECT * FROM vehicles WHERE marca = '${marca}'`
```

### Pattern async/await con gestione errori
```javascript
app.get('/api/esempio', async (req, res) => {
  try {
    const result = await query('SELECT ...', [params]);
    res.json(result.rows);
  } catch (error) {
    console.error('Errore [nome route]:', error);
    res.status(500).json({ error: 'Messaggio utente', detail: error.message });
  }
});
```

### Transazioni multi-step (INSERT/UPDATE + tabelle correlate)
```javascript
app.post('/api/esempio', authenticateToken, isAdmin, async (req, res) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    // ... operazioni ...
    await client.query('COMMIT');
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Errore:', error);
    res.status(500).json({ error: 'Errore operazione', detail: error.message });
  } finally {
    client.release(); // sempre!
  }
});
```

### Middleware autenticazione
```javascript
// Solo token valido
app.get('/api/protetta', authenticateToken, async (req, res) => { ... });

// Token valido + ruolo admin
app.post('/api/admin', authenticateToken, isAdmin, async (req, res) => { ... });
```

### Upload file (multipart/form-data)
```javascript
app.post('/api/con-file', authenticateToken, isAdmin, upload.array('immagini', 10), async (req, res) => {
  const immagini = req.files.map(file => `/uploads/${file.filename}`);
  // req.body contiene i campi testo
});
```

## Dove inserire la route in server.js

Le route seguono questo ordine nella sezione `server.js`:
1. `/api/health`
2. Auth routes (`/api/login`, `/api/verify`)
3. Filtri veicoli (`/api/veicoli/filtri/*`) — **PRIMA** di `/api/veicoli/:id`
4. Confronta (`/api/veicoli/confronta`) — **PRIMA** di `/api/veicoli/:id`
5. CRUD veicoli (`GET/POST /api/veicoli`, `GET/PUT/DELETE /api/veicoli/:id`)
6. Route HTML (in fondo)

> ⚠️ Le route con path fisso (es. `/api/veicoli/filtri/marche`) vanno SEMPRE prima di quelle con parametri (es. `/api/veicoli/:id`), altrimenti Express legge `filtri` come `:id`.

## Risposta standard JSON
```javascript
// Successo lista
res.json(result.rows);

// Successo singolo
res.json(result.rows[0]);

// Successo operazione
res.json({ success: true, message: 'Fatto', data: result.rows[0] });

// Errore client
res.status(400).json({ error: 'Messaggio chiaro per utente' });

// Non trovato
res.status(404).json({ error: 'Risorsa non trovata' });

// Errore server
res.status(500).json({ error: 'Messaggio utente', detail: error.message });
```
