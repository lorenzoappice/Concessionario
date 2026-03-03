---
mode: 'ask'
description: 'Diagnostica e risolve problemi nel sito concessionario (errori HTTP, DB, auth, deploy)'
---

# Debug Concessionario Grandolfo

## Procedura di diagnosi

### Passo 1 — Verifica health endpoint
Visita `https://[sito-railway].railway.app/api/health` e controlla:
- `db.connected` deve essere `true`
- `env.DB_SSL` deve essere `"true"` (stringa, non booleano)
- `env.DB_HOST` non deve contenere `\n` alla fine
- Tutte le variabili env devono mostrare `✓ impostato`

### Passo 2 — Controlla i log Railway
Su Railway → il tuo progetto → Deployments → View Logs. Cerca:
- `✅ Database inizializzato correttamente` — conferma che le tabelle esistono
- `❌ Errore inizializzazione database` — problema di connessione
- `ENOTFOUND` — host Neon non raggiungibile (controllare `DB_HOST`)
- `SSL SYSCALL EOF` — `DB_SSL` non impostato a `true`

---

## Errori Comuni e Soluzioni

### HTTP 500 su `/api/veicoli`
**Cause probabili** (in ordine di frequenza):
1. `DB_SSL` non impostato o impostato a `false` → impostare `DB_SSL=true` su Railway
2. `DB_HOST` ha `\n` invisibile alla fine → ricopiare il valore su Railway
3. Il DB Neon è in pausa (piano free) → accedere a Neon Console e riattivarlo
4. Le tabelle non esistono ancora → il server le crea all'avvio, fare un redeploy

**Verifica veloce**: vai su `/api/health` e leggi il campo `error`.

---

### "Credenziali non valide" al login
1. La tabella `users` è vuota → fare un redeploy per triggerare `initDatabase()`
2. Stai usando le credenziali sbagliate → default: `admin` / `admin123` (o il valore di `ADMIN_PASSWORD`)
3. `JWT_SECRET` cambiato dopo login → i vecchi token sono invalidati, rifare il login

---

### Immagini non visibili dopo upload
- Il path salvato nel DB deve essere `/uploads/filename.ext`
- Il server serve la cartella `uploads/` come statica: `app.use('/uploads', express.static(UPLOAD_DIR))`
- Su Railway la cartella `uploads/` è **effimera**: le immagini si perdono al redeploy → considera un bucket cloud (es. Cloudinary, S3)

---

### Token scaduto / loop di redirect
- I token durano 24h (configurabile con `JWT_EXPIRES_IN`)
- Il frontend controlla il token con `/api/verify` — se 401/403 → redirect a `/login`
- Controllare che `JWT_SECRET` in Railway sia lo stesso usato per generare il token

---

### Errore CORS
- Il backend ha `app.use(cors())` senza restrizioni — se compare errore CORS in produzione, il frontend non sta chiamando path relativi (`/api/...`) ma URL assoluti con dominio sbagliato
- Il frontend deve sempre usare path relativi: `/api/veicoli` non `https://...`

---

## Checklist pre-deploy

- [ ] `DB_HOST` copiato da Neon senza `\n` finale
- [ ] `DB_SSL=true` (stringa "true")
- [ ] `JWT_SECRET` impostato (stringa lunga, diversa da "default_secret")
- [ ] `ADMIN_PASSWORD` impostato (o default `admin123`)
- [ ] `package.json` root ha `"start": "node backend/server.js"`
- [ ] `node_modules` NON pushato su git (`.gitignore` corretto)
- [ ] Tutti i `fetch` nel frontend usano path relativi `/api/...`

---

## Comandi utili in locale

```bash
# Avvio server locale
node backend/server.js

# Test connessione DB
curl http://localhost:3000/api/health

# Test login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test lista veicoli
curl http://localhost:3000/api/veicoli
```
