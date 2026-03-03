# 🗄️ Setup Database con DataGrip e Hosting Gratuito

Guida completa per usare DataGrip con un database PostgreSQL gratuito in cloud.

---

## 🎯 Panoramica

**DataGrip** è un IDE per database che ti permette di:
- Visualizzare e modificare dati
- Eseguire query SQL
- Vedere diagrammi ER
- Gestire tutto graficamente

**Il tuo progetto è già compatibile** - serve solo:
1. ✅ Database PostgreSQL (gratuito in cloud)
2. ✅ DataGrip configurato
3. ✅ File `.env` aggiornato

---

## 🌐 Opzione 1: NEON.TECH (CONSIGLIATO) ⭐

**Neon** è il miglior servizio gratuito attuale.

### Vantaggi:
- ✅ Completamente gratuito (tier generoso)
- ✅ PostgreSQL 15+
- ✅ 3 GB storage
- ✅ Autoscaling
- ✅ Connection pooling integrato
- ✅ Backup automatici
- ✅ Dashboard moderna

### 📝 Setup Neon:

#### 1. Registrati
1. Vai su https://neon.tech
2. Click **Sign Up** (puoi usare GitHub)
3. Crea account gratuito

#### 2. Crea Progetto
1. Click **New Project**
2. Nome: `concessionario`
3. PostgreSQL version: **15** (o latest)
4. Region: **Europe (Frankfurt)** (più vicino all'Italia)
5. Click **Create Project**

#### 3. Ottieni Credenziali
Neon ti mostrerà la connection string:

```
postgres://username:password@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Salva questa stringa!** La userai dopo.

#### 4. Crea Database
1. Nel dashboard Neon, vai a **SQL Editor**
2. Esegui:
```sql
CREATE DATABASE concessionario_db;
```

---

## 🌐 Opzione 2: SUPABASE (Alternativa con UI)

### Vantaggi:
- ✅ 500 MB database gratuito
- ✅ PostgreSQL + API automatiche
- ✅ Dashboard completa
- ✅ Backup giornalieri

### 📝 Setup Supabase:

#### 1. Registrati
1. Vai su https://supabase.com
2. Click **Start your project**
3. Usa GitHub/Google per registrarti

#### 2. Crea Progetto
1. Click **New Project**
2. Nome: `concessionario`
3. Database Password: Crea una password sicura (salvala!)
4. Region: **West EU (London)**
5. Click **Create new project**

⏳ Attendi 2-3 minuti per provisioning

#### 3. Ottieni Credenziali
1. Vai in **Settings** → **Database**
2. Copia **Connection string** (sezione Connection pooling)
3. Sostituisci `[YOUR-PASSWORD]` con la tua password

---

## 🌐 Opzione 3: RENDER (Facile da usare)

### Vantaggi:
- ✅ 1 GB database gratuito
- ✅ Setup velocissimo
- ✅ Backup manuali

### 📝 Setup Render:

#### 1. Registrati
1. Vai su https://render.com
2. Click **Get Started**
3. Registrati con GitHub/email

#### 2. Crea Database
1. Click **New +** → **PostgreSQL**
2. Nome: `concessionario-db`
3. Database: `concessionario_db`
4. User: `concessionario_user`
5. Region: **Frankfurt (EU Central)**
6. Plan: **Free**
7. Click **Create Database**

#### 3. Ottieni Credenziali
Render ti mostrerà:
- **External Database URL** (usa questa per connessioni esterne)
- Format: `postgres://user:password@host:5432/database`

---

## 🔧 Configurare DataGrip

### 1. Apri DataGrip
Se non l'hai ancora, scarica da: https://www.jetbrains.com/datagrip/

### 2. Crea Nuova Connessione

1. Click icona **+** (in alto a sinistra)
2. Seleziona **Data Source** → **PostgreSQL**

### 3. Configura Connessione

#### Se hai la connection string (formato: `postgres://user:pass@host:5432/db`):

**Esempio Neon:**
```
postgres://neondb_owner:AbCdEf123@ep-cool-meadow-123456.eu-central-1.aws.neon.tech/concessionario_db?sslmode=require
```

Compila così:
```
Host: ep-cool-meadow-123456.eu-central-1.aws.neon.tech
Port: 5432
Database: concessionario_db
User: neondb_owner
Password: AbCdEf123
```

#### Opzioni SSL:

Nella tab **SSH/SSL**:
1. Abilita **Use SSL**
2. SSL Mode: **require**

### 4. Installa Driver

DataGrip ti chiederà di scaricare il driver PostgreSQL:
- Click **Download missing driver files**
- Attendi download

### 5. Test Connection

1. Click **Test Connection** in basso
2. Dovresti vedere: ✅ **Succeeded**

Se errore:
- Verifica credenziali
- Controlla che SSL sia abilitato
- Verifica che il database esista

### 6. Salva

Click **OK** per salvare la connessione

---

## ⚙️ Aggiornare Configurazione Progetto

### 1. Modifica `backend/.env`

Apri `backend/.env` e aggiorna con le credenziali del tuo database cloud:

```env
# Database Configuration - NEON EXAMPLE
DB_HOST=ep-cool-meadow-123456.eu-central-1.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASSWORD=AbCdEf123
DB_NAME=concessionario_db
DB_SSL=true

# JWT Configuration
JWT_SECRET=cambia_questo_secret_12345_produzione
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
```

**⚠️ IMPORTANTE**: Sostituisci con le TUE credenziali!

### 2. Aggiungi Supporto SSL al Codice

Il file `backend/db/config.js` deve supportare SSL per database cloud.

Apri `backend/db/config.js` e verifica/aggiungi:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

// Configurazione pool PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'concessionario_db',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

---

## 🚀 Inizializzare Database Cloud

### 1. Verifica Connessione in DataGrip

1. In DataGrip, click destro sulla connessione
2. **Jump to Query Console**
3. Scrivi: `SELECT version();`
4. Esegui (Ctrl+Enter)
5. Dovresti vedere la versione PostgreSQL ✅

### 2. Esegui Script Inizializzazione

Nel terminale del progetto:

```powershell
cd backend
npm run db:init
```

Output atteso:
```
Inizializzazione database...
✓ Schema creato
✓ Utente admin creato (username: admin, password: admin123)
Migrazione di X veicoli...
  ✓ Migrato: Ferrari F8 Tributo
  ...
✅ Database inizializzato con successo!
```

### 3. Verifica in DataGrip

In DataGrip:
1. Click destro sulla connessione → **Refresh**
2. Espandi **Schemas** → **public** → **Tables**
3. Dovresti vedere:
   - `users`
   - `vehicles`
   - `vehicle_images`
   - `vehicle_optionals`

---

## 🎨 Usare DataGrip per Gestire il Database

### 📊 Visualizzare Dati

**Metodo 1: Doppio click sulla tabella**
1. Espandi **Tables** nel tree a sinistra
2. Doppio click su `vehicles`
3. Vedi tutti i dati in tabella

**Metodo 2: Query Console**
1. Click destro su connessione → **Jump to Query Console**
2. Scrivi query:
```sql
SELECT * FROM vehicles;
```
3. Esegui con Ctrl+Enter

### 🔍 Query Utili

**Vedi tutti i veicoli con immagini:**
```sql
SELECT 
    v.id,
    v.marca,
    v.modello,
    v.anno,
    v.prezzo,
    array_agg(vi.image_path ORDER BY vi.image_order) as immagini
FROM vehicles v
LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id
GROUP BY v.id, v.marca, v.modello, v.anno, v.prezzo
ORDER BY v.id;
```

**Conta veicoli per marca:**
```sql
SELECT marca, COUNT(*) as totale
FROM vehicles
GROUP BY marca
ORDER BY totale DESC;
```

**Vedi veicoli più costosi:**
```sql
SELECT marca, modello, prezzo
FROM vehicles
ORDER BY prezzo DESC
LIMIT 5;
```

**Cerca veicoli per carburante:**
```sql
SELECT marca, modello, carburante, prezzo
FROM vehicles
WHERE carburante = 'Benzina'
ORDER BY prezzo ASC;
```

### ✏️ Modificare Dati

**Metodo visuale:**
1. Doppio click su tabella `vehicles`
2. Doppio click sulla cella da modificare
3. Modifica il valore
4. Click **Submit** (Ctrl+Enter) per salvare

**Metodo SQL:**
```sql
UPDATE vehicles 
SET prezzo = 85000 
WHERE id = 1;
```

### ➕ Inserire Dati

**Insert con DataGrip:**
1. Doppio click su tabella
2. Click **+** (Add row) in alto
3. Compila i campi
4. Click **Submit**

**Insert con SQL:**
```sql
BEGIN;

-- Inserisci veicolo
INSERT INTO vehicles (marca, modello, anno, prezzo, chilometri, potenza, 
                      cilindrata, carburante, cambio, colore, porte, posti, 
                      carrozzeria, trazione, descrizione)
VALUES ('Mercedes', 'Classe E', 2024, 55000, 5000, '200', '2000', 
        'Diesel', 'Automatico', 'Argento', 4, 5, 'Berlina', 'Posteriore',
        'Mercedes Classe E in condizioni eccellenti')
RETURNING id;

-- Salva l'ID ritornato e usalo per le immagini
-- Esempio: se l'ID è 6
INSERT INTO vehicle_images (vehicle_id, image_path, image_order)
VALUES 
    (6, '/uploads/mercedes1.jpg', 0),
    (6, '/uploads/mercedes2.jpg', 1),
    (6, '/uploads/mercedes3.jpg', 2);

-- Inserisci optional
INSERT INTO vehicle_optionals (vehicle_id, optional_name)
VALUES 
    (6, 'Tetto panoramico'),
    (6, 'Navigatore'),
    (6, 'Sensori parcheggio');

COMMIT;
```

### 🗑️ Eliminare Dati

**Elimina veicolo (cascade elimina anche immagini e optional):**
```sql
DELETE FROM vehicles WHERE id = 5;
```

**Svuota tabella:**
```sql
TRUNCATE TABLE vehicle_optionals CASCADE;
TRUNCATE TABLE vehicle_images CASCADE;
TRUNCATE TABLE vehicles CASCADE;
TRUNCATE TABLE users CASCADE;
```

### 📈 Diagrammi ER

1. Espandi il database nel tree
2. Seleziona tutte le tabelle (Ctrl+click)
3. Click destro → **Diagrams** → **Show Visualization**
4. DataGrip mostrerà le relazioni tra tabelle

### 📤 Export Dati

1. Click destro su tabella
2. **Dump Data To File**
3. Scegli formato: SQL, CSV, JSON, etc.
4. Salva

### 📥 Import Dati

1. Click destro su tabella
2. **Import Data from File**
3. Seleziona file CSV/JSON/SQL
4. Mappa le colonne
5. Click **Import**

---

## 🔐 Sicurezza Database Cloud

### Best Practices:

1. **Non committare .env su Git**
   - Il file `.gitignore` dovrebbe includere `.env`

2. **Usa password forti**
   - Almeno 16 caratteri
   - Mix lettere, numeri, simboli

3. **Cambia JWT_SECRET**
   ```env
   JWT_SECRET=TuaChiaveSegretaMoltoLunga_12345678_Produzione
   ```

4. **Limita IP se possibile**
   - In Neon/Supabase puoi limitare accesso a specifici IP

5. **Backup regolari**
   - I servizi cloud fanno backup automatici
   - Ma puoi fare backup manuali con DataGrip (Export)

---

## 🚀 Avviare Applicazione con DB Cloud

### 1. Verifica .env

Assicurati che `backend/.env` abbia le credenziali cloud corrette.

### 2. Avvia Server

```powershell
cd backend
npm start
```

Output:
```
🚀 Server in esecuzione su http://localhost:3000
📊 Database: PostgreSQL
🔐 JWT Authentication attivo
✓ Connesso al database PostgreSQL
```

### 3. Testa Applicazione

1. Apri http://localhost:3000
2. Dovresti vedere i veicoli caricati
3. Prova filtri e ricerca
4. Login admin: admin / admin123
5. Aggiungi un veicolo di test

### 4. Verifica in DataGrip

1. Refresh connessione in DataGrip
2. Query: `SELECT * FROM vehicles ORDER BY id DESC LIMIT 1;`
3. Dovresti vedere il veicolo appena aggiunto

---

## 🐛 Troubleshooting

### Errore: "Connection refused"
**Causa**: Database non raggiungibile

**Soluzione**:
1. Verifica credenziali in `.env`
2. Testa connessione in DataGrip
3. Controlla che database sia attivo (dashboard provider)

### Errore: "SSL connection required"
**Causa**: Database cloud richiede SSL

**Soluzione**:
1. Aggiungi in `.env`: `DB_SSL=true`
2. Verifica che `db/config.js` supporti SSL
3. In DataGrip: SSH/SSL → Use SSL → require

### Errore: "Database does not exist"
**Causa**: Database non creato

**Soluzione**:
1. In DataGrip, crea database:
```sql
CREATE DATABASE concessionario_db;
```
2. Poi esegui: `npm run db:init`

### Errore: "Too many connections"
**Causa**: Limit connessioni raggiunto

**Soluzione**:
1. Riduci `max` in `db/config.js` da 20 a 5
2. Usa connection pooling del provider
3. Chiudi connessioni DataGrip quando non usi

### Query lente
**Soluzione**:
1. Verifica indici esistano:
```sql
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
```
2. Analizza query con EXPLAIN:
```sql
EXPLAIN ANALYZE SELECT * FROM vehicles WHERE marca = 'Ferrari';
```

---

## 📊 Monitoraggio Database

### In DataGrip:

**Vedi dimensione database:**
```sql
SELECT 
    pg_size_pretty(pg_database_size('concessionario_db')) as size;
```

**Vedi dimensione tabelle:**
```sql
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Vedi connessioni attive:**
```sql
SELECT count(*) FROM pg_stat_activity 
WHERE datname = 'concessionario_db';
```

**Performance query lente:**
```sql
SELECT 
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Nel Dashboard Provider:

- **Neon**: Dashboard → Monitoring
- **Supabase**: Reports → Database
- **Render**: Database → Metrics

---

## 💾 Backup e Restore

### Backup Manuale con DataGrip:

1. Click destro su database
2. **Dump with 'pg_dump'**
3. Scegli output file: `backup_YYYY-MM-DD.sql`
4. Format: **Plain** (SQL)
5. Click **OK**

### Restore:

1. Click destro su database
2. **Run SQL Script**
3. Seleziona file backup
4. Click **Execute**

### Backup Automatico:

Tutti i provider cloud (Neon, Supabase, Render) fanno backup automatici:
- **Neon**: Backup continuo, point-in-time recovery
- **Supabase**: Backup giornalieri
- **Render**: Backup giornalieri (retain 7 giorni su free tier)

---

## 📝 Comandi DataGrip Utili

### Keyboard Shortcuts:

- **Ctrl+Enter**: Esegui query
- **Ctrl+Alt+L**: Formatta SQL
- **Ctrl+Space**: Autocomplete
- **Ctrl+Q**: Quick documentation
- **Ctrl+B**: Go to declaration
- **Ctrl+F**: Find in console
- **F4**: Edit source (tabelle)
- **Alt+Insert**: Insert nuovo (row, query, etc)

### Context Actions:

- **Ctrl+T**: Refactor/Transform
- Right-click → **Transpose**: Ruota risultati
- Right-click → **Export**: Esporta risultati

---

## 🎯 Riepilogo Quick Start

### Setup Iniziale (una volta sola):

1. **Crea account** su Neon.tech (gratis)
2. **Crea progetto** e database `concessionario_db`
3. **Copia connection string**
4. **Configura DataGrip** con le credenziali
5. **Aggiorna .env** con credenziali cloud
6. **Aggiungi `DB_SSL=true`** in .env
7. **Esegui** `npm run db:init`
8. **Verifica** in DataGrip che tabelle siano create

### Uso Quotidiano:

1. **Apri DataGrip** e connettiti
2. **Avvia server**: `npm start`
3. **Usa applicazione** normalmente
4. **Query in DataGrip** per debug/analisi
5. **Backup periodici** (export da DataGrip)

---

## ✅ Checklist Finale

Prima di andare in produzione:

- [ ] Database cloud configurato e funzionante
- [ ] DataGrip connesso e testato
- [ ] File .env con credenziali cloud (NON committarlo!)
- [ ] SSL abilitato (`DB_SSL=true`)
- [ ] JWT_SECRET cambiato (non usare quello di default!)
- [ ] Password admin cambiata (non usare admin123!)
- [ ] Tabelle create e popolate
- [ ] Backup iniziale fatto
- [ ] Server si connette correttamente al DB cloud
- [ ] Applicazione web funziona end-to-end
- [ ] Test upload immagini, filtri, confronto

**🎉 Ora hai un database PostgreSQL professionale in cloud, gestibile con DataGrip!**

---

## 🆘 Supporto

- **Neon Docs**: https://neon.tech/docs
- **Supabase Docs**: https://supabase.com/docs
- **DataGrip Guide**: https://www.jetbrains.com/help/datagrip/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

Problemi? Controlla i log in `npm start` e verifica connessione in DataGrip prima.
