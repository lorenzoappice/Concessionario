---
mode: 'agent'
description: 'Implementa una feature completa end-to-end: DB + API + Frontend per il concessionario'
---

# Implementa Feature Completa

## Scopo
Questo prompt guida l'AI nell'implementazione di una feature completa che tocca tutti e tre i livelli: database, API backend e frontend.

## Descrivi la feature
[Scrivi qui cosa vuoi aggiungere — es. "Sistema di prenotazione test drive", "Sezione veicoli in evidenza", "Filtro per carrozzeria/trazione", "Galleria immagini con lightbox"]

---

## Workflow da seguire

### 1. Analisi impatto
Prima di scrivere codice, l'AI deve identificare:
- Quali tabelle DB sono coinvolte (o se serve una nuova tabella)
- Quali API esistenti usare / quali nuove creare
- Quali pagine HTML modificare / se serve una nuova pagina
- Se serve nuovo CSS o modificare quello esistente

### 2. Database
Se serve una nuova tabella:
```sql
-- Aggiungere in initDatabase() in server.js
CREATE TABLE IF NOT EXISTS nuova_tabella (
  id SERIAL PRIMARY KEY,
  -- ...
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_nuova_tabella_colonna ON nuova_tabella(colonna);
```
> La tabella va creata dentro `initDatabase()` in `server.js`, NON in un file separato.

### 3. Backend API
- Aggiungere le route in `server.js` nella sezione corretta
- Rispettare l'ordine: route specifiche PRIMA di route con parametri (`/:id`)
- Vedere `.github/prompts/nuova-route-api.prompt.md` per i pattern

### 4. Frontend
- Modificare/creare HTML in `frontend/`
- Aggiornare `style.css` in fondo con i nuovi stili
- Aggiungere la route `app.get('/nuova-pagina', ...)` in `server.js`
- Vedere `.github/prompts/nuova-pagina.prompt.md` per il template

---

## Vincoli del progetto da rispettare sempre

| Cosa | Regola |
|------|--------|
| Librerie JS | ❌ Niente React, Vue, jQuery — solo vanilla JS |
| CSS | ❌ Niente framework (Bootstrap ecc.) — solo `style.css` |
| Query SQL | ✅ Sempre parametrizzate (`$1`, `$2`...) |
| Immagini | ✅ Servite da `/uploads/` (multer) — effimere su Railway |
| Auth | ✅ JWT in `localStorage`, header `Authorization: Bearer TOKEN` |
| DB | ✅ Neon PostgreSQL via variabili env con `.trim()` |
| Responsive | ✅ Sempre aggiungere `@media (max-width: 768px)` per nuovi layout |
| Errori | ✅ Backend sempre `{ error: '...', detail: error.message }` |

---

## Esempi di feature già implementate (riferimento)

### Pattern filtri con query builder
Vedi `GET /api/veicoli` in `server.js` — costruisce la WHERE clause dinamicamente con `paramCount`.

### Pattern upload immagini
Vedi `POST /api/veicoli` — usa `upload.array('immagini', 10)`, salva in `/uploads/`, path nel DB.

### Pattern transazione multi-tabella
Vedi `POST /api/veicoli` — BEGIN/COMMIT/ROLLBACK con `getClient()`.

### Pattern modal admin su home
Vedi `index.html` — modal con `id="modal-aggiungi"`, toggle con `chiudiModal()`.

### Pattern confronto veicoli
Vedi `confronta.html` + `POST /api/veicoli/confronta` — IDs passati come array nel body.
