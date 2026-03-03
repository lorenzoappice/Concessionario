# 🚗 Setup Concessionario - Database PostgreSQL e JWT

## 📋 Panoramica Aggiornamenti

Il sito è stato aggiornato con:
- ✅ **Database PostgreSQL** (sostituisce JSON)
- ✅ **JWT Authentication** (token sicuri)
- ✅ **Sistema Ricerca e Filtri** avanzato
- ✅ **Confronto Veicoli** (fino a 3 contemporaneamente)

---

## 🔧 Prerequisiti

1. **Node.js** (v16 o superiore) - già installato
2. **PostgreSQL** (v12 o superiore)

---

## 📦 Installazione PostgreSQL

### Windows (Metodo consigliato):

1. **Scarica PostgreSQL**:
   - Vai su https://www.postgresql.org/download/windows/
   - Scarica il installer per Windows

2. **Installa PostgreSQL**:
   - Esegui l'installer
   - Durante l'installazione:
     - **Port**: 5432 (default)
     - **Password**: Imposta una password (es: `admin123`)
     - **Locale**: Italian, Italy
   - Installa anche pgAdmin (tool grafico)

3. **Verifica Installazione**:
   ```powershell
   psql --version
   ```

### Alternativa con Chocolatey:
```powershell
choco install postgresql
```

---

## ⚙️ Configurazione Database

### 1. Configura le Credenziali (.env)

Il file `.env` è già stato creato in `backend/.env`. **Devi modificarlo** con le tue credenziali:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TUA_PASSWORD_QUI    # ⚠️ MODIFICA QUESTA
DB_NAME=concessionario_db

# JWT Configuration
JWT_SECRET=cambia_questo_secret_in_produzione_12345   # ⚠️ MODIFICA IN PRODUZIONE
JWT_EXPIRES_in=24h

# Server Configuration
PORT=3000
```

**IMPORTANTE**: 
- Sostituisci `TUA_PASSWORD_QUI` con la password che hai impostato durante l'installazione di PostgreSQL
- In produzione, cambia `JWT_SECRET` con una stringa casuale sicura

### 2. Crea il Database

Apri **pgAdmin** o il terminale PostgreSQL:

```powershell
psql -U postgres
```

Poi esegui:
```sql
CREATE DATABASE concessionario_db;
```

Verifica:
```sql
\l
```
Dovresti vedere `concessionario_db` nella lista.

Esci con:
```sql
\q
```

### 3. Inizializza Database con Schema e Dati

Il progetto include uno script che:
- Crea le tabelle (vehicles, users, vehicle_images, vehicle_optionals)
- Crea l'utente admin con password hashata
- Migra i dati esistenti da db.json (se presente)

**Esegui lo script**:

```powershell
cd backend
npm run db:init
```

Output atteso:
```
Inizializzazione database...
✓ Schema creato
✓ Utente admin creato (username: admin, password: admin123)
Migrazione di 3 veicoli...
  ✓ Migrato: Ferrari F8 Tributo
  ✓ Migrato: Lamborghini Huracán EVO
  ✓ Migrato: Porsche 911 Carrera S

✅ Database inizializzato con successo!

Credenziali admin:
Username: admin
Password: admin123
```

---

## 🚀 Avvio del Sistema

### 1. Avvia il Server Backend

```powershell
cd backend
npm start
```

Output atteso:
```
🚀 Server in esecuzione su http://localhost:3000
📊 Database: PostgreSQL
🔐 JWT Authentication attivo
✓ Connesso al database PostgreSQL
```

### 2. Accedi al Sito

Apri il browser e vai su:
```
http://localhost:3000
```

---

## 🔐 Credenziali Admin

Dopo l'inizializzazione del database:

- **Username**: `admin`
- **Password**: `admin123`

**⚠️ IMPORTANTE**: Cambia queste credenziali in produzione!

Per cambiare la password admin, connettiti al database:
```sql
psql -U postgres -d concessionario_db
```

E aggiorna:
```sql
-- Prima installa bcryptjs per generare l'hash
-- Oppure usa lo script init.js modificato
UPDATE users SET password = 'nuovo_hash_bcrypt' WHERE username = 'admin';
```

---

## ✨ Nuove Funzionalità

### 1. **Sistema Filtri e Ricerca**

Nella homepage trovi:
- **Ricerca testuale**: Cerca per marca o modello
- **Filtri**:
  - Marca (dropdown automatico)
  - Range prezzo
  - Range anno
  - Range chilometri
  - Carburante
  - Cambio
- **Ordinamento**: Per prezzo, anno, km, data inserimento
- **Reset filtri**: Pulisce tutti i filtri

### 2. **Confronto Veicoli**

1. Seleziona checkbox "Confronta" su 2-3 veicoli
2. Appare barra fissa in basso
3. Clicca "Confronta" per vedere tabella comparativa completa
4. Mostra tutte le caratteristiche fianco a fianco

### 3. **JWT Authentication**

- Login genera token JWT valido 24h
- Token salvato in localStorage
- Tutte le operazioni admin richiedono token valido
- Token verificato automaticamente su pagina admin
- Logout pulisce token e reindirizza

---

## 🗄️ Struttura Database

### Tabelle:

1. **users**: Utenti admin con password hashate (bcrypt)
2. **vehicles**: Dati principali veicoli
3. **vehicle_images**: Immagini multiple per veicolo (relazione 1:N)
4. **vehicle_optionals**: Optional per veicolo (relazione 1:N)

### Indici:

Creati automaticamente su:
- `vehicles.marca`
- `vehicles.prezzo`
- `vehicles.anno`
- `vehicles.chilometri`

Per performance ottimali su ricerca/filtri.

---

## 🔄 Migrazione da JSON a PostgreSQL

Lo script `db/init.js` migra automaticamente:
- ✅ Tutti i veicoli da `db.json`
- ✅ Immagini multiple
- ✅ Optional
- ✅ Mantiene gli upload esistenti

**Il file db.json NON viene più utilizzato** dopo la migrazione.

---

## 🛠️ Comandi Utili

### Backend:
```powershell
npm start              # Avvia server
npm run db:init        # Inizializza/reinizializza database
```

### PostgreSQL:
```powershell
psql -U postgres                    # Connetti come postgres
psql -U postgres -d concessionario_db  # Connetti al database
```

### Query SQL Utili:
```sql
-- Vedi tutti i veicoli
SELECT * FROM vehicles;

-- Vedi tutti gli utenti
SELECT id, username, role FROM users;

-- Conta veicoli
SELECT COUNT(*) FROM vehicles;

-- Vedi veicolo con immagini
SELECT v.*, array_agg(vi.image_path) as immagini
FROM vehicles v
LEFT JOIN vehicle_images vi ON v.id = vi.vehicle_id
WHERE v.id = 1
GROUP BY v.id;

-- Reset database (ATTENZIONE: cancella tutto!)
DROP TABLE IF EXISTS vehicle_optionals CASCADE;
DROP TABLE IF EXISTS vehicle_images CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
-- Poi esegui: npm run db:init
```

---

## 🐛 Troubleshooting

### Errore: "password authentication failed"
- Verifica password in `.env`
- Controlla che PostgreSQL sia avviato
- Prova a riavviare servizio PostgreSQL

### Errore: "database does not exist"
- Crea database: `CREATE DATABASE concessionario_db;`
- Poi esegui: `npm run db:init`

### Errore: "ECONNREFUSED"
- Verifica che PostgreSQL sia in esecuzione
- Controlla porta in `.env` (default: 5432)
- Su Windows: Servizi → PostgreSQL deve essere "In esecuzione"

### Token JWT non valido
- Logout e rilogin
- Controlla che JWT_SECRET in `.env` non sia cambiato
- Verifica che il tempo di sistema sia corretto

### Immagini non visualizzate
- Le immagini esistenti in `/backend/uploads/` funzionano ancora
- Verifica path in database: `SELECT image_path FROM vehicle_images;`

---

## 📊 API Endpoints

### Pubblici:
- `GET /api/veicoli` - Lista veicoli (con filtri query)
- `GET /api/veicoli/:id` - Dettaglio singolo veicolo
- `POST /api/veicoli/confronta` - Confronta veicoli (body: {ids: [1,2,3]})
- `GET /api/veicoli/filtri/marche` - Lista marche disponibili
- `GET /api/veicoli/filtri/range-prezzi` - Range prezzi min/max
- `POST /api/login` - Login (body: {username, password})

### Protetti (richiedono JWT):
- `GET /api/verify` - Verifica token valido
- `POST /api/veicoli` - Aggiungi veicolo (header: Authorization: Bearer TOKEN)
- `DELETE /api/veicoli/:id` - Elimina veicolo (header: Authorization: Bearer TOKEN)

---

## 🎯 Prossimi Step Consigliati

1. **Backup Database**:
   ```powershell
   pg_dump -U postgres concessionario_db > backup.sql
   ```

2. **Cambia Credenziali Admin** in produzione

3. **Configura HTTPS** per produzione

4. **Aggiungi Validazione Email** per contatti

5. **Implementa Rate Limiting** su API

---

## 📝 Note Finali

- Il database è **relazionale** e **normalizzato**
- Supporta **transazioni ACID**
- Le **password sono hashate** con bcrypt (10 round)
- I **token JWT scadono** dopo 24h
- Le **immagini sono ancora locali** (considera cloud storage per produzione)

**Buon lavoro! 🚀**
