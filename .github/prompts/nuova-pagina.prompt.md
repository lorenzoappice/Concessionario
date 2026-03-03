---
mode: 'edit'
description: 'Crea una nuova pagina HTML per il sito concessionario rispettando il design system esistente'
---

# Crea Nuova Pagina Frontend

## Obiettivo
Aggiungi una nuova pagina HTML al sito Concessionario Grandolfo, rispettando strettamente il design system e le convenzioni del progetto.

## Informazioni necessarie
- **Nome pagina**: [es. preferiti, usato-garantito, finanziamento]
- **Scopo della pagina**: [descrivi cosa deve mostrare/fare]
- **Richiede autenticazione admin?**: [sì/no]
- **Ha bisogno di chiamate API?**: [elenca le API necessarie]

## Checklist obbligatoria

### File HTML (`frontend/[nome].html`)
- [ ] `<meta name="viewport">` presente
- [ ] `<link rel="stylesheet" href="style.css">` presente
- [ ] Header con `logo-link`, hamburger button (`id="hamburger"`), `nav id="main-nav"`
- [ ] Footer con copyright 2026
- [ ] Script hamburger alla fine del body
- [ ] Link "active" sul nav corrispondente alla pagina corrente
- [ ] Titolo pagina: `[Nome] - Pasquale Grandolfo Concessionario`

### Route Express (`backend/server.js`)
- [ ] Aggiunta route `app.get('/nome-pagina', ...)` nella sezione "SERVE PAGINE HTML"

### CSS (`frontend/style.css`)
- [ ] Usare esclusivamente le variabili CSS esistenti (`--primary-dark`, `--accent-gold`, ecc.)
- [ ] Aggiungere regola `@media (max-width: 768px)` per ogni nuovo componente con layout a griglia/flex
- [ ] Niente `border-radius` sulle card (stile piatto)
- [ ] Hover su card: `translateY(-8px)` + `border-color: var(--accent-gold)`

## Template di partenza

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Titolo] - Pasquale Grandolfo Concessionario</title>
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
    <!-- CONTENUTO QUI -->
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2026 Concessionario Auto di Pasquale Grandolfo. Tutti i diritti riservati.</p>
    </div>
  </footer>

  <script>
    document.getElementById('hamburger').addEventListener('click', function() {
      document.getElementById('main-nav').classList.toggle('open');
      this.classList.toggle('active');
    });
    document.querySelectorAll('#main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        document.getElementById('main-nav').classList.remove('open');
        document.getElementById('hamburger').classList.remove('active');
      });
    });
  </script>
</body>
</html>
```

## File da modificare
- `frontend/[nome].html` — crea il file
- `backend/server.js` — aggiungi la route nella sezione "SERVE PAGINE HTML"
- `frontend/style.css` — aggiungi i nuovi stili in fondo, prima dell'ultimo `@media`
