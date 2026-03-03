const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_this';

// Middleware per verificare JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: 'Token di autenticazione mancante' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token non valido o scaduto' });
        }
        
        req.user = user;
        next();
    });
};

// Middleware per verificare ruolo admin
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accesso negato: privilegi admin richiesti' });
    }
    next();
};

// Genera JWT token
const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    };
    
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

module.exports = {
    authenticateToken,
    isAdmin,
    generateToken
};
