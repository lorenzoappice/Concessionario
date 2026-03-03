# 🏎️ Sito Web Concessionario Auto di Lusso

Un'applicazione web completa per gestire un concessionario di auto di lusso con pannello amministrativo, **database PostgreSQL**, **JWT authentication**, **sistema di ricerca avanzato** e **confronto veicoli**.

## 📋 Caratteristiche Principali

- **Database PostgreSQL**: Database relazionale professionale (sostituisce JSON)
- **JWT Authentication**: Autenticazione sicura con token
- **Sistema Ricerca e Filtri**: Filtra per marca, prezzo, anno, km, carburante, cambio
- **Confronto Veicoli**: Confronta fino a 3 veicoli contemporaneamente
- **Homepage con Carousel**: Visualizza tutti i veicoli con carousel di immagini scorrevoli
- **Upload Immagini**: Sistema di caricamento multiplo di foto (fino a 10 per veicolo)
- **Pagina Dettaglio**: Informazioni complete con gallery fotografica
- **Pannello Admin**: Interfaccia completa per gestire i veicoli
- **Backend API REST**: Server Express con endpoint protetti e upload file

## ✨ Funzionalità Avanzate

### 🔐 JWT Authentication
- **Token Sicuri**: Autenticazione basata su JSON Web Token
- **Password Hashate**: Bcrypt con 10 round di hashing
- **Sessioni Persistenti**: Token validi 24 ore
- **Protezione Route**: Endpoint admin protetti da middleware
- **Auto-logout**: Token scaduti eliminati automaticamente

### 🔍 Sistema Ricerca e Filtri
- **Ricerca Testuale**: Cerca per marca o modello in tempo reale (con debounce)
- **Filtro Marca**: Dropdown con tutte le marche disponibili
- **Range Prezzo**: Imposta min/max per budget
- **Range Anno**: Filtra per anno di immatricolazione
- **Range Chilometri**: Cerca veicoli con km specifici
- **Carburante**: Benzina, Diesel, Elettrica, Ibrida, GPL, Metano
- **Cambio**: Manuale o Automatico
- **Ordinamento**: Per prezzo, anno, km (crescente/decrescente)
- **Reset Rapido**: Pulisci tutti i filtri con un click

### ⚖️ Confronto Veicoli
- **Selezione Multipla**: Checkbox su ogni veicolo
- **Fino a 3 Veicoli**: Confronta massimo 3 auto contemporaneamente
- **Barra Fissa**: Barra in basso sempre visibile con selezioni
- **Tabella Comparativa**: Vista affiancata di tutte le caratteristiche
- **Comparazione Completa**: Prezzo, specifiche, optional, descrizione
- **Azioni Rapide**: Link diretto ai dettagli da tabella confronto

### 🗄️ Database PostgreSQL
- **Tabelle Relazionali**: users, vehicles, vehicle_images, vehicle_optionals
- **Normalizzazione**: Struttura ottimizzata e normalizzata
- **Indici Performance**: Indici su marca, prezzo, anno, km
- **Transazioni ACID**: Operazioni atomiche garantite
- **Foreign Keys**: Integrità referenziale
- **Cascading Delete**: Eliminazione automatica dati correlati
- **Migrazione Automatica**: Script per migrare da JSON a PostgreSQL

### 📸 Sistema di Upload Immagini
- **Upload Multiplo**: Carica fino a 10 immagini per ogni veicolo
- **Preview in Tempo Reale**: Anteprima immediata delle foto selezionate
- **Validazione File**: Accetta solo immagini (JPEG, PNG, GIF, WEBP)
- **Limite Dimensioni**: Max 5MB per immagine
- **Gestione Automatica**: Le immagini vengono salvate nella cartella uploads
- **Ordine Preservato**: Ordine immagini mantenuto nel database

### 🎠 Carousel Interattivo Homepage
- **Scorrimento Immagini**: Frecce per navigare tra le foto di ogni veicolo
- **Indicatori**: Pallini per vedere quante foto ha ogni veicolo
- **Click su Pallini**: Vai direttamente a una foto specifica
- **Design Moderno**: Transizioni smooth e controlli eleganti

### 🖼️ Gallery Pagina Dettaglio
- **Immagine Principale**: Foto grande in alta qualità
- **Thumbnails**: Miniature cliccabili sotto l'immagine principale
- **Navigazione Facile**: Frecce per scorrere tra le immagini
- **Evidenziazione**: Thumbnail attiva sempre visibile

### Dettagli Veicoli Completi
Ogni veicolo include:
- **Informazioni Base**: Marca, modello, anno, prezzo, chilometri
- **Specifiche Tecniche**: Potenza (CV), cilindrata (cc), tipo di carrozzeria
- **Motorizzazione**: Tipo di carburante, cambio, trazione
- **Caratteristiche**: Colore, numero porte, numero posti
- **Descrizione Dettagliata**: Testo completo con dettagli sul veicolo
- **Optional e Accessori**: Lista completa degli extra inclusi
- **Gallery Fotografica**: Fino a 10 foto per veicolo

### Pannello Admin Completo
- **Upload Immagini**: Drag & drop o selezione multipla file
- **Preview Immediata**: Vedi le foto prima di caricarle
- **Form Completo**: Tutti i campi per specifiche dettagliate
- **Dropdown**: Selezioni predefinite per dati standardizzati
- **Contatore Immagini**: Visualizza quante foto ha ogni veicolo
- **Gestione Veicoli**: Visualizza, modifica ed elimina veicoli

## 🚀 Come Avviare l'Applicazione

### ⚠️ IMPORTANTE: Setup Database

Prima di avviare l'applicazione, **devi configurare PostgreSQL**. 

#### 📚 Guide Disponibili:

**🌐 Database Cloud (Consigliato - Gratuito):**
- 📖 [QUICK-START-CLOUD.md](QUICK-START-CLOUD.md) - **Inizia in 5 minuti** con Neon.tech
- 📖 [DATAGRIP.md](DATAGRIP.md) - Guida completa DataGrip + hosting gratuito (Neon, Supabase, Render)
- 📄 [.env.examples](backend/.env.examples) - Esempi configurazione per tutti i provider

**💻 Database Locale:**
- 📖 [SETUP.md](SETUP.md) - Installazione PostgreSQL locale o Docker

**Vantaggi Database Cloud:**
- ✅ Nessuna installazione locale
- ✅ Completamente gratuito (tier generoso)
- ✅ Backup automatici
- ✅ Accessibile ovunque
- ✅ Scalabile
- ✅ Gestibile con DataGrip

### Quick Start (dopo aver configurato PostgreSQL)

1. **Configura il file `.env`** in `backend/`:
   ```env
   DB_PASSWORD=tua_password_postgresql
   JWT_SECRET=tua_secret_key
   ```

2. **Inizializza il database**:
   ```bash
   cd backend
   npm run db:init
   ```

3. **Avvia il server**:
   ```bash
   npm start
   ```

4. **Apri il browser** e vai a:
   ```
   http://localhost:3000
   ```

5. **Login Admin**:
   - Username: `admin`
   - Password: `admin123`

## 🔐 Credenziali Admin

Per accedere al pannello amministratore:
- **Username**: `admin`
- **Password**: `admin123`

## 📁 Struttura del Progetto

```
concessionario/
├── backend/
│   ├── server.js              # Server Express con API REST protette
│   ├── db/
│   │   ├── config.js          # Configurazione PostgreSQL pool
│   │   ├── init.js            # Script inizializzazione database
│   ├── middleware/
│   │   └── auth.js            # JWT middleware authentication
│   ├── schema.sql             # Schema database PostgreSQL
│   ├── .env                   # Configurazione (DB + JWT secrets)
│   ├── package.json           # Dipendenze (pg, jwt, bcrypt, multer)
│   └── uploads/               # Cartella per immagini caricate
├── frontend/
│   ├── index.html             # Homepage con filtri e carousel
│   ├── dettaglio.html         # Pagina dettaglio con gallery
│   ├── confronta.html         # Pagina confronto veicoli
│   ├── login.html             # Login JWT
│   ├── admin.html             # Pannello admin protetto
│   └── style.css              # Stili monochrome luxury design
├── SETUP.md                   # Istruzioni setup PostgreSQL
└── README.md                  # Documentazione progetto
```

## 🛠️ Funzionalità

### Per gli Utenti
- ✅ **Filtri Avanzati**: Cerca per marca, prezzo, anno, km, carburante, cambio
- ✅ **Ricerca Real-time**: Trova veicoli mentre digiti
- ✅ **Confronto Multi-veicolo**: Confronta fino a 3 auto contemporaneamente
- ✅ **Carousel Interattivo**: Scorri tra più foto di ogni veicolo dalla homepage
- ✅ **Card Dinamiche**: Frecce e indicatori per navigare tra le immagini
- ✅ **Gallery Dettaglio**: Visualizza tutte le foto in alta qualità
- ✅ **Thumbnails**: Click sulle miniature per cambiare immagine
- ✅ **Specifiche Complete**: Potenza, cilindrata, carrozzeria e molto altro
- ✅ **Descrizione Dettagliata**: Testo completo sul veicolo
- ✅ **Lista Optional**: Tutti gli accessori e gli extra inclusi
- ✅ **Ordinamento**: Per prezzo, anno, km in ordine crescente/decrescente

### Per gli Amministratori
- ✅ **JWT Authentication**: Login sicuro con token
- ✅ **Password Hashate**: Bcrypt encryption
- ✅ **Sessioni Persistenti**: Token validi 24h
- ✅ **Upload Multiplo**: Carica fino a 10 immagini per veicolo
- ✅ **Preview Immagini**: Anteprima istantanea delle foto selezionate
- ✅ **Form Completo**: Tutti i campi per specifiche dettagliate
- ✅ **Dropdown Intelligenti**: Selezioni predefinite per dati standardizzati
- ✅ **Gestione Veicoli**: Visualizza ed elimina veicoli
- ✅ **Protezione Route**: Tutte le operazioni admin richiedono autenticazione
- ✅ **Auto-logout**: Token scaduti gestiti automaticamente

## 🔧 API Endpoints

### Pubblici (senza autenticazione):
- `GET /api/veicoli` - Lista veicoli con filtri query
  - Query params: `search`, `marca`, `prezzoMin`, `prezzoMax`, `annoMin`, `annoMax`, `kmMin`, `kmMax`, `carburante`, `cambio`, `orderBy`, `orderDir`
- `GET /api/veicoli/:id` - Dettaglio singolo veicolo
- `POST /api/veicoli/confronta` - Confronta veicoli (body: `{ids: [1,2,3]}`)
- `GET /api/veicoli/filtri/marche` - Lista marche disponibili
- `GET /api/veicoli/filtri/range-prezzi` - Range prezzi (min/max)
- `POST /api/login` - Login JWT (body: `{username, password}`)

### Protetti (richiedono JWT Authorization header):
- `GET /api/verify` - Verifica token valido
- `POST /api/veicoli` - Aggiungi veicolo (multipart/form-data con immagini)
- `DELETE /api/veicoli/:id` - Elimina veicolo

## 📊 Schema Database

### Tabelle PostgreSQL:

**users** - Utenti amministratori
- id (serial primary key)
- username (unique)
- password (bcrypt hash)
- role
- created_at

**vehicles** - Veicoli
- id (serial primary key)
- marca, modello, anno, prezzo, chilometri
- potenza, cilindrata, carburante, cambio
- colore, porte, posti, carrozzeria, trazione
- descrizione
- created_at, updated_at

**vehicle_images** - Immagini veicoli (1:N)
- id (serial primary key)
- vehicle_id (foreign key)
- image_path
- image_order
- created_at

**vehicle_optionals** - Optional veicoli (1:N)
- id (serial primary key)
- vehicle_id (foreign key)
- optional_name

## 💡 Note Tecniche

- **Database PostgreSQL**: Relazionale, normalizzato, con indici su campi ricercabili
- **JWT Authentication**: Token sicuri con scadenza 24h, password bcrypt
- **Transaction Support**: Operazioni atomiche per inserimenti complessi
- **Upload File**: Immagini salvate in `/backend/uploads/`
- **Sicurezza**: Validazione tipo file e dimensione (max 5MB), middleware auth
- **Formati Supportati**: JPEG, JPG, PNG, GIF, WEBP
- **Filtri Query**: Supporto WHERE dinamico con parametri preparati
- **Responsive**: Design luxury monochrome, ottimizzato per tutti i dispositivi
- **Carousel**: JavaScript vanilla con transizioni smooth
- **Environment Variables**: Configurazione sicura via .env

## 🎨 Tecnologie Utilizzate

### Frontend:
- HTML5, CSS3, JavaScript (Vanilla - no framework)
- Fetch API per chiamate REST
- LocalStorage per JWT token
- CSS Variables per theming

### Backend:
- Node.js v16+
- Express.js v4.18
- PostgreSQL v12+ (con pool di connessioni)
- Multer v1.4 (upload file)
- JWT (jsonwebtoken v9.0)
- Bcrypt v6.0 (password hashing)
- dotenv (environment configuration)

### Database:
- PostgreSQL relazionale
- Foreign keys con cascade delete
- Indici su marca, prezzo, anno, km
- Transazioni ACID

## 📝 Licenza

© 2026 Concessionario Auto di Pasquale Grandolfo. Tutti i diritti riservati.
