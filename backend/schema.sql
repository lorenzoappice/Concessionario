-- Database Schema per Concessionario

-- Tabella Utenti (Admin)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Veicoli
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modello VARCHAR(100) NOT NULL,
    anno INTEGER NOT NULL,
    prezzo DECIMAL(10, 2) NOT NULL,
    chilometri INTEGER NOT NULL,
    potenza VARCHAR(20),
    cilindrata VARCHAR(20),
    carburante VARCHAR(30),
    cambio VARCHAR(30),
    colore VARCHAR(30),
    porte INTEGER,
    posti INTEGER,
    carrozzeria VARCHAR(50),
    trazione VARCHAR(30),
    descrizione TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Immagini Veicoli
CREATE TABLE IF NOT EXISTS vehicle_images (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    image_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Tabella Optional Veicoli
CREATE TABLE IF NOT EXISTS vehicle_optionals (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    optional_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_vehicles_marca ON vehicles(marca);
CREATE INDEX IF NOT EXISTS idx_vehicles_prezzo ON vehicles(prezzo);
CREATE INDEX IF NOT EXISTS idx_vehicles_anno ON vehicles(anno);
CREATE INDEX IF NOT EXISTS idx_vehicles_chilometri ON vehicles(chilometri);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON vehicle_images(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_optionals_vehicle_id ON vehicle_optionals(vehicle_id);
