# 🚀 Quick Start: Database Cloud in 5 Minuti

Guida rapida per iniziare con **Neon.tech** (la soluzione più semplice e gratuita).

---

## ⏱️ Tempo Totale: ~5 minuti

---

## 📋 Step 1: Crea Account Neon (1 min)

1. Vai su https://neon.tech
2. Click **Sign Up**
3. Usa GitHub per login rapido (o email)
4. ✅ Account creato!

---

## 📦 Step 2: Crea Progetto Database (2 min)

1. Nel dashboard click **New Project**
2. Compila:
   - **Name**: `concessionario`
   - **PostgreSQL version**: `15` (o latest)
   - **Region**: `Europe (Frankfurt)` (più vicino a Italia)
3. Click **Create Project**

⏳ Attendi 30 secondi per provisioning...

4. Neon ti mostrerà la **Connection String**:

```
postgres://neondb_owner:AbCdEf123...@ep-cool-meadow-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**📋 COPIA e SALVA questa stringa!**

---

## 🗄️ Step 3: Crea Database (30 sec)

1. Nel dashboard Neon, vai nella tab **SQL Editor** (in alto)
2. Scrivi:
```sql
CREATE DATABASE concessionario_db;
```
3. Click **Run** (o Ctrl+Enter)
4. ✅ Database creato!

---

## ⚙️ Step 4: Configura Progetto (1 min)

### Opzione A: Copia tutto dalla Connection String

Dalla stringa tipo:
```
postgres://neondb_owner:AbCdEf123@ep-cool-123.eu-central-1.aws.neon.tech/neondb
```

Estrai le parti:
- **Host**: `ep-cool-123.eu-central-1.aws.neon.tech` (tutto dopo @ fino a /)
- **User**: `neondb_owner` (tutto dopo // fino a :)
- **Password**: `AbCdEf123` (tutto dopo : fino a @)

### Opzione B: Copia da Dashboard

1. Nel dashboard vai a **Connection Details**
2. Trovi tutti i parametri

### Aggiorna backend/.env:

```env
DB_HOST=ep-cool-meadow-123456.eu-central-1.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASSWORD=AbCdEf123GuHijK456
DB_NAME=concessionario_db
DB_SSL=true

JWT_SECRET=change_this_secret_xyz789
JWT_EXPIRES_IN=24h
PORT=3000
```

⚠️ **IMPORTANTE**: Sostituisci con le TUE credenziali vere!

---

## 🎨 Step 5: Configura DataGrip (1 min)

1. Apri **DataGrip**
2. Click **+** → **Data Source** → **PostgreSQL**
3. Compila con i dati dal tuo .env:
   - **Host**: (il tuo DB_HOST)
   - **Port**: `5432`
   - **Database**: `concessionario_db`
   - **User**: (il tuo DB_USER)
   - **Password**: (la tua DB_PASSWORD)
4. Vai alla tab **SSH/SSL**:
   - ✅ **Use SSL**
   - **SSL Mode**: `require`
5. Click **Download** per scaricare driver (se richiesto)
6. Click **Test Connection** → Dovresti vedere ✅ **Succeeded**
7. Click **OK** per salvare

---

## 🚀 Step 6: Inizializza Database

Nel terminale del progetto:

```powershell
cd backend
npm run db:init
```

Output atteso:
```
🔄 Inizializzazione database...
✅ Schema creato con successo
✅ Utente admin creato (username: admin, password: admin123)
📦 Migrazione dati da db.json...
  ✓ Migrato: Ferrari F8 Tributo
  ✓ Migrato: Lamborghini Huracán
  ...
🎉 Database inizializzato con successo!
```

---

## ✅ Step 7: Verifica Tutto Funzioni

### A. Verifica in DataGrip:

1. In DataGrip, click destro sulla connessione → **Refresh**
2. Espandi **Schemas** → **public** → **Tables**
3. Dovresti vedere:
   - ✅ users
   - ✅ vehicles
   - ✅ vehicle_images
   - ✅ vehicle_optionals

4. Doppio click su `vehicles` → Vedi i dati!

### B. Avvia Applicazione:

```powershell
npm start
```

Output:
```
🚀 Server in esecuzione su http://localhost:3000
📊 Database: PostgreSQL
🔐 JWT Authentication attivo
✓ Connesso al database PostgreSQL
```

### C. Testa nel Browser:

1. Apri http://localhost:3000
2. Dovresti vedere i veicoli ✅
3. Prova i filtri → Funzionano! ✅
4. Login admin (admin/admin123) → Funziona! ✅

---

## 🎉 FATTO!

Ora hai:
- ✅ Database PostgreSQL cloud (gratuito su Neon)
- ✅ DataGrip configurato e connesso
- ✅ Applicazione funzionante con database cloud
- ✅ JWT authentication attivo
- ✅ Filtri e ricerca funzionanti

---

## 🔍 Query Utili in DataGrip

Apri Query Console in DataGrip (Ctrl+Shift+L) e prova:

**Conta veicoli:**
```sql
SELECT COUNT(*) FROM vehicles;
```

**Vedi tutti i veicoli:**
```sql
SELECT marca, modello, anno, prezzo 
FROM vehicles 
ORDER BY prezzo DESC;
```

**Veicoli per marca:**
```sql
SELECT marca, COUNT(*) as totale
FROM vehicles
GROUP BY marca
ORDER BY totale DESC;
```

**Aggiungi veicolo di test:**
```sql
INSERT INTO vehicles (marca, modello, anno, prezzo, chilometri, potenza, cilindrata, carburante, cambio, colore, porte, posti, carrozzeria, trazione, descrizione)
VALUES ('Tesla', 'Model 3', 2024, 45000, 100, '350', '0', 'Elettrico', 'Automatico', 'Bianco', 4, 5, 'Berlina', 'Posteriore', 'Tesla Model 3 Performance')
RETURNING *;
```

---

## 🐛 Problemi?

### "Connection refused" / "Cannot connect"
- Verifica credenziali in .env (copia-incolla da Neon dashboard)
- Verifica `DB_SSL=true`
- Testa connessione in DataGrip prima

### "Database does not exist"
- In DataGrip esegui: `CREATE DATABASE concessionario_db;`
- Poi ri-esegui `npm run db:init`

### "SSL connection required"
- Aggiungi in .env: `DB_SSL=true`
- In DataGrip: SSH/SSL → Use SSL → require

### Vedi log dettagliati:
Nel terminale dove hai eseguito `npm start` vedrai tutti i log di connessione e query.

---

## 📚 Documentazione Completa

Per guide dettagliate vedi:
- **DATAGRIP.md** - Guida completa DataGrip + hosting
- **SETUP.md** - Setup completo progetto
- **.env.examples** - Esempi configurazione per tutti i provider

---

## 💡 Tips

1. **Backup**: In DataGrip → right click database → Dump with 'pg_dump'
2. **Diagrammi**: Seleziona tutte le tabelle → right click → Diagrams → Show Visualization
3. **Export dati**: Right click tabella → Export to CSV/JSON
4. **Monitoraggio**: Dashboard Neon → Monitoring tab

---

**🎊 Buon lavoro con il tuo database cloud!**
