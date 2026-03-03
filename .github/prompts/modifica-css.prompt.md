---
mode: 'edit'
description: 'Aggiunge o migliora stili CSS nel design system del concessionario'
---

# Modifica CSS — Design System Concessionario

## Design System di riferimento

### Variabili CSS (usare SEMPRE queste, mai colori hardcoded)
```css
--primary-dark: #1a1a1a;    /* sfondo header, testi principali */
--secondary-dark: #2d2d2d;  /* sfondo nav mobile aperta */
--accent-gold: #c9a961;     /* accenti, bordi hover, prezzi */
--text-light: #ffffff;      /* testo su sfondo scuro */
--text-gray: #a0a0a0;       /* testi secondari, placeholder */
--bg-light: #f5f5f5;        /* sfondo corpo pagina, badge */
--border-gray: #e0e0e0;     /* bordi card, separatori */
```

### Tipografia
- Font: `'Helvetica Neue', Arial, sans-serif`
- Titoli: `font-weight: 200-300`, `letter-spacing: 2-3px`, `text-transform: uppercase`
- Body: `font-weight: 400`, `line-height: 1.6`
- Badge/label: `font-size: 0.8rem`, `letter-spacing: 0.5px`, `text-transform: uppercase`

### Card standard
```css
.mia-card {
  background: var(--text-light);
  border: 1px solid var(--border-gray);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  /* NO border-radius */
}
.mia-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-gold);
}
```

### Bottoni
```css
/* Bottone primario */
.btn-primary {
  background: var(--primary-dark);
  color: var(--text-light);
  border: 1px solid var(--primary-dark);
  padding: 0.8rem 2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background: var(--accent-gold);
  border-color: var(--accent-gold);
  color: var(--primary-dark);
}

/* Bottone outline gold (admin) */
.btn-admin {
  background: transparent;
  color: var(--accent-gold);
  border: 1px solid var(--accent-gold);
}
```

### Sezione con titolo decorativo
```css
.section-title {
  font-size: 2rem;
  font-weight: 200;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 1rem;
}
.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 1px;
  background: var(--accent-gold);
}
```

---

## Responsive obbligatorio

**Ogni nuovo layout con grid o flex deve avere la sua media query:**

```css
/* Desktop */
.mio-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Mobile — da aggiungere SEMPRE nel blocco @media esistente a 768px */
@media (max-width: 768px) {
  .mio-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

---

## Dove aggiungere il nuovo CSS

1. Aggiungere stili specifici della nuova pagina/componente **in fondo a `style.css`**
2. Aggiungere le media query nel blocco `@media (max-width: 768px)` **più vicino** al componente, non in quello generale dell'header
3. Non duplicare selettori già esistenti — estendere con specificità maggiore se necessario

---

## Anti-pattern da evitare
- ❌ `border-radius` sulle card (stile piatto)
- ❌ Colori hardcoded tipo `#c9a961` — usa `var(--accent-gold)`
- ❌ `!important` salvo override di librerie terze
- ❌ Stili inline nell'HTML (salvo `display:none` per elementi nascosti via JS)
- ❌ Font-weight 700+ sui titoli principali (usa 200-300)
