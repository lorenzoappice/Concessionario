# Istruzioni per GitHub Copilot — Concessionario Grandolfo

## Panoramica Progetto

Sito web per un concessionario auto reale: **Pasquale Grandolfo Concessionario**, con sede in Via Porto Torres 95, Modugno (BA).

- **Stack**: Node.js + Express (backend), HTML/CSS/JS vanilla (frontend), PostgreSQL su **Neon** (cloud DB)
- **Hosting**: Railway (backend + frontend serviti dallo stesso server Express)
- **Auth**: JWT via `jsonwebtoken` + `bcrypt`
- **Upload immagini**: `multer` → cartella `backend/uploads/`

---

## Struttura del Progetto

```
Concessionario/
├── backend/
│   ├── server.js          ← Entry point, tutte le route API + auto-init DB
│   ├── db/
│   │   ├── config.js      ← Pool PostgreSQL (supporta DATABASE_URL o variabili singole)
│   │   └── init.js        ← Script manuale init DB (non usato in produzione)
│   ├── middleware/
│   │   └── auth.js        ← JWT: authenticateToken, isAdmin, generateToken
│   ├── schema.sql         ← Schema SQL di riferimento
│   ├── uploads/           ← Immagini caricate dagli admin
│   └── package.json
├── frontend/
│   ├── index.html         ← Home: lista veicoli + filtri + modal aggiungi
│   ├── dettaglio.html     ← Dettaglio singolo veicolo
│   ├── confronta.html     ← Confronto fino a 3 veicoli
│   ├── contatti.html      ← Info contatti + mappa Google
│   ├── login.html         ← Login admin
│   ├── admin.html         ← Pannello admin (aggiunta/eliminazione veicoli)
│   └── style.css          ← Unico file CSS per tutte le pagine
└── package.json           ← Root package (start: node backend/server.js)
```

---

## Database — Schema PostgreSQL (Neon)

```sql
-- Tabella principale veicoli
vehicles (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(50) NOT NULL,
  modello VARCHAR(100) NOT NULL,
  anno INTEGER NOT NULL,
  prezzo DECIMAL(10,2) NOT NULL,
  chilometri INTEGER NOT NULL,
  potenza VARCHAR(20),       -- es. "150" (CV)
  cilindrata VARCHAR(20),    -- es. "1998" (cc)
  carburante VARCHAR(30),    -- Benzina | Diesel | Elettrica | Ibrida | GPL | Metano
  cambio VARCHAR(30),        -- Manuale | Automatico | Automatico PDK | Sequenziale
  colore VARCHAR(30),
  porte INTEGER,
  posti INTEGER,
  carrozzeria VARCHAR(50),   -- Berlina | SUV | Coupé | Cabrio | Station Wagon | Monovolume | Sportiva
  trazione VARCHAR(30),      -- Anteriore | Posteriore | Integrale
  descrizione TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Immagini associate (più per veicolo, ordinate)
vehicle_images (
  id, vehicle_id → vehicles.id, image_path VARCHAR(255), image_order INTEGER
)

-- Optional (es. "Navigatore", "Cerchi in lega")
vehicle_optionals (
  id, vehicle_id → vehicles.id, optional_name VARCHAR(255)
)

-- Utenti admin
users (
  id, username VARCHAR(50) UNIQUE, password VARCHAR(255) [bcrypt], role VARCHAR(20)
)
```

**Query standard per veicolo completo** (con immagini e optional via subquery):
```sql
SELECT v.*,
  (SELECT array_agg(vi.image_path ORDER BY vi.image_order) FROM vehicle_images vi WHERE vi.vehicle_id = v.id) as immagini,
  (SELECT array_agg(DISTINCT vo.optional_name) FROM vehicle_optionals vo WHERE vo.vehicle_id = v.id) as optional
FROM vehicles v
WHERE v.id = $1
```

---

## API REST — Endpoints

| Metodo | Path | Auth | Descrizione |
|--------|------|------|-------------|
| GET | `/api/health` | No | Diagnostica connessione DB e variabili env |
| POST | `/api/login` | No | Login → restituisce JWT token |
| GET | `/api/verify` | JWT | Verifica validità token |
| GET | `/api/veicoli` | No | Lista veicoli con filtri query string |
| GET | `/api/veicoli/:id` | No | Dettaglio singolo veicolo |
| POST | `/api/veicoli` | Admin | Aggiunge veicolo (multipart/form-data con immagini) |
| PUT | `/api/veicoli/:id` | Admin | Modifica veicolo |
| DELETE | `/api/veicoli/:id` | Admin | Elimina veicolo (CASCADE su immagini/optional) |
| DELETE | `/api/veicoli/:id/immagine` | Admin | Elimina singola immagine |
| GET | `/api/veicoli/filtri/marche` | No | Lista marche distinte |
| GET | `/api/veicoli/filtri/range-prezzi` | No | Min/max prezzo |
| POST | `/api/veicoli/confronta` | No | Confronto multiplo (body: `{ids: [1,2,3]}`) |

**Filtri per GET `/api/veicoli`**:
`search`, `marca`, `prezzoMin`, `prezzoMax`, `annoMin`, `annoMax`, `kmMin`, `kmMax`, `carburante`, `cambio`, `orderBy` (id|prezzo|anno|chilometri|marca), `orderDir` (ASC|DESC)

---

## Autenticazione Frontend

Il token JWT viene salvato in `localStorage`:
```javascript
localStorage.setItem('authToken', token);
localStorage.setItem('userInfo', JSON.stringify(user));
```

Per le chiamate autenticate:
```javascript
const token = localStorage.getItem('authToken');
fetch('/api/veicoli', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Variabili d'Ambiente (Railway)

```
DB_HOST      = ep-xxx.eu-central-1.aws.neon.tech   (Neon pooler host)
DB_NAME      = neondb
DB_USER      = neondb_owner
DB_PASSWORD  = ***
DB_SSL       = true                                  (OBBLIGATORIO per Neon)
JWT_SECRET   = stringa_lunga_random
ADMIN_PASSWORD = admin123                            (password default admin)
PORT         = (Railway lo imposta automaticamente)
```

Alternativa: usare `DATABASE_URL` (connection string completa Neon).

---

## CSS — Design System

```css
:root {
  --primary-dark: #1a1a1a;
  --secondary-dark: #2d2d2d;
  --accent-gold: #c9a961;     /* colore accento principale */
  --text-light: #ffffff;
  --text-gray: #a0a0a0;
  --bg-light: #f5f5f5;
  --border-gray: #e0e0e0;
}
```

- **Font**: Helvetica Neue / Arial, font-weight leggero (200-300), uppercase con letter-spacing
- **Tema**: dark header (#1a1a1a), body chiaro, accenti dorati
- **Layout**: CSS Grid per card veicoli (`repeat(auto-fill, minmax(380px, 1fr))`), Flexbox per header/nav
- **Responsive**: breakpoint unico `@media (max-width: 768px)` — hamburger menu, 1 colonna
- **Stile card**: niente border-radius, bordi sottili, hover con elevazione + bordo gold

---

## Convenzioni Codice

- **Backend**: `async/await` ovunque, parametrizzazione `$1 $2...` per tutte le query SQL, transazioni con `BEGIN/COMMIT/ROLLBACK` per operazioni multi-step
- **Frontend**: JavaScript vanilla puro, niente framework. `fetch` per tutte le chiamate API. Path relativi (`/api/...`)
- **Immagini**: `image_path` salvato come `/uploads/nomefile.ext`. Il server serve la cartella `uploads/` come statica
- **Optional**: inviati come testo multiriga (un optional per riga), parsati con `.split('\n').map(trim).filter(Boolean)`
- **Errori**: il backend restituisce sempre `{ error: '...', detail: '...' }` su 4xx/5xx

---

## Pattern HTML Pagina

Ogni pagina HTML segue questo template:
```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Titolo - Pasquale Grandolfo Concessionario</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <div class="container">
      <a href="/" class="logo-link"><h1>Pasquale Grandolfo Concessionario</h1></a>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <nav id="main-nav">
        <a href="/">Home</a>
        <a href="/contatti">Contattaci</a>
        <a href="/login" class="btn-admin" id="auth-btn">Accesso Admin</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <!-- contenuto -->
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2026 Concessionario Auto di Pasquale Grandolfo. Tutti i diritti riservati.</p>
    </div>
  </footer>

  <script>
    // hamburger menu (obbligatorio in ogni pagina)
    document.getElementById('hamburger').addEventListener('click', function() {
      document.getElementById('main-nav').classList.toggle('open');
      this.classList.toggle('active');
    });
  </script>
</body>
</html>
```

---

## Route Express per Nuova Pagina

Quando aggiungi una nuova pagina HTML, aggiungi anche la route in `server.js`:
```javascript
app.get('/nuova-pagina', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/nuova-pagina.html'));
});
```

---

## Problemi Noti e Soluzioni

| Problema | Causa | Soluzione |
|----------|-------|-----------|
| HTTP 500 su `/api/veicoli` | DB non connesso | Verificare variabili env su Railway, `DB_SSL=true`, no `\n` nei valori |
| "Credenziali non valide" | Tabella `users` vuota | Il server auto-inizializza il DB al primo avvio; verificare i log Railway |
| `ENOTFOUND` su host Neon | `\n` copiato nel valore `DB_HOST` | `.trim()` applicato in `db/config.js`; ricopiare il valore |
| Login redirect non funziona | Token non in localStorage | Controllare la risposta `/api/login` e `data.token` |
